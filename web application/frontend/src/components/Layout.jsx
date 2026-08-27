import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ScanLine, Activity, CloudSun, Sparkles, Sprout, ShieldAlert, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n';
import LanguageSelector from './LanguageSelector';

export default function Layout({ children }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const baseNavItems = [
    { name: t('navDashboard') || t('dashboardTitle') || 'Dashboard', icon: Home, path: '/dashboard' },
    { name: t('navScanDisease') || t('scanDisease') || 'Scan Disease', icon: ScanLine, path: '/scan' },
    { name: t('navAnalytics') || t('analytics') || 'Analytics', icon: Activity, path: '/analytics' },
    { name: t('navCropAi') || 'Crop AI', icon: Sparkles, path: '/crop-prediction' },
    { name: t('navWeather') || 'Weather', icon: CloudSun, path: '/weather' },
  ];

  const navItems = user?.role === 'Admin'
    ? [...baseNavItems, { name: t('navAdmin') || 'Admin', icon: ShieldAlert, path: '/admin' }]
    : baseNavItems;

  return (
    <div className="min-h-screen bg-transparent text-slate-900 flex flex-col font-sans">
      {/* Desktop Navigation Header: Crisp Solid White Glass */}
      <nav className="hidden lg:flex sticky top-0 z-50 items-center justify-between border-b border-slate-200/80 bg-white/95 px-8 py-3.5 backdrop-blur-xl shadow-md text-slate-900">
        {/* Brand Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-green-600 shadow-md shadow-emerald-950/20 border border-emerald-400/40 group-hover:scale-105 transition-transform">
            <Sprout className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-900 block leading-none">Agro AI</span>
            <span className="text-[10px] font-black tracking-wider text-emerald-600 uppercase">{t('precisionEcosystem') || 'Precision Agriculture'}</span>
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-2 text-xs font-black px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-emerald-600 to-green-600 shadow-md shadow-emerald-900/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                <item.icon size={16} className={isActive ? 'text-white' : 'text-emerald-600'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-3">
          <LanguageSelector />
          
          {user && (
            <Link
              to="/profile"
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 shadow-sm transition cursor-pointer group"
              title="View Farm Profile & Settings"
            >
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 text-white flex items-center justify-center text-xs font-black shadow-sm group-hover:scale-105 transition-transform">
                {user.name?.charAt(0).toUpperCase() || 'F'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-none group-hover:text-emerald-700 transition-colors">{user.name}</span>
                <span className="text-[10px] font-bold text-emerald-600 mt-0.5">{user.role || t('smartFarmer')}</span>
              </div>
            </Link>
          )}

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-rose-600 hover:bg-rose-50 transition-colors border border-rose-200 cursor-pointer bg-white shadow-sm"
            title="Sign out of system"
          >
            <LogOut size={15} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 text-white shadow-sm">
            <Sprout className="h-5 w-5" />
          </div>
          <span className="text-base font-black tracking-tight text-slate-900">Agro AI</span>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSelector compact />
          {user && (
            <button
              type="button"
              onClick={logout}
              className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition border border-rose-200 cursor-pointer bg-white"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pb-28 lg:pb-0">
        {children}
      </main>

      {/* Mobile Floating Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-lg z-50">
        <div className="bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-[28px] px-2 py-2 flex items-center justify-around shadow-2xl">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center gap-1 py-1.5 px-3 transition-all"
              >
                <div className={`p-2 rounded-2xl transition-all ${isActive ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}>
                  <item.icon size={20} />
                </div>
                <span className={`text-[10px] font-black tracking-tight ${isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {item.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="active-pill-mobile"
                    className="absolute inset-0 bg-emerald-50 rounded-[28px] -z-10"
                    transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
