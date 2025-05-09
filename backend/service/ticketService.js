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


async function submitTicket({id, employee_id, description, type, amount, receipt}){

    const result = await ticketDAO.submitTicket({id, employee_id, description, type, amount, receipt});

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

    return {result};
}


async function getUserRole(id){
    const result = await ticketDAO.getUserRole(id);

    if(!result){
        return null;
    }

    return result;
}


async function updateTicketStatus(id, newStatus, resolverId){
    const result = await ticketDAO.updateTicketStatus(id, newStatus, resolverId);

    if(result === null){
        return false
    }

    return true;
}

async function getEmployeeTickets(id){
    const result = await ticketDAO.getEmployeeTickets(id);
    
    if(!result){
        return false;
    }

    return result;
}

async function getTicketsByType(type, id){
    const result = await ticketDAO.getTicketsByType(type, id);
    
    if(!result){
        return false;
    }

    return result;
}

module.exports = { submitTicket, getPendingTickets, updateTicketStatus, getUserRole, updateTicketStatus, getEmployeeTickets, getTicketsByType };