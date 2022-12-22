const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const router = express.Router();
const auth = require('./auth');


router.use('/auth',auth);




module.exports = router;