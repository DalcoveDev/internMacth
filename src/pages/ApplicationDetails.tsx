import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, FileTextIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from 'lucide-react';
const ApplicationDetails = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Mock data for the application
    const mockApplication = {
      id: parseInt(id),
      internshipId: 1,
      internshipTitle: 'Software Development Intern',
      company: 'Tech Innovations Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      duration: '3 months',
      studentName: 'Alex Johnson',
      studentEmail: 'alex.j@example.com',
      studentPhone: '(123) 456-7890',
      education: 'Stanford University, Computer Science',
      appliedDate: '2023-05-05',
      status: 'pending',
      coverLetter: 'Dear Hiring Manager,\n\nI am writing to express my interest in the Software Development Intern position at Tech Innovations Inc. As a Computer Science student at Stanford University with experience in React and Node.js, I am excited about the opportunity to contribute to your innovative projects.\n\nDuring my coursework, I have developed several web applications using modern JavaScript frameworks and have a strong foundation in data structures and algorithms. I am particularly interested in your company because of your focus on cutting-edge technologies and your commitment to mentoring young developers.\n\nI am confident that my technical skills, passion for learning, and collaborative nature would make me a valuable addition to your team. I am eager to apply my knowledge in a real-world setting and grow as a developer under the guidance of experienced professionals.\n\nThank you for considering my application. I look forward to the possibility of discussing how I can contribute to Tech Innovations Inc.\n\nSincerely,\nAlex Johnson',
      skills: ['JavaScript', 'React', 'Node.js', 'Git', 'MongoDB']
    };
    setApplication(mockApplication);
    setLoading(false);
  }, [id]);
  const handleApprove = () => {
    setApplication(prev => ({
      ...prev,
      status: 'approved'
    }));
  };
  const handleReject = () => {
    setApplication(prev => ({
      ...prev,
      status: 'rejected'
    }));
  };
  const getStatusBadge = status => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon size={16} className="mr-1" />
            Pending
          </span>;
      case 'approved':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircleIcon size={16} className="mr-1" />
            Approved
          </span>;
      case 'rejected':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircleIcon size={16} className="mr-1" />
            Rejected
          </span>;
      default:
        return null;
    }
  };
  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>;
  }
  return <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeftIcon size={16} className="mr-1" />
        Back
      </button>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Application Details
            </h1>
            <p className="text-sm text-gray-500">
              Submitted on{' '}
              {new Date(application.appliedDate).toLocaleDateString()}
            </p>
          </div>
          {getStatusBadge(application.status)}
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Internship Details
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900">
                  {application.internshipTitle}
                </p>
                <p className="text-gray-600">{application.company}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {application.location} • {application.type} •{' '}
                  {application.duration}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Applicant Information
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900">
                  {application.studentName}
                </p>
                <p className="text-gray-600">{application.education}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {application.studentEmail} • {application.studentPhone}
                </p>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {application.skills.map((skill, index) => <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {skill}
                </span>)}
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Cover Letter
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="whitespace-pre-wrap text-gray-700">
                {application.coverLetter}
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Resume</h2>
            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <FileTextIcon size={24} className="text-gray-400 mr-3" />
                <span className="text-gray-900">Alex_Johnson_Resume.pdf</span>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Download
              </button>
            </div>
          </div>
          {user && user.role === 'company' && application.status === 'pending' && <div className="border-t border-gray-200 pt-6 flex justify-end space-x-3">
                <button onClick={handleReject} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Reject Application
                </button>
                <button onClick={handleApprove} className="px-4 py-2 bg-blue-600 border border-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700">
                  Approve Application
                </button>
              </div>}
        </div>
      </div>
    </div>;
};
export default ApplicationDetails;