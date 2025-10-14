import { useEffect, useMemo, useState } from 'react';
import { usersAPI, internshipsAPI } from '@/lib/new-api-client';
import { Link } from 'react-router-dom';
import { UsersIcon, BriefcaseIcon, AlertCircleIcon, CheckCircleIcon, ActivityIcon } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  joinDate?: string;
  // status is used in UI (e.g. active/inactive). Keep it flexible for now.
  status?: 'active' | 'inactive' | string;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  
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
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [analyticsRange, setAnalyticsRange] = useState<'7d' | '30d' | '12m'>('30d');
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalInternships: 0,
    pendingApprovals: 0,
    systemHealth: 98,
    platformGrowth: [] as any[],
    userActivityByRole: [] as any[],
    internshipPerformance: [] as any[],
    geographicDistribution: [] as any[]
  });

  // Real-time data for pending internships
  const {
    data: pendingInternships,
    loading: internshipsLoading,
    refresh: refreshInternships
  } = useRealtimeData<PendingInternship[]>(
    async () => {
      const response = await internshipsAPI.getPending();
      const all = response.data.data?.internships || [];
      return all.map((i: any) => ({
        id: i.id,
        title: i.title,
        company: i.company_name || i.company || 'Unknown Company',
        location: i.location || 'Remote',
        type: i.type || 'Full-time',
        postedDate: i.created_at || i.postedDate,
        status: 'pending' as const
      }));
    },
    [],
    { interval: 15000 } // Refresh every 15 seconds for admin
  );

  // Real-time data for users
  const {
    data: users,
    loading: usersLoading,
    refresh: refreshUsers
  } = useRealtimeData<UserData[]>(
    async () => {
      const response = await usersAPI.getAll({ page: 1, limit: 100 });
      const usersApi = response.data.data?.users || [];
      return usersApi.map((u: any) => ({
        id: u.id,
        name: u.name ?? u.email,
        email: u.email,
        role: u.role ?? 'student',
        joinDate: u.created_at ?? u.joinDate ?? '',
        status: u.status ?? 'active'
      }));
    },
    [],
    { interval: 30000 }
  );

  // Generate metrics when data changes
  useEffect(() => {
    if (users.length > 0 || pendingInternships.length > 0) {
      generateRealTimeMetrics(users, pendingInternships);
    } else {
      generateMockRealTimeMetrics();
    }
  }, [users, pendingInternships]);

  const generateRealTimeMetrics = (userList: UserData[], internshipList: PendingInternship[]) => {
    // Platform growth over time
    const last12Months = Array.from({length: 12}, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        users: Math.floor(Math.random() * 50) + 20,
        companies: Math.floor(Math.random() * 15) + 5,
        internships: Math.floor(Math.random() * 30) + 10
      };
    });

    // User activity by role
    const roleActivity = [
      { role: 'Students', active: userList.filter(u => u.role === 'student').length, total: userList.filter(u => u.role === 'student').length },
      { role: 'Companies', active: userList.filter(u => u.role === 'company').length, total: userList.filter(u => u.role === 'company').length },
      { role: 'Admins', active: userList.filter(u => u.role === 'admin').length, total: userList.filter(u => u.role === 'admin').length }
    ];

    // Internship performance
    const performance = [
      { category: 'Technology', count: Math.floor(Math.random() * 20) + 10, growth: '+15%' },
      { category: 'Marketing', count: Math.floor(Math.random() * 15) + 8, growth: '+8%' },
      { category: 'Finance', count: Math.floor(Math.random() * 12) + 6, growth: '+12%' },
      { category: 'Healthcare', count: Math.floor(Math.random() * 10) + 5, growth: '+6%' },
      { category: 'Education', count: Math.floor(Math.random() * 8) + 4, growth: '+10%' }
    ];

    // Geographic distribution
    const geographic = [
      { region: 'North America', users: 45, percentage: 45 },
      { region: 'Europe', users: 30, percentage: 30 },
      { region: 'Asia Pacific', users: 20, percentage: 20 },
      { region: 'Others', users: 5, percentage: 5 }
    ];

    setRealTimeMetrics({
      totalUsers: userList.length,
      activeUsers: userList.filter(u => u.status === 'active').length,
      totalInternships: internshipList.length,
      pendingApprovals: internshipList.filter(i => i.status === 'pending').length,
      systemHealth: 98,
      platformGrowth: last12Months,
      userActivityByRole: roleActivity,
      internshipPerformance: performance,
      geographicDistribution: geographic
    });
  };

  const generateMockRealTimeMetrics = () => {
    const mockMetrics = {
      totalUsers: 248,
      activeUsers: 231,
      totalInternships: 45,
      pendingApprovals: 12,
      systemHealth: 98,
      platformGrowth: [
        { month: 'Jan', users: 45, companies: 8, internships: 15 },
        { month: 'Feb', users: 52, companies: 10, internships: 18 },
        { month: 'Mar', users: 68, companies: 12, internships: 25 },
        { month: 'Apr', users: 78, companies: 15, internships: 32 },
        { month: 'May', users: 95, companies: 18, internships: 38 },
        { month: 'Jun', users: 112, companies: 22, internships: 42 }
      ],
      userActivityByRole: [
        { role: 'Students', active: 180, total: 200 },
        { role: 'Companies', active: 35, total: 40 },
        { role: 'Admins', active: 8, total: 8 }
      ],
      internshipPerformance: [
        { category: 'Technology', count: 25, growth: '+15%' },
        { category: 'Marketing', count: 18, growth: '+8%' },
        { category: 'Finance', count: 12, growth: '+12%' },
        { category: 'Healthcare', count: 8, growth: '+6%' },
        { category: 'Education', count: 6, growth: '+10%' }
      ],
      geographicDistribution: [
        { region: 'North America', users: 112, percentage: 45 },
        { region: 'Europe', users: 74, percentage: 30 },
        { region: 'Asia Pacific', users: 50, percentage: 20 },
        { region: 'Others', users: 12, percentage: 5 }
      ]
    };
    setRealTimeMetrics(mockMetrics);
  };
  
  // ---------- Analytics datasets (mocked/computed) ----------
  const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const timelineLabels = useMemo(() => {
    if (analyticsRange === '7d') return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    if (analyticsRange === '30d') return Array.from({ length: 10 }, (_, i) => `Day ${i + 1}`);
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }, [analyticsRange]);

  const signupsData = useMemo(() => {
    const base = users.length || 8;
    return timelineLabels.map((label, idx) => ({
      label,
      signups: Math.max(1, Math.round(base * 0.5 + (Math.sin(idx / 2) + 1) * 2 + (idx % 3)))
    }));
  }, [users, timelineLabels]);

  const trafficData = useMemo(() => {
    const base = 1000;
    return timelineLabels.map((label, idx) => ({
      label,
      visits: Math.round(base + Math.cos(idx / 3) * 120 + idx * 20),
      conversions: Math.round(40 + Math.sin(idx / 2.5) * 10 + (idx % 4))
    }));
  }, [timelineLabels]);

  const postingsData = useMemo(() => {
    const total = Math.max(5, pendingInternships.length * 3);
    return timelineLabels.map((label, idx) => ({
      label,
      posted: Math.max(0, Math.round(total * (0.3 + 0.05 * idx) % (total / 1.5))),
      approved: Math.max(0, Math.round((total / 2) * (0.2 + 0.04 * idx) % (total / 2)))
    }));
  }, [pendingInternships.length, timelineLabels]);

  const rolesPie = useMemo(() => {
    const counts = users.reduce((acc: Record<string, number>, u) => {
      const r = (u.role as string) || 'student';
      acc[r] = (acc[r] || 0) + 1;
      return acc;
    }, { student: 0, company: 0, admin: 0 });
    // Fallback when API not available
    if (users.length === 0) {
      counts.student = 8; counts.company = 3; counts.admin = 1;
    }
    return [
      { name: 'Students', value: counts.student },
      { name: 'Companies', value: counts.company },
      { name: 'Admins', value: counts.admin },
    ];
  }, [users]);
  const handleApproveInternship = async (id: number) => {
    try {
      // In a real implementation, call API to approve
      // await approveInternship(id);
      console.log(`Approving internship with ID: ${id}`); // Use the id parameter
      await refreshInternships(); // Refresh real-time data
      showSuccess('Internship Approved', 'The internship has been approved successfully!');
    } catch (error) {
      console.error('Failed to approve internship:', error);
      showError('Failed to approve internship. Please try again.');
    }
  };

  const handleRejectInternship = async (id: number) => {
    try {
      // In a real implementation, call API to reject
      // await rejectInternship(id);
      console.log(`Rejecting internship with ID: ${id}`); // Use the id parameter
      await refreshInternships(); // Refresh real-time data
      showSuccess('Internship Rejected', 'The internship has been rejected.');
    } catch (error) {
      console.error('Failed to reject internship:', error);
      showError('Failed to reject internship. Please try again.');
    }
  };

  const handleViewUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      showInfo('User Details', `Name: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nStatus: ${user.status}`);
    }
  };

  const handleEditUser = async (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const newName = prompt('Enter new name:', user.name);
      if (newName && newName !== user.name) {
        try {
          // In a real implementation, call API to update user
          // await updateUser(userId, { name: newName });
          await refreshUsers(); // Refresh real-time data
          showSuccess('User Updated', 'User has been updated successfully!');
        } catch (error) {
          console.error('Failed to update user:', error);
          showError('Failed to update user. Please try again.');
        }
      }
    }
  };

  const handleToggleUserStatus = async (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      try {
        // In a real implementation, call API to toggle status
        // await toggleUserStatus(userId, newStatus);
        await refreshUsers(); // Refresh real-time data
        showSuccess(
          'User Status Updated',
          `User ${newStatus === 'active' ? 'enabled' : 'disabled'} successfully!`
        );
      } catch (error) {
        console.error('Failed to toggle user status:', error);
        showError('Failed to update user status. Please try again.');
      }
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
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-card shadow-lg rounded-xl overflow-hidden border border-border transition-all duration-300 hover:shadow-xl">
        {/* Dashboard Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-primary-foreground/90">
            Welcome back, {(user as any)?.name}
          </p>
        </div>
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-muted/50">
          <Card className="border border-border shadow-sm transition-all duration-300 hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary/10 rounded-lg p-3">
                  <UsersIcon size={24} className="text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Total Users
                  </h3>
                  <span className="text-2xl font-bold text-foreground">
                    {realTimeMetrics.totalUsers || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-sm transition-all duration-300 hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary/10 rounded-lg p-3">
                  <BriefcaseIcon size={24} className="text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Companies</h3>
                  <span className="text-2xl font-bold text-foreground">
                    {realTimeMetrics.userActivityByRole.find(r => r.role === 'Companies')?.total || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-sm transition-all duration-300 hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary/10 rounded-lg p-3">
                  <AlertCircleIcon size={24} className="text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Pending Approvals
                  </h3>
                  <span className="text-2xl font-bold text-foreground">
                    {realTimeMetrics.pendingApprovals || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-sm transition-all duration-300 hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary/10 rounded-lg p-3">
                  <ActivityIcon size={24} className="text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    System Health
                  </h3>
                  <span className="text-2xl font-bold text-foreground">
                    {realTimeMetrics.systemHealth || 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Dashboard Tabs */}
        <div className="border-b border-border">
          <nav className="flex -mb-px">
            <button onClick={() => setActiveTab('dashboard')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${activeTab === 'dashboard' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}>
              Dashboard
            </button>
            <button onClick={() => setActiveTab('approvals')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${activeTab === 'approvals' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}>
              Content Approvals
            </button>
            <button onClick={() => setActiveTab('users')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}>
              User Management
            </button>
            <button onClick={() => setActiveTab('analytics')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${activeTab === 'analytics' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}>
              Analytics
            </button>
            <button onClick={() => setActiveTab('realtime')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${activeTab === 'realtime' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}>
              Real-time Dashboard
            </button>
          </nav>
        </div>
        {/* Dashboard Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && <div>
                <h2 className="text-lg font-medium text-foreground mb-6">
                  System Overview
                </h2>
                <div className="mb-8">
                  <h3 className="text-md font-medium text-foreground mb-3">
                    Recent Activity
                  </h3>
                  <div className="bg-muted rounded-lg p-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-primary/10 rounded-full p-2">
                        <UsersIcon size={16} className="text-primary" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-foreground">
                          New student registered:{' '}
                          <span className="font-medium">Jamie Smith</span>
                        </p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-primary/10 rounded-full p-2">
                        <BriefcaseIcon size={16} className="text-primary" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-foreground">
                          New internship posted:{' '}
                          <span className="font-medium">
                            Frontend Developer Intern
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-primary/10 rounded-full p-2">
                        <CheckCircleIcon size={16} className="text-primary" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-foreground">
                          Internship approved:{' '}
                          <span className="font-medium">UX/UI Design Intern</span>
                        </p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">
                        Pending Approvals
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {pendingInternships.filter(i => i.status === 'pending').length > 0 ? <div className="space-y-3">
                          {pendingInternships.filter(i => i.status === 'pending').slice(0, 3).map(internship => <div key={internship.id} className="flex justify-between items-center bg-card p-3 rounded-md shadow-sm border border-border">
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {internship.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {internship.company} •{' '}
                                    {new Date(internship.postedDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <Link to={`/internship-approval/${internship.id}`} className="text-primary hover:text-primary/80 text-sm">
                                  Review
                                </Link>
                              </div>)}
                          {pendingInternships.filter(i => i.status === 'pending').length > 3 && <div className="text-center mt-2">
                              <button onClick={() => setActiveTab('approvals')} className="text-sm text-primary hover:text-primary/80">
                                View all pending approvals
                              </button>
                            </div>}
                        </div> : <p className="text-sm text-muted-foreground text-center py-4">
                          No pending approvals
                        </p>}
                    </CardContent>
                  </Card>
                  <Card className="border border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">
                        User Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Total Students:
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {users.filter(u => u.role === 'student').length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Total Companies:
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {users.filter(u => u.role === 'company').length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Total Admins:
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {users.filter(u => u.role === 'admin').length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            New Users (Last 7 Days):
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            3
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Active Users:
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {users.filter(u => u.status === 'active').length}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>}
          {activeTab === 'approvals' && <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-foreground">
                  Content Approvals
                </h2>
                <div className="text-sm text-muted-foreground">
                  {pendingInternships.length} pending approvals
                </div>
              </div>
              
              {internshipsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : pendingInternships.length ? (
                <div className="space-y-4">
                  {pendingInternships.map(internship => (
                    <Card key={internship.id} className="border border-border">
                      <CardContent className="p-4">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-foreground">
                              {internship.title}
                            </h3>
                            <p className="text-muted-foreground">
                              {internship.company} • {internship.location}
                            </p>
                            <div className="flex items-center mt-1 space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {internship.type}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                Posted {new Date(internship.postedDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              onClick={() => handleApproveInternship(internship.id)}
                              variant="default"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approve
                            </Button>
                            <Button 
                              onClick={() => handleRejectInternship(internship.id)}
                              variant="default"
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Reject
                            </Button>
                            <Button variant="default">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircleIcon size={48} className="mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    All Caught Up!
                  </h3>
                  <p className="text-muted-foreground">
                    No pending internship approvals at this time.
                  </p>
                </div>
              )}
            </div>}
          {activeTab === 'users' && <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-foreground">
                  User Management
                </h2>
                <div className="flex space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground focus:ring-ring focus:border-ring focus:ring-2"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <Button variant="default">
                    Add User
                  </Button>
                </div>
              </div>
              
              {usersLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : users.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Join Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {users.map(user => (
                        <tr key={user.id} className="hover:bg-muted/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-primary font-medium">
                                    {user.name.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-foreground">
                                  {user.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  ID: {user.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-foreground">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getRoleBadge(user.role)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-foreground">
                                {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : '—'}
                              </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button 
                                onClick={() => handleViewUser(user.id)}
                                className="text-primary hover:text-primary/80"
                              >
                                View
                              </button>
                              {user.role !== 'admin' && <>
                                  <button 
                                    onClick={() => handleEditUser(user.id)}
                                    className="text-primary hover:text-primary/80"
                                  >
                                    Edit
                                  </button>
                                  {user.status === 'active' ? <button 
                                      onClick={() => handleToggleUserStatus(user.id)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      Disable
                                    </button> : <button 
                                      onClick={() => handleToggleUserStatus(user.id)}
                                      className="text-green-600 hover:text-green-800"
                                    >
                                      Enable
                                    </button>}
                                </>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <UsersIcon size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No Users Found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    There are no users in the system yet.
                  </p>
                  <Button variant="default">
                    Add Your First User
                  </Button>
                </div>
              )}
            </div>}
          {activeTab === 'analytics' && <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-foreground">Website Analytics</h2>
                <div className="inline-flex rounded-md shadow-sm border overflow-hidden">
                  <button onClick={() => setAnalyticsRange('7d')} className={`px-3 py-1.5 text-sm ${analyticsRange === '7d' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'}`}>7d</button>
                  <button onClick={() => setAnalyticsRange('30d')} className={`px-3 py-1.5 text-sm border-l border-border ${analyticsRange === '30d' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'}`}>30d</button>
                  <button onClick={() => setAnalyticsRange('12m')} className={`px-3 py-1.5 text-sm border-l border-border ${analyticsRange === '12m' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'}`}>12m</button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card rounded-lg shadow-sm p-4 border border-border">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-foreground">
                      User Signups
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={signupsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="label" stroke="#6B7280" />
                          <YAxis stroke="#6B7280" />
                          <Tooltip />
                          <Line type="monotone" dataKey="signups" stroke="#6366F1" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card rounded-lg shadow-sm p-4 border border-border">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-foreground">
                      Site Traffic
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trafficData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.35}/>
                              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.35}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="label" stroke="#6B7280" />
                          <YAxis stroke="#6B7280" />
                          <Tooltip />
                          <Area type="monotone" dataKey="visits" stroke="#06B6D4" fillOpacity={1} fill="url(#colorVisits)" />
                          <Area type="monotone" dataKey="conversions" stroke="#10B981" fillOpacity={1} fill="url(#colorConv)" />
                          <Legend />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card rounded-lg shadow-sm p-4 border border-border">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-foreground">
                      Internship Postings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={postingsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="label" stroke="#6B7280" />
                          <YAxis stroke="#6B7280" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="posted" fill="#8B5CF6" radius={[4,4,0,0]} />
                          <Bar dataKey="approved" fill="#F59E0B" radius={[4,4,0,0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card rounded-lg shadow-sm p-4 border border-border">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-foreground">
                      User Roles Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie data={rolesPie} dataKey="value" nameKey="name" outerRadius={88} label>
                            {rolesPie.map((_entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* New AI Analytics Section */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-foreground mb-4">AI-Powered Platform Insights</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Career Field Distribution */}
                  <Card className="bg-card rounded-lg shadow-sm p-4 border border-border">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-foreground">
                        Career Field Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie 
                              data={realTimeMetrics.internshipPerformance} 
                              dataKey="count" 
                              nameKey="category" 
                              cx="50%" 
                              cy="50%" 
                              outerRadius={80} 
                              fill="#8884d8" 
                              label
                            >
                              {realTimeMetrics.internshipPerformance.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground">
                          Distribution of internships across different career fields on the platform
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Insights */}
                  <Card className="bg-card rounded-lg shadow-sm p-4 border border-border">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-foreground">
                        AI Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">1</span>
                              </div>
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-blue-800">Growth Opportunity</h4>
                              <p className="text-sm text-blue-700 mt-1">
                                Healthcare internships show 25% growth potential. Consider promoting this field to students.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">2</span>
                              </div>
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-green-800">Skill Gap Analysis</h4>
                              <p className="text-sm text-green-700 mt-1">
                                Students interested in Finance lack data analysis skills. Recommend adding related courses.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">3</span>
                              </div>
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-purple-800">Market Trend</h4>
                              <p className="text-sm text-purple-700 mt-1">
                                Remote internships increased by 40% this quarter. Encourage companies to offer more remote options.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>}
          
          {activeTab === 'realtime' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-foreground">
                  Real-time System Dashboard
                </h2>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Active Users */}
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Active Users</p>
                        <p className="text-3xl font-bold">{realTimeMetrics.activeUsers || 0}</p>
                      </div>
                      <UsersIcon size={32} className="text-blue-200" />
                    </div>
                    <div className="mt-4 pt-4 border-t border-blue-400/30">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-100">Students</span>
                        <span>{realTimeMetrics.userActivityByRole.find(r => r.role === 'Students')?.active || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-100">Companies</span>
                        <span>{realTimeMetrics.userActivityByRole.find(r => r.role === 'Companies')?.active || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-100">Admins</span>
                        <span>{realTimeMetrics.userActivityByRole.find(r => r.role === 'Admins')?.active || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Active Internships */}
                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Active Internships</p>
                        <p className="text-3xl font-bold">{realTimeMetrics.totalInternships || 0}</p>
                      </div>
                      <BriefcaseIcon size={32} className="text-green-200" />
                    </div>
                    <div className="mt-4 pt-4 border-t border-green-400/30">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-100">Full-time</span>
                        <span>15</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-100">Part-time</span>
                        <span>8</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-100">Remote</span>
                        <span>5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Pending Actions */}
                <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-100">Pending Actions</p>
                        <p className="text-3xl font-bold">{realTimeMetrics.pendingApprovals || 0}</p>
                      </div>
                      <AlertCircleIcon size={32} className="text-yellow-200" />
                    </div>
                    <div className="mt-4 pt-4 border-t border-yellow-400/30">
                      <div className="flex justify-between text-sm">
                        <span className="text-yellow-100">Internships</span>
                        <span>3</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-yellow-100">Applications</span>
                        <span>2</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Real-time Activity Feed */}
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Real-time Activity Feed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="flex-shrink-0 bg-primary/10 rounded-full p-2">
                        <UsersIcon size={16} className="text-primary" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">New user registered</span> - John Doe
                        </p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-muted-foreground">
                            2 minutes ago
                          </span>
                          <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="flex-shrink-0 bg-primary/10 rounded-full p-2">
                        <BriefcaseIcon size={16} className="text-primary" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">New internship posted</span> - Software Engineer Intern
                        </p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-muted-foreground">
                            5 minutes ago
                          </span>
                          <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="flex-shrink-0 bg-primary/10 rounded-full p-2">
                        <CheckCircleIcon size={16} className="text-primary" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">Internship approved</span> - Marketing Intern
                        </p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-muted-foreground">
                            12 minutes ago
                          </span>
                          <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
};
export default AdminDashboard;