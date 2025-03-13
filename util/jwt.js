const jwt = require("jsonwebtoken");

const secretKey = "my-secret-key";

async function authenticateToken(req, res, next){

    // authorization: "Bearer tokenstring"
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    console.log("Received Token:", token); 

    if(!token){
        return res.status(403).json({message: "Forbidden Access"});
    }else{
        const user = await decodeJWT(token);
        if(!user){
            return res.status(403).json({message: "Invalid token!"});
        }
        req.user = user;
        next();
    }
}

async function decodeJWT(token){
    try{
        return jwt.verify(token, secretKey);
    }catch(err){
        console.error(err);
        return null;
    }
}

module.exports = {
    authenticateToken
}