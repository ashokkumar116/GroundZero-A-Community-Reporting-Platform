const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const generateDescription = require('../controllers/aiControllers');
const router = express.Router();

router.post('/generatedesc',isLoggedIn,generateDescription)





module.exports = router;