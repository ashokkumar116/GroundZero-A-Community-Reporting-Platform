const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const { getUser, updateProfileImage } = require('../controllers/userControllers');
const uploadImage = require('../Services/cloudinary');
const router = express.Router();

router.get('/getuser/:id',isLoggedIn,getUser);
router.post('/updateprofileimage',isLoggedIn,uploadImage.single("image"),updateProfileImage);







module.exports = router;