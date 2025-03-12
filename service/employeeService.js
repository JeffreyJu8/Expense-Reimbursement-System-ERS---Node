const employeeDAO = require("../repository/employeeDAO");

async function registerEmployee({employee_id, username, password}){
    const result = await employeeDAO.registerEmployee({employee_id, username, password});

    if(!result){
        return {message: "Failed to add employee"};
    }

    return {message: "Employee added successfully", Employee: result};
}

module.exports = { registerEmployee };