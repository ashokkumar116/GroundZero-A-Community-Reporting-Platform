const jwt = require('jsonwebtoken');

const isAdmin = async(req,res,next)=>{
    const token = req.cookies?.token;

    if(!token){
        return res.status(401).json({message: "Unauthorized"});
    }

    try {
        const decoded = await jwt.verify(token,process.env.JWT_SECRET);
        if(decoded.role !== "admin"){
            return res.status(403).json({message: "Forbidden: Admins Only"});
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message: "Unauthorized"});
    }
}