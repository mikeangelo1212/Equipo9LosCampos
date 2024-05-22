//require('dotenv').config()
require('dotenv').config({path:require('find-config')('.env')})
const fs = require('fs')
const {ethers} = require('ethers')
const contract=require('../artifacts/contracts/RegistroGatos.sol/Gato.json')


const {
    PRIVATE_KEY='6a449060eb69003b6e940c0aa6714b581f07ffa9df4f49573f53ce2895f58f6a', 
    API_URL='https://eth-sepolia.g.alchemy.com/v2/PWckOZRBD26XHsnbRLSA2D6QQdrZYFgB',
    PUBLIC_KEY='0x6ae01F86Bf271ED5b30Ec3B11bD9d02972712cC3',
    GATO_CONTRACT='0xC6Dc2AC8b733B1975CB4ecC142683BD82A542A5c'
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
        to: GATO_CONTRACT,
        nonce,
        chainId,
        gasPrice,
        data: etherInterface.encodeFunctionData(method, param),
    }
    return transaction
}
 
async function createGato(nombre,color,sexo,edad){
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log(nombre,color,sexo,edad)
    const transaction = await createTransaction(provider,"agregarGato",[nombre,color,sexo,edad])//antes insertUser ahora insert
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
 
async function getGatos(){
    const provider = new ethers.providers.JsonRpcProvider(API_URL)
    const gatoContract = new ethers.Contract(
        GATO_CONTRACT,
        contract.abi,
        provider
    )
    const result = await gatoContract.getGatos();
    var gatos = []
    result.forEach(elemento => {
        gatos.push(formatGato(elemento))
    })
    return gatos;
}
 
async function getGato(userId){
    const provider = new ethers.providers.JsonRpcProvider(API_URL)
    const gatoContract = new ethers.Contract(
        GATO_CONTRACT,
        contract.abi,
        provider
    )
    const result = await gatoContract.getGatoById(userId);//mismo del User.sol
    return formatGato(result)
}
 

 
function formatGato(info){
    return {
        gatoId:ethers.BigNumber.from(info[0]).toNumber(),
        nombreGato:info[1],
        colorGato:info[2],
        sexo: info[3],
        edad:info[4]
    }
}
 
module.exports = {
    getGatos: getGatos,
    getGato: getGato,
    createGato : createGato,
}