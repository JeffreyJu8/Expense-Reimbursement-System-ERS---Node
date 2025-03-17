const API_BASE_URL = "http://localhost:3000"; 

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            const messageElement = document.getElementById("message");
            if (response.ok) {
                messageElement.style.color = "green";
                messageElement.textContent = "Registration successful! Redirecting...";

                setTimeout(() => {
                    window.location.href = "home.html"; 
                }, 2000);
            } else {
                messageElement.style.color = "red";
                messageElement.textContent = data.message || "Registration failed!";
            }

        } catch (error) {
            console.error("Error during registration:", error);
        }
    });
});
