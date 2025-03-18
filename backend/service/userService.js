const userDAO = require("../repository/userDAO");

async function updateEmployeeRole(id, newRole){
    const result = await userDAO.updateEmployeeRole(id, newRole);

    if(!result){
        return false;
    }

    return result;
}

async function getAllEmployee(){
    const result = await userDAO.getAllEmployee();

    return result;
}

module.exports = { updateEmployeeRole, getAllEmployee };