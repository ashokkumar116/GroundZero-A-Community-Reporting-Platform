const User = require("../models/User");

const getUser = async(req,res)=>{
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    if(!user){
        return res.status(404).json({
            message:"User Not Found"
        })
    } 

    return res.status(200).json({
        message:"User Fetched Successfully",
        user
    })

}




module.exports = {
    getUser
}