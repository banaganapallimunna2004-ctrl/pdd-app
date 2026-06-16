const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['Farmer', 'Expert', 'Admin'], default: 'Farmer' },
    verified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    phoneOtpHash: { type: String, select: false },
    phoneOtpExpires: { type: Date },
    phoneOtpAttempts: { type: Number, default: 0 },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
