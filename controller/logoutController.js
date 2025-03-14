const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/logoutMiddleware");

const secretKey = "my-secret-key";


router.post("/logout", authenticateToken, (req, res) => {
    req.session.destroy((err) => {
        if(err){
            logger.error("Error destroying session", err);
        }
        res.status(200).json({ message: "You have logged out!"});
    })
});