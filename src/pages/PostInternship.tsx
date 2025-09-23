import React, { useState } from 'react';
import { CheckCircleIcon } from 'lucide-react';
const PostInternship = () => {
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the data to an API
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
  };
  if (isSubmitted) {
    return <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-6">
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
            <button onClick={() => setIsSubmitted(false)} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
              Post Another Internship
            </button>
          </div>
        </div>
      </div>;
  }
  return <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Post an Internship
      </h1>
      <p className="text-gray-600 mb-8">
        Connect with talented students by posting your internship opportunity
      </p>
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
                <input type="text" id="companyName" name="companyName" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={formData.companyName} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Website
                </label>
                <input type="url" id="companyWebsite" name="companyWebsite" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={formData.companyWebsite} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email *
                </label>
                <input type="email" id="contactEmail" name="contactEmail" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={formData.contactEmail} onChange={handleChange} />
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
                <input type="text" id="jobTitle" name="jobTitle" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={formData.jobTitle} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input type="text" id="location" name="location" required placeholder="City, State or Remote" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={formData.location} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select id="type" name="type" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={formData.type} onChange={handleChange}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration *
                </label>
                <select id="duration" name="duration" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={formData.duration} onChange={handleChange}>
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
                <textarea id="description" name="description" required rows={6} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={formData.description} onChange={handleChange}></textarea>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements *
                </label>
                <textarea id="requirements" name="requirements" required rows={4} placeholder="List skills and qualifications required for this position" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={formData.requirements} onChange={handleChange}></textarea>
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
                <input type="date" id="applicationDeadline" name="applicationDeadline" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={formData.applicationDeadline} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="applicationLink" className="block text-sm font-medium text-gray-700 mb-1">
                  Application Link
                </label>
                <input type="url" id="applicationLink" name="applicationLink" placeholder="External link to apply (optional)" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={formData.applicationLink} onChange={handleChange} />
              </div>
            </div>
          </div>
          {/* Terms and Submission */}
          <div className="mb-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
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
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Post Internship
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default PostInternship;