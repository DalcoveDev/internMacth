import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { authAPI, setAuthToken, clearAuthToken } from '@/lib/new-api-client';

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
  const checkAuth = async () => {
    try {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        // Set token in API client
        setAuthToken(storedToken);
        
        // Verify token by getting user profile
        const response = await authAPI.getProfile();
        setUser(response.data.data.user);
      }
    } catch (error: any) {
      console.error('Error verifying authentication:', error);
      // Clear invalid token
      clearAuthToken();
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (credentials: { email: string; password: string; role: string }) => {
    try {
      setLoading(true);
      setError(null);

      // Enhanced validation
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      if (!credentials.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (credentials.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Call real API
      const response = await authAPI.login(credentials);
      
      // Set token in API client
      setAuthToken(response.data.data.token);
      
      // Update state
      setUser(response.data.data.user);
      
      // Show success toast
      toast({
        title: "Login Successful",
        description: `Welcome back, ${response.data.data.user.name}!`,
      });
      
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      // More detailed error handling
      if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      // Show error toast
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData: { name: string; email: string; password: string; role: string }) => {
    try {
      setLoading(true);
      setError(null);

      // Enhanced validation
      if (!userData.name?.trim() || !userData.email?.trim() || !userData.password) {
        throw new Error('All fields are required');
      }

      if (userData.name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }

      if (!userData.email.includes('@') || !userData.email.includes('.')) {
        throw new Error('Please enter a valid email address');
      }

      if (userData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Check password strength
      const hasNumber = /\d/.test(userData.password);
      const hasLetter = /[a-zA-Z]/.test(userData.password);
      if (!hasNumber || !hasLetter) {
        throw new Error('Password must contain both letters and numbers');
      }

      // Call real API
      const response = await authAPI.register(userData);
      
      // Set token in API client
      setAuthToken(response.data.data.token);
      
      // Update state
      setUser(response.data.data.user);
      
      // Show success toast
      toast({
        title: "Account Created",
        description: "Your account has been successfully created!",
      });
      
    } catch (error: any) {
      console.error('Signup error:', error);
      let errorMessage = 'Signup failed. Please try again.';
      
      // More detailed error handling
      if (error.response?.status === 400) {
        if (error.response.data?.error?.details) {
          // Validation errors
          errorMessage = error.response.data.error.details.map((err: any) => err.msg).join(', ');
        } else if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        } else {
          errorMessage = 'Invalid input data. Please check your information.';
        }
      } else if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      // Show error toast
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setError(null);
    clearAuthToken();
    
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