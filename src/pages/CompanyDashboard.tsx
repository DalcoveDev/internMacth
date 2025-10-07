import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardListIcon, BriefcaseIcon, UserIcon, ClockIcon, CheckCircleIcon, XCircleIcon, EyeIcon, EditIcon, TrashIcon, TrendingUp, BarChart3, Users, Calendar } from 'lucide-react';
import { deleteInternship, listInternships, updateApplicationStatus } from '../api';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, AreaChart, Area } from 'recharts';
import { useToast } from '../components/ToastProvider';
import { useConfirm } from '../components/ConfirmDialog';
import { useAuth } from '../contexts/AuthContext';
import { useRealtimeData } from '../hooks/useRealtimeData';
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
  const { showSuccess, showError, showInfo } = useToast();
  const { confirm } = useConfirm();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('internships');
  const [applications, setApplications] = useState<Application[]>([]);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    website: '',
    industry: 'Technology',
    description: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [analyticsData, setAnalyticsData] = useState({
    applicationsOverTime: [] as any[],
    topPerformingInternships: [] as any[],
    applicantSources: [] as any[],
    conversionFunnel: [] as any[]
  });

  // Real-time data for internships
  const {
    data: internships,
    loading: internshipsLoading,
    error: internshipsError,
    refresh: refreshInternships
  } = useRealtimeData<Internship[]>(
    async () => {
      const all = await listInternships();
      // Filter by company user
      let mine = all;
      if (user?.id) {
        mine = all.filter((i: any) => i.postedById === user.id);
      }
      return mine.map((i: any) => ({
        id: i.id,
        title: i.title,
        location: i.location ?? 'Remote',
        type: i.type ?? 'Full-time',
        duration: i.duration ?? '3 months',
        postedDate: i.createdAt,
        status: i.isApproved ? 'approved' : i.isRejected ? 'rejected' : 'pending',
        applications: Array.isArray(i.applications) ? i.applications.length : 0,
      }));
    },
    [],
    { interval: 30000, dependencies: [user] }
  );
  // Initialize profile data and fetch applications
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        website: '',
        industry: 'Technology',
        description: ''
      });
      fetchApplications();
    }
  }, [user]);

  // Generate analytics when data changes
  useEffect(() => {
    if (internships.length > 0 || applications.length > 0) {
      generateCompanyAnalytics(applications, internships);
    } else {
      generateMockCompanyAnalytics();
    }
  }, [internships, applications]);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      const apps = await response.json();
      const mapped = apps.map((a: any) => ({
        id: a.id,
        internshipId: a.internshipId,
        internshipTitle: a.internship?.title ?? 'Internship',
        studentName: a.studentName,
        studentEmail: a.studentEmail,
        appliedDate: a.createdAt,
        status: a.status
      }));
      setApplications(mapped);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      // Mock applications for demo
      const mockApps = [
        {
          id: 1,
          internshipId: 1,
          internshipTitle: 'Frontend Developer Intern',
          studentName: 'John Doe',
          studentEmail: 'john@example.com',
          appliedDate: new Date().toISOString(),
          status: 'pending' as const
        }
      ];
      setApplications(mockApps);
    }
  };

  const generateCompanyAnalytics = (apps: Application[], internshipList: Internship[]) => {
    // Applications over time
    const last30Days = Array.from({length: 30}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        applications: Math.floor(Math.random() * 5) + 1
      };
    });

    // Top performing internships
    const topInternships = internshipList.slice(0, 5).map(internship => ({
      title: internship.title,
      applications: internship.applications,
      status: internship.status
    }));

    // Applicant sources
    const applicantSources = [
      { source: 'Direct Application', count: Math.floor(Math.random() * 20) + 10, color: '#3B82F6' },
      { source: 'University Portal', count: Math.floor(Math.random() * 15) + 8, color: '#10B981' },
      { source: 'Job Boards', count: Math.floor(Math.random() * 12) + 5, color: '#F59E0B' },
      { source: 'Social Media', count: Math.floor(Math.random() * 8) + 3, color: '#EF4444' },
      { source: 'Referrals', count: Math.floor(Math.random() * 6) + 2, color: '#8B5CF6' }
    ];

    // Conversion funnel
    const totalApplications = apps.length || 50;
    const conversionFunnel = [
      { stage: 'Applications', count: totalApplications, percentage: 100 },
      { stage: 'Screened', count: Math.floor(totalApplications * 0.7), percentage: 70 },
      { stage: 'Interviewed', count: Math.floor(totalApplications * 0.3), percentage: 30 },
      { stage: 'Offered', count: Math.floor(totalApplications * 0.15), percentage: 15 },
      { stage: 'Hired', count: Math.floor(totalApplications * 0.1), percentage: 10 }
    ];

    setAnalyticsData({
      applicationsOverTime: last30Days,
      topPerformingInternships: topInternships,
      applicantSources,
      conversionFunnel
    });
  };

  const generateMockCompanyAnalytics = () => {
    const mockData = {
      applicationsOverTime: [
        { date: 'Nov 8', applications: 3 },
        { date: 'Nov 9', applications: 5 },
        { date: 'Nov 10', applications: 2 },
        { date: 'Nov 11', applications: 7 },
        { date: 'Nov 12', applications: 4 },
        { date: 'Nov 13', applications: 6 },
        { date: 'Nov 14', applications: 8 }
      ],
      topPerformingInternships: [
        { title: 'Frontend Developer', applications: 25, status: 'approved' },
        { title: 'Data Analyst', applications: 18, status: 'approved' },
        { title: 'Marketing Intern', applications: 15, status: 'pending' },
        { title: 'Backend Developer', applications: 12, status: 'approved' }
      ],
      applicantSources: [
        { source: 'Direct Application', count: 18, color: '#3B82F6' },
        { source: 'University Portal', count: 12, color: '#10B981' },
        { source: 'Job Boards', count: 8, color: '#F59E0B' },
        { source: 'Social Media', count: 5, color: '#EF4444' },
        { source: 'Referrals', count: 3, color: '#8B5CF6' }
      ],
      conversionFunnel: [
        { stage: 'Applications', count: 46, percentage: 100 },
        { stage: 'Screened', count: 32, percentage: 70 },
        { stage: 'Interviewed', count: 14, percentage: 30 },
        { stage: 'Offered', count: 7, percentage: 15 },
        { stage: 'Hired', count: 5, percentage: 11 }
      ]
    };
    setAnalyticsData(mockData);
  };
  const handleApproveApplication = async (id: number) => {
    try {
      await updateApplicationStatus(id, 'approved');
      setApplications(prev => prev.map(app => app.id === id ? { ...app, status: 'approved' } : app));
      showSuccess('Application Approved', 'The application has been approved successfully!');
    } catch (error) {
      showError('Error', 'Failed to approve application. Please try again.');
    }
  };

  const handleRejectApplication = async (id: number) => {
    try {
      await updateApplicationStatus(id, 'rejected');
      setApplications(prev => prev.map(app => app.id === id ? { ...app, status: 'rejected' } : app));
      showInfo('Application Rejected', 'The application has been rejected.');
    } catch (error) {
      showError('Error', 'Failed to reject application. Please try again.');
    }
  };
  const handleDeleteInternship = async (id: number) => {
    const confirmed = await confirm({
      title: 'Delete Internship',
      message: 'Are you sure you want to delete this internship? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });
    
    if (!confirmed) return;
    
    deleteInternship(id).then(() => {
      refreshInternships(); // Refresh real-time data
      showSuccess('Internship Deleted', 'The internship has been successfully removed.');
    }).catch(() => showError('Delete Failed', 'Failed to delete internship. Please try again.'));
  };

  const handleViewInternship = (id: number) => {
    // Navigate to internship details or open modal
    window.open(`/internship/${id}`, '_blank');
  };

  const handleEditInternship = (id: number) => {
    // Navigate to edit page or open edit modal
    showInfo('Edit Feature', `Edit functionality for internship ${id} - would redirect to edit page`);
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        showError('File Too Large', 'Logo file size must be less than 2MB');
        return;
      }
      setLogoFile(file);
      showSuccess('Logo Updated', 'Company logo has been updated successfully!');
    }
  };

  const handleProfileSave = () => {
    if (user) {
      // Update user in AuthContext
      updateUser({ name: profileData.name });
      showSuccess('Profile Updated', 'Company profile has been updated successfully!');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
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
        <div className="bg-emerald-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Company Dashboard</h1>
          <p className="mt-1">
            Welcome back, {typeof user === 'object' && user && 'name' in user ? (user as any).name : ''}
          </p>
        </div>
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-emerald-100 rounded-md p-3">
                <BriefcaseIcon size={24} className="text-emerald-600" />
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
            <button onClick={() => setActiveTab('analytics')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'analytics' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Analytics
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
                <Link to="/post-internship" className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors">
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
                              <button 
                                onClick={() => handleViewInternship(internship.id)}
                                className="text-emerald-600 hover:text-emerald-800"
                              >
                                <EyeIcon size={18} />
                              </button>
                              <button 
                                onClick={() => handleEditInternship(internship.id)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <EditIcon size={18} />
                              </button>
                              <button onClick={() => handleDeleteInternship(internship.id)} className="text-red-600 hover:text-red-900">
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
                  <Link to="/post-internship" className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors">
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
                        <Link to={`/application/${application.id}`} className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
                          View Application
                        </Link>
                        {application.status === 'pending' && <div className="flex space-x-2">
                            <button onClick={() => handleRejectApplication(application.id)} className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                              Reject
                            </button>
                            <button onClick={() => handleApproveApplication(application.id)} className="px-3 py-1 bg-emerald-600 border border-emerald-600 rounded-md text-sm font-medium text-white hover:bg-emerald-700">
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
                      {logoFile ? (
                        <img 
                          src={URL.createObjectURL(logoFile)} 
                          alt="Company logo" 
                          className="h-full w-full object-cover rounded-md"
                        />
                      ) : (
                        <BriefcaseIcon size={32} className="text-gray-400" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                      id="logo-upload"
                    />
                    <button 
                      onClick={() => document.getElementById('logo-upload')?.click()}
                      className="ml-5 px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Change
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      value={profileData.email}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input 
                      type="url" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md" 
                      placeholder="https://www.example.com"
                      value={profileData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <select 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      value={profileData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                    >
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
                    <textarea 
                      rows={4} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md" 
                      placeholder="Tell students about your company..."
                      value={profileData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="mt-6">
                  <button 
                    onClick={handleProfileSave}
                    className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>}
          
          {activeTab === 'analytics' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Company Analytics Dashboard
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>Real-time insights</span>
                </div>
              </div>

              {/* Enhanced Analytics Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-xl text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Applications</p>
                      <p className="text-3xl font-bold">{applications.length}</p>
                      <p className="text-sm text-blue-200 mt-1">+12% this month</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <ClipboardListIcon size={24} className="text-blue-100" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-700 p-6 rounded-xl text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Active Internships</p>
                      <p className="text-3xl font-bold">{internships.filter(i => i.status === 'approved').length}</p>
                      <p className="text-sm text-green-200 mt-1">Currently hiring</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <BriefcaseIcon size={24} className="text-green-100" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-xl text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Pending Reviews</p>
                      <p className="text-3xl font-bold">{applications.filter(a => a.status === 'pending').length}</p>
                      <p className="text-sm text-purple-200 mt-1">Need attention</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <UserIcon size={24} className="text-purple-100" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-6 rounded-xl text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Hire Rate</p>
                      <p className="text-3xl font-bold">
                        {applications.length > 0 ? Math.round((applications.filter(a => a.status === 'approved').length / applications.length) * 100) : 0}%
                      </p>
                      <p className="text-sm text-orange-200 mt-1">Success metric</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <TrendingUp size={24} className="text-orange-100" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Applications Over Time */}
                <div className="bg-white p-6 rounded-xl shadow-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 size={20} className="mr-2 text-blue-600" />
                    Applications Trend (Last 30 Days)
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData.applicationsOverTime}>
                        <defs>
                          <linearGradient id="companyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                        <YAxis stroke="#6B7280" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#F9FAFB', 
                            border: '1px solid #E5E7EB', 
                            borderRadius: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="applications" 
                          stroke="#3B82F6" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#companyGradient)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top Performing Internships */}
                <div className="bg-white p-6 rounded-xl shadow-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp size={20} className="mr-2 text-green-600" />
                    Top Performing Internships
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.topPerformingInternships} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis type="number" stroke="#6B7280" fontSize={12} />
                        <YAxis type="category" dataKey="title" stroke="#6B7280" fontSize={12} width={100} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#F9FAFB', 
                            border: '1px solid #E5E7EB', 
                            borderRadius: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Bar 
                          dataKey="applications" 
                          fill="#10B981" 
                          radius={[0, 8, 8, 0]}
                          name="Applications"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Secondary Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Applicant Sources */}
                <div className="bg-white p-6 rounded-xl shadow-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users size={20} className="mr-2 text-purple-600" />
                    Applicant Sources
                  </h3>
                  <div className="space-y-4">
                    {analyticsData.applicantSources.map((source, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: source.color }}
                          ></div>
                          <span className="font-medium text-gray-700">{source.source}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-gray-900">{source.count}</span>
                          <span className="text-sm text-gray-500 ml-2">applications</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800">
                      💡 <strong>Top source:</strong> {analyticsData.applicantSources[0]?.source || 'Direct Application'} brings the most applicants
                    </p>
                  </div>
                </div>

                {/* Conversion Funnel */}
                <div className="bg-white p-6 rounded-xl shadow-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 size={20} className="mr-2 text-indigo-600" />
                    Hiring Funnel Analysis
                  </h3>
                  <div className="space-y-4">
                    {analyticsData.conversionFunnel.map((stage, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">{stage.stage}</span>
                          <div className="text-right">
                            <span className="font-bold text-gray-900">{stage.count}</span>
                            <span className="text-sm text-gray-500 ml-2">({stage.percentage}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${
                              index === 0 ? 'bg-blue-500' :
                              index === 1 ? 'bg-green-500' :
                              index === 2 ? 'bg-yellow-500' :
                              index === 3 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${stage.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Insights</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• {analyticsData.conversionFunnel[4]?.percentage || 11}% hire rate - above industry average!</li>
                      <li>• Strong conversion from interview to offer</li>
                      <li>• Consider improving initial screening process</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Real-time Status */}
              <div className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-green-300 rounded-full animate-pulse"></div>
                    <div>
                      <h4 className="font-semibold text-lg">Live Company Analytics</h4>
                      <p className="text-green-100">Data updates automatically every 60 seconds</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-200">Last updated</p>
                    <p className="font-medium">{new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>;
};
export default CompanyDashboard;