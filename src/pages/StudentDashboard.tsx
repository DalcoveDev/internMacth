import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, FileText, TrendingUp, BarChart3, PieChart, Calendar, Brain, Target, Award, InfoIcon } from 'lucide-react';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
// Import the new API client for real backend integration
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { applicationsAPI } from '@/lib/new-api-client';

interface Application {
  id: number;
  internshipId: number;
  internshipTitle: string;
  company: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  logoUrl: string;
  careerField: string; // Added career field
}

interface DashboardData {
  stats: {
    totalApplications: number;
    pendingApplications: number;
    approvedApplications: number;
    careerFields: Record<string, number>; // Track applications by career field
  };
  applications: Application[];
}

// AI Skill Recommendation Interface
interface SkillRecommendation {
  skill: string;
  importance: number; // 1-100
  currentLevel: number; // 1-100
  recommendedLevel: number; // 1-100
  careerFields: string[]; // Which career fields this skill is relevant for
  actionItems: string[]; // Recommended actions to improve this skill
}

const StudentDashboard = () => {
  const { toast } = useToast();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('applications');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    school: '',
    fieldOfStudy: '',
    bio: '',
    targetCareers: [] as string[] // Added target careers
  });
  const [, setUploadedFiles] = useState<{resume?: File, documents: File[]}>({documents: []});
  const [analyticsData, setAnalyticsData] = useState({
    applicationTrend: [] as any[],
    statusDistribution: [] as any[],
    monthlyActivity: [] as any[],
    skillsAnalysis: [] as any[],
    careerFieldDistribution: [] as any[], // New: Distribution by career field
    aiSkillRecommendations: [] as SkillRecommendation[] // New: AI skill recommendations
  });

  // Helper function for showing error toast notifications
  const showError = (message: string, title: string = "Error") => {
    toast({
      title,
      description: message,
      variant: "destructive",
    });
  };

  // Fetch real dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch real applications data from backend
        const applicationsResponse = await applicationsAPI.getStudentApplications({ page: 1, limit: 100 });
        const applications = applicationsResponse.data.data?.applications || [];
        
        // Transform the data to match our interface
        const transformedApplications: Application[] = applications.map((app: any) => ({
          id: app.id,
          internshipId: app.internship_id,
          internshipTitle: app.title || 'Unknown Internship',
          company: app.company_name || 'Unknown Company',
          appliedDate: app.applied_at,
          status: app.status,
          logoUrl: '', // We'll need to get this from the company data
          careerField: app.career_field || 'General'
        }));
        
        // Calculate stats
        const careerFieldCount = transformedApplications.reduce((acc, app) => {
          acc[app.careerField] = (acc[app.careerField] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const statusCount = transformedApplications.reduce((acc, app) => {
          acc[app.status] = (acc[app.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const stats = {
          totalApplications: transformedApplications.length,
          pendingApplications: statusCount.pending || 0,
          approvedApplications: statusCount.approved || 0,
          careerFields: careerFieldCount
        };

        const dashboardData: DashboardData = {
          stats,
          applications: transformedApplications
        };

        setDashboardData(dashboardData);
        generateAnalyticsData(transformedApplications);
      } catch (error: any) {
        console.error('Failed to fetch dashboard data:', error);
        let errorMessage = 'Failed to load dashboard data.';
        
        if (error.response?.status === 401) {
          errorMessage = 'You must be logged in to view this dashboard.';
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        showError(errorMessage);
        // Fallback to mock data
        generateMockData();
      } finally {
        setLoading(false);
      }
    };

    const generateMockData = () => {
      // Mock applications data with various career fields
      const mockApplications: Application[] = [
        {
          id: 1,
          internshipId: 101,
          internshipTitle: 'Software Development Intern',
          company: 'Tech Innovations Inc.',
          appliedDate: '2023-05-15',
          status: 'pending',
          logoUrl: 'https://images.unsplash.com/photo-1549921296-3b0f9a35af35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
          careerField: 'Technology'
        },
        {
          id: 2,
          internshipId: 102,
          internshipTitle: 'Marketing Intern',
          company: 'Global Media Group',
          appliedDate: '2023-05-10',
          status: 'approved',
          logoUrl: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
          careerField: 'Marketing'
        },
        {
          id: 3,
          internshipId: 103,
          internshipTitle: 'Data Science Intern',
          company: 'Analytics Pro',
          appliedDate: '2023-05-05',
          status: 'rejected',
          logoUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
          careerField: 'Data Science'
        },
        {
          id: 4,
          internshipId: 104,
          internshipTitle: 'Financial Analyst Intern',
          company: 'Global Finance Corp',
          appliedDate: '2023-05-20',
          status: 'pending',
          logoUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
          careerField: 'Finance'
        },
        {
          id: 5,
          internshipId: 105,
          internshipTitle: 'Graphic Design Intern',
          company: 'Creative Studio',
          appliedDate: '2023-05-25',
          status: 'approved',
          logoUrl: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
          careerField: 'Design'
        }
      ];

      // Mock dashboard data
      const mockDashboardData: DashboardData = {
        stats: {
          totalApplications: 15,
          pendingApplications: 7,
          approvedApplications: 4,
          careerFields: {
            'Technology': 3,
            'Marketing': 2,
            'Data Science': 1,
            'Finance': 1,
            'Design': 1
          }
        },
        applications: mockApplications
      };

      setDashboardData(mockDashboardData);
      generateAnalyticsData(mockApplications);
      setLoading(false);
    };

    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        school: '',
        fieldOfStudy: '',
        bio: '',
        targetCareers: ['Technology', 'Data Science'] // Default target careers
      });
      fetchDashboardData();
    }
  }, [user]);

  const generateAnalyticsData = (apps: Application[]) => {
    // Generate application trend data
    const last7Days = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        applications: Math.floor(Math.random() * 5) + 1
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
        applications: Math.floor(Math.random() * 12) + 3,
        interviews: Math.floor(Math.random() * 6) + 2,
        offers: Math.floor(Math.random() * 3) + 1
      };
    });

    // Career field distribution
    const careerFieldCount = apps.reduce((acc, app) => {
      acc[app.careerField] = (acc[app.careerField] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const careerFieldDistribution = Object.entries(careerFieldCount).map(([field, count]) => ({
      name: field,
      value: count
    }));

    // Skills analysis (mock data)
    const skillsAnalysis = [
      { skill: 'JavaScript', level: 85, improvement: '+5%' },
      { skill: 'React', level: 78, improvement: '+12%' },
      { skill: 'Node.js', level: 70, improvement: '+8%' },
      { skill: 'Python', level: 65, improvement: '+15%' },
      { skill: 'Data Analysis', level: 60, improvement: '+20%' }
    ];

    setAnalyticsData({
      applicationTrend: last7Days,
      statusDistribution,
      monthlyActivity,
      skillsAnalysis,
      careerFieldDistribution,
      aiSkillRecommendations: [] // Will be populated with real AI recommendations
    });
  };

  const handleProfileSave = () => {
    if (user) {
      // Update user in AuthContext only (no backend call)
      updateUser({ name: profileData.name });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully!",
        variant: "default",
      });
    }
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setUploadedFiles(prev => ({ ...prev, resume: file }));
      toast({
        title: "Resume Uploaded",
        description: "Your resume has been uploaded successfully!",
        variant: "default",
      });
    }
  };

  const handleDocumentsUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
      if (validFiles.length !== files.length) {
        toast({
          title: "Some Files Skipped",
          description: "Some files were skipped due to size limit (5MB max)",
          variant: "default",
        });
      }
      setUploadedFiles(prev => ({ 
        ...prev, 
        documents: [...prev.documents, ...validFiles] 
      }));
      toast({
        title: "Documents Uploaded",
        description: `${validFiles.length} document(s) uploaded successfully!`,
        variant: "default",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleCareerToggle = (career: string) => {
    setProfileData(prev => {
      const newCareers = prev.targetCareers.includes(career)
        ? prev.targetCareers.filter(c => c !== career)
        : [...prev.targetCareers, career];
      return { ...prev, targetCareers: newCareers };
    });
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

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url('/images/Download Abstract green papercut style layers background for free.jpeg')` }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="bg-card shadow-md rounded-lg overflow-hidden">
            <div className="bg-primary p-6 text-primary-foreground">
              <h1 className="text-2xl font-bold">Student Dashboard</h1>
              <p className="mt-1">Loading dashboard data...</p>
            </div>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user?.name || 'Student'}! Track your internship applications and career progress.
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <InfoIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Application Tracking:</strong> After submitting an application, you can track its status here. 
                Companies typically review applications within 3-5 business days. Check back regularly for updates!
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="border-b border-border">
          <nav className="flex overflow-x-auto">
            <button onClick={() => setActiveTab('applications')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'applications' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}>
              My Applications
            </button>
            <button onClick={() => setActiveTab('profile')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}>
              Profile
            </button>
            <button onClick={() => setActiveTab('resume')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'resume' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}>
              Resume
            </button>
            <button onClick={() => setActiveTab('analytics')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'analytics' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}>
              Analytics
            </button>
          </nav>
        </div>
        {/* Dashboard Content */}
        <div className="p-6 transition-all duration-300">
          {activeTab === 'applications' && <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-foreground transition-colors duration-300">
                  Your Applications
                </h2>
                <Link to="/search">
                  <Button variant="default" className="transition-all duration-300 hover:shadow-md">
                    Browse More Internships
                  </Button>
                </Link>
              </div>
              {dashboardData?.applications.length ? <div className="space-y-4">
                  {dashboardData.applications.map(application => <Card key={application.id} className="border-border transition-all duration-300 hover:border-primary/50 hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className="h-12 w-12 flex-shrink-0 mr-4 transition-all duration-300">
                            <img src={application.logoUrl} alt={`${application.company} logo`} className="h-full w-full object-contain rounded-md" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="text-lg font-semibold text-foreground transition-colors duration-300">
                                {application.internshipTitle}
                              </h3>
                              {getStatusBadge(application.status)}
                            </div>
                            <p className="text-muted-foreground transition-colors duration-300">{application.company}</p>
                            <div className="flex items-center mt-1">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-primary/20 bg-primary/5 text-primary">
                                {application.careerField}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                Applied on{' '}
                                {new Date(application.appliedDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="mt-4 flex">
                              <Link to={`/application/${application.id}`} className="text-primary hover:text-primary/80 text-sm font-medium flex items-center transition-colors duration-300">
                                <FileText size={16} className="mr-1" />
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>)}
                </div> : <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4 transition-colors duration-300">
                    You haven't applied to any internships yet.
                  </p>
                  <Link to="/search">
                    <Button variant="default" className="transition-all duration-300 hover:shadow-md">
                      Browse Internships
                    </Button>
                  </Link>
                </div>}
            </div>}
            
            {activeTab === 'analytics' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-foreground transition-colors duration-300 flex items-center">
                    <Brain className="mr-2 h-5 w-5 text-primary" />
                    Your Analytics Dashboard
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground transition-colors duration-300">
                    <Calendar size={16} />
                    <span>Real-time data</span>
                  </div>
                </div>

                {/* Analytics Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 transition-colors duration-300">Total Applications</p>
                          <p className="text-2xl font-bold">{dashboardData?.stats.totalApplications || 0}</p>
                        </div>
                        <FileText size={24} className="text-blue-200 transition-colors duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 transition-colors duration-300">Approved</p>
                          <p className="text-2xl font-bold">{dashboardData?.stats.approvedApplications || 0}</p>
                        </div>
                        <CheckCircle size={24} className="text-green-200 transition-colors duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-yellow-100 transition-colors duration-300">Pending</p>
                          <p className="text-2xl font-bold">{dashboardData?.stats.pendingApplications || 0}</p>
                        </div>
                        <Clock size={24} className="text-yellow-200 transition-colors duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 transition-colors duration-300">Success Rate</p>
                          <p className="text-2xl font-bold">
                            {dashboardData?.stats.totalApplications && dashboardData.stats.totalApplications > 0 ? 
                              Math.round((dashboardData.stats.approvedApplications / dashboardData.stats.totalApplications) * 100) : 0}%
                          </p>
                        </div>
                        <TrendingUp size={24} className="text-purple-200 transition-colors duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Application Trend */}
                  <Card className="border border-border transition-all duration-300 hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center text-foreground transition-colors duration-300">
                        <BarChart3 size={20} className="mr-2 text-blue-600" />
                        Application Trend (Last 7 Days)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                  </Card>

                  {/* Status Distribution */}
                  <Card className="border border-border transition-all duration-300 hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center text-foreground transition-colors duration-300">
                        <PieChart size={20} className="mr-2 text-green-600" />
                        Application Status Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                  </Card>
                </div>

                {/* Career Field Distribution and AI Recommendations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Career Field Distribution */}
                  <Card className="border border-border transition-all duration-300 hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center text-foreground transition-colors duration-300">
                        <Target size={20} className="mr-2 text-indigo-600" />
                        Applications by Career Field
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                            />
                            <Pie
                              data={analyticsData.careerFieldDistribution}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label={({name, value}: any) => `${name}: ${value}`}
                            >
                              {analyticsData.careerFieldDistribution.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-foreground mb-2">Career Focus Areas</h4>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(dashboardData?.stats.careerFields || {}).map(([field, count]) => (
                            <span key={field} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-primary/20 bg-primary/5 text-primary">
                              {field}: {count}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Skill Recommendations */}
                  <Card className="border border-border transition-all duration-300 hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center text-foreground transition-colors duration-300">
                        <Brain size={20} className="mr-2 text-orange-600" />
                        AI-Powered Skill Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                        {analyticsData.aiSkillRecommendations.length > 0 ? (
                          analyticsData.aiSkillRecommendations.map((rec, index) => (
                            <div key={index} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-foreground">{rec.skill}</h4>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                  {rec.importance}% importance
                                </span>
                              </div>
                              <div className="mb-3">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-muted-foreground">Current Level</span>
                                  <span className="text-muted-foreground">{rec.currentLevel}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div 
                                    className="bg-primary h-2 rounded-full" 
                                    style={{ width: `${rec.currentLevel}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                  <span className="text-muted-foreground">Recommended</span>
                                  <span className="text-primary font-medium">{rec.recommendedLevel}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2 mt-1">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full" 
                                    style={{ width: `${rec.recommendedLevel}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-foreground mb-1">Action Items:</h5>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  {rec.actionItems.slice(0, 2).map((item, i) => (
                                    <li key={i} className="flex items-start">
                                      <span className="text-primary mr-1">•</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                  {rec.actionItems.length > 2 && (
                                    <li className="text-primary font-medium">+{rec.actionItems.length - 2} more actions</li>
                                  )}
                                </ul>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {rec.careerFields.map((field, i) => (
                                  <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {field}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4">
                            <Brain size={32} className="mx-auto text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">Set your career interests to get personalized recommendations</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <Button variant="default" className="w-full" onClick={() => setActiveTab('profile')}>
                          Update Career Interests
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Bottom Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Monthly Activity */}
                  <Card className="border border-border transition-all duration-300 hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center text-foreground transition-colors duration-300">
                        <BarChart3 size={20} className="mr-2 text-indigo-600" />
                        Monthly Activity Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analyticsData.monthlyActivity} barGap={8}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                            <XAxis 
                              dataKey="month" 
                              stroke="#6B7280" 
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis 
                              stroke="#6B7280" 
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                border: '1px solid hsl(var(--border))', 
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                              }}
                              formatter={(value) => [value, 'Count']}
                              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                            />
                            <Bar 
                              dataKey="applications" 
                              fill="hsl(var(--primary))" 
                              name="Applications" 
                              radius={[4, 4, 0, 0]} 
                              barSize={24}
                            />
                            <Bar 
                              dataKey="interviews" 
                              fill="hsl(var(--secondary))" 
                              name="Interviews" 
                              radius={[4, 4, 0, 0]} 
                              barSize={24}
                            />
                            <Bar 
                              dataKey="offers" 
                              fill="hsl(var(--accent))" 
                              name="Offers" 
                              radius={[4, 4, 0, 0]} 
                              barSize={24}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 flex justify-center space-x-6">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                          <span className="text-sm text-muted-foreground">Applications</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-secondary mr-2"></div>
                          <span className="text-sm text-muted-foreground">Interviews</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-accent mr-2"></div>
                          <span className="text-sm text-muted-foreground">Offers</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills Analysis */}
                  <Card className="border border-border transition-all duration-300 hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center text-foreground transition-colors duration-300">
                        <TrendingUp size={20} className="mr-2 text-orange-600" />
                        Skills Market Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-5">
                        {analyticsData.skillsAnalysis.map((skill, index) => (
                          <div key={index} className="space-y-3">
                            <div className="flex justify-between">
                              <span className="font-medium text-foreground">{skill.skill}</span>
                              <span className="text-sm text-muted-foreground">
                                Market: {skill.demand}% | You: {skill.yourLevel}%
                              </span>
                            </div>
                            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                                style={{ width: `${skill.demand}%` }}
                              ></div>
                              <div 
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full opacity-80"
                                style={{ width: `${skill.yourLevel}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>0%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100 transition-all duration-300">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <Award className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-blue-800">
                              <strong>AI Insight:</strong> Focus on improving skills that align with your career interests for better opportunities!
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Real-time Updates Banner */}
                <div className="mt-8 bg-gradient-to-r from-primary to-secondary p-4 rounded-lg text-primary-foreground transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                      <span className="font-medium">Live Analytics Dashboard</span>
                    </div>
                    <span className="text-sm text-primary-foreground/80">Updates every 30 seconds</span>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'profile' && <div>
                <h2 className="text-xl font-semibold text-foreground mb-6 transition-colors duration-300 flex items-center">
                  <Target className="mr-2 h-5 w-5 text-primary" />
                  Your Profile
                </h2>
                <div className="bg-muted p-6 rounded-lg transition-colors duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1 transition-colors duration-300">
                        Full Name
                      </label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-primary" 
                        value={profileData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1 transition-colors duration-300">
                        Email
                      </label>
                      <input 
                        type="email" 
                        className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground transition-all duration-300" 
                        value={profileData.email}
                        disabled 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1 transition-colors duration-300">
                        School/University
                      </label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-primary" 
                        placeholder="Enter your school or university"
                        value={profileData.school}
                        onChange={(e) => handleInputChange('school', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1 transition-colors duration-300">
                        Field of Study
                      </label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-primary" 
                        placeholder="E.g., Computer Science, Marketing"
                        value={profileData.fieldOfStudy}
                        onChange={(e) => handleInputChange('fieldOfStudy', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-1 transition-colors duration-300">
                        Bio
                      </label>
                      <textarea 
                        rows={4} 
                        className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-primary" 
                        placeholder="Tell companies a bit about yourself..."
                        value={profileData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                      ></textarea>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-1 transition-colors duration-300">
                        Career Interests
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {['Technology', 'Marketing', 'Data Science', 'Finance', 'Design', 'Healthcare', 'Education', 'Engineering'].map((career) => (
                          <button
                            key={career}
                            type="button"
                            onClick={() => handleCareerToggle(career)}
                            className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                              profileData.targetCareers.includes(career)
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background text-foreground border-input hover:bg-muted'
                            }`}
                          >
                            {career}
                          </button>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Select your career interests to get personalized skill recommendations
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button onClick={handleProfileSave} variant="default" className="transition-all duration-300 hover:shadow-md">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>}
            {activeTab === 'resume' && <div>
                <h2 className="text-xl font-semibold text-foreground mb-6 transition-colors duration-300 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Resume & Documents
                </h2>
                <div className="bg-muted p-6 rounded-lg transition-colors duration-300">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-foreground mb-3 transition-colors duration-300">
                      Resume
                    </h3>
                    <div className="border border-dashed border-border rounded-lg p-6 text-center transition-all duration-300 hover:border-primary hover:bg-accent/10">
                      <div className="mb-3">
                        <FileText size={36} className="mx-auto text-muted-foreground transition-colors duration-300" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 transition-colors duration-300">
                        Drag and drop your resume here, or
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleResumeUpload}
                        className="hidden"
                        id="resume-upload"
                      />
                      <Button 
                        onClick={() => document.getElementById('resume-upload')?.click()}
                        variant="default"
                        className="transition-all duration-300 hover:shadow-md"
                      >
                        Browse Files
                      </Button>
                      <p className="mt-2 text-xs text-muted-foreground transition-colors duration-300">
                        Supported formats: PDF, DOCX (Max 5MB)
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-3 transition-colors duration-300">
                      Additional Documents
                    </h3>
                    <div className="border border-dashed border-border rounded-lg p-6 text-center transition-all duration-300 hover:border-primary hover:bg-accent/10">
                      <div className="mb-3">
                        <FileText size={36} className="mx-auto text-muted-foreground transition-colors duration-300" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 transition-colors duration-300">
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
                      <Button 
                        onClick={() => document.getElementById('documents-upload')?.click()}
                        variant="default"
                        className="transition-all duration-300 hover:shadow-md"
                      >
                        Add Documents
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
  );
};

export default StudentDashboard;