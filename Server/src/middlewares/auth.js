const jwt = require("jsonwebtoken");

const authentication = async (req , res , next) => {
    try {
        let token = req.headers.authorization;

        if(!token){
            return res.status(401).json({msg : "Login token is required"});
        }

        token = token.split(" ")[1];

        const decodeToken = jwt.verify(token , process.env.JWT_SECRET_KEY);

        if(decodeToken){
            req.userId = decodeToken.id,
            req.role = decodeToken.role
        }
        else{
            return res.status(401).json({msg : "Invalid Or Expired Token"})
        }
        next();
    
    } catch (error) {
         console.log(error);
        return res.status(500).json({msg : "Intenal server Error"});
    }
};

const ownerAuth = async (req , res , next) => {
    try {
        if(req.role !== "owner"){
            return res.status(403).json({msg : "Access Denied Only Owner Can Accesss"})
        }
        next();
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg : "Intenal server Error"});
    
    }

}

const adminAuth = async (req , res , next) => {
    try {
        if(req.role !== "admin"){
            return res.status(403).json({msg : "Access Denied Only Admin Can Accesss"})
        }
        next();  
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg : "Intenal server Error"});
    }

}


module.exports = {authentication  , ownerAuth  , adminAuth};