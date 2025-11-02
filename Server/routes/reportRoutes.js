const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const uploadImage = require('../Services/cloudinary');
const router = express.Router();
const { createReport } = require('../controllers/reportControllers');

router.post('/createreport',isLoggedIn,uploadImage.array("images",10),createReport);



module.exports = router;