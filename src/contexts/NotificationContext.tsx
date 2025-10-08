import React, { createContext, ReactNode } from 'react';
import { useRealtimeNotifications } from '../hooks/useRealtimeData';

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
export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: number) => void;
}

// Create context - exported for use in the hook
export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Notification provider component
interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
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

  // For now, we'll just pass through the notifications from useRealtimeNotifications
  // In a real implementation, you might want to enhance them based on user role
  const enhancedNotifications = notifications;

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

// Custom hook to use notification context
const useNotifications = () => {
  const context = React.useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export { NotificationProvider, useNotifications };