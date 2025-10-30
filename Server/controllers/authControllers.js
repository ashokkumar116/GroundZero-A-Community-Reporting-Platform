const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

    const profile_image = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;


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

const loginUser = async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message: "Please provide all the details"});
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message: "User does not exist"});
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(400).json({message: "Invalid credentials"});
    };

    const token = await jwt.sign({
        userId: user._id,
        role: user.role
    },process.env.JWT_SECRET,{
        expiresIn: '1d'
    })

   res.cookie('token', token,{
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === "production" ?'None' : 'Strict',
    maxAge: 24 * 60 * 60 * 1000 
   });

   await User.updateOne({_id:user._id},{last_login:new Date()});


    return res.status(200).json({
        message: "Login successful",
        token,
        user:{ 
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            profile_image: user.profile_image,
        }
    });
}

const getMe = async(req,res)=>{
    const {userId} = req.user;
    const user = await User.findById(userId).select('-password');
    if(!user){
        return res.status(404).json({message: "User not found"});
    }
    return res.status(200).json({user});
    
}

const logoutUser = async(req,res)=>{
    res.clearCookie('token');
    return res.status(200).json({message: "Logout successful"});
}

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    getMe
}