const mongoose = require('mongoose');

const cropAnalyticsSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmLocation', required: true },
    cropType: { type: String, required: true },
    yieldEstimate: { type: Number, default: 0 },
    healthScore: { type: Number, default: 0 },
    diseaseIncidents: { type: Number, default: 0 },
    stressIndex: { type: Number, default: 0 },
    analytics: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CropAnalytics', cropAnalyticsSchema);
