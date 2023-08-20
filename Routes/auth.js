const express = require('express');
const User = require('../Models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const router = express.Router();

// Default endpoint
router.get('/', (req, res) => {
    res.json('Hit api endpoint for auth');
})

// Endpoint for adding a new user 
router.post('/add-user', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 8 characters long').isLength({ min: 8 })
],
    async (req, res) => {
        // Checks for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Checks for existing emails  
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ errors: [{ error: "Email already in use" }] });
            }
            const salt = await bcrypt.genSalt(10);
            const pwdHash = await bcrypt.hash(req.body.password,salt);

            // Creates a new user
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: pwdHash
            });
            return res.json(user);
        }
        catch (error) {
            console.log("Error: ", error);
            res.status(500).send("Internal server error occured");
        }
    });

module.exports = router;