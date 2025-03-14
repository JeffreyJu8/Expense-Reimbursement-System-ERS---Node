const ticketDAO = require("../repository/ticketDAO");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
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


async function submitTicket({id, employee_id, description, type, amount}){

    const result = await ticketDAO.submitTicket({id, employee_id, description, type, amount});

    if(!result){
        return {message: "Failed to submit ticket"};
    }

    return {message: "Ticket submitted successfully", Ticket: result};
}

async function getPendingTickets(){
    const result = await ticketDAO.getPendingTickets();

    if(!result){
        return {message: "No tickets are pending!"};
    }

    return {message: "Pending Tickets: ", Tickets: result};
}


async function updateTicketStatus(id){
    const result = await ticketDAO.updateTicketStatus(id);
}


async function getUserRole(id){
    console.log("received id: ", id)
    const params = {
        TableName: "Employee",
        KeyConditionExpression: "#employee_id = :id",
        ExpressionAttributeNames: {
          "#employee_id": "employee_id",
        },
        ExpressionAttributeValues: {
            ":id": id
        }
    }

    try{
        const result = await documentClient.send(new QueryCommand(params));
        return result.Items[0].role;
    }
    catch(err){
        console.error(err);
        return null;
    }
}


async function updateTicketStatus(id, newStatus, resolverId){
    const result = ticketDAO.updateTicketStatus(id, newStatus, resolverId);

    if(!result){
        return false
    }

    return true;
}

module.exports = { submitTicket, getPendingTickets, updateTicketStatus, getUserRole, updateTicketStatus };