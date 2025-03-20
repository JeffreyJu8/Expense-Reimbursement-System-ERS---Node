const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const employeeService = require("../service/employeeService");
const validateRegisterMiddleware = require("../middleware/registerMiddleware")


router.post("/", validateRegisterMiddleware, async (req, res) => {

    const {username, password} = req.body;

    const newEmployee = { employee_id: uuidv4(), username, password};

    const data = await employeeService.registerEmployee(newEmployee);

    res.status(201).json({message: "Employee Created: ", Employee: data});
});


module.exports = router;
