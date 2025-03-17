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


async function validateRegisterMiddleware(req, res, next){
    const jsonBody = req.body;

    if(!validateRegister(jsonBody)){
        return res.status(400).json({
            message: "Invalid username or password!"
        });
    }

    const isUsernameValid = await validateUsername(jsonBody);
    if(!isUsernameValid){
        return res.status(400).json({
            message: "Username invalid"
        });
    }

    if(!jsonBody.password){
        return res.status(400).json({
            message: "Invalid password!"
        });
    }

    next();
}


async function validateRegister(data){
    return (data.username && data.password)
}

async function validateUsername(data){
    const params = {
        TableName: "Employee",
        IndexName: "username-index", 
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
          ":username": data.username,
        },
      };

      try {
        const result = await documentClient.send(new QueryCommand(params));
        console.log("Query result:", result);
        if (!result.Items || result.Items.length === 0) {
            return true; // Username available
          }
        else{
            return false;
        }
      } 
      catch (error) {
        console.error("Error querying:", error);
      }
}

module.exports = validateRegisterMiddleware;
