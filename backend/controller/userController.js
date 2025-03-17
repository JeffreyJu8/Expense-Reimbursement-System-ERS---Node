require("dotenv").config();
const AWS = require("aws-sdk");
const express = require("express");
const router = express.Router();
const ticketService = require("../service/ticketService");
const userService = require("../service/userService");
const { validateUserMiddleware, authenticateToken } = require("../middleware/userMiddleware");



router.put("/", validateUserMiddleware, authenticateToken, async (req, res) => {
    const { id, role } = req.body;

    const currRole = await ticketService.getUserRole(req.id);
    
    if(currRole === "employee"){
        return res.status(403).json({message: "You are not authorized to access this functionality!"});
    }

    // console.log("id, newRole: ", id, role);
    const data = await userService.updateEmployeeRole(id, role);

    res.status(201).json({message: "Employee Role Updated ", Employee: data});
});


module.exports = router;