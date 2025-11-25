const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const isVolunteer = require('../middlewares/isVolunteer');
const {uploadImage} = require('../Services/cloudinary');
const { UpdateStatusRequest, volunteerRequest, withdrawVolunteerRequest } = require('../controllers/requestControllers');
const router = express.Router();

router.post('/updatestatus/:id',isLoggedIn,isVolunteer,uploadImage.array("images",10),UpdateStatusRequest);
router.post('/volunteerrequest/:id',isLoggedIn,volunteerRequest);
router.put('/withdrawrequest/:id',isLoggedIn,withdrawVolunteerRequest);

module.exports = router;