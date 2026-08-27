import React, { useEffect, useState } from 'react';
import { Mail, Phone, X, ShieldAlert } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Event emitter to trigger the popup globally
export const triggerOtpAlert = (data) => {
  const event = new CustomEvent('agro-dev-otp', { detail: data });
  window.dispatchEvent(event);
};

const OtpConsole = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const handleOtp = (e) => {
      const newAlert = {
        id: Date.now(),
        ...e.detail,
        timestamp: new Date().toLocaleTimeString(),
      };
      setAlerts((prev) => [newAlert, ...prev].slice(0, 3)); // keep last 3

      // Auto dismiss after 15s
      setTimeout(() => {
        setAlerts((prev) => prev.filter((a) => a.id !== newAlert.id));
      }, 15000);
    };

    window.addEventListener('agro-dev-otp', handleOtp);
    return () => window.removeEventListener('agro-dev-otp', handleOtp);
  }, []);

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  if (alerts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-80 pointer-events-none">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, x: 50 }}
            className="pointer-events-auto overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-900/95 shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-cyan-950/40 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-semibold tracking-wider text-cyan-700 uppercase">
                  Local Dev Server
                </span>
              </div>
              <button
                onClick={() => removeAlert(alert.id)}
                className="rounded-full p-1 text-slate-500 transition hover:bg-white/10 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-100">
                  {alert.type === 'email' ? (
                    <Mail className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <Phone className="h-5 w-5 text-indigo-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 truncate">
                    Sent to {alert.recipient}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {alert.timestamp}
                  </p>
                </div>
              </div>

              {/* OTP Code Display */}
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 text-center">
                <p className="text-xs text-cyan-200/70 mb-1">Your verification code is:</p>
                <p className="text-3xl font-mono font-bold tracking-[0.2em] text-cyan-400">
                  {alert.code}
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 15, ease: 'linear' }}
              className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default OtpConsole;
