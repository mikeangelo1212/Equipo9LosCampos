// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RegistroGatos {
    using Counters for Counters.Counter;
    Counters.Counter private _gatosId;
    struct GatoStruct {
        int gatoId;
        string nombreGato;
        string colorGato;
        string sexo;
        string edad;
    }

    // Mapeo para almacenar los gatos por ID
    mapping(uint => GatoStruct) public gatos;

    // Función para agregar un nuevo gato
    function agregarGato(int _gatoId, string memory _nombreGato, string memory _colorGato, string memory _sexo, string memory _edad) public onlyOwner()
    returns(uint256){
        _gatoId.increment();
        uint256 newGatoId = _gatoId.current();
        RegistroGatos memory newGato = RegistroGatos(_gatoId, _nombreGato, _colorGato, _sexo, _edad);
        gatos[newGatoId] = newGato;
        return newGatoId;
        //Se guarda
    }

    //Retorno de todos los gatos Yippie
    function obtenerDetallosGatos() public view returns(RegistroGatos[] memory) {
    RegistroGatos[] memory gatoArray = new RegistroGatos[](_gatoId.current());
       for(uint i = 0; i<_gatoId.current(); i++){
           RegistroGatos storage gato = gatos[i+1];
           gatoArray[i] = gato;
        }
        return gatoArray;
    }

    //Retorno por ID
    function obtenerDetallesGatoId(uint _id)  public view returns(User memory){
        return RegistroGatos[_id];
    }
}