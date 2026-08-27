import React from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SMART_AGRO_BG = "/smart-agro-login-bg.jpg";

const routeConfig = {
  "/dashboard": {
    image: SMART_AGRO_BG,
    scrim: "from-black/60 via-black/40 to-black/70",
    glow1: "bg-emerald-500/15",
    glow2: "bg-amber-500/15",
  },
  "/home": {
    image: SMART_AGRO_BG,
    scrim: "from-black/40 via-black/25 to-black/55",
    glow1: "bg-emerald-500/20",
    glow2: "bg-amber-500/20",
  },
  "/scan": {
    image: SMART_AGRO_BG,
    scrim: "from-black/40 via-black/25 to-black/55",
    glow1: "bg-emerald-500/20",
    glow2: "bg-green-400/20",
  },
  "/crop-prediction": {
    image: SMART_AGRO_BG,
    scrim: "from-black/60 via-black/45 to-black/70",
    glow1: "bg-amber-500/15",
    glow2: "bg-emerald-500/15",
  },
  "/weather": {
    image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=85&w=2560&auto=format&fit=crop",
    scrim: "from-[#05140e]/80 via-[#082216]/70 to-[#030d08]/85",
    glow1: "bg-teal-500/20",
    glow2: "bg-blue-500/18",
  },
  "/analytics": {
    image: SMART_AGRO_BG,
    scrim: "from-black/60 via-black/45 to-black/70",
    glow1: "bg-emerald-500/15",
    glow2: "bg-amber-500/15",
  },
  "/profile": {
    image: SMART_AGRO_BG,
    scrim: "from-black/60 via-black/45 to-black/70",
    glow1: "bg-emerald-500/15",
    glow2: "bg-teal-500/15",
  },
  "/admin": {
    image: SMART_AGRO_BG,
    scrim: "from-black/65 via-black/50 to-black/75",
    glow1: "bg-emerald-500/15",
    glow2: "bg-amber-500/15",
  },
  "/login": {
    image: SMART_AGRO_BG,
    scrim: "from-black/30 via-black/15 to-black/45",
    glow1: "bg-emerald-500/20",
    glow2: "bg-amber-400/15",
  },
  "/register": {
    image: SMART_AGRO_BG,
    scrim: "from-black/30 via-black/15 to-black/45",
    glow1: "bg-emerald-500/20",
    glow2: "bg-amber-400/15",
  },
  "/forgot-password": {
    image: SMART_AGRO_BG,
    scrim: "from-black/40 via-black/25 to-black/50",
    glow1: "bg-emerald-500/15",
    glow2: "bg-amber-500/15",
  },
  "/reset-password": {
    image: SMART_AGRO_BG,
    scrim: "from-black/40 via-black/25 to-black/50",
    glow1: "bg-emerald-500/15",
    glow2: "bg-amber-500/15",
  },
  "/verify": {
    image: SMART_AGRO_BG,
    scrim: "from-black/40 via-black/25 to-black/50",
    glow1: "bg-emerald-500/15",
    glow2: "bg-amber-500/15",
  },
};

const defaultRoute = {
  image: SMART_AGRO_BG,
  scrim: "from-black/40 via-black/25 to-black/50",
  glow1: "bg-emerald-500/15",
  glow2: "bg-amber-500/15",
};

export default function BackgroundByRoute({ children }) {
  const location = useLocation();
  const config = routeConfig[location.pathname] || defaultRoute;

  return (
    <div className="relative min-h-screen w-full select-text text-white overflow-x-hidden bg-[#07130b]">
      {/* ── Fixed Premium Topic-Themed Agriculture Wallpaper Layer ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={config.image}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${config.image}')` }}
          />
        </AnimatePresence>

        {/* ── Organic Luxury Multi-Stage Scrim Overlay ── */}
        <div 
          className={`absolute inset-0 bg-gradient-to-b ${config.scrim} backdrop-blur-[0.5px]`}
        />

        {/* ── Center Soft Radial Glow ── */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.45)_100%)]"
        />

        {/* ── Ambient Floating Glow Orbs ── */}
        <div className={`absolute top-10 left-1/4 h-[500px] w-[500px] rounded-full ${config.glow1} blur-[140px] animate-pulse`} style={{ animationDuration: '7s' }} />
        <div className={`absolute bottom-10 right-1/4 h-[500px] w-[500px] rounded-full ${config.glow2} blur-[140px] animate-pulse`} style={{ animationDuration: '9s' }} />
      </div>

      {/* ── Page Content Layer ── */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}
