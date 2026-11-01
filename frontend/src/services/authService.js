import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://ethiojobfinder.onrender.com/api' : 'http://localhost:5000/api');

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
  },

  updateNotificationPreferences: async (preferences) => {
    const response = await api.put('/notification-preferences', preferences);
    return response.data;
  },

  uploadAvatar: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/upload/profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  uploadLogo: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/upload/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  }
};

export default authService;
