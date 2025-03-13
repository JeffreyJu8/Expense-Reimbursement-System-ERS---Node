const express = require("express");
const router = express.Router();
const loginMiddleware = require("../middleware/loginMiddleware");
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../util/jwt');

const secretKey = "my-secret-key";

router.post("/", loginMiddleware, async (req,res) => {
    const {username, password} = req.body;

    const data = {username, password}

    const token = jwt.sign(
        {
            id: data.user_id,
            username
        },
            secretKey,
        {
            expiresIn: "15m"
    })
    res.status(200).json({message: "You have logged in!", token});
});

module.exports = router