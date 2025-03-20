require("dotenv").config();
const express = require("express");
const router = express.Router();
const ticketService = require("../service/ticketService");
const employeeService = require("../service/employeeService");
const validateUserMiddleware = require("../middleware/userMiddleware");
const authenticateToken = require("../util/jwt");



router.put("/", validateUserMiddleware, authenticateToken, async (req, res) => {
    const { id, role } = req.body;

    const currRole = await ticketService.getUserRole(req.id);
    
    if(currRole === "employee"){
        return res.status(403).json({message: "You are not authorized to access this functionality!"});
    }

    // console.log("id, newRole: ", id, role);
    const data = await employeeService.updateEmployeeRole(id, role);

    res.status(201).json({message: "Employee Role Updated ", Employee: data});
});


router.get("/", async (req, res) => {
    const data = await employeeService.getAllEmployee();

    res.status(201).json(data);
})


router.get(`/:username`, authenticateToken, async (req, res) => {
    const { username } = req.params;
    const data = await employeeService.getUser(username);

    res.status(201).json(data);
})

module.exports = router;