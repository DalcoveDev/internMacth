import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create a simple function to get the API URL
const getApiUrl = () => {
  // Try to get from environment variables
  try {
    if (typeof window !== 'undefined' && (window as any).__env__?.VITE_API_URL) {
      return (window as any).__env__.VITE_API_URL;
    }
  } catch (e) {
    // Ignore error
  }
  
  // Try to get from import.meta.env - simplified access
  try {
    if (import.meta.env?.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
  } catch (e) {
    // Ignore error
  }
  
  // Fallback to default
  return 'http://localhost:5001/api';
};

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Set token in localStorage and axios headers
export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Clear token from localStorage and axios headers
export const clearAuthToken = () => {
  localStorage.removeItem('token');
  delete apiClient.defaults.headers.common['Authorization'];
};

// Auth API functions
export const authAPI = {
  // Register a new user
  register: async (userData: { name: string; email: string; password: string; role: string }): Promise<AxiosResponse> => {
    return apiClient.post('/auth/register', userData);
  },

  // Login user
  login: async (credentials: { email: string; password: string; role: string }): Promise<AxiosResponse> => {
    return apiClient.post('/auth/login', credentials);
  },

  // Get current user profile
  getProfile: async (): Promise<AxiosResponse> => {
    return apiClient.get('/auth/me');
  },

  // Update user profile
  updateProfile: async (userData: any): Promise<AxiosResponse> => {
    return apiClient.put('/auth/profile', userData);
  },

  // Change password
  changePassword: async (passwordData: { currentPassword: string; newPassword: string }): Promise<AxiosResponse> => {
    return apiClient.put('/auth/change-password', passwordData);
  },

  // Logout
  logout: async (): Promise<AxiosResponse> => {
    return apiClient.post('/auth/logout');
  },
};

// Notifications API functions
export const notificationsAPI = {
  // Get all notifications for the current user
  getAll: async (params?: { page?: number; limit?: number; unread_only?: boolean }): Promise<AxiosResponse> => {
    return apiClient.get('/notifications', { params });
  },

  // Mark a notification as read
  markAsRead: async (id: number): Promise<AxiosResponse> => {
    return apiClient.patch(`/notifications/${id}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<AxiosResponse> => {
    return apiClient.patch('/notifications/read-all');
  },

  // Clear all notifications
  clearAll: async (): Promise<AxiosResponse> => {
    return apiClient.delete('/notifications');
  },

  // Delete a specific notification
  delete: async (id: number): Promise<AxiosResponse> => {
    return apiClient.delete(`/notifications/${id}`);
  }
};

// Internships API functions
export const internshipsAPI = {
  // Get all internships with pagination and filters
  getAll: async (params?: { page?: number; limit?: number; location?: string; type?: string; search?: string }): Promise<AxiosResponse> => {
    return apiClient.get('/internships', { params });
  },

  // Get single internship by ID
  getById: async (id: number): Promise<AxiosResponse> => {
    return apiClient.get(`/internships/${id}`);
  },

  // Create new internship (company only)
  create: async (data: any): Promise<AxiosResponse> => {
    return apiClient.post('/internships', data);
  },

  // Update internship (company only)
  update: async (id: number, data: any): Promise<AxiosResponse> => {
    return apiClient.put(`/internships/${id}`, data);
  },

  // Delete internship (company only)
  delete: async (id: number): Promise<AxiosResponse> => {
    return apiClient.delete(`/internships/${id}`);
  },

  // Approve internship (admin only)
  approve: async (id: number): Promise<AxiosResponse> => {
    return apiClient.patch(`/internships/${id}/approve`);
  },

  // Reject internship (admin only)
  reject: async (id: number): Promise<AxiosResponse> => {
    return apiClient.patch(`/internships/${id}/reject`);
  },

  // Get pending internships (admin only)
  getPending: async (): Promise<AxiosResponse> => {
    return apiClient.get('/internships/admin/pending');
  }
};

// Applications API functions
export const applicationsAPI = {
  // Get applications for a student
  getStudentApplications: async (params?: { page?: number; limit?: number; status?: string }): Promise<AxiosResponse> => {
    return apiClient.get('/applications/student', { params });
  },

  // Get applications for a company's internships
  getCompanyApplications: async (params?: { page?: number; limit?: number; status?: string }): Promise<AxiosResponse> => {
    return apiClient.get('/applications/company', { params });
  },

  // Apply for an internship (student only)
  create: async (data: { 
    internship_id: number; 
    cover_letter: string; 
    skills?: string; 
    experience?: string; 
    education?: string; 
    portfolio_url?: string; 
    resume_url?: string; 
  }): Promise<AxiosResponse> => {
    return apiClient.post('/applications', data);
  },

  // Update application status (company/admin only)
  updateStatus: async (id: number, status: 'pending' | 'approved' | 'rejected'): Promise<AxiosResponse> => {
    return apiClient.patch(`/applications/${id}/status`, { status });
  }
};

// Users API functions
export const usersAPI = {
  // Get all users (admin only)
  getAll: async (params?: { page?: number; limit?: number; role?: string; status?: string }): Promise<AxiosResponse> => {
    return apiClient.get('/users', { params });
  },

  // Get dashboard statistics (admin only)
  getAdminStats: async (): Promise<AxiosResponse> => {
    return apiClient.get('/users/admin/stats');
  },

  // Update user (admin/company/student)
  update: async (id: number, data: any): Promise<AxiosResponse> => {
    return apiClient.put(`/users/${id}`, data);
  },

  // Delete user (admin only)
  delete: async (id: number): Promise<AxiosResponse> => {
    return apiClient.delete(`/users/${id}`);
  }
};

// Feedback API functions
export const feedbackAPI = {
  // Submit feedback
  submit: async (data: { type: 'positive' | 'negative'; message: string }): Promise<AxiosResponse> => {
    return apiClient.post('/feedback', data);
  }
};

// Contact API functions
export const contactAPI = {
  // Send contact message
  sendMessage: async (data: { name: string; email: string; subject: string; message: string }): Promise<AxiosResponse> => {
    return apiClient.post('/contact', data);
  }
};

// About API functions
export const aboutAPI = {
  // Get about page content
  getContent: async (): Promise<AxiosResponse> => {
    return apiClient.get('/about');
  }
};

// Services API functions
export const servicesAPI = {
  // Get services page content
  getContent: async (): Promise<AxiosResponse> => {
    return apiClient.get('/services');
  }
};

// Home API functions
export const homeAPI = {
  // Get home page content
  getContent: async (): Promise<AxiosResponse> => {
    return apiClient.get('/home');
  }
};

// Community API functions
export const communityAPI = {
  // Get all discussions
  getDiscussions: async (): Promise<AxiosResponse> => {
    return apiClient.get('/community/discussions');
  },

  // Get a single discussion by ID
  getDiscussionById: async (id: number): Promise<AxiosResponse> => {
    return apiClient.get(`/community/discussions/${id}`);
  },

  // Create a new discussion
  createDiscussion: async (data: { title: string; content: string; tags?: string[] }): Promise<AxiosResponse> => {
    return apiClient.post('/community/discussions', data);
  },

  // Update a discussion
  updateDiscussion: async (id: number, data: { title: string; content: string; tags?: string[] }): Promise<AxiosResponse> => {
    return apiClient.put(`/community/discussions/${id}`, data);
  },

  // Delete a discussion
  deleteDiscussion: async (id: number): Promise<AxiosResponse> => {
    return apiClient.delete(`/community/discussions/${id}`);
  },

  // Get all events
  getEvents: async (): Promise<AxiosResponse> => {
    return apiClient.get('/community/events');
  },

  // Get a single event by ID
  getEventById: async (id: number): Promise<AxiosResponse> => {
    return apiClient.get(`/community/events/${id}`);
  },

  // Create a new event
  createEvent: async (data: { 
    title: string; 
    description: string; 
    date: string; 
    time: string; 
    location: string; 
    type: string; 
  }): Promise<AxiosResponse> => {
    return apiClient.post('/community/events', data);
  },

  // Update an event
  updateEvent: async (id: number, data: { 
    title: string; 
    description: string; 
    date: string; 
    time: string; 
    location: string; 
    type: string; 
  }): Promise<AxiosResponse> => {
    return apiClient.put(`/community/events/${id}`, data);
  },

  // Delete an event
  deleteEvent: async (id: number): Promise<AxiosResponse> => {
    return apiClient.delete(`/community/events/${id}`);
  },

  // Get all achievements
  getAchievements: async (): Promise<AxiosResponse> => {
    return apiClient.get('/community/achievements');
  },

  // Get a single achievement by ID
  getAchievementById: async (id: number): Promise<AxiosResponse> => {
    return apiClient.get(`/community/achievements/${id}`);
  },

  // Create a new achievement (admin only)
  createAchievement: async (data: { title: string; description: string; icon: string }): Promise<AxiosResponse> => {
    return apiClient.post('/community/achievements', data);
  },

  // Update an achievement (admin only)
  updateAchievement: async (id: number, data: { title: string; description: string; icon: string }): Promise<AxiosResponse> => {
    return apiClient.put(`/community/achievements/${id}`, data);
  },

  // Delete an achievement (admin only)
  deleteAchievement: async (id: number): Promise<AxiosResponse> => {
    return apiClient.delete(`/community/achievements/${id}`);
  },

  // Award an achievement to a user (admin only)
  awardAchievement: async (data: { userId: number; achievementId: number }): Promise<AxiosResponse> => {
    return apiClient.post('/community/achievements/award', data);
  }
};

// Export the apiClient instance for other API calls
export default apiClient;