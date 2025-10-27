const express = require('express');
const { createUser, loginUser, logoutUser, getMe } = require('../controllers/authControllers');
const isLoggedIn = require('../middlewares/isLoggedIn');
const router = express.Router();

router.post('/register',createUser);
router.post('/login',loginUser);
router.post('/logout',logoutUser);
router.get('/me',isLoggedIn,getMe)



module.exports = router;