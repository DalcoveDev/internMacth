import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { notificationsAPI } from '@/lib/new-api-client';

// Types for different data types we sync
export interface SyncOptions {
  interval?: number; // Refresh interval in milliseconds (default: 30000)
  autoRefresh?: boolean; // Enable/disable auto refresh (default: true)
  retries?: number; // Number of retries on failure (default: 3)
  dependencies?: any[]; // Dependencies that trigger refresh
}

// Real-time data synchronization hook
export const useRealtimeData = <T>(
  fetchFunction: () => Promise<T>,
  initialData: T,
  options: SyncOptions = {}
) => {
  const {
    interval = 30000,
    autoRefresh = true,
    retries = 3,
    dependencies = []
  } = options;

  const { user } = useAuth();
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const retryCountRef = useRef(0);
  const intervalRef = useRef<number | null>(null);

  // Fetch data function with retry logic
  const fetchData = useCallback(async (isRetry = false) => {
    if (!isRetry) {
      setLoading(true);
      setError(null);
    }

    try {
      const result = await fetchFunction();
      setData(result);
      setError(null);
      setLastUpdated(new Date());
      retryCountRef.current = 0;
    } catch (err: any) {
      console.error('Data fetch error:', err);
      
      if (retryCountRef.current < retries) {
        retryCountRef.current++;
        setTimeout(() => fetchData(true), 1000 * retryCountRef.current);
      } else {
        setError(err.message || 'Failed to fetch data');
        retryCountRef.current = 0;
      }
    } finally {
      if (!isRetry) {
        setLoading(false);
      }
    }
  }, [fetchFunction, retries]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Set up auto refresh
  useEffect(() => {
    if (autoRefresh && user) {
      fetchData();
      
      if (interval > 0) {
        intervalRef.current = window.setInterval(() => {
          fetchData(true); // Silent refresh
        }, interval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user, autoRefresh, interval, fetchData, ...dependencies]);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    isStale: lastUpdated ? Date.now() - lastUpdated.getTime() > interval : true
  };
};

// Hook for syncing form data to localStorage with debouncing
export const useFormSync = <T>(
  key: string,
  initialData: T,
  debounceMs: number = 1000
) => {
  const [data, setData] = useState<T>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const timeoutRef = useRef<number | null>(null);

  // Load initial data from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsedData = JSON.parse(stored);
        setData({ ...initialData, ...parsedData });
      }
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  }, [key, initialData]);

  // Save data to localStorage with debouncing
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsSaving(true);
      try {
        localStorage.setItem(key, JSON.stringify(data));
        setLastSaved(new Date());
      } catch (error) {
        console.error('Error saving form data:', error);
      } finally {
        setIsSaving(false);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, key, debounceMs]);

  const updateField = useCallback((field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateData = useCallback((newData: Partial<T>) => {
    setData(prev => ({ ...prev, ...newData }));
  }, []);

  const clearData = useCallback(() => {
    localStorage.removeItem(key);
    setData(initialData);
    setLastSaved(null);
  }, [key, initialData]);

  return {
    data,
    updateField,
    updateData,
    clearData,
    isSaving,
    lastSaved,
    isStale: lastSaved ? Date.now() - lastSaved.getTime() > 60000 : false // 1 minute
  };
};

// Hook for real-time notifications
export const useRealtimeNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch real notifications
  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      const response = await notificationsAPI.getAll();
      // Fix: Access the correct data structure from the API response
      const notificationsData = response.data.data?.notifications || [];
      const fetchedNotifications = notificationsData.map((notification: any) => ({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        timestamp: new Date(notification.created_at),
        read: notification.is_read,
        priority: notification.priority,
        actionUrl: notification.action_url,
        metadata: notification.metadata
      }));
      
      setNotifications(fetchedNotifications);
      // Fix: Use the unreadCount from the API response
      const unreadCount = response.data.data?.unreadCount || 0;
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    if (!user) return;

    // Fetch notifications immediately
    fetchNotifications();

    // Set up polling for new notifications
    const interval = window.setInterval(fetchNotifications, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const markAsRead = useCallback(async (id: number) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, []);

  const clearNotifications = useCallback(async () => {
    try {
      await notificationsAPI.clearAll();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };
};

// Hook for application state management with persistence
export const useApplicationState = () => {
  const { user } = useAuth();
  const [globalState, setGlobalState] = useState<Record<string, any>>({});

  // Load state from localStorage on user change
  useEffect(() => {
    if (user && user.id) {
      try {
        const stored = localStorage.getItem(`app_state_${user.id}`);
        if (stored) {
          setGlobalState(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading application state:', error);
      }
    }
  }, [user]);

  // Save state to localStorage
  useEffect(() => {
    if (user && user.id && Object.keys(globalState).length > 0) {
      try {
        localStorage.setItem(`app_state_${user.id}`, JSON.stringify(globalState));
      } catch (error) {
        console.error('Error saving application state:', error);
      }
    }
  }, [globalState, user]);

  const setState = useCallback((key: string, value: any) => {
    setGlobalState(prev => ({ ...prev, [key]: value }));
  }, []);

  const getState = useCallback((key: string, defaultValue: any = null) => {
    return globalState[key] ?? defaultValue;
  }, [globalState]);

  const clearState = useCallback((key?: string) => {
    if (key) {
      setGlobalState(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
    } else {
      setGlobalState({});
      if (user) {
        localStorage.removeItem(`app_state_${user.id}`);
      }
    }
  }, [user]);

  return {
    setState,
    getState,
    clearState,
    globalState
  };
};

export default useRealtimeData;