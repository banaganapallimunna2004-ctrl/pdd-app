import { useEffect, useState } from 'react';
import adminService from '../services/adminService';

const AdminPanel = () => {
  const [metrics, setMetrics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const loadAdminMetrics = async () => {
      try {
        const [metricsRes, logsRes] = await Promise.all([adminService.getMetrics(), adminService.getSystemLogs()]);
        setMetrics(metricsRes.data);
        setLogs(logsRes.data.logs || []);
      } catch (error) {
        setStatus(error.response?.data?.message || 'Unable to load admin metrics.');
      }
    };

    loadAdminMetrics();
  }, []);

  if (!metrics) {
    return <div className="flex min-h-screen items-center justify-center">Loading admin console...</div>;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 pb-16 pt-10">
      <section className="rounded-[2.5rem] border border-white/10 bg-slate-950/70 p-10 shadow-glass">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Admin console</p>
            <h1 className="text-4xl font-semibold text-white">Manage users, farms and disease intelligence.</h1>
          </div>
          <button className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300">Create report</button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Users</p>
            <p className="mt-4 text-4xl font-semibold text-white">{metrics.totalUsers}</p>
            <p className="mt-2 text-slate-300">Active farmer, expert and admin accounts.</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Reports</p>
            <p className="mt-4 text-4xl font-semibold text-white">{metrics.totalReports}</p>
            <p className="mt-2 text-slate-300">Disease records currently stored in the system.</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Sensor clusters</p>
            <p className="mt-4 text-4xl font-semibold text-white">{metrics.activeSensors}</p>
            <p className="mt-2 text-slate-300">Farms with active sensor telemetry reporting.</p>
          </div>
        </div>

        {status && <p className="mt-6 rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200">{status}</p>}

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6">
            <h2 className="text-xl font-semibold text-white">Live recommendations</h2>
            <div className="mt-6 space-y-4 text-slate-300">
              {metrics.recommendations?.length ? (
                metrics.recommendations.slice(0, 5).map((rec) => (
                  <div key={rec._id} className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">{rec.cropType}</p>
                    <p className="mt-2 font-semibold text-white">{rec.insight}</p>
                    <p className="mt-1 text-sm text-slate-400">Priority: {rec.priority || 'Normal'}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">No active recommendations available.</p>
              )}
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6">
            <h2 className="text-xl font-semibold text-white">Recent admin logs</h2>
            <div className="mt-6 space-y-3 text-slate-300">
              {logs.length ? (
                logs.slice(0, 5).map((log) => (
                  <div key={log._id} className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="text-sm text-slate-400">{new Date(log.createdAt).toLocaleString()}</p>
                    <p className="mt-2 text-white">{log.action}</p>
                    <p className="mt-1 text-sm text-slate-500">{log.details}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">No log activity found.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminPanel;
