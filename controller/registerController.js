const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
require("dotenv").config();
const AWS = require("aws-sdk");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const employeeService = require("../service/employeeService");
const validateRegisterMiddleware = require("../middleware/registerMiddleware")


router.post("/", validateRegisterMiddleware, async (req, res) => {

    const {username, password} = req.body;

    const newEmployee = { employee_id: uuidv4(), username, password};

    const data = await employeeService.registerEmployee(newEmployee);

    res.status(201).json({message: "Employee Created: ", Employee: data});
});


module.exports = router;
