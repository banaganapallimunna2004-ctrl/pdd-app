const mongoose = require('mongoose');

const forecastSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    temperature: { type: Number, required: true },
    precipitation: { type: Number, required: true },
    uvIndex: { type: Number },
    windSpeed: { type: Number },
  },
  { _id: false }
);

const weatherDataSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmLocation', required: true },
    provider: { type: String, default: 'OpenWeather' },
    summary: { type: String },
    temperature: { type: Number },
    humidity: { type: Number },
    rainProbability: { type: Number },
    uvIndex: { type: Number },
    windSpeed: { type: Number },
    forecast: [forecastSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('WeatherData', weatherDataSchema);
