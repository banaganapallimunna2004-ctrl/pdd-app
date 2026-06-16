import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const navigate = useNavigate();
  const [message, setMessage] = useState(
    token ? 'Verifying your account...' : 'Verify your email before signing in.'
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        setMessage(response.data.message);
        setTimeout(() => navigate('/login'), 1800);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to verify your email.');
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center px-6 py-16">
      <div className="w-full rounded-[2.5rem] border border-white/10 bg-slate-950/80 p-10 shadow-glass text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/90">Email verification</p>
        <h1 className="mt-6 text-4xl font-semibold text-white">Account activation status</h1>
        <p className="mt-4 text-slate-400">{message}</p>
        {!token && (
          <div className="mt-6 rounded-3xl bg-cyan-500/10 p-5 text-sm text-cyan-100">
            <p>
              We sent a verification link{email ? ` to ${email}` : ''}. Open that link first, then return to sign in.
            </p>
          </div>
        )}
        {error && <p className="mt-6 rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200">{error}</p>}
        {!token && (
          <Link
            to="/login"
            className="mt-8 inline-flex rounded-3xl border border-cyan-300/30 px-6 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:text-white"
          >
            Go to sign in
          </Link>
        )}
      </div>
    </main>
  );
};

export default Verify;
