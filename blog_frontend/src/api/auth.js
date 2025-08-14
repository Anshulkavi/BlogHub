import api from './config';

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/login/', { email, password });
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
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
  const formData = new FormData();

  Object.keys(userData).forEach((key) => {
    if (userData[key] !== null && userData[key] !== undefined) {
      formData.append(key, userData[key]);
    }
  });

  const response = await api.patch('/profile/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
},

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  },
};
