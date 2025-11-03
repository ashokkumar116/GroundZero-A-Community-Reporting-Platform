const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const { reviewVolunteerRequest, reviewStatusUpdateRequest } = require("../controllers/adminControllers");

const router = express.Router();

router.post("/review/volunteerrequest/:id",isAdmin,reviewVolunteerRequest);
router.post('/review/statusupdaterequest/:id',isAdmin,reviewStatusUpdateRequest);

module.exports = router;