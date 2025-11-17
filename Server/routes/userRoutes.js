const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const { getUser, updateProfileImage, updateProfile } = require('../controllers/userControllers');
const {uploadImage} = require('../Services/cloudinary');
const router = express.Router();

router.get('/getuser/:id',isLoggedIn,getUser);
router.post('/updateprofileimage',isLoggedIn,uploadImage.single("image"),updateProfileImage);
router.put('/updateprofile',isLoggedIn,updateProfile);







module.exports = router;