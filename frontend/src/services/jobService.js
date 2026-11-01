import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://ethio-jobs-finder.onrender.com/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: `${API_URL}`,
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

const jobService = {
  getJobs: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    const queryString = params.toString();
    const url = queryString ? `/jobs?${queryString}` : '/jobs';
    const response = await api.get(url);
    return response.data;
  },

  getJob: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  getMyJobs: async () => {
    const response = await api.get('/jobs/my-jobs');
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  applyForJob: async (applicationData) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },

  getMyApplications: async () => {
    const response = await api.get('/applications/my-applications');
    return response.data;
  },

  getReceivedApplications: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.jobId) params.append('jobId', filters.jobId);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    const queryString = params.toString();
    const url = queryString ? `/applications/received?${queryString}` : '/applications/received';
    const response = await api.get(url);
    return response.data;
  },

  getJobApplications: async (jobId) => {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },

  updateJobStatus: async (id, status) => {
    const response = await api.patch(`/jobs/${id}/status`, { status });
    return response.data;
  },

  getCompanyProfile: async (id) => {
    const response = await api.get(`/auth/company/${id}`);
    return response.data;
  },

  requestVerification: async (verificationData) => {
    const response = await api.post('/auth/request-verification', verificationData);
    return response.data;
  },

  updateApplicationStatus: async (id, status, notes) => {
    const response = await api.put(`/applications/${id}/status`, { status, notes });
    return response.data;
  },

  withdrawApplication: async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },

  getSavedJobs: async () => {
    const response = await api.get('/auth/saved-jobs');
    return response.data;
  },

  saveJob: async (jobId) => {
    const response = await api.post(`/auth/saved-jobs/${jobId}`);
    return response.data;
  },

  unsaveJob: async (jobId) => {
    const response = await api.delete(`/auth/saved-jobs/${jobId}`);
    return response.data;
  },

  updateNotificationPreferences: async (preferences) => {
    const response = await api.put('/auth/notification-preferences', preferences);
    return response.data;
  },

  reportJob: async (jobId, reportData) => {
    const response = await api.post(`/jobs/${jobId}/report`, reportData);
    return response.data;
  },

  getRecommendations: async () => {
    const response = await api.get('/jobs/recommendations');
    return response.data;
  }
};

export default jobService;
