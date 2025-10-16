const bcrypt = require('bcrypt');
const { User } = require('../models/User');

const createUser = async(req,res)=>{
    const {username,email,password} = req.body;
    if(!username || !email || !password){
        return res.status(400).json({message: "Please provide all the details"});
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message: "User already exists"});
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password,salt);

    const profile_image = `https://api.dicebear.com/9.x/adventurer/svg?seed=${username}`;


    try {
        const user = new User({
            username,
            email,
            password: hashedPassword,
            profile_image
        })
        await user.save();
        return res.status(201).json({message:"User created successfully"});
        
    } catch (error) {
        console.log("Error while creating user",error);
        return res.status(500).json({message: "Internal Server Error"});
    }

}

module.exports = {
    createUser
}