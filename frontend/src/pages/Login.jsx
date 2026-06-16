import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, requestPhoneOtp, verifyPhoneOtp, setError } = useAuth();
  const [mode, setMode] = useState(searchParams.get('mode') === 'phone' ? 'phone' : 'password');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState(null);
  const [devOtp, setDevOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const requestedMode = searchParams.get('mode');
    const requestedPhone = searchParams.get('phone');
    if (requestedMode === 'phone') setMode('phone');
    if (requestedPhone) setPhone(requestedPhone);
  }, [searchParams]);

  const resetFeedback = () => {
    setStatus(null);
    setDevOtp('');
    setNeedsVerification(false);
    setError(null);
  };

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setStatus('Please enter your email and password.');
      return;
    }

    resetFeedback();
    setIsSubmitting(true);

    try {
      await login(email.trim().toLowerCase(), password);
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to sign in.';
      setStatus(message);
      setNeedsVerification(error.response?.status === 403);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    if (!phone.trim()) {
      setStatus('Please enter your phone number.');
      return;
    }

    resetFeedback();
    setIsSubmitting(true);

    try {
      const response = await requestPhoneOtp(phone.trim());
      setOtpSent(true);
      setStatus(response.data.message || 'OTP sent to your phone number.');
      if (response.data.devOtp) setDevOtp(response.data.devOtp);
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to send OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    if (!phone.trim() || !otp.trim()) {
      setStatus('Please enter your phone number and OTP.');
      return;
    }

    resetFeedback();
    setIsSubmitting(true);

    try {
      await verifyPhoneOtp(phone.trim(), otp.trim());
      navigate('/dashboard');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to verify OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center px-6 py-16">
      <div className="w-full rounded-[2.5rem] border border-white/10 bg-slate-950/80 p-10 shadow-glass">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/90">Sign in</p>
          <h1 className="text-4xl font-semibold text-white">Access your farm control center.</h1>
          <p className="text-slate-400">Use phone OTP for verified access, or email password after verification.</p>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-3xl border border-white/10 bg-slate-900/80 p-1">
          <button
            type="button"
            onClick={() => {
              resetFeedback();
              setMode('phone');
            }}
            className={`rounded-[1.35rem] px-4 py-3 text-sm font-semibold transition ${mode === 'phone' ? 'bg-cyan-400 text-slate-950' : 'text-slate-300 hover:text-white'}`}
          >
            Phone OTP
          </button>
          <button
            type="button"
            onClick={() => {
              resetFeedback();
              setMode('password');
            }}
            className={`rounded-[1.35rem] px-4 py-3 text-sm font-semibold transition ${mode === 'password' ? 'bg-cyan-400 text-slate-950' : 'text-slate-300 hover:text-white'}`}
          >
            Email
          </button>
        </div>

        {mode === 'phone' ? (
          <form onSubmit={otpSent ? handleVerifyOtp : handleRequestOtp} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Phone number</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="w-full rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-slate-100 outline-none focus:border-cyan-400" placeholder="+91 98765 43210" required />
            </div>
            {otpSent && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">OTP</label>
                <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" className="w-full rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-slate-100 outline-none focus:border-cyan-400" placeholder="6-digit code" required />
              </div>
            )}
            {status && <p className="rounded-3xl bg-cyan-500/10 p-4 text-sm text-cyan-100">{status}</p>}
            {devOtp && <p className="rounded-3xl bg-amber-500/10 p-4 text-sm text-amber-100">Development OTP: {devOtp}</p>}
            <button type="submit" disabled={isSubmitting} className="w-full rounded-3xl bg-cyan-400 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70">
              {isSubmitting ? 'Please wait...' : otpSent ? 'Verify OTP and continue' : 'Send OTP'}
            </button>
            {otpSent && (
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                  resetFeedback();
                }}
                className="w-full rounded-3xl border border-white/10 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/60 hover:text-white"
              >
                Change phone number
              </button>
            )}
          </form>
        ) : (
          <form onSubmit={handlePasswordLogin} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-slate-100 outline-none focus:border-cyan-400" placeholder="hello@farm.com" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-slate-100 outline-none focus:border-cyan-400" placeholder="Password" required />
            </div>
            <div className="flex items-center justify-between text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <input id="remember" type="checkbox" className="h-4 w-4 rounded accent-cyan-400" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link to="/forgot-password" className="text-cyan-300 hover:text-cyan-200">Forgot password?</Link>
            </div>
            {status && (
              <div className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200">
                <p>{status}</p>
                {needsVerification && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('phone');
                      resetFeedback();
                    }}
                    className="mt-3 inline-flex text-cyan-200 hover:text-cyan-100"
                  >
                    Verify with phone OTP before signing in
                  </button>
                )}
              </div>
            )}
            <button type="submit" disabled={isSubmitting} className="w-full rounded-3xl bg-cyan-400 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting ? 'Signing in...' : 'Continue'}</button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-slate-400">
          New to Agro AI? <Link to="/register" className="text-cyan-300 hover:text-cyan-200">Create account</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
