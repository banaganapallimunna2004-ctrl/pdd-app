import { useState, useMemo } from "react";
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
  CloudSun
} from "lucide-react";
import { useTranslation } from "../i18n";

export default function WeatherInsights() {
  const { t } = useTranslation();
  const [activeScenarioKey, setActiveScenarioKey] = useState("sunshine");

  const weatherScenarios = {
    monsoon: {
      label: t('monsoonShowers'),
      temp: 24,
      humidity: 88,
      wind: 18,
      rainProb: 92,
      uvIndex: 2,
      uvLabel: t('low'),
      summary: "Continuous light rain showers with calm winds. High humidity environment.",
      advisory: "Excessive moisture present. Delay regular crop irrigation cycles by 2 days to prevent root rot.",
      irrigationStatus: t('irrigationAlert'),
      irrigationColor: "text-blue-800 bg-blue-50 border-blue-200",
      forecast: [
        { day: t('forecastDayToday'), temp: 24, icon: <CloudRain className="text-blue-500" /> },
        { day: t('forecastDayFri'), temp: 23, icon: <CloudRain className="text-blue-500" /> },
        { day: t('forecastDaySat'), temp: 25, icon: <CloudLightning className="text-blue-500 animate-pulse" /> },
        { day: t('forecastDaySun'), temp: 26, icon: <CloudSun className="text-yellow-500" /> },
        { day: t('forecastDayMon'), temp: 25, icon: <CloudRain className="text-blue-500" /> },
        { day: t('forecastDayTue'), temp: 27, icon: <Sun className="text-amber-500" /> },
        { day: t('forecastDayWed'), temp: 26, icon: <CloudSun className="text-yellow-500" /> }
      ]
    },
    heatwave: {
      label: t('dryHeatwave'),
      temp: 41,
      humidity: 28,
      wind: 24,
      rainProb: 5,
      uvIndex: 11,
      uvLabel: t('urgent'),
      summary: "Extreme solar radiance, low humidity, and high wind-speed. Rapid evaporation.",
      advisory: "Severe transpiration risk. Activate automated drip irrigation systems immediately.",
      irrigationStatus: t('irrigationTimingLabel'),
      irrigationColor: "text-rose-800 bg-rose-50 border-rose-200",
      forecast: [
        { day: t('forecastDayToday'), temp: 41, icon: <Sun className="text-amber-500" /> },
        { day: t('forecastDayFri'), temp: 42, icon: <Sun className="text-amber-500" /> },
        { day: t('forecastDaySat'), temp: 40, icon: <Sun className="text-amber-500" /> },
        { day: t('forecastDaySun'), temp: 39, icon: <CloudSun className="text-yellow-500" /> },
        { day: t('forecastDayMon'), temp: 41, icon: <Sun className="text-amber-500" /> },
        { day: t('forecastDayTue'), temp: 42, icon: <Sun className="text-amber-500" /> },
        { day: t('forecastDayWed'), temp: 43, icon: <Sun className="text-amber-500" /> }
      ]
    },
    sunshine: {
      label: t('mildSunny'),
      temp: 28,
      humidity: 55,
      wind: 10,
      rainProb: 15,
      uvIndex: 6,
      uvLabel: t('optimal'),
      summary: "Moderate warm sun, gentle breeze, and pleasant humidity levels.",
      advisory: "Ideal physiological window. Soil absorption rates are optimal.",
      irrigationStatus: t('soilMoistureOk'),
      irrigationColor: "text-emerald-800 bg-emerald-50 border-emerald-200",
      forecast: [
        { day: t('forecastDayToday'), temp: 28, icon: <Sun className="text-amber-500" /> },
        { day: t('forecastDayFri'), temp: 29, icon: <Sun className="text-amber-500" /> },
        { day: t('forecastDaySat'), temp: 28, icon: <CloudSun className="text-yellow-500" /> },
        { day: t('forecastDaySun'), temp: 27, icon: <CloudSun className="text-yellow-500" /> },
        { day: t('forecastDayMon'), temp: 28, icon: <Sun className="text-amber-500" /> },
        { day: t('forecastDayTue'), temp: 29, icon: <Sun className="text-amber-500" /> },
        { day: t('forecastDayWed'), temp: 30, icon: <Sun className="text-amber-500" /> }
      ]
    }
  };

  const activeScenario = useMemo(() => {
    return weatherScenarios[activeScenarioKey] || weatherScenarios.sunshine;
  }, [activeScenarioKey, weatherScenarios]);

  return (
    <div className="relative min-h-screen w-full select-text text-slate-900 overflow-x-hidden p-4 sm:p-6 lg:p-8">
      {/* ── Fixed Agriculture Background ── */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none -z-30"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=85&w=2560&auto=format&fit=crop')`,
        }}
      />
      {/* Deep Organic Scrim Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#061609]/85 via-[#09220d]/75 to-[#040e06]/90 backdrop-blur-[1px] pointer-events-none -z-20" />

      <main className="relative z-10 mx-auto max-w-7xl space-y-6 pb-20 text-slate-900">
        {/* Title Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/20 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white/90 px-3.5 py-1 text-[10px] font-black text-emerald-800 uppercase tracking-wider mb-1">
              <Compass className="h-3.5 w-3.5 text-emerald-600" />
              {t('liveWeatherStation')}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
              {t('weatherInsightsTitle')} ⛅
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100/90 font-medium max-w-2xl">
              {t('weatherInsightsSubtitle')}
            </p>
          </div>

          {/* Selector Scenario Switcher */}
          <div className="rounded-2xl border border-slate-200 bg-white/95 p-1.5 flex flex-wrap gap-1 shadow-md shrink-0">
            {Object.keys(weatherScenarios).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveScenarioKey(key)}
                className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeScenarioKey === key
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {weatherScenarios[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Display */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Active weather metrics cards (Col 1-2) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Primary climate panel: Solid White Card */}
            <div className="rounded-[2.5rem] border border-white/60 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 text-slate-900">
              <div className="space-y-2">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{t('liveWeatherStation')}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-900">{activeScenario.temp}°C</span>
                  <span className="text-sm font-bold text-emerald-700">{t('temperature')}</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-700">{activeScenario.summary}</p>
              </div>

              <div className="h-20 w-20 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200 shrink-0 shadow-inner">
                {activeScenarioKey === "monsoon" && <CloudRain className="h-10 w-10 text-blue-500 animate-pulse" />}
                {activeScenarioKey === "heatwave" && <Sun className="h-10 w-10 text-amber-500 animate-spin-slow" />}
                {activeScenarioKey === "sunshine" && <Sun className="h-10 w-10 text-amber-500 animate-pulse" />}
              </div>
            </div>

            {/* Micro Parameter cards */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              
              {/* Humid */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-slate-900">
                <div className="flex items-center gap-2 mb-2 text-slate-500">
                  <Droplets className="h-4 w-4 text-blue-600" />
                  <span className="text-[10px] font-black uppercase tracking-wider">{t('humidityLabel')}</span>
                </div>
                <p className="text-2xl font-black text-slate-900">{activeScenario.humidity}%</p>
                <span className="text-[10px] text-slate-500 font-semibold block mt-1">{t('sensorHumidity')}</span>
              </div>

              {/* Wind */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-slate-900">
                <div className="flex items-center gap-2 mb-2 text-slate-500">
                  <Wind className="h-4 w-4 text-teal-600" />
                  <span className="text-[10px] font-black uppercase tracking-wider">{t('windSpeedLabel')}</span>
                </div>
                <p className="text-2xl font-black text-slate-900">{activeScenario.wind} <span className="text-xs font-bold">km/h</span></p>
                <span className="text-[10px] text-slate-500 font-semibold block mt-1">{t('weatherWind')}</span>
              </div>

              {/* Rain Prob */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-slate-900">
                <div className="flex items-center gap-2 mb-2 text-slate-500">
                  <CloudRain className="h-4 w-4 text-blue-600" />
                  <span className="text-[10px] font-black uppercase tracking-wider">{t('rainProbability')}</span>
                </div>
                <p className="text-2xl font-black text-slate-900">{activeScenario.rainProb}%</p>
                <span className="text-[10px] text-slate-500 font-semibold block mt-1">{t('rainRisk')}</span>
              </div>

              {/* UV Index */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-slate-900">
                <div className="flex items-center gap-2 mb-2 text-slate-500">
                  <Sun className="h-4 w-4 text-amber-600" />
                  <span className="text-[10px] font-black uppercase tracking-wider">{t('uvIndexLabel')}</span>
                </div>
                <p className="text-2xl font-black text-slate-900">{activeScenario.uvIndex} <span className="text-xs font-bold text-amber-700">({activeScenario.uvLabel})</span></p>
                <span className="text-[10px] text-slate-500 font-semibold block mt-1">{t('uvIndex')}</span>
              </div>

            </div>

            {/* 7-Day Micro Forecast */}
            <div className="rounded-[2.5rem] border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-xl text-slate-900">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-emerald-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">{t('forecastTitle')}</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {activeScenario.forecast.map((f, i) => (
                  <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center flex flex-col items-center justify-between">
                    <span className="text-xs font-black text-slate-900">{f.day}</span>
                    <div className="my-2">{f.icon}</div>
                    <span className="text-sm font-black text-slate-900">{f.temp}°C</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Agronomic Action Panel */}
          <div className="space-y-6">
            
            <div className="rounded-[2.5rem] border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-xl space-y-4 text-slate-900">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  {t('smartIrrigationEngine')}
                </h3>
              </div>

              {/* Status Badge */}
              <div className={`p-4 rounded-2xl border ${activeScenario.irrigationColor} font-black text-xs uppercase text-center`}>
                {activeScenario.irrigationStatus}
              </div>

              {/* Advisory Body */}
              <div className="space-y-2 text-xs leading-relaxed text-slate-700 font-medium bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <p className="font-black text-slate-900 uppercase text-[10px] tracking-wider mb-1">{t('agronomicAdvisory')}:</p>
                {activeScenario.advisory}
              </div>
            </div>

            {/* Spraying Window Card */}
            <div className="rounded-[2.5rem] border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-xl space-y-3 text-slate-900">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                {t('weatherRecommendation')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {activeScenario.rainProb > 50 || activeScenario.wind > 25
                  ? `⚠️ ${t('irrigationAlertDesc')}`
                  : `✅ ${t('soilMoistureOkDesc')}`}
              </p>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
