require('dotenv').config({path:require('find-config')('.env')})
const fs = require('fs')
const Formdata = require('form-data')
const axios = require('axios')
const {ethers} = require('ethers')

const contract = require('../artifacts/contracts/NFTContract.sol/NFTClase.json')
const {
    PRIVATE_KEY='6a449060eb69003b6e940c0aa6714b581f07ffa9df4f49573f53ce2895f58f6a',
    API_URL='https://eth-sepolia.g.alchemy.com/v2/PWckOZRBD26XHsnbRLSA2D6QQdrZYFgB',
    PUBLIC_KEY='0x6ae01F86Bf271ED5b30Ec3B11bD9d02972712cC3', 
    PINATA_API__KEY='aa12bfcb8a0c0ebc3701',
    PINATA_SECRET_KEY='f8ef630c2069868b42bafcfd6cd0c2e4526af0dcdfd25c38f83115009d7e1f49',
    CONTRACT_ADDRESS='0xBFdBf055218028e0Ae244A5C80D0b5251483BfF5'
} = process.env

async function createImgInfo(imageRoute){
    const autoResponse = await axios.get("https://api.pinata.cloud/data/testAuthentication", {
        headers:{
            pinata_api_key:"aa12bfcb8a0c0ebc3701",
            pinata_secret_api_key:"f8ef630c2069868b42bafcfd6cd0c2e4526af0dcdfd25c38f83115009d7e1f49"
        }
    })
    console.log(autoResponse)
    //return
    const stream = fs.createReadStream(imageRoute);
    const data = new FormData()
    data.append("file",stream)
    const fileResponse = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS",data, {
        headers:{
            "Content-type":`multipart/form-data: boundary=${data._boundary}`,
            pinata_api_key:"aa12bfcb8a0c0ebc3701",
            pinata_secret_api_key:"f8ef630c2069868b42bafcfd6cd0c2e4526af0dcdfd25c38f83115009d7e1f49"
        }
    })
    const {data : fileData={}}=fileResponse;
    const {IpfsHash}=fileData;
    const fileIPFS = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;
    return fileIPFS
}

async function createJsonInfo(metadata){
    const pinataJSONbody = {
        pinataContent:metadata
    }
    const jsonResponse = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        pinataJSONbody,
        {
            headers: {
                "Content-Type": "application/json",
                pinata_api_key: "aa12bfcb8a0c0ebc3701",
                pinata_secret_api_key: "f8ef630c2069868b42bafcfd6cd0c2e4526af0dcdfd25c38f83115009d7e1f49"
            }
        }
    )
    const { data : jsonData = {}} =jsonResponse;
    const { IpfsHash } =jsonData;
    const tokenURI = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`
    return tokenURI;
}

async function mintNFT(tokenURI){
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY,provider);
    const etherInterface = new ethers.utils.Interface(contract.abi);
    const nonce = await provider.getTransactionCount(PUBLIC_KEY,'latest');
    const gasPrice = await provider.getGasPrice();
    const network = await provider.getNetwork();
    const {chainid} = network;
    const transaction = {
        from : PUBLIC_KEY,
        to: CONTRACT_ADDRESS,
        nonce,
        chainid,
        gasPrice,
        data:etherInterface.encodeFunctionData("mintNFT",{PUBLIC_KEY,tokenURI})
    }

    const estimateGas = await provider.estimateGas(transaction);
    transaction("gasLimit") = estimateGas;
    const singedTx = await wallet.signTransaction(transaction);
    const transactionReceipt = await provider.sendTransaction(singedTx);
    const hash = transactionReceipt.hash;
    console.log("Transaction hash: ", hash)

    const receipt = await provider.getTransactionReceipt(hash);
    const {logs} =receipt;
    const tokenBigNumber= ethers.BigNumber.from(logs[0],topics[3]);
    const tokenId = tokenBigNumber.toNumber()
    console.log("NFT TOKEN ID",tokenId);
    return hash
}

async function createNFT(info){
    var imgInfo = await createImgInfo(info.imageRoute);
    const metadata = {
        image:imgInfo,
        name:imgInfo,
        description:info.description,
        attributes:[
            {'trait_type':'color','value':'brown'},
            {'trait_type':'background','value':'white'}
        ]
    }
    var tokenUri = await createJsonInfo(metadata)
    var nftResult = await mintNFT(tokenUri)
    return nftResult;
}

module.exports = {
    createNFT:createNFT
}