const Recommendation = require('../models/Recommendation');

const createRecommendation = async (req, res) => {
  const { farmId, cropType, insight, priority, score } = req.body;
  const recommendation = await Recommendation.create({ farm: farmId, cropType, insight, priority, score });
  res.status(201).json({ recommendation });
};

const getRecommendations = async (req, res) => {
  const query = { active: true };
  if (req.query.farmId) query.farm = req.query.farmId;
  const recommendations = await Recommendation.find(query).sort({ createdAt: -1 }).limit(50);
  res.json({ recommendations });
};

const updateRecommendation = async (req, res) => {
  const recommendation = await Recommendation.findById(req.params.id);
  if (!recommendation) return res.status(404).json({ message: 'Recommendation not found.' });
  Object.assign(recommendation, req.body);
  await recommendation.save();
  res.json({ recommendation });
};

const deleteRecommendation = async (req, res) => {
  const recommendation = await Recommendation.findById(req.params.id);
  if (!recommendation) return res.status(404).json({ message: 'Recommendation not found.' });
  await recommendation.remove();
  res.json({ message: 'Recommendation deleted.' });
};

module.exports = { createRecommendation, getRecommendations, updateRecommendation, deleteRecommendation };
