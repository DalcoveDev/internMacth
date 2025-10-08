import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, signup as apiSignup } from '../api';

// User interface
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'company' | 'admin';
  status?: 'active' | 'inactive';
  createdAt?: string;
  avatar?: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string; role: string }) => Promise<void>;
  signup: (userData: { name: string; email: string; password: string; role: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
  checkAuth: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated
  const isAuthenticated = user !== null;

  // Initialize auth state from localStorage
  useEffect(() => {
    checkAuth();
  }, []);

  // Check authentication status
  const checkAuth = () => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (credentials: { email: string; password: string; role: string }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiLogin(credentials);
      
      // Extract user and token from response
      const { user: userData, token } = response;
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      // Update state
      setUser(userData);
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle different error scenarios
      if (error.message?.includes('429')) {
        setError('Too many requests. Please wait a moment and try again.');
        throw error;
      } else if (error.message?.includes('404') || error.message?.includes('Failed to fetch')) {
        // Backend not available - simulate login for demo
        const simulatedUser: User = {
          id: Date.now(),
          name: credentials.email.split('@')[0],
          email: credentials.email.toLowerCase(),
          role: credentials.role as 'student' | 'company' | 'admin',
          status: 'active',
          createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(simulatedUser));
        localStorage.setItem('token', 'demo_token_' + Date.now());
        setUser(simulatedUser);
        setError('Backend not available. You are in demo mode.');
      } else {
        setError('Invalid email or password. Please try again.');
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData: { name: string; email: string; password: string; role: string }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiSignup(userData);
      
      // Extract user and token from response
      const { user: newUser, token } = response;
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', token);
      
      // Update state
      setUser(newUser);
      
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Handle different error scenarios
      if (error.message?.includes('429')) {
        setError('Too many requests. Please wait a moment and try again.');
        throw error;
      } else if (error.message?.includes('404') || error.message?.includes('Failed to fetch')) {
        // Backend not available - simulate signup for demo
        const simulatedUser: User = {
          id: Date.now(),
          name: userData.name.trim(),
          email: userData.email.toLowerCase(),
          role: userData.role as 'student' | 'company' | 'admin',
          status: 'active',
          createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(simulatedUser));
        localStorage.setItem('token', 'demo_token_' + Date.now());
        setUser(simulatedUser);
        setError('Backend not available. You are in demo mode.');
      } else if (error.message?.includes('409') || error.message?.includes('already exists')) {
        setError('An account with this email already exists. Please login instead.');
        throw error;
      } else {
        setError('Signup failed. Please try again.');
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Clear any draft data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('application_draft_') || key.startsWith('internship_draft')) {
        localStorage.removeItem(key);
      }
    });
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Context value
  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    signup,
    logout,
    clearError,
    updateUser,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;