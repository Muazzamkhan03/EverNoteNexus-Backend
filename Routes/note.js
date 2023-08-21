const express = require('express');
const router = express.Router();

// ROUTE 1: Default endpoint. No login required
router.get('/',(req,res)=>{
    res.json('Hit api endpoint for notes');
})

// ROUTE 2:  Endpoint for fetching all notes using GET /api/notes/fetch-notes. Login required
router.get('/fetch-notes', (req,res)=>{

});

module.exports = router;