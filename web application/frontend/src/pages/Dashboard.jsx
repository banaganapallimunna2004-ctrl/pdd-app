import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Leaf,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Thermometer,
  Wind,
  Sun,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Camera,
  Layers,
  Sparkles,
  ArrowRight,
  Sprout,
  Brain,
  Bell,
  Compass,
  Navigation
} from "lucide-react";
import { useTranslation } from "../i18n";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

import reportService from "../services/reportService";
import { useAuth } from "../context/AuthContext";
import LiveLocationMap from "../components/LiveLocationMap";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [healthScore] = useState(94);
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState(null);

  // Precision GIS & Map state
  const [mapTab, setMapTab] = useState("satellite");
  const [selectedZone, setSelectedZone] = useState("alpha");

  // Geolocation & Weather Radar State
  const [locationStatus, setLocationStatus] = useState("checking");
  const [geoCoords, setGeoCoords] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  // Live Location detector
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationStatus("granted");
        setGeoCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        fetchLiveWeather(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.warn("Location permission not granted or prompt:", err);
        setLocationStatus("prompt");
        fetchLiveWeather(12.9716, 77.5946);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  const fetchLiveWeather = async (lat, lng) => {
    setIsWeatherLoading(true);
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=relativehumidity_2m`);
      if (res.ok) {
        const data = await res.json();
        setWeatherData({
          temperature: data.current_weather?.temperature || 28.4,
          windSpeed: data.current_weather?.windspeed || 12.5,
          condition: (data.current_weather?.weathercode <= 3) ? "Optimal Clear" : "Mild Cloud Cover",
          humidity: data.hourly?.relativehumidity_2m?.[0] || 68
        });
      } else {
        throw new Error("Weather API offline");
      }
    } catch (e) {
      setWeatherData({
        temperature: 28.4,
        windSpeed: 12.5,
        condition: "Optimal Clear",
        humidity: 68
      });
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const requestLocationAccess = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationStatus("granted");
        setGeoCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        fetchLiveWeather(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setLocationStatus("denied");
      }
    );
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setReportsLoading(true);
        const res = await reportService.getReports();
        setReports(res.data?.reports || res.data || []);
      } catch (err) {
        setReportsError("Unable to load latest diagnostics.");
      } finally {
        setReportsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const stats = useMemo(
    () => [
      { title: t('totalFarms'), value: 128, icon: <Leaf size={24} />, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
      { title: t('healthyCrops'), value: "98.2%", icon: <Activity size={24} />, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
      { title: t('diseaseCases'), value: reports.length || 3, icon: <AlertTriangle size={24} />, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
      { title: t('activeSensors'), value: "24", icon: <ShieldCheck size={24} />, color: "text-teal-600", bg: "bg-teal-50 border-teal-200" },
    ],
    [t, reports.length]
  );

  return (
    <div className="relative min-h-screen w-full select-text text-slate-900 overflow-x-hidden p-4 sm:p-6 lg:p-8">
      {/* ── Fixed Agriculture Background ── */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none -z-30"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?q=85&w=2560&auto=format&fit=crop')`,
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#061609]/85 via-[#09220d]/75 to-[#040e06]/90 backdrop-blur-[1px] pointer-events-none -z-20" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-6">
        
        {/* ── Top Header Section: Crisp Solid White Glass Card ── */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-xl"
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center text-white shadow-md">
              <Sprout className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  {t('welcomeBack')}, {user?.name || 'Farmer'}! 👋
                </h1>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs font-bold text-emerald-700">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t('precisionEcosystem')} • {t('online')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-2.5">
              <div className="relative h-12 w-12 flex items-center justify-center">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500"
                    strokeDasharray="94, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-black text-slate-900">94%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('farmHealthIndex')}</span>
                <span className="text-xs font-black text-emerald-700">{t('optimal')}</span>
              </div>
            </div>

            <Link
              to="/weather"
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition shadow-sm"
              title={t('weatherInsightsTitle')}
            >
              <Bell className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>

        {/* ── Primary Scan Hero Card: Solid Emerald Glass ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-[2.5rem] border border-emerald-600/40 bg-gradient-to-r from-[#063314] via-[#09471c] to-[#063314] p-6 sm:p-8 shadow-2xl text-white group"
        >
          <div 
            className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 bg-cover bg-center pointer-events-none mix-blend-luminosity"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=1200&auto=format&fit=crop')` }}
          />

          <div className="relative z-10 max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3.5 py-1 text-xs font-black text-emerald-300">
              <Camera className="h-3.5 w-3.5" />
              <span>{t('scanHeading')}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              {t('scanInstructions')}
            </h2>

            <p className="text-xs sm:text-sm font-medium text-emerald-100/90 leading-relaxed">
              {t('scanDesc')}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/scan"
                className="inline-flex items-center gap-2.5 rounded-2xl bg-white text-emerald-950 font-black px-6 py-3.5 text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:bg-emerald-50 transition hover:scale-105"
              >
                <Camera className="h-4 w-4 text-emerald-700" />
                <span>{t('scanBtn')} 📸</span>
              </Link>

              <Link
                to="/crop-prediction"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-3.5 text-xs sm:text-sm font-bold text-white backdrop-blur-md hover:bg-white/20 transition"
              >
                <Sparkles className="h-4 w-4 text-emerald-300" />
                <span>{t('cropPredictTitle')}</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── 4 KPI Stats Grid: Crisp Solid White Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              className="rounded-3xl border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} border`}>
                  {stat.icon}
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <TrendingUp className="h-3 w-3" /> +12%
                </span>
              </div>
              <div className="mt-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.title}</span>
                <p className="text-3xl font-black text-slate-900 mt-0.5">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Precision Field Radar & Weather Widget ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[2.5rem] border border-white/60 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6 text-slate-900"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-emerald-600" />
                <h3 className="text-lg font-black uppercase tracking-wider text-slate-900">
                  {t('weatherIntel')}
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {t('liveZoningsDesc')}
              </p>
            </div>

            {locationStatus === "granted" ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1 text-xs font-black text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>🛰️ {t('liveFarmLocation')} ({geoCoords?.lat.toFixed(3)}, {geoCoords?.lng.toFixed(3)})</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={requestLocationAccess}
                className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-xs font-black text-amber-800 hover:bg-amber-100 transition cursor-pointer"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>📍 {t('liveFarmLocation')}</span>
              </button>
            )}
          </div>

          {/* Weather KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('temperature')}</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">{weatherData?.temperature || 28.4}°C</span>
                <Sun className="h-4 w-4 text-amber-500 ml-auto" />
              </div>
              <span className="text-[10px] font-bold text-emerald-700 mt-1 block">{t('optimal')}</span>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('weatherStatus')}</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-base font-black text-slate-900 truncate">{weatherData?.condition || t('mildSunny')}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 mt-1 block">{t('cropZonesHealthy')}</span>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('sensorHumidity')}</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">{weatherData?.humidity || 68}%</span>
                <Droplets className="h-4 w-4 text-blue-500 ml-auto" />
              </div>
              <span className="text-[10px] font-bold text-blue-700 mt-1 block">{t('soilMoistureOk')}</span>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('weatherWind')}</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">{weatherData?.windSpeed || 12.5} km/h</span>
                <Wind className="h-4 w-4 text-teal-500 ml-auto" />
              </div>
              <span className="text-[10px] font-bold text-teal-700 mt-1 block">{t('normal')}</span>
            </div>
          </div>
        </motion.div>

        {/* ── Sentinel-2 GIS Map & Multi-Zone Matrix ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-[2.5rem] border border-white/60 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6 text-slate-900"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-emerald-600" />
                <h3 className="text-lg font-black uppercase tracking-wider text-slate-900">
                  {t('liveZonings')}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('liveZoningsDesc')}
              </p>
            </div>

            <div className="flex gap-1.5 rounded-2xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setMapTab("satellite")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  mapTab === "satellite"
                    ? "bg-white text-emerald-800 shadow-sm font-black"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🛰️ {t('satelliteAnalysis')}
              </button>
              <button
                type="button"
                onClick={() => setMapTab("google")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  mapTab === "google"
                    ? "bg-white text-emerald-800 shadow-sm font-black"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🗺️ {t('viewMap')}
              </button>
            </div>
          </div>

          {/* Map Display View */}
          {mapTab === "satellite" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-4 h-[380px] flex flex-col justify-between relative overflow-hidden text-white">
                <div className="flex items-center justify-between z-10">
                  <span className="text-xs font-black uppercase text-emerald-400 bg-black/60 px-3 py-1 rounded-lg border border-white/10">
                    Sentinel-2 NDVI Matrix
                  </span>
                  <span className="text-xs text-white/70 bg-black/60 px-3 py-1 rounded-lg border border-white/10">
                    {t('optimal')}
                  </span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <div className="w-80 h-80 rounded-full border-2 border-emerald-500/30 border-dashed animate-spin-slow" />
                </div>

                <div className="z-10 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    `Zone Alpha (${t('cropTomato')})`,
                    `Zone Beta (${t('cropRice')})`,
                    `Zone Gamma (${t('cropCorn')})`,
                    `Zone Delta (${t('cropWheat')})`
                  ].map((z, idx) => (
                    <button
                      key={z}
                      type="button"
                      onClick={() => setSelectedZone(idx === 0 ? "alpha" : idx === 1 ? "beta" : idx === 2 ? "gamma" : "delta")}
                      className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                        (idx === 0 && selectedZone === "alpha") ||
                        (idx === 1 && selectedZone === "beta") ||
                        (idx === 2 && selectedZone === "gamma") ||
                        (idx === 3 && selectedZone === "delta")
                          ? "bg-emerald-500/40 border-emerald-400 text-white"
                          : "bg-black/60 border-white/10 text-white/60 hover:text-white"
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase block">{z}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">NDVI 0.84 • {t('optimal')}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 text-slate-900">
                  <span className="text-xs font-black text-emerald-800 uppercase tracking-wider block mb-3">
                    {t('farmStatus')}
                  </span>
                  <div className="space-y-2.5 text-xs font-semibold">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">{t('yieldForecast')}:</span>
                      <span className="font-black text-slate-900">4.8 Tonnes / Acre</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">{t('canopyCover')}:</span>
                      <span className="font-black text-emerald-700">92 CCI ({t('optimal')})</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">{t('sensorMoisture')}:</span>
                      <span className="font-black text-blue-700">{t('soilMoistureOk')}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">{t('pestRiskIndex')}:</span>
                      <span className="font-black text-emerald-700">{t('low')}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/analytics"
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 text-xs font-black uppercase shadow-lg shadow-emerald-900/20 transition"
                >
                  <Activity className="h-4 w-4" />
                  <span>{t('analyticsTitle')} →</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden border border-slate-200">
              <LiveLocationMap />
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
