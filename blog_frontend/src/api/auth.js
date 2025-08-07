// src/api/authAPI.js

import api from './config';

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/login/', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/register/', userData);
    return response.data;
  },

  getUser: async () => {
    const response = await api.get('/profile/');
    return response.data;
  },

  updateProfile: async (userData) => {
    // ✅ CORRECTED: Endpoint now points to the profile view for updates
    const response = await api.patch('/profile/', userData);
    return response.data;
  }
};