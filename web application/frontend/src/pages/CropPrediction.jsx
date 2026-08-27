import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout,
  Activity,
  Sliders,
  Sparkles,
  Droplets,
  Thermometer,
  ShieldCheck,
  TrendingUp,
  Brain,
  Layers,
  ArrowRight
} from "lucide-react";
import { useTranslation } from "../i18n";

// Professional crop requirements database for rule-based matching
const cropDatabase = [
  {
    name: "Rice",
    cropKey: "cropRice",
    scientificName: "Oryza sativa",
    idealPh: [5.5, 7.0],
    idealTemp: [22, 35],
    idealRain: [1000, 2000],
    idealN: [80, 120],
    idealP: [40, 60],
    idealK: [40, 60],
    description: "Highly dependent on water retention. Prefers alluvial soils with high clay content.",
    waterNeed: "High (Flooding/Regular Sowing)",
    marketYield: "4.5 Tons/Hectare",
  },
  {
    name: "Wheat",
    cropKey: "cropWheat",
    scientificName: "Triticum aestivum",
    idealPh: [6.0, 7.5],
    idealTemp: [15, 24],
    idealRain: [400, 800],
    idealN: [70, 100],
    idealP: [30, 50],
    idealK: [30, 50],
    description: "Rabi crop. Flourishes in well-drained loamy soils during cool weather conditions.",
    waterNeed: "Moderate (Irrigation Cycles)",
    marketYield: "3.8 Tons/Hectare",
  },
  {
    name: "Tomato",
    cropKey: "cropTomato",
    scientificName: "Solanum lycopersicum",
    idealPh: [5.5, 6.8],
    idealTemp: [20, 30],
    idealRain: [500, 1000],
    idealN: [60, 90],
    idealP: [40, 60],
    idealK: [60, 90],
    description: "High potassium consumer. Flourishes in porous soils rich in organic compost.",
    waterNeed: "Moderate (Drip Irrigation)",
    marketYield: "15.2 Tons/Hectare",
  },
  {
    name: "Potato",
    cropKey: "cropPotato",
    scientificName: "Solanum tuberosum",
    idealPh: [5.0, 6.0],
    idealTemp: [15, 21],
    idealRain: [500, 800],
    idealN: [60, 90],
    idealP: [50, 80],
    idealK: [80, 120],
    description: "Requires acidic, airy soils. Excessive moisture leads to tuber rot disease.",
    waterNeed: "Low-Moderate (Porous drainage)",
    marketYield: "18.5 Tons/Hectare",
  },
  {
    name: "Corn",
    cropKey: "cropCorn",
    scientificName: "Zea mays",
    idealPh: [5.8, 7.2],
    idealTemp: [20, 32],
    idealRain: [600, 1200],
    idealN: [90, 120],
    idealP: [40, 60],
    idealK: [40, 60],
    description: "Requires high nitrogen. Broad solar intercept needs open terrain coordinates.",
    waterNeed: "Moderate-High (Silt soils)",
    marketYield: "5.5 Tons/Hectare",
  },
  {
    name: "Cotton",
    cropKey: "cropCotton",
    scientificName: "Gossypium hirsutum",
    idealPh: [5.5, 7.5],
    idealTemp: [25, 38],
    idealRain: [500, 1000],
    idealN: [60, 90],
    idealP: [30, 50],
    idealK: [40, 70],
    description: "Requires high thermal units and dry harvest periods. Thrives in black cotton soils.",
    waterNeed: "Moderate (Deep root access)",
    marketYield: "2.2 Tons/Hectare",
  }
];

export default function CropPrediction() {
  const { t } = useTranslation();

  // UI Form States
  const [ph, setPh] = useState(6.2);
  const [temperature, setTemperature] = useState(26);
  const [rainfall, setRainfall] = useState(850);
  const [n, setN] = useState(75);
  const [p, setP] = useState(45);
  const [k, setK] = useState(55);

  const [predictions, setPredictions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Math algorithm to score suitability of each crop
  const calculatePredictions = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const scoredCrops = cropDatabase.map((crop) => {
        const getParamScore = (val, range) => {
          const [min, max] = range;
          if (val >= min && val <= max) return 1.0;
          const center = (min + max) / 2;
          const dist = Math.abs(val - center);
          const maxDist = (max - min) * 1.5 || 10;
          return Math.max(0.1, Number((1 - dist / maxDist).toFixed(2)));
        };

        const phScore = getParamScore(ph, crop.idealPh);
        const tempScore = getParamScore(temperature, crop.idealTemp);
        const rainScore = getParamScore(rainfall, crop.idealRain);
        const nScore = getParamScore(n, crop.idealN);
        const pScore = getParamScore(p, crop.idealP);
        const kScore = getParamScore(k, crop.idealK);

        const overallScore = Math.round(
          ((phScore * 0.15) +
          (tempScore * 0.15) +
          (rainScore * 0.20) +
          (nScore * 0.18) +
          (pScore * 0.16) +
          (kScore * 0.16)) * 100
        );

        return {
          ...crop,
          suitability: Math.min(100, Math.max(10, overallScore))
        };
      });

      const sorted = scoredCrops.sort((a, b) => b.suitability - a.suitability).slice(0, 3);
      setPredictions(sorted);
      setIsAnalyzing(false);
    }, 600);
  };

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
        {/* Title */}
        <div className="border-b border-white/20 pb-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white/90 px-3.5 py-1 text-[10px] font-black text-emerald-800 uppercase tracking-wider mb-1">
            <Brain className="h-3.5 w-3.5 text-emerald-600" />
            {t('cropPredictTitle')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
            {t('cropPredictTitle')} 🌾
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-emerald-100/90 font-medium max-w-2xl">
            {t('cropPredictSubtitle')}
          </p>
        </div>

        {/* Dashboard Layout */}
        <div className="grid gap-6 lg:grid-cols-5">
          
          {/* Inputs Section (Col 1-2): Solid White Card */}
          <div className="lg:col-span-2 rounded-[2.5rem] border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-xl h-fit text-slate-900">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Sliders className="text-emerald-600 h-5 w-5" />
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">{t('soilNutrientsParameters')}</h2>
            </div>

            <div className="space-y-4">
              {/* Soil pH Slider */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="text-slate-600">{t('soilPh')}</span>
                  <span className="text-blue-700 font-black">{ph}</span>
                </div>
                <input
                  type="range" min={4.0} max={9.0} step={0.1} value={ph}
                  onChange={(e) => setPh(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Temp Slider */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="text-slate-600">{t('temperatureC')}</span>
                  <span className="text-amber-700 font-black">{temperature}°C</span>
                </div>
                <input
                  type="range" min={10} max={45} value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
              </div>

              {/* Rainfall Slider */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="text-slate-600">{t('rainfallMm')}</span>
                  <span className="text-emerald-800 font-black">{rainfall} mm</span>
                </div>
                <input
                  type="range" min={200} max={2200} step={25} value={rainfall}
                  onChange={(e) => setRainfall(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* NPK Inputs */}
              <div className="pt-2 border-t border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 mb-3">{t('optimalNPKBalance')}</h3>
                
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">{t('nitrogenLevel')}</label>
                    <input
                      type="number" min={0} max={150} value={n}
                      onChange={(e) => setN(Math.min(150, Math.max(0, Number(e.target.value))))}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-center text-xs font-black text-slate-900 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">{t('phosphorusLevel')}</label>
                    <input
                      type="number" min={0} max={150} value={p}
                      onChange={(e) => setP(Math.min(150, Math.max(0, Number(e.target.value))))}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-center text-xs font-black text-slate-900 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">{t('potassiumLevel')}</label>
                    <input
                      type="number" min={0} max={150} value={k}
                      onChange={(e) => setK(Math.min(150, Math.max(0, Number(e.target.value))))}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-center text-xs font-black text-slate-900 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                onClick={calculatePredictions}
                disabled={isAnalyzing}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-950/20 transition hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Activity className="h-4 w-4 animate-spin text-white" />
                    {t('predictingCrop')}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-white" />
                    {t('predictCropBtn')}
                  </>
                )}
              </button>

            </div>
          </div>

          {/* Predictions Display (Col 3-5): Solid White Card */}
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-[2.5rem] border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-xl min-h-[400px] flex flex-col text-slate-900">
              
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100 justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="text-emerald-600 h-5 w-5" />
                  <h2 className="text-base font-black uppercase tracking-wider text-slate-900">{t('recommendedCropTitle')}</h2>
                </div>
                {predictions.length > 0 && (
                  <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">✓ {t('optimal')}</span>
                )}
              </div>

              {predictions.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 mb-4 border border-emerald-200">
                    <Sprout className="h-8 w-8" />
                  </div>
                  <h3 className="text-base font-black text-slate-900">{t('selectCropLabel')}</h3>
                  <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed font-medium">
                    {t('cropPredictSubtitle')}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 flex-1">
                  <AnimatePresence>
                    {predictions.map((crop, index) => (
                      <motion.div
                        key={crop.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-5 hover:border-emerald-300 transition-all flex flex-col sm:flex-row justify-between gap-4 shadow-sm"
                      >
                        <div className="space-y-2 max-w-md">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-black text-slate-900">{t(crop.cropKey) || crop.name}</span>
                            <span className="text-xs italic text-emerald-800 font-semibold">({crop.scientificName})</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed font-medium">{crop.description}</p>
                          
                          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs font-bold text-slate-700">
                            <div>
                              {t('waterRequirement')}: <span className="text-blue-700 font-bold">{crop.waterNeed}</span>
                            </div>
                            <div>
                              {t('estimatedMarketYield')}: <span className="text-amber-700 font-bold">{crop.marketYield}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col justify-between items-center sm:items-end gap-3 shrink-0">
                          <div className="text-center sm:text-right">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{t('suitabilityConfidence')}</p>
                            <p className="text-2xl font-black text-emerald-700 mt-0.5">{crop.suitability}%</p>
                          </div>
                          
                          <div className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider border ${
                            crop.suitability >= 85 ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                            crop.suitability >= 65 ? "bg-amber-50 text-amber-800 border-amber-200" :
                            "bg-slate-100 text-slate-600 border-slate-200"
                          }`}>
                            {crop.suitability >= 85 ? t('optimal') : crop.suitability >= 65 ? t('moderate') : t('low')}
                          </div>
                        </div>

                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Footer Disclaimer */}
        <div className="rounded-2xl bg-white/90 border border-slate-200 p-4 flex gap-2.5 items-center text-xs text-slate-600 shadow-sm">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{t('agronomicOverview')} • {t('chatWelcome')}</span>
        </div>
      </main>
    </div>
  );
}
