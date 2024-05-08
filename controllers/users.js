//require('dotenv').config()
require('dotenv').config({path:require('find-config')('.env')})
const fs = require('fs')


async function createtTransaction(provider,method,params){
    const etherInterface = new ethers.utils.Interface(contract.abi);
    const nonce = await provider.getTransactionCount(PUBLIC_KEY,'latest');
    const gasPrice = await provider.getGasPrice();
    const network = await provider.getNetwork();
    const {chainid} = network;
    const transaction = {
        from : PUBLIC_KEY,
        to: USER_CONTRACT,
        nonce,
        chainid,
        gasPrice,
        data:etherInterface.encodeFunctionData("mintNFT",{method,params})
    }
}

async function createUser(firstName,lastName){
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY,provider);
    const transaction = await createtTransaction(provider,"insert user",[firstName,lastName])
    const estimateGas = await provider.estimateGas(transaction)
    transaction("gasLimit")=estimateGas;
    const singedTx = await wallet.signTransaction(transaction);
    const transactionReceipt = await provider.sendTransaction(singedTx)
    await transactionReceipt.wait();
    const hash = transactionReceipt.hash;
    console.log("Transaction hash",hash)
    const receipt = await provider.getTransactionReceipt(hash)
    return receipt
}

async function getUsers(userId){
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const userContract = new ethers.Contract(
        USER_CONTRACT,
        contract.abi,
        provider
    )
    const result = await userContract.getUsers(userId)
    return formatUser(result);
}

async function updateAmount(userId,amount){
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY,provider);
    const transaction = await createtTransaction(provider,"register Sale",[userId,amount])
    const estimateGas = await provider.estimateGas(transaction)
    transaction("gasLimit")=estimateGas;
    const singedTx = await wallet.signTransaction(transaction);
    const transactionReceipt = await provider.sendTransaction(singedTx)
    await transactionReceipt.wait();
    const hash = transactionReceipt.hash;
    console.log("Transaction hash",hash)
    const receipt = await provider.getTransactionReceipt(hash)
    return receipt
}


function fomatUser(info){
    return {
        firstName:info[0],
        lastName:info[1],
        amount:ethers.BigNumber.from(info[2]).toNumber(),
        id:ethers.BigNumber.from(info[3]).toNumber()
    }
}

module.exports = {
    getUser:getUser,
    getUsers:getUsers,
    createUser:createUser,
    updateAmount:updateAmount
}
