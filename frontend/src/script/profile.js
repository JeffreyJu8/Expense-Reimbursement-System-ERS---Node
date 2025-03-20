const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to view your profile.");
        window.location.href = "login.html";
        return;
    }

    try {
        const tokenPayload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        const username = tokenPayload.username; // Extract username

        const response = await fetch(`${API_BASE_URL}/users/${username}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        document.getElementById("username").textContent = userData.username;
        document.getElementById("employee-id").textContent = userData.employee_id;
        document.getElementById("employee-role").textContent = userData.role;

    } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Error loading profile.");
    }

    document.getElementById("back-btn").addEventListener("click", () => {
        window.location.href = "home.html";
    });
});
