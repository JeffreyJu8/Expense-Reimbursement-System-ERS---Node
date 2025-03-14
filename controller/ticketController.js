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
    // console.log("Requested employee_id: ", req.id);
    const newTicket = { id: uuidv4(), employee_id: req.id, description, type, amount };

    const data = await ticketService.submitTicket(newTicket);

    res.status(201).json({message: "Ticket Submitted: ", Ticket: data});
});


router.get("/", async(req,res) => {
    const { status } = req.query;

    if(status === "pending"){
        const data = await ticketService.getPendingTickets();

        res.status(201).json({message: "Pending Tickets: ", Ticket: data});
    }
})

router.put("/:id", authenticateToken, async(req,res) => {
    const { id } = req.params;
    const { status } = req.body;

    console.log("Authorization employee_id: ", req.id);

    const currRole = await ticketService.getUserRole(req.id);

    if(currRole === "employee"){
        return res.status(403).json({message: "You are not authorized!"});
    }

    const result = await ticketService.updateTicketStatus(id, status, req.id);

    if(!result){
        return res.status(401).json({message: "Failed to update ticket status!"});
    }

    return res.status(200).json({message: "Ticket status updated!"});
})


module.exports = router;
