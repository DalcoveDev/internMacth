import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Send, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '../contexts/NotificationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SendNotification = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { addNotification } = useNotifications();
  
  const [notificationType, setNotificationType] = useState<'approval' | 'rejection'>('approval');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentName] = useState('John Doe'); // In a real app, this would come from the application data

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real application, this would connect to the backend
      // to send the notification to the student
      console.log(`Sending ${notificationType} notification to student ${studentName}`);
      console.log('Message:', message);
      
      // Add notification to the notification system
      addNotification({
        type: notificationType === 'approval' ? 'approval' : 'rejection',
        title: notificationType === 'approval' ? 'Application Approved!' : 'Application Update',
        message: message || (notificationType === 'approval' 
          ? `Congratulations! Your application has been approved.` 
          : `We regret to inform you that your application has been rejected.`),
        priority: 'high',
        actionUrl: `/application/${id}`
      });
      
      showSuccess(
        'Notification Sent', 
        `${notificationType === 'approval' ? 'Approval' : 'Rejection'} notification sent to ${studentName} successfully!`
      );
      
      // Navigate back to the company dashboard
      setTimeout(() => {
        navigate('/company-dashboard');
      }, 1500);
    } catch (error) {
      console.error('Failed to send notification:', error);
      showError('Error', 'Failed to send notification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url('/images/Download Abstract green papercut style layers background for free.jpeg')` }}
      ></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="bg-card shadow-lg rounded-xl overflow-hidden border border-border transition-all duration-300 hover:shadow-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Send Notification</h1>
                <p className="mt-2 text-primary-foreground/90">
                  Notify student about their application status
                </p>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/company-dashboard')}
                className="text-primary-foreground hover:bg-primary/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Application Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6 p-4 bg-muted rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground">Software Development Intern</h3>
                    <p className="text-muted-foreground">Applied by {studentName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Pending
                    </span>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Notification Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setNotificationType('approval')}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          notificationType === 'approval'
                            ? 'border-green-500 bg-green-50'
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <CheckCircle 
                            size={24} 
                            className={`mb-2 ${
                              notificationType === 'approval' ? 'text-green-600' : 'text-muted-foreground'
                            }`} 
                          />
                          <span className={`font-medium ${
                            notificationType === 'approval' ? 'text-green-700' : 'text-foreground'
                          }`}>
                            Approval
                          </span>
                          <p className="text-xs text-muted-foreground mt-1 text-center">
                            Notify student that their application is approved
                          </p>
                        </div>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setNotificationType('rejection')}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          notificationType === 'rejection'
                            ? 'border-red-500 bg-red-50'
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <XCircle 
                            size={24} 
                            className={`mb-2 ${
                              notificationType === 'rejection' ? 'text-red-600' : 'text-muted-foreground'
                            }`} 
                          />
                          <span className={`font-medium ${
                            notificationType === 'rejection' ? 'text-red-700' : 'text-foreground'
                          }`}>
                            Rejection
                          </span>
                          <p className="text-xs text-muted-foreground mt-1 text-center">
                            Notify student that their application is rejected
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Custom Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                      placeholder={
                        notificationType === 'approval'
                          ? `Congratulations ${studentName}! We're pleased to inform you that your application has been approved...`
                          : `Dear ${studentName}, thank you for your interest in our internship program. After careful consideration...`
                      }
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {notificationType === 'approval'
                        ? 'Include details about next steps, start date, or onboarding process.'
                        : 'Be professional and considerate in your feedback.'}
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/company-dashboard')}
                      className="transition-all duration-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary hover:bg-primary/90 transition-all duration-300 flex items-center"
                    >
                      <Send size={16} className="mr-2" />
                      {isSubmitting ? 'Sending...' : 'Send Notification'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Notification Preview</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      {notificationType === 'approval'
                        ? `Student will receive: "Congratulations! Your application has been approved."`
                        : `Student will receive: "We regret to inform you that your application has been rejected."`}
                    </p>
                    {message && (
                      <p className="mt-1">
                        With your custom message: "{message}"
                      </p>
                    )}
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

export default SendNotification;