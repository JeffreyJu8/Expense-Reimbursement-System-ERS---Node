const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to process tickets.");
        window.location.href = "login.html";
        return;
    }
});

// Handle ticket update
document.getElementById("ticket-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    const ticketId = document.getElementById("ticket-id").value;
    const status = document.getElementById("status").value;

    try {
        const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        const data = await response.json();
        const messageElement = document.getElementById("message");

        if (response.ok) {
            messageElement.style.color = "green";
            messageElement.textContent = "Ticket status updated successfully!";
        } else if (response.status === 403) {
            messageElement.style.color = "red";
            messageElement.textContent = "You are not authorized to process tickets!";
            setTimeout(() => {
                window.location.href = "home.html"; // Redirect non-managers to home
            }, 3000);
        } else {
            messageElement.style.color = "red";
            messageElement.textContent = data.message || "Failed to update ticket.";
        }

    } catch (error) {
        console.error("Error updating ticket:", error);
    }
});

function goHome() {
    window.location.href = "home.html";
}
