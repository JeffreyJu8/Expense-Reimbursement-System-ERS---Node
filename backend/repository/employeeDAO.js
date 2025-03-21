const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand, PutCommand, ScanCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
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

async function registerEmployee(user){
    const command = new PutCommand({
        TableName: 'Employee',
        Item: {
            employee_id: user.employee_id,
            username: user.username,
            password: user.hashedPassword,
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

async function getUser(username){
    const params = {
        TableName: "Employee",
        IndexName: "username-index", 
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
          ":username": username,
        },
      };

      try {
        const result = await documentClient.send(new QueryCommand(params));
        // console.log("Header result:", result);
        if (result.Items || result.Items.length > 0) {
            return result.Items[0]; // Return existing user
          }
        else{
            return null;
        }
      } 
      catch (error) {
        console.error("Error querying:", error);
        return null;
      }
}

async function editUserProfile(id, newUsername, hashedPassword){
    const command = new UpdateCommand ({
        TableName: "Employee",
        Key: {"employee_id": id},
        UpdateExpression: "SET #username = :newUsername, #password = :hashedPassword",
        ExpressionAttributeNames: {"#username": "username", "#password": "password"},
        ExpressionAttributeValues: {":newUsername": newUsername, ":hashedPassword": hashedPassword},
        ReturnValues: "ALL_NEW"
    });

    try{
        const result = documentClient.send(command);
        return result;
    }
    catch(err){
        console.error(err);
        return null;
    }
}

module.exports = { registerEmployee, updateEmployeeRole, getAllEmployee, getUser, editUserProfile };