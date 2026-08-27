import axios from 'axios';

// Prefer explicit env var, fall back to common local backend ports.
// This avoids "Network Error" when backend runs on a different port.
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  // Start with env var or default; we may replace it after reachability probe.
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agroai_access_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Authentication required.');
    } else if (!error.response) {
      console.error('Network Error: Check if your backend is running at:', API_URL);
    }
    return Promise.reject(error);
  }
);

export default api;
