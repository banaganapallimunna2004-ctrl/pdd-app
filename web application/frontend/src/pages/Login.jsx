import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Mail, Lock, Phone, KeyRound, Loader2, Eye, EyeOff,
  Leaf, ShieldCheck, ArrowRight, Sparkles, UserCheck, Bot
} from 'lucide-react';
import { useTranslation } from '../i18n';
import LanguageSelector from '../components/LanguageSelector';
import OtpConsole, { triggerOtpAlert } from '../components/OtpConsole';

/* ── OTP Input Component ── */
const OtpInput = ({ value, onChange, length = 6 }) => {
  const inputs = useRef([]);

  const handleChange = (i, e) => {
    const val = e.target.value.replace(/\D/g, '');
    const arr = value.split('');
    arr[i] = val.slice(-1);
    onChange(arr.join(''));
    if (val && i < length - 1) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted.padEnd(length, '').slice(0, length));
    inputs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center my-3" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-11 h-13 text-center text-xl font-bold rounded-2xl border border-white/20 bg-black/60 text-white focus:border-emerald-400 focus:outline-none transition-all shadow-inner"
        />
      ))}
    </div>
  );
};

/* ── Countdown Timer ── */
const Countdown = ({ seconds, onExpire }) => {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) { onExpire?.(); return; }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, onExpire]);
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  return (
    <span className={remaining < 30 ? 'text-rose-400' : 'text-emerald-400 font-bold'}>
      {m}:{String(s).padStart(2, '0')}
    </span>
  );
};

/* ═══════════════════════════════════════════════
   Main Login Component
═══════════════════════════════════════════════ */
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { login, requestPhoneOtp, verifyPhoneOtp } = useAuth();

  const [mode, setMode] = useState(() => {
    const m = searchParams.get('mode');
    if (m === 'phone' || m === 'phone-otp') return 'phone-otp';
    return 'password';
  });

  const [email, setEmail] = useState(() => location.state?.registeredEmail || 'farmer@agroai.com');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [password, setPassword] = useState(() => location.state?.registeredEmail ? '' : 'password123');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');

  const [status, setStatus] = useState(() => location.state?.successMessage || null);
  const [statusType, setStatusType] = useState(() => location.state?.successMessage ? 'success' : 'info');
  const [otpSent, setOtpSent] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const switchMode = (newMode) => {
    setMode(newMode);
    setStatus(null);
    setOtpSent(false);
    setOtp('');
  };

  const handlePasswordLogin = async (e) => {
    e?.preventDefault?.();
    setIsSubmitting(true);
    setStatus(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setStatus(err?.response?.data?.message || t('invalidCredentials') || 'Invalid email or password.');
      setStatusType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Demo Auto-Fill & Sign In
  const handleQuickDemo = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsSubmitting(true);
    setStatus('Signing in with demo credentials...');
    setStatusType('info');
    try {
      await login(demoEmail, demoPass);
      navigate('/dashboard');
    } catch {
      setStatus('Demo account initialized. Click Sign In.');
      setStatusType('info');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestPhoneOtp = async (e) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 6) {
      setStatus(t('enterPhone') || 'Please enter a valid phone number.');
      setStatusType('error');
      return;
    }
    setIsSubmitting(true);
    setStatus(null);
    try {
      const res = await requestPhoneOtp(phone.trim());
      setOtpSent(true);
      setOtpExpired(false);
      setStatus(t('otpSentSuccess') || 'OTP sent successfully!');
      setStatusType('success');
      if (res?.devOtp) triggerOtpAlert(phone, res.devOtp);
    } catch (err) {
      setStatus(err?.response?.data?.message || t('otpSendFailed') || 'Unable to send OTP.');
      setStatusType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyPhoneOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      setStatus(t('enterValidOtp') || 'Please enter 6-digit code.');
      setStatusType('error');
      return;
    }
    setIsSubmitting(true);
    setStatus(null);
    try {
      await verifyPhoneOtp(phone.trim(), otp);
      navigate('/dashboard');
    } catch (err) {
      setStatus(err?.response?.data?.message || t('invalidOtp') || 'Invalid or expired OTP.');
      setStatusType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'phone-otp', label: 'SMS OTP', icon: Phone },
  ];

  const statusClasses = {
    info: 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-200',
    error: 'bg-rose-950/80 border border-rose-500/30 text-rose-200',
    success: 'bg-emerald-950/90 border border-emerald-400/40 text-emerald-200',
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden w-full select-text text-white">
      <div className="fixed top-6 right-6 z-50">
        <LanguageSelector />
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* ── Top Header Brand ── */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-emerald-500 to-green-700 shadow-xl shadow-emerald-950/60 border border-emerald-400/50 hover:scale-105 transition-transform">
              <Leaf className="h-8 w-8 text-white" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
              AgroAI
            </h1>

            <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-emerald-300">
              <Sparkles className="h-3 w-3 text-emerald-400 animate-pulse" />
              SMART AGRICULTURE MONITORING SYSTEM
            </div>
          </div>

          {/* ── Translucent Frosted Glass Card ── */}
          <div className="rounded-[2.5rem] border border-white/20 bg-black/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-white relative overflow-hidden">
            
            {/* Top Atmospheric Corner Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
            
            <div className="text-center mb-5">
              <h2 className="text-xl font-black text-white tracking-tight">
                Welcome Back 🌾
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Access precision crop insights, disease diagnosis & agro telemetry.
              </p>
            </div>

            {/* Mode Tabs */}
            <div className="mb-5 flex rounded-2xl bg-black/40 p-1.5 gap-1.5 border border-white/15">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => switchMode(id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    mode === id
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${mode === id ? 'text-white' : 'text-emerald-400'}`} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* ── EMAIL + PASSWORD ── */}
            {mode === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address (e.g. farmer@agroai.com)"
                      required
                      className="w-full rounded-2xl border border-white/20 bg-black/50 py-3 pl-11 pr-4 text-white placeholder-slate-400 outline-none transition focus:border-emerald-400 focus:bg-black/70 text-xs sm:text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="w-full rounded-2xl border border-white/20 bg-black/50 py-3 pl-11 pr-12 text-white placeholder-slate-400 outline-none transition focus:border-emerald-400 focus:bg-black/70 text-xs sm:text-sm font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="mt-2 text-right">
                    <Link to="/forgot-password" className="text-xs font-bold text-emerald-400 hover:text-emerald-300">
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                {status && <p className={`rounded-xl p-3 text-xs font-bold ${statusClasses[statusType]}`}>{status}</p>}

                <button
                  id="login-submit-password"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white text-xs font-black uppercase tracking-wider disabled:opacity-60 shadow-xl shadow-emerald-950/60 border border-emerald-300/40 cursor-pointer flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-95"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>{t('loginBtn') || "Sign In to Farm"}</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ── PHONE OTP ── */}
            {mode === 'phone-otp' && (
              <form onSubmit={otpSent ? handleVerifyPhoneOtp : handleRequestPhoneOtp} className="space-y-4">
                <div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                    <input
                      id="phone-otp-number"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number (e.g. +91 98765 43210)"
                      required
                      disabled={otpSent}
                      className="w-full rounded-2xl border border-white/20 bg-black/50 py-3 pl-11 pr-4 text-white placeholder-slate-400 outline-none transition focus:border-emerald-400 focus:bg-black/70 text-xs sm:text-sm font-medium disabled:opacity-60"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div className="space-y-3">
                    <div>
                      <label className="mb-2 block text-center text-xs font-bold text-slate-300">
                        {t('enterPhoneCode') || 'Enter 6-digit OTP sent to your phone'}
                      </label>
                      <OtpInput value={otp} onChange={setOtp} />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>
                        Expires in:{' '}
                        {otpExpired ? (
                          <span className="text-rose-400 font-bold">Expired</span>
                        ) : (
                          <Countdown seconds={180} onExpire={() => setOtpExpired(true)} />
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={handleRequestPhoneOtp}
                        disabled={isSubmitting}
                        className="font-bold text-emerald-400 hover:text-emerald-300 disabled:opacity-50 cursor-pointer"
                      >
                        Resend Code
                      </button>
                    </div>
                  </div>
                )}

                {status && <p className={`rounded-xl p-3 text-xs font-bold ${statusClasses[statusType]}`}>{status}</p>}

                <button
                  id="phone-otp-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white text-xs font-black uppercase tracking-wider disabled:opacity-60 shadow-xl shadow-emerald-950/60 border border-emerald-300/40 cursor-pointer flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-95"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : otpSent ? (
                    <>
                      <KeyRound className="h-4 w-4" />
                      <span>{t('verifyOtp') || 'Verify & Sign In'}</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4" />
                      <span>{t('sendOtp') || 'Send 6-Digit OTP'}</span>
                    </>
                  )}
                </button>

                {otpSent && (
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtp(''); setStatus(null); }}
                    className="w-full text-center text-xs font-bold text-slate-400 hover:text-white cursor-pointer mt-1"
                  >
                    Change Phone Number
                  </button>
                )}
              </form>
            )}

            {/* ── AI 1-Click Quick Demo Sign In ── */}
            <div className="mt-5 pt-4 border-t border-white/15 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-emerald-400">
                <span className="flex items-center gap-1">
                  <Bot className="h-3.5 w-3.5" />
                  1-Click AI Demo Sign In
                </span>
                <span className="text-[9px] text-slate-400">Instant Access</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('farmer@agroai.com', 'password123')}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-emerald-500/20 hover:border-emerald-400/60 py-2 px-2.5 text-[11px] font-bold text-slate-200 hover:text-white transition cursor-pointer active:scale-95"
                >
                  <span>🌱 Smart Farmer</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin@agroai.com', 'admin123')}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-emerald-500/20 hover:border-emerald-400/60 py-2 px-2.5 text-[11px] font-bold text-slate-200 hover:text-white transition cursor-pointer active:scale-95"
                >
                  <span>🛡️ Farm Admin</span>
                </button>
              </div>
            </div>

            {/* Bottom Register Redirect */}
            <p className="mt-5 text-center text-xs text-slate-300">
              Don't have a farm account?{' '}
              <Link to="/register" className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Embedded Real-time Sandbox OTP Drawer */}
      <OtpConsole />
    </div>
  );
};

export default Login;