
const fs = require("fs");
const {ethers} = require('hardhat')
async function main(){

<<<<<<< HEAD
    const Users = await ethers.getContractFactory('ContratoTicket');
=======
    const Users = await ethers.getContractFactory('Bebida');
>>>>>>> f3d51ea71ede2825b9a0128efa87a9bd1c562c2a
    const users = await Users.deploy();
    const txHash = users.deployTransaction.hash;
    const txReceipt=await ethers.provider.waitForTransaction(txHash);
    console.log("Contract deployed to Address:", txReceipt.contractAddress); 
}

main()
.then(() => {process.exit(0)})
.catch((error)=>{
    console.log(error), process.exit(1)
})