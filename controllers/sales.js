require('dotenv').config({path:require('find-config')('.env')})
const fs = require('fs')
const Formdata = require('form-data')
const axios = require('axios')
const {ethers} = require('ethers')

const contract = require('../artifacts/contracts/Sales.sol/Sales.json')
const { create } = require('domain')
const {
    PRIVATE_KEY='6a449060eb69003b6e940c0aa6714b581f07ffa9df4f49573f53ce2895f58f6a',
    API_URL='https://eth-sepolia.g.alchemy.com/v2/PWckOZRBD26XHsnbRLSA2D6QQdrZYFgB',
    PUBLIC_KEY='0x6ae01F86Bf271ED5b30Ec3B11bD9d02972712cC3',
    SALES_CONTRACT='0x56DaBa5180265F7b8143e7211Fd93151E7989C79',
} = process.env

async function createTransaction(provider,method,params) {
    //const provider = new ethers.providerss.JsonRpcProvider(API_URL);
    //const wallet = new ethers.Wallet(PRIVATE_KEY,provider);
    //const waller?????
    const etherInterface = new ethers.utils.Interface(contract.abi);
    const nonce = await provider.getTransactionCount(PUBLIC_KEY,'latest');
    const gasPrice = await provider.getGasPrice();
    const network = await provider.getNetwork();
    const {chainid} = network;
    const transaction = {
        from : PUBLIC_KEY||0x6ae01F86Bf271ED5b30Ec3B11bD9d02972712cC3,
        to: SALES_CONTRACT||0x56DaBa5180265F7b8143e7211Fd93151E7989C79,
        nonce,
        chainid,
        gasPrice,
        data:etherInterface.encodeFunctionData(method, params)
    }
    return transaction
}

async function createSale(userId, items,prices) {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY,provider);
    const transaction = await createTransaction(provider,"insertSale",[userId,items,prices])
    const estimateGas = await provider.estimateGas(transaction)
    transaction["gasLimit"] = estimateGas;
    const singedTx = await wallet.signTransaction(transaction);
    const transactionReceipt = await provider.sendTransaction(singedTx)
    await transactionReceipt.wait();
    const hash = transactionReceipt.hash;
    console.log("Transaction Hash", hash)
    const receipt = await provider.getTransactionReceipt(hash)
    return receipt
}

async function getSales() {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const salesContract = new ethers.Contract(
        SALES_CONTRACT,
        contract.abi,
        provider
    )

    const result = await salesContract.getSales()
    var sales = []
    result.forEach((element => {
        sales.push(formatSale(element))
    }))
}

async function getSale(saleId) {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const salesContract = new ethers.Contract(
        SALES_CONTRACT,
        contract.abi,
        provider
    )

    const result = await salesContract.getSaleById(saleId)
    return formatSale(result)
}

async function getSalesByUserId(userId){
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const salesContract = new ethers.Contract(
        SALES_CONTRACT,
        contract.abi,
        provider
    )

    const result = await salesContract.getSalesByUserId(userId)
    var sales = []
    result.forEach((element)=> {
        sales.push(formatSale(element))
    })
}

function formatSale(info) {
    let sale = {
        saleId : ethers.BigNumber.from(info[0]).toNumber(),
        userId : ethers.BigNumber.from(info[1]).toNumber(),
    }
    let items = []
    info[2].forEach((element,index)=>{
        let item = {name:element,price: ethers.BigNumber.from(info[3][index]).toNumber()}
        items.push(item)
    })
    sale.item = items
    return sale;
}

module.exports = {
    getSale:getSale,
    getSales:getSales,
    createSale:createSale,
    getSalesByUserId:getSalesByUserId
}