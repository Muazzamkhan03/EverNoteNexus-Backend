const express = require('express');
const Note = require('../Models/Note');
const { body, validationResult } = require('express-validator');
const fetchUser = require('../MiddleWare/fetchUser');

const router = express.Router();

// ROUTE 1: Default endpoint. No login required
router.get('/', (req, res) => {
    res.json('Hit api endpoint for notes');
})

// ROUTE 2:  Endpoint for fetching all notes using GET /api/notes/fetch-notes. Login required
router.get('/fetch-notes', fetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).send("Internal server error occured");
    }
});

// ROUTE 3:  Endpoint for adding a new note using POST /api/notes/add-note. Login required
router.post('/add-note', fetchUser, [
    body('title', 'Title cannot be blank').exists(),
    body('description', 'Description cannot be blank').exists()
],
    async (req, res) => {
        // Checks for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Destructuring the request body to get individual elements
        const { title, description, tag } = req.body;

        try {
            // Creating a new note
            let note = new Note({
                user: req.user.id,
                title,
                description,
                tag
            });
            // Saving the note, and sending saved note as the response
            note = await note.save();
            res.json(note);

        } catch (error) {
            console.log("Error: ", error);
            res.status(500).send("Internal server error occured");
        }

    });

// ROUTE 4:  Endpoint for updating an existing note using PUT /api/notes/update-note/:id. Login required
router.put('/update-note/:id', fetchUser, async (req, res) => {
    try {
        //Creating a new note object, that would update the existing note
        const newNote = {};
        if (req.body.title) { newNote.title = req.body.title }
        if (req.body.description) { newNote.description = req.body.description }
        if (req.body.tag) { newNote.tag = req.body.tag }

        // Checking if the note with the passed id exists 
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        // Checking if the user id in the note, matches with the user id extracted from the fetchUser middleware 
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Updating the note
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);

    } catch (error) {
        console.log("Error: ", error);
        res.status(500).send("Internal server error occured");
    }

});

// ROUTE 5:  Endpoint for deleting a note using DELETE /api/notes/delete-note/:id. Login required
router.delete('/delete-note/:id', fetchUser, async (req, res) => {
    try {
        // Checking if the note with the passed id exists 
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        // Checking if the user id in the note, matches with the user id extracted from the fetchUser middleware 
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Deleting the note
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({"Success": "Note has been deleted", note: note});

    } catch (error) {
        console.log("Error: ", error);
        res.status(500).send("Internal server error occured");
    }

});

module.exports = router;