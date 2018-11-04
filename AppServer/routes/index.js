const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false});
const ctrl = require('../controllers/ctrl')

// GET Homepage
router.get('/', ctrl.homepage);

// GET Bug Report
router.get('/contact', ctrl.bugreport)

// Search Redirect
router.post('/sr', ctrl.sRedirect);

// GET Search Results
router.get('/search/:query/', ctrl.search);

// GET Game Page
router.get('/game/:appid', ctrl.game);

module.exports = router;
