const ticketDAO = require("../repository/ticketDAO");


async function submitTicket({id, employee_id, description, type, amount}){

    const result = await ticketDAO.submitTicket({id, employee_id, description, type, amount});

    if(!result){
        return {message: "Failed to submit ticket"};
    }

    return {message: "Ticket submitted successfully", Ticket: result};
}

async function getPendingTickets(){
    const result = await ticketDAO.getPendingTickets();

    if(!result){
        return {message: "No tickets are pending!"};
    }

    return {message: "Pending Tickets: ", Tickets: result};
}

module.exports = { submitTicket, getPendingTickets };