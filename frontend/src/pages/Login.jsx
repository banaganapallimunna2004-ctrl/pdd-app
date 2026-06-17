import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { login, requestPhoneOtp, verifyPhoneOtp, setError } = useAuth();

  const [mode, setMode] = useState(
    searchParams.get('mode') === 'phone' ? 'phone' : 'password'
  );

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
      const message =
        error.response?.data?.message || 'Unable to sign in.';
      const statusCode = error.response?.status;
      setNeedsVerification(statusCode === 403);

      // Surface exact backend error for proper debugging
      setStatus(
        `${error.response?.data?.message || message} (HTTP ${statusCode || '—'})`
      );

      // Optional: if email not verified, guide user to verify page
      if (statusCode === 403) {
        navigate('/verify', { replace: true });
      }
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
      setStatus(
        response.data.message || 'OTP sent to your phone number.'
      );

      if (response.data.devOtp) {
        setDevOtp(response.data.devOtp);
      }
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      const statusCode = error.response?.status;
      const networkMessage = error.message;

      setStatus(
        serverMessage
          ? `${serverMessage} (HTTP ${statusCode || '—'})`
          : `Unable to send OTP. ${networkMessage || ''}`
      );
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
      const serverMessage = error.response?.data?.message;
      const statusCode = error.response?.status;
      const networkMessage = error.message;

      setStatus(
        serverMessage
          ? `${serverMessage} (HTTP ${statusCode || '—'})`
          : `Unable to verify OTP. ${networkMessage || ''}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-700 to-lime-600" />

      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854')] bg-cover bg-center opacity-20" />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="overflow-hidden rounded-[2.5rem] border border-green-200/30 bg-white/95 shadow-2xl backdrop-blur-lg">
          {/* Banner */}
          <div className="h-56 bg-[url('https://images.unsplash.com/photo-1464226184884-fa280b87c399')] bg-cover bg-center" />

          <div className="p-10">
            {/* Header */}
            <div className="mb-8 text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.35em] text-green-600">
                🌾 Agro AI Platform
              </p>

              <h1 className="text-4xl font-bold text-green-900">
                Welcome Back Farmer
              </h1>

              <p className="mt-3 text-green-700">
                Manage crops, monitor fields, track irrigation and access
                smart farming insights.
              </p>
            </div>

            {/* Login Tabs */}
            <div className="mb-8 grid grid-cols-2 rounded-3xl bg-green-100 p-1">
              <button
                type="button"
                onClick={() => {
                  resetFeedback();
                  setMode('phone');
                }}
                className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                  mode === 'phone'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-green-700'
                }`}
              >
                📱 Phone OTP
              </button>

              <button
                type="button"
                onClick={() => {
                  resetFeedback();
                  setMode('password');
                }}
                className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                  mode === 'password'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-green-700'
                }`}
              >
                📧 Email Login
              </button>
            </div>

            {mode === 'phone' ? (
              <form
                onSubmit={otpSent ? handleVerifyOtp : handleRequestOtp}
                className="space-y-6"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-green-800">
                    📱 Farmer Mobile Number
                  </label>

                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    placeholder="+91 98765 43210"
                    required
                    className="w-full rounded-3xl border border-green-200 bg-white p-4 text-green-900 outline-none focus:border-green-500"
                  />
                </div>

                {otpSent && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-green-800">
                      🔐 Verification Code
                    </label>

                    <input
                      value={otp}
                      onChange={(e) =>
                        setOtp(
                          e.target.value.replace(/\D/g, '').slice(0, 6)
                        )
                      }
                      inputMode="numeric"
                      placeholder="Enter 6-digit OTP"
                      required
                      className="w-full rounded-3xl border border-green-200 bg-white p-4 text-green-900 outline-none focus:border-green-500"
                    />
                  </div>
                )}

                {status && (
                  <div className="rounded-3xl bg-green-100 p-4 text-sm text-green-800">
                    {status}
                  </div>
                )}

                {devOtp && (
                  <div className="rounded-3xl bg-amber-100 p-4 text-sm text-amber-800">
                    Development OTP: {devOtp}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-3xl bg-green-600 px-6 py-4 font-semibold text-white transition hover:bg-green-700 disabled:opacity-70"
                >
                  {isSubmitting
                    ? 'Please wait...'
                    : otpSent
                    ? 'Verify OTP & Continue'
                    : 'Send OTP'}
                </button>

                {otpSent && (
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                      resetFeedback();
                    }}
                    className="w-full rounded-3xl border border-green-300 py-3 text-green-700 hover:bg-green-50"
                  >
                    Change Phone Number
                  </button>
                )}
              </form>
            ) : (
              <form
                onSubmit={handlePasswordLogin}
                className="space-y-6"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-green-800">
                    📧 Registered Email
                  </label>

                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    placeholder="farmer@example.com"
                    className="w-full rounded-3xl border border-green-200 bg-white p-4 text-green-900 outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-green-800">
                    🔑 Password
                  </label>

                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                    placeholder="Enter password"
                    className="w-full rounded-3xl border border-green-200 bg-white p-4 text-green-900 outline-none focus:border-green-500"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="accent-green-600"
                    />
                    <label htmlFor="remember">
                      Remember me
                    </label>
                  </div>

                  <Link
                    to="/forgot-password"
                    className="text-green-700 hover:text-green-900"
                  >
                    Forgot password?
                  </Link>
                </div>

                {status && (
                  <div className="rounded-3xl bg-red-100 p-4 text-sm text-red-700">
                    <p>{status}</p>

                    {needsVerification && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('phone');
                          resetFeedback();
                        }}
                        className="mt-3 text-green-700 underline"
                      >
                        Verify with Phone OTP
                      </button>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-3xl bg-green-600 px-6 py-4 font-semibold text-white transition hover:bg-green-700 disabled:opacity-70"
                >
                  {isSubmitting
                    ? 'Signing In...'
                    : 'Access Farm Dashboard'}
                </button>
              </form>
            )}

            {/* Features */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              <div className="rounded-2xl bg-green-50 p-4 text-center">
                <div className="text-3xl">🌱</div>
                <p className="mt-2 text-sm font-medium text-green-800">
                  Crop Monitoring
                </p>
              </div>

              <div className="rounded-2xl bg-green-50 p-4 text-center">
                <div className="text-3xl">🚜</div>
                <p className="mt-2 text-sm font-medium text-green-800">
                  Farm Management
                </p>
              </div>

              <div className="rounded-2xl bg-green-50 p-4 text-center">
                <div className="text-3xl">💧</div>
                <p className="mt-2 text-sm font-medium text-green-800">
                  Smart Irrigation
                </p>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-green-700">
              New to Agro AI?{' '}
              <Link
                to="/register"
                className="font-semibold text-green-900 hover:text-green-700"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;