import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in by retrieving token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      // Set the authorization header for the request
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.get('/api/users/me', config);
      setCurrentUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to fetch user profile');
      // If there's an error, remove the invalid token
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/token', {
        username: email,
        password: password
      });
      
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      
      // After getting the token, fetch the user profile
      await fetchUserProfile(access_token);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Failed to login');
      setLoading(false);
      return { success: false, error: err.response?.data?.detail || 'Failed to login' };
    }
  };

  const register = async (username, email, password) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/users/register', {
        username,
        email,
        password
      });
      
      // After successful registration, log the user in
      return await login(email, password);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.detail || 'Failed to register');
      setLoading(false);
      return { success: false, error: err.response?.data?.detail || 'Failed to register' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 