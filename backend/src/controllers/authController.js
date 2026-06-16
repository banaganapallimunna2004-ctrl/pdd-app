const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { createAccessToken, createRefreshToken } = require('../utils/token');
const { sendEmail } = require('../services/emailService');
const { sendSms } = require('../services/smsService');

const OTP_TTL_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;

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
  if (value.startsWith('+') && digits.length >= 8 && digits.length <= 15) {
    return `+${digits}`;
  }
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length >= 8 && digits.length <= 15) {
    return `+${digits}`;
  }
  return '';
};

const createOtp = () => String(crypto.randomInt(100000, 1000000));

const hashOtp = (otp) => {
  return crypto
    .createHash('sha256')
    .update(`${otp}:${process.env.JWT_SECRET || 'agro-ai-otp-secret'}`)
    .digest('hex');
};

const sendAuthResponse = (res, user) => {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  res.cookie('refreshToken', refreshToken, getCookieOptions());

  res.json({ user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }, accessToken });
};

const register = async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone) {
    return res.status(400).json({ message: 'Enter a valid phone number for OTP verification.' });
  }

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already registered.' });

  const existingPhone = await User.findOne({ phone: normalizedPhone });
  if (existingPhone) return res.status(400).json({ message: 'Phone number already registered.' });

  if (!password || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
  }

  const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS || 12));
  const verificationToken = crypto.randomBytes(24).toString('hex');

  const user = await User.create({ name, email, phone: normalizedPhone, password: hashedPassword, role, verificationToken });

  const verifyUrl = `${process.env.FRONTEND_URL}/verify?token=${verificationToken}`;
  await sendEmail({
    to: email,
    subject: 'Verify your Agro AI account',
    html: `<p>Hi ${name},</p><p>Confirm your email by clicking <a href="${verifyUrl}">here</a>.</p>`,
  });

  res.status(201).json({ message: 'Account created. Check email to verify your account.' });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) return res.status(401).json({ message: 'Invalid email or password.' });

  if (!user.verified) {
    return res.status(403).json({ message: 'Please verify your email before signing in.' });
  }

  sendAuthResponse(res, user);
};

const requestPhoneOtp = async (req, res) => {
  const phone = normalizePhone(req.body.phone);
  if (!phone) {
    return res.status(400).json({ message: 'Enter a valid phone number.' });
  }

  let user = await User.findOne({ phone }).select('+phoneOtpHash');

  // Allow OTP for unregistered numbers: create a verification-only user.
  // This lets the client proceed with OTP verification, after which the app can
  // redirect the user to complete profile (handled on frontend as needed).
  if (!user) {
    user = await User.create({
      name: 'New User',
      email: '',
      phone,
      password: await bcrypt.hash(crypto.randomBytes(24).toString('hex'), Number(process.env.BCRYPT_SALT_ROUNDS || 12)),
      role: 'Farmer',
      verified: false,
      phoneVerified: false,
    });
    user = await User.findById(user._id).select('+phoneOtpHash');
  }


  const otp = createOtp();
  user.phoneOtpHash = hashOtp(otp);
  user.phoneOtpExpires = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
  user.phoneOtpAttempts = 0;
  await user.save();

  const sms = await sendSms({
    to: phone,
    message: `Your Agro AI sign-in OTP is ${otp}. It expires in ${OTP_TTL_MINUTES} minutes.`,
  });

  res.json({
    message: sms.delivered
      ? 'OTP sent to your phone number.'
      : 'Development OTP generated. Configure SMS credentials to send real messages.',
    phone,
    devOtp: process.env.NODE_ENV === 'production' ? undefined : otp,
  });
};

const verifyPhoneOtp = async (req, res) => {
  const phone = normalizePhone(req.body.phone);
  const otp = String(req.body.otp || '').trim();

  if (!phone || !/^\d{6}$/.test(otp)) {
    return res.status(400).json({ message: 'Enter a valid phone number and 6-digit OTP.' });
  }

  const user = await User.findOne({ phone }).select('+phoneOtpHash');
  if (!user || !user.phoneOtpHash || !user.phoneOtpExpires) {
    return res.status(400).json({ message: 'Request a fresh OTP before signing in.' });
  }

  if (user.phoneOtpExpires.getTime() < Date.now()) {
    user.phoneOtpHash = undefined;
    user.phoneOtpExpires = undefined;
    user.phoneOtpAttempts = 0;
    await user.save();
    return res.status(400).json({ message: 'OTP expired. Request a new one.' });
  }

  if (user.phoneOtpAttempts >= MAX_OTP_ATTEMPTS) {
    return res.status(429).json({ message: 'Too many OTP attempts. Request a new OTP.' });
  }

  if (user.phoneOtpHash !== hashOtp(otp)) {
    user.phoneOtpAttempts += 1;
    await user.save();
    return res.status(400).json({ message: 'Invalid OTP. Please check and try again.' });
  }

  user.phoneVerified = true;
  user.verified = true;
  user.phoneOtpHash = undefined;
  user.phoneOtpExpires = undefined;
  user.phoneOtpAttempts = 0;
  await user.save();

  sendAuthResponse(res, user);
};

const refreshToken = async (req, res) => {
  const cookie = req.cookies.refreshToken;
  if (!cookie) return res.status(401).json({ message: 'Refresh token missing.' });

  try {
    const payload = require('jsonwebtoken').verify(cookie, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'Invalid refresh token.' });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    res.cookie('refreshToken', refreshToken, getCookieOptions());

    res.json({ accessToken });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token.' });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.body;
  const user = await User.findOne({ verificationToken: token });
  if (!user) return res.status(400).json({ message: 'Verification token is invalid or expired.' });

  user.verified = true;
  user.verificationToken = undefined;
  await user.save();

  res.json({ message: 'Your email has been verified.' });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });

  const resetToken = crypto.randomBytes(24).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 60;
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await sendEmail({
    to: email,
    subject: 'Reset your Agro AI password',
    html: `<p>Use the link below to reset your password:</p><p><a href="${resetUrl}">Reset Password</a></p>`,
  });

  res.json({ message: 'Password reset instructions sent if the account exists.' });
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ message: 'Password reset token is invalid or expired.' });

  user.password = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS || 12));
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Your password has been reset successfully.' });
};

const me = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json({ user });
};

module.exports = {
  register,
  login,
  requestPhoneOtp,
  verifyPhoneOtp,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  me,
};
