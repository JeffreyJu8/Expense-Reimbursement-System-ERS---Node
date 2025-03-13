require("dotenv").config();
const AWS = require("aws-sdk");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const ticketService = require("../service/ticketService");
const { validateTicketMiddleware, authenticateToken } = require("../middleware/ticketMiddleware");



router.post("/", validateTicketMiddleware, authenticateToken, async (req, res) => {

    const { description, type, amount } = req.body;

    // get id from uuid
    // get employee_id from whoever is logged in
    console.log("Requested employee_id: ", req.id);
    const newTicket = { id: uuidv4(), employee_id: req.id, description, type, amount };

    const data = await ticketService.submitTicket(newTicket);

    res.status(201).json({message: "Ticket Submitted: ", Ticket: data});
});


module.exports = router;
