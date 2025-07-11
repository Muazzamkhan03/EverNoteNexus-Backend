const express = require('express');
const User = require('../Models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../MiddleWare/fetchUser');

const router = express.Router();

// ROUTE 1: Default endpoint. No login required
router.get('/', (req, res) => {
    res.json('Endpoint for auth');
})

// ROUTE 2:  Endpoint for adding a new user using POST /api/auth/add-user. No login required
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
            const pwdHash = await bcrypt.hash(req.body.password, salt);

            // Creates a new user
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: pwdHash
            });

            const data = {
                user: {
                    id: user.id
                }
            };
            const authToken = jwt.sign(data, process.env.JWT_SECRET);
            return res.json({ authToken });
        }
        catch (error) {
            console.log("Error: ", error);
            res.status(500).send("Internal server error occured");
        }
    });


// ROUTE 3:  Endpoint for authentication of a user using POST /api/auth/login. No login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
],
    async (req, res) => {
        // Checks for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {email, password} = req.body;

        try {
            // Checking existence of user
            let user = await User.findOne({email}); // Writing object like this is equivalent to writing {email: email}
            if(!user){
                return res.status(400).json({ errors: [{ error: "Incorrect credentials" }] });
            }
            
            // Matching password with the stored password hash 
            const passMatch = await bcrypt.compare(password, user.password);
            if(!passMatch){
                return res.status(400).json({ success: false, errors: [{ error: "Incorrect credentials" }] });
            }

            // Signing the data to be returned and then sending the token to the client
            const data = {
                user: {
                    id: user.id
                }
            };
            const authToken = jwt.sign(data, process.env.JWT_SECRET);
            return res.json({ success: true, authToken: authToken });

        } catch (error) {
            console.log("Error: ", error);
            res.status(500).send("Internal server error occured");
        }

    });
        

// ROUTE 4:  Endpoint for getting logged in user info using POST /api/auth/get-user. Login required
router.post('/get-user', fetchUser, async (req, res) => {
    try{
        // The user.id is getting added by the fetchUser middleware, by decoding the jw token 
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password'); //select('-password') would ensure that the password doesn't get returned in the object
        res.send(user);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).send("Internal server error occured");
    }

});

        
module.exports = router;