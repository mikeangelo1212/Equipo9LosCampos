const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/tickets');

//busca a los usuarios
router.get('/tickets',async (req,res)=>{
    try{
        let tickets = await ticketController.getTickets()
        res.json(tickets);
    }catch(ex){
        res.status(500).json({ message: ex.message });
    }
});
router.get('/ticket/:id',async (req,res)=>{
    try{
        let ticket = await ticketController.getTicket(req.params.id)
        res.json(ticket);
    }catch(ex){
        res.status(500).json({ message: ex.message });
    }
});

router.get('/ticket/valor/:id',async (req,res)=>{
    try{
        let ticket = await ticketController.getTotalVentas(req.params.id)
        res.json(ticket);
    }catch(ex){
        res.status(500).json({ message: ex.message });
    }
});

//get tickets por el gatito
router.get('/ticket/gato/:id',async (req,res)=>{
    try{
        let ticket = await ticketController.getTicketByGato(req.params.id)
        res.json(ticket);
    }catch(ex){
        res.status(500).json({ message: ex.message });
    }
});

//crea el usuario
router.post('/ticket',async (req,res)=>{
    try{
       let ticket = await ticketController.insertTicket(req.body.gatoId,req.body.items,req.body.precios)
        res.json(ticket);
    }catch(ex){
        res.status(500).json({ message: ex.message });
    }
});


module.exports = router;