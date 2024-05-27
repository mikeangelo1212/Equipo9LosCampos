//require('dotenv').config()
require('dotenv').config({path:require('find-config')('.env')})
const fs = require('fs')
const {ethers} = require('ethers')
const contract=require('../artifacts/contracts/Ticket.sol/ContratoTicket.json')


const {
    PRIVATE_KEY='6a449060eb69003b6e940c0aa6714b581f07ffa9df4f49573f53ce2895f58f6a', 
    API_URL='https://eth-sepolia.g.alchemy.com/v2/PWckOZRBD26XHsnbRLSA2D6QQdrZYFgB',
    PUBLIC_KEY='0x6ae01F86Bf271ED5b30Ec3B11bD9d02972712cC3',
    TICKET_CONTRACT='0x1A36400EEd91499478c2b7254724955b4f387165'
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
        to: TICKET_CONTRACT,
        nonce,
        chainId,
        gasPrice,
        data: etherInterface.encodeFunctionData(method, param),
    }
    return transaction
}
 
async function insertTicket(gatoId,items,precios){
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log(gatoId,items,precios)
    const transaction = await createTransaction(provider,"insertTicket",[gatoId,items,precios])//antes insertUser ahora insert
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

//get de todo
async function getTickets(){
    const provider = new ethers.providers.JsonRpcProvider(API_URL)
    const ticketContract = new ethers.Contract(
        TICKET_CONTRACT,
        contract.abi,
        provider
    )
    const result = await ticketContract.obtenerTodasLasVentas();
    var tickets = []
    result.forEach(elemento => {
        tickets.push(formatTicket(elemento))
    })
    return tickets;
}

//get de un ticket
async function getTicket(bebidaId){
    const provider = new ethers.providers.JsonRpcProvider(API_URL)
    const ticketContract = new ethers.Contract(
        TICKET_CONTRACT,
        contract.abi,
        provider
    )
    const result = await ticketContract.obtenerDetallesTicketID(bebidaId);//mismo del User.sol
    return formatTicket(result)
}
//get total de ventas por ticketId
async function getTotalVentas(ticketId){
    const provider = new ethers.providers.JsonRpcProvider(API_URL)
    const ticketContract = new ethers.Contract(
        TICKET_CONTRACT,
        contract.abi,
        provider
    )
    const result = await ticketContract.calcularTotalVenta(ticketId);
    return {valorDeTicket:ethers.BigNumber.from(result).toNumber()}
}

//get by gatoId
async function getTicketByGato(gatoId){
    const provider = new ethers.providers.JsonRpcProvider(API_URL)
    const ticketContract = new ethers.Contract(
        TICKET_CONTRACT,
        contract.abi,
        provider
    )
    const result = await ticketContract.obtenerDetallesGatoID(gatoId);
    var tickets = []
    result.forEach(elemento => {
        tickets.push(formatTicket(elemento))
    })
    return tickets;
}

 

 
function formatTicket(info){
    let ticket = {
        ticketId : ethers.BigNumber.from(info[0]).toNumber(),
        claveGato : ethers.BigNumber.from(info[1]).toNumber(),
    }
    let items = []
    info[2].forEach((element,index)=>{
        let item = {name:element,price: ethers.BigNumber.from(info[3][index]).toNumber()}
        items.push(item)
    })
    ticket.item = items
    return ticket;
}
 
module.exports = {
    getTicket:getTicket,
    getTickets:getTickets,
    getTotalVentas:getTotalVentas,
    getTicketByGato:getTicketByGato,
    insertTicket : insertTicket,
}