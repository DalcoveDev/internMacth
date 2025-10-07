import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { listApplications } from '../api';

interface Application {
  id: number;
  internshipId: number;
  internshipTitle: string;
  company: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  logoUrl: string;
}

interface User {
  name: string;
  email: string;
}

const StudentDashboard = () => {
  const [user] = useState<User>({ name: 'John Doe', email: 'john@example.com' });
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    // Fetch applications for this student (no auth implemented yet - list all)
    listApplications().then((apps: any[]) => {
      const mapped = apps.map(a => ({ id: a.id, internshipId: a.internshipId, internshipTitle: a.internship?.title ?? '', company: a.internship?.company ?? '', appliedDate: a.createdAt, status: a.status, logoUrl: '' }))
      setApplications(mapped)
    }).catch(() => {
      setApplications([])
    })
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" />
            Pending
          </span>;
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Approved
          </span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={12} className="mr-1" />
            Rejected
          </span>;
      default:
        return null;
    }
  };

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Dashboard Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-6 text-white">
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <p className="mt-1">Welcome back, {user?.name}</p>
        </div>
        {/* Dashboard Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button onClick={() => setActiveTab('applications')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${activeTab === 'applications' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              My Applications
            </button>
            <button onClick={() => setActiveTab('profile')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${activeTab === 'profile' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Profile
            </button>
            <button onClick={() => setActiveTab('resume')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${activeTab === 'resume' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Resume
            </button>
          </nav>
        </div>
        {/* Dashboard Content */}
        <div className="p-6">
          {activeTab === 'applications' && <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Your Applications
                </h2>
                <Link to="/search" className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors">
                  Browse More Internships
                </Link>
              </div>
              {applications.length > 0 ? <div className="space-y-4">
                  {applications.map(application => <div key={application.id} className="border border-gray-200 rounded-lg p-4 flex items-start transition-colors hover:border-emerald-200">
                      <div className="h-12 w-12 flex-shrink-0 mr-4">
                        <img src={application.logoUrl} alt={`${application.company} logo`} className="h-full w-full object-contain rounded-md" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium text-gray-900">
                            {application.internshipTitle}
                          </h3>
                          {getStatusBadge(application.status)}
                        </div>
                        <p className="text-gray-600">{application.company}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Applied on{' '}
                          {new Date(application.appliedDate).toLocaleDateString()}
                        </p>
                        <div className="mt-4 flex">
                          <Link to={`/application/${application.id}`} className="text-emerald-600 hover:text-emerald-800 text-sm font-medium flex items-center">
                            <FileText size={16} className="mr-1" />
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>)}
                </div> : <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    You haven't applied to any internships yet.
                  </p>
                  <Link to="/search" className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors">
                    Browse Internships
                  </Link>
                </div>}
            </div>}
          {activeTab === 'profile' && <div>
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Your Profile
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md" defaultValue={user?.name} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-md" defaultValue={user?.email} disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      School/University
                    </label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Enter your school or university" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Field of Study
                    </label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="E.g., Computer Science, Marketing" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Tell companies a bit about yourself..."></textarea>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>}
          {activeTab === 'resume' && <div>
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Resume & Documents
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-800 mb-3">
                    Resume
                  </h3>
                  <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="mb-3">
                      <FileText size={36} className="mx-auto text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Drag and drop your resume here, or
                    </p>
                    <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors">
                      Browse Files
                    </button>
                    <p className="mt-2 text-xs text-gray-500">
                      Supported formats: PDF, DOCX (Max 5MB)
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-3">
                    Additional Documents
                  </h3>
                  <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="mb-3">
                      <FileText size={36} className="mx-auto text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Upload cover letters, certificates, or other documents
                    </p>
                    <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors">
                      Add Documents
                    </button>
                  </div>
                </div>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};

export default StudentDashboard;