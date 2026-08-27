const SensorData = require('../models/SensorData');
const FarmLocation = require('../models/FarmLocation');

const createSensorReading = async (req, res) => {
  const { farmId, sensorType, value, unit, metadata, temperature, humidity, soilMoisture, soilPh, nitrogen, phosphorus, potassium, userEmail } = req.body;
  let farm = null;
  if (farmId) {
    try {
      farm = await FarmLocation.findById(farmId);
    } catch (e) {}
  }

  const reading = await SensorData.create({
    farm: farm ? farm._id : undefined,
    userEmail: userEmail || req.user?.email || 'farmer@agroai.com',
    sensorType: sensorType || 'Multi-Sensor Hub',
    value: value !== undefined ? value : temperature,
    unit: unit || '°C',
    temperature: temperature !== undefined ? Number(temperature) : 28.5,
    humidity: humidity !== undefined ? Number(humidity) : 65.0,
    soilMoisture: soilMoisture !== undefined ? Number(soilMoisture) : 60.0,
    soilPh: soilPh !== undefined ? Number(soilPh) : 6.5,
    nitrogen: nitrogen !== undefined ? Number(nitrogen) : 140,
    phosphorus: phosphorus !== undefined ? Number(phosphorus) : 45,
    potassium: potassium !== undefined ? Number(potassium) : 190,
    metadata: metadata || {},
    recordedAt: req.body.recordedAt || req.body.timestamp ? new Date(req.body.recordedAt || req.body.timestamp) : new Date(),
  });

  if (farm) {
    await FarmLocation.findByIdAndUpdate(farm._id, { $inc: { sensorCount: 1 } });
  }

  res.status(201).json({ success: true, reading });
};

const getSensorHistory = async (req, res) => {
  const query = {};
  if (req.query.farmId) {
    query.farm = req.query.farmId;
  }

  const readings = await SensorData.find(query).sort({ recordedAt: -1, createdAt: -1 }).limit(100);
  res.json({ readings });
};

const getLatestSensors = async (req, res) => {
  const readings = await SensorData.find().sort({ recordedAt: -1, createdAt: -1 }).limit(50).populate('farm', 'name');
  res.json({ readings });
};

const getCurrentSensorData = async (req, res) => {
  try {
    const latest = await SensorData.findOne().sort({ recordedAt: -1, createdAt: -1 });
    if (latest && latest.temperature !== undefined) {
      return res.json({
        temperature: latest.temperature,
        humidity: latest.humidity,
        soilMoisture: latest.soilMoisture,
        soilPh: latest.soilPh,
        nitrogen: latest.nitrogen || 140,
        phosphorus: latest.phosphorus || 45,
        potassium: latest.potassium || 190,
        timestamp: latest.recordedAt || latest.createdAt,
      });
    }
  } catch (e) {}

  res.json({
    temperature: 28.5,
    humidity: 65.0,
    soilMoisture: 60.0,
    soilPh: 6.5,
    nitrogen: 140,
    phosphorus: 45,
    potassium: 190,
  });
};

module.exports = { createSensorReading, getSensorHistory, getLatestSensors, getCurrentSensorData };

