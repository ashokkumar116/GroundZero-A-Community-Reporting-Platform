const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const { reviewVolunteerRequest, reviewStatusUpdateRequest, getUsers } = require("../controllers/adminControllers");

const router = express.Router();

router.post("/review/volunteerrequest/:id",isAdmin,reviewVolunteerRequest);
router.post('/review/statusupdaterequest/:id',isAdmin,reviewStatusUpdateRequest);
router.get('/users',isAdmin,getUsers);

module.exports = router;