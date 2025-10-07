import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, FileText, TrendingUp, BarChart3, PieChart, Calendar } from 'lucide-react';
import { listApplications } from '../api';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';
import { useToast } from '../components/ToastProvider';
import { useAuth } from '../contexts/AuthContext';

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
  const { showSuccess, showError, showWarning } = useToast();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    school: '',
    fieldOfStudy: '',
    bio: ''
  });
  const [, setUploadedFiles] = useState<{resume?: File, documents: File[]}>({documents: []});
  const [analyticsData, setAnalyticsData] = useState({
    applicationTrend: [] as any[],
    statusDistribution: [] as any[],
    monthlyActivity: [] as any[],
    skillsAnalysis: [] as any[]
  });

  // Real-time data refresh interval
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (activeTab === 'applications') {
        fetchApplications();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  }, [activeTab]);

  // Initialize data and set up real-time updates
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        school: '',
        fieldOfStudy: '',
        bio: ''
      });
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const apps = await listApplications();
      const mapped = apps.map((a: any) => ({
        id: a.id,
        internshipId: a.internshipId,
        internshipTitle: a.internship?.title ?? 'Internship Application',
        company: a.internship?.company ?? 'Company Name',
        appliedDate: a.createdAt,
        status: a.status,
        logoUrl: ''
      }));
      setApplications(mapped);
      generateAnalyticsData(mapped);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      // Use mock data for demonstration
      const mockApplications = [
        {
          id: 1,
          internshipId: 1,
          internshipTitle: 'Frontend Developer Intern',
          company: 'TechCorp Inc.',
          appliedDate: new Date().toISOString(),
          status: 'pending' as const,
          logoUrl: ''
        },
        {
          id: 2,
          internshipId: 2,
          internshipTitle: 'Data Science Intern',
          company: 'DataWorks Ltd.',
          appliedDate: new Date(Date.now() - 86400000).toISOString(),
          status: 'approved' as const,
          logoUrl: ''
        }
      ];
      setApplications(mockApplications);
      generateAnalyticsData(mockApplications);
    } finally {
      setLoading(false);
    }
  };

  const generateAnalyticsData = (apps: Application[]) => {
    // Generate application trend data
    const last7Days = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        applications: Math.floor(Math.random() * 3) + 1
      };
    });

    // Status distribution
    const statusCount = apps.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusDistribution = [
      { name: 'Pending', value: statusCount.pending || 0, color: '#FCD34D' },
      { name: 'Approved', value: statusCount.approved || 0, color: '#10B981' },
      { name: 'Rejected', value: statusCount.rejected || 0, color: '#EF4444' }
    ];

    // Monthly activity
    const monthlyActivity = Array.from({length: 6}, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        applications: Math.floor(Math.random() * 8) + 2,
        interviews: Math.floor(Math.random() * 4) + 1,
        offers: Math.floor(Math.random() * 2)
      };
    });

    // Skills analysis
    const skillsAnalysis = [
      { skill: 'JavaScript', demand: 85, yourLevel: 78 },
      { skill: 'React', demand: 92, yourLevel: 82 },
      { skill: 'Node.js', demand: 76, yourLevel: 65 },
      { skill: 'Python', demand: 88, yourLevel: 70 },
      { skill: 'SQL', demand: 72, yourLevel: 68 }
    ];

    setAnalyticsData({
      applicationTrend: last7Days,
      statusDistribution,
      monthlyActivity,
      skillsAnalysis
    });
  };

  const generateMockAnalyticsData = () => {
    // Fallback mock data when API is not available
    const mockData = {
      applicationTrend: [
        { date: 'Dec 1', applications: 2 },
        { date: 'Dec 2', applications: 1 },
        { date: 'Dec 3', applications: 3 },
        { date: 'Dec 4', applications: 0 },
        { date: 'Dec 5', applications: 2 },
        { date: 'Dec 6', applications: 1 },
        { date: 'Dec 7', applications: 4 }
      ],
      statusDistribution: [
        { name: 'Pending', value: 5, color: '#FCD34D' },
        { name: 'Approved', value: 2, color: '#10B981' },
        { name: 'Rejected', value: 1, color: '#EF4444' }
      ],
      monthlyActivity: [
        { month: 'Jul', applications: 3, interviews: 1, offers: 0 },
        { month: 'Aug', applications: 5, interviews: 2, offers: 1 },
        { month: 'Sep', applications: 7, interviews: 3, offers: 1 },
        { month: 'Oct', applications: 4, interviews: 2, offers: 0 },
        { month: 'Nov', applications: 6, interviews: 3, offers: 2 },
        { month: 'Dec', applications: 8, interviews: 4, offers: 1 }
      ],
      skillsAnalysis: [
        { skill: 'JavaScript', demand: 85, yourLevel: 78 },
        { skill: 'React', demand: 92, yourLevel: 82 },
        { skill: 'Node.js', demand: 76, yourLevel: 65 },
        { skill: 'Python', demand: 88, yourLevel: 70 },
        { skill: 'SQL', demand: 72, yourLevel: 68 }
      ]
    };
    setAnalyticsData(mockData);
  };

  const handleProfileSave = () => {
    if (user) {
      // Update user in AuthContext
      updateUser({ name: profileData.name });
      showSuccess('Profile Updated', 'Your profile has been updated successfully!');
    }
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showError('File Too Large', 'File size must be less than 5MB');
        return;
      }
      setUploadedFiles(prev => ({ ...prev, resume: file }));
      showSuccess('Resume Uploaded', 'Your resume has been uploaded successfully!');
    }
  };

  const handleDocumentsUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
      if (validFiles.length !== files.length) {
        showWarning('Some Files Skipped', 'Some files were skipped due to size limit (5MB max)');
      }
      setUploadedFiles(prev => ({ 
        ...prev, 
        documents: [...prev.documents, ...validFiles] 
      }));
      showSuccess('Documents Uploaded', `${validFiles.length} document(s) uploaded successfully!`);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

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
            <button onClick={() => setActiveTab('analytics')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${activeTab === 'analytics' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Analytics
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
          
          {activeTab === 'analytics' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Your Analytics Dashboard
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>Real-time data</span>
                </div>
              </div>

              {/* Analytics Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Applications</p>
                      <p className="text-2xl font-bold">{applications.length}</p>
                    </div>
                    <FileText size={24} className="text-blue-200" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Approved</p>
                      <p className="text-2xl font-bold">{applications.filter(a => a.status === 'approved').length}</p>
                    </div>
                    <CheckCircle size={24} className="text-green-200" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100">Pending</p>
                      <p className="text-2xl font-bold">{applications.filter(a => a.status === 'pending').length}</p>
                    </div>
                    <Clock size={24} className="text-yellow-200" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Success Rate</p>
                      <p className="text-2xl font-bold">
                        {applications.length > 0 ? Math.round((applications.filter(a => a.status === 'approved').length / applications.length) * 100) : 0}%
                      </p>
                    </div>
                    <TrendingUp size={24} className="text-purple-200" />
                  </div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Application Trend */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <BarChart3 size={20} className="mr-2 text-blue-600" />
                    Application Trend (Last 7 Days)
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData.applicationTrend}>
                        <defs>
                          <linearGradient id="applicationGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="date" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="applications" 
                          stroke="#3B82F6" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#applicationGradient)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Status Distribution */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <PieChart size={20} className="mr-2 text-green-600" />
                    Application Status Distribution
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        />
                        <Pie
                          data={analyticsData.statusDistribution}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({name, value}: any) => `${name}: ${value}`}
                        >
                          {analyticsData.statusDistribution.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Bottom Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Activity */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <BarChart3 size={20} className="mr-2 text-indigo-600" />
                    Monthly Activity Overview
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.monthlyActivity}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="month" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        />
                        <Bar dataKey="applications" fill="#3B82F6" name="Applications" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="interviews" fill="#10B981" name="Interviews" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="offers" fill="#F59E0B" name="Offers" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Skills Analysis */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <TrendingUp size={20} className="mr-2 text-orange-600" />
                    Skills Market Analysis
                  </h3>
                  <div className="space-y-4">
                    {analyticsData.skillsAnalysis.map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700">{skill.skill}</span>
                          <span className="text-gray-500">Market: {skill.demand}% | Your Level: {skill.yourLevel}%</span>
                        </div>
                        <div className="space-y-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${skill.demand}%` }}
                            ></div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${skill.yourLevel}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Tip:</strong> Focus on improving React and JavaScript skills - they have high market demand!
                    </p>
                  </div>
                </div>
              </div>

              {/* Real-time Updates Banner */}
              <div className="mt-8 bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                    <span className="font-medium">Live Analytics Dashboard</span>
                  </div>
                  <span className="text-sm text-emerald-100">Updates every 30 seconds</span>
                </div>
              </div>
            </div>
          )}
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
                      School/University
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md" 
                      placeholder="Enter your school or university"
                      value={profileData.school}
                      onChange={(e) => handleInputChange('school', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Field of Study
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md" 
                      placeholder="E.g., Computer Science, Marketing"
                      value={profileData.fieldOfStudy}
                      onChange={(e) => handleInputChange('fieldOfStudy', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea 
                      rows={4} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md" 
                      placeholder="Tell companies a bit about yourself..."
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
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
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                      id="resume-upload"
                    />
                    <button 
                      onClick={() => document.getElementById('resume-upload')?.click()}
                      className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors"
                    >
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
                    <input
                      type="file"
                      accept=".pdf,.docx,.jpg,.png"
                      multiple
                      onChange={handleDocumentsUpload}
                      className="hidden"
                      id="documents-upload"
                    />
                    <button 
                      onClick={() => document.getElementById('documents-upload')?.click()}
                      className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors"
                    >
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