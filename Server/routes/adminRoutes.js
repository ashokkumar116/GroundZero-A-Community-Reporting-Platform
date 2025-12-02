const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const { reviewVolunteerRequest, reviewStatusUpdateRequest, getUsers, editUser, makeAdmin, searchUsers, removeAdmin, getReports, searchReports,editReport, deleteReport, getVolunteerRequests, getStatusUpdateRequests } = require("../controllers/adminControllers");
const { uploadImage } = require("../Services/cloudinary");

const router = express.Router();

router.put("/review/volunteerrequest/:id",isAdmin,reviewVolunteerRequest);
router.put('/review/statusupdaterequest/:id',isAdmin,reviewStatusUpdateRequest);
router.get('/users',isAdmin,getUsers);
router.put('/edituser/:id',isAdmin,editUser);
router.put('/makeadmin/:id',isAdmin,makeAdmin);
router.put('/removeadmin/:id',isAdmin,removeAdmin);
router.get('/searchusers',isAdmin,searchUsers);
router.get('/reports',isAdmin,getReports);
router.get('/searchreports',isAdmin,searchReports);
router.put('/editreport/:id',isAdmin,uploadImage.array('images',10),editReport);
router.delete('/deletereport/:id',isAdmin,deleteReport);
router.get('/volunteerrequests',isAdmin,getVolunteerRequests);
router.get('/statusupdaterequests',isAdmin,getStatusUpdateRequests);

module.exports = router;