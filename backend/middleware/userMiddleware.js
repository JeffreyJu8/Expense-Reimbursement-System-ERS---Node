async function validateUserMiddleware(req, res, next){
    const jsonBody = req.body;

    if(!jsonBody.id){
        return res.status(400).json({
            message: "Please input the employee id!"
        });
    }

    if(!jsonBody.role){
        return res.status(400).json({
            message: "Please indicate the new role!"
        });
    }

    next();
}


module.exports = validateUserMiddleware;
