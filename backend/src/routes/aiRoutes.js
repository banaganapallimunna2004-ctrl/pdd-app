const express = require('express');
const { chat } = require('../controllers/aiController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
router.use(verifyToken);
router.post('/chat', chat);

module.exports = router;