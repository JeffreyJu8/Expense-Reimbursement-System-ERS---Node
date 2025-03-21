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


async function getUser(username){
    const result = await employeeDAO.getUser(username);

    if(!result){
      return null;
    }

    return result;
}

async function updateEmployeeRole(id, newRole){
    const result = await employeeDAO.updateEmployeeRole(id, newRole);

    if(!result){
        return false;
    }

    return result;
}

async function getAllEmployee(){
    const result = await employeeDAO.getAllEmployee();

    return result;
}

async function editUserProfile(id, newUsername, newPassword, isPassword){
  let hashedPassword;

  if(isPassword){
    const saltRounds = 10;
    hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  }
  else{
    hashedPassword = newPassword;
  }
  
  const result = await employeeDAO.editUserProfile(id, newUsername, hashedPassword);

  return result;
}

module.exports = { registerEmployee, getUser, updateEmployeeRole, getAllEmployee, editUserProfile };