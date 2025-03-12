const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const bodyParser = require("body-parser");

const PORT = 3000;

const registerController = require("./controller/registerController");

// parse JSON request body
app.use(express.json());

app.use("/register", registerController);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})