import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('agroai_access_token') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      authService.me()
        .then((response) => setUser(response.data.user))
        .catch(() => {
          localStorage.removeItem('agroai_access_token');
          setAccessToken('');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  const login = async (email, password) => {
    setError(null);
    const response = await authService.login({ email, password });
    return persistSession(response);
  };

  const persistSession = (response) => {
    const token = response.data.accessToken;
    const storedUser = response.data.user;

    localStorage.setItem('agroai_access_token', token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setAccessToken(token);
    setUser(storedUser);
    return storedUser;
  };

  const requestPhoneOtp = async (phone) => {
    setError(null);
    return authService.requestPhoneOtp({ phone });
  };

  const verifyPhoneOtp = async (phone, otp) => {
    setError(null);
    const response = await authService.verifyPhoneOtp({ phone, otp });
    return persistSession(response);
  };

  const register = async (name, email, phone, password, role) => {
    setError(null);
    return authService.register({ name, email, phone, password, role });
  };

  const logout = () => {
    localStorage.removeItem('agroai_access_token');
    setAccessToken('');
    setUser(null);
    delete api.defaults.headers.common.Authorization;
    navigate('/login');
  };

  const value = useMemo(
    () => ({ user, loading, error, login, requestPhoneOtp, verifyPhoneOtp, register, logout, setError }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
