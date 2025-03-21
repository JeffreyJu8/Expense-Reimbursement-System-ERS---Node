const API_BASE_URL = "http://localhost:3000";


document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to view your profile.");
        window.location.href = "login.html";
        return;
    }

    let tokenPayload;
    let currentUsername;

    try {
        tokenPayload = JSON.parse(atob(token.split(".")[1]));
        currentUsername = tokenPayload.username;

        const response = await fetch(`${API_BASE_URL}/users/${currentUsername}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const userData = await response.json();
        document.getElementById("username").textContent = userData.username;
        document.getElementById("employee-id").textContent = userData.employee_id;
        document.getElementById("employee-role").textContent = userData.role;

        // Profile picture setup
        const profilePictureElement = document.getElementById("profile-picture");
        const profilePictureInput = document.getElementById("profile-picture-url");

        const profileUrl = userData.profilePicture?.trim();
        if (profileUrl) {
            console.log("picture link: ", profileUrl);
            profilePictureElement.src = profileUrl;
            profilePictureInput.value = profileUrl;
        }


        // Show edit form
        document.getElementById("edit-profile-btn").addEventListener("click", () => {
            document.getElementById("edit-profile-form").style.display = "block";
        });

        // Cancel edit
        document.getElementById("cancel-edit-btn").addEventListener("click", () => {
            document.getElementById("edit-profile-form").style.display = "none";
        });

        // Update profile picture URL
        document.getElementById("update-profile-picture-btn").addEventListener("click", async () => {
            const newProfilePictureUrl = profilePictureInput.value.trim();
            console.log("newProfilePicture: ", newProfilePictureUrl);
            if (!newProfilePictureUrl) {
                alert("Please enter a valid image URL.");
                return;
            }

            try {
                const updateResponse = await fetch(`${API_BASE_URL}/users/${currentUsername}/profile-picture`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ profilePicture: newProfilePictureUrl })
                });

                const result = await updateResponse.json();

                if (!updateResponse.ok) {
                    throw new Error(result.message || "Failed to update profile picture");
                }

                profilePictureElement.src = newProfilePictureUrl;
                alert("Profile picture updated successfully!");

            } catch (error) {
                console.error("Error updating profile picture:", error);
                alert("Error updating profile picture.");
            }
        });

        // Update username/password
        document.getElementById("save-profile-btn").addEventListener("click", async () => {
            const newUsername = document.getElementById("new-username").value.trim();
            const newPassword = document.getElementById("new-password").value.trim();

            const updateData = {};
            if (newUsername) updateData.newUsername = newUsername;
            if (newPassword) updateData.newPassword = newPassword;

            if (Object.keys(updateData).length === 0) {
                alert("Please enter new values to update.");
                return;
            }

            try {
                const updateResponse = await fetch(`${API_BASE_URL}/users/${currentUsername}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updateData)
                });

                const result = await updateResponse.json();

                if (!updateResponse.ok) {
                    if (result.message === "Username already exists") {
                        alert("That username is already taken. Please try another.");
                    } else {
                        alert("Failed to update profile: " + (result.message || "Unknown error"));
                    }
                    return;
                }

                alert("Profile updated successfully!");

                if (newUsername && newUsername !== currentUsername) {
                    localStorage.removeItem("token");
                    alert("Username updated. Please log in again.");
                    window.location.href = "login.html";
                } else {
                    window.location.reload();
                }

            } catch (error) {
                console.error("Error updating profile:", error);
                alert("An error occurred while updating your profile.");
            }
        });

    } catch (error) {
        console.error("Error loading profile:", error);
        alert("Error loading profile.");
    }

    document.getElementById("back-btn").addEventListener("click", () => {
        window.location.href = "home.html";
    });
});
