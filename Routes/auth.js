const express = require('express');
const User = require('../Models/User');

const router = express.Router();

router.get('/',(req,res)=>{
    res.json('Hit api endpoint for auth');
})

router.post('/add-user', (req,res)=>{
    const user = User(req.body);
    user.save();
    res.json(req.body);
})

module.exports = router;