// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >= 0.8.0 < 0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Users is Ownable {
    //counters sirve para poder iterar el objeto parece
    using Counters for Counters.Counter;
    //la variable incrementable = llave privada
    Counters.Counter private _userIds;
    //atributos de nuestra clase
    struct User {
        string firstName;
        string lastName;
        uint256 amountSpent;
        uint256 userId; 
    }
    //esto no se pa que sea pero parece como lista de usuarios o algo por el estilo 
    //o tambien parece como una copia del estado actual de los contratos
    mapping(uint256 => User) public users;

    //metodo que insera usuario incrementando la id del objeto, lo demas entra
    //por input del usuario
    function insertUser(string memory firstName, string memory lastName) public onlyOwner()
    returns(uint256) {
        _userIds.increment();
        uint256 newUserId = _userIds.current();
        User memory newUser = User(firstName, lastName, 0, newUserId);
        users[newUserId] = newUser;
        return newUserId;
    }

    //get que consigue todos los usuarios registrados
    function getUsers() public view returns( User[] memory) {
        User[] memory usersArray = new User[](_userIds.current());
        for(uint i = 0; i<_userIds.current(); i++){
            User storage user = users[i+1];
            usersArray[i] = user;
        }
        return usersArray;
    }

    //funcion que consigue un solo usuario
    function getUserById(uint256 userId) public view returns(User memory){
        return users[userId];
    }

    //add
    function registrarSale(uint256 userId, uint256 amount) public onlyOwner{
        users[userId].amountSpent += amount;
    }
}