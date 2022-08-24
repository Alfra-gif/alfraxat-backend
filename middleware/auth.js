const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    console.log(req.headers)
    const bearer_header = req.headers["authorization"];

    if(typeof bearer_header !== "undefined"){
        const token = bearer_header.split(" ")[1];
        req.token = token;

        jwt.verify(req.token, "secretKey", (error, authData) => {
            if (error){
                res.sendStatus(403);
            } else {
                authData.user.password = undefined
                res.json(
                    {
                        menssage: "post created",
                        authData: authData
                    }
                )
            }
        })
    
    } else {
        res.sendStatus(403);
    }

}