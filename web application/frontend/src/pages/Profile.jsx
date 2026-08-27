import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Leaf,
  Tractor,
  MapPin,
  Trees,
  Droplets,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  Calendar,
  Cloud,
  CheckCircle2,
  Edit3,
  LogOut,
  Sparkles,
  Download,
  RefreshCw,
  Sliders,
  X,
  Save,
  Check
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../i18n";
import authService from "../services/authService";

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable Profile Form State
  const [formData, setFormData] = useState({
    name: user?.name || "Farmer",
    phone: user?.phone || "+91 98765 43210",
    farmName: user?.farmName || "Primary Organic Farm",
    farmLocation: user?.farmLocation || "Precision Agro Zone",
    farmSize: user?.farmSize || "12.5 Acres",
    experienceYears: user?.experienceYears || "8 Years",
    primaryCrops: user?.primaryCrops || "Tomato, Rice, Wheat, Cotton",
    soilType: user?.soilType || "Alluvial / Loam (Rich Organic)",
    irrigationSystem: user?.irrigationSystem || "Automated Drip & Micro-Sprinkler",
    waterSource: user?.waterSource || "Borewell & River Canal",
    farmingMethod: user?.farmingMethod || "Precision Organic & Bio-Dynamic",
    annualYieldTarget: user?.annualYieldTarget || "45.0 Tons / Year",
    farmBio: user?.farmBio || "Dedicated to sustainable precision agriculture using AgroAI predictive telemetry."
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      if (authService.updateProfile) {
        await authService.updateProfile(formData);
      }
      if (updateUser) {
        updateUser({ ...user, ...formData });
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditing(false);
      }, 1000);
    } catch (err) {
      console.error("Save profile error:", err);
      setIsEditing(false);
    }
  };

  const handleCloudSync = () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1200);
  };

  const initials = (formData.name || "Farmer")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="relative min-h-screen w-full select-text text-slate-900 overflow-x-hidden p-4 sm:p-6 lg:p-8">
      {/* ── Fixed Agriculture Background ── */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none -z-30"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=85&w=2560&auto=format&fit=crop')`,
        }}
      />
      {/* Deep Organic Scrim Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#061609]/85 via-[#09220d]/75 to-[#040e06]/90 backdrop-blur-[1px] pointer-events-none -z-20" />

      <main className="relative z-10 mx-auto max-w-5xl space-y-6 pb-20 text-slate-900">
        
        {/* ── Top Header Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/20 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white/90 px-3.5 py-1 text-[10px] font-black text-emerald-800 uppercase tracking-wider mb-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              {t('precisionEcosystem')}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
              {t('farmerProfileTitle')} 🌾
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 px-5 py-2.5 text-xs font-black uppercase tracking-wider shadow-xl border border-white/60 cursor-pointer transition hover:scale-105"
            >
              <Edit3 className="h-4 w-4 text-emerald-700" />
              <span>{t('editProfile')}</span>
            </button>
          </div>
        </div>

        {/* ── Section 1: Profile Hero Card: Crisp Solid White Card ── */}
        <div className="rounded-[2.5rem] border border-white/60 bg-white/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-slate-900">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            
            {/* Farmer Avatar Squircle */}
            <div className="relative group">
              <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-[28px] bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-700 text-3xl sm:text-4xl font-black text-white shadow-xl">
                {initials}
              </div>
              <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md border-2 border-white">
                <Leaf className="h-4 w-4" />
              </div>
            </div>

            {/* Farmer Identity */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {formData.name}
                </h2>
                <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-800">
                  {user?.role || t('smartFarmer')} • {t('accountVerified')}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-bold text-emerald-800 flex items-center justify-center sm:justify-start gap-1.5">
                <Trees className="h-4 w-4 text-emerald-600" />
                <span>{formData.farmName}</span>
                <span className="text-slate-400">•</span>
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                <span>{formData.farmLocation}</span>
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-700 font-semibold">
                <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-1.5 border border-slate-200">
                  <Mail className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{user?.email || "farmer@agroai.com"}</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-1.5 border border-slate-200">
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{formData.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 2: Quick Metrics Grid: 4 Crisp White Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-3xl border border-white/60 bg-white/95 p-5 shadow-xl backdrop-blur-xl text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              {t('farmSizeLabel')}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {formData.farmSize}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 mt-1 block">{t('healthyStatus')}</span>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/95 p-5 shadow-xl backdrop-blur-xl text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              {t('experienceYearsLabel')}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {formData.experienceYears}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 mt-1 block">{t('optimal')}</span>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/95 p-5 shadow-xl backdrop-blur-xl text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              {t('annualYieldTargetLabel')}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 truncate block">
              {formData.annualYieldTarget.split(' ')[0]} <span className="text-xs font-bold text-slate-500">Tons</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-700 mt-1 block">✓ {t('yieldForecast')}</span>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/95 p-5 shadow-xl backdrop-blur-xl text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              {t('farmHealthIndex')}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">
              98.2%
            </span>
            <span className="text-[10px] font-bold text-emerald-700 mt-1 block">{t('diagnosisAccuracy')}</span>
          </div>
        </div>

        {/* ── Section 3: Farm Land & Geography + Crop Cultivation Strategy ── */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Land & Soil Characteristics */}
          <div className="rounded-3xl border border-white/60 bg-white/95 p-6 sm:p-7 shadow-xl backdrop-blur-xl space-y-4 text-slate-900">
            <h3 className="text-sm font-black uppercase tracking-wider text-emerald-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Tractor className="h-4 w-4 text-emerald-600" />
              {t('farmInformation')}
            </h3>

            <div className="space-y-3 text-xs font-semibold">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">{t('soilTypeLabel')}:</span>
                <span className="font-black text-slate-900">{formData.soilType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">{t('irrigationSystemLabel')}:</span>
                <span className="font-black text-slate-900">{formData.irrigationSystem}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">{t('waterSourceLabel')}:</span>
                <span className="font-black text-slate-900">{formData.waterSource}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">{t('farmingMethodLabel')}:</span>
                <span className="font-black text-emerald-700">{formData.farmingMethod}</span>
              </div>
            </div>
          </div>

          {/* Crop Cultivation Strategy */}
          <div className="rounded-3xl border border-white/60 bg-white/95 p-6 sm:p-7 shadow-xl backdrop-blur-xl space-y-4 text-slate-900">
            <h3 className="text-sm font-black uppercase tracking-wider text-emerald-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Leaf className="h-4 w-4 text-emerald-600" />
              {t('crops')}
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  {t('primaryCropsLabel')}
                </span>
                <div className="flex flex-wrap gap-2">
                  {formData.primaryCrops.split(",").map((crop) => (
                    <span
                      key={crop.trim()}
                      className="px-3 py-1 rounded-xl bg-emerald-50 text-xs font-black text-emerald-800 border border-emerald-200"
                    >
                      🌱 {crop.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  {t('farmBioLabel')}
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  {formData.farmBio}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 4: AgroAI Diagnostics Sync & Cloud Hub ── */}
        <div className="rounded-[2.5rem] border border-white/60 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-6 text-slate-900">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-emerald-800">
              <Cloud className="h-5 w-5 text-emerald-600" />
              <h3 className="text-base font-black uppercase tracking-wider text-slate-900">
                {t('cloudProtected')}
              </h3>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {t('farmerProfileSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCloudSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-950/20 cursor-pointer transition disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? t('loading') : syncSuccess ? t('profileSavedSuccess') : t('refresh')}</span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-3 text-xs font-black uppercase tracking-wider shadow-sm cursor-pointer transition"
            >
              <LogOut className="h-4 w-4" />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>

        {/* ── Modal: Edit Profile Dialog ── */}
        <AnimatePresence>
          {isEditing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-slate-900"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Edit3 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        {t('editProfile')}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {t('farmerProfileSubtitle')}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 transition cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{t('farmerName')}</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-emerald-500 font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{t('phoneNumber')}</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-emerald-500 font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{t('farmName')}</label>
                      <input
                        type="text"
                        name="farmName"
                        value={formData.farmName}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-emerald-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{t('liveFarmLocation')}</label>
                      <input
                        type="text"
                        name="farmLocation"
                        value={formData.farmLocation}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-emerald-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{t('farmSizeLabel')}</label>
                      <input
                        type="text"
                        name="farmSize"
                        value={formData.farmSize}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-emerald-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{t('primaryCropsLabel')}</label>
                      <input
                        type="text"
                        name="primaryCrops"
                        value={formData.primaryCrops}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-emerald-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{t('soilTypeLabel')}</label>
                      <input
                        type="text"
                        name="soilType"
                        value={formData.soilType}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-emerald-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{t('irrigationSystemLabel')}</label>
                      <input
                        type="text"
                        name="irrigationSystem"
                        value={formData.irrigationSystem}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-emerald-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{t('farmBioLabel')}</label>
                    <textarea
                      name="farmBio"
                      rows={3}
                      value={formData.farmBio}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-emerald-500 font-medium resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      {t('cancel')}
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-950/20 cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                      <span>{saveSuccess ? t('profileSavedSuccess') : t('saveProfile')}</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
