const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmLocation', required: true },
    sensorType: { type: String, required: true, enum: ['Temperature', 'Humidity', 'Soil Moisture', 'Soil pH', 'Water Level', 'Light Intensity'] },
    value: { type: Number, required: true },
    unit: { type: String, required: true },
    metadata: { type: Object, default: {} },
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SensorData', sensorDataSchema);
