const jwt = require('jsonwebtoken');


const isLoggedIn = async (req,res,next)=>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: "Unauthorized"});
    }

    try {
        const decoded = await jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message: "Unauthorized"});
    }

}

module.exports = isLoggedIn;