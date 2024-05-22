// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Gato is Ownable{
    using Counters for Counters.Counter;
    Counters.Counter private _gatoId;
    struct GatoStruct {
        uint256 gatoId;
        string nombreGato;
        string colorGato;
        string sexo;
        string edad;
    }

    // Mapeo para almacenar los gatos por ID
    mapping(uint256 => GatoStruct) public gatos;

    //uint256 public contadorBebidas;


    // Función para agregar un nuevo gato
    function agregarGato(string memory _nombreGato, string memory _colorGato, string memory _sexo, string memory _edad) public onlyOwner()
    returns(uint256){
        _gatoId.increment();
        uint256 newGatoId = _gatoId.current();
        GatoStruct memory newGato = GatoStruct(newGatoId, _nombreGato, _colorGato, _sexo, _edad);
        gatos[newGatoId] = newGato;
        return newGatoId;
        //Se guarda
    }

    //Retorno de todos los gatos Yippie
    function getGatos() public view returns(GatoStruct[] memory) {
    GatoStruct[] memory gatoArray = new GatoStruct[](_gatoId.current());
       for(uint i = 0; i<_gatoId.current(); i++){
           GatoStruct storage gato = gatos[i+1];
           gatoArray[i] = gato;
        }
        return gatoArray;
    }

    //Retorno por ID
    function getGatoById(uint256 _id)  public view returns(GatoStruct memory){
        return gatos[_id];
    }
}