import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, SaveIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { internshipsAPI } from '@/lib/new-api-client';
// Backend integration removed - using mock data

const PostInternship = () => {
  const { toast } = useToast();
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
    responsibilities: '',
    benefits: '',
    applicationDeadline: '',
    applicationLink: '',
    startDate: '',
    endDate: '',
    salaryMin: '',
    salaryMax: '',
    salaryType: 'hourly',
    skills: '',
    experienceLevel: 'entry'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | ''>('');

  // Helper functions for showing toast notifications
  const showError = (title: string, description: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  };

  const showSuccess = (title: string, description: string) => {
    toast({
      title,
      description,
    });
  };

  const showInfo = (title: string, description: string) => {
    toast({
      title,
      description,
    });
  };

  // Auto-save draft functionality
  useEffect(() => {
    // Load saved draft on component mount
    const savedDraft = localStorage.getItem('internship_draft');
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
      showInfo('Draft Loaded', 'Your previous draft has been loaded');
    }
  }, []);

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
    if (!user) {
      showError('Authentication Required', 'You must be logged in to post an internship.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the data to match backend requirements
      const internshipData = {
        title: formData.jobTitle,
        description: formData.description,
        requirements: formData.requirements,
        responsibilities: formData.responsibilities,
        benefits: formData.benefits,
        location: formData.location,
        type: formData.type.toLowerCase(), // Backend expects lowercase
        duration: formData.duration,
        deadline: formData.applicationDeadline,
        start_date: formData.startDate || null,
        end_date: formData.endDate || null,
        salary_min: formData.salaryMin ? parseFloat(formData.salaryMin) : null,
        salary_max: formData.salaryMax ? parseFloat(formData.salaryMax) : null,
        salary_type: formData.salaryType || null,
        skills_required: formData.skills || null,
        experience_level: formData.experienceLevel || 'entry',
        application_link: formData.applicationLink || null
      };
      
      // Call the actual API to post the internship
      const response = await internshipsAPI.create(internshipData);
      console.log('Internship posted successfully:', response);
      
      // Clear the draft from localStorage on successful submission
      localStorage.removeItem('internship_draft');
      
      showSuccess('Success!', 'Your internship has been posted successfully!');
      setIsSubmitted(true);
      
    } catch (err: any) {
      console.error('Failed to post internship:', err);
      
      // More detailed error handling
      let errorMessage = 'Failed to post internship. Please try again.';
      
      if (err.response?.status === 400) {
        if (err.response.data?.error?.details) {
          // Validation errors
          errorMessage = err.response.data.error.details.map((validationError: any) => 
            `${validationError.param}: ${validationError.msg}`
          ).join(', ');
        } else if (err.response.data?.error?.message) {
          errorMessage = err.response.data.error.message;
        }
      } else if (err.response?.status === 401) {
        errorMessage = 'You must be logged in to post an internship.';
      } else if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to post internships.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.response?.data?.error?.message) {
        errorMessage = err.response.data.error.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      showError('Posting Failed', errorMessage);
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
                  <option value="Full-time" className="bg-background text-foreground">Full-time</option>
                  <option value="Part-time" className="bg-background text-foreground">Part-time</option>
                  <option value="Remote" className="bg-background text-foreground">Remote</option>
                  <option value="Hybrid" className="bg-background text-foreground">Hybrid</option>
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
                  <option value="1 month" className="bg-background text-foreground">1 month</option>
                  <option value="2 months" className="bg-background text-foreground">2 months</option>
                  <option value="3 months" className="bg-background text-foreground">3 months</option>
                  <option value="4 months" className="bg-background text-foreground">4 months</option>
                  <option value="6 months" className="bg-background text-foreground">6 months</option>
                  <option value="Summer" className="bg-background text-foreground">Summer</option>
                  <option value="Fall" className="bg-background text-foreground">Fall</option>
                  <option value="Spring" className="bg-background text-foreground">Spring</option>
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
            <div className="mb-4">
              <label htmlFor="responsibilities" className="block text-sm font-medium text-foreground mb-1">
                Responsibilities
              </label>
              <textarea 
                id="responsibilities" 
                name="responsibilities" 
                rows={4} 
                className="w-full px-4 py-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background text-foreground" 
                value={formData.responsibilities} 
                onChange={handleChange} 
                placeholder="List the key responsibilities of the intern..."
              ></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="benefits" className="block text-sm font-medium text-foreground mb-1">
                Benefits
              </label>
              <textarea 
                id="benefits" 
                name="benefits" 
                rows={4} 
                className="w-full px-4 py-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background text-foreground" 
                value={formData.benefits} 
                onChange={handleChange} 
                placeholder="List the benefits and perks of the internship..."
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

          {/* Additional Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Additional Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-foreground mb-1">
                  Start Date
                </label>
                <input 
                  type="date" 
                  id="startDate" 
                  name="startDate" 
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background text-foreground" 
                  value={formData.startDate} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-foreground mb-1">
                  End Date
                </label>
                <input 
                  type="date" 
                  id="endDate" 
                  name="endDate" 
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background text-foreground" 
                  value={formData.endDate} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label htmlFor="salaryMin" className="block text-sm font-medium text-foreground mb-1">
                  Minimum Salary
                </label>
                <input 
                  type="number" 
                  id="salaryMin" 
                  name="salaryMin" 
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background text-foreground" 
                  value={formData.salaryMin} 
                  onChange={handleChange} 
                  placeholder="0"
                />
              </div>
              <div>
                <label htmlFor="salaryMax" className="block text-sm font-medium text-foreground mb-1">
                  Maximum Salary
                </label>
                <input 
                  type="number" 
                  id="salaryMax" 
                  name="salaryMax" 
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background text-foreground" 
                  value={formData.salaryMax} 
                  onChange={handleChange} 
                  placeholder="0"
                />
              </div>
              <div>
                <label htmlFor="salaryType" className="block text-sm font-medium text-foreground mb-1">
                  Salary Type
                </label>
                <select 
                  id="salaryType" 
                  name="salaryType" 
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background text-foreground" 
                  value={formData.salaryType} 
                  onChange={handleChange}
                >
                  <option value="hourly" className="bg-background text-foreground">Hourly</option>
                  <option value="monthly" className="bg-background text-foreground">Monthly</option>
                  <option value="stipend" className="bg-background text-foreground">Stipend</option>
                  <option value="unpaid" className="bg-background text-foreground">Unpaid</option>
                </select>
              </div>
              <div>
                <label htmlFor="experienceLevel" className="block text-sm font-medium text-foreground mb-1">
                  Experience Level
                </label>
                <select 
                  id="experienceLevel" 
                  name="experienceLevel" 
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background text-foreground" 
                  value={formData.experienceLevel} 
                  onChange={handleChange}
                >
                  <option value="entry" className="bg-background text-foreground">Entry Level</option>
                  <option value="intermediate" className="bg-background text-foreground">Intermediate</option>
                  <option value="advanced" className="bg-background text-foreground">Advanced</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="skills" className="block text-sm font-medium text-foreground mb-1">
                  Required Skills
                </label>
                <input 
                  type="text" 
                  id="skills" 
                  name="skills" 
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background text-foreground" 
                  value={formData.skills} 
                  onChange={handleChange} 
                  placeholder="e.g., JavaScript, React, Python, Data Analysis"
                />
              </div>
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