import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Mail, Lock, Phone, KeyRound, Loader2, Eye, EyeOff,
  Leaf, ShieldCheck, ArrowRight, RefreshCw, Globe
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
    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
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
          className="h-14 w-12 rounded-xl border-2 border-cyan-800 bg-slate-950/60 text-center text-2xl font-bold text-cyan-300 outline-none transition-all duration-200 focus:border-cyan-400 focus:bg-slate-900/60 focus:shadow-lg focus:shadow-cyan-500/20"
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
    <span className={remaining < 30 ? 'text-red-400' : 'text-cyan-600'}>
      {m}:{String(s).padStart(2, '0')}
    </span>
  );
};

/* ═══════════════════════════════════════════════
   Main Login Component
═══════════════════════════════════════════════ */
const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { login, requestEmailOtp, verifyEmailOtp, requestPhoneOtp, verifyPhoneOtp } = useAuth();

  const [mode, setMode] = useState(() => {
    const m = searchParams.get('mode');
    if (m === 'phone') return 'phone-otp';
    if (m === 'email-otp') return 'email-otp';
    return 'password';
  });

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');

  const [status, setStatus] = useState(null);
  const [statusType, setStatusType] = useState('info'); // 'info' | 'error' | 'success'
  const [devOtp, setDevOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetAll = () => {
    setStatus(null); setDevOtp(''); setOtpSent(false);
    setOtpExpired(false); setOtp('');
  };

  const switchMode = (m) => { resetAll(); setMode(m); };

  const showMsg = (msg, type = 'info') => { setStatus(msg); setStatusType(type); };

  /* ── Password Login ── */
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return showMsg(t('signInToCont'), 'error');
    resetAll(); setIsSubmitting(true);
    try {
      await login(email.trim().toLowerCase(), password);
      navigate('/dashboard');
    } catch (err) {
      const code = err.response?.status;
      const msg = err.response?.data?.message || 'Unable to sign in.';
      showMsg(msg, 'error');
      if (code === 403) {
        setTimeout(() => navigate(`/verify?email=${encodeURIComponent(email.trim().toLowerCase())}`), 1500);
      }
    } finally { setIsSubmitting(false); }
  };

  /* ── Email OTP: Request ── */
  const handleRequestEmailOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return showMsg(t('enterEmailAddress'), 'error');
    resetAll(); setIsSubmitting(true);
    showMsg('Contacting secure email gateway...', 'info');
    try {
      const res = await requestEmailOtp(email.trim().toLowerCase());
      setOtpSent(true);
      showMsg(res.data.message || t('otpSentEmail'), 'success');
      if (res.data.devOtp) {
        setDevOtp(res.data.devOtp);
        triggerOtpAlert({
          type: 'email',
          recipient: email.trim().toLowerCase(),
          code: res.data.devOtp,
        });
      }
    } catch (err) {
      showMsg(err.response?.data?.message || 'Unable to send OTP.', 'error');
    } finally { setIsSubmitting(false); }
  };

  /* ── Email OTP: Verify ── */
  const handleVerifyEmailOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return showMsg(t('enter6DigitOtp'), 'error');
    setStatus(null); setIsSubmitting(true);
    try {
      await verifyEmailOtp(email.trim().toLowerCase(), otp);
      navigate('/dashboard');
    } catch (err) {
      showMsg(err.response?.data?.message || 'Invalid OTP.', 'error');
    } finally { setIsSubmitting(false); }
  };

  /* ── Phone OTP: Request ── */
  const handleRequestPhoneOtp = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return showMsg(t('enterPhoneNumber'), 'error');
    resetAll(); setIsSubmitting(true);
    showMsg('Contacting Twilio SMS gateway...', 'info');
    try {
      const res = await requestPhoneOtp(phone.trim());
      setOtpSent(true);
      showMsg(res.data.message || t('otpSentSms'), 'success');
      if (res.data.devOtp) {
        setDevOtp(res.data.devOtp);
        triggerOtpAlert({
          type: 'sms',
          recipient: phone.trim(),
          code: res.data.devOtp,
        });
      }
    } catch (err) {
      showMsg(err.response?.data?.message || 'Unable to send OTP.', 'error');
    } finally { setIsSubmitting(false); }
  };

  /* ── Phone OTP: Verify ── */
  const handleVerifyPhoneOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return showMsg(t('enter6DigitOtp'), 'error');
    setStatus(null); setIsSubmitting(true);
    try {
      await verifyPhoneOtp(phone.trim(), otp);
      navigate('/dashboard');
    } catch (err) {
      showMsg(err.response?.data?.message || 'Invalid OTP.', 'error');
    } finally { setIsSubmitting(false); }
  };

  const statusClasses = {
    error: 'bg-rose-500/10 border border-rose-500/30 text-rose-300',
    success: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300',
    info: 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300',
  };

  const tabs = [
    { id: 'password',  label: t('password'),  icon: Lock },
    { id: 'email-otp', label: t('emailOtp'), icon: Mail },
    { id: 'phone-otp', label: t('smsOtp'),   icon: Phone },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100">
      {/* High-quality background image with brightness and blur */}
      <div 
        className="pointer-events-none absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-100" 
        style={{ filter: 'brightness(0.85) contrast(1.05)' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/70 via-slate-100/50 to-emerald-100/30 backdrop-blur-[1px]" />

      {/* Ambient glows and grid */}
      <div className="pointer-events-none fixed inset-0">
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
            <Link to="/home" className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-500 shadow-xl shadow-cyan-400/20 hover:scale-105 transition-transform">
              <Leaf className="h-8 w-8 text-slate-950" />
            </Link>
            <h1 className="mt-4 bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-3xl font-extrabold text-transparent tracking-tight">
              {t('brand')}
            </h1>
            <p className="mt-1.5 text-xs text-slate-600 font-semibold tracking-wide uppercase">{t('tagline')}</p>
          </div>

          {/* Glassmorphic Login Card */}
          <div className="rounded-3xl border border-emerald-100/80 bg-white/90 p-8 shadow-xl backdrop-blur-md">
            <h2 className="mb-6 text-center text-xl font-bold text-slate-800 tracking-tight">
              {t('welcomeBack')} 🌾
            </h2>

            {/* Mode Tabs */}
            <div className="mb-6 flex rounded-xl bg-slate-100 p-1 gap-1 border border-slate-200/50">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => switchMode(id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all duration-200 ${
                    mode === id
                      ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* ── EMAIL + PASSWORD ── */}
            {mode === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600 uppercase tracking-wider">{t('emailAddress')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      id="login-email"
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="farmer@agroai.com" required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600 uppercase tracking-wider">{t('password')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-12 text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
                    />
                    <button
                      type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="mt-2 text-right">
                    <Link to="/forgot-password" className="text-xs font-semibold text-cyan-600 hover:text-cyan-700">
                      {t('forgotPasswordLink')}
                    </Link>
                  </div>
                </div>

                {status && <p className={`rounded-xl p-3 text-sm ${statusClasses[statusType]}`}>{status}</p>}

                <button
                  id="login-submit-password"
                  type="submit" disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3.5 font-bold text-white shadow-lg shadow-cyan-600/10 transition hover:bg-cyan-700 disabled:opacity-60"
                >
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><ShieldCheck className="h-4 w-4" /> {t('loginBtn')}</>}
                </button>
              </form>
            )}

            {/* ── EMAIL OTP ── */}
            {mode === 'email-otp' && (
              <form onSubmit={otpSent ? handleVerifyEmailOtp : handleRequestEmailOtp} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600 uppercase tracking-wider">{t('emailAddress')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      id="email-otp-address"
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="farmer@agroai.com" required disabled={otpSent}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-400 disabled:opacity-60"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-3 block text-center text-sm font-semibold text-slate-700">
                        {t('enterEmailCode')}
                      </label>
                      <OtpInput value={otp} onChange={setOtp} />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{t('codeExpires')} {!otpExpired ? <Countdown seconds={600} onExpire={() => setOtpExpired(true)} /> : <span className="text-red-400">{t('otpExpired')}</span>}</span>
                      <button type="button" onClick={() => { setOtpSent(false); setOtp(''); setOtpExpired(false); }} className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 font-semibold">
                        <RefreshCw className="h-3 w-3" /> {t('resendOtp')}
                      </button>
                    </div>
                  </div>
                )}

                {status && <p className={`rounded-xl p-3 text-sm ${statusClasses[statusType]}`}>{status}</p>}

                <button
                  id={otpSent ? 'email-otp-verify' : 'email-otp-send'}
                  type="submit" disabled={isSubmitting || (otpSent && otp.length < 6)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3.5 font-bold text-white shadow-lg shadow-cyan-600/10 transition hover:bg-cyan-700 disabled:opacity-60"
                >
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : otpSent ? <><KeyRound className="h-4 w-4" /> {t('verifyOtp')}</> : <><Mail className="h-4 w-4" /> {t('sendOtpEmail')}</>}
                </button>

                {otpSent && (
                  <button type="button" onClick={() => { setOtpSent(false); setOtp(''); }} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-400 hover:text-white">
                    {t('changeEmail')}
                  </button>
                )}
              </form>
            )}

            {/* ── PHONE OTP ── */}
            {mode === 'phone-otp' && (
              <form onSubmit={otpSent ? handleVerifyPhoneOtp : handleRequestPhoneOtp} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600 uppercase tracking-wider">{t('phoneNumber')}</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      id="phone-otp-number"
                      type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210" required disabled={otpSent}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-400 disabled:opacity-60"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-3 block text-center text-sm font-semibold text-slate-700">
                        {t('enterPhoneCode')}
                      </label>
                      <OtpInput value={otp} onChange={setOtp} />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{t('codeExpires')} {!otpExpired ? <Countdown seconds={600} onExpire={() => setOtpExpired(true)} /> : <span className="text-red-400">{t('otpExpired')}</span>}</span>
                      <button type="button" onClick={() => { setOtpSent(false); setOtp(''); setOtpExpired(false); }} className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 font-semibold">
                        <RefreshCw className="h-3 w-3" /> {t('resendOtp')}
                      </button>
                    </div>
                  </div>
                )}

                {status && <p className={`rounded-xl p-3 text-sm ${statusClasses[statusType]}`}>{status}</p>}

                <button
                  id={otpSent ? 'phone-otp-verify' : 'phone-otp-send'}
                  type="submit" disabled={isSubmitting || (otpSent && otp.length < 6)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3.5 font-bold text-white shadow-lg shadow-cyan-600/10 transition hover:bg-cyan-700 disabled:opacity-60"
                >
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : otpSent ? <><KeyRound className="h-4 w-4" /> {t('verifyOtp')}</> : <><Phone className="h-4 w-4" /> {t('sendOtpPhone')}</>}
                </button>

                {otpSent && (
                  <button type="button" onClick={() => { setOtpSent(false); setOtp(''); }} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-400 hover:text-white">
                    {t('changePhone')}
                  </button>
                )}
              </form>
            )}

            <p className="mt-6 text-center text-sm text-slate-600 font-medium">
              {t('dontHaveAccount')}{' '}
              <Link to="/register" className="font-bold text-cyan-600 hover:text-cyan-700">
                {t('signUpBtn')} <ArrowRight className="inline h-3.5 w-3.5" />
              </Link>
            </p>
          </div>

          {/* Feature pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {['🌱 Crop Monitoring', '🤖 AI Disease Detection', '🌦 Weather Intelligence', '📡 IoT Sensors'].map((f) => (
              <span key={f} className="rounded-full border border-slate-200 bg-slate-900/40 px-3 py-1.5 text-xs font-semibold text-slate-700">
                {f}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Embedded Real-time Sandbox OTP Drawer */}
      <OtpConsole />
    </div>
  );
};

export default Login;