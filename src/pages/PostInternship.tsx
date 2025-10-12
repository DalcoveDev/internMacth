import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, SaveIcon } from 'lucide-react';
import { useToast } from '../components/ToastProvider';
import { useAuth } from '../contexts/AuthContext';
import { postInternship } from '../api';

const PostInternship = () => {
  const { showError, showSuccess, showInfo } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    companyName: '',
    companyWebsite: '',
    contactEmail: '',
    jobTitle: '',
    location: '',
    type: 'Full-time',
    duration: '3 months',
    description: '',
    requirements: '',
    applicationDeadline: '',
    applicationLink: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | ''>('');

  // Auto-save draft functionality
  useEffect(() => {
    // Load saved draft on component mount
    const savedDraft = localStorage.getItem('internship_draft');
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
      showInfo('Draft Loaded', 'Your previous draft has been loaded');
    }
  }, [showInfo]);

  // Auto-save form data to localStorage
  useEffect(() => {
    if (formData.jobTitle || formData.companyName || formData.description) {
      const timeoutId = setTimeout(() => {
        setAutoSaveStatus('saving');
        localStorage.setItem('internship_draft', JSON.stringify(formData));
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus(''), 2000);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!formData.jobTitle.trim()) {
      showError('Missing Information', 'Job title is required');
      return;
    }
    
    if (!formData.companyName.trim()) {
      showError('Missing Information', 'Company name is required');
      return;
    }
    
    if (!formData.contactEmail.trim()) {
      showError('Missing Information', 'Contact email is required');
      return;
    }
    
    if (!formData.description.trim()) {
      showError('Missing Information', 'Job description is required');
      return;
    }
    
    if (!formData.requirements.trim()) {
      showError('Missing Information', 'Requirements are required');
      return;
    }
    
    // Check if user is authenticated
    if (!user) {
      showError('Authentication Required', 'Please log in to post an internship.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for API call
      const internshipData = {
        title: formData.jobTitle,
        company: formData.companyName,
        companyWebsite: formData.companyWebsite,
        location: formData.location,
        type: formData.type,
        duration: formData.duration,
        deadline: formData.applicationDeadline,
        applicationLink: formData.applicationLink,
        description: formData.description,
        skills: formData.requirements,
        contactEmail: formData.contactEmail,
        postedById: user.id,
        postedBy: {
          email: formData.contactEmail
        }
      };
      
      // Call the actual API to post the internship
      const response = await postInternship(internshipData);
      console.log('Internship posted successfully:', response);
      
      // Clear the draft from localStorage on successful submission
      localStorage.removeItem('internship_draft');
      
      showSuccess('Success!', 'Your internship has been posted successfully!');
      setIsSubmitted(true);
      
    } catch (err: any) {
      console.error('Failed to post internship:', err);
      showError('Posting Failed', 'Failed to post internship. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-card p-8 rounded-lg shadow-md text-center border">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mb-6">
            <CheckCircleIcon size={32} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Internship Posted Successfully!
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Your internship has been submitted and will be reviewed by our team.
            You'll receive a confirmation email shortly.
          </p>
          <div className="flex justify-center">
            <button 
              onClick={() => setIsSubmitted(false)} 
              className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              Post Another Internship
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Post an Internship
      </h1>
      <p className="text-muted-foreground mb-4">
        Connect with talented students by posting your internship opportunity
      </p>
      
      {/* Auto-save status indicator */}
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {autoSaveStatus === 'saving' && (
            <span className="flex items-center text-blue-600">
              <SaveIcon size={16} className="mr-1 animate-pulse" />
              Saving draft...
            </span>
          )}
          {autoSaveStatus === 'saved' && (
            <span className="flex items-center text-green-600">
              <CheckCircleIcon size={16} className="mr-1" />
              Draft saved
            </span>
          )}
          {autoSaveStatus === 'error' && (
            <span className="flex items-center text-red-600">
              ❌ Failed to save draft
            </span>
          )}
        </div>
        <div className="text-sm text-emerald-600">
          ✨ Your progress is automatically saved
        </div>
      </div>
      <div className="bg-card p-6 rounded-lg shadow-md border">
        <form onSubmit={handleSubmit}>
          {/* Company Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Company Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-foreground mb-1">
                  Company Name *
                </label>
                <input 
                  type="text" 
                  id="companyName" 
                  name="companyName" 
                  required 
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background text-foreground" 
                  value={formData.companyName} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label htmlFor="companyWebsite" className="block text-sm font-medium text-foreground mb-1">
                  Company Website
                </label>
                <input 
                  type="url" 
                  id="companyWebsite" 
                  name="companyWebsite" 
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background text-foreground" 
                  value={formData.companyWebsite} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-foreground mb-1">
                  Contact Email *
                </label>
                <input 
                  type="email" 
                  id="contactEmail" 
                  name="contactEmail" 
                  required 
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background text-foreground" 
                  value={formData.contactEmail} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          {/* Internship Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Internship Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-foreground mb-1">
                  Job Title *
                </label>
                <input 
                  type="text" 
                  id="jobTitle" 
                  name="jobTitle" 
                  required 
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background text-foreground" 
                  value={formData.jobTitle} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1">
                  Location *
                </label>
                <input 
                  type="text" 
                  id="location" 
                  name="location" 
                  required 
                  placeholder="City, State or Remote" 
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background text-foreground" 
                  value={formData.location} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-foreground mb-1">
                  Type *
                </label>
                <select 
                  id="type" 
                  name="type" 
                  required 
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background text-foreground" 
                  value={formData.type} 
                  onChange={handleChange}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-foreground mb-1">
                  Duration *
                </label>
                <select 
                  id="duration" 
                  name="duration" 
                  required 
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background text-foreground" 
                  value={formData.duration} 
                  onChange={handleChange}
                >
                  <option value="1 month">1 month</option>
                  <option value="2 months">2 months</option>
                  <option value="3 months">3 months</option>
                  <option value="4 months">4 months</option>
                  <option value="6 months">6 months</option>
                  <option value="Summer">Summer</option>
                  <option value="Fall">Fall</option>
                  <option value="Spring">Spring</option>
                </select>
              </div>
              <div>
                <label htmlFor="applicationDeadline" className="block text-sm font-medium text-foreground mb-1">
                  Application Deadline
                </label>
                <input 
                  type="date" 
                  id="applicationDeadline" 
                  name="applicationDeadline" 
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background text-foreground" 
                  value={formData.applicationDeadline} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label htmlFor="applicationLink" className="block text-sm font-medium text-foreground mb-1">
                  Application Link
                </label>
                <input 
                  type="url" 
                  id="applicationLink" 
                  name="applicationLink" 
                  placeholder="https://..." 
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background text-foreground" 
                  value={formData.applicationLink} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Job Description
            </h2>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
                Description *
              </label>
              <textarea 
                id="description" 
                name="description" 
                required 
                rows={6} 
                className="w-full px-4 py-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background text-foreground" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Describe the internship position, responsibilities, and what students will learn..."
              ></textarea>
            </div>
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-foreground mb-1">
                Requirements *
              </label>
              <textarea 
                id="requirements" 
                name="requirements" 
                required 
                rows={4} 
                className="w-full px-4 py-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background text-foreground" 
                value={formData.requirements} 
                onChange={handleChange} 
                placeholder="List the skills, qualifications, and experience required for this position..."
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`px-6 py-3 text-primary-foreground font-medium rounded-md transition-colors ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Posting...
                </div>
              ) : (
                'Post Internship'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostInternship;