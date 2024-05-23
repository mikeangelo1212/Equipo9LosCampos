const express = require('express');
const router = express.Router();
const gatoController = require('../controllers/gatos');

//busca a los usuarios
router.get('/gatos',async (req,res)=>{
    try{
        let gatos = await gatoController.getGatos()
        res.json(gatos);
    }catch(ex){
        res.status(500).json({ message: ex.message });
    }
});
//get gatos by id
router.get('/gato/:id',async (req,res)=>{
    try{
        let gato = await gatoController.getGato(req.params.id)
        res.json(gato);
    }catch(ex){
        res.status(500).json({ message: ex.message });
    }
});
//crea el usuario
router.post('/gato',async (req,res)=>{
    try{
       let gato = await gatoController.createGato(req.body.nombre,req.body.color,req.body.sexo,req.body.edad)
        res.json(gato);
    }catch(ex){
        res.status(500).json({ message: ex.message });
    }
});


module.exports = router;