const express = require('express');
const {
  register,
  login,
  requestPhoneOtp,
  verifyPhoneOtp,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  me,
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/phone/request-otp', requestPhoneOtp);
router.post('/phone/verify-otp', verifyPhoneOtp);
router.post('/refresh', refreshToken);
router.post('/verify', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', verifyToken, me);

module.exports = router;
