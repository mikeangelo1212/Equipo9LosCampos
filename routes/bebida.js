const express = require('express');
const router = express.Router();
const bebidaController = require('../controllers/bebidas');

//busca a los usuarios
router.get('/bebidas',async (req,res)=>{
    try{
        let bebidas = await bebidaController.getBebidas()
        res.json(bebidas);
    }catch(ex){
        res.status(500).json({ message: ex.message });
    }
});
router.get('/bebida/:id',async (req,res)=>{
    try{
        let bebida = await bebidaController.getBebdia(req.params.id)
        res.json(bebida);
    }catch(ex){
        res.status(500).json({ message: ex.message });
    }
});
//crea el usuario
router.post('/bebida',async (req,res)=>{
    try{
       let bebida = await bebidaController.createBebida(req.body.nombreBebida,req.body.sabor,req.body.precio)
        res.json(bebida);
    }catch(ex){
        res.status(500).json({ message: ex.message });
    }
});

module.exports = router;