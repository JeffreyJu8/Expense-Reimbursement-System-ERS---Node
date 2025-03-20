const express = require("express");
const router = express.Router();
const { validateLoginMiddleware } = require("../middleware/loginMiddleware");
const jwt = require('jsonwebtoken');
const employeeService = require("../service/employeeService");

const secretKey = "my-secret-key";

router.post("/", validateLoginMiddleware, async (req,res) => {
    const {username, password} = req.body;

    const data = await employeeService.getUser(username);

    console.log("data: ", data);

    const token = jwt.sign(
        {
            id: data.employee_id,
            username
        },
            secretKey,
        {
            expiresIn: "15m"
    })
    res.status(200).json({ message: "You have logged in!", token, employee_id: data.employee_id });
});

module.exports = router