import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import SmartMap from '../components/SmartMap';
import farmService from '../services/farmService';
import reportService from '../services/reportService';
import sensorService from '../services/sensorService';
import recommendationService from '../services/recommendationService';

const emptyWidget = [
  { label: 'Active farms', value: 0, accent: 'bg-cyan-500/10 text-cyan-200' },
  { label: 'Recent reports', value: 0, accent: 'bg-slate-700/10 text-slate-200' },
  { label: 'Critical alerts', value: 0, accent: 'bg-rose-500/10 text-rose-200' },
  { label: 'Active sensors', value: 0, accent: 'bg-violet-500/10 text-violet-200' },
];

const defaultLineData = [
  { name: 'Jan', score: 68 },
  { name: 'Feb', score: 74 },
  { name: 'Mar', score: 82 },
  { name: 'Apr', score: 91 },
  { name: 'May', score: 98 },
  { name: 'Jun', score: 104 },
];

const defaultBarData = [
  { name: 'Tomato', value: 76 },
  { name: 'Wheat', value: 88 },
  { name: 'Corn', value: 60 },
  { name: 'Rice', value: 53 },
];

const Dashboard = () => {
  const [activeChart, setActiveChart] = useState('line');
  const [farms, setFarms] = useState([]);
  const [reports, setReports] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setStatus(null);
      try {
        const [farmsRes, reportsRes, sensorsRes, recsRes] = await Promise.all([
          farmService.getFarms(),
          reportService.getLatestReports(),
          sensorService.getLatestSensors(),
          recommendationService.getRecommendations(),
        ]);

        setFarms(farmsRes.data.farms || []);
        setReports(reportsRes.data.reports || []);
        setSensors(sensorsRes.data.readings || []);
        setRecommendations(recsRes.data.recommendations || []);
      } catch (error) {
        setStatus(error.response?.data?.message || 'Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const recentCritical = useMemo(
    () => reports.filter((report) => report.severity === 'Critical').length,
    [reports]
  );

  const widgetData = useMemo(
    () => [
      { label: 'Active farms', value: farms.length, accent: 'bg-cyan-500/10 text-cyan-200' },
      { label: 'Recent reports', value: reports.length, accent: 'bg-emerald-500/10 text-emerald-200' },
      { label: 'Critical alerts', value: recentCritical, accent: 'bg-rose-500/10 text-rose-200' },
      { label: 'Active sensors', value: sensors.length, accent: 'bg-violet-500/10 text-violet-200' },
    ],
    [farms.length, reports.length, sensors.length, recentCritical]
  );

  const sensorHealth = useMemo(() => {
    if (!sensors.length) return 91;
    const average = sensors.slice(0, 5).reduce((sum, reading) => sum + (reading.value || 0), 0) / Math.min(sensors.length, 5);
    return Math.max(75, Math.min(99, Math.round(average)));
  }, [sensors]);

  const focusCrop = useMemo(() => recommendations[0]?.cropType || 'Tomato', [recommendations]);

  const lineData = useMemo(() => {
    if (!sensors.length) return defaultLineData;
    return sensors
      .slice(0, 6)
      .reverse()
      .map((reading) => ({
        name: new Date(reading.recordedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: Math.round(reading.value),
      }));
  }, [sensors]);

  const barData = useMemo(() => {
    if (!reports.length) return defaultBarData;
    const counts = reports.reduce((acc, report) => {
      acc[report.cropType] = (acc[report.cropType] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [reports]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 pb-16 pt-10">
      <div className="mb-10 flex flex-col gap-6 rounded-[2.5rem] border border-white/10 bg-slate-950/70 p-10 shadow-glass">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Farmer dashboard</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Command farm operations with precision.</h1>
            <p className="mt-3 max-w-2xl text-slate-300">A professional AI + sensor workspace for crop intelligence, disease vigilance, and smart field planning.</p>
          </div>
          <div className="rounded-3xl bg-slate-900/80 px-5 py-3 text-slate-300">Farm Health Score: <span className="font-semibold text-white">{sensorHealth}%</span></div>
        </div>
        <div className="grid gap-6 lg:grid-cols-4">
          {widgetData.map((widget) => (
            <motion.div key={widget.label} whileHover={{ y: -4 }} className={`rounded-[2rem] border border-white/10 p-6 shadow-glass ${widget.accent}`}>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-300">{widget.label}</p>
              <p className="mt-4 text-4xl font-semibold text-white">{widget.value}</p>
            </motion.div>
          ))}
        </div>
        {status && <p className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200">{status}</p>}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">AI focus</p>
            <p className="mt-3 text-xl font-semibold text-white">Priority crop: {focusCrop}</p>
            <p className="mt-2 text-sm text-slate-300">Recommended actions are updated from the latest field signals and disease reports.</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">Sensor status</p>
            <p className="mt-3 text-xl font-semibold text-white">{sensors.length} live reading(s)</p>
            <p className="mt-2 text-sm text-slate-300">Telemetry is actively monitored to protect crop health and irrigation timing.</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">Quick actions</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link to="/scan" className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">Scan disease</Link>
              <Link to="/chatbot" className="rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-white">Open AI assistant</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2.5rem] border border-white/10 bg-slate-950/70 p-8 shadow-glass">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Sensor & yield analytics</h2>
              <p className="text-slate-400">Live insights from your fields and crop forecast for the week.</p>
            </div>
            <div className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-200">Updated just now</div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={lineData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
              <Line type="monotone" dataKey="score" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4, fill: '#38bdf8' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-[2.5rem] border border-white/10 bg-slate-950/70 p-8 shadow-glass">
          <h2 className="mb-4 text-2xl font-semibold text-white">Crop health snapshot</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" width={90} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
              <Bar dataKey="value" fill="#22c55e" radius={[12, 12, 12, 12]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        <SmartMap />
        <div className="rounded-[2.5rem] border border-white/10 bg-slate-950/70 p-8 shadow-glass">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Live crop recommendation</h2>
              <p className="text-slate-400">Targeted actions powered by sensor signals and intelligence.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setActiveChart('line')} className={`rounded-full px-4 py-2 text-sm ${activeChart === 'line' ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-slate-300'}`}>Line</button>
              <button onClick={() => setActiveChart('bar')} className={`rounded-full px-4 py-2 text-sm ${activeChart === 'bar' ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-slate-300'}`}>Bar</button>
            </div>
          </div>
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-900/80 p-6">
                <h3 className="text-sm uppercase tracking-[0.22em] text-slate-400">Recommendations</h3>
                <p className="mt-3 text-3xl font-semibold text-white">{recommendations.length} active</p>
                <p className="mt-2 text-slate-300">Top suggestions for your managed fields.</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-6">
                <h3 className="text-sm uppercase tracking-[0.22em] text-slate-400">Critical alerts</h3>
                <p className="mt-3 text-3xl font-semibold text-white">{recentCritical}</p>
                <p className="mt-2 text-slate-300">High-priority disease warnings from recent scans.</p>
              </div>
            </div>
            <div className="rounded-[2rem] bg-slate-900/80 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Top recommendations</p>
              {recommendations.length ? (
                <ul className="mt-4 space-y-4">
                  {recommendations.slice(0, 3).map((rec) => (
                    <li key={rec._id} className="rounded-3xl bg-slate-950/80 p-4">
                      <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">{rec.cropType}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{rec.insight}</p>
                      <p className="mt-2 text-sm text-slate-400">Priority: {rec.priority || 'Normal'}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-slate-400">No active recommendations yet. Add farm telemetry or generate a new report.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
