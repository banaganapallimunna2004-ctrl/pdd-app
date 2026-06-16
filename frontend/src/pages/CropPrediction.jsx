import { useState } from "react";

export default function CropPrediction() {
  const [farmSize, setFarmSize] = useState(1);
  const [result] = useState({ crop: "Tomato", confidence: 0.86 });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-semibold">Crop Prediction</h1>
        <p className="mt-3 text-slate-300">
          Placeholder module. Connect this UI to your backend prediction logic.
        </p>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <label className="block text-sm text-slate-300">
            Farm size (hectares): <span className="font-semibold text-white">{farmSize}</span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={farmSize}
            onChange={(e) => setFarmSize(Number(e.target.value))}
            className="mt-4 w-full accent-cyan-400"
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-950/40 p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Predicted crop</p>
              <p className="mt-3 text-2xl font-semibold">{result.crop}</p>
            </div>
            <div className="rounded-xl bg-slate-950/40 p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Confidence</p>
              <p className="mt-3 text-2xl font-semibold">{Math.round(result.confidence * 100)}%</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

