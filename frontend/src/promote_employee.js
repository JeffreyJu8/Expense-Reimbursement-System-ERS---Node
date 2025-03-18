const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to update employee roles.");
        window.location.href = "login.html";
        return;
    }

    try {
        // Check if the user is authorized (must be a manager)
        const response = await fetch(`${API_BASE_URL}/tickets?status=pending`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 403) {
            document.getElementById("role-message").style.color = "red";
            document.getElementById("role-message").textContent = "You are not authorized to update employee roles!";
            setTimeout(() => {
                window.location.href = "home.html";
            }, 3000);
            return;
        }

        document.getElementById("role-message").style.color = "green";
        document.getElementById("role-message").textContent = "You are authorized to update employee roles.";
        document.getElementById("role-form").style.display = "block";

    } catch (error) {
        console.error("Error checking authorization:", error);
    }
});

document.getElementById("role-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    const employeeId = document.getElementById("employee-id").value.trim();
    const role = document.getElementById("role").value;

    if (!employeeId) {
        alert("Please enter an employee ID.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ id: employeeId, role })
        });

        const data = await response.json();
        const messageElement = document.getElementById("message");

        if (response.ok) {
            messageElement.style.color = "green";
            messageElement.textContent = "Employee role updated successfully!";
        } else if (response.status === 403) {
            messageElement.style.color = "red";
            messageElement.textContent = "You are not authorized to update employee roles!";
            setTimeout(() => {
                window.location.href = "home.html";
            }, 3000);
        } else {
            messageElement.style.color = "red";
            messageElement.textContent = data.message || "Failed to update employee role.";
        }

    } catch (error) {
        console.error("Error updating employee role:", error);
    }
});

function goHome() {
    window.location.href = "home.html";
}
