const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    fullName: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: false, sparse: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['Farmer', 'Agronomist', 'Admin'], default: 'Farmer' },
    farmName: { type: String, default: 'Green Valley Agro Farm' },
    farmLocation: { type: String, default: 'Field Zone 1' },
    farmSize: { type: Number, default: 5.0 },
    experienceYears: { type: Number, default: 3 },
    primaryCrops: { type: String, default: 'Rice, Tomato, Cotton' },
    soilType: { type: String, default: 'Black Soil' },
    irrigationSystem: { type: String, default: 'Drip Irrigation' },
    waterSource: { type: String, default: 'Borewell' },
    farmingMethod: { type: String, default: 'Precision / Smart Farming' },
    stateRegion: { type: String, default: 'Karnataka' },
    farmBio: { type: String, default: 'Dedicated to high-yield sustainable agriculture using AgroAI smart diagnostics.' },
    annualYieldTarget: { type: String, default: '60 Quintals / Acre' },
    latitude: { type: Number, default: 11.0168 },
    longitude: { type: Number, default: 76.9558 },
    profileImageUri: { type: String, default: '' },

    // Email verification
    verified: { type: Boolean, default: false },
    verificationToken: { type: String, select: false },

    // Email OTP login
    emailOtpHash: { type: String, select: false },
    emailOtpExpires: { type: Date, select: false },
    emailOtpAttempts: { type: Number, default: 0, select: false },

    // Phone OTP
    phoneVerified: { type: Boolean, default: false },
    phoneOtpHash: { type: String, select: false },
    phoneOtpExpires: { type: Date, select: false },
    phoneOtpAttempts: { type: Number, default: 0, select: false },

    // Password reset
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
