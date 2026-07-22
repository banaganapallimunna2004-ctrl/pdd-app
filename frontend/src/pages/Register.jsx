import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Leaf,
  UserPlus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Sprout,
  Tractor,
  CloudRain,
  ShieldCheck,
  Mail,
  Lock,
  BarChart3,
  Brain,
  Phone
} from "lucide-react";
import { useTranslation } from "../i18n";
import LanguageSelector from "../components/LanguageSelector";
import OtpConsole, { triggerOtpAlert } from "../components/OtpConsole";


const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { register: registerUser } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [devOtp, setDevOtp] = useState("");
  const [localError, setLocalError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "Farmer",
  });

  const roles = [
    {
      value: "Farmer",
      label: t('smartFarmer'),
      icon: Tractor,
      desc: t('smartFarmerDesc'),
    },
    {
      value: "Agronomist",
      label: t('cropExpert'),
      icon: Sprout,
      desc: t('cropExpertDesc'),
    },
    {
      value: "Admin",
      label: t('agriManager'),
      icon: ShieldCheck,
      desc: t('agriManagerDesc'),
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (localError) setLocalError("");
    setDevOtp("");
  };

  const passwordAnalysis = useMemo(() => {
    const password = formData.password;
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [t('pwdVeryWeak'), t('pwdWeak'), t('pwdFair'), t('pwdGood'), t('pwdStrong'), t('pwdExcellent')];
    return { score, level: levels[score] };
  }, [formData.password]);

  const getStrengthColor = () => {
    const score = passwordAnalysis.score;
    if (score <= 1) return "bg-rose-500";
    if (score <= 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const initials = formData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const password = formData.password;
    const role = formData.role;

    if (!name || !email || !phone || !password) {
      setLocalError(t('pleaseFillFields'));
      return;
    }

    setIsSubmitting(true);
    setLocalError("");

    try {
      const response = await registerUser(name, email, phone, password, role);
      setIsSuccess(true);

      const verifyUrl = response?.data?.verifyUrl;
      let targetPath = `/verify?email=${encodeURIComponent(email)}`;
      if (verifyUrl) {
        const tokenMatch = verifyUrl.match(/[?&]token=([^&]+)/);
        if (tokenMatch && tokenMatch[1]) {
          const extractedToken = tokenMatch[1];
          const autoVerifyUrl = `/verify?email=${encodeURIComponent(email)}&token=${encodeURIComponent(extractedToken)}`;
          targetPath = autoVerifyUrl;
          
          // Trigger Sandbox OTP delivery popup
          
        }
      }

      setTimeout(() => {
        navigate(targetPath);
      }, 2000);
    } catch (err) {
      const msg = err?.response?.data?.message || t('unableCreateAccount');
      setLocalError(msg);
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100">
      {/* Background image overlay */}
      <div 
        className="pointer-events-none absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-100" 
        style={{ filter: 'brightness(0.85) contrast(1.05)' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/70 via-slate-100/50 to-emerald-100/30 backdrop-blur-[1px]" />

      {/* Grid overlay and ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-cyan-700/10 blur-[150px]" />
        <div className="absolute top-40 -left-20 h-96 w-96 rounded-full bg-emerald-700/10 blur-[150px]" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-600/5 blur-[180px]" />
      </div>

      {/* Floating Language Switcher */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageSelector />
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mb-5 flex justify-center">
              <Link to="/home" className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-emerald-500 shadow-xl shadow-cyan-500/20 hover:scale-105 transition-transform">
                <Leaf className="h-10 w-10 text-slate-950" />
                <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-300">
                  <CloudRain className="h-3 w-3 text-slate-950 animate-pulse" />
                </div>
              </Link>
            </div>

            <h1 className="bg-gradient-to-r from-cyan-600 via-emerald-600 to-lime-600 bg-clip-text text-5xl font-extrabold text-transparent tracking-tight">
              {t('brand')}
            </h1>

            <p className="mt-3 text-slate-700 text-base font-semibold max-w-md mx-auto">
              {t('tagline')}
            </p>
          </div>

          <div className="mb-6 rounded-3xl border border-slate-200 bg-emerald-50/60 border border-emerald-100 p-5 text-center backdrop-blur-md">
            <div className="text-lg font-bold text-cyan-700">🌾 Smart Agriculture Ecosystem</div>
            <p className="mt-2 text-xs text-slate-500">
              AI Disease Detection • Crop Monitoring • Weather Intelligence • Yield Prediction • Smart Irrigation • Satellite Analytics
            </p>
          </div>

          {/* Feature Grid */}
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-white/70 p-4 shadow-sm border border-slate-100">
              <Brain className="mb-2 h-5 w-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-700">Crop Health AI</h3>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white/70 p-4 shadow-sm border border-slate-100">
              <CloudRain className="mb-2 h-5 w-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-700">Weather Intelligence</h3>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white/70 p-4 shadow-sm border border-slate-100">
              <BarChart3 className="mb-2 h-5 w-5 text-lime-400" />
              <h3 className="text-sm font-bold text-slate-700">Yield Prediction</h3>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white/70 p-4 shadow-sm border border-slate-100">
              <Tractor className="mb-2 h-5 w-5 text-teal-400" />
              <h3 className="text-sm font-bold text-slate-700">Smart Farming</h3>
            </div>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-8 shadow-xl backdrop-blur-md">
            {isSuccess ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-slate-800">{t('welcomeBack')}</h2>
                <p className="mt-2 text-slate-500">Please review your verification console to activate your account.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-emerald-500 to-lime-400 text-2xl font-bold text-slate-950">
                    {initials || "AG"}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600 uppercase tracking-wider">{t('farmerName')}</label>
                    <div className="relative">
                      <UserPlus className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-10 pr-4 text-slate-900 outline-none focus:border-cyan-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600 uppercase tracking-wider">{t('emailAddress')}</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="farmer@agroai.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-10 pr-4 text-slate-900 outline-none focus:border-cyan-400"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600 uppercase tracking-wider">{t('phoneNumber')}</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-10 pr-4 text-slate-900 outline-none focus:border-cyan-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600 uppercase tracking-wider">{t('password')}</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-10 pr-4 text-slate-900 outline-none focus:border-cyan-400"
                        required
                        minLength={8}
                      />
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full ${getStrengthColor()}`}
                        style={{ width: `${passwordAnalysis.score * 20}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-xs font-bold text-slate-600 uppercase tracking-wider">{t('selectRole')}</label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {roles.map((role) => {
                      const Icon = role.icon;
                      return (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              role: role.value,
                            }))
                          }
                          className={`rounded-2xl border p-4 text-center transition-all ${formData.role === role.value
                            ? "border-cyan-400 bg-cyan-400/10 text-cyan-700"
                            : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200 hover:text-slate-900"
                            }`}
                        >
                          <Icon className="mx-auto mb-2 h-5 w-5" />
                          <div className="text-xs font-bold">{role.label}</div>
                          <div className="mt-1 text-[0.62rem] text-slate-500 leading-tight">{role.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {localError && (
                  <div className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-rose-300 text-sm font-semibold">
                    <AlertCircle size={18} />
                    {localError}
                  </div>
                )}

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="flex w-full items-center justify-center rounded-xl bg-cyan-600 py-3.5 font-bold text-white shadow-xl shadow-cyan-600/10 transition hover:bg-cyan-700 hover:scale-[1.01]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t('creatingAccount')}
                    </>
                  ) : (
                    <>
                      {t('signUpBtn')}
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="mt-8 text-center text-slate-500 font-semibold text-xs tracking-wider uppercase">
            <p className="mt-4 text-slate-500 normal-case tracking-normal font-medium">
              {t('alreadyHaveAccount')}{" "}
              <Link to="/" className="text-cyan-400 hover:text-cyan-700 font-bold">
                {t('loginBtn')}
              </Link>
            </p>
          </div>
        </div>
      </main>


    </div>
  );
};

export default Register;
