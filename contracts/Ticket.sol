// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Importar los contratos de gato y bebida
// import "./RegistroGatos.sol";
// import "./Bebida.sol";

contract ContratoTicket is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _ticketsId;
    struct TicketStruct {
        uint256 ticketId;
        uint256 claveGato;
        string[] bebidas;
        uint256[] preciosBebidas;
    }
    // Mapeo para almacenar los tickets por su ID
    mapping(uint256 => TicketStruct) public tickets;

    // // Referencia a los contratos
    // Gato public contratoGato;
    // Bebida public contratoBebida;

    // // Constructor para establecer las referencias a los contratos de gato y bebida
    // constructor(address _contratoGato, address _contratoBebida) {
    //     contratoGato = Gato(_contratoGato);
    //     contratoBebida = Bebida(_contratoBebida);
    // }

    // Función para agregar un nuevo ticket
    function insertTicker(uint256 gatoId,string[] memory items, uint256[] memory precios)
    public onlyOwner returns(uint256) {
        _ticketsId.increment();
        uint256 newTicketId = _ticketsId.current();
        TicketStruct memory newTicket= TicketStruct(newTicketId,gatoId,items,precios);
        tickets[newTicketId]=newTicket;
        return newTicketId;
    }
    // function agregarTicket(uint256 _claveGato, uint256[] memory __bebidaId) public 
    // onlyOwner returns(uint256){
    //     _ticketId.increment();
    //     uint256 newTicketId = _ticketsId.current();
    //     TicketStruct memory newTicket = SalesStruct(newTicketId,ticketId,bebidaId,precio);
    //     tickets[newTicketId]=newTicket;
    //     return newTicketId;
    //     }

    //     // Guardar el nuevo ticket en el mapeo
    //     tickets[contadorTickets] = TicketStruct(_ticketId, _claveGato, _bebidaId, precio);
    //     emit NuevoTicketAgregado(_ticketId, _claveGato, _bebidaId, precio);
    // }

    function calcularTotalVenta(uint256 _idTicket) public view returns (uint256) {
        TicketStruct memory ticket = tickets[_idTicket];
        uint256 total = 0;
        for (uint i = 0; i < ticket.preciosBebidas.length; i++) {
            total += ticket.preciosBebidas[i];
        }
        return total;
    }

    //Por ID del ticket
    function obtenerDetallesTicketID(uint256 _idTicket)public view returns (TicketStruct memory){
        return tickets[_idTicket];
    }

    //Por gato
        function obtenerDetallesGatoID(uint256 gatoId) public view returns(TicketStruct[] memory){
        TicketStruct[] memory ticketArray = new TicketStruct[](_ticketsId.current());
        for(uint i = 0; i < _ticketsId.current(); i++) {
            TicketStruct storage ticket = tickets[i+1];
            if(ticket.claveGato == gatoId){
                ticketArray[i]=ticket;
            }
        }
        return ticketArray;
    }

    //Todas las ventas
    function obtenerTodasLasVentas() public view returns (TicketStruct[] memory) {
    TicketStruct[] memory ticketArray = new TicketStruct[](_ticketsId.current());
        for(uint i = 0; i < _ticketsId.current(); i++) {
            TicketStruct storage ticket = tickets[i+1];
            ticketArray[i]=ticket;
        }
        return ticketArray;
    }
}