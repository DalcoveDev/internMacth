import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, User, Mail, Phone, GraduationCap, Target } from 'lucide-react';
import { createApplication, getInternship } from '../api';
import { useToast } from '../components/ToastProvider';

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

const ApplicationForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();
  
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

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!user.email) {
      showInfo('Login Required', 'Please login to apply for internships');
      navigate('/login');
      return;
    }

    if (id) {
      // Load internship details
      getInternship(Number(id))
        .then((internshipData: any) => {
          setInternship({
            id: internshipData.id,
            title: internshipData.title,
            company: internshipData.company,
            location: internshipData.location,
            type: internshipData.type || 'Full-time',
            duration: internshipData.duration || '3 months',
            description: internshipData.description,
            requirements: internshipData.skills ? internshipData.skills.split(',').map((s: string) => s.trim()) : []
          });
          setLoading(false);
        })
        .catch(() => {
          showError('Error', 'Failed to load internship details');
          setLoading(false);
        });

      // Load any existing application draft from localStorage
      const savedDraft = localStorage.getItem(`application_draft_${id}`);
      if (savedDraft) {
        setFormData(JSON.parse(savedDraft));
      }
    }
  }, [id, user.email, navigate, showError, showInfo]);

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
      // Create application
      const applicationData = {
        internshipId: internship.id,
        studentName: user.name || 'Student',
        studentEmail: user.email,
        coverLetter: formData.coverLetter,
        skills: formData.skills,
        studentPhone: formData.studentPhone,
        education: formData.education,
        experience: formData.experience,
        portfolio: formData.portfolio,
        availability: formData.availability
      };

      await createApplication(applicationData);
      
      // Clear the draft from localStorage
      localStorage.removeItem(`application_draft_${id}`);
      
      showSuccess('Application Submitted!', `Your application for "${internship.title}" has been submitted successfully!`);
      
      // Navigate to student dashboard after a short delay
      setTimeout(() => {
        navigate('/student-dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Application submission error:', error);
      showError('Submission Failed', 'Failed to submit your application. Please try again.');
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              placeholder="Write your cover letter here. Explain why you're interested in this position and what makes you a great candidate..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
            <div className="mt-1 text-sm text-gray-500">
              {formData.coverLetter.length}/2000 characters
            </div>
          </div>
        </div>

        {/* Documents Upload */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FileText size={20} className="mr-2 text-emerald-600" />
            Documents
          </h2>
          
          <div className="space-y-6">
            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resume (Recommended)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {resumeFile ? (
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="text-emerald-600" size={24} />
                    <span className="text-gray-700">{resumeFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-gray-600 mb-2">Upload your resume</p>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={handleResumeUpload}
                      className="hidden"
                      id="resume-upload"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('resume-upload')?.click()}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                    >
                      Choose File
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      PDF or Word document, max 5MB
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Additional Documents */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Documents (Optional)
              </label>
              <p className="text-sm text-gray-500 mb-2">
                Cover letter, certificates, portfolio samples, etc.
              </p>
              
              {additionalDocs.length > 0 && (
                <div className="mb-4 space-y-2">
                  {additionalDocs.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">{doc.name}</span>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <input
                type="file"
                accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                multiple
                onChange={handleAdditionalDocsUpload}
                className="hidden"
                id="additional-docs-upload"
              />
              <button
                type="button"
                onClick={() => document.getElementById('additional-docs-upload')?.click()}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Add Documents
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                By submitting this application, you agree that the information provided is accurate.
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;