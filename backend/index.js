const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const bodyParser = require("body-parser");
const registerController = require("./controller/registerController");
const loginController = require("./controller/loginController");
const ticketController = require("./controller/ticketController");
const logoutController = require("./controller/logoutController");
const userController = require("./controller/userController");
const {authenticateToken} = require("./util/jwt");

const PORT = 3000;



// parse JSON request body
app.use(express.json());

app.use("/register", registerController);

app.use("/login", loginController);

app.use("/tickets", authenticateToken, ticketController);

app.use("/logout", logoutController);

app.use("/users", userController);

// app.get("/protected", authenticateToken, (req, res) => {
//     res.json({message: "Accessed Protected Route", user: req.user});
// })


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})