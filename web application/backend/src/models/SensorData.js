const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmLocation', required: false },
    userEmail: { type: String },
    sensorType: { type: String, default: 'Multi-Sensor Hub' },
    value: { type: Number },
    unit: { type: String },
    temperature: { type: Number, default: 28.5 },
    humidity: { type: Number, default: 65.0 },
    soilMoisture: { type: Number, default: 60.0 },
    soilPh: { type: Number, default: 6.5 },
    nitrogen: { type: Number, default: 140 },
    phosphorus: { type: Number, default: 45 },
    potassium: { type: Number, default: 190 },
    metadata: { type: Object, default: {} },
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

sensorDataSchema.index({ recordedAt: -1 });
sensorDataSchema.index({ userEmail: 1, recordedAt: -1 });

module.exports = mongoose.model('SensorData', sensorDataSchema);

