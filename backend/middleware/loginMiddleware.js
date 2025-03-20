const bcrypt = require("bcrypt");
const employeeService = require("../service/employeeService");


async function validateLoginMiddleware(req, res, next){
    const jsonBody = req.body;

    if(!validateLogin(jsonBody)){
        return res.status(400).json({
            message: "Invalid username or password!"
        });
    }

    const isUsernameValid = await validateUsername(jsonBody);
    if(!isUsernameValid){
        return res.status(400).json({
            message: "Username does not exist"
        });
    }

    const isPasswordCorrect = await validatePassword(jsonBody);
    if(!isPasswordCorrect){
        return res.status(400).json({
            message: "Incorrect password!"
        });
    }

    next();
}


async function validateLogin(data){
    return (data.username && data.password)
}

async function validateUsername(data){
    const user = await employeeService.getUser(data.username);

    if(!user){
        return false;
    }
    
    return true;
}

async function validatePassword(data){
    const user = await employeeService.getUser(data.username);

    if(user && (await bcrypt.compare(data.password, user.password))){
        return true;
    }
    else{
        return false;
    }
}

module.exports = validateLoginMiddleware;
