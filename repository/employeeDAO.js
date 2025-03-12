const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const AWS = require("aws-sdk");
require("dotenv").config();

// AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION,
// })

const client = new DynamoDBClient({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
});

const documentClient = DynamoDBDocumentClient.from(client);

async function registerEmployee(user){
    const command = new PutCommand({
        TableName: 'Employee',
        Item: {
            employee_id: user.employee_id,
            username: user.username,
            password: user.password,
            role: "employee"
        }
    });

    try{
        await documentClient.send(command);
        return user;
    }
    catch(err){
        console.error(err);
        return null;
    }
}

module.exports = { registerEmployee };