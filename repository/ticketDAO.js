const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const AWS = require("aws-sdk");
require("dotenv").config();

const client = new DynamoDBClient({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
});

const documentClient = DynamoDBDocumentClient.from(client);

async function submitTicket(ticket){
    const command = new PutCommand({
        TableName: 'Employee_Tickets',
        Item: {
            id: ticket.id,
            author: ticket.employee_id,
            resolver: 0,
            description: ticket.description,
            type: ticket.type,
            status: "pending",
            amount: ticket.amount
        }
    });

    try{
        await documentClient.send(command);
        return ticket;
    }
    catch(err){
        console.error(err);
        return null;
    }
}

module.exports = { submitTicket };