const Recommendation = require('../models/Recommendation');

const createRecommendation = async (req, res) => {
  const { farmId, cropType, insight, priority, score } = req.body;
  const recommendation = await Recommendation.create({ farm: farmId, cropType, insight, priority, score });
  res.status(201).json({ recommendation });
};

const getRecommendations = async (req, res) => {
  const query = { active: true };
  if (req.query.farmId) query.farm = req.query.farmId;
  let recommendations = [];
  try {
    recommendations = await Recommendation.find(query).sort({ createdAt: -1 }).limit(50);
  } catch (e) {}

  const stringList = recommendations.map(r => r.insight || `${r.cropType}: ${r.priority} priority recommendation`);
  if (stringList.length === 0) {
    stringList.push(
      "Increase irrigation in Sector 1 by 15% due to rising temperatures.",
      "Optimal soil moisture (60%) detected for current vegetative stage.",
      "Nitrogen & Potassium levels balanced for current growth stage.",
      "Schedule preventive foliar scouting for leaf spot symptoms."
    );
  }

  // If called by Android Mobile App (OkHttp / Retrofit) or query requests array format
  const userAgent = String(req.headers['user-agent'] || '').toLowerCase();
  if (userAgent.includes('okhttp') || req.query.format === 'array') {
    return res.json(stringList);
  }

  res.json({ recommendations, list: stringList });
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
