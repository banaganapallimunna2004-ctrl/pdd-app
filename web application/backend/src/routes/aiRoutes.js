const express = require('express');
const { chat } = require('../controllers/aiController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();
router.post('/chat', optionalAuth, chat);

module.exports = router;