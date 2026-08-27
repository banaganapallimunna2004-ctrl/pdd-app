import api from './api';

const register        = (payload)      => api.post('/auth/register', payload);
const login           = (payload)      => api.post('/auth/login', payload);

// Email OTP (passwordless)
const requestEmailOtp = (payload)      => api.post('/auth/email/request-otp', payload);
const verifyEmailOtp  = (payload)      => api.post('/auth/email/verify-otp', payload);

// Phone OTP
const requestPhoneOtp = (payload)      => api.post('/auth/phone/request-otp', payload);
const verifyPhoneOtp  = (payload)      => api.post('/auth/phone/verify-otp', payload);

// Token management
const refresh         = ()             => api.post('/auth/refresh');
const logout          = ()             => api.post('/auth/logout');

// Email verification (link-based)
const verifyEmail     = (token)        => api.post('/auth/verify', { token });

// Password reset
const forgotPassword  = (payload)      => api.post('/auth/forgot-password', payload);
const resetPassword   = (payload)      => api.post('/auth/reset-password', payload);

// Profile
const me              = ()             => api.get('/auth/me');

export default {
  register,
  login,
  requestEmailOtp,
  verifyEmailOtp,
  requestPhoneOtp,
  verifyPhoneOtp,
  refresh,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  me,
};
