const SensorData = require('../models/SensorData');
const FarmLocation = require('../models/FarmLocation');

const createSensorReading = async (req, res) => {
  const { farmId, sensorType, value, unit, metadata } = req.body;
  const farm = await FarmLocation.findById(farmId);
  if (!farm) return res.status(404).json({ message: 'Farm location not found.' });

  const reading = await SensorData.create({
    farm: farm._id,
    sensorType,
    value,
    unit,
    metadata,
  });

  await FarmLocation.findByIdAndUpdate(farm._id, { $inc: { sensorCount: 1 } });

  res.status(201).json({ reading });
};

const getSensorHistory = async (req, res) => {
  const query = { farm: req.query.farmId };
  if (req.user.role !== 'Admin') {
    query.farm = req.query.farmId;
  }

  const readings = await SensorData.find(query).sort({ recordedAt: -1 }).limit(100);
  res.json({ readings });
};

const getLatestSensors = async (req, res) => {
  const readings = await SensorData.find().sort({ recordedAt: -1 }).limit(50).populate('farm', 'name');
  res.json({ readings });
};

module.exports = { createSensorReading, getSensorHistory, getLatestSensors };
