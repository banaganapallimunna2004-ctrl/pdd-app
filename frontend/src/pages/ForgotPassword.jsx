import { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await authService.forgotPassword({ email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send reset link.');
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center px-6 py-16">
      <div className="w-full rounded-[2.5rem] border border-white/10 bg-slate-950/80 p-10 shadow-glass">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/90">Password recovery</p>
          <h1 className="text-4xl font-semibold text-white">Recover your farm account access.</h1>
          <p className="text-slate-400">Enter your email and we’ll send a reset link instantly.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-slate-100 outline-none focus:border-cyan-400" placeholder="hello@farm.com" required />
          </div>
          {message && <p className="rounded-3xl bg-emerald-500/10 p-4 text-sm text-emerald-200">{message}</p>}
          {error && <p className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200">{error}</p>}
          <button type="submit" className="w-full rounded-3xl bg-cyan-400 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">Send reset link</button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-400">
          Remembered your password? <Link to="/login" className="text-cyan-300 hover:text-cyan-200">Sign in</Link>
        </p>
      </div>
    </main>
  );
};

export default ForgotPassword;
