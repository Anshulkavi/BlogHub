import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';
import api from '../api/config'; // 👈 Import axios instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Set the header for the initial user fetch
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await authAPI.getUser();
      setUser(userData);
    } catch (error) {
      // If token is invalid, perform a full logout
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    // Set header for new session
    api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
    await fetchUser();
    return data;
  };

  const register = async (userData) => {
    const data = await authAPI.register(userData);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    // Set header for new session
    api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
    await fetchUser(); // Automatically log in
    return data;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete api.defaults.headers.common['Authorization']; // ✨ Clear header
    setUser(null);
    window.location.href = '/login'; // ✨ Redirect
  };

  const updateProfile = async (userData) => {
    const updatedUser = await authAPI.updateProfile(userData);
    setUser(updatedUser);
    return updatedUser;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user, // Bonus: Add a convenient boolean flag
      login,
      register,
      logout,
      updateProfile,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};