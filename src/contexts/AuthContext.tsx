import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

  // Mock login function
  const login = async (credentials: { email: string; password: string; role: string }) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Create mock user data
      const mockUser: User = {
        id: Date.now(),
        name: credentials.email.split('@')[0],
        email: credentials.email.toLowerCase(),
        role: credentials.role as 'student' | 'company' | 'admin',
        status: 'active',
        createdAt: new Date().toISOString()
      };

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock_token_' + Date.now());
      
      // Update state
      setUser(mockUser);
      
    } catch (error: any) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock signup function
  const signup = async (userData: { name: string; email: string; password: string; role: string }) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create mock user data
      const mockUser: User = {
        id: Date.now(),
        name: userData.name.trim(),
        email: userData.email.toLowerCase(),
        role: userData.role as 'student' | 'company' | 'admin',
        status: 'active',
        createdAt: new Date().toISOString()
      };

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock_token_' + Date.now());
      
      // Update state
      setUser(mockUser);
      
    } catch (error: any) {
      console.error('Signup error:', error);
      setError('Signup failed. Please try again.');
      throw error;
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