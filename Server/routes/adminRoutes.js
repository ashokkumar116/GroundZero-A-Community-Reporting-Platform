const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const { reviewVolunteerRequest } = require("../controllers/adminControllers");

const router = express.Router();

router.post("/reviewvolunteerrequest/:id",isAdmin,reviewVolunteerRequest);

module.exports = router;