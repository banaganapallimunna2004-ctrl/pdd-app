const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');

// Sub-route aggregation (optional, main routes are in app.js)
router.use('/auth', authRoutes);

module.exports = router;
