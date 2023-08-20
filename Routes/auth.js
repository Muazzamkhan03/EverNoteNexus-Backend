const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    res.json('Hit api endpoint for auth');
})

module.exports = router;