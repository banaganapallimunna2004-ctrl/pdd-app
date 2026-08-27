import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import {
  Activity,
  Droplets,
  Sprout,
  TrendingUp,
  Sliders,
  Sparkles,
  Info,
  Thermometer,
  ShieldCheck
} from "lucide-react";
import { useTranslation } from "../i18n";

export default function AIAnalytics() {
  const { t } = useTranslation();

  // Simulator state variables
  const [moisture, setMoisture] = useState(68);
  const [nitrogen, setNitrogen] = useState(45);
  const [phosphorus, setPhosphorus] = useState(38);
  const [potassium, setPotassium] = useState(62);
  const [canopyCover, setCanopyCover] = useState(72);
  const [temp, setTemp] = useState(28);

  // Dynamic calculations based on simulator sliders
  const healthScore = useMemo(() => {
    const moistureScore = 100 - Math.abs(moisture - 70) * 1.5;
    const npkScore = 100 - (Math.abs(nitrogen - 50) + Math.abs(phosphorus - 40) + Math.abs(potassium - 60)) * 0.5;
    const tempScore = 100 - Math.abs(temp - 26) * 2;
    return Math.min(100, Math.max(20, Math.round((moistureScore * 0.4) + (npkScore * 0.4) + (tempScore * 0.2))));
  }, [moisture, nitrogen, phosphorus, potassium, temp]);

  const yieldProjection = useMemo(() => {
    const baseYield = 4.2; // Tons/Hectare
    const multiplier = (healthScore / 100) * (canopyCover / 100) * 1.3;
    return Math.max(1.5, Number((baseYield * multiplier).toFixed(2)));
  }, [healthScore, canopyCover]);

  // Chart Data
  const npkData = useMemo(() => [
    { name: t('nitrogenLevel') || "Nitrogen (N)", current: nitrogen, optimal: 50 },
    { name: t('phosphorusLevel') || "Phosphorus (P)", current: phosphorus, optimal: 40 },
    { name: t('potassiumLevel') || "Potassium (K)", current: potassium, optimal: 60 }
  ], [nitrogen, phosphorus, potassium, t]);

  const projectionData = useMemo(() => [
    { month: "Sowing", current: 0, projected: 0.5 },
    { month: "Vegetative", current: yieldProjection * 0.2, projected: yieldProjection * 0.25 },
    { month: "Flowering", current: yieldProjection * 0.5, projected: yieldProjection * 0.55 },
    { month: "Pod Development", current: yieldProjection * 0.8, projected: yieldProjection * 0.85 },
    { month: "Harvest", current: yieldProjection, projected: yieldProjection }
  ], [yieldProjection]);

  return (
    <div className="relative min-h-screen w-full select-text text-slate-900 overflow-x-hidden p-4 sm:p-6 lg:p-8">
      {/* ── Fixed Agriculture Background ── */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none -z-30"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=85&w=2560&auto=format&fit=crop')`,
        }}
      />
      {/* Deep Organic Scrim Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#061609]/85 via-[#09220d]/75 to-[#040e06]/90 backdrop-blur-[1px] pointer-events-none -z-20" />

      <main className="relative z-10 mx-auto max-w-7xl space-y-6 pb-20 text-slate-900">
        {/* Title Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/20 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white/90 px-3.5 py-1 text-[10px] font-black text-emerald-800 uppercase tracking-wider mb-1">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              {t('analyticsOverview')}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
              {t('analyticsTitle')} 🌾
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium mt-1">
              {t('analyticsSubtitle')}
            </p>
          </div>
        </div>

        {/* ── Top Metric Cards: 3 Crisp Solid White Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-[2.5rem] border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200">
                <Sprout className="h-6 w-6" />
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                ✓ {t('optimal')}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('cropHealthScore')}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-4xl font-black text-slate-900">{healthScore}%</h2>
              <span className="text-xs text-emerald-700 font-bold">{t('healthyStatus')}</span>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl border border-blue-200">
                <TrendingUp className="h-6 w-6" />
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-800 border border-blue-200">
                +18% {t('yieldForecast')}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('projectedHarvestYield')}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-4xl font-black text-slate-900">{yieldProjection}</h2>
              <span className="text-xs text-slate-500 font-bold">Tons / Hectare</span>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl border border-amber-200">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                ✓ {t('optimalNPKBalance')}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('soilNutrientIndex')}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-4xl font-black text-slate-900">{Math.round((nitrogen / 50) * 100)}%</h2>
              <span className="text-xs text-amber-700 font-bold">{t('nutrientStatus')}</span>
            </div>
          </div>
        </div>

        {/* ── Main Simulator & Visualizer ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Interactive Sliders Card */}
          <div className="rounded-[2.5rem] border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-xl space-y-5 text-slate-900">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders className="h-5 w-5 text-emerald-600" />
              <h3 className="text-base font-black uppercase tracking-wider text-slate-900">
                {t('interactiveTelemetry')}
              </h3>
            </div>

            {/* Slider 1: Soil Moisture */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-600 flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5 text-blue-600" /> {t('sensorMoisture')}
                </span>
                <span className="font-mono font-black text-blue-700">{moisture}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="95"
                value={moisture}
                onChange={(e) => setMoisture(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Slider 2: Nitrogen Level */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-600 flex items-center gap-1.5">
                  <Sprout className="h-3.5 w-3.5 text-emerald-600" /> {t('nitrogenLevel')}
                </span>
                <span className="font-mono font-black text-emerald-800">{nitrogen} mg/kg</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={nitrogen}
                onChange={(e) => setNitrogen(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Slider 3: Phosphorus Level */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-600 flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-amber-600" /> {t('phosphorusLevel')}
                </span>
                <span className="font-mono font-black text-amber-800">{phosphorus} mg/kg</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={phosphorus}
                onChange={(e) => setPhosphorus(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Slider 4: Potassium Level */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-600 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-purple-600" /> {t('potassiumLevel')}
                </span>
                <span className="font-mono font-black text-purple-800">{potassium} mg/kg</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={potassium}
                onChange={(e) => setPotassium(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Slider 5: Temperature */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-600 flex items-center gap-1.5">
                  <Thermometer className="h-3.5 w-3.5 text-rose-600" /> {t('soilTemp')}
                </span>
                <span className="font-mono font-black text-rose-700">{temp}°C</span>
              </div>
              <input
                type="range"
                min="15"
                max="42"
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
            </div>
          </div>

          {/* Right Column: Dynamic Charts Cards */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* NPK Ratio Chart */}
            <div className="rounded-[2.5rem] border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-xl text-slate-900">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  {t('optimalNPKBalance')}
                </h3>
                <span className="text-xs text-slate-500 font-medium">{t('nutrientStatus')}</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={npkData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "1rem", color: "#0f172a" }}
                    />
                    <Bar dataKey="current" fill="#059669" radius={[8, 8, 0, 0]} name={t('sensorLiveFeed')} />
                    <Bar dataKey="optimal" fill="#cbd5e1" radius={[8, 8, 0, 0]} name={t('optimal')} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Yield Progression Curve */}
            <div className="rounded-[2.5rem] border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-xl text-slate-900">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  {t('harvestYieldTrajectory')}
                </h3>
                <span className="text-xs text-emerald-800 font-black">{t('projectedHarvestYield')}: {yieldProjection} t/ha</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "1rem", color: "#0f172a" }}
                    />
                    <Area type="monotone" dataKey="projected" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#colorYield)" name={t('yieldForecast')} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
