const mongoose = require('mongoose');

const diseaseReportSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmLocation', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cropType: { type: String, required: true, enum: ['Tomato', 'Potato', 'Corn', 'Rice', 'Cotton', 'Wheat'] },
    diseaseName: { type: String, required: true },
    confidence: { type: Number, required: true, min: 0, max: 100 },
    severity: { type: String, required: true, enum: ['Low', 'Medium', 'High', 'Critical'] },
    treatment: { type: String, required: true },
    prevention: { type: String, required: true },
    imageUrl: { type: String },
    hotspot: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    status: { type: String, enum: ['Open', 'Resolved', 'Investigating'], default: 'Open' },
  },
  { timestamps: true }
);

diseaseReportSchema.index({ hotspot: '2dsphere' });

module.exports = mongoose.model('DiseaseReport', diseaseReportSchema);
