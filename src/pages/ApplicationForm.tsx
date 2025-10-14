import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, User, Mail, Phone, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// Import the real API client
import { applicationsAPI, internshipsAPI } from '@/lib/new-api-client';

interface InternshipDetails {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  description: string;
  requirements: string[];
}

interface ApplicationFormData {
  coverLetter: string;
  skills: string;
  studentPhone: string;
  education: string;
  experience: string;
  portfolio: string;
  availability: string;
}

// Define user type for better type safety
interface UserInfo {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
}

const ApplicationForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Helper functions for showing toast notifications
  const showSuccess = (message: string, title: string = "Success") => {
    toast({
      title,
      description: message,
    });
  };
  
  const showInfo = (message: string, title: string = "Information") => {
    toast({
      title,
      description: message,
    });
  };
  
  const showError = (message: string, title: string = "Error") => {
    toast({
      title,
      description: message,
      variant: "destructive",
    });
  };
  
  const [internship, setInternship] = useState<InternshipDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
    coverLetter: '',
    skills: '',
    studentPhone: '',
    education: '',
    experience: '',
    portfolio: '',
    availability: ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [additionalDocs, setAdditionalDocs] = useState<File[]>([]);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | ''>('');

  // Get user info from localStorage with proper null handling
  const user: UserInfo = (() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (e) {
        return {};
      }
    }
    return {};
  })();

  // Fetch real internship data from backend
  const fetchInternshipData = async (id: string) => {
    try {
      const response = await internshipsAPI.getById(Number(id));
      const internshipData = response.data.data.internship;
      
      // Transform the data to match our interface
      return {
        id: internshipData.id,
        title: internshipData.title,
        company: internshipData.company_name,
        location: internshipData.location,
        type: internshipData.type,
        duration: internshipData.duration,
        description: internshipData.description,
        requirements: internshipData.requirements ? internshipData.requirements.split(',').map((req: string) => req.trim()) : []
      };
    } catch (error) {
      console.error('Error fetching internship:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Check if user has email (is logged in)
    if (!user.email) {
      showInfo('Login Required', 'Please login to apply for internships');
      navigate('/login');
      return;
    }

    if (id) {
      // Load real internship details
      const loadInternshipData = async () => {
        try {
          setLoading(true);
          const internshipData = await fetchInternshipData(id);
          setInternship(internshipData);
        } catch (error) {
          showError('Error', 'Failed to load internship details');
        } finally {
          setLoading(false);
        }
      };
      
      loadInternshipData();

      // Load any existing application draft from localStorage
      const savedDraft = localStorage.getItem(`application_draft_${id}`);
      if (savedDraft) {
        try {
          setFormData(JSON.parse(savedDraft));
        } catch (e) {
          // Ignore invalid JSON
        }
      }
    }
  }, [id, user.email, user, navigate]);

  // Auto-save form data to localStorage
  useEffect(() => {
    if (id && !loading) {
      setAutoSaveStatus('saving');
      const timeoutId = setTimeout(() => {
        localStorage.setItem(`application_draft_${id}`, JSON.stringify(formData));
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus(''), 2000);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [formData, id, loading]);

  const handleInputChange = (field: keyof ApplicationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showError('File Too Large', 'Resume must be less than 5MB');
        return;
      }
      if (!file.type.includes('pdf') && !file.type.includes('document')) {
        showError('Invalid File Type', 'Please upload a PDF or Word document');
        return;
      }
      setResumeFile(file);
      showSuccess('Resume Uploaded', 'Your resume has been attached successfully!');
    }
  };

  const handleAdditionalDocsUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const validFiles = files.filter(file => {
        if (file.size > 5 * 1024 * 1024) return false;
        return file.type.includes('pdf') || file.type.includes('document') || file.type.includes('image');
      });
      
      if (validFiles.length !== files.length) {
        showInfo('Some Files Skipped', 'Some files were skipped due to size or format restrictions');
      }
      
      setAdditionalDocs(prev => [...prev, ...validFiles]);
      showSuccess('Documents Added', `${validFiles.length} document(s) added successfully!`);
    }
  };

  const removeDocument = (index: number) => {
    setAdditionalDocs(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!internship) return;
    
    // Validation
    if (!formData.coverLetter.trim()) {
      showError('Missing Information', 'Please write a cover letter');
      return;
    }
    
    if (!formData.skills.trim()) {
      showError('Missing Information', 'Please list your relevant skills');
      return;
    }

    setSubmitting(true);

    try {
      // Submit application to real API
      const applicationData = {
        internship_id: internship.id,
        cover_letter: formData.coverLetter,
        skills: formData.skills,
        experience: formData.experience,
        education: formData.education,
        portfolio_url: formData.portfolio,
        resume_url: resumeFile ? resumeFile.name : '' // In a real implementation, this would be the uploaded file URL
      };
      
      // Call the real API to submit the application
      const response = await applicationsAPI.create(applicationData);
      
      // Clear the draft from localStorage
      localStorage.removeItem(`application_draft_${id}`);
      
      showSuccess('Application Submitted!', `Your application for "${internship.title}" has been submitted successfully!`);
      
      // Navigate to confirmation page with application details
      setTimeout(() => {
        navigate('/application-confirmation', {
          state: {
            internshipTitle: internship.title,
            company: internship.company,
            applicationId: response.data.data?.id
          }
        });
      }, 2000);
      
    } catch (error: any) {
      console.error('Application submission error:', error);
      let errorMessage = 'Failed to submit your application. Please try again.';
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        if (error.response.data?.error?.details) {
          // Validation errors
          errorMessage = error.response.data.error.details.map((err: any) => err.msg).join(', ');
        } else if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'You must be logged in to submit an application.';
        navigate('/login');
      } else if (error.response?.status === 404) {
        errorMessage = 'The internship you are trying to apply for is not available. It may not be approved yet or has been removed.';
      } else if (error.response?.status === 409) {
        errorMessage = 'You have already applied for this internship.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showError('Submission Failed', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-gray-600">Internship not found</p>
        <Link to="/search" className="mt-4 inline-block text-emerald-600 hover:text-emerald-800">
          Browse Other Internships
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-emerald-600 hover:text-emerald-800 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back
        </button>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Apply for Internship</h1>
          <div className="text-gray-600">
            <p className="text-lg font-medium text-gray-900">{internship.title}</p>
            <p>{internship.company} • {internship.location}</p>
            <p className="text-sm">{internship.type} • {internship.duration}</p>
          </div>
          
          {/* Auto-save status */}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {autoSaveStatus === 'saving' && '💾 Saving draft...'}
              {autoSaveStatus === 'saved' && '✅ Draft saved'}
              {autoSaveStatus === 'error' && '❌ Failed to save draft'}
            </div>
            <div className="text-sm text-emerald-600">
              ✨ Your progress is automatically saved
            </div>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <User size={20} className="mr-2 text-emerald-600" />
            Personal Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={user.name || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Phone size={16} className="mr-2 text-emerald-600" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.studentPhone}
                onChange={(e) => handleInputChange('studentPhone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Education
              </label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                placeholder="e.g., Computer Science, Stanford University"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Skills & Experience */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Target size={20} className="mr-2 text-emerald-600" />
            Skills & Experience
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relevant Skills *
              </label>
              <p className="text-sm text-gray-500 mb-2">
                List skills relevant to this position: {internship.requirements?.join(', ')}
              </p>
              <textarea
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                required
                rows={3}
                placeholder="e.g., JavaScript, React, Node.js, Python, Data Analysis..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relevant Experience
              </label>
              <textarea
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                rows={4}
                placeholder="Describe any relevant work experience, projects, or coursework..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Portfolio/Website (Optional)
              </label>
              <input
                type="url"
                value={formData.portfolio}
                onChange={(e) => handleInputChange('portfolio', e.target.value)}
                placeholder="https://your-portfolio.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <input
                type="text"
                value={formData.availability}
                onChange={(e) => handleInputChange('availability', e.target.value)}
                placeholder="e.g., Available immediately, Starting June 2024..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Cover Letter */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Mail size={20} className="mr-2 text-emerald-600" />
            Cover Letter
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Why are you interested in this position? *
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Tell the company why you're the perfect fit for this internship
            </p>
            <textarea
              value={formData.coverLetter}
              onChange={(e) => handleInputChange('coverLetter', e.target.value)}
              required
              rows={8}
              placeholder="Write your cover letter here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FileText size={20} className="mr-2 text-emerald-600" />
            Documents
          </h2>
          
          <div className="space-y-6">
            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="resume-upload" className="cursor-pointer bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors">
                    Upload Resume
                  </label>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  PDF or Word document, max 5MB
                </p>
                {resumeFile && (
                  <div className="mt-4 text-sm text-gray-600">
                    <span className="font-medium">Selected:</span> {resumeFile.name}
                  </div>
                )}
              </div>
            </div>
            
            {/* Additional Documents */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Documents (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="additional-docs" className="cursor-pointer bg-white border border-emerald-600 text-emerald-600 px-4 py-2 rounded-md hover:bg-emerald-50 transition-colors">
                    Add Documents
                  </label>
                  <input
                    id="additional-docs"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={handleAdditionalDocsUpload}
                    multiple
                    className="hidden"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  PDF, Word, or image files, max 5MB each
                </p>
              </div>
              
              {/* Document List */}
              {additionalDocs.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Attached Documents:</h3>
                  <ul className="space-y-2">
                    {additionalDocs.map((doc, index) => (
                      <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-600 truncate flex-1 mr-2">{doc.name}</span>
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`px-6 py-3 text-white rounded-md transition-colors ${
              submitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {submitting ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Submitting...
              </div>
            ) : (
              'Submit Application'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;