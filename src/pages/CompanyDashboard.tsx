import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardListIcon, BriefcaseIcon, UserIcon, ClockIcon, CheckCircleIcon, XCircleIcon, EyeIcon, EditIcon, TrashIcon } from 'lucide-react';
interface Internship {
  id: number;
  title: string;
  location: string;
  type: string;
  duration: string;
  postedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  applications: number;
}
interface Application {
  id: number;
  internshipId: number;
  internshipTitle: string;
  studentName: string;
  studentEmail: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}
const CompanyDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('internships');
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Mock data for internships
    const mockInternships = [{
      id: 1,
      title: 'Software Development Intern',
      location: 'San Francisco, CA',
      type: 'Full-time',
      duration: '3 months',
      postedDate: '2023-05-01',
      status: 'approved',
      applications: 12
    }, {
      id: 2,
      title: 'Marketing Intern',
      location: 'New York, NY',
      type: 'Part-time',
      duration: '6 months',
      postedDate: '2023-05-10',
      status: 'pending',
      applications: 5
    }, {
      id: 3,
      title: 'UX/UI Design Intern',
      location: 'Remote',
      type: 'Full-time',
      duration: '4 months',
      postedDate: '2023-04-25',
      status: 'approved',
      applications: 8
    }] as Internship[];
    // Mock data for applications
    const mockApplications = [{
      id: 1,
      internshipId: 1,
      internshipTitle: 'Software Development Intern',
      studentName: 'Alex Johnson',
      studentEmail: 'alex.j@example.com',
      appliedDate: '2023-05-05',
      status: 'pending'
    }, {
      id: 2,
      internshipId: 1,
      internshipTitle: 'Software Development Intern',
      studentName: 'Sam Wilson',
      studentEmail: 'samw@example.com',
      appliedDate: '2023-05-06',
      status: 'approved'
    }, {
      id: 3,
      internshipId: 3,
      internshipTitle: 'UX/UI Design Intern',
      studentName: 'Jamie Smith',
      studentEmail: 'jamie.smith@example.com',
      appliedDate: '2023-05-02',
      status: 'rejected'
    }] as Application[];
    setInternships(mockInternships);
    setApplications(mockApplications);
  }, []);
  const handleApproveApplication = (id: number) => {
    setApplications(prev => prev.map(app => app.id === id ? {
      ...app,
      status: 'approved'
    } : app));
  };
  const handleRejectApplication = (id: number) => {
    setApplications(prev => prev.map(app => app.id === id ? {
      ...app,
      status: 'rejected'
    } : app));
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon size={12} className="mr-1" />
            Pending Approval
          </span>;
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon size={12} className="mr-1" />
            Approved
          </span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon size={12} className="mr-1" />
            Rejected
          </span>;
      default:
        return null;
    }
  };
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Dashboard Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h1 className="text-2xl font-bold">Company Dashboard</h1>
          <p className="mt-1">Welcome back, {user?.name}</p>
        </div>
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <BriefcaseIcon size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Active Internships
                </h3>
                <span className="text-lg font-semibold text-gray-900">
                  {internships.filter(i => i.status === 'approved').length}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <ClipboardListIcon size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Total Applications
                </h3>
                <span className="text-lg font-semibold text-gray-900">
                  {applications.length}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <UserIcon size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Pending Applications
                </h3>
                <span className="text-lg font-semibold text-gray-900">
                  {applications.filter(a => a.status === 'pending').length}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Dashboard Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button onClick={() => setActiveTab('internships')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'internships' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              My Internships
            </button>
            <button onClick={() => setActiveTab('applications')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'applications' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Applications
            </button>
            <button onClick={() => setActiveTab('profile')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Company Profile
            </button>
          </nav>
        </div>
        {/* Dashboard Content */}
        <div className="p-6">
          {activeTab === 'internships' && <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Your Internship Listings
                </h2>
                <Link to="/post-internship" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                  Post New Internship
                </Link>
              </div>
              {internships.length > 0 ? <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Internship
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Details
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applications
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {internships.map(internship => <tr key={internship.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {internship.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              Posted on{' '}
                              {new Date(internship.postedDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {internship.location}
                            </div>
                            <div className="text-sm text-gray-500">
                              {internship.type} · {internship.duration}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(internship.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {internship.applications} applicants
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <EyeIcon size={18} />
                              </button>
                              <button className="text-indigo-600 hover:text-indigo-900">
                                <EditIcon size={18} />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <TrashIcon size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>)}
                    </tbody>
                  </table>
                </div> : <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    You haven't posted any internships yet.
                  </p>
                  <Link to="/post-internship" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                    Post Your First Internship
                  </Link>
                </div>}
            </div>}
          {activeTab === 'applications' && <div>
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Internship Applications
              </h2>
              {applications.length > 0 ? <div className="space-y-4">
                  {applications.map(application => <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {application.studentName}
                          </h3>
                          <p className="text-gray-600">
                            {application.internshipTitle}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Applied on{' '}
                            {new Date(application.appliedDate).toLocaleDateString()}{' '}
                            · {application.studentEmail}
                          </p>
                        </div>
                        {getStatusBadge(application.status)}
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <Link to={`/application/${application.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View Application
                        </Link>
                        {application.status === 'pending' && <div className="flex space-x-2">
                            <button onClick={() => handleRejectApplication(application.id)} className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                              Reject
                            </button>
                            <button onClick={() => handleApproveApplication(application.id)} className="px-3 py-1 bg-blue-600 border border-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700">
                              Approve
                            </button>
                          </div>}
                      </div>
                    </div>)}
                </div> : <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No applications received yet.</p>
                </div>}
            </div>}
          {activeTab === 'profile' && <div>
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Company Profile
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Logo
                  </label>
                  <div className="flex items-center">
                    <div className="h-20 w-20 rounded-md bg-gray-200 flex items-center justify-center">
                      <BriefcaseIcon size={32} className="text-gray-400" />
                    </div>
                    <button className="ml-5 px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Change
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
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
                      Website
                    </label>
                    <input type="url" className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="https://www.example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-md">
                      <option>Technology</option>
                      <option>Marketing</option>
                      <option>Finance</option>
                      <option>Healthcare</option>
                      <option>Education</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Description
                    </label>
                    <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Tell students about your company..."></textarea>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};
export default CompanyDashboard;