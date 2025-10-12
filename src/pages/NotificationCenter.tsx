import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bell, 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileText, 
  Briefcase, 
  User, 
  Trash2, 
  Check
} from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const NotificationCenter = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications,
    removeNotification
  } = useNotifications();
  
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'rejection':
        return <XCircle size={16} className="text-red-500" />;
      case 'application_update':
        return <FileText size={16} className="text-blue-500" />;
      case 'new_internship':
        return <Briefcase size={16} className="text-purple-500" />;
      case 'message':
        return <User size={16} className="text-yellow-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'approval':
        return 'border-l-green-500';
      case 'rejection':
        return 'border-l-red-500';
      case 'application_update':
        return 'border-l-blue-500';
      case 'new_internship':
        return 'border-l-purple-500';
      case 'message':
        return 'border-l-yellow-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    clearNotifications();
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url('/images/Download Abstract green papercut style layers background for free.jpeg')` }}
      ></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Button 
          onClick={() => navigate(-1)} 
          variant="ghost"
          className="flex items-center mb-6 text-primary hover:bg-accent"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back
        </Button>
        
        <div className="bg-card shadow-lg rounded-xl overflow-hidden border border-border">
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="mt-2 text-primary-foreground/90">
                  {unreadCount > 0 
                    ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` 
                    : 'All caught up! No new notifications.'}
                </p>
              </div>
              <Bell size={32} className="text-primary-foreground/80" />
            </div>
          </div>
          
          <div className="p-6">
            {/* Notification Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex space-x-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={filter === 'unread' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('unread')}
                >
                  Unread
                </Button>
                <Button
                  variant={filter === 'read' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('read')}
                >
                  Read
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <Check size={16} className="mr-1" />
                  Mark All Read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={notifications.length === 0}
                >
                  <Trash2 size={16} className="mr-1" />
                  Clear All
                </Button>
              </div>
            </div>
            
            {/* Notification List */}
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card className="border border-border">
                  <CardContent className="p-8 text-center">
                    <Bell size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No notifications found
                    </h3>
                    <p className="text-muted-foreground">
                      {filter === 'unread' 
                        ? "You're all caught up! No unread notifications." 
                        : "You don't have any notifications matching this filter."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`border border-border ${!notification.read ? 'bg-muted/50' : ''} ${getNotificationColor(notification.type)}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h3 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </h3>
                            <div className="flex space-x-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Check size={14} />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeNotification(notification.id)}
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center mt-2">
                            <Clock size={12} className="text-muted-foreground mr-1" />
                            <span className="text-xs text-muted-foreground">
                              {formatTime(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            
            {/* Notification Summary */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">
                    {notifications.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Notifications
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">
                    {unreadCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Unread
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">
                    {notifications.length - unreadCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Read
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;