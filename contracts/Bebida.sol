// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Bebida is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _bebidasIds;
    struct BebidaStruct {
        uint256 bebidaId;
        string nombreBebida;
        string sabor;
        uint256 precio;
    }

    // Mapeo para almacenar las bebidas por su ID
    mapping(uint256 => BebidaStruct) public bebidas;

    //uint256 public contadorBebidas;

    function insertBebida(string memory _nombreBebida, string memory _sabor, uint256 _precio) public onlyOwner()
    returns(uint256) {
        _bebidasIds.increment();
        uint256 newBebidaId = _bebidasIds.current();
        BebidaStruct memory newBebida = BebidaStruct(newBebidaId, _nombreBebida, _sabor, _precio); //(_nombreBebida, _sabor, _precio); puede ser este
        bebidas[newBebidaId] = newBebida;
        return newBebidaId;
    }

    // Función para obtener los detalles de todas las bebidas
    function getBebidas() public view returns (BebidaStruct[] memory) {
        BebidaStruct[] memory bebidasArray = new BebidaStruct[](_bebidasIds.current());
        for(uint i = 0; i<_bebidasIds.current(); i++){
            BebidaStruct storage bebida = bebidas[i+1];
            bebidasArray[i] = bebida;
        }
        return bebidasArray;
        
        // BebidaStruct memory bebidasArray = new Bebida[](_bebidasIds.current());
        // return (bebida.bebidaId, bebida.nombreBebida, bebida.sabor, bebida.precio);
        // for(uint i = 0; i<_bebidasIds.current(); i++){
        //     Bebida storage bebidas = users[i+1];
        //     bebidasArray[i] = bebidas;
        // }
        // return bebidasArray;
    }

     //Para una sola bebida por ID
    function getBebidaById(uint256 bebidaId) public view returns(BebidaStruct memory){
        return bebidas[bebidaId];
    }
}