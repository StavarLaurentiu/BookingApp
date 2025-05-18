// src/contexts/AdminContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminToken, setAdminToken] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  // Check for existing admin session on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (token && user) {
      setAdminToken(token);
      setAdminUser(JSON.parse(user));
      setIsAdminLoggedIn(true);
      
      // Verify token is still valid
      verifyAdminToken(token);
    }
  }, []);

  const verifyAdminToken = async (token) => {
    // Skip verification for development tokens
    if (token && token.startsWith('dev-admin-token-')) {
      console.log('Development token verified');
      return true;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/verify/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Token verification failed');
      }
      
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
      return false;
    }
  };

  const login = async (username, password) => {
    // Development bypass for testing
    if (username === 'admin' && password === 'admin') {
      // Simulate successful login with mock data
      const mockToken = 'dev-admin-token-' + Date.now();
      const mockUser = {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        isAdmin: true
      };
      
      setAdminToken(mockToken);
      setAdminUser(mockUser);
      setIsAdminLoggedIn(true);
      
      // Store in localStorage
      localStorage.setItem('adminToken', mockToken);
      localStorage.setItem('adminUser', JSON.stringify(mockUser));
      
      console.log('Development login successful');
      return { success: true };
    }

    // Regular API call for production
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      setAdminToken(data.token);
      setAdminUser(data.user);
      setIsAdminLoggedIn(true);
      
      // Store in localStorage
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      if (adminToken) {
        await fetch('http://127.0.0.1:8000/auth/logout/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state and localStorage regardless of API call success
      setIsAdminLoggedIn(false);
      setAdminToken(null);
      setAdminUser(null);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
  };

  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    };
  };

  const value = {
    isAdminLoggedIn,
    adminToken,
    adminUser,
    login,
    logout,
    getAuthHeaders,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};