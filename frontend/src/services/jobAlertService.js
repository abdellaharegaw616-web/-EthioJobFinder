import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: `${API_URL}/job-alerts`,
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

const jobAlertService = {
  getMyAlerts: async () => {
    const res = await api.get('/');
    return res.data;
  },

  createAlert: async (alertData) => {
    const res = await api.post('/', alertData);
    return res.data;
  },

  updateAlert: async (id, updates) => {
    const res = await api.put(`/${id}`, updates);
    return res.data;
  },

  deleteAlert: async (id) => {
    const res = await api.delete(`/${id}`);
    return res.data;
  },

  getAlertMatches: async (id) => {
    const res = await api.get(`/${id}/matches`);
    return res.data;
  }
};

export default jobAlertService;
