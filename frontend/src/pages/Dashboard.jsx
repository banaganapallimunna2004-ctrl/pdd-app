import React, { useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  Activity,
  AlertTriangle,
  Cpu,
  Leaf,
  Map,
  TrendingUp,
  CloudRain,
  Droplets,
  Sprout,
  Tractor,
  Brain,
  Satellite,
  ShieldCheck,
  Thermometer,
  Wind,
  Gauge,
  Calendar,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

// ---------------- DATA ----------------

const moistureData = [
  { month: "Jan", value: 62 },
  { month: "Feb", value: 75 },
  { month: "Mar", value: 80 },
  { month: "Apr", value: 88 },
  { month: "May", value: 96 },
  { month: "Jun", value: 104 },
];

const cropData = [
  { crop: "Tomato", value: 88 },
  { crop: "Rice", value: 72 },
  { crop: "Corn", value: 95 },
  { crop: "Wheat", value: 81 },
];

const ndviData = [
  { day: "Mon", value: 0.62 },
  { day: "Tue", value: 0.68 },
  { day: "Wed", value: 0.72 },
  { day: "Thu", value: 0.75 },
  { day: "Fri", value: 0.78 },
  { day: "Sat", value: 0.82 },
  { day: "Sun", value: 0.85 },
];

// ---------------- COMPONENT ----------------

export default function Dashboard() {
  const [healthScore] = useState(94);

  const stats = [
    {
      title: "Total Farms",
      value: 128,
      icon: <Leaf size={28} />,
      color: "text-green-400",
    },
    {
      title: "Healthy Crops",
      value: 524,
      icon: <TrendingUp size={28} />,
      color: "text-lime-400",
    },
    {
      title: "Disease Cases",
      value: 12,
      icon: <AlertTriangle size={28} />,
      color: "text-red-400",
    },
    {
      title: "Active Sensors",
      value: 243,
      icon: <Cpu size={28} />,
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#02060f] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-green-500/10 blur-[200px]" />
        <div className="absolute right-0 bottom-0 h-[600px] w-[600px] rounded-full bg-lime-500/10 blur-[200px]" />
        <div
          className="
          absolute inset-0
          bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),
          linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
          bg-[size:40px_40px]
        "
        />
      </div>

      <div className="relative z-10 p-6 lg:p-8">

        {/* Header */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-lime-300 to-emerald-400 bg-clip-text text-transparent">
              AgroVision AI Dashboard
            </h1>

            <p className="mt-3 max-w-3xl text-slate-400">
              Advanced Smart Agriculture Platform powered by Artificial
              Intelligence, Satellite Analytics, IoT Sensors, Weather
              Intelligence and Crop Disease Detection.
            </p>
          </div>

          <div className="rounded-3xl border border-green-500/20 bg-green-500/10 px-6 py-4 backdrop-blur-xl">
            <span className="text-green-300">Farm Health Index</span>
            <h2 className="text-4xl font-bold text-white">
              {healthScore}%
            </h2>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <motion.div
              key={item.title}
              whileHover={{ y: -6 }}
              className="
                rounded-3xl
                border border-white/10
                bg-white/5
                p-6
                backdrop-blur-xl
                transition-all
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400">{item.title}</p>
                  <h2 className="mt-2 text-4xl font-bold">
                    <CountUp end={item.value} duration={2} />
                  </h2>
                </div>
                <div className={item.color}>{item.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Insights + Weather + Status */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <Brain className="text-green-400" />
              <h2 className="text-xl font-semibold">AI Farming Insights</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-green-500/10 p-4">
                🌱 Crop health improved by 14% this month
              </div>

              <div className="rounded-2xl bg-blue-500/10 p-4">
                💧 Soil moisture at optimal level
              </div>

              <div className="rounded-2xl bg-yellow-500/10 p-4">
                ☀ Best irrigation window: 6 AM - 8 AM
              </div>

              <div className="rounded-2xl bg-red-500/10 p-4">
                🐛 Early pest activity detected in Zone B
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <CloudRain className="text-blue-400" />
              <h2 className="text-xl font-semibold">Weather Intelligence</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-blue-500/10 p-4">
                <div className="flex items-center gap-3">
                  <Thermometer className="text-orange-400" />
                  <span>Temperature</span>
                </div>
                <span className="font-semibold">29°C</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-cyan-500/10 p-4">
                <div className="flex items-center gap-3">
                  <Droplets className="text-cyan-400" />
                  <span>Humidity</span>
                </div>
                <span className="font-semibold">78%</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-500/10 p-4">
                <div className="flex items-center gap-3">
                  <Wind className="text-slate-300" />
                  <span>Wind Speed</span>
                </div>
                <span className="font-semibold">12 km/h</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="text-lime-400" />
              <h2 className="text-xl font-semibold">Farm Status</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-2xl bg-green-500/10 p-4">
                <Leaf className="text-green-400" />
                <span>All crop zones healthy</span>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-lime-500/10 p-4">
                <Activity className="text-lime-400" />
                <span>243 field sensors active</span>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 p-4">
                <Gauge className="text-emerald-400" />
                <span>Irrigation efficiency at 92%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Agriculture Modules */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-3xl border border-green-500/20 bg-green-500/5 p-6">
            <Sprout className="mb-3 text-green-400" />
            <h3 className="font-semibold text-lg">Crop Monitoring</h3>
            <p className="mt-2 text-slate-400">
              Real-time crop growth tracking and plant health analytics.
            </p>
          </div>

          <div className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-6">
            <Satellite className="mb-3 text-blue-400" />
            <h3 className="font-semibold text-lg">NDVI Analytics</h3>
            <p className="mt-2 text-slate-400">
              Satellite vegetation index monitoring for precision farming.
            </p>
          </div>

          <div className="rounded-3xl border border-purple-500/20 bg-purple-500/5 p-6">
            <Tractor className="mb-3 text-purple-400" />
            <h3 className="font-semibold text-lg">Drone Monitoring</h3>
            <p className="mt-2 text-slate-400">
              Aerial crop inspection, mapping and field surveillance.
            </p>
          </div>

          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6">
            <AlertTriangle className="mb-3 text-red-400" />
            <h3 className="font-semibold text-lg">Disease Detection</h3>
            <p className="mt-2 text-slate-400">
              AI-powered crop disease diagnosis from leaf images.
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="mb-6 text-xl font-semibold">
              Soil Moisture Trend
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moistureData}>
                <CartesianGrid stroke="#334155" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={4}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="mb-6 text-xl font-semibold">
              Crop Yield Performance
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cropData}>
                <CartesianGrid stroke="#334155" />
                <XAxis dataKey="crop" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="#84cc16"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* NDVI Chart */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-3">
            <Satellite className="text-blue-400" />
            <h2 className="text-xl font-semibold">
              NDVI Vegetation Index
            </h2>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={ndviData}>
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f655"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Farm Map */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-3">
            <Map className="text-green-400" />
            <h2 className="text-xl font-semibold">
              Smart Farm GIS Map
            </h2>
          </div>

          <div
            className="
              flex
              h-[400px]
              items-center
              justify-center
              rounded-3xl
              border
              border-dashed
              border-slate-700
              bg-slate-900/40
              text-center
              px-6
            "
          >
            <div>
              <div className="text-lg font-semibold text-slate-300">
                🗺️ Smart Farm GIS Map
              </div>

              <p className="mt-2 text-slate-500">
                Live Crop Zones • Soil Sensors • Irrigation Network
                • Disease Heatmap • Drone Coverage
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-slate-500">
          🌾 AgroVision AI • Smart Agriculture Intelligence Platform
          <br />
          Powered by AI • IoT • Satellite Analytics • Machine Learning
        </div>
      </div>
    </div>
  );
}