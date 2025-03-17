const API_BASE_URL = "http://localhost:3000"; 

document.addEventListener("DOMContentLoaded", () => {
    const ticketForm = document.getElementById("ticket-form");

    ticketForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const type = document.getElementById("type").value;
        const description = document.getElementById("description").value;
        const amount = document.getElementById("amount").value;

        const token = localStorage.getItem("token"); 
        if (!token) {
            alert("You must be logged in to create a ticket.");
            window.location.href = "login.html";
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/tickets`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ type, description, amount })
            });

            const data = await response.json();
            const messageElement = document.getElementById("message");

            if (response.ok) {
                messageElement.style.color = "green";
                messageElement.textContent = "Ticket submitted successfully! Redirecting...";

                setTimeout(() => {
                    window.location.href = "home.html";
                }, 2000);
            } else {
                messageElement.style.color = "red";
                messageElement.textContent = data.message || "Failed to submit ticket.";
            }

        } catch (error) {
            console.error("Error submitting ticket:", error);
        }
    });
});

function goHome() {
    window.location.href = "home.html";
}
