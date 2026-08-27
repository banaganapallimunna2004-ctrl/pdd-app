const mongoose = require('mongoose');

const farmLocationSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Green Valley Agro Farm' },
    farmName: { type: String, default: 'Green Valley Agro Farm' },
    locationAddress: { type: String, default: 'Field Zone 1' },
    userEmail: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    description: { type: String, default: 'Precision Agriculture Zone' },
    zoneType: { type: String, enum: ['Crop Zone', 'Irrigation Area', 'Storage', 'Monitoring Hub'], default: 'Crop Zone' },
    latitude: { type: Number, default: 11.0168 },
    longitude: { type: Number, default: 76.9558 },
    coordinates: {
      type: { type: String, default: 'Point' },
      coordinates: { type: Array, default: [76.9558, 11.0168] },
    },
    farmSizeAcres: { type: Number, default: 5.0 },
    primaryCrops: { type: String, default: 'Rice, Tomato, Cotton' },
    soilType: { type: String, default: 'Black Soil' },
    irrigationSystem: { type: String, default: 'Drip Irrigation' },
    sensorCount: { type: Number, default: 4 },
    satelliteViewUrl: { type: String },
    cropType: { type: String, default: 'Rice, Tomato' },
    status: { type: String, default: 'Active Monitoring' },
  },
  { timestamps: true }
);

farmLocationSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('FarmLocation', farmLocationSchema);

