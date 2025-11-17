const cloudinary = require("cloudinary").v2;
require('dotenv').config();
const multer = require("multer");
const {CloudinaryStorage} = require('multer-storage-cloudinary')


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

const imageStorage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"GroundZero",
        allowed_formats:['jpg', 'png', 'jpeg', 'webp']
    }
})


const uploadImage = multer({storage:imageStorage});

module.exports = {
    uploadImage,
    cloudinary
}