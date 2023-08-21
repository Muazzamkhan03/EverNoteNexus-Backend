const express = require('express');
const Note = require('../Models/Note');
const fetchUser = require('../MiddleWare/fetchUser');

const router = express.Router();

// ROUTE 1: Default endpoint. No login required
router.get('/',(req,res)=>{
    res.json('Hit api endpoint for notes');
})

// ROUTE 2:  Endpoint for fetching all notes using GET /api/notes/fetch-notes. Login required
router.get('/fetch-notes', fetchUser, async (req,res)=>{
    const notes = await Note.fetch({user: req.user.id});
    res.json(notes);
});

module.exports = router;