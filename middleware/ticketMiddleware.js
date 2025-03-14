const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
require("dotenv").config();
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const jwt = require("jsonwebtoken");

const secretKey = "my-secret-key";


const client = new DynamoDBClient({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
});

const documentClient = DynamoDBDocumentClient.from(client);

async function authenticateToken(req, res, next){

    // authorization: "Bearer tokenstring"
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    //console.log("Received Token:", token); 

    if(!token){
        return res.status(403).json({message: "Forbidden Access"});
    }else{
        const user = await decodeJWT(token);
        //console.log("Decoded User:", user);

        if(!user){
            return res.status(403).json({message: "Invalid token!"});
        }
        req.id = user.id;
        console.log("employee_id: ", req.id);
        // req.user = user;
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


async function validateTicketMiddleware(req, res, next){
    const jsonBody = req.body;
    
    // description, type, amount
    if(!jsonBody.description){
        return res.status(400).json({
            message: "Please put in a description!"
        });
    }

    if(!jsonBody.type){
        return res.status(400).json({
            message: "Please indicate the type!"
        });
    }

    if(!jsonBody.amount){
        return res.status(400).json({
            message: "Please indicate amount!"
        });
    }

    next();
}


// module.exports = validateTicketMiddleware;
module.exports = {
    authenticateToken,
    validateTicketMiddleware
}
