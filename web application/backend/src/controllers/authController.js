const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { createAccessToken, createRefreshToken } = require('../utils/token');
const { sendEmail } = require('../services/emailService');
const { sendSms } = require('../services/smsService');

const OTP_TTL_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

/* ──────────────────────────────────────────────
   Helpers
────────────────────────────────────────────── */

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
});

const normalizePhone = (phone) => {
  const value = String(phone || '').trim();
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  if (value.startsWith('+') && digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  return '';
};

const createOtp = () => String(crypto.randomInt(100000, 1000000));

const hashOtp = (otp) =>
  crypto
    .createHash('sha256')
    .update(`${otp}:${process.env.JWT_SECRET || 'agro-ai-otp-secret'}`)
    .digest('hex');

const sendAuthResponse = (res, user) => {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  res.cookie('refreshToken', refreshToken, getCookieOptions());
  res.json({
    success: true,
    message: 'Authentication successful',
    user: {
      id: user._id,
      _id: user._id,
      name: user.name || user.fullName || 'Smart Farmer',
      fullName: user.fullName || user.name || 'Smart Farmer',
      email: user.email,
      phone: user.phone || '+91 9876543210',
      role: user.role || 'Farmer',
      farmName: user.farmName || 'Green Valley Agro Farm',
      farmLocation: user.farmLocation || 'Field Zone 1',
      farmSize: user.farmSize !== undefined ? Number(user.farmSize) : 5.0,
      experienceYears: user.experienceYears !== undefined ? Number(user.experienceYears) : 3,
      primaryCrops: user.primaryCrops || 'Rice, Tomato, Cotton',
      soilType: user.soilType || 'Black Soil',
      irrigationSystem: user.irrigationSystem || 'Drip Irrigation',
      waterSource: user.waterSource || 'Borewell',
      farmingMethod: user.farmingMethod || 'Precision / Smart Farming',
      stateRegion: user.stateRegion || 'Karnataka',
      farmBio: user.farmBio || 'Dedicated to high-yield sustainable agriculture using AgroAI smart diagnostics.',
      annualYieldTarget: user.annualYieldTarget || '60 Quintals / Acre',
      latitude: user.latitude !== undefined ? Number(user.latitude) : 11.0168,
      longitude: user.longitude !== undefined ? Number(user.longitude) : 76.9558,
      profileImageUri: user.profileImageUri || '',
      isLoggedIn: true,
    },
    accessToken,
  });
};

/* ──────────────────────────────────────────────
   Email OTP HTML templates
────────────────────────────────────────────── */
const otpEmailHtml = (name, otp, type = 'login') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #0f172a; color: #e2e8f0; margin: 0; padding: 0; }
    .container { max-width: 520px; margin: 40px auto; background: #1e293b; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #16a34a, #15803d); padding: 32px; text-align: center; }
    .header h1 { margin: 0; color: #fff; font-size: 24px; }
    .header p { margin: 4px 0 0; color: #bbf7d0; font-size: 14px; }
    .body { padding: 32px; }
    .otp-box { background: #0f172a; border: 2px dashed #16a34a; border-radius: 12px; text-align: center; padding: 24px; margin: 24px 0; }
    .otp-box span { display: block; font-size: 40px; font-weight: 800; letter-spacing: 10px; color: #4ade80; }
    .otp-box small { color: #94a3b8; font-size: 13px; }
    .footer { background: #0f172a; padding: 20px; text-align: center; color: #475569; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌾 Agro AI Precision System</h1>
      <p>Secure Account Access</p>
    </div>
    <div class="body">
      <p>Hello <strong>${name}</strong>,</p>
      <p>Use the one-time code below to ${type === 'login' ? 'sign in to' : 'verify'} your Agro AI account. This code expires in <strong>${OTP_TTL_MINUTES} minutes</strong>.</p>
      <div class="otp-box">
        <span>${otp}</span>
        <small>Valid for ${OTP_TTL_MINUTES} minutes • Do not share this code</small>
      </div>
      <p style="color: #64748b; font-size: 13px;">If you didn't request this code, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Agro AI Precision Agriculture Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

/* ──────────────────────────────────────────────
   Controllers
────────────────────────────────────────────── */

/** POST /auth/register */
const register = async (req, res) => {
  const name = String(req.body.name || req.body.fullName || '').trim();
  const email = String(req.body.email || '').toLowerCase().trim();
  const password = String(req.body.password || req.body.passwordHash || '').trim();
  const phone = req.body.phone;
  const role = req.body.role || 'Farmer';
  const farmName = req.body.farmName;
  const farmLocation = req.body.farmLocation;
  const farmSize = req.body.farmSize !== undefined ? Number(req.body.farmSize) : 5.0;
  const experienceYears = req.body.experienceYears !== undefined ? Number(req.body.experienceYears) : 3;
  const primaryCrops = req.body.primaryCrops || 'Rice, Tomato, Cotton';
  const soilType = req.body.soilType || 'Black Soil';
  const irrigationSystem = req.body.irrigationSystem || 'Drip Irrigation';
  const latitude = req.body.latitude !== undefined ? Number(req.body.latitude) : 11.0168;
  const longitude = req.body.longitude !== undefined ? Number(req.body.longitude) : 76.9558;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  let normalizedPhone = undefined;
  if (phone) {
    normalizedPhone = normalizePhone(phone);
    if (normalizedPhone && normalizedPhone !== '+919876543210' && normalizedPhone !== '+910000000000') {
      const existingPhone = await User.findOne({ phone: normalizedPhone, email: { $ne: email } }).select('_id').lean();
      if (existingPhone) {
        return res.status(400).json({ success: false, message: 'Phone number already registered with another account.' });
      }
    }
  }

  if (password.length < 5) {
    return res.status(400).json({ success: false, message: 'Password must be at least 5 characters.' });
  }

  const existing = await User.findOne({ email }).select('_id').lean();
  if (existing) return res.status(400).json({ success: false, message: 'Email already registered.' });

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    name,
    fullName: name,
    email,
    phone: normalizedPhone || (phone ? String(phone).trim() : undefined),
    password: hashedPassword,
    role: role || 'Farmer',
    farmName: farmName || 'Green Valley Agro Farm',
    farmLocation: farmLocation || 'Field Zone 1',
    farmSize: farmSize || 5.0,
    experienceYears: experienceYears || 3,
    primaryCrops: primaryCrops || 'Rice, Tomato, Cotton',
    soilType: soilType || 'Black Soil',
    irrigationSystem: irrigationSystem || 'Drip Irrigation',
    latitude: latitude || 11.0168,
    longitude: longitude || 76.9558,
    verified: true,
  });

  sendAuthResponse(res, user);
};

/** POST /auth/login (email + password) */
const login = async (req, res) => {
  const email = String(req.body.email || '').toLowerCase().trim();
  const password = String(req.body.password || req.body.passwordHash || '').trim();

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  let user = await User.findOne({ email: new RegExp('^' + email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') }).select('+password');
  
  // Auto-seed default accounts on first login if not yet in database
  if (!user && (email === 'farmer@agroai.com' || email === 'admin@agroai.com')) {
    const isAdmin = email.includes('admin');
    const defaultPass = isAdmin ? 'Admin@123456' : 'Farmer@123456';
    const hashedPassword = await bcrypt.hash(defaultPass, SALT_ROUNDS);
    user = await User.create({
      name: isAdmin ? 'Agro AI Admin' : 'Smart Farmer',
      fullName: isAdmin ? 'Agro AI Admin' : 'Smart Farmer',
      email,
      phone: isAdmin ? '+910000000000' : '+919876543210',
      password: hashedPassword,
      role: isAdmin ? 'Admin' : 'Farmer',
      farmName: 'Green Valley Agro Farm',
      farmLocation: 'Field Zone 1',
      farmSize: 8.5,
      experienceYears: 4,
      primaryCrops: 'Rice, Tomato, Cotton',
      soilType: 'Black Soil',
      irrigationSystem: 'Drip Irrigation',
      verified: true,
    });
  }

  if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

  // Direct check or bcrypt comparison, plus demo bypass for seamless testing
  let passwordMatches = false;
  try {
    passwordMatches = await bcrypt.compare(password, user.password);
  } catch (e) {}

  if (!passwordMatches) {
    if (
      user.password === password ||
      (email === 'farmer@agroai.com' && (password === 'password123' || password === 'Farmer@123456')) ||
      (email === 'admin@agroai.com' && (password === 'admin123' || password === 'Admin@123456'))
    ) {
      passwordMatches = true;
      // Auto upgrade plaintext password to bcrypt hash in DB
      try {
        user.password = await bcrypt.hash(password, SALT_ROUNDS);
        await user.save();
      } catch (saveErr) {}
    }
  }

  if (!passwordMatches) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

  if (!user.verified) {
    user.verified = true;
    await user.save();
  }

  sendAuthResponse(res, user);
};


/** POST /auth/email/request-otp */
const requestEmailOtp = async (req, res) => {
  const email = String(req.body.email || '').toLowerCase().trim();
  if (!email) return res.status(400).json({ message: 'Email address is required.' });

  let user = await User.findOne({ email }).select('+emailOtpHash +emailOtpExpires +emailOtpAttempts');
  if (!user) {
    return res.status(200).json({ message: 'If that email is registered, an OTP has been sent.' });
  }

  const otp = createOtp();
  user.emailOtpHash = hashOtp(otp);
  user.emailOtpExpires = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
  user.emailOtpAttempts = 0;
  await user.save();

  try {
    await sendEmail({
      to: email,
      subject: `🔐 Your Agro AI Login OTP: ${otp}`,
      html: otpEmailHtml(user.name, otp, 'login'),
    });
  } catch (emailErr) {
    console.error('Email OTP send failed:', emailErr.message);
  }

  res.json({
    message: 'OTP sent to your email address.',
    devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
  });
};

/** POST /auth/email/verify-otp */
const verifyEmailOtp = async (req, res) => {
  const email = String(req.body.email || '').toLowerCase().trim();
  const otp = String(req.body.otp || '').trim();

  if (!email || !/^\d{6}$/.test(otp)) {
    return res.status(400).json({ message: 'Valid email and 6-digit OTP are required.' });
  }

  const user = await User.findOne({ email }).select('+emailOtpHash +emailOtpExpires +emailOtpAttempts');
  if (!user || !user.emailOtpHash || !user.emailOtpExpires) {
    return res.status(400).json({ message: 'Request a fresh OTP before signing in.' });
  }

  if (user.emailOtpExpires.getTime() < Date.now()) {
    user.emailOtpHash = undefined;
    user.emailOtpExpires = undefined;
    user.emailOtpAttempts = 0;
    await user.save();
    return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
  }

  if (user.emailOtpAttempts >= MAX_OTP_ATTEMPTS) {
    return res.status(429).json({ message: 'Too many OTP attempts. Request a new OTP.' });
  }

  if (user.emailOtpHash !== hashOtp(otp)) {
    user.emailOtpAttempts += 1;
    await user.save();
    return res.status(400).json({
      message: `Invalid OTP. ${MAX_OTP_ATTEMPTS - user.emailOtpAttempts} attempt(s) remaining.`,
    });
  }

  // OTP verified
  user.verified = true;
  user.emailOtpHash = undefined;
  user.emailOtpExpires = undefined;
  user.emailOtpAttempts = 0;
  await user.save();

  sendAuthResponse(res, user);
};

/* ──────────────────────────────────────────────
   Phone OTP Login
────────────────────────────────────────────── */

/** POST /auth/phone/request-otp */
const requestPhoneOtp = async (req, res) => {
  const phone = normalizePhone(req.body.phone);
  if (!phone) {
    return res.status(400).json({ message: 'Enter a valid phone number.' });
  }

  let user = await User.findOne({ phone }).select('+phoneOtpHash +phoneOtpExpires +phoneOtpAttempts');

  if (!user) {
    const tempId = crypto.randomBytes(4).toString('hex');
    user = await User.create({
      name: 'New User',
      email: `otp_${tempId}_${phone.replace(/\D/g, '')}@agroai.internal`,
      phone,
      password: await bcrypt.hash(crypto.randomBytes(24).toString('hex'), SALT_ROUNDS),
      role: 'Farmer',
      verified: true,
      phoneVerified: false,
    });
    user = await User.findById(user._id).select('+phoneOtpHash +phoneOtpExpires +phoneOtpAttempts');
  }

  const otp = createOtp();
  user.phoneOtpHash = hashOtp(otp);
  user.phoneOtpExpires = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
  user.phoneOtpAttempts = 0;
  await user.save();

  let sms = { delivered: false };
  try {
    sms = await sendSms({
      to: phone,
      message: `Your Agro AI OTP is ${otp}. Expires in ${OTP_TTL_MINUTES} min. Do not share.`,
    });
  } catch (err) {
    console.error('SMS Service Error:', err.message);
  }

  res.json({
    message: sms.delivered ? 'OTP sent to your phone.' : 'OTP generated. Configure SMS credentials for real delivery.',
    phone,
    devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
  });
};

/** POST /auth/phone/verify-otp */
const verifyPhoneOtp = async (req, res) => {
  const phone = normalizePhone(req.body.phone);
  const otp = String(req.body.otp || '').trim();

  if (!phone || !/^\d{6}$/.test(otp)) {
    return res.status(400).json({ message: 'Valid phone and 6-digit OTP are required.' });
  }

  const user = await User.findOne({ phone }).select('+phoneOtpHash +phoneOtpExpires +phoneOtpAttempts');
  if (!user || !user.phoneOtpHash || !user.phoneOtpExpires) {
    return res.status(400).json({ message: 'Request a fresh OTP before signing in.' });
  }

  if (user.phoneOtpExpires.getTime() < Date.now()) {
    user.phoneOtpHash = undefined;
    user.phoneOtpExpires = undefined;
    user.phoneOtpAttempts = 0;
    await user.save();
    return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
  }

  if (user.phoneOtpAttempts >= MAX_OTP_ATTEMPTS) {
    return res.status(429).json({ message: 'Too many OTP attempts. Request a new OTP.' });
  }

  if (user.phoneOtpHash !== hashOtp(otp)) {
    user.phoneOtpAttempts += 1;
    await user.save();
    return res.status(400).json({
      message: `Invalid OTP. ${MAX_OTP_ATTEMPTS - user.phoneOtpAttempts} attempt(s) remaining.`,
    });
  }

  user.phoneVerified = true;
  user.verified = true;
  user.phoneOtpHash = undefined;
  user.phoneOtpExpires = undefined;
  user.phoneOtpAttempts = 0;
  await user.save();

  sendAuthResponse(res, user);
};

/* ──────────────────────────────────────────────
   Token Refresh & Verification
────────────────────────────────────────────── */

/** POST /auth/refresh */
const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (!token) return res.status(401).json({ message: 'Refresh token required' });

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    sendAuthResponse(res, user);
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

/** POST /auth/verify */
const verifyEmail = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Verification token required' });

  const user = await User.findOne({ verificationToken: token }).select('+verificationToken');
  if (!user) return res.status(400).json({ message: 'Invalid or expired verification token' });

  user.verified = true;
  user.verificationToken = undefined;
  await user.save();

  sendAuthResponse(res, user);
};

/** POST /auth/forgot-password */
const forgotPassword = async (req, res) => {
  const email = String(req.body.email || '').toLowerCase().trim();
  if (!email) return res.status(400).json({ message: 'Email address is required.' });

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({ message: 'If that email exists, password reset instructions have been sent.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

  try {
    await sendEmail({
      to: email,
      subject: '🔑 Password Reset Request - Agro AI',
      html: `<p>Reset your Agro AI password: <a href="${resetUrl}">Reset Password</a></p>`,
    });
  } catch (err) {
    console.error('Password reset email error:', err.message);
  }

  res.json({
    message: 'Password reset link sent to your email address.',
    resetUrl: process.env.NODE_ENV !== 'production' ? resetUrl : undefined,
  });
};

/** POST /auth/reset-password */
const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: 'Token and new password are required.' });

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpires');

  if (!user) {
    return res.status(400).json({ message: 'Password reset token is invalid or expired.' });
  }

  user.password = await bcrypt.hash(password, SALT_ROUNDS);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Your password has been reset successfully. You can now sign in.' });
};

/* ──────────────────────────────────────────────
   Current User
────────────────────────────────────────────── */

/** POST /auth/update or PUT /auth/profile */
const updateProfile = async (req, res) => {
  const email = String(req.body.email || req.user?.email || '').toLowerCase().trim();
  if (!email) {
    return res.status(400).json({ success: false, message: 'User email is required for profile update.' });
  }

  let user = await User.findOne({ email });
  if (!user && req.user?._id) {
    user = await User.findById(req.user._id);
  }

  const updates = {
    name: req.body.fullName || req.body.name || user?.name || 'Smart Farmer',
    fullName: req.body.fullName || req.body.name || user?.fullName || 'Smart Farmer',
    phone: req.body.phone !== undefined ? req.body.phone : user?.phone,
    farmName: req.body.farmName !== undefined ? req.body.farmName : user?.farmName,
    farmLocation: req.body.farmLocation !== undefined ? req.body.farmLocation : user?.farmLocation,
    farmSize: req.body.farmSize !== undefined ? Number(req.body.farmSize) : user?.farmSize,
    experienceYears: req.body.experienceYears !== undefined ? Number(req.body.experienceYears) : user?.experienceYears,
    primaryCrops: req.body.primaryCrops !== undefined ? req.body.primaryCrops : user?.primaryCrops,
    soilType: req.body.soilType !== undefined ? req.body.soilType : user?.soilType,
    irrigationSystem: req.body.irrigationSystem !== undefined ? req.body.irrigationSystem : user?.irrigationSystem,
    waterSource: req.body.waterSource !== undefined ? req.body.waterSource : user?.waterSource,
    farmingMethod: req.body.farmingMethod !== undefined ? req.body.farmingMethod : user?.farmingMethod,
    stateRegion: req.body.stateRegion !== undefined ? req.body.stateRegion : user?.stateRegion,
    farmBio: req.body.farmBio !== undefined ? req.body.farmBio : user?.farmBio,
    annualYieldTarget: req.body.annualYieldTarget !== undefined ? req.body.annualYieldTarget : user?.annualYieldTarget,
    latitude: req.body.latitude !== undefined ? Number(req.body.latitude) : user?.latitude,
    longitude: req.body.longitude !== undefined ? Number(req.body.longitude) : user?.longitude,
    profileImageUri: req.body.profileImageUri !== undefined ? req.body.profileImageUri : user?.profileImageUri,
  };

  if (!user) {
    user = await User.create({
      name: updates.fullName,
      email,
      password: await bcrypt.hash('agro_farmer_123', SALT_ROUNDS),
      ...updates,
      verified: true,
    });
  } else {
    Object.assign(user, updates);
    await user.save();
  }

  res.json({
    success: true,
    message: 'Profile synchronized with shared MongoDB database.',
    user: {
      id: user._id,
      _id: user._id,
      name: user.name,
      fullName: user.fullName || user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role || 'Farmer',
      farmName: user.farmName,
      farmLocation: user.farmLocation,
      farmSize: user.farmSize,
      experienceYears: user.experienceYears,
      primaryCrops: user.primaryCrops,
      soilType: user.soilType,
      irrigationSystem: user.irrigationSystem,
      waterSource: user.waterSource,
      farmingMethod: user.farmingMethod,
      stateRegion: user.stateRegion,
      farmBio: user.farmBio,
      annualYieldTarget: user.annualYieldTarget,
      latitude: user.latitude,
      longitude: user.longitude,
      profileImageUri: user.profileImageUri,
      isLoggedIn: true,
    },
  });
};

/** GET /auth/me */
const me = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ user });
};

module.exports = {
  register,
  login,
  updateProfile,
  requestEmailOtp,
  verifyEmailOtp,
  requestPhoneOtp,
  verifyPhoneOtp,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  me,
};
