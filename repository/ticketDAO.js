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
        // console.log("Pending Tickets: ", result.Items);
        return result.Items;
    }
    catch(err){
        console.error(err);
        return null;
    }
}


async function getTicketById(id){
    const command = new GetCommand({
        TableName: "Employee_Tickets",
        Key: {"id": id}
    })

    try{
        const ticket = await documentClient.send(command);
        return ticket;
    }
    catch(err){
        console.error(err);
    }
}

async function updateTicketStatus(id, newStatus, resolverId) {
    const ticket = await getTicketById(id);
    // console.log("ticket: ", ticket);
    // console.log("ticket status: ", ticket.Item.status);
    if (ticket.Item.status !== "pending"){
        console.log("Processed tickets cannot be changed!");
        return null;
    }

    const command = new UpdateCommand({
        TableName: "Employee_Tickets",
        Key: { "id": id },
        UpdateExpression: "SET #status = :statusVal, #resolver = :resolverId",
        ExpressionAttributeNames: { 
            "#status": "status",
            "#resolver": "resolver"
        },
        ExpressionAttributeValues: { 
            ":statusVal": newStatus,
            ":resolverId": resolverId
        },
        ReturnValues: "UPDATED_NEW"
    });

    try{
        const result = await documentClient.send(command);
        return result;
    }
    catch(err){
        console.error(err);
        return null;
    }

    // const command = new DeleteCommand({
    //     TableName: "Employee_Tickets",
    //     Key: { "id": id },
    //     UpdateExpression: "SET #status = :statusVal, #resolver = :resolverId",
    //     ExpressionAttributeNames: { 
    //         "#status": "status",
    //         "#resolver": "resolver"
    //     },
    //     ExpressionAttributeValues: { 
    //         ":statusVal": newStatus,
    //         ":resolverId": resolverId
    //     },
    //     ReturnValues: "UPDATED_NEW"
    // });

    // const deleteCommand = new DeleteCommand({
    //     TableName: "Employee_Tickets",
    //     Key: {"id": id}
    // });

    // try{
    //     await documentClient.send(deleteCommand);
    // }
    // catch(err){
    //     console.error(err);
    // }

    // const newTicket = await getTicketById(id);

    // const createCommand = new PutCommand({
    //     TableName: "Processed_Tickts",
    //     Item: {
    //         id: newTicket.id,
    //         author: newTicket.employee_id,
    //         resolver: resolverId,
    //         description: newTicket.description,
    //         type: newTicket.type,
    //         status: newStatus,
    //         amount: newTicket.amount
    //     }
    // })


    // try{
    //     const createResult = await documentClient.send(createCommand);
    //     return createResult;
    // }
    // catch(err){
    //     console.error(err);
    // }
}

async function getEmployeeTickets(id){
    console.log("id", id)
    const params = {
        TableName: "Employee_Tickets",
        IndexName: "author-index",
        KeyConditionExpression: "#author = :authorVal",
        ExpressionAttributeNames: {
          "#author": "author",
        },
        ExpressionAttributeValues: {
            ":authorVal": id
        }
    }

    try{
        const result = await documentClient.send(new QueryCommand(params));
        console.log("results: ", result);
        return result;
    }
    catch(err){
        console.error(err);
        return null;
    }
}

module.exports = { submitTicket, getPendingTickets, updateTicketStatus, getEmployeeTickets };