const API_BASE_URL = "http://localhost:3000"; 

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    const authButtons = document.getElementById("auth-buttons");
    const userActions = document.getElementById("user-actions");
    const welcomeMessage = document.getElementById("welcome-message");

    if (token) {
        // logged in
        authButtons.style.display = "none";
        userActions.style.display = "block";
        welcomeMessage.textContent = `Welcome, ${username}!`;

        document.getElementById("create-ticket-btn").addEventListener("click", () => {
            window.location.href = "create_ticket.html";
        });

        document.getElementById("process-ticket-btn").addEventListener("click", () => {
            window.location.href = "process_ticket.html";
        });

        document.getElementById("view-pending-btn").addEventListener("click", () => {
            window.location.href = "view_pending_tickets.html";
        });

        document.getElementById("view-ticket-by-type-btn").addEventListener("click", () => {
            window.location.href = "view_tickets_by_type.html";
        });

        document.getElementById("view-past-btn").addEventListener("click", () => {
            window.location.href = "view_past_tickets.html";
        });

        document.getElementById("all-employees-btn").addEventListener("click", () => {
            window.location.href = "all_employees.html";
        });

        document.getElementById("promote-btn").addEventListener("click", () => {
            window.location.href = "promote_employee.html";
        });

        document.getElementById("logout-btn").addEventListener("click", logout);
    } 
    else {
        authButtons.style.display = "block";
        userActions.style.display = "none";
        welcomeMessage.textContent = "Please log in to access more features.";

        document.getElementById("login-btn").addEventListener("click", login);
        document.getElementById("register-btn").addEventListener("click", register);
    }
});

function login() {
    window.location.href = "login.html";
}

function register() {
    window.location.href = "register.html";
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("employee_id");
    localStorage.removeItem("username");

    alert("Logged out successfully!");
    window.location.href = "home.html";
}
