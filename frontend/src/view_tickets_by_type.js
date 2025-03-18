const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to view tickets.");
        window.location.href = "login.html";
        return;
    }

    document.getElementById("search-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const ticketType = document.getElementById("ticket-type").value.trim();

        if (!ticketType) {
            alert("Please enter a ticket type.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/tickets?type=${ticketType}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            // console.log("Tickets Array:", data.Ticket); 

            const messageElement = document.getElementById("message");
            const ticketsTable = document.getElementById("tickets-table");
            const tableBody = ticketsTable.querySelector("tbody");

            const tickets = data.Ticket;

            if (!tickets || tickets.length === 0) {
                messageElement.style.color = "blue";
                messageElement.textContent = `No tickets found for type "${ticketType}".`;
                ticketsTable.style.display = "none";
                return;
            }

            messageElement.textContent = "";
            ticketsTable.style.display = "table"; 
            tableBody.innerHTML = ""; 

            tickets.forEach(ticket => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${ticket.id}</td>
                    <td>${ticket.description}</td>
                    <td>${ticket.type}</td>
                    <td>${ticket.amount}</td>
                    <td>${ticket.status}</td>
                `;
                tableBody.appendChild(row);
            });

        } catch (error) {
            console.error("Error fetching tickets by type:", error);
        }
    });
});

function goHome() {
    window.location.href = "home.html";
}
