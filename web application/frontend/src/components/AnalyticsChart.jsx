import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis } from 'recharts';

const series = [
  { name: 'Mon', value: 78 },
  { name: 'Tue', value: 86 },
  { name: 'Wed', value: 93 },
  { name: 'Thu', value: 89 },
  { name: 'Fri', value: 96 },
  { name: 'Sat', value: 102 },
  { name: 'Sun', value: 110 },
];

const pieData = [
  { name: 'Healthy', value: 56 },
  { name: 'At Risk', value: 24 },
  { name: 'Infected', value: 20 },
];

const colors = ['#22c55e', '#38bdf8', '#f87171'];

const AnalyticsChart = () => (
  <div className="grid gap-6 lg:grid-cols-2">
    <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-700/80">Yield Forecast</p>
          <h3 className="text-xl font-semibold">Growth trajectory</h3>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={series} margin={{ top: 0, right: -10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorStable" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.36} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
          <Area type="monotone" dataKey="value" stroke="#22c55e" fillOpacity={1} fill="url(#colorStable)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-700/80">Crop Health Mix</p>
          <h3 className="text-xl font-semibold">Condition distribution</h3>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={96} paddingAngle={4}>
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-6 grid grid-cols-3 gap-3 text-sm text-slate-600">
        {pieData.map((item, index) => (
          <div key={item.name} className="rounded-3xl bg-white/5 p-3">
            <p className="font-semibold text-slate-100">{item.name}</p>
            <p>{item.value}%</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AnalyticsChart;
