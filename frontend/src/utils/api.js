import axios from 'axios';
import config from '../config';

// Create an axios instance with the base URL from config
const api = axios.create({
  baseURL: config.API_BASE_URL,
});

// Add request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API functions
export const apiLogin = async (credentials) => {
  console.log('Attempting login with:', { ...credentials, password: '[HIDDEN]' });
  return await api.post('/api/auth/login', credentials);
};

export const apiRegister = async (userData) => {
  return await api.post('/api/auth/register', userData);
};

export const apiGetUsers = async () => {
  return await api.get('/api/auth/users');
};

export const apiCheckAvailability = async (params) => {
  return await api.get('/api/events/check-availability', { params });
};

export const apiGetEvents = async () => {
  return await api.get('/api/events/list');
};

export const apiApproveEvent = async (id, data) => {
  return await api.patch(`/api/events/${id}/approve`, data);
};

export const apiRejectEvent = async (id, data) => {
  return await api.patch(`/api/events/${id}/reject`, data);
};

export default api;
