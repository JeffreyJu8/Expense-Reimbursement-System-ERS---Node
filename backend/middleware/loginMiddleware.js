const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
require("dotenv").config();
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const bcrypt = require("bcrypt");


const client = new DynamoDBClient({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
});

const documentClient = DynamoDBDocumentClient.from(client);

async function validateLoginMiddleware(req, res, next){
    const jsonBody = req.body;

    if(!validateLogin(jsonBody)){
        return res.status(400).json({
            message: "Invalid username or password!"
        });
    }

    const isUsernameValid = await validateUsername(jsonBody);
    if(!isUsernameValid){
        return res.status(400).json({
            message: "Username does not exist"
        });
    }

    const isPasswordCorrect = await validatePassword(jsonBody);
    if(!isPasswordCorrect){
        return res.status(400).json({
            message: "Incorrect password!"
        });
    }

    next();
}


async function validateLogin(data){
    return (data.username && data.password)
}

async function getUser(data){
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
        // console.log("Query result:", result);
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

async function validateUsername(data){
    const user = await getUser(data);

    if(!user){
        return false;
    }
    
    return true;
}

async function validatePassword(data){
    const user = await getUser(data);

    if(user && (await bcrypt.compare(data.password, user.password))){
        return true;
    }
    else{
        return false;
    }
}

module.exports = validateLoginMiddleware;