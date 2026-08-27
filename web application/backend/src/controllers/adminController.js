const User = require('../models/User');
const DiseaseReport = require('../models/DiseaseReport');
const SensorData = require('../models/SensorData');
const Recommendation = require('../models/Recommendation');
const AdminLog = require('../models/AdminLog');

const getMetrics = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalReports = await DiseaseReport.countDocuments();
  const activeSensors = await SensorData.distinct('farm').then((ids) => ids.length);
  const recommendations = await Recommendation.find({ active: true }).limit(20);
  res.json({ totalUsers, totalReports, activeSensors, recommendations });
};

const getSystemLogs = async (req, res) => {
  const logs = await AdminLog.find().sort({ createdAt: -1 }).limit(100).populate('user', 'name email');
  res.json({ logs });
};

const createLog = async (req, res) => {
  const { action, details } = req.body;
  const log = await AdminLog.create({ action, details, user: req.user._id, ipAddress: req.ip });
  res.status(201).json({ log });
};

module.exports = { getMetrics, getSystemLogs, createLog };
