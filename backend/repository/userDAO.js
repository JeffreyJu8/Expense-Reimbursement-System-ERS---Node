const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
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

async function updateEmployeeRole(id, newRole){
    const command = new UpdateCommand ({
        TableName: "Employee",
        Key: {"employee_id": id},
        UpdateExpression: "SET #role = :role",
        ExpressionAttributeNames: {"#role": "role"},
        ExpressionAttributeValues: {":role": newRole}
    })

    try{
        const result = documentClient.send(command);
        return result;
    }
    catch(err){
        console.error(err);
        return null;
    }
}

async function getAllEmployee(){
    const command = new ScanCommand({
        TableName: "Employee"
    });

    try{
        const result = await documentClient.send(command);
        console.log(result);
        return result.Items;
    }
    catch(err){
        console.log(err);
        return null;
    }
}

module.exports = { updateEmployeeRole, getAllEmployee };