
const jsonwebtoken = require("jsonwebtoken");

function authenticateToken(req, res, next) {

    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({ error: 'unauthorized' });
    }
    
    jsonwebtoken.verify(token,process.env.SECRETKEY,(err, user) => {
        if (err) {
            console.log(err)
            return res.status(403).json({ error: 'forbidden' });
        }
        req.user = user;
        next();
    });
}

module.exports = {authenticateToken, jsonwebtoken}