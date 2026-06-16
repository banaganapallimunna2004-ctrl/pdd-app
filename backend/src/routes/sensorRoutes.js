const express = require('express');
const { createSensorReading, getSensorHistory, getLatestSensors } = require('../controllers/sensorController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
router.use(verifyToken);

router.post('/', createSensorReading);
router.get('/', getSensorHistory);
router.get('/latest', getLatestSensors);

module.exports = router;
