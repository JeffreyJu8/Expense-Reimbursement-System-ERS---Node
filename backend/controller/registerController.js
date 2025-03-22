const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const employeeService = require("../service/employeeService");
const validateRegisterMiddleware = require("../middleware/registerMiddleware")


router.post("/", validateRegisterMiddleware, async (req, res) => {

    const {username, password, address} = req.body;

    const newEmployee = { employee_id: uuidv4(), username, password, address};

    const data = await employeeService.registerEmployee(newEmployee);

    console.log("data: ", data);
    if(!data){
        return res.status(400).json({message: "Failed to create employee"});
    }

    return res.status(201).json({message: "Employee Created: ", Employee: data});
});


module.exports = router;
