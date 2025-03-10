const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// parse JSON request body
app.use(express.json());

const contentType = {"Content-Type": "application/json"};

app.get('/', (req, res) => {
    res.send('Get Request');
})


app.post('/register', (req,res) => {
    const data = req.body;
    const{username, password} = data;

    if(!username || !password){
        res.writeHead(400, contentType);
        res.end(JSON.stringify('Please enter a valid username and password'));
        return;
    }

    res.writeHead(201, contentType);
    res.end(JSON.stringify("Successfully registered!"));
})

app.post('/login', (res,req) =>{
    const data = req.body;
    const {username, password} = data;

    if(!username || !password){
        res.writeHead(400, contentType);
        res.end(JSON.stringify("Please enter a valid username and password"));
        return
    }

    res.writeHead(201, contentType);
    res.end(JSON.stringify('Successfully logged in!'));
})

app.post('/tickets', (res,req) => {
    const data = req.body;
    const {id, author, description, type, amount} = data;

    // get the author and id based on who is logged in

    if(!amount){
        req.writeHead(400, contentType);
        res.end(JSON.stringify('Request cannot be submitted without an amount'));
    }
    if(!type){
        req.writeHead(400, contentType);
        res.end(JSON.stringify('Request cannot be submitted without a type'));
    }
    if(!description){
        req.writeHead(400, contentType);
        res.end(JSON.stringify('Request cannot be submitted without a description'));
    }

})



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})