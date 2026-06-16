import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, setError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Farmer');
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanEmail || !cleanPhone || !password) {
      setStatus('Please complete all fields before creating your account.');
      return;
    }

    setStatus(null);
    setError(null);
    setIsSubmitting(true);

    try {
      await register(cleanName, cleanEmail, cleanPhone, password, role);
      setStatus('Account created successfully. Use phone OTP to verify and sign in.');
      setTimeout(() => navigate(`/?phone=${encodeURIComponent(cleanPhone)}&mode=phone`), 1200);
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center px-6 py-16">
      <div className="w-full rounded-[2.5rem] border border-white/10 bg-slate-950/80 p-10 shadow-glass">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/90">Get started</p>
          <h1 className="text-4xl font-semibold text-white">Join the future of smart agriculture.</h1>
          <p className="text-slate-400">Register your farm operation and start monitoring crop disease with AI.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="w-full rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-slate-100 outline-none focus:border-cyan-400" placeholder="Alicia Keys" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-slate-100 outline-none focus:border-cyan-400" placeholder="agro@farm.com" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Phone number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="w-full rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-slate-100 outline-none focus:border-cyan-400" placeholder="+91 98765 43210" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-slate-100 outline-none focus:border-cyan-400" placeholder="Minimum 8 characters" required minLength={8} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-slate-100 outline-none focus:border-cyan-400">
              <option>Farmer</option>
              <option>Expert</option>
              <option>Admin</option>
            </select>
          </div>
          {status && <p className="rounded-3xl bg-cyan-500/10 p-4 text-sm text-cyan-200">{status}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full rounded-3xl bg-cyan-400 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting ? 'Creating account...' : 'Create account'}</button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-400">
          Already registered? <Link to="/login" className="text-cyan-300 hover:text-cyan-200">Sign in</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
