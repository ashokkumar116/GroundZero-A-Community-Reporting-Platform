const express = require('express');
const { createUser, loginUser, logoutUser } = require('../controllers/authControllers');
const router = express.Router();

router.post('/register',createUser);
router.post('/login',loginUser);
router.post('/logout',logoutUser);



module.exports = router;