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

const updateProfileImage = async(req,res)=>{
    const userId = req.user.userId;
    const image = req.file;
    if(!image){
        return res.status(400).json({
            message:"Image is required"
        })
        }
    const user = await User.findById(userId).select("-password");
    if(!user){
        return res.status(404).json({
            message:"User Not Found"
        })
    }
    user.profile_image = image.path;
    await user.save();
    return res.status(200).json({
        message:"Profile Image Updated Successfully",
        user
    })
}




module.exports = {
    getUser,
    updateProfileImage
}