const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
require("dotenv").config();
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");


const client = new DynamoDBClient({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
});

const documentClient = DynamoDBDocumentClient.from(client);


async function validateTicketMiddleware(req, res, next){
    const jsonBody = req.body;
    
    // employee_id, description, type, amount
    if(!validateAuthor(jsonBody)){
        return res.status(400).json({
            message: "Please login before submitting a ticket!"
        });
    }

    if(!validateDescription(jsonBody)){
        return res.status(400).json({
            message: "Please put in a description!"
        });
    }

    if(!validateType(jsonBody)){
        return res.status(400).json({
            message: "Please indicate the type!"
        });
    }

    if(!validateAmount(jsonBody)){
        return res.status(400).json({
            message: "Please indicate amount!"
        });
    }

    next();
}

async function validateAuthor(data){
    return (data.employee_id);
}

async function validateDescription(data){
    return (data.description);
}

async function validateType(data){
    return (data.type);
}

async function validateAmount(data){
    return (data.amount);
}


async function validateTicket(data){
    return (data.id && data.employee_id && data.description && data.type && data.amount);
}


module.exports = validateTicketMiddleware;
