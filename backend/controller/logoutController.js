const express = require("express");
const router = express.Router();
const authenticateToken = require("../util/jwt");


router.post("/", authenticateToken, (req, res) => {
    console.log("logging out");
    // req.session.destroy((err) => {
    //     if(err){
    //         logger.error("Error destroying session", err);
    //     }
    //     res.status(200).json({ message: "You have logged out!"});
    // })
    res.status(200).json({ message: "You have logged out!"});
});

module.exports = router;