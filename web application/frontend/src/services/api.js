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
