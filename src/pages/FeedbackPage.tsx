import React, { useState } from 'react';
import { Mail, MessageCircle, ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import { feedbackAPI } from '../lib/new-api-client';
import { toast } from '@/hooks/use-toast';

const FeedbackPage = () => {
  const [feedbackType, setFeedbackType] = useState<'positive' | 'negative' | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackType) {
      toast({
        title: "Error",
        description: "Please select a feedback type",
        variant: "destructive",
      });
      return;
    }
    
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter your feedback message",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await feedbackAPI.submit({ type: feedbackType, message });
      setIsSubmitted(true);
      
      toast({
        title: "Success",
        description: "Thank you for your feedback!",
      });
      
      // Reset form after submission
      setTimeout(() => {
        setFeedbackType(null);
        setMessage('');
        setIsSubmitted(false);
      }, 3000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error?.message || 'Failed to submit feedback',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card p-8 rounded-lg shadow-md border max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mb-6">
            <Send size={32} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Thank You for Your Feedback!
          </h2>
          <p className="text-muted-foreground mb-6">
            We appreciate you taking the time to share your thoughts with us.
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card p-8 rounded-lg shadow-md border max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">We Value Your Feedback</h1>
          <p className="text-muted-foreground">
            Help us improve by sharing your experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              How was your experience?
            </label>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => setFeedbackType('positive')}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-colors ${
                  feedbackType === 'positive'
                    ? 'border-primary bg-primary/10'
                    : 'border-input hover:border-primary/50'
                }`}
              >
                <ThumbsUp className="h-8 w-8 text-green-500 mb-2" />
                <span className="text-foreground">Positive</span>
              </button>
              <button
                type="button"
                onClick={() => setFeedbackType('negative')}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-colors ${
                  feedbackType === 'negative'
                    ? 'border-primary bg-primary/10'
                    : 'border-input hover:border-primary/50'
                }`}
              >
                <ThumbsDown className="h-8 w-8 text-red-500 mb-2" />
                <span className="text-foreground">Negative</span>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
              Your Feedback
            </label>
            <textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please share your thoughts, suggestions, or issues you encountered..."
              className="w-full px-4 py-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background text-foreground"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-6 py-3 font-medium rounded-md transition-colors ${
                isSubmitting 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
            Contact Us Directly
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="mailto:ingabiredalcove@gmail.com"
              className="flex flex-col items-center p-4 rounded-lg border border-input hover:border-primary transition-colors"
            >
              <Mail className="h-6 w-6 text-primary mb-2" />
              <span className="text-foreground text-sm">Email</span>
              <span className="text-xs text-muted-foreground mt-1">ingabiredalcove@gmail.com</span>
            </a>
            <a
              href="https://wa.me/794289360"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-4 rounded-lg border border-input hover:border-primary transition-colors"
            >
              <MessageCircle className="h-6 w-6 text-primary mb-2" />
              <span className="text-foreground text-sm">WhatsApp</span>
              <span className="text-xs text-muted-foreground mt-1">+250 794 289 360</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;