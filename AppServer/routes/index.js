const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ctrl')

// GET Homepage
router.get('/', ctrl.homepage);

// GET Game Page
router.get('/game', ctrl.game);

module.exports = router;
