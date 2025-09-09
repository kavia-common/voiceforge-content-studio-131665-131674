import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// PUBLIC_INTERFACE
/**
 * Hook to access the authentication context
 * @returns {Object} Authentication context value with user, login, logout, and loading state
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// PUBLIC_INTERFACE
/**
 * Authentication provider component that manages user authentication state
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock user for development - replace with actual authentication logic
  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      // For development, create a mock user
      const mockUser = {
        id: '1',
        email: 'demo@voiceforge.com',
        name: 'Demo User',
        subscription: {
          tier: 'pro',
          usage: {
            minutes: 150,
            limit: 500
          }
        }
      };
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  }, []);

  // PUBLIC_INTERFACE
  /**
   * Login function (mock implementation)
   * @param {string} email - User email
   * @param {string} password - User password
   */
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Mock login - replace with actual API call
      const mockUser = {
        id: '1',
        email: email,
        name: 'Demo User',
        subscription: {
          tier: 'pro',
          usage: {
            minutes: 150,
            limit: 500
          }
        }
      };
      setUser(mockUser);
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Logout function
   */
  const logout = () => {
    setUser(null);
    setError(null);
  };

  // PUBLIC_INTERFACE
  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    login,
    logout,
    loading,
    error,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
