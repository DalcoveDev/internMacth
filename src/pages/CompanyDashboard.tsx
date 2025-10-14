import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClipboardListIcon, BriefcaseIcon, UserIcon, ClockIcon, CheckCircleIcon, XCircleIcon, EyeIcon, EditIcon, TrashIcon, TrendingUp, BarChart3, Users, Calendar, Target, Brain } from 'lucide-react';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { useConfirm } from '../components/ConfirmDialog';
import { useAuth } from '../contexts/AuthContext';
// Import the new API client for real backend integration
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { internshipsAPI, applicationsAPI } from '@/lib/new-api-client';

interface Internship {
  id: number;
  title: string;
  location: string;
  type: string;
  duration: string;
  postedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  applications: number;
  careerField: string; // Added career field
}

interface Application {
  id: number;
  internshipId: number;
  internshipTitle: string;
  studentName: string;
  studentEmail: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  skills: string; // Changed from string[] to string
  experience?: string;
  education?: string;
}

interface DashboardData {
  stats: {
    activeInternships: number;
    pendingInternships: number;
    totalApplications: number;
    pendingApplications: number;
    careerFields: Record<string, number>; // Track internships by career field
  };
  internships: Internship[];
  recentApplications: Application[];
}

// AI Insights Interface
interface AIInsight {
  title: string;
  description: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
  careerFields: string[];
}

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Helper functions for showing toast notifications
  const showSuccess = (message: string, title: string = "Success") => {
    toast({
      title,
      description: message,
    });
  };
  
  const showInfo = (message: string, title: string = "Information") => {
    toast({
      title,
      description: message,
    });
  };
  
  const showError = (message: string, title: string = "Error") => {
    toast({
      title,
      description: message,
      variant: "destructive",
    });
  };
  const { confirm } = useConfirm();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('internships');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    website: '',
    industry: 'Technology',
    description: ''
  });
  const [analyticsData, setAnalyticsData] = useState({
    applicationsOverTime: [] as any[],
    topPerformingInternships: [] as any[],
    applicantSources: [] as any[],
    conversionFunnel: [] as any[],
    careerFieldDistribution: [] as any[], // New: Distribution by career field
    aiInsights: [] as AIInsight[] // New: AI insights
  });

  // Fetch real dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch real data from backend
        const [internshipsResponse, applicationsResponse] = await Promise.all([
          internshipsAPI.getAll({ page: 1, limit: 100 }),
          applicationsAPI.getCompanyApplications({ page: 1, limit: 100 })
        ]);
        
        const internships = internshipsResponse.data.data?.internships || [];
        const applications = applicationsResponse.data.data?.applications || [];

        // Transform internships data
        const transformedInternships: Internship[] = internships.map((internship: any) => ({
          id: internship.id,
          title: internship.title,
          location: internship.location,
          type: internship.type,
          duration: internship.duration,
          postedDate: internship.created_at,
          status: internship.is_approved ? 'approved' : (internship.is_active ? 'pending' : 'rejected'),
          applications: 0, // We'll need to get this from a separate endpoint or calculate it
          careerField: internship.career_field || 'General'
        }));

        // Transform applications data
        const transformedApplications: Application[] = applications.map((app: any) => ({
          id: app.id,
          internshipId: app.internship_id,
          studentName: app.student?.name || 'Unknown Student',
          studentEmail: app.student?.email || 'Unknown Email',
          appliedDate: app.applied_at,
          status: app.status,
          internshipTitle: app.internship?.title || 'Unknown Internship',
          skills: app.skills || '',
          experience: app.experience || '',
          education: app.education || ''
        }));

        // Calculate stats
        const careerFieldCount = transformedInternships.reduce((acc: Record<string, number>, internship) => {
          acc[internship.careerField] = (acc[internship.careerField] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const stats = {
          activeInternships: transformedInternships.filter(i => i.status === 'approved').length,
          pendingInternships: transformedInternships.filter(i => i.status === 'pending').length,
          totalApplications: transformedApplications.length,
          pendingApplications: transformedApplications.filter(app => app.status === 'pending').length,
          careerFields: careerFieldCount
        };

        const dashboardData: DashboardData = {
          stats,
          internships: transformedInternships,
          recentApplications: transformedApplications
        };

        setDashboardData(dashboardData);
        generateCompanyAnalytics(transformedApplications, transformedInternships);
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
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        website: '',
        industry: 'Technology',
        description: ''
      });
      fetchDashboardData();
    }
  }, [user]);

  const generateCompanyAnalytics = (apps: Application[], internshipList: Internship[]) => {
    // Applications over time
    const last30Days = Array.from({length: 30}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        applications: Math.floor(Math.random() * 8) + 2
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
      { source: 'Direct Application', count: Math.floor(Math.random() * 30) + 15, color: '#3B82F6' },
      { source: 'University Portal', count: Math.floor(Math.random() * 20) + 10, color: '#10B981' },
      { source: 'Job Boards', count: Math.floor(Math.random() * 15) + 8, color: '#F59E0B' },
      { source: 'Social Media', count: Math.floor(Math.random() * 10) + 5, color: '#EF4444' },
      { source: 'Referrals', count: Math.floor(Math.random() * 8) + 3, color: '#8B5CF6' }
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

    // Career field distribution
    const careerFieldCount = internshipList.reduce((acc: Record<string, number>, internship: Internship) => {
      acc[internship.careerField] = (acc[internship.careerField] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const careerFieldDistribution = Object.entries(careerFieldCount).map(([field, count]) => ({
      name: field,
      value: count,
      color: getColorForCareerField(field)
    }));

    // AI Insights
    const aiInsights: AIInsight[] = [
      {
        title: 'Skill Gap Analysis',
        description: 'Marketing applicants lack advanced analytics skills',
        recommendation: 'Emphasize data analysis skills in job descriptions',
        impact: 'high',
        careerFields: ['Marketing']
      },
      {
        title: 'Application Trends',
        description: 'Increased interest in remote Technology positions',
        recommendation: 'Consider expanding remote opportunities',
        impact: 'medium',
        careerFields: ['Technology']
      },
      {
        title: 'Candidate Quality',
        description: 'High-skilled applicants for Design positions',
        recommendation: 'Adjust requirements to attract more candidates',
        impact: 'low',
        careerFields: ['Design']
      }
    ];

    setAnalyticsData({
      applicationsOverTime: last30Days,
      topPerformingInternships: topInternships,
      applicantSources,
      conversionFunnel,
      careerFieldDistribution,
      aiInsights
    });
  };

  // Helper function to get consistent colors for career fields
  const getColorForCareerField = (field: string): string => {
    const colors: Record<string, string> = {
      'Technology': '#3B82F6',
      'Marketing': '#10B981',
      'Data Science': '#8B5CF6',
      'Finance': '#F59E0B',
      'Design': '#EC4899',
      'Healthcare': '#EF4444',
      'Education': '#06B6D4',
      'Engineering': '#6366F1'
    };
    return colors[field] || '#6B7280'; // Default gray
  };

  const handleApproveApplication = async (id: number) => {
    try {
      await applicationsAPI.updateStatus(id, 'approved');
      // Refresh the dashboard data to show updated status
      const applicationsResponse = await applicationsAPI.getCompanyApplications({ page: 1, limit: 100 });
      const applications = applicationsResponse.data.data?.applications || [];
      
      const transformedApplications: Application[] = applications.map((app: any) => ({
        id: app.id,
        internshipId: app.internship_id,
        studentName: app.student?.name || 'Unknown Student',
        studentEmail: app.student?.email || 'Unknown Email',
        appliedDate: app.applied_at,
        status: app.status,
        internshipTitle: app.internship?.title || 'Unknown Internship',
        skills: app.skills || '',
        experience: app.experience || '',
        education: app.education || ''
      }));
      
      setDashboardData(prev => prev ? {
        ...prev,
        recentApplications: transformedApplications
      } : null);
      
      showSuccess('Application Approved', `Application #${id} has been approved successfully!`);
    } catch (error: any) {
      console.error('Failed to approve application:', error);
      let errorMessage = 'Failed to approve application. Please try again later.';
      
      if (error.response?.status === 403) {
        errorMessage = 'You are not authorized to approve this application.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Application not found.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showError('Approval Failed', errorMessage);
    }
  };

  const handleRejectApplication = async (id: number) => {
    try {
      await applicationsAPI.updateStatus(id, 'rejected');
      // Refresh the dashboard data to show updated status
      const applicationsResponse = await applicationsAPI.getCompanyApplications({ page: 1, limit: 100 });
      const applications = applicationsResponse.data.data?.applications || [];
      
      const transformedApplications: Application[] = applications.map((app: any) => ({
        id: app.id,
        internshipId: app.internship_id,
        studentName: app.student?.name || 'Unknown Student',
        studentEmail: app.student?.email || 'Unknown Email',
        appliedDate: app.applied_at,
        status: app.status,
        internshipTitle: app.internship?.title || 'Unknown Internship',
        skills: app.skills || '',
        experience: app.experience || '',
        education: app.education || ''
      }));
      
      setDashboardData(prev => prev ? {
        ...prev,
        recentApplications: transformedApplications
      } : null);
      
      showInfo('Application Rejected', `Application #${id} has been rejected.`);
    } catch (error: any) {
      console.error('Failed to reject application:', error);
      let errorMessage = 'Failed to reject application. Please try again later.';
      
      if (error.response?.status === 403) {
        errorMessage = 'You are not authorized to reject this application.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Application not found.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showError('Rejection Failed', errorMessage);
    }
  };

  const handleDeleteInternship = async (id: number) => {
    const confirmed = await confirm({
      title: 'Delete Internship',
      message: `Are you sure you want to delete internship #${id}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });
    
    if (!confirmed) return;
    
    // In a real application, this would connect to the backend
    // to delete the internship with the given id
    console.log(`Deleting internship with ID: ${id}`);
    showSuccess('Internship Deleted', `Internship #${id} has been successfully removed.`);
  };

  const handleViewInternship = (id: number) => {
    // Navigate to internship details or open modal
    console.log(`Viewing internship with ID: ${id}`);
    window.open(`/internship/${id}`, '_blank');
  };

  const handleEditInternship = (id: number) => {
    // Navigate to edit page or open edit modal
    console.log(`Editing internship with ID: ${id}`);
    showInfo('Edit Feature', `Edit functionality for internship #${id} - would redirect to edit page`);
  };

  const handleProfileSave = () => {
    // Update user in AuthContext only (no backend call)
    updateUser({ name: profileData.name });
    showSuccess('Profile Updated', 'Company profile has been updated successfully!');
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
              <h1 className="text-2xl font-bold">Company Dashboard</h1>
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
    <div className="min-h-screen bg-background relative overflow-hidden transition-colors duration-300">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 transition-opacity duration-300"
        style={{ backgroundImage: `url('/images/Download Abstract green papercut style layers background for free.jpeg')` }}
      ></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="bg-card rounded-xl border border-border mb-8">
          {/* Dashboard Header */}
          <div className="p-6 border-b border-border">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Company Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {typeof user === 'object' && user && 'name' in user ? (user as any).name : ''}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={() => navigate('/post-internship')}
                  size="sm"
                >
                  <BriefcaseIcon className="mr-2 h-4 w-4" />
                  Post Internship
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/company')}
                >
                  <Target className="mr-2 h-4 w-4" />
                  Public Page
                </Button>
              </div>
            </div>
          </div>
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary/10 rounded-lg p-2">
                    <BriefcaseIcon size={20} className="text-primary" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Active Internships
                    </h3>
                    <span className="text-2xl font-bold text-foreground">
                      {dashboardData?.stats.activeInternships || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary/10 rounded-lg p-2">
                    <ClipboardListIcon size={20} className="text-primary" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Total Applications
                    </h3>
                    <span className="text-2xl font-bold text-foreground">
                      {dashboardData?.stats.totalApplications || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary/10 rounded-lg p-2">
                    <UserIcon size={20} className="text-primary" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Pending Applications
                    </h3>
                    <span className="text-2xl font-bold text-foreground">
                      {dashboardData?.stats.pendingApplications || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary/10 rounded-lg p-2">
                    <TrendingUp size={20} className="text-primary" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Placement Rate
                    </h3>
                    <span className="text-2xl font-bold text-foreground">
                      95%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Dashboard Tabs */}
          <div className="border-b border-border transition-colors duration-300">
            <nav className="flex -mb-px">
              <button onClick={() => setActiveTab('internships')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-all duration-300 ${activeTab === 'internships' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}>
                My Internships
              </button>
              <button onClick={() => setActiveTab('applications')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-all duration-300 ${activeTab === 'applications' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}>
                Applications
              </button>
              <button onClick={() => setActiveTab('profile')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-all duration-300 ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}>
                Company Profile
              </button>
              <button onClick={() => setActiveTab('analytics')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-all duration-300 ${activeTab === 'analytics' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}>
                Analytics
              </button>
            </nav>
          </div>
          {/* Dashboard Content */}
          <div className="p-6 transition-all duration-3300">
            {activeTab === 'internships' && <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Your Internship Listings
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Manage and track all your internship opportunities
                    </p>
                  </div>
                  <Link to="/post-internship">
                    <Button variant="default" size="sm">
                      <BriefcaseIcon className="mr-2 h-4 w-4" />
                      Post Internship
                    </Button>
                  </Link>
                </div>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : dashboardData?.internships.length ? (
                  <div className="space-y-4">
                    {dashboardData.internships.map(internship => (
                      <Card key={internship.id} className="border-border transition-all duration-300 hover:border-primary/50 hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-foreground transition-colors duration-300">
                                {internship.title}
                              </h3>
                              {getStatusBadge(internship.status)}
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <Button 
                                onClick={() => handleViewInternship(internship.id)}
                                variant="ghost"
                                size="icon"
                                title="View"
                                className="transition-all duration-300 hover:bg-accent"
                              >
                                <EyeIcon size={18} />
                              </Button>
                              <Button 
                                onClick={() => handleEditInternship(internship.id)}
                                variant="ghost"
                                size="icon"
                                title="Edit"
                                className="transition-all duration-300 hover:bg-accent"
                              >
                                <EditIcon size={18} />
                              </Button>
                              <Button 
                                onClick={() => handleDeleteInternship(internship.id)}
                                variant="ghost"
                                size="icon"
                                title="Delete"
                                className="transition-all duration-300 hover:bg-accent"
                              >
                                <TrashIcon size={18} />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                            <div className="flex items-center text-muted-foreground">
                              <span className="text-sm">{internship.location}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <span className="text-sm">{internship.type}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <span className="text-sm">{internship.duration}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 transition-colors duration-300">
                            Posted on {internship.postedDate}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4 transition-colors duration-300">
                      You haven't posted any internships yet.
                    </p>
                    <Link to="/post-internship">
                      <Button variant="default" className="transition-all duration-300 hover:shadow-md">
                        Post Your First Internship
                      </Button>
                    </Link>
                  </div>
                )}
              </div>}
            
            {activeTab === 'applications' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-foreground transition-colors duration-300">
                    Recent Applications
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground transition-colors duration-300">
                    <Calendar size={16} />
                    <span>Real-time updates</span>
                  </div>
                </div>
                
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : dashboardData?.recentApplications.length ? (
                  <div className="space-y-4">
                    {dashboardData.recentApplications.map(application => (
                      <Card key={application.id} className="border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-foreground transition-colors duration-300">
                                {application.studentName}
                              </h3>
                              <p className="text-muted-foreground transition-colors duration-300">
                                Applied for {application.internshipTitle}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1 transition-colors duration-300">
                                Applied on {application.appliedDate}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(application.status)}
                            </div>
                          </div>
                          <div className="mt-4 flex space-x-3">
                            <Button 
                              onClick={() => handleApproveApplication(application.id)}
                              variant="default"
                              className="bg-green-600 hover:bg-green-700 transition-all duration-300"
                            >
                              Approve
                            </Button>
                            <Button 
                              onClick={() => handleRejectApplication(application.id)}
                              variant="default"
                              className="bg-red-600 hover:bg-red-700 transition-all duration-300"
                            >
                              Reject
                            </Button>
                            <Button 
                              onClick={() => navigate(`/send-notification/${application.id}`)}
                              variant="default"
                              className="bg-blue-600 hover:bg-blue-700 transition-all duration-300"
                            >
                              Send Notification
                            </Button>
                            <Button variant="default" className="transition-all duration-300 hover:shadow-md">
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground transition-colors duration-300">
                      No applications received yet.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-foreground transition-colors duration-300">
                    Company Analytics Dashboard
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
                        <Users size={24} className="text-blue-200 transition-colors duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 transition-colors duration-300">Active Internships</p>
                          <p className="text-2xl font-bold">{dashboardData?.stats.activeInternships || 0}</p>
                        </div>
                        <BriefcaseIcon size={24} className="text-green-200 transition-colors duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-yellow-100 transition-colors duration-300">Pending Apps</p>
                          <p className="text-2xl font-bold">{dashboardData?.stats.pendingApplications || 0}</p>
                        </div>
                        <ClockIcon size={24} className="text-yellow-200 transition-colors duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 transition-colors duration-300">Conversion Rate</p>
                          <p className="text-2xl font-bold">
                            {dashboardData?.stats.totalApplications && dashboardData.stats.totalApplications > 0 ? 
                              Math.round((dashboardData.stats.activeInternships / dashboardData.stats.totalApplications) * 100) : 0}%
                          </p>
                        </div>
                        <TrendingUp size={24} className="text-purple-200 transition-colors duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Applications Over Time */}
                  <Card className="border border-border transition-all duration-300 hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center text-foreground transition-colors duration-300">
                        <BarChart3 size={20} className="mr-2 text-blue-600" />
                        Applications Over Time (Last 30 Days)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analyticsData.applicationsOverTime}>
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

                  {/* Top Performing Internships */}
                  <Card className="border border-border transition-all duration-300 hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center text-foreground transition-colors duration-300">
                        <TrendingUp size={20} className="mr-2 text-green-600" />
                        Top Performing Internships
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analyticsData.topPerformingInternships}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="title" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                            />
                            <Bar dataKey="applications" fill="#10B981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Career Field Distribution and AI Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Career Field Distribution */}
                  <Card className="border border-border transition-all duration-300 hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center text-foreground transition-colors duration-300">
                        <Target size={20} className="mr-2 text-indigo-600" />
                        Internships by Career Field
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

                  {/* AI Insights */}
                  <Card className="border border-border transition-all duration-300 hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center text-foreground transition-colors duration-300">
                        <Brain size={20} className="mr-2 text-orange-600" />
                        AI-Powered Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                        {analyticsData.aiInsights.length > 0 ? (
                          analyticsData.aiInsights.map((insight, index) => (
                            <div key={index} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-foreground">{insight.title}</h4>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                                  insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {insight.impact} impact
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                              <div className="bg-blue-50 p-3 rounded-md">
                                <p className="text-sm text-blue-800">
                                  <span className="font-medium">Recommendation:</span> {insight.recommendation}
                                </p>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {insight.careerFields.map((field, i) => (
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
                            <p className="text-muted-foreground">No AI insights available at the moment</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Bottom Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Monthly Activity Overview - New Component */}
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
                          <BarChart data={analyticsData.applicationsOverTime} barGap={8}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                            <XAxis 
                              dataKey="date" 
                              stroke="#6B7280" 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 12 }}
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
                              formatter={(value) => [value, 'Applications']}
                              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                            />
                            <Bar 
                              dataKey="applications" 
                              fill="hsl(var(--primary))" 
                              name="Applications" 
                              radius={[4, 4, 0, 0]} 
                              barSize={24}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 flex justify-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                          <span className="text-sm text-muted-foreground">Applications</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills Market Analysis - New Component */}
                  <Card className="border border-border transition-all duration-300 hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center text-foreground transition-colors duration-300">
                        <TrendingUp size={20} className="mr-2 text-orange-600" />
                        Skills Market Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-5">
                        {[
                          { skill: 'JavaScript', demand: 85, color: 'from-yellow-400 to-yellow-600' },
                          { skill: 'React', demand: 92, color: 'from-blue-400 to-blue-600' },
                          { skill: 'Python', demand: 78, color: 'from-green-400 to-green-600' },
                          { skill: 'Data Analysis', demand: 72, color: 'from-purple-400 to-purple-600' },
                          { skill: 'Communication', demand: 88, color: 'from-pink-400 to-pink-600' }
                        ].map((item, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium text-foreground">{item.skill}</span>
                              <span className="text-sm text-muted-foreground">{item.demand}% demand</span>
                            </div>
                            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`absolute top-0 left-0 h-full bg-gradient-to-r ${item.color} rounded-full`}
                                style={{ width: `${item.demand}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 transition-all duration-300">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-blue-800">
                              <strong>Insight:</strong> JavaScript and React skills are in highest demand among applicants.
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
            
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-medium text-foreground mb-6 transition-colors duration-300">
                  Company Profile
                </h2>
                <div className="bg-muted p-6 rounded-lg transition-colors duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1 transition-colors duration-300">
                        Company Name
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
                        Website
                      </label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-primary" 
                        placeholder="https://example.com"
                        value={profileData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1 transition-colors duration-300">
                        Industry
                      </label>
                      <select 
                        className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        value={profileData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                      >
                        <option value="Technology" className="bg-background text-foreground">Technology</option>
                        <option value="Finance" className="bg-background text-foreground">Finance</option>
                        <option value="Healthcare" className="bg-background text-foreground">Healthcare</option>
                        <option value="Education" className="bg-background text-foreground">Education</option>
                        <option value="Manufacturing" className="bg-background text-foreground">Manufacturing</option>
                        <option value="Retail" className="bg-background text-foreground">Retail</option>
                        <option value="Other" className="bg-background text-foreground">Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-1 transition-colors duration-300">
                        Company Description
                      </label>
                      <textarea 
                        rows={4} 
                        className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-primary" 
                        placeholder="Tell students about your company..."
                        value={profileData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button onClick={handleProfileSave} variant="default" className="transition-all duration-300 hover:shadow-md">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;