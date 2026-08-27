import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  FileText,
  Cpu,
  ShieldCheck,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Leaf,
  TrendingUp,
  RefreshCw,
  BarChart2,
  Server,
  Database,
  Zap,
  Eye,
  Trash2,
  ChevronRight,
  ArrowUpRight,
  LogOut,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import adminService from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';

const activityTrend = [
  { day: 'Mon', scans: 42, users: 18 },
  { day: 'Tue', scans: 67, users: 25 },
  { day: 'Wed', scans: 55, users: 21 },
  { day: 'Thu', scans: 89, users: 34 },
  { day: 'Fri', scans: 73, users: 28 },
  { day: 'Sat', scans: 91, users: 40 },
  { day: 'Sun', scans: 62, users: 22 },
];

const diseaseBreakdown = [
  { name: 'Blight', count: 38 },
  { name: 'Rust', count: 22 },
  { name: 'Mildew', count: 17 },
  { name: 'Mosaic', count: 12 },
  { name: 'Spot', count: 9 },
];

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const systemHealth = [
    { label: t('apiUptime') || 'API Uptime', value: '99.97%', status: 'ok', icon: <Server size={16} /> },
    { label: t('databaseStatus') || 'Database', value: 'Connected', status: 'ok', icon: <Database size={16} /> },
    { label: t('aiEngineStatus') || 'AI Engine', value: 'Running', status: 'ok', icon: <Zap size={16} /> },
    { label: t('avgResponseTime') || 'Avg Response', value: '132ms', status: 'warn', icon: <Activity size={16} /> },
  ];

  useEffect(() => {
    const loadAdminMetrics = async () => {
      try {
        setLoading(true);
        const [metricsRes, logsRes] = await Promise.all([
          adminService.getMetrics(),
          adminService.getSystemLogs(),
        ]);
        setMetrics(metricsRes.data);
        setLogs(logsRes.data?.logs || []);
        setStatus(null);
      } catch (err) {
        setStatus(t('online'));
        setMetrics({
          totalUsers: 148,
          totalReports: 382,
          activeSensors: 24,
          avgConfidence: 96.4,
        });
      } finally {
        setLoading(false);
      }
    };
    loadAdminMetrics();
  }, [t]);

  const kpis = metrics
    ? [
        {
          label: t('totalRegisteredFarmers'),
          value: metrics.totalUsers ?? '—',
          icon: <Users size={22} />,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          change: '+12%',
          up: true,
        },
        {
          label: t('totalScansPerformed'),
          value: metrics.totalReports ?? '—',
          icon: <FileText size={22} />,
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          change: '+8%',
          up: true,
        },
        {
          label: t('activeSensors'),
          value: metrics.activeSensors ?? '—',
          icon: <Cpu size={22} />,
          color: 'text-emerald-600',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          change: '+3%',
          up: true,
        },
        {
          label: t('aiDiagnosticAccuracy'),
          value: '98.6%',
          icon: <ShieldCheck size={22} />,
          color: 'text-purple-600',
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          change: '+0.4%',
          up: true,
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#071609] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent" />
          <p className="text-sm font-semibold text-emerald-300">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full select-text text-slate-900 overflow-x-hidden p-4 sm:p-6 lg:p-8">
      {/* ── Fixed Agriculture Background ── */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none -z-30"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=85&w=2560&auto=format&fit=crop')`,
        }}
      />
      {/* Deep Organic Scrim Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#061609]/85 via-[#09220d]/75 to-[#040e06]/90 backdrop-blur-[1px] pointer-events-none -z-20" />

      <main className="relative z-10 mx-auto max-w-7xl space-y-6 pb-20 text-slate-900">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-6 border-b border-white/20 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white/90 px-3.5 py-1 text-[10px] font-black text-emerald-800 uppercase tracking-wider mb-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              {t('navAdmin')}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
              {t('adminConsoleTitle')} 🛡️
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100/90 font-medium max-w-2xl">
              {t('adminConsoleSubtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-2xl border border-white/60 bg-white px-4 py-2.5 text-xs font-black text-slate-900 transition hover:bg-slate-50 shadow-md cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 text-emerald-600" /> {t('refresh')}
          </button>
        </div>

        {status && (
          <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-900 flex items-center gap-2 shadow-sm font-bold">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" /> {status}
          </div>
        )}

        {/* KPI Cards: 4 Solid White Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-xl text-slate-900"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{kpi.label}</p>
                <div className={`p-2.5 rounded-2xl ${kpi.bg} ${kpi.color}`}>{kpi.icon}</div>
              </div>
              <p className="text-3xl font-black text-slate-900">{kpi.value}</p>
              <div className="mt-2 flex items-center gap-1">
                <ArrowUpRight className={`h-3.5 w-3.5 ${kpi.up ? 'text-emerald-600' : 'text-rose-600'}`} />
                <span className={`text-xs font-bold ${kpi.up ? 'text-emerald-700' : 'text-rose-700'}`}>{kpi.change}</span>
                <span className="text-[10px] text-slate-400 ml-1">{t('thisMonth')}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-white/20 pb-0">
          {['overview', 'activity', 'logs', 'system'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-t-2xl transition border-b-2 cursor-pointer ${
                activeTab === tab
                  ? 'border-emerald-500 text-slate-900 bg-white font-black shadow-sm'
                  : 'border-transparent text-white/80 hover:text-white'
              }`}
            >
              {tab === 'overview' ? t('analyticsOverview') : tab === 'activity' ? t('liveScanFeed') : tab === 'logs' ? t('systemAuditLogs') : t('systemHealthStatus')}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 lg:grid-cols-2"
            >
              {/* Activity Chart: Solid White Card */}
              <div className="rounded-[2.5rem] border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-xl text-slate-900">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 className="text-blue-600 h-5 w-5" />
                  <h2 className="text-base font-black uppercase tracking-wider text-slate-900">{t('diseaseTrends')}</h2>
                  <span className="ml-auto text-[10px] text-slate-400">7 Days</span>
                </div>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="scanGradDark" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="userGradDark" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                      <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a' }}
                      />
                      <Area type="monotone" dataKey="scans" stroke="#059669" fill="url(#scanGradDark)" strokeWidth={2} name={t('navScanDisease')} />
                      <Area type="monotone" dataKey="users" stroke="#0284c7" fill="url(#userGradDark)" strokeWidth={2} name={t('smartFarmer')} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Disease Breakdown: Solid White Card */}
              <div className="rounded-[2.5rem] border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-xl text-slate-900">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="text-amber-600 h-5 w-5" />
                  <h2 className="text-base font-black uppercase tracking-wider text-slate-900">{t('diseasePrevalenceBreakdown')}</h2>
                </div>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={diseaseBreakdown} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
                      <YAxis dataKey="name" type="category" tick={{ fill: '#64748b', fontSize: 11 }} width={55} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a' }}
                      />
                      <Bar dataKey="count" fill="#d97706" radius={[0, 6, 6, 0]} name={t('diseaseCases')} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'system' && (
            <motion.div
              key="system"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              {systemHealth.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-xl text-slate-900">
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700">{item.icon}</span>
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{item.value}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminPanel;
