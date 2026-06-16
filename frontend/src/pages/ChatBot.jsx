import {
  Brain,
  Sparkles,
  MapPin,
  CloudSun,
  ShieldCheck,
  Activity,
  Bot,
} from "lucide-react";

import AIChatBot from "../components/AIChatBot";
import LiveLocationMap from "../components/LiveLocationMap";

const ChatBot = () => {
  const features = [
    {
      title: "Disease Detection",
      icon: <Brain size={18} />,
    },
    {
      title: "Fertilizer Planning",
      icon: <Sparkles size={18} />,
    },
    {
      title: "Weather Intelligence",
      icon: <CloudSun size={18} />,
    },
    {
      title: "Nearby Suppliers",
      icon: <MapPin size={18} />,
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712]">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[180px]" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[180px]" />
        <div
          className="
          absolute inset-0
          bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
          bg-[size:40px_40px]
          "
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        {/* Hero Section */}
        <div
          className="
          mb-10
          overflow-hidden
          rounded-[32px]
          border
          border-white/10
          bg-white/5
          p-8
          backdrop-blur-2xl
          "
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div
                className="
                mb-4
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-cyan-500/20
                bg-cyan-500/10
                px-4
                py-2
                text-cyan-300
                "
              >
                <Bot size={18} />
                Agro AI Farm Desk
              </div>

              <h1 className="max-w-4xl text-5xl font-bold text-white">
                Intelligent Agricultural Assistant
              </h1>

              <p className="mt-4 max-w-3xl text-lg text-slate-400">
                Powered by advanced AI models for disease diagnosis,
                smart irrigation planning, fertilizer recommendations,
                weather intelligence, and real-time farm monitoring.
              </p>
            </div>

            <div
              className="
              rounded-3xl
              border
              border-cyan-500/20
              bg-cyan-500/10
              p-6
              "
            >
              <div className="flex items-center gap-3">
                <Activity className="text-green-400" />
                <div>
                  <p className="text-sm text-slate-400">AI Status</p>
                  <p className="font-semibold text-white">Online & Learning</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="mt-8 flex flex-wrap gap-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-white/10
                bg-white/5
                px-5
                py-3
                text-sm
                text-slate-200
                "
              >
                {feature.icon}
                {feature.title}
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-slate-400">AI Accuracy</p>
            <h2 className="mt-2 text-4xl font-bold text-white">98.6%</h2>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-slate-400">Disease Models</p>
            <h2 className="mt-2 text-4xl font-bold text-white">250+</h2>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-slate-400">Live Sensors</p>
            <h2 className="mt-2 text-4xl font-bold text-white">1200+</h2>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-slate-400">Smart Recommendations</p>
            <h2 className="mt-2 text-4xl font-bold text-white">Real-Time</h2>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          {/* AI Chat Section */}
          <div
            className="
            rounded-[32px]
            border
            border-white/10
            bg-white/5
            p-6
            backdrop-blur-2xl
            "
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Agro AI Farm Assistant
                </h2>
                <p className="mt-1 text-slate-400">
                  Ask anything about crops, diseases, irrigation, weather,
                  fertilizers, or farm management.
                </p>
              </div>

              <Brain size={30} className="text-cyan-400" />
            </div>

            <AIChatBot />
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* Live Location */}
            <div
              className="
              rounded-[32px]
              border
              border-white/10
              bg-white/5
              p-6
              backdrop-blur-2xl
              "
            >
              <div className="mb-4 flex items-center gap-3">
                <MapPin className="text-cyan-400" />
                <h3 className="text-xl font-semibold text-white">Live Farm Location</h3>
              </div>
              <LiveLocationMap />
            </div>

            {/* Security */}
            <div
              className="
              rounded-[32px]
              border
              border-green-500/20
              bg-green-500/10
              p-6
              "
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-green-400" />
                <div>
                  <h3 className="font-semibold text-white">Secure AI Processing</h3>
                  <p className="mt-1 text-sm text-slate-300">
                    All conversations are encrypted and processed securely through the AI engine.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div
              className="
              rounded-[32px]
              border
              border-white/10
              bg-white/5
              p-6
              "
            >
              <h3 className="mb-4 text-xl font-semibold text-white">Suggested Questions</h3>

              <div className="space-y-3">
                {[
                  "Predict disease from leaf symptoms",
                  "Best fertilizer for tomato crop",
                  "Irrigation plan for this week",
                  "Nearby agriculture supply stores",
                  "Weather impact on crop growth",
                ].map((item) => (
                  <button
                    key={item}
                    className="
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-slate-900/60
                    px-4
                    py-3
                    text-left
                    text-sm
                    text-slate-300
                    transition
                    hover:border-cyan-500/30
                    hover:bg-slate-800
                    "
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChatBot;

