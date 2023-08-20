const express = require('express');
const User = require('../Models/User');
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.get('/', (req, res) => {
    res.json('Hit api endpoint for auth');
})

router.post('/add-user', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 8 characters long').isLength({ min: 8 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const user = User(req.body);
    user.save();
    return res.json(user);
});

module.exports = router;