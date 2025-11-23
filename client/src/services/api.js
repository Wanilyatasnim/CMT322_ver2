import axios from 'axios';

// In production, use relative paths (same domain)
// In development, use the proxy or explicit URL
const API_URL = process.env.REACT_APP_API_URL || '';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 second timeout for image uploads
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Listings API
export const listingsAPI = {
  getAll: (params) => api.get('/api/listings', { params }),
  getOne: (id) => api.get(`/api/listings/${id}`),
  create: (formData) => {
    // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
    return api.post('/api/listings', formData, {
      headers: { 
        // Remove Content-Type to let browser set it automatically with boundary
      },
      timeout: 60000 // 60 seconds for image uploads
    });
  },
  update: (id, formData) => {
    // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
    return api.put(`/api/listings/${id}`, formData, {
      headers: { 
        // Remove Content-Type to let browser set it automatically with boundary
      },
      timeout: 60000 // 60 seconds for image uploads
    });
  },
  delete: (id) => api.delete(`/api/listings/${id}`),
  markAsSold: (id) => api.patch(`/api/listings/${id}/sold`),
  getSellerListings: (id) => api.get(`/api/listings/${id}/seller-listings`),
  report: (id, reason) => api.post(`/api/listings/${id}/report`, { reason })
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
  getMyListings: () => api.get('/api/users/my-listings'),
  getUser: (id) => api.get(`/api/users/${id}`)
};

// Admin API
export const adminAPI = {
  getUsers: () => api.get('/api/admin/users'),
  getListings: () => api.get('/api/admin/listings'),
  getStats: () => api.get('/api/admin/stats'),
  deleteListing: (id) => api.delete(`/api/admin/listings/${id}`),
  banUser: (id) => api.patch(`/api/admin/users/${id}/ban`),
  unbanUser: (id) => api.patch(`/api/admin/users/${id}/unban`),
  approveListing: (id) => api.patch(`/api/admin/listings/${id}/approve`),
  getReports: () => api.get('/api/admin/reports'),
  resolveReport: (id) => api.patch(`/api/admin/reports/${id}/resolve`)
};

export default api;

