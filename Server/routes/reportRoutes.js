const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const uploadImage = require('../Services/cloudinary');
const router = express.Router();
const { createReport, fetchReports, UpdateStatusRequest } = require('../controllers/reportControllers');
const isVolunteer = require('../middlewares/isVolunteer');

router.post('/createreport',isLoggedIn,uploadImage.array("images",10),createReport);
router.get('/fetchreports',fetchReports);
router.post('/updatestatusrequest/:id',isLoggedIn,isVolunteer,uploadImage.array("images",10),UpdateStatusRequest);



module.exports = router;