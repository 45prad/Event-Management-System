const jwt = require('jsonwebtoken')
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET; // This is to be stored in env.local for security purposes.

const fetchuser = (req, res, next) => {

    // get the  user from jwt token and add id to the req object
    const token = req.header('FrAngel-auth-token')
    // console.log(token);

    if(!token){
        return res.status(401).send({error: "Please authenticate using a valid token"})
    }

    try {
        const InfofromToken = jwt.verify(token, JWT_SECRET);
        req.user = InfofromToken.user;
        // console.log(req.user);
        next()
    } catch (err) {
        return res.status(401).send({error: "Can't authenticate auth-token"})
    }

}

module.exports = fetchuser