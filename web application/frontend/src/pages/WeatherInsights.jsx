import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle,
  Info,
  Calendar,
  Compass,
  CheckCircle2,
  Sparkles,
  CloudSun,
  MapPin,
  RefreshCw,
  Search,
  Download,
  ShieldCheck,
  Zap,
  Gauge
} from "lucide-react";
import { useTranslation } from "../i18n";
import weatherService from "../services/weatherService";

// Preset Quick Agricultural Hubs
const PRESET_LOCATIONS = [
  { name: "Current GPS Location", lat: null, lng: null, isGps: true },
  { name: "Hyderabad, Telangana", lat: 17.3850, lng: 78.4867 },
  { name: "Bengaluru, Karnataka", lat: 12.9716, lng: 77.5946 },
  { name: "Pune, Maharashtra", lat: 18.5204, lng: 73.8567 },
  { name: "Guntur (Chilli Hub), AP", lat: 16.3067, lng: 80.4365 },
  { name: "Ludhiana (Wheat Belt), PB", lat: 30.9010, lng: 75.8573 },
  { name: "Indore (Soybean Zone), MP", lat: 22.7196, lng: 75.8577 }
];

export default function WeatherInsights() {
  const { t } = useTranslation();

  // Location State
  const [coords, setCoords] = useState({ lat: 17.3850, lng: 78.4867 });
  const [locationName, setLocationName] = useState("Detecting live location...");
  const [isLiveGps, setIsLiveGps] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);

  // Weather Telemetry State
  const [weatherData, setWeatherData] = useState(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [simulatedScenario, setSimulatedScenario] = useState(null);

  // Helper to render appropriate weather icon
  const renderWeatherIcon = (iconName, className = "h-8 w-8") => {
    switch (iconName) {
      case "Sun":
        return <Sun className={`${className} text-amber-500`} />;
      case "CloudSun":
        return <CloudSun className={`${className} text-yellow-500`} />;
      case "CloudRain":
        return <CloudRain className={`${className} text-blue-500`} />;
      case "CloudLightning":
        return <CloudLightning className={`${className} text-amber-500`} />;
      case "Wind":
        return <Wind className={`${className} text-teal-500`} />;
      default:
        return <CloudSun className={`${className} text-emerald-500`} />;
    }
  };

  // Fetch Live Weather for Coordinates
  const fetchWeather = useCallback(async (latitude, longitude, customLocName = "") => {
    setIsLoadingWeather(true);
    try {
      const response = await weatherService.getWeatherData({
        lat: latitude,
        lng: longitude,
        locationName: customLocName
      });

      if (response && response.data) {
        setWeatherData(response.data);
        if (response.data.locationName) {
          setLocationName(response.data.locationName);
        }
      }
    } catch (err) {
      console.warn("Weather fetch error, falling back to local model:", err.message);
    } finally {
      setIsLoadingWeather(false);
    }
  }, []);

  // Request Browser Live GPS Geolocation
  const requestLiveGps = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      fetchWeather(17.3850, 78.4867, "Hyderabad (Default Station)");
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setCoords({ lat: latitude, lng: longitude });
        setIsLiveGps(true);
        setIsLocating(false);
        fetchWeather(latitude, longitude);
      },
      (error) => {
        console.warn("GPS Permission Denied or Unavailable:", error.message);
        setIsLocating(false);
        setIsLiveGps(false);
        setGeoError("GPS permission denied or unavailable. Showing central agricultural station.");
        fetchWeather(17.3850, 78.4867, "Central Agro Station");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [fetchWeather]);

  // Initial load: Request Live GPS
  useEffect(() => {
    requestLiveGps();
  }, [requestLiveGps]);

  // Handle City / Location Selection
  const handleLocationSelect = (loc) => {
    if (loc.isGps) {
      requestLiveGps();
    } else {
      setIsLiveGps(false);
      setCoords({ lat: loc.lat, lng: loc.lng });
      setLocationName(loc.name);
      fetchWeather(loc.lat, loc.lng, loc.name);
    }
  };

  // Handle Manual City Search Geocoding
  const handleCitySearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoadingWeather(true);
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=1&language=en&format=json`;
      const res = await fetch(geoUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const first = data.results[0];
          const fullLabel = [first.name, first.admin1, first.country].filter(Boolean).join(", ");
          setCoords({ lat: first.latitude, lng: first.longitude });
          setLocationName(fullLabel);
          setIsLiveGps(false);
          fetchWeather(first.latitude, first.longitude, fullLabel);
          setSearchQuery("");
        } else {
          alert(`Location "${searchQuery}" not found. Please try another city name.`);
        }
      }
    } catch (err) {
      console.warn("City search geocoding failed:", err.message);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // Generate & Download Comprehensive Weather Report (Text/Printable)
  const downloadWeatherReport = () => {
    if (!weatherData) return;

    const reportContent = `================================================================================
🌾 AGRO AI PRECISION FARMING — OFFICIAL METEOROLOGICAL & AGRO ADVISORY REPORT
================================================================================

📅 Report Generated:   ${new Date().toLocaleString()}
📍 Target Location:     ${weatherData.locationName || locationName}
🌐 GPS Coordinates:    ${weatherData.latitude?.toFixed(4)}°N, ${weatherData.longitude?.toFixed(4)}°E
🛰️ Telemetry Source:   ${weatherData.isLiveGps ? "Live GPS Sensor Network" : "Regional Agrometeorological Station"}

--------------------------------------------------------------------------------
1. CURRENT MICROCLIMATE PARAMETERS
--------------------------------------------------------------------------------
• Temperature:          ${weatherData.temperature}°C (Feels Like: ${weatherData.feelsLike || weatherData.temperature}°C)
• Ambient Humidity:     ${weatherData.humidity}%
• Wind Velocity:        ${weatherData.windSpeed} km/h (Direction: ${weatherData.windDirection || 0}°)
• Atmospheric Pressure: ${weatherData.surfacePressure || 1013} hPa
• Rain Probability:     ${weatherData.rainProbability}%
• UV Solar Radiation:   ${weatherData.uvIndex} (${weatherData.uvLabel || "Moderate"})
• Sky Condition:        ${weatherData.condition}

--------------------------------------------------------------------------------
2. SMART AGRICULTURAL ADVISORIES
--------------------------------------------------------------------------------
[💧 IRRIGATION ADVISORY]
Status:   ${weatherData.advisories?.irrigationStatus || "Normal Cycle"}
Advisory: ${weatherData.advisories?.irrigationAdvisory || "Maintain standard crop root-zone moisture."}

[🚜 CHEMICAL SPRAYING WINDOW]
Status:   ${weatherData.advisories?.sprayWindowStatus || "Optimal Window"}
Advisory: ${weatherData.advisories?.sprayAdvisory || "Safe wind velocity for pesticide and fertilizer application."}

[🛡️ PEST & FUNGAL DISEASE RISK]
Status:   ${weatherData.advisories?.diseaseRisk || "Low Disease Risk"}
Advisory: ${weatherData.advisories?.diseaseAdvisory || "Atmospheric conditions are stable."}

--------------------------------------------------------------------------------
3. 7-DAY PRECISION AGRO-WEATHER FORECAST
--------------------------------------------------------------------------------
${(weatherData.forecast || []).map((f) => `• ${f.day.padEnd(5)} | Avg: ${String(f.temp).padStart(2)}°C (Min: ${f.tempMin || f.temp}°C, Max: ${f.tempMax || f.temp}°C) | Rain Risk: ${String(f.rainProb || 0).padStart(2)}% | Condition: ${f.condition}`).join("\n")}

================================================================================
Generated by Agro AI Precision Farming System v2.4.0 — https://agroai.com
================================================================================
`;

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AgroAI-Weather-Report-${(weatherData.locationName || "live-location").replace(/[^a-zA-Z0-9]/g, "_")}-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen w-full select-text text-slate-900 overflow-x-hidden p-4 sm:p-6 lg:p-8">
      {/* ── Background Wall & Scrim ── */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none -z-30"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=85&w=2560&auto=format&fit=crop')`
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#061609]/85 via-[#09220d]/75 to-[#040e06]/90 backdrop-blur-[1px] pointer-events-none -z-20" />

      <main className="relative z-10 mx-auto max-w-7xl space-y-6 pb-20 text-slate-900">
        
        {/* ── Header & Location Toolbar ── */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/20 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white/95 px-3.5 py-1 text-[11px] font-black text-emerald-800 uppercase tracking-wider mb-2 shadow-sm">
              <Compass className={`h-3.5 w-3.5 text-emerald-600 ${isLocating ? "animate-spin" : ""}`} />
              {isLiveGps ? "📍 Live GPS Weather Active" : "🛰️ Weather Station"}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md flex items-center gap-3">
              {t("weatherInsightsTitle") || "Agro Weather Insights"} ⛅
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100/90 font-medium max-w-2xl">
              Real-time hyper-local agrometeorological forecasting, precision irrigation triggers, and chemical spraying windows tailored to your live GPS coordinates.
            </p>
          </div>

          {/* Action Buttons: Live GPS & Download Report */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={requestLiveGps}
              disabled={isLocating}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2.5 shadow-lg transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLocating ? "animate-spin" : ""}`} />
              {isLocating ? "Detecting GPS..." : "Refresh Live GPS"}
            </button>

            <button
              type="button"
              onClick={downloadWeatherReport}
              disabled={isLoadingWeather || !weatherData}
              className="inline-flex items-center gap-2 rounded-xl bg-white/95 hover:bg-white text-slate-900 font-black text-xs px-4 py-2.5 shadow-lg transition-all duration-200 cursor-pointer active:scale-95 border border-slate-200"
            >
              <Download className="h-4 w-4 text-emerald-700" />
              Export Weather Report
            </button>
          </div>
        </div>

        {/* ── Location Selector & City Search Bar ── */}
        <div className="rounded-2xl border border-white/40 bg-white/95 p-3 shadow-md backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-emerald-600" /> Location:
            </span>
            {PRESET_LOCATIONS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLocationSelect(p)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  (p.isGps && isLiveGps) || (!p.isGps && locationName.includes(p.name.split(",")[0]))
                    ? "bg-emerald-700 text-white shadow-sm font-black"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <form onSubmit={handleCitySearch} className="relative w-full md:w-72 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search farm city or district..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 font-semibold focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <Search className="absolute left-3 top-2 h-4 w-4 text-slate-400" />
          </form>
        </div>

        {/* ── Main Dashboard Display ── */}
        {isLoadingWeather ? (
          <div className="rounded-[2.5rem] border border-white/60 bg-white/95 p-12 text-center shadow-xl backdrop-blur-xl">
            <RefreshCw className="h-10 w-10 text-emerald-600 animate-spin mx-auto mb-3" />
            <h3 className="text-lg font-black text-slate-900">Fetching Live Meteorological Telemetry...</h3>
            <p className="text-xs text-slate-600 font-semibold mt-1">Connecting to GPS weather stations for {locationName}</p>
          </div>
        ) : weatherData ? (
          <div className="grid gap-6 lg:grid-cols-3">
            
            {/* Left 2 Columns: Primary Metrics & 7-Day Forecast */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Primary Live Weather Station Card */}
              <div className="rounded-[2.5rem] border border-white/60 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 text-slate-900">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black text-emerald-900 uppercase tracking-wider">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                      {weatherData.isLiveGps ? "Live GPS Connected" : "Station Verified"}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {weatherData.latitude?.toFixed(2)}°N, {weatherData.longitude?.toFixed(2)}°E
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-700 shrink-0" />
                    {weatherData.locationName || locationName}
                  </h2>

                  <div className="flex items-baseline gap-3 pt-1">
                    <span className="text-6xl font-black text-slate-900 tracking-tight">
                      {weatherData.temperature}°C
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        Feels like {weatherData.feelsLike || weatherData.temperature}°C
                      </span>
                      <span className="text-xs font-bold text-slate-600">
                        {weatherData.condition}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-700 pt-1">
                    {weatherData.summary}
                  </p>
                </div>

                <div className="h-24 w-24 rounded-3xl bg-slate-50 flex items-center justify-center border border-slate-200 shrink-0 shadow-inner">
                  {renderWeatherIcon(weatherData.conditionIcon, "h-12 w-12")}
                </div>
              </div>

              {/* Micro-Parameters Grid */}
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {/* Humidity */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-slate-900">
                  <div className="flex items-center gap-2 mb-2 text-slate-500">
                    <Droplets className="h-4 w-4 text-blue-600" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Humidity</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{weatherData.humidity}%</p>
                  <span className="text-[10px] text-slate-500 font-semibold block mt-1">Air Relative Moisture</span>
                </div>

                {/* Wind Speed */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-slate-900">
                  <div className="flex items-center gap-2 mb-2 text-slate-500">
                    <Wind className="h-4 w-4 text-teal-600" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Wind Velocity</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">
                    {weatherData.windSpeed} <span className="text-xs font-bold">km/h</span>
                  </p>
                  <span className="text-[10px] text-slate-500 font-semibold block mt-1">
                    Dir: {weatherData.windDirection || 0}°
                  </span>
                </div>

                {/* Rain Probability */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-slate-900">
                  <div className="flex items-center gap-2 mb-2 text-slate-500">
                    <CloudRain className="h-4 w-4 text-blue-600" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Rain Likelihood</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{weatherData.rainProbability}%</p>
                  <span className="text-[10px] text-slate-500 font-semibold block mt-1">Precipitation Chance</span>
                </div>

                {/* UV Index */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-slate-900">
                  <div className="flex items-center gap-2 mb-2 text-slate-500">
                    <Sun className="h-4 w-4 text-amber-600" />
                    <span className="text-[10px] font-black uppercase tracking-wider">UV Index</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">
                    {weatherData.uvIndex} <span className="text-xs font-bold text-amber-700">({weatherData.uvLabel})</span>
                  </p>
                  <span className="text-[10px] text-slate-500 font-semibold block mt-1">Solar Radiation</span>
                </div>
              </div>

              {/* 7-Day Precision Agro-Forecast */}
              <div className="rounded-[2.5rem] border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-xl text-slate-900">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      7-Day Agricultural Weather Forecast
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Automated GFS Model</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                  {(weatherData.forecast || []).map((f, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-300 p-3 text-center flex flex-col items-center justify-between transition-all duration-200"
                    >
                      <span className="text-xs font-black text-slate-900">{f.day}</span>
                      <div className="my-2">{renderWeatherIcon(f.icon, "h-7 w-7")}</div>
                      <div className="space-y-0.5">
                        <span className="text-sm font-black text-slate-900 block">{f.temp}°C</span>
                        <span className="text-[10px] font-bold text-blue-600 block">🌧️ {f.rainProb}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Precision Agronomic Advisory Panel */}
            <div className="space-y-6">
              
              {/* Smart Irrigation Advisory */}
              <div className="rounded-[2.5rem] border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-xl space-y-4 text-slate-900">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Smart Irrigation Engine
                  </h3>
                </div>

                {/* Status Alert Badge */}
                <div
                  className={`p-3.5 rounded-2xl border ${
                    weatherData.advisories?.irrigationColor || "text-emerald-800 bg-emerald-50 border-emerald-200"
                  } font-black text-xs uppercase text-center tracking-wide`}
                >
                  {weatherData.advisories?.irrigationStatus || "Optimal Soil Moisture"}
                </div>

                {/* Advisory Text */}
                <div className="space-y-2 text-xs leading-relaxed text-slate-700 font-medium bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <p className="font-black text-slate-900 uppercase text-[10px] tracking-wider mb-1">
                    Agronomic Recommendation:
                  </p>
                  {weatherData.advisories?.irrigationAdvisory ||
                    "Soil moisture uptake is balanced. Maintain standard drip irrigation cycle."}
                </div>
              </div>

              {/* Chemical Spraying Window Advisory */}
              <div className="rounded-[2.5rem] border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-xl space-y-3 text-slate-900">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Spraying & Foliar Window
                  </h3>
                </div>

                <div
                  className={`p-3 rounded-xl border ${
                    weatherData.advisories?.sprayWindowColor || "text-emerald-700 bg-emerald-50 border-emerald-200"
                  } font-bold text-xs`}
                >
                  {weatherData.advisories?.sprayWindowStatus || "Safe Spraying Window"}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {weatherData.advisories?.sprayAdvisory}
                </p>
              </div>

              {/* Pest & Disease Microclimate Alert */}
              <div className="rounded-[2.5rem] border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-xl space-y-3 text-slate-900">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <ShieldCheck className="h-4 w-4 text-teal-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Disease & Pest Risk Matrix
                  </h3>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Risk Assessment:</span>
                  <span className={`text-xs font-black uppercase ${weatherData.advisories?.diseaseRiskColor || "text-emerald-700"}`}>
                    {weatherData.advisories?.diseaseRisk}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  {weatherData.advisories?.diseaseAdvisory}
                </p>
              </div>

            </div>

          </div>
        ) : null}

      </main>
    </div>
  );
}
