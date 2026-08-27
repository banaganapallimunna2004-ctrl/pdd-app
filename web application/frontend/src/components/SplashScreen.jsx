import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Cpu, Sparkles, Radio } from 'lucide-react';

const bootSteps = [
  'Initializing Precision Crop Vision Core...',
  'Connecting Multi-Spectral Field Telemetry...',
  'Synchronizing Crop Pathology Engine...',
  'Calibrating Agro Climate & Soil Sensors...',
  'AgroAI System Online & Ready.'
];

export default function SplashScreen({ onFinish }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex((prev) => (prev < bootSteps.length - 1 ? prev + 1 : prev));
    }, 550);

    const timer = setTimeout(() => {
      sessionStorage.setItem('agro_splash_viewed', 'true');
      onFinish?.();
    }, 3200);

    return () => {
      clearInterval(stepTimer);
      clearTimeout(timer);
    };
  }, [onFinish]);

  const handleSkip = () => {
    sessionStorage.setItem('agro_splash_viewed', 'true');
    onFinish?.();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.7, ease: 'easeInOut' } }}
      onClick={handleSkip}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center cursor-pointer select-none bg-black text-white overflow-hidden"
    >
      {/* ── Genuine Real-World Agricultural Photography Background ── */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-10000"
        style={{
          backgroundImage: `url('/real-splash-bg.jpg')`,
        }}
      />

      {/* Atmospheric Warm Organic Scrim & Depth Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/85 backdrop-blur-[1px]" />

      {/* Ambient Sunburst & Emerald Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/20 rounded-full blur-[130px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-emerald-500/25 rounded-full blur-[140px]" />
      </div>

      {/* Live System Status Badges */}
      <div className="absolute top-8 left-8 hidden sm:flex items-center gap-2 rounded-full border border-emerald-400/30 bg-black/50 px-4 py-1.5 text-[11px] font-bold text-emerald-300 backdrop-blur-md shadow-xl">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        <span>AGRO-AI VISION v2.4 • ONLINE</span>
      </div>

      <div className="absolute top-8 right-8 hidden sm:flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 py-1.5 text-[11px] font-bold text-amber-300 backdrop-blur-md shadow-xl">
        <Radio className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
        <span>PRECISION SENSORS: 100%</span>
      </div>

      {/* ── Center Splash Hero Card ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
        {/* Animated Brand Emblem */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 rounded-3xl bg-emerald-400/30 blur-2xl animate-pulse" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-800 shadow-2xl shadow-emerald-950/80 border border-emerald-300/50">
            <Leaf className="h-12 w-12 text-white drop-shadow-md" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-lg">
            Agro<span className="text-emerald-400">AI</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-black tracking-[0.25em] text-emerald-300 uppercase drop-shadow-sm flex items-center justify-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            Smart Agriculture & Precision Crop Health
          </p>
        </motion.div>

        {/* Boot Telemetry Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-8 flex items-center gap-2 rounded-2xl border border-white/20 bg-black/50 px-5 py-2 text-xs font-semibold text-slate-200 backdrop-blur-md min-w-[280px] justify-center shadow-xl"
        >
          <Cpu className="h-3.5 w-3.5 text-emerald-400 animate-spin" />
          <span className="text-emerald-200 transition-all duration-300">
            {bootSteps[stepIndex]}
          </span>
        </motion.div>

        {/* Progress Bar */}
        <div className="mt-6 w-56 h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/20 p-0.5">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.25, duration: 2.8, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-emerald-400 via-green-400 to-amber-300 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.8)]"
          />
        </div>
        
        <p className="mt-6 text-[10px] tracking-widest text-slate-400 hover:text-white uppercase font-bold transition">
          Click anywhere to skip
        </p>
      </div>
    </motion.div>
  );
}
