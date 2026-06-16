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
  const weather = await WeatherData.find(query).sort({ createdAt: -1 }).populate('farm', 'name');
  res.json({ weather });
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
