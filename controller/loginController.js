const express = require("express");
const router = express.Router();
const employeeService = require("../service/employeeService");
const loginMiddleware = require("../middleware/loginMiddleware");
const jwt = require('jsonwebtoken');

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