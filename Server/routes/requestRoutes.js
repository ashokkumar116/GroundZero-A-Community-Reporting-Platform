const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const isVolunteer = require('../middlewares/isVolunteer');
const uploadImage = require('../Services/cloudinary');
const { UpdateStatusRequest } = require('../controllers/requestControllers');
const router = express.Router();

router.post('/updatestatus/:id',isLoggedIn,isVolunteer,uploadImage.array("images",10),UpdateStatusRequest);

module.exports = router;