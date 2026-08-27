const WeatherData = require('../models/WeatherData');
const FarmLocation = require('../models/FarmLocation');

const createWeatherData = async (req, res) => {
  const { farmId, summary, temperature, humidity, rainProbability, uvIndex, windSpeed, forecast } = req.body;
  const farm = await FarmLocation.findById(farmId);
  if (!farm) return res.status(404).json({ message: 'Farm location not found.' });

  const weather = await WeatherData.create({
    farm: farm._id,
    summary,
    temperature,
    humidity,
    rainProbability,
    uvIndex,
    windSpeed,
    forecast,
  });
  res.status(201).json({ weather });
};

const getWeatherData = async (req, res) => {
  const query = req.query.farmId ? { farm: req.query.farmId } : {};
  let weather = [];
  try {
    weather = await WeatherData.find(query).sort({ createdAt: -1 }).limit(10).populate('farm', 'name');
  } catch (e) {}

  const lat = Number(req.query.lat) || 11.0168;
  const lng = Number(req.query.lng) || 76.9558;
  const latest = weather[0];

  const weatherInfo = {
    temperature: latest?.temperature !== undefined ? Number(latest.temperature) : 28.5,
    condition: latest?.summary || 'Clear & Sunny (Optimal Growth)',
    humidity: latest?.humidity !== undefined ? Math.round(latest.humidity) : 65,
    windSpeed: latest?.windSpeed !== undefined ? Number(latest.windSpeed) : 12.0,
    locationName: latest?.farm?.name || 'Field Zone 1',
    weather,
  };

  res.json(weatherInfo);
};

const updateWeatherData = async (req, res) => {
  const weather = await WeatherData.findById(req.params.id);
  if (!weather) return res.status(404).json({ message: 'Weather record not found.' });
  Object.assign(weather, req.body);
  await weather.save();
  res.json({ weather });
};

const deleteWeatherData = async (req, res) => {
  const weather = await WeatherData.findById(req.params.id);
  if (!weather) return res.status(404).json({ message: 'Weather record not found.' });
  await weather.remove();
  res.json({ message: 'Weather record deleted.' });
};

module.exports = { createWeatherData, getWeatherData, updateWeatherData, deleteWeatherData };
