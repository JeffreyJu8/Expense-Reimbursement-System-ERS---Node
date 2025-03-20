const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            const messageElement = document.getElementById("message");

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("employee_id", data.employee_id);
                localStorage.setItem("username", username);

                messageElement.style.color = "green";
                messageElement.textContent = "Login successful! Redirecting...";

                setTimeout(() => {
                    window.location.href = "home.html";
                }, 2000);
            } else {
                messageElement.style.color = "red";
                messageElement.textContent = data.message || "Login failed!";
            }

        } catch (error) {
            console.error("Error during login:", error);
        }
    });
});
