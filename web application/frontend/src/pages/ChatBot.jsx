import React from 'react';
import {
  Activity,
  ArrowLeft,
  Brain,
  CloudSun,
  Leaf,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Store,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import AIChatBot from '../components/AIChatBot';
import LiveLocationMap from '../components/LiveLocationMap';
import { useTranslation } from '../i18n';

const ChatBot = () => {
  const { t } = useTranslation();

  const capabilityCards = [
    {
      title: t('disDetection') || 'Disease Triage',
      detail: t('scanDesc') || 'Explain symptoms and get likely causes, pathogen urgency, and treatment options.',
      icon: Brain,
    },
    {
      title: t('fertPlanning') || 'Fertilizer Planning',
      detail: t('soilNutrientIndex') || 'Plan NPK, bio-stimulants, organic compost, and dosage timing based on crop stage.',
      icon: Sparkles,
    },
    {
      title: t('weatherInsightsTitle') || 'Weather Decisions',
      detail: t('weatherInsightsSubtitle') || 'Convert real-time humidity, rain forecasts, and heat risk into daily field actions.',
      icon: CloudSun,
    },
    {
      title: t('nearbySuppliers') || 'Supplier Context',
      detail: t('precisionEcosystem') || 'Get recommendations for certified agronomists and verified farm supply hubs.',
      icon: Store,
    },
  ];

  return (
    <div className="relative min-h-screen w-full select-text text-white overflow-x-hidden p-4 sm:p-6 lg:p-8">
      {/* ── Cinematic Agriculture Wallpaper Background (Matching Mobile App ChatbotScreen.kt) ── */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1920&auto=format&fit=crop')`,
        }}
      />
      {/* Deep Organic Emerald Scrim Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#071609]/95 via-[#0b220e]/92 to-[#040e06]/98 backdrop-blur-[2px] pointer-events-none" />

      {/* Atmospheric Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[150px]" />
        <div className="absolute bottom-10 right-1/4 h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[150px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl pb-20 select-text text-white">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/dashboard"
              className="mb-4 inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-bold text-emerald-300 backdrop-blur-xl transition hover:bg-white/[0.15]"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('navDashboard')}
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3.5 py-1 text-[10px] font-black text-emerald-300 uppercase tracking-wider mb-2">
              <MessageSquareText className="h-3.5 w-3.5 text-emerald-400" />
              {t('chatbotPageBadge')}
            </div>

            <h1 className="mt-2 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl">
              {t('chatbotPageTitle')}
            </h1>
            <p className="mt-2 max-w-3xl text-xs sm:text-sm font-medium text-emerald-100/70">
              {t('chatbotPageDesc')}
            </p>
          </div>

          <div className="flex min-w-[200px] items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.08] p-4 backdrop-blur-2xl shadow-xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Activity className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-200/70">{t('aiStatus')}</p>
              <p className="font-black text-white text-sm flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {t('aiOnline')}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {capabilityCards.map(({ title, detail, icon: Icon }) => (
            <article key={title} className="rounded-3xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur-2xl shadow-xl hover:border-emerald-400/40 transition">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="font-black text-white text-sm">{title}</h2>
              <p className="mt-1.5 text-xs text-white/70 leading-5">{detail}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <AIChatBot />

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/15 bg-white/[0.08] backdrop-blur-2xl shadow-2xl overflow-hidden">
              <div className="border-b border-white/10 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-black text-white text-sm">{t('liveFarmLocation')}</h3>
                    <p className="text-[10px] text-white/60">{t('liveZoningsDesc')}</p>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <LiveLocationMap />
              </div>
            </section>

            <section className="rounded-3xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur-2xl shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300">{t('secureProcessing')}</h4>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-medium">
                {t('secureProcessingDesc')}
              </p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ChatBot;
