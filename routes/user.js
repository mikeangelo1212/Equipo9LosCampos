const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

//busca a los usuarios
router.get('/users',async (req,res)=>{
    try{
        let users = await userController.getUsers()
        res.json(users);
    }catch(ex){
        res.status(500).json({ message: ex.message });
    }
});
router.get('/user/:id',async (req,res)=>{
    try{
        let user = await userController.getUser(req.params.id)
        res.json(user);
    }catch(ex){
        res.status(500).json({ message: ex.message });
    }
});
//crea el usuario
router.post('/user',async (req,res)=>{
    try{
       let user = await userController.createUser(req.body.firstname,req.body.lastname)
        res.json(user);
    }catch(ex){
        res.status(500).json({ message: ex.message });
    }
});

//monto de la cuenta??
router.put('/user',async (req,res)=>{
    try{
        console.log(req.body)
       let user = await userController.updateAmount(req.body.id,req.body.amount)
        res.json(user);
    }catch(ex){
        res.status(500).json({ message: ex.message });
    }
});

module.exports = router;