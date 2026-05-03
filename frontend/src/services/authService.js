import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const authService = {
  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/me');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.get(`/verify-email/${token}`);
    return response.data;
  },

  resendVerification: async () => {
    const response = await api.post('/verify-email/send');
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.post(`/reset-password/${token}`, { password });
    return response.data;
  }
};

export default authService;
