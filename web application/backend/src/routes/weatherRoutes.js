const express = require('express');
const { createWeatherData, getWeatherData, updateWeatherData, deleteWeatherData } = require('../controllers/weatherController');
const { verifyToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Public / Mobile weather endpoint
router.get('/', optionalAuth, getWeatherData);

// Protected management endpoints
router.use(verifyToken);
router.post('/', createWeatherData);
router.patch('/:id', updateWeatherData);
router.delete('/:id', deleteWeatherData);

module.exports = router;

