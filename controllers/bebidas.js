//require('dotenv').config()
require('dotenv').config({path:require('find-config')('.env')})
const fs = require('fs')
const {ethers} = require('ethers')
const contract=require('../artifacts/contracts/Bebida.sol/Bebida.json')


const {
    PRIVATE_KEY='6a449060eb69003b6e940c0aa6714b581f07ffa9df4f49573f53ce2895f58f6a', 
    API_URL='https://eth-sepolia.g.alchemy.com/v2/PWckOZRBD26XHsnbRLSA2D6QQdrZYFgB',
    PUBLIC_KEY='0x6ae01F86Bf271ED5b30Ec3B11bD9d02972712cC3',
    BEBIDA_CONTRACT='0x99459B049501302719B554208500687A72418CB8'
} = process.env

//este tambien es igual siempre, el consoloe log en la linea 22 esta de mas
async function createTransaction(provider, method, param){
    const etherInterface = new ethers.utils.Interface(contract.abi)
    const nonce = await provider.getTransactionCount(PUBLIC_KEY, 'latest')
    const gasPrice = await provider.getGasPrice();
    const network = await provider.getNetwork();
    const {chainId} = network;
    console.log(`Ejecutando transaccion: ${param}`)
    const transaction = {
        from: PUBLIC_KEY,
        to: BEBIDA_CONTRACT,
        nonce,
        chainId,
        gasPrice,
        data: etherInterface.encodeFunctionData(method, param),
    }
    return transaction
}
 
async function createBebida(_nombreBebida,_sabor,_precio){
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log(_nombreBebida,_sabor,_precio)
    const transaction = await createTransaction(provider,"insertBebida",[_nombreBebida,_sabor,_precio])//antes insertUser ahora insert
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
 
async function getBebidas(){
    const provider = new ethers.providers.JsonRpcProvider(API_URL)
    const bebidaContract = new ethers.Contract(
        BEBIDA_CONTRACT,
        contract.abi,
        provider
    )
    const result = await bebidaContract.getBebidas();
    var bebidas = []
    result.forEach(elemento => {
        bebidas.push(formatBebidas(elemento))
    })
    return bebidas;
}
 
async function getBebida(bebidaId){
    const provider = new ethers.providers.JsonRpcProvider(API_URL)
    const bebidaContract = new ethers.Contract(
        BEBIDA_CONTRACT,
        contract.abi,
        provider
    )
    const result = await bebidaContract.getBebidaById(bebidaId);//mismo del User.sol
    return formatBebidas(result)
}
 

 
function formatBebidas(info){
    return {
        bebidaId:ethers.BigNumber.from(info[0]).toNumber(),
        nombreBebida:info[1],
        sabor:info[2],
        precio: ethers.BigNumber.from(info[3]).toNumber()
    }
}
 
module.exports = {
    getBebidas: getBebidas,
    getBebdia: getBebida,
    createBebida : createBebida,
}