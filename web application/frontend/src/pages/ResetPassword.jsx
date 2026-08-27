import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import authService from '../services/authService';
import { useTranslation } from '../i18n';

const PasswordStrength = ({ password }) => {
  const { t } = useTranslation();
  const analysis = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const labels = ['', t('pwdVeryWeak'), t('pwdWeak'), t('pwdFair'), t('pwdStrong'), t('pwdExcellent')];
    const colors = ['', 'bg-rose-500', 'bg-amber-500', 'bg-yellow-400', 'bg-emerald-500', 'bg-emerald-400'];
    return { score, label: labels[score] || '', color: colors[score] || '' };
  }, [password, t]);

  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full transition-all duration-300 ${analysis.color}`}
          style={{ width: `${analysis.score * 20}%` }}
        />
      </div>
      <p className={`mt-1 text-[10px] font-bold ${analysis.score >= 4 ? 'text-emerald-400' : analysis.score >= 2 ? 'text-amber-300' : 'text-rose-400'}`}>
        {analysis.label}
      </p>
    </div>
  );
};

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError(t('invalidResetLink'));
      return;
    }
    if (password.length < 8) {
      setError(t('pwdMinLength'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('pwdNoMatch'));
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.resetPassword({ token, password });
      setMessage(res.data?.message || t('passwordResetSuccess'));
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
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
              {t('createNewPassword')}
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/20 bg-black/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-white relative overflow-hidden">
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4 text-center">
                  <h2 className="text-xl font-black text-white">{t('createNewPassword')}</h2>
                  <p className="mt-1 text-xs text-slate-300">
                    {t('makeItStrong')}
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-black text-slate-300 uppercase tracking-widest">{t('newPassword')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                    <input
                      id="reset-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      className="w-full rounded-2xl border border-white/20 bg-black/50 py-3 pl-10 pr-10 text-white placeholder-slate-400 outline-none transition focus:border-emerald-400 text-xs sm:text-sm font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <PasswordStrength password={password} />
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-black text-slate-300 uppercase tracking-widest">{t('confirmNewPassword')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                    <input
                      id="reset-confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-2xl border border-white/20 bg-black/50 py-3 pl-10 pr-10 text-white placeholder-slate-400 outline-none transition focus:border-emerald-400 text-xs sm:text-sm font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
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
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('resetBtn')}
                </button>
              </form>
            ) : (
              <div className="py-6 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-black text-white">{t('passwordResetSuccess')}</h2>
                <p className="text-xs text-slate-300">{message || t('redirectingSignIn')}</p>
                <Link
                  to="/login"
                  className="inline-block mt-2 text-xs font-black uppercase tracking-wider text-emerald-400 hover:text-emerald-300 underline"
                >
                  {t('signInNow')}
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

export default ResetPassword;
