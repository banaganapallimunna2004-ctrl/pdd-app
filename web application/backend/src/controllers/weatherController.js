const WeatherData = require('../models/WeatherData');
const FarmLocation = require('../models/FarmLocation');

// Map WMO Weather Codes to Human-Readable conditions
function mapWmoCode(code) {
  const codes = {
    0: { condition: 'Clear Sky', icon: 'Sun', summary: 'Sunny and clear conditions with optimal solar radiance.' },
    1: { condition: 'Mainly Clear', icon: 'CloudSun', summary: 'Mainly clear skies with light scattered clouds.' },
    2: { condition: 'Partly Cloudy', icon: 'CloudSun', summary: 'Partly cloudy weather with moderate sunlight.' },
    3: { condition: 'Overcast', icon: 'Cloud', summary: 'Overcast skies with reduced direct solar radiation.' },
    45: { condition: 'Foggy', icon: 'Wind', summary: 'Foggy conditions and lower atmospheric visibility.' },
    48: { condition: 'Depositing Rime Fog', icon: 'Wind', summary: 'Dense rime fog with high surface condensation.' },
    51: { condition: 'Light Drizzle', icon: 'CloudRain', summary: 'Light intermittent drizzle; high air humidity.' },
    53: { condition: 'Moderate Drizzle', icon: 'CloudRain', summary: 'Consistent drizzle across farm zones.' },
    55: { condition: 'Dense Drizzle', icon: 'CloudRain', summary: 'Heavy drizzle with saturated surface air.' },
    61: { condition: 'Slight Rain', icon: 'CloudRain', summary: 'Light rain showers. Good natural soil hydration.' },
    63: { condition: 'Moderate Rain', icon: 'CloudRain', summary: 'Moderate rainfall. Delay regular irrigation.' },
    65: { condition: 'Heavy Rain', icon: 'CloudRain', summary: 'Heavy rain showers. Check drainage channels.' },
    71: { condition: 'Slight Snow', icon: 'CloudRain', summary: 'Cold frost and light snow flurries.' },
    80: { condition: 'Rain Showers', icon: 'CloudRain', summary: 'Passing convective rain showers.' },
    81: { condition: 'Moderate Showers', icon: 'CloudRain', summary: 'Sustained rain showers.' },
    82: { condition: 'Violent Showers', icon: 'CloudLightning', summary: 'Intense precipitation with strong gusty winds.' },
    95: { condition: 'Thunderstorm', icon: 'CloudLightning', summary: 'Thunderstorm activity detected. Secure equipment.' },
    96: { condition: 'Thunderstorm with Hail', icon: 'CloudLightning', summary: 'Severe storm with hail risk. Protect delicate crops.' },
  };
  return codes[code] || { condition: 'Partly Cloudy', icon: 'CloudSun', summary: 'Stable ambient agricultural conditions.' };
}

// Compute Agricultural Advisories from Live Meteorology
function generateAgroAdvisories(temp, humidity, rainProb, windSpeed, uvIndex) {
  // 1. Irrigation Advisory
  let irrigationStatus = 'Normal Irrigation Schedule';
  let irrigationColor = 'text-emerald-800 bg-emerald-50 border-emerald-200';
  let irrigationAdvisory = 'Soil moisture absorption rates are normal. Proceed with standard scheduled irrigation.';

  if (rainProb > 60) {
    irrigationStatus = 'Pause Irrigation (Rain Incoming)';
    irrigationColor = 'text-blue-800 bg-blue-50 border-blue-200';
    irrigationAdvisory = `Precipitation probability is ${rainProb}%. Delay irrigation by 24–48 hours to conserve water and prevent root rot.`;
  } else if (temp > 35 && humidity < 40) {
    irrigationStatus = 'High Heat / Drip Irrigation Urgent';
    irrigationColor = 'text-rose-800 bg-rose-50 border-rose-200';
    irrigationAdvisory = 'Extreme transpiration rate detected. Increase early morning or evening drip irrigation volume by 20–25%.';
  }

  // 2. Chemical Spraying Window Advisory
  let sprayWindowStatus = 'Optimal Spraying Window';
  let sprayWindowColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let sprayAdvisory = 'Wind speed and precipitation risks are low. Ideal window for foliar fertilizer and pesticide application.';

  if (windSpeed > 18) {
    sprayWindowStatus = 'Spray Drift Warning (High Winds)';
    sprayWindowColor = 'text-amber-700 bg-amber-50 border-amber-200';
    sprayAdvisory = `Wind speed is ${windSpeed} km/h (exceeds safe 15 km/h threshold). Postpone spraying to prevent chemical drift and wasted application.`;
  } else if (rainProb > 40) {
    sprayWindowStatus = 'Wash-off Risk (Rain Likely)';
    sprayWindowColor = 'text-rose-700 bg-rose-50 border-rose-200';
    sprayAdvisory = `Rain likelihood is ${rainProb}%. Avoid chemical applications to prevent immediate runoff wash-off.`;
  }

  // 3. Pest & Disease Alert
  let diseaseRisk = 'Low Disease Risk';
  let diseaseRiskColor = 'text-emerald-700';
  let diseaseAdvisory = 'Ambient microclimate is unfavorable for rapid fungal sporulation.';

  if (humidity > 80 && temp >= 20 && temp <= 30) {
    diseaseRisk = 'High Fungal Blight Risk';
    diseaseRiskColor = 'text-rose-700';
    diseaseAdvisory = 'High humidity combined with warm temperatures creates favorable conditions for Powdery Mildew and Leaf Spot. Inspect leaf undersides.';
  } else if (temp > 38) {
    diseaseRisk = 'Heat Stress & Sunscald Risk';
    diseaseRiskColor = 'text-amber-700';
    diseaseAdvisory = 'Thermal stress detected on tender canopy foliage. Ensure adequate soil moisture to buffer root zones.';
  }

  // 4. UV Index Classification
  let uvLabel = 'Low';
  if (uvIndex >= 11) uvLabel = 'Extreme';
  else if (uvIndex >= 8) uvLabel = 'Very High';
  else if (uvIndex >= 6) uvLabel = 'High';
  else if (uvIndex >= 3) uvLabel = 'Moderate';

  return {
    irrigationStatus,
    irrigationColor,
    irrigationAdvisory,
    sprayWindowStatus,
    sprayWindowColor,
    sprayAdvisory,
    diseaseRisk,
    diseaseRiskColor,
    diseaseAdvisory,
    uvLabel
  };
}

const getWeatherData = async (req, res) => {
  const lat = Number(req.query.lat) || 17.3850;
  const lng = Number(req.query.lng) || 78.4867;
  const farmId = req.query.farmId;

  let locationName = req.query.locationName || '';
  let liveWeather = null;

  try {
    // 1. Fetch live Open-Meteo High-Resolution Meteorological Data
    const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,wind_speed_10m_max&timezone=auto`;

    const weatherResponse = await fetch(weatherApiUrl);
    if (weatherResponse.ok) {
      liveWeather = await weatherResponse.json();
    }
  } catch (err) {
    console.warn('Live meteorological fetch warning:', err.message);
  }

  // 2. Perform Reverse Geocoding if locationName was not provided
  if (!locationName) {
    try {
      const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=12`;
      const geoRes = await fetch(geoUrl, {
        headers: { 'User-Agent': 'AgroAI-LivePrecisionApp/2.4' }
      });
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        const addr = geoData.address || {};
        const city = addr.city || addr.town || addr.village || addr.county || addr.suburb || addr.state_district || 'Local Farm Zone';
        const state = addr.state || '';
        const country = addr.country || '';
        locationName = [city, state, country].filter(Boolean).join(', ');
      }
    } catch (geoErr) {
      locationName = `Coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    }
  }

  if (!locationName) {
    locationName = `Farm Zone (${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E)`;
  }

  // 3. Process Live Data or Fallback to DB / Defaults
  let resultPayload = {};

  if (liveWeather && liveWeather.current) {
    const cur = liveWeather.current;
    const daily = liveWeather.daily || {};
    const wmoInfo = mapWmoCode(cur.weather_code);
    const rainProb = (daily.precipitation_probability_max && daily.precipitation_probability_max[0]) || (cur.precipitation > 0 ? 85 : 15);
    const advisories = generateAgroAdvisories(
      cur.temperature_2m,
      cur.relative_humidity_2m,
      rainProb,
      cur.wind_speed_10m,
      cur.uv_index || 5
    );

    // Build 7-day forecast array
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const forecastList = [];
    const timeArray = daily.time || [];

    for (let i = 0; i < timeArray.length && i < 7; i++) {
      const dateObj = new Date(timeArray[i]);
      const dayName = i === 0 ? 'Today' : dayNames[dateObj.getDay()];
      const dayWmo = mapWmoCode(daily.weather_code[i]);
      forecastList.push({
        date: timeArray[i],
        day: dayName,
        temp: Math.round((daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2),
        tempMax: Math.round(daily.temperature_2m_max[i]),
        tempMin: Math.round(daily.temperature_2m_min[i]),
        condition: dayWmo.condition,
        icon: dayWmo.icon,
        rainProb: daily.precipitation_probability_max[i] || 0,
        uvIndex: daily.uv_index_max[i] || 5,
        windSpeed: Math.round(daily.wind_speed_10m_max[i] || 10)
      });
    }

    resultPayload = {
      isLiveGps: true,
      latitude: lat,
      longitude: lng,
      locationName,
      temperature: Math.round(cur.temperature_2m * 10) / 10,
      feelsLike: Math.round(cur.apparent_temperature * 10) / 10,
      humidity: Math.round(cur.relative_humidity_2m),
      windSpeed: Math.round(cur.wind_speed_10m * 10) / 10,
      windDirection: cur.wind_direction_10m,
      surfacePressure: Math.round(cur.surface_pressure),
      rainProbability: rainProb,
      uvIndex: Math.round((cur.uv_index || 5) * 10) / 10,
      uvLabel: advisories.uvLabel,
      condition: wmoInfo.condition,
      conditionIcon: wmoInfo.icon,
      summary: wmoInfo.summary,
      timestamp: new Date().toISOString(),
      advisories,
      forecast: forecastList
    };
  } else {
    // Fallback response if external API is unreachable
    const fallbackAdvisories = generateAgroAdvisories(28.5, 60, 15, 12, 6);
    resultPayload = {
      isLiveGps: false,
      latitude: lat,
      longitude: lng,
      locationName: locationName || 'Central Agricultural Station',
      temperature: 28.5,
      feelsLike: 29.0,
      humidity: 60,
      windSpeed: 12.0,
      windDirection: 180,
      surfacePressure: 1012,
      rainProbability: 15,
      uvIndex: 6.0,
      uvLabel: 'High',
      condition: 'Clear Sky / Mild Sunshine',
      conditionIcon: 'Sun',
      summary: 'Optimal photosynthetic lighting with stable ambient microclimate.',
      timestamp: new Date().toISOString(),
      advisories: fallbackAdvisories,
      forecast: [
        { day: 'Today', temp: 28, tempMax: 31, tempMin: 22, condition: 'Clear Sky', icon: 'Sun', rainProb: 15 },
        { day: 'Fri', temp: 29, tempMax: 32, tempMin: 23, condition: 'Mainly Clear', icon: 'Sun', rainProb: 10 },
        { day: 'Sat', temp: 28, tempMax: 30, tempMin: 22, condition: 'Partly Cloudy', icon: 'CloudSun', rainProb: 20 },
        { day: 'Sun', temp: 27, tempMax: 29, tempMin: 21, condition: 'Partly Cloudy', icon: 'CloudSun', rainProb: 25 },
        { day: 'Mon', temp: 28, tempMax: 31, tempMin: 22, condition: 'Clear Sky', icon: 'Sun', rainProb: 10 },
        { day: 'Tue', temp: 29, tempMax: 32, tempMin: 23, condition: 'Clear Sky', icon: 'Sun', rainProb: 15 },
        { day: 'Wed', temp: 30, tempMax: 33, tempMin: 24, condition: 'Clear Sky', icon: 'Sun', rainProb: 10 }
      ]
    };
  }

  res.json(resultPayload);
};

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

module.exports = { getWeatherData, createWeatherData, updateWeatherData, deleteWeatherData };
