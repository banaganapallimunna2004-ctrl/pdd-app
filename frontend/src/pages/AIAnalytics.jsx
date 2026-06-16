import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AIAnalytics() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mx-auto max-w-5xl px-6 py-10"
      >
        <h1 className="text-3xl font-semibold">AI Analytics</h1>
        <p className="mt-3 text-slate-300">
          Analytics module placeholder. Replace this with your real AI analytics dashboard.
        </p>

        {loading ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
            Loading analytics...
          </div>
        ) : (
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {["Disease trends", "Weather impact", "Yield forecast"].map((label) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{label}</p>
                <p className="mt-3 text-2xl font-semibold">—</p>
                <p className="mt-2 text-sm text-slate-400">Coming soon</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}

