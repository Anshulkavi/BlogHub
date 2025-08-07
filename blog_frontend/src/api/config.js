import axios from 'axios';

// Vite environment variables ko import.meta.env se access karta hai
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          // 👇 YAHAN PAR GALTI THI. '/auth' HATA DIYA GAYA HAI. 👇
          const response = await axios.post(`${API_BASE_URL}token/refresh/`, {
            refresh: refreshToken
          });

          localStorage.setItem('access_token', response.data.access);
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`; // Yeh line bhi add kar lein
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError); // Error ko reject karna best practice hai
        }
      } else {
          // Agar refresh token hi nahi hai toh logout kar do
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;