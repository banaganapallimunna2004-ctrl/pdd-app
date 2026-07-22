import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, MailOpen, Leaf } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const doVerify = async (verifyToken) => {
    setState('loading');
    try {
      const res = await authService.verifyEmail(verifyToken);
      setMessage(res.data.message || 'Your email has been verified!');
      setState('success');
      setTimeout(() => navigate('/'), 2500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Verification failed. The link may be expired or invalid.');
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
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Background image overlay */}
      <div 
        className="pointer-events-none absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20" 
        style={{ filter: 'brightness(1.05) blur(1px)' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white via-slate-50/90 to-emerald-50/20" />

      {/* Grid overlay and ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-600/10 blur-[150px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-700/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Floating Language Switcher */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageSelector />
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link to="/home" className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-500 shadow-xl shadow-cyan-400/20 hover:scale-105 transition-transform">
              <Leaf className="h-8 w-8 text-slate-950" />
            </Link>
            <h1 className="bg-gradient-to-r from-cyan-400 to-emerald-300 bg-clip-text text-3xl font-extrabold text-transparent tracking-tight">
              {t('brand')}
            </h1>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-8 text-center shadow-xl backdrop-blur-md">
            {/* LOADING */}
            {state === 'loading' && (
              <div className="py-6">
                <Loader2 className="mx-auto mb-4 h-14 w-14 animate-spin text-cyan-400" />
                <h2 className="text-xl font-bold text-slate-900">Verifying your email…</h2>
                <p className="mt-2 text-sm text-slate-500">Please wait a moment.</p>
              </div>
            )}

            {/* SUCCESS */}
            {state === 'success' && (
              <div className="py-6">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Email Verified! 🎉</h2>
                <p className="mt-3 text-sm text-emerald-700 font-semibold">{message}</p>
                <p className="mt-2 text-xs text-slate-500">Redirecting to sign in…</p>
                <div className="mt-6">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 font-bold text-white shadow-lg shadow-cyan-600/10 transition hover:bg-cyan-700"
                  >
                    Go to Sign In →
                  </Link>
                </div>
              </div>
            )}

            {/* ERROR */}
            {state === 'error' && (
              <div className="py-6">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/20">
                  <XCircle className="h-10 w-10 text-rose-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Verification Failed</h2>
                <p className="mt-3 text-sm text-slate-500 font-medium">{message}</p>
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => { resetTokenInput(); setState('awaiting'); }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-cyan-400 hover:text-cyan-700"
                  >
                    Try Manual Token Entry
                  </button>
                  <Link
                    to="/register"
                    className="block rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Register a new account
                  </Link>
                </div>
              </div>
            )}

            {/* AWAITING (after register, no token in URL) */}
            {state === 'awaiting' && (
              <div className="py-6">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/15 shadow-lg shadow-cyan-500/10 animate-bounce">
                  <MailOpen className="h-10 w-10 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{t('verifyAccountTitle')} 📬</h2>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed font-medium">
                  We sent a verification link{email ? <> to <strong className="text-cyan-700">{email}</strong></> : ''}.
                  Click the link or paste the verification token below to activate your account.
                </p>

                {/* Manual Token Verification Input */}
                <form onSubmit={handleManualSubmit} className="mt-6 space-y-3 text-left">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('verifyCodePlaceholder')}</label>
                  <input
                    type="text"
                    value={inputToken}
                    onChange={(e) => setInputToken(e.target.value)}
                    placeholder="e.g. 5e1823f9bc..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-cyan-400"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-cyan-600 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-600/10 transition hover:bg-cyan-700"
                  >
                    Verify Token
                  </button>
                </form>

                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs text-left text-slate-500">
                  <p className="font-bold text-slate-600">Didn't receive the email?</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Check your spam / junk folder</li>
                    <li>• Wait a few minutes and refresh</li>
                    <li>• Auto-verification drawer will pop up if in dev sandbox</li>
                  </ul>
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    to="/"
                    className="block rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-500 hover:text-slate-900"
                  >
                    {t('backToLogin')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );

  function resetTokenInput() {
    setInputToken('');
  }
};

export default Verify;
