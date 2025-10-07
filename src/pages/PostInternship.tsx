import React, { useState, useEffect } from 'react';
import { postInternship } from '../api';
import { CheckCircleIcon, SaveIcon } from 'lucide-react';
import { useToast } from '../components/ToastProvider';

const PostInternship = () => {
  const { showError, showSuccess, showInfo } = useToast();
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
  
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
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
    const timeoutId = setTimeout(() => {
      if (formData.jobTitle || formData.companyName || formData.description) {
        setAutoSaveStatus('saving');
        localStorage.setItem('internship_draft', JSON.stringify(formData));
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus(''), 2000);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
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
    
    setIsSubmitting(true);
    
    try {
      // Get current user ID or default to 1
      const currentUserId = user.id || 1;
      
      // Submit to backend API with real-time data persistence
      const internshipData = {
        title: formData.jobTitle,
        company: formData.companyName,
        location: formData.location,
        description: formData.description,
        skills: formData.requirements,
        postedById: currentUserId,
        type: formData.type,
        duration: formData.duration,
        contactEmail: formData.contactEmail,
        companyWebsite: formData.companyWebsite,
        applicationDeadline: formData.applicationDeadline,
        applicationLink: formData.applicationLink
      };
      
      console.log('Submitting internship data:', internshipData);
      
      const result = await postInternship(internshipData);
      
      console.log('Internship posted successfully:', result);
      
      // Clear the draft from localStorage on successful submission
      localStorage.removeItem('internship_draft');
      
      showSuccess('Success!', 'Your internship has been posted successfully and saved to the database!');
      setIsSubmitted(true);
      
    } catch (err: any) {
      console.error('Failed to post internship:', err);
      
      // More detailed error handling
      if (err.message.includes('fetch')) {
        showError('Connection Error', 'Unable to connect to the server. Please check if the backend is running and try again.');
      } else if (err.message.includes('400')) {
        showError('Invalid Data', 'Please check your form data and try again.');
      } else if (err.message.includes('500')) {
        showError('Server Error', 'Internal server error. Please try again later.');
      } else {
        showError('Posting Failed', 'Failed to post internship. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mb-6">
            <CheckCircleIcon size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Internship Posted Successfully!
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Your internship has been submitted and will be reviewed by our team.
            You'll receive a confirmation email shortly.
          </p>
          <div className="flex justify-center">
            <button 
              onClick={() => setIsSubmitted(false)} 
              className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors"
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
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Post an Internship
      </h1>
      <p className="text-gray-600 mb-4">
        Connect with talented students by posting your internship opportunity
      </p>
      
      {/* Auto-save status indicator */}
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
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
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          {/* Company Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Company Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input 
                  type="text" 
                  id="companyName" 
                  name="companyName" 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" 
                  value={formData.companyName} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Website
                </label>
                <input 
                  type="url" 
                  id="companyWebsite" 
                  name="companyWebsite" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" 
                  value={formData.companyWebsite} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email *
                </label>
                <input 
                  type="email" 
                  id="contactEmail" 
                  name="contactEmail" 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" 
                  value={formData.contactEmail} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          {/* Internship Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Internship Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input 
                  type="text" 
                  id="jobTitle" 
                  name="jobTitle" 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" 
                  value={formData.jobTitle} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input 
                  type="text" 
                  id="location" 
                  name="location" 
                  required 
                  placeholder="City, State or Remote" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" 
                  value={formData.location} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select 
                  id="type" 
                  name="type" 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" 
                  value={formData.type} 
                  onChange={handleChange}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration *
                </label>
                <select 
                  id="duration" 
                  name="duration" 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" 
                  value={formData.duration} 
                  onChange={handleChange}
                >
                  <option value="3 months">3 months</option>
                  <option value="4 months">4 months</option>
                  <option value="6 months">6 months</option>
                  <option value="12 months">12 months</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description *
                </label>
                <textarea 
                  id="description" 
                  name="description" 
                  required 
                  rows={6} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" 
                  value={formData.description} 
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements *
                </label>
                <textarea 
                  id="requirements" 
                  name="requirements" 
                  required 
                  rows={4} 
                  placeholder="List skills and qualifications required for this position" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" 
                  value={formData.requirements} 
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Application Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 mb-1">
                  Application Deadline
                </label>
                <input 
                  type="date" 
                  id="applicationDeadline" 
                  name="applicationDeadline" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" 
                  value={formData.applicationDeadline} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label htmlFor="applicationLink" className="block text-sm font-medium text-gray-700 mb-1">
                  Application Link
                </label>
                <input 
                  type="url" 
                  id="applicationLink" 
                  name="applicationLink" 
                  placeholder="External link to apply (optional)" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" 
                  value={formData.applicationLink} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          {/* Terms and Submission */}
          <div className="mb-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input 
                  id="terms" 
                  name="terms" 
                  type="checkbox" 
                  required 
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" 
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  I agree to the terms and conditions
                </label>
                <p className="text-gray-500">
                  By submitting this form, you agree to our terms of service and
                  privacy policy.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting to Database...
                </>
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