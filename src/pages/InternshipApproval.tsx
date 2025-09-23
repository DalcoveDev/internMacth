import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, MapPinIcon, CalendarIcon, ClockIcon, CheckIcon, XIcon } from 'lucide-react';
const InternshipApproval = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  useEffect(() => {
    // Mock data for the internship
    const mockInternship = {
      id: parseInt(id),
      title: 'Frontend Developer Intern',
      company: 'Tech Solutions Ltd',
      companyEmail: 'hr@techsolutions.com',
      location: 'Chicago, IL',
      type: 'Full-time',
      duration: '3 months',
      salary: '$20/hour',
      postedDate: '2023-05-12',
      deadline: '2023-06-15',
      status: 'pending',
      description: 'Tech Solutions Ltd is looking for a motivated Frontend Developer Intern to join our innovative team. As an intern, you will work closely with our experienced developers to create and maintain web applications using modern JavaScript frameworks.\n\nThis is a great opportunity to gain real-world experience in a fast-paced tech environment while working on projects that will make a difference.',
      responsibilities: ['Develop and maintain web applications using React', 'Collaborate with the design team to implement user interfaces', 'Write clean, efficient, and reusable code', 'Test and debug applications', 'Participate in code reviews and team meetings'],
      requirements: ['Currently pursuing a degree in Computer Science or related field', 'Knowledge of HTML, CSS, and JavaScript', 'Familiarity with React or similar frameworks', 'Understanding of responsive design principles', 'Good problem-solving skills and attention to detail'],
      benefits: ['Competitive hourly pay', 'Flexible working hours', 'Mentorship from experienced developers', 'Opportunity for full-time employment after the internship', 'Modern office with amenities']
    };
    setInternship(mockInternship);
    setLoading(false);
  }, [id]);
  const handleApprove = () => {
    setInternship(prev => ({
      ...prev,
      status: 'approved'
    }));
    // In a real app, you would send an API request here
    // Navigate back after approval
    setTimeout(() => {
      navigate('/admin-dashboard');
    }, 1500);
  };
  const handleReject = () => {
    if (!rejectionReason) {
      alert('Please provide a reason for rejection');
      return;
    }
    setInternship(prev => ({
      ...prev,
      status: 'rejected',
      rejectionReason
    }));
    // In a real app, you would send an API request here
    // Navigate back after rejection
    setTimeout(() => {
      navigate('/admin-dashboard');
    }, 1500);
  };
  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>;
  }
  return <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeftIcon size={16} className="mr-1" />
        Back to Dashboard
      </button>
      {internship.status === 'approved' && <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                This internship has been approved and is now live on the
                platform.
              </p>
            </div>
          </div>
        </div>}
      {internship.status === 'rejected' && <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <XIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                This internship has been rejected. Reason:{' '}
                {internship.rejectionReason}
              </p>
            </div>
          </div>
        </div>}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Internship Approval
          </h1>
          <p className="text-sm text-gray-500">
            Review this internship listing before approving or rejecting
          </p>
        </div>
        <div className="p-6">
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {internship.title}
                </h2>
                <p className="text-lg text-gray-600 mt-1">
                  {internship.company}
                </p>
              </div>
              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {internship.type}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center text-gray-600">
                <MapPinIcon size={18} className="mr-1" />
                <span>{internship.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CalendarIcon size={18} className="mr-1" />
                <span>{internship.duration}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <ClockIcon size={18} className="mr-1" />
                <span>
                  Deadline: {new Date(internship.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="mt-2 text-gray-600">
              <span className="font-medium">Compensation:</span>{' '}
              {internship.salary}
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Description
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="whitespace-pre-wrap text-gray-700">
                {internship.description}
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Responsibilities
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {internship.responsibilities.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Requirements
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {internship.requirements.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Benefits</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {internship.benefits.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Company Contact
            </h3>
            <p className="text-gray-700">{internship.companyEmail}</p>
          </div>
          {internship.status === 'pending' && <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Admin Decision
              </h3>
              {showRejectionForm ? <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Rejection
                  </label>
                  <textarea id="rejectionReason" rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Provide a reason for rejecting this internship..." value={rejectionReason} onChange={e => setRejectionReason(e.target.value)}></textarea>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button onClick={() => setShowRejectionForm(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Cancel
                    </button>
                    <button onClick={handleReject} className="px-4 py-2 bg-red-600 border border-red-600 rounded-md text-sm font-medium text-white hover:bg-red-700">
                      Confirm Rejection
                    </button>
                  </div>
                </div> : <div className="flex justify-end space-x-3">
                  <button onClick={() => setShowRejectionForm(true)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Reject
                  </button>
                  <button onClick={handleApprove} className="px-4 py-2 bg-green-600 border border-green-600 rounded-md text-sm font-medium text-white hover:bg-green-700">
                    Approve
                  </button>
                </div>}
            </div>}
        </div>
      </div>
    </div>;
};
export default InternshipApproval;