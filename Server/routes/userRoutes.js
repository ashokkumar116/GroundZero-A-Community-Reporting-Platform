const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const { getUser } = require('../controllers/userControllers');
const router = express.Router();

router.get('/getuser/:id',isLoggedIn,getUser);







module.exports = router;