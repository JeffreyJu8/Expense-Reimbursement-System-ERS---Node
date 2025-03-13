const employeeDAO = require("../repository/employeeDAO");
const bcrypt = require("bcrypt");

async function registerEmployee({employee_id, username, password}){
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await employeeDAO.registerEmployee({employee_id, username, hashedPassword});

    if(!result){
        return {message: "Failed to add employee"};
    }

    return {message: "Employee added successfully", Employee: result};
}

module.exports = { registerEmployee };