const mongoose = require('mongoose');

const diseaseReportSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmLocation', required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    userEmail: { type: String },
    cropType: { type: String, default: 'Crop' },
    diseaseName: { type: String, required: true },
    scientificName: { type: String, default: 'N/A' },
    confidence: { type: Number, default: 90, min: 0, max: 100 },
    severity: { type: String, default: 'Medium' },
    treatment: { type: String, default: 'Apply organic bio-fungicide or consult agricultural extension.' },
    prevention: { type: String, default: 'Maintain optimal spacing and foliage dryness.' },
    symptoms: [{ type: String }],
    treatmentSuggestions: [{ type: String }],
    preventionTips: [{ type: String }],
    imageUrl: { type: String, default: '' },
    hotspot: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    status: { type: String, enum: ['Open', 'Resolved', 'Investigating'], default: 'Open' },
  },
  { timestamps: true }
);

diseaseReportSchema.index({ hotspot: '2dsphere' });
diseaseReportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('DiseaseReport', diseaseReportSchema);

