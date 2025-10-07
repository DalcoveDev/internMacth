import { useEffect, useState } from 'react';
import { ArrowLeft, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getApplication } from '../api';

interface Application {
  id: number;
  internshipId: number;
  internshipTitle: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  education: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  coverLetter: string;
  skills: string[];
}

interface User {
  role: 'company' | 'student';
  name: string;
}

const ApplicationDetails = () => {
  // Mock user data - in real app, this would come from props or context
  const [user] = useState<User>({ role: 'company', name: 'Company Admin' });
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load application from API
    const parts = window.location.pathname.split('/')
    const id = Number(parts[parts.length - 1])
    getApplication(id).then((app: any) => {
      setApplication({
        id: app.id,
        internshipId: app.internshipId,
        internshipTitle: app.internship?.title ?? '',
        company: app.internship?.company ?? '',
        location: app.internship?.location ?? '',
        type: 'Full-time',
        duration: '3 months',
        studentName: app.studentName,
        studentEmail: app.studentEmail,
        studentPhone: '',
        education: '',
        appliedDate: app.createdAt,
        status: app.status,
        coverLetter: app.coverLetter ?? '',
        skills: (app.skills || '').split(',').map((s: string) => s.trim())
      })
      setLoading(false)
    }).catch(() => {
      setApplication(null)
      setLoading(false)
    })
  }, []);

  const handleApprove = () => {
    setApplication(prev => prev ? { ...prev, status: 'approved' } : null);
  };

  const handleReject = () => {
    setApplication(prev => prev ? { ...prev, status: 'rejected' } : null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock size={16} className="mr-1" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle size={16} className="mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle size={16} className="mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600">Application not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => window.history.back()}
        className="flex items-center text-emerald-600 hover:text-emerald-800 mb-6"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back
      </button>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Application Details
            </h1>
            <p className="text-sm text-gray-500">
              Submitted on {new Date(application.appliedDate).toLocaleDateString()}
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
                  {application.location} • {application.type} • {application.duration}
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
              {application.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full"
                >
                  {skill}
                </span>
              ))}
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
                <FileText size={24} className="text-gray-400 mr-3" />
                <span className="text-gray-900">Alex_Johnson_Resume.pdf</span>
              </div>
              <button className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
                Download
              </button>
            </div>
          </div>

          {user && user.role === 'company' && application.status === 'pending' && (
            <div className="border-t border-gray-200 pt-6 flex justify-end space-x-3">
              <button
                onClick={handleReject}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Reject Application
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-emerald-600 border border-emerald-600 rounded-md text-sm font-medium text-white hover:bg-emerald-700"
              >
                Approve Application
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;