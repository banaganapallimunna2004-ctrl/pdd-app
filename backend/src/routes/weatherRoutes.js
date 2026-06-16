const express = require('express');
const { createWeatherData, getWeatherData, updateWeatherData, deleteWeatherData } = require('../controllers/weatherController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
router.use(verifyToken);

router.post('/', createWeatherData);
router.get('/', getWeatherData);
router.patch('/:id', updateWeatherData);
router.delete('/:id', deleteWeatherData);

module.exports = router;
