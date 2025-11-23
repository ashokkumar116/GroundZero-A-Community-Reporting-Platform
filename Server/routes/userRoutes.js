const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const { getUser, updateProfileImage, updateProfile, getVolunteerWorks, getUserReports } = require('../controllers/userControllers');
const {uploadImage} = require('../Services/cloudinary');
const router = express.Router();

router.get('/getuser/:id',isLoggedIn,getUser);
router.post('/updateprofileimage',isLoggedIn,uploadImage.single("image"),updateProfileImage);
router.put('/updateprofile',isLoggedIn,updateProfile);
router.get('/volunteer-works/:id',isLoggedIn,getVolunteerWorks);
router.get('/user-reports/:id',isLoggedIn,getUserReports)








module.exports = router;