const mongoose = require('mongoose');

const farmLocationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String },
    zoneType: { type: String, enum: ['Crop Zone', 'Irrigation Area', 'Storage', 'Monitoring Hub'], default: 'Crop Zone' },
    coordinates: {
      type: { type: String, enum: ['Polygon', 'Point'], default: 'Polygon' },
      coordinates: { type: Array, required: true },
    },
    sensorCount: { type: Number, default: 0 },
    satelliteViewUrl: { type: String },
    cropType: { type: String, default: 'Wheat' },
  },
  { timestamps: true }
);

farmLocationSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('FarmLocation', farmLocationSchema);
