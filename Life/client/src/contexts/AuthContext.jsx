import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Changed: Import configured api instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      // Changed: Set header on the api instance
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  // Load user from token
  const loadUser = async () => {
    try {
      setAuthToken(token);
      // Changed: Use api.get and remove '/api' prefix (it's in baseURL)
      const res = await api.get('/me');
      setUser(res.data);
    } catch (err) {
      console.error('Error loading user', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (formData) => {
    try {
      setError(null);
      // Changed: Use api.post and remove '/api' prefix
      const res = await api.post('/register', formData);
      const {QB, ...userData } = res.data; // Note: res.data structure depends on backend. Assuming standard here.
      // Actually, your backend sends { _id, name, email, role, token }
      // We should extract token and user data correctly.
      
      // Based on your authController.js:
      const { token, ...user } = res.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setAuthToken(token);
      setUser(user);
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false };
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      setError(null);
      // Changed: Use api.post and remove '/api' prefix
      const res = await api.post('/login', formData);
      const { token, ...userData } = res.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setAuthToken(token);
      setUser(userData);
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAuthToken(null);
    navigate('/login');
  };

  // Check for token on initial load
  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;