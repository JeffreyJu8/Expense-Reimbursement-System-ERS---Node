const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const employeeService = require("../service/employeeService");

router.post("/", validateRegisterMiddleware, async (req, res) => {

    const {username, password} = req.body;
    // const jsonData = req.body;
    //console.log("Adding Employee: ", jsonData);

    const newEmployee = { employee_id: uuidv4(), username, password, role};

    const data = await employeeService.registerEmployee(newEmployee);

    res.status(201).json({message: "Employee Created: ", Employee: data});
});

function validateRegisterMiddleware(req, res, next){
    const jsonBody = req.body;

    if(validateRegister(jsonBody)){
        next();
    }
    else{
        res.status(400).json({
            message: "Invalid username or password!"
        });
    }
}

function validateRegister(data){
    return (data.username && data.password && role);
}

function validateUsername(data){
    const params = {
        TableName: "Employees",

    }
}


module.exports = router;