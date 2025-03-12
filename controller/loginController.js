const express = require("express");
const router = express.Router();
const employeeService = require("../service/employeeService");

router.post("/", async (req,res) => {
const {username, password} = req.body;
    const newEmployee = { username, password };

    const data = await employeeService.registerEmployee(newEmployee);

    res.status(201).json({message: "Employee Created: ", Employee: data});
});