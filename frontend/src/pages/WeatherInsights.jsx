import { useEffect, useState } from "react";

export default function WeatherInsights() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-semibold">Weather Insights</h1>
        <p className="mt-3 text-slate-300">
          Placeholder module. Display forecast and agronomic recommendations here.
        </p>

        {loading ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
            Loading weather insights...
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {["Rain risk", "Humidity", "Irrigation timing"].map((label) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{label}</p>
                <p className="mt-3 text-2xl font-semibold">—</p>
                <p className="mt-2 text-sm text-slate-400">Coming soon</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

