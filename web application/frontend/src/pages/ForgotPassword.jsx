import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, CheckCircle2, ArrowLeft, Leaf, Sparkles } from 'lucide-react';
import authService from '../services/authService';
import { useTranslation } from '../i18n';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError(t('enterEmailAddress')); return; }
    setError(''); setIsLoading(true);
    try {
      const res = await authService.forgotPassword({ email: email.trim().toLowerCase() });
      setMessage(res.data?.message || t('checkYourEmail'));
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || t('invalidResetLink'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden w-full select-text text-white">
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-emerald-500 to-green-700 shadow-xl shadow-emerald-950/60 border border-emerald-400/50 hover:scale-105 transition-transform">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
              {t('brand')}
            </h1>
            <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-emerald-300">
              <Sparkles className="h-3 w-3 text-emerald-400 animate-pulse" />
              {t('cloudProtected')}
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/20 bg-black/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-white relative overflow-hidden">
            {!sent ? (
              <>
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-black text-white">{t('forgotPasswordTitle')}</h2>
                  <p className="mt-1 text-xs text-slate-300">
                    {t('forgotPasswordSubtitle')}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-black text-slate-300 uppercase tracking-widest">{t('emailAddress')}</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                      <input
                        id="forgot-email"
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        placeholder="farmer@agroai.com"
                        required
                        className="w-full rounded-2xl border border-white/20 bg-black/50 py-3 pl-10 pr-4 text-white placeholder-slate-400 outline-none transition focus:border-emerald-400 focus:bg-black/70 text-xs sm:text-sm font-medium"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-xl border border-rose-500/30 bg-rose-950/80 p-3 text-xs text-rose-200 font-semibold">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white text-xs font-black uppercase tracking-wider disabled:opacity-60 shadow-xl shadow-emerald-950/60 border border-emerald-300/40 cursor-pointer flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-95"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('sendResetLink')}
                  </button>
                </form>
              </>
            ) : (
              <div className="py-6 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-black text-white">{t('checkYourEmail')}</h2>
                <p className="text-xs text-slate-300">{message || t('didntReceive')}</p>
                <Link
                  to="/login"
                  className="inline-block mt-2 text-xs font-black uppercase tracking-wider text-emerald-400 hover:text-emerald-300 underline"
                >
                  {t('backToLogin')}
                </Link>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/15 text-center">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition">
                <ArrowLeft className="h-3.5 w-3.5" /> {t('backToLogin')}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
