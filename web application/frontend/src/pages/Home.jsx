import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Brain,
  CloudSun,
  Leaf,
  Map,
  ScanLine,
  ShieldCheck,
  Sprout,
  Tractor,
} from 'lucide-react';
import { useTranslation } from '../i18n';
import LanguageSelector from '../components/LanguageSelector';

const fieldCards = [
  {
    icon: ScanLine,
    labelKey: 'leafAnalysisTitle',
    descKey: 'leafAnalysisDesc',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=900&q=85',
  },
  {
    icon: Map,
    labelKey: 'gisMappingTitle',
    descKey: 'gisMappingDesc',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=85',
  },
  {
    icon: CloudSun,
    labelKey: 'weatherAdvisorTitle',
    descKey: 'weatherAdvisorDesc',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=85',
  },
];

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen overflow-x-hidden w-full select-text text-white">
      {/* ── Cinematic Agriculture Wallpaper Background (Matching Mobile App) ── */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?q=80&w=1920&auto=format&fit=crop')`,
        }}
      />
      {/* Deep Organic Emerald Scrim Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#071609]/95 via-[#0b220e]/90 to-[#040e06]/98 backdrop-blur-[2px] pointer-events-none" />

      {/* Atmospheric Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[150px]" />
        <div className="absolute bottom-10 right-1/4 h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[150px]" />
      </div>

      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <Link to="/home" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-green-500 text-white shadow-xl shadow-emerald-950/80 border border-emerald-400/30">
            <Leaf className="h-6 w-6" />
          </span>
          <span className="text-xl font-black tracking-tight text-white sm:text-2xl">{t('brand')}</span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <Link
            to="/login"
            className="rounded-2xl border border-white/15 bg-white/[0.08] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white backdrop-blur-xl transition hover:bg-white/[0.15]"
          >
            {t('loginBtn')}
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 pb-8 pt-8 sm:px-8 lg:min-h-[calc(100vh-86px)] lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3.5 py-1 text-[10px] font-black text-emerald-300 uppercase tracking-wider mb-2">
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            {t('precisionEcosystem')}
          </div>

          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t('smartFarming')}
            <span className="block text-emerald-300">{t('redefinedByAi')}</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm sm:text-base font-medium leading-relaxed text-emerald-100/75">
            {t('tagline')}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/login" className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-black uppercase tracking-wider shadow-2xl shadow-emerald-950/80 border border-emerald-400/40 cursor-pointer flex items-center justify-center gap-2 transition hover:scale-[1.02]">
              {t('getStarted')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/[0.08] px-8 py-4 text-xs font-black uppercase tracking-wider text-white backdrop-blur-xl transition hover:bg-white/[0.15]"
            >
              {t('signUpBtn')}
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {[
              ['99.8%', t('diagnosisAccuracy')],
              ['< 3s', t('analysisSpeed')],
              ['24/7', t('cloudProtected')],
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-white/15 bg-white/[0.08] p-4 backdrop-blur-2xl shadow-xl text-center sm:text-left">
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="mt-1 text-[9px] font-black uppercase tracking-wider text-emerald-300">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[2.5rem] border border-white/15 bg-white/[0.08] backdrop-blur-2xl shadow-2xl overflow-hidden sm:col-span-2">
            <img
              src="https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1400&q=90"
              alt="Healthy crop field monitored by Agro AI"
              className="h-56 w-full object-cover"
            />
            <div className="p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Brain className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-base font-black text-white">{t('telemetryTitle')}</h2>
                  <p className="text-xs text-white/70 font-medium">{t('telemetryDesc')}</p>
                </div>
              </div>
            </div>
          </div>

          {fieldCards.map(({ icon: Icon, labelKey, descKey, image }) => (
            <article key={labelKey} className="rounded-3xl border border-white/15 bg-white/[0.08] backdrop-blur-2xl shadow-2xl overflow-hidden">
              <img src={image} alt="" className="h-28 w-full object-cover" />
              <div className="p-4">
                <Icon className="mb-2 h-5 w-5 text-emerald-400" />
                <h3 className="font-black text-white text-xs">{t(labelKey)}</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-white/70 font-medium">{t(descKey)}</p>
              </div>
            </article>
          ))}

          <div className="rounded-3xl border border-white/15 bg-white/[0.08] backdrop-blur-2xl shadow-2xl p-4">
            <ShieldCheck className="mb-2 h-5 w-5 text-emerald-400" />
            <h3 className="font-black text-white text-xs">Verified Farm Reports</h3>
            <p className="mt-1 text-[11px] leading-relaxed text-white/70 font-medium">Disease scans, treatments, and crop records stay connected to each farm.</p>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/[0.08] backdrop-blur-2xl shadow-2xl p-4">
            <Tractor className="mb-2 h-5 w-5 text-emerald-400" />
            <h3 className="font-black text-white text-xs">Field Ready Workflows</h3>
            <p className="mt-1 text-[11px] leading-relaxed text-white/70 font-medium">Built around farmer workflows: scan, diagnose, act, and monitor.</p>
          </div>
        </section>
      </main>

      <div className="relative z-10 mx-auto -mt-3 flex max-w-7xl items-center gap-2 px-5 pb-6 text-[10px] font-black uppercase tracking-wider text-emerald-300 sm:px-8">
        <Sprout className="h-4 w-4 text-emerald-400" />
        Smart Agriculture Platform • Multimodal Pathology & Telemetry
      </div>
    </div>
  );
};

export default Home;
