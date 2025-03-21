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

        // Attach event listeners for profile edit actions
        document.getElementById("edit-profile-btn").addEventListener("click", () => {
            document.getElementById("edit-profile-form").style.display = "block";
        });

        document.getElementById("cancel-edit-btn").addEventListener("click", () => {
            document.getElementById("edit-profile-form").style.display = "none";
        });

        document.getElementById("save-profile-btn").addEventListener("click", async () => {
            const newUsername = document.getElementById("new-username").value.trim();
            const newPassword = document.getElementById("new-password").value.trim();

            const updateData = {};
            if (newUsername) updateData.newUsername = newUsername;
            if (newPassword) updateData.newPassword = newPassword;

            try {
                const updateResponse = await fetch(`${API_BASE_URL}/users/${username}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updateData)
                });

                if (!updateResponse.ok) {
                    throw new Error("Failed to update profile");
                }

                alert("Profile updated successfully!");
                window.location.reload(); // Refresh profile page

            } catch (error) {
                console.error("Error updating profile:", error);
                alert("Error updating profile.");
            }
        });

    } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Error loading profile.");
    }

    document.getElementById("back-btn").addEventListener("click", () => {
        window.location.href = "home.html";
    });
});
