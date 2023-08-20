const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('users',UserSchema);
// User.createIndexes(); // Not a good practise, as this creates an index in our db. Handling the duplicate emails would be done in the controller of the endpoint
module.exports = User;