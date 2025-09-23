import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UsersIcon, BriefcaseIcon, AlertCircleIcon, CheckCircleIcon, XCircleIcon, ClockIcon, EyeIcon, CheckIcon, XIcon } from 'lucide-react';
interface PendingInternship {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  postedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}
interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'company' | 'admin';
  joinDate: string;
  status: 'active' | 'inactive';
}
const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pendingInternships, setPendingInternships] = useState<PendingInternship[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Mock data for pending internships
    const mockPendingInternships = [{
      id: 1,
      title: 'Frontend Developer Intern',
      company: 'Tech Solutions Ltd',
      location: 'Chicago, IL',
      type: 'Full-time',
      postedDate: '2023-05-12',
      status: 'pending'
    }, {
      id: 2,
      title: 'Business Analyst Intern',
      company: 'Finance Corp',
      location: 'New York, NY',
      type: 'Part-time',
      postedDate: '2023-05-11',
      status: 'pending'
    }, {
      id: 3,
      title: 'Graphic Design Intern',
      company: 'Creative Studios',
      location: 'Remote',
      type: 'Full-time',
      postedDate: '2023-05-10',
      status: 'pending'
    }];
    // Mock data for users
    const mockUsers = [{
      id: 1,
      name: 'Alex Johnson',
      email: 'alex.j@example.com',
      role: 'student',
      joinDate: '2023-04-15',
      status: 'active'
    }, {
      id: 2,
      name: 'Tech Solutions Ltd',
      email: 'contact@techsolutions.com',
      role: 'company',
      joinDate: '2023-03-20',
      status: 'active'
    }, {
      id: 3,
      name: 'Jamie Smith',
      email: 'jamie.smith@example.com',
      role: 'student',
      joinDate: '2023-05-01',
      status: 'active'
    }, {
      id: 4,
      name: 'Finance Corp',
      email: 'hr@financecorp.com',
      role: 'company',
      joinDate: '2023-04-10',
      status: 'active'
    }, {
      id: 5,
      name: 'Admin User',
      email: 'admin@internmatch.com',
      role: 'admin',
      joinDate: '2023-01-01',
      status: 'active'
    }] as UserData[];
    setPendingInternships(mockPendingInternships as PendingInternship[]);
    setUsers(mockUsers);
  }, []);
  const handleApproveInternship = (id: number) => {
    setPendingInternships(prev => prev.map(internship => internship.id === id ? {
      ...internship,
      status: 'approved'
    } : internship));
  };
  const handleRejectInternship = (id: number) => {
    setPendingInternships(prev => prev.map(internship => internship.id === id ? {
      ...internship,
      status: 'rejected'
    } : internship));
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon size={12} className="mr-1" />
            Pending
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
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'student':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Student
          </span>;
      case 'company':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Company
          </span>;
      case 'admin':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Admin
          </span>;
      default:
        return null;
    }
  };
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Dashboard Header */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6 text-white">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="mt-1">Welcome back, {(user as any)?.name}</p>
        </div>
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <UsersIcon size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Total Users
                </h3>
                <span className="text-lg font-semibold text-gray-900">
                  {users.length}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <BriefcaseIcon size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Companies</h3>
                <span className="text-lg font-semibold text-gray-900">
                  {users.filter(u => u.role === 'company').length}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <AlertCircleIcon size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Pending Approvals
                </h3>
                <span className="text-lg font-semibold text-gray-900">
                  {pendingInternships.filter(i => i.status === 'pending').length}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Dashboard Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button onClick={() => setActiveTab('dashboard')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'dashboard' ? 'border-gray-800 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Dashboard
            </button>
            <button onClick={() => setActiveTab('approvals')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'approvals' ? 'border-gray-800 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Content Approvals
            </button>
            <button onClick={() => setActiveTab('users')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'users' ? 'border-gray-800 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              User Management
            </button>
          </nav>
        </div>
        {/* Dashboard Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && <div>
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                System Overview
              </h2>
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-800 mb-3">
                  Recent Activity
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                      <UsersIcon size={16} className="text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-800">
                        New student registered:{' '}
                        <span className="font-medium">Jamie Smith</span>
                      </p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-purple-100 rounded-full p-2">
                      <BriefcaseIcon size={16} className="text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-800">
                        New internship posted:{' '}
                        <span className="font-medium">
                          Frontend Developer Intern
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                      <CheckCircleIcon size={16} className="text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-800">
                        Internship approved:{' '}
                        <span className="font-medium">UX/UI Design Intern</span>
                      </p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-3">
                    Pending Approvals
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {pendingInternships.filter(i => i.status === 'pending').length > 0 ? <div className="space-y-3">
                        {pendingInternships.filter(i => i.status === 'pending').slice(0, 3).map(internship => <div key={internship.id} className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm">
                              <div>
                                <p className="text-sm font-medium text-gray-800">
                                  {internship.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {internship.company} •{' '}
                                  {new Date(internship.postedDate).toLocaleDateString()}
                                </p>
                              </div>
                              <Link to={`/internship-approval/${internship.id}`} className="text-blue-600 hover:text-blue-800 text-sm">
                                Review
                              </Link>
                            </div>)}
                        {pendingInternships.filter(i => i.status === 'pending').length > 3 && <div className="text-center mt-2">
                            <button onClick={() => setActiveTab('approvals')} className="text-sm text-blue-600 hover:text-blue-800">
                              View all pending approvals
                            </button>
                          </div>}
                      </div> : <p className="text-sm text-gray-500 text-center py-4">
                        No pending approvals
                      </p>}
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-3">
                    User Statistics
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Total Students:
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          {users.filter(u => u.role === 'student').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Total Companies:
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          {users.filter(u => u.role === 'company').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Total Admins:
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          {users.filter(u => u.role === 'admin').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          New Users (Last 7 Days):
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          3
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Active Users:
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          {users.filter(u => u.status === 'active').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
          {activeTab === 'approvals' && <div>
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Content Approvals
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Internship
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingInternships.map(internship => <tr key={internship.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {internship.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {internship.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {internship.company}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {internship.location}
                          </div>
                          <div className="text-xs text-gray-500">
                            {internship.type} • Posted:{' '}
                            {new Date(internship.postedDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(internship.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {internship.status === 'pending' ? <div className="flex justify-end space-x-2">
                              <Link to={`/internship-approval/${internship.id}`} className="text-blue-600 hover:text-blue-900 flex items-center">
                                <EyeIcon size={16} className="mr-1" />
                                View
                              </Link>
                              <button onClick={() => handleRejectInternship(internship.id)} className="text-red-600 hover:text-red-900 flex items-center">
                                <XIcon size={16} className="mr-1" />
                                Reject
                              </button>
                              <button onClick={() => handleApproveInternship(internship.id)} className="text-green-600 hover:text-green-900 flex items-center">
                                <CheckIcon size={16} className="mr-1" />
                                Approve
                              </button>
                            </div> : <Link to={`/internship-approval/${internship.id}`} className="text-blue-600 hover:text-blue-900 flex items-center justify-end">
                              <EyeIcon size={16} className="mr-1" />
                              View
                            </Link>}
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </div>}
          {activeTab === 'users' && <div>
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                User Management
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Join Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {user.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(user.joinDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              View
                            </button>
                            {user.role !== 'admin' && <>
                                <button className="text-indigo-600 hover:text-indigo-900">
                                  Edit
                                </button>
                                {user.status === 'active' ? <button className="text-red-600 hover:text-red-900">
                                    Disable
                                  </button> : <button className="text-green-600 hover:text-green-900">
                                    Enable
                                  </button>}
                              </>}
                          </div>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};
export default AdminDashboard;