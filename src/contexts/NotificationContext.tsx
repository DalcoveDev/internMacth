import React, { createContext, useContext, ReactNode } from 'react';
import { useRealtimeNotifications } from '../hooks/useRealtimeData';
import { useAuth } from './AuthContext';

// Notification interface
export interface Notification {
  id: number;
  type: 'application_update' | 'new_internship' | 'message' | 'system' | 'approval' | 'rejection';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  metadata?: Record<string, any>;
}

// Notification context interface
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: number) => void;
}

// Create context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Custom hook to use notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Notification provider component
interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  } = useRealtimeNotifications();

  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      timestamp: new Date(),
      read: false
    };
    
    // In a real implementation, this would add to the notifications array
    console.log('New notification:', newNotification);
  };

  // Remove a notification
  const removeNotification = (id: number) => {
    // In a real implementation, this would remove from the notifications array
    console.log('Remove notification:', id);
  };

  // Enhanced notifications based on user role and actions
  const enhancedNotifications = notifications.map(notification => {
    // Add role-specific metadata
    if (user) {
      switch (user.role) {
        case 'student':
          if (notification.type === 'application_update') {
            return {
              ...notification,
              priority: 'high' as const,
              actionUrl: '/student-dashboard'
            };
          }
          break;
        case 'company':
          if (notification.type === 'new_internship') {
            return {
              ...notification,
              priority: 'medium' as const,
              actionUrl: '/company-dashboard'
            };
          }
          break;
        case 'admin':
          return {
            ...notification,
            priority: 'high' as const,
            actionUrl: '/admin-dashboard'
          };
      }
    }
    return notification;
  });

  const value: NotificationContextType = {
    notifications: enhancedNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addNotification,
    removeNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;