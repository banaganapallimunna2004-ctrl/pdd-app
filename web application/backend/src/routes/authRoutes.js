const express = require('express');
const {
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
} = require('../controllers/authController');
const { verifyToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Registration & password login
router.post('/register', register);
router.post('/login', login);

// Profile sync / update
router.post('/update', optionalAuth, updateProfile);
router.put('/profile', optionalAuth, updateProfile);
router.post('/profile', optionalAuth, updateProfile);

// Email OTP login (passwordless)
router.post('/email/request-otp', requestEmailOtp);
router.post('/email/verify-otp', verifyEmailOtp);

// Phone OTP login
router.post('/phone/request-otp', requestPhoneOtp);
router.post('/phone/verify-otp', verifyPhoneOtp);

// Token management
router.post('/refresh', refreshToken);
router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken', { path: '/' });
  res.json({ message: 'Logged out successfully.' });
});

// Email verification (link-based)
router.post('/verify', verifyEmail);

// Password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected
router.get('/me', verifyToken, me);

module.exports = router;
