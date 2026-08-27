import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Leaf,
  User,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sprout,
  Tractor,
  ShieldCheck,
  Mail,
  Lock,
  Phone,
  MapPin,
  Trees,
  Eye,
  EyeOff,
  Sparkles,
  Droplets,
  Calendar,
  Layers,
  ArrowLeft
} from "lucide-react";
import { useTranslation } from "../i18n";
import LanguageSelector from "../components/LanguageSelector";

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { register: registerUser } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    farmName: "",
    farmLocation: "",
    farmSize: "5.0",
    experienceYears: "3",
    primaryCrops: "Rice, Tomato, Cotton",
    soilType: "Black Soil",
    irrigationSystem: "Drip Irrigation",
    role: "Farmer",
  });

  const soilTypes = [
    "Black Soil",
    "Red Sandy Soil",
    "Alluvial / Loamy Soil",
    "Clay Loam Soil",
    "Laterite Soil"
  ];

  const irrigationOptions = [
    "Drip Irrigation",
    "Sprinkler System",
    "Canal / Flood Irrigation",
    "Rainfed / Furrow"
  ];

  const roles = [
    {
      value: "Farmer",
      label: t('smartFarmer') || "Smart Farmer",
      icon: Tractor,
      desc: t('smartFarmerDesc') || "Cultivate & Monitor",
    },
    {
      value: "Agronomist",
      label: t('cropExpert') || "Crop Expert",
      icon: Sprout,
      desc: t('cropExpertDesc') || "Pathology & Triage",
    },
    {
      value: "Admin",
      label: t('agriManager') || "Agri Manager",
      icon: ShieldCheck,
      desc: t('agriManagerDesc') || "Multi-farm Admin",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (localError) setLocalError("");
  };

  const passwordAnalysis = useMemo(() => {
    const password = formData.password;
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Excellent"];
    return { score, level: levels[score] };
  }, [formData.password]);

  const getStrengthColor = () => {
    const score = passwordAnalysis.score;
    if (score <= 1) return "bg-rose-500";
    if (score <= 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;
    const role = formData.role;

    if (!name || !email || !phone || !password) {
      setLocalError("Please fill in all required farmer credentials.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match. Please re-enter your password.");
      return;
    }

    if (!agreedToTerms) {
      setLocalError("Please accept the terms and conditions to proceed.");
      return;
    }

    setIsSubmitting(true);
    setLocalError("");

    try {
      await registerUser({
        name,
        fullName: name,
        email,
        phone,
        password,
        role,
        farmName: formData.farmName.trim() || "Green Valley Agro Farm",
        farmLocation: formData.farmLocation.trim() || "Field Zone 1",
        farmSize: parseFloat(formData.farmSize) || 5.0,
        experienceYears: parseInt(formData.experienceYears, 10) || 3,
        primaryCrops: formData.primaryCrops || "Rice, Tomato, Cotton",
        soilType: formData.soilType || "Black Soil",
        irrigationSystem: formData.irrigationSystem || "Drip Irrigation"
      });

      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login', {
          state: {
            registeredEmail: email,
            successMessage: 'Account created successfully! Please sign in with your credentials.'
          }
        });
      }, 1200);
    } catch (err) {
      const msg = err?.response?.data?.message || "Unable to register account. Please try again.";
      setLocalError(msg);
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden w-full select-text text-white">
      {/* Floating Language Switcher */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageSelector />
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          
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

          {/* ── Translucent Frosted Glass Registration Card ── */}
          <div className="rounded-[2.5rem] border border-white/20 bg-black/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-white relative overflow-hidden">
            
            {/* Top Atmospheric Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

            {isSuccess ? (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 shadow-xl shadow-emerald-950/50 animate-bounce">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="mt-5 text-2xl font-black text-white">Registration Successful! 🌾</h2>
                <p className="mt-2 text-xs text-slate-300">Setting up your precision farm telemetry. Redirecting to sign in...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">
                      Farmer Registration 🌾
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-300">
                      Join our smart agricultural monitoring network to optimize crop health & field yields.
                    </p>
                  </div>
                  <Link
                    to="/login"
                    className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Sign In</span>
                  </Link>
                </div>

                {/* Section 1: Farmer Credentials */}
                <div className="space-y-3.5">
                  <div className="text-[11px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                    <User className="h-4 w-4 text-emerald-400" />
                    <span>FARMER CREDENTIALS</span>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-slate-300 uppercase tracking-wider">{t('farmerName') || "Full Name"} *</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Rajesh Kumar"
                          className="w-full rounded-2xl border border-white/20 bg-black/50 py-2.5 pl-10 pr-4 text-white placeholder-slate-400 outline-none focus:border-emerald-400 focus:bg-black/70 text-xs font-medium transition"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-slate-300 uppercase tracking-wider">{t('emailAddress') || "Email Address"} *</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="farmer@agroai.com"
                          className="w-full rounded-2xl border border-white/20 bg-black/50 py-2.5 pl-10 pr-4 text-white placeholder-slate-400 outline-none focus:border-emerald-400 focus:bg-black/70 text-xs font-medium transition"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-slate-300 uppercase tracking-wider">{t('phoneNumber') || "Phone Number"} *</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full rounded-2xl border border-white/20 bg-black/50 py-2.5 pl-10 pr-4 text-white placeholder-slate-400 outline-none focus:border-emerald-400 focus:bg-black/70 text-xs font-medium transition"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-slate-300 uppercase tracking-wider">{t('password') || "Password"} *</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Min. 6 characters"
                          className="w-full rounded-2xl border border-white/20 bg-black/50 py-2.5 pl-10 pr-10 text-white placeholder-slate-400 outline-none focus:border-emerald-400 focus:bg-black/70 text-xs font-medium transition"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {formData.password && (
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                            <div
                              className={`h-full transition-all ${getStrengthColor()}`}
                              style={{ width: `${passwordAnalysis.score * 20}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold">{passwordAnalysis.level}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-slate-300 uppercase tracking-wider">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                        className="w-full rounded-2xl border border-white/20 bg-black/50 py-2.5 pl-10 pr-10 text-white placeholder-slate-400 outline-none focus:border-emerald-400 focus:bg-black/70 text-xs font-medium transition"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-white/10 my-3" />

                {/* Section 2: Farm & Crop Details */}
                <div className="space-y-3.5">
                  <div className="text-[11px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                    <Tractor className="h-4 w-4 text-emerald-400" />
                    <span>FARM & CROP DETAILS</span>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-slate-300 uppercase tracking-wider">Farm / Agro Hub Name</label>
                      <div className="relative">
                        <Trees className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                        <input
                          name="farmName"
                          value={formData.farmName}
                          onChange={handleChange}
                          placeholder="e.g. Green Valley Farm"
                          className="w-full rounded-2xl border border-white/20 bg-black/50 py-2.5 pl-10 pr-4 text-white placeholder-slate-400 outline-none focus:border-emerald-400 focus:bg-black/70 text-xs font-medium transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-slate-300 uppercase tracking-wider">Location / District</label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                        <input
                          name="farmLocation"
                          value={formData.farmLocation}
                          onChange={handleChange}
                          placeholder="e.g. Mandya, Karnataka"
                          className="w-full rounded-2xl border border-white/20 bg-black/50 py-2.5 pl-10 pr-4 text-white placeholder-slate-400 outline-none focus:border-emerald-400 focus:bg-black/70 text-xs font-medium transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-slate-300 uppercase tracking-wider">Farm Area (Acres)</label>
                      <div className="relative">
                        <Layers className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                        <input
                          type="number"
                          step="0.1"
                          name="farmSize"
                          value={formData.farmSize}
                          onChange={handleChange}
                          placeholder="e.g. 5.0"
                          className="w-full rounded-2xl border border-white/20 bg-black/50 py-2.5 pl-10 pr-4 text-white placeholder-slate-400 outline-none focus:border-emerald-400 focus:bg-black/70 text-xs font-medium transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-slate-300 uppercase tracking-wider">Farming Experience (Years)</label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                        <input
                          type="number"
                          name="experienceYears"
                          value={formData.experienceYears}
                          onChange={handleChange}
                          placeholder="e.g. 3"
                          className="w-full rounded-2xl border border-white/20 bg-black/50 py-2.5 pl-10 pr-4 text-white placeholder-slate-400 outline-none focus:border-emerald-400 focus:bg-black/70 text-xs font-medium transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-slate-300 uppercase tracking-wider">Primary Crops Cultivated</label>
                    <div className="relative">
                      <Sprout className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                      <input
                        name="primaryCrops"
                        value={formData.primaryCrops}
                        onChange={handleChange}
                        placeholder="e.g. Rice, Tomato, Cotton, Wheat"
                        className="w-full rounded-2xl border border-white/20 bg-black/50 py-2.5 pl-10 pr-4 text-white placeholder-slate-400 outline-none focus:border-emerald-400 focus:bg-black/70 text-xs font-medium transition"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-slate-300 uppercase tracking-wider">Soil Classification</label>
                      <select
                        name="soilType"
                        value={formData.soilType}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-white/20 bg-black/70 py-2.5 px-3.5 text-white outline-none focus:border-emerald-400 text-xs font-medium transition cursor-pointer"
                      >
                        {soilTypes.map((st) => (
                          <option key={st} value={st} className="bg-slate-900 text-white">
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-slate-300 uppercase tracking-wider">Irrigation Setup</label>
                      <select
                        name="irrigationSystem"
                        value={formData.irrigationSystem}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-white/20 bg-black/70 py-2.5 px-3.5 text-white outline-none focus:border-emerald-400 text-xs font-medium transition cursor-pointer"
                      >
                        {irrigationOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-slate-900 text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-black text-slate-300 uppercase tracking-widest">{t('selectRole') || "SELECT ACCOUNT TYPE"}</label>
                  <div className="grid gap-2.5 sm:grid-cols-3">
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
                          className={`rounded-2xl border p-3 text-center transition-all cursor-pointer ${
                            formData.role === role.value
                              ? "border-emerald-400 bg-emerald-500/30 text-emerald-200 shadow-lg shadow-emerald-950/50 font-bold scale-[1.02]"
                              : "border-white/15 bg-black/40 text-slate-300 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <Icon className={`mx-auto h-5 w-5 ${formData.role === role.value ? "text-emerald-300" : "text-slate-400"}`} />
                          <p className="mt-1 text-xs font-black">{role.label}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5">{role.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Terms and conditions */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black/50 text-emerald-500 focus:ring-emerald-400 cursor-pointer"
                  />
                  <label htmlFor="terms-checkbox" className="text-xs text-slate-300 cursor-pointer select-none">
                    I agree to the <span className="text-emerald-400 font-bold underline">Precision Agriculture Data Terms</span> and allow telemetry analytics to monitor soil and crop conditions.
                  </label>
                </div>

                {localError && (
                  <div className="rounded-2xl bg-rose-950/80 border border-rose-500/30 p-3.5 text-xs font-bold text-rose-200 flex items-center gap-2.5">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                    <span>{localError}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white text-xs font-black uppercase tracking-wider disabled:opacity-60 shadow-xl shadow-emerald-950/60 border border-emerald-300/40 cursor-pointer flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-95"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>Create Smart Farm Account</span>
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-300 pt-1">
                  Already registered?{' '}
                  <Link to="/login" className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline">
                    Sign In to Farm
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
