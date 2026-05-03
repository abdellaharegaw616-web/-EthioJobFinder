import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: `${API_URL}/notifications`,
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

const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/read-all');
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
  }
};

export default notificationService;
