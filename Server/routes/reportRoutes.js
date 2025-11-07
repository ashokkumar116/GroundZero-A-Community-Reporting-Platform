const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const uploadImage = require('../Services/cloudinary');
const router = express.Router();
const { createReport, fetchReports, fetchSingleReport } = require('../controllers/reportControllers');

router.post('/createreport',isLoggedIn,uploadImage.array("images",10),createReport);
router.get('/fetchreports',fetchReports);
router.get('/fetchsingle/:id',isLoggedIn,fetchSingleReport);




module.exports = router;