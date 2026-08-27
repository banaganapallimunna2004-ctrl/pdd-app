import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, MailOpen, Leaf, Sparkles, ArrowRight } from 'lucide-react';
import authService from '../services/authService';
import { useTranslation } from '../i18n';
import LanguageSelector from '../components/LanguageSelector';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [state, setState] = useState(token ? 'loading' : 'awaiting');
  const [message, setMessage] = useState('');
  const [inputToken, setInputToken] = useState('');

  const doVerify = async (verifyToken) => {
    setState('loading');
    try {
      const res = await authService.verifyEmail(verifyToken);
      setMessage(res.data?.message || t('emailVerified'));
      setState('success');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setMessage(err.response?.data?.message || t('verificationFailed'));
      setState('error');
    }
  };

  useEffect(() => {
    if (token) {
      doVerify(token);
    }
  }, [token, navigate]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!inputToken.trim()) return;
    doVerify(inputToken.trim());
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden w-full select-text text-white">
      {/* Floating Language Switcher */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageSelector />
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-6 text-center">
            <Link to="/home" className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-emerald-500 to-green-700 shadow-xl shadow-emerald-950/60 border border-emerald-400/50 hover:scale-105 transition-transform">
              <Leaf className="h-8 w-8 text-white" />
            </Link>
            <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
              {t('brand')}
            </h1>
            <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-emerald-300">
              <Sparkles className="h-3 w-3 text-emerald-400 animate-pulse" />
              {t('verifyAccountTitle')}
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/20 bg-black/40 p-6 sm:p-8 text-center shadow-2xl backdrop-blur-xl text-white relative overflow-hidden">
            {/* LOADING */}
            {state === 'loading' && (
              <div className="py-6">
                <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-emerald-400" />
                <h2 className="text-lg font-black text-white">{t('verifyingEmail')}</h2>
                <p className="mt-2 text-xs text-slate-300">{t('pleaseWait')}</p>
              </div>
            )}

            {/* SUCCESS */}
            {state === 'success' && (
              <div className="py-6 space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-black text-white">{t('emailVerified')}</h2>
                <p className="text-xs text-emerald-300 font-bold">{message}</p>
                <p className="text-xs text-slate-300">{t('redirectingSignIn')}</p>
                <div className="mt-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-xs font-black uppercase text-white shadow-lg"
                  >
                    <span>{t('signInNow')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* ERROR */}
            {state === 'error' && (
              <div className="py-6 space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/20 text-rose-300 border border-rose-400">
                  <XCircle className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-black text-white">{t('verificationFailed')}</h2>
                <p className="text-xs text-rose-300 font-bold">{message}</p>
                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-xs font-black uppercase text-white shadow-lg hover:bg-emerald-500"
                  >
                    {t('backToLogin')}
                  </Link>
                </div>
              </div>
            )}

            {/* AWAITING */}
            {state === 'awaiting' && (
              <div className="py-4 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <MailOpen className="h-7 w-7" />
                </div>
                <h2 className="text-xl font-black text-white">{t('verifyAccountTitle')}</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('verifyAccountSubtitle')}
                </p>

                <form onSubmit={handleManualSubmit} className="mt-4 space-y-3">
                  <input
                    type="text"
                    value={inputToken}
                    onChange={(e) => setInputToken(e.target.value)}
                    placeholder={t('verifyCodePlaceholder')}
                    className="w-full rounded-2xl border border-white/20 bg-black/50 py-3 px-4 text-white placeholder-slate-400 outline-none transition focus:border-emerald-400 text-xs"
                  />
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-black uppercase tracking-wider shadow-lg hover:scale-[1.01]"
                  >
                    {t('verifyBtn')}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Verify;
