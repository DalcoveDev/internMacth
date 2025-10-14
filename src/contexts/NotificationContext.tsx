import React, { createContext, ReactNode } from 'react';
import { useRealtimeNotifications } from '../hooks/useRealtimeData';
import { toast } from '@/hooks/use-toast';

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
    
    // Show toast notification
    toast({
      title: newNotification.title,
      description: newNotification.message,
      variant: newNotification.priority === 'high' ? 'destructive' : 'default'
    });
  };

  // Remove a notification (hide it locally since backend doesn't support deletion)
  const removeNotification = (id: number) => {
    // In a real implementation with backend support, this would make an API call
    // For now, we'll just show a message that the notification is hidden locally
    toast({
      title: "Notification Hidden",
      description: `Notification #${id} has been hidden locally. Note that it may reappear on refresh.`,
    });
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