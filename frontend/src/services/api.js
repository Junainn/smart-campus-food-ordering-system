import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if user was previously authenticated
    // Don't redirect on login attempts
    if (error.response?.status === 401 && !error.config.url.includes('/login')) {
      localStorage.removeItem('user');
      // Redirect based on the URL path
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/vendor')) {
        window.location.href = '/vendor/login';
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
