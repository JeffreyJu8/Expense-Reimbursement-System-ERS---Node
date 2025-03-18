const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to view past tickets.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/tickets`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        //console.log("API Response:", data); 
        console.log("All Tickets:", data.Tickets[0]); 

        const messageElement = document.getElementById("message");
        const ticketsTable = document.getElementById("tickets-table");
        const tableBody = ticketsTable.querySelector("tbody");

        // Extract all tickets and filter out "pending" ones
        const tickets = data.Tickets;

        if (!tickets || tickets.length === 0) {
            messageElement.style.color = "blue";
            messageElement.textContent = "No past tickets available.";
            return;
        }

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
                <td>${ticket.resolver ? ticket.resolver : "N/A"}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching past tickets:", error);
    }
});

function goHome() {
    window.location.href = "home.html";
}
