//require('dotenv').config()
require('dotenv').config({path:require('find-config')('.env')})
const fs = require('fs')
const {ethers} = require('ethers')
const contract=require('../artifacts/contracts/User.sol/Users.json')


const {
    PRIVATE_KEY='6a449060eb69003b6e940c0aa6714b581f07ffa9df4f49573f53ce2895f58f6a', 
    API_URL='https://eth-sepolia.g.alchemy.com/v2/PWckOZRBD26XHsnbRLSA2D6QQdrZYFgB',
    PUBLIC_KEY='0x6ae01F86Bf271ED5b30Ec3B11bD9d02972712cC3',
    USER_CONTRACT='0x370862C25E8E88eAd1Ac1210FB9Da856a1351e0B'
} = process.env


async function createTransaction(provider, method, param){
    const etherInterface = new ethers.utils.Interface(contract.abi)
    const nonce = await provider.getTransactionCount(PUBLIC_KEY, 'latest')
    const gasPrice = await provider.getGasPrice();
    const network = await provider.getNetwork();
    const {chainId} = network;
    console.log(param)
    const transaction = {
        from: PUBLIC_KEY,
        to: USER_CONTRACT,
        nonce,
        chainId,
        gasPrice,
        data: etherInterface.encodeFunctionData(method, param),
    }
    return transaction
}
 
async function createUser(firstname, lastname){
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log(firstname,lastname)
    const transaction = await createTransaction(provider,"insert",[firstname,lastname])//antes insertUser ahora insert
    const estimateGas = await provider.estimateGas(transaction);
    transaction["gasLimit"] = estimateGas;
    const singedTx = await wallet.signTransaction(transaction);
    const transactionReceipt = await provider.sendTransaction(singedTx)
    await transactionReceipt.wait()
    const hash = transactionReceipt.hash;
    console.log("Transaction Hash",hash)
    const receipt = await provider.getTransactionReceipt(hash)
    return receipt;
}
 
async function getUsers(){
    const provider = new ethers.providers.JsonRpcProvider(API_URL)
    const userContract = new ethers.Contract(
        USER_CONTRACT,
        contract.abi,
        provider
    )
    const result = await userContract.getUsers();//mismo del User.sol
    var users = []
    result.forEach(elemento => {
        users.push(formatUser(elemento))
    })
    return users;
}
 
async function getUser(userId){
    const provider = new ethers.providers.JsonRpcProvider(API_URL)
    const userContract = new ethers.Contract(
        USER_CONTRACT,
        contract.abi,
        provider
    )
    const result = await userContract.getUsersById(userId);//mismo del User.sol
    return formatUser(result)
}
 
async function updateAmount(userId,amount){
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const transaction = await createTransaction(provider,"registerSale",[userId,amount])
    const estimateGas = await provider.estimateGas(transaction);
    transaction["gasLimit"] = estimateGas;
    const singedTx = await wallet.signTransaction(transaction);
    const transactionReceipt = await provider.sendTransaction(singedTx)
    await transactionReceipt.wait()
    const hash = transactionReceipt.hash;
    console.log("Transaction hash",hash)
    const receipt = await provider.getTransactionReceipt(hash)
    return receipt;
}
 
function formatUser(info){
    return {
        firstName:info[0],
        lastName:info[1],
        amount:ethers.BigNumber.from(info[2]).toNumber(),
        id: ethers.BigNumber.from(info[3]).toNumber()
    }
}
 
module.exports = {
    getUser: getUser,
    getUsers: getUsers,
    createUser : createUser,
    updateAmount : updateAmount
}