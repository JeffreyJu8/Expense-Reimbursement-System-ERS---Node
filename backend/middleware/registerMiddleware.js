const employeeService = require("../service/employeeService")


async function validateRegisterMiddleware(req, res, next){
    const jsonBody = req.body;

    if(!validateRegister(jsonBody)){
        return res.status(400).json({
            message: "Invalid username or password!"
        });
    }

    const isUsernameValid = await employeeService.getUser(jsonBody.username);
    if(isUsernameValid){
        return res.status(400).json({
            message: "Username invalid"
        });
    }

    if(!jsonBody.password){
        return res.status(400).json({
            message: "Invalid password!"
        });
    }

    next();
}


async function validateRegister(data){
    return (data.username && data.password)
}

module.exports = validateRegisterMiddleware;
