const jwt = require('jsonwebtoken');

const authenticateToken = (req , res , next) => {
    const token = req.headers['authorization'];
    console.log('Token received:', token);
    const secret = token && token.split(' ')[1];

    jwt.verify(secret , process.env.JWT_TOKEN_SECRET, (err , user)=>{
        if(err) {
            return res.sendStatus(403); // Forbidden
        }
        console.log('User authenticated:', user);
        req.user = user;
        next();
    })
}

module.exports = authenticateToken;


// client -> x api (token) -> x api, middle auth -> auth -> token -> valid?

// valid -> expire -> login again -> new token -> client -> x api(new token)


// key + payload -> token
// token + key -> payload


// -> public , private-> user