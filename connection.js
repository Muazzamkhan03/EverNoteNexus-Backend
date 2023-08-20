const mongoose = require('mongoose');

const mongoURI = 'mongodb://127.0.0.1:27017';

const connectDb = async () => {
    const m = await mongoose.connect(mongoURI);
    if(m){
        console.log('Connected to db server');
    }
}

module.exports = connectDb;