const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const employeeService = require("../service/employeeService");

router.post("/", async (req, res) => {

    const {username, password} = req.body;
    // const jsonData = req.body;
    //console.log("Adding Employee: ", jsonData);

    const newEmployee = { employee_id: uuidv4(), username, password};

    const data = await employeeService.registerEmployee(newEmployee);

    res.status(201).json({message: "Employee Created: ", Employee: data});
});

module.exports = router;