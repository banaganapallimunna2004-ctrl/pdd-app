import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await authService.resetPassword({ token, password });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password.');
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center px-6 py-16">
      <div className="w-full rounded-[2.5rem] border border-white/10 bg-slate-950/80 p-10 shadow-glass">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/90">Reset password</p>
          <h1 className="text-4xl font-semibold text-white">Create a strong new password.</h1>
          <p className="text-slate-400">Secure your Agro AI account with a fresh password.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">New Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-slate-100 outline-none focus:border-cyan-400" placeholder="••••••••" required minLength={8} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Confirm Password</label>
            <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" className="w-full rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-slate-100 outline-none focus:border-cyan-400" placeholder="••••••••" required />
          </div>
          {message && <p className="rounded-3xl bg-emerald-500/10 p-4 text-sm text-emerald-200">{message}</p>}
          {error && <p className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200">{error}</p>}
          <button type="submit" className="w-full rounded-3xl bg-cyan-400 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">Reset password</button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-400">
          Back to <Link to="/login" className="text-cyan-300 hover:text-cyan-200">sign in</Link>
        </p>
      </div>
    </main>
  );
};

export default ResetPassword;
