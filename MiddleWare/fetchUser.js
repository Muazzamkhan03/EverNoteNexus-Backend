const jwt = require('jsonwebtoken');

const fetchUser = (req, res, next) => {
    // Retrieve the id from the jw token and append the id to the request
    const token = req.header('auth-token'); //The token will be sent via the header
    if(!token){
        return res.status(401).send({error: "Invalid authentication token"});
    }

    try{
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next();
    }catch{
        return res.status(401).send({error: "Invalid authentication token"});
    }
}

module.exports = fetchUser;