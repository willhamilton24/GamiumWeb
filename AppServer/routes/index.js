const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ctrl')

// GET Homepage
router.get('/', ctrl.homepage);

module.exports = router;
