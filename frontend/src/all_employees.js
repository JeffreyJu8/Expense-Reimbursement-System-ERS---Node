const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to view employees.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log("API Response:", data); 

        const messageElement = document.getElementById("message");
        const employeesTable = document.getElementById("employees-table");
        const tableBody = employeesTable.querySelector("tbody");

        if (!data || data.length === 0) {
            messageElement.style.color = "blue";
            messageElement.textContent = "No employees found.";
            return;
        }

        employeesTable.style.display = "table";
        tableBody.innerHTML = "";

        data.forEach(employee => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${employee.employee_id}</td>
                <td>${employee.username}</td>
                <td>${employee.role}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching employees:", error);
    }
});

function goHome() {
    window.location.href = "home.html";
}
