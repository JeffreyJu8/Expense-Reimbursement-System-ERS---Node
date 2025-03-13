const employeeDAO = require("../repository/employeeDAO");
const bcrypt = require("bcrypt");
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

async function registerEmployee({employee_id, username, password}){
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await employeeDAO.registerEmployee({employee_id, username, hashedPassword});

    if(!result){
        return {message: "Failed to add employee"};
    }

    return {message: "Employee added successfully", Employee: result};
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

module.exports = { registerEmployee, getUser };