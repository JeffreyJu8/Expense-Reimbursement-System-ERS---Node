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
        return res.status(403).json({message: "You are not logged in!"});
    }else{
        // req.id = user.id;
        // console.log("employee_id: ", req.id);
        // req.user = user;
        next();
    }
}

module.exports = authenticateToken;