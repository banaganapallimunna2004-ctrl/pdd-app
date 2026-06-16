import api from './api';

const register = (payload) => api.post('/auth/register', payload);
const login = (payload) => api.post('/auth/login', payload);
const requestPhoneOtp = (payload) => api.post('/auth/phone/request-otp', payload);
const verifyPhoneOtp = (payload) => api.post('/auth/phone/verify-otp', payload);
const refresh = () => api.post('/auth/refresh');
const verifyEmail = (token) => api.post('/auth/verify', { token });
const forgotPassword = (payload) => api.post('/auth/forgot-password', payload);
const resetPassword = (payload) => api.post('/auth/reset-password', payload);
const me = () => api.get('/auth/me');

export default { register, login, requestPhoneOtp, verifyPhoneOtp, refresh, verifyEmail, forgotPassword, resetPassword, me };
