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

    uint256 public contadorBebidas;

    function agregarBebida(_nombreBebida, _sabor, _precio) public onlyOwner()
    returns(uint256) {
        _bebidasIds.increment();
        uint256 newBebidaId = _bebidasIds.current();
        Bebida memory newBebida = Bebida(bebidaId, nombreBebida, sabor, precio, newBebidaId); //(_nombreBebida, _sabor, _precio); puede ser este
        bebidas[newBebidaId] = newBebida;
        return newBebidaId;
    }

    // Función para obtener los detalles de todas las bebidas
    function obtenerDetallesBebida(uint256 _id) public view returns (uint256, string memory, string memory, uint256) {
        BebidaStruct memory bebidasArray = new Bebida[](_bebidasIds.current());
        return (bebida.bebidaId, bebida.nombreBebida, bebida.sabor, bebida.precio);
        for(uint i = 0; i<_bebidasIds.current(); i++){
            Bebida storage bebidas = users[i+1];
            bebidasArray[i] = bebidas;
        }
        return bebidasArray;
    }

     //Para una sola bebida por ID
    function getBebidaById(uint256 bebidaId) public view returns(User memory){
        return bebidas[bebidaId];
    }
}