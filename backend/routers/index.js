const express = require('express');
const userRoute = require('./user.js');
const router = express.Router();

router.get('/user', userRoute);

module.exports = router;
