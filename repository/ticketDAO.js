const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, QueryCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
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


async function getPendingTickets(){
    const params = {
        TableName: "Employee_Tickets",
        IndexName: "status-index",
        KeyConditionExpression: "#status = :statusVal",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
            ":statusVal": "pending"
        }
    }

    try{
        const result = await documentClient.send(new QueryCommand(params));
        console.log("Pending Tickets: ", result.Items);
        return result.Items;
    }
    catch(err){
        console.error(err);
        return null;
    }
}

async function updateTicketStatus(id, newStatus) {
    const command = new UpdateCommand({
        TableName: "Employee_Tickets",
        Key: { "id": id },
        UpdateExpression: "SET #status = :statusVal",
        ExpressionAttributeNames: { "#status": "status"},
        ExpressionAttributeValues: { ":statusVal": newStatus},
        ReturnValues: "UPDATED_NEW"
    })

    try{
        const result = await documentClient.send(command);
        return result;
    }
    catch(err){
        console.error(err);

    }
}

module.exports = { submitTicket, getPendingTickets, updateTicketStatus };