const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to view pending tickets.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/tickets?status=pending`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        // console.log("Tickets Array:", data.result); 

        const messageElement = document.getElementById("message");
        const ticketsTable = document.getElementById("tickets-table");
        const tableBody = ticketsTable.querySelector("tbody");

        if(response.status === 403){
            messageElement.style.color = "red";
            messageElement.textContent = "You are not authroized to view!";
            return;
        }

        const tickets = data.result; 

        if (!tickets || tickets.length === 0) {
            messageElement.style.color = "blue";
            messageElement.textContent = "No pending tickets available.";
            return;
        }

        ticketsTable.style.display = "table"; 
        tableBody.innerHTML = ""; 

        tickets.forEach(ticket => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${ticket.id}</td>
                <td>${ticket.author}</td>
                <td>${ticket.description}</td>
                <td>${ticket.type}</td>
                <td>${ticket.amount}</td>
                <td>${ticket.status}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching pending tickets:", error);
    }
});

function goHome() {
    window.location.href = "home.html";
}
