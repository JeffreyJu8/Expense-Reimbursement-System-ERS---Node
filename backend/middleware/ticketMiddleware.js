async function validateTicketMiddleware(req, res, next){
    const jsonBody = req.body;
    
    // description, type, amount
    if(!jsonBody.description){
        return res.status(400).json({
            message: "Please put in a description!"
        });
    }

    if(!jsonBody.type){
        return res.status(400).json({
            message: "Please indicate the type!"
        });
    }

    if(!jsonBody.amount){
        return res.status(400).json({
            message: "Please indicate amount!"
        });
    }

    next();
}


module.exports = validateTicketMiddleware;

