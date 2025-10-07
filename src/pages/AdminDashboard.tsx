import { useEffect, useMemo, useState } from 'react';
import { listInternships, listUsers } from '../api';
import { Link } from 'react-router-dom';
import { UsersIcon, BriefcaseIcon, AlertCircleIcon, CheckCircleIcon, XCircleIcon, ClockIcon, EyeIcon, CheckIcon, XIcon, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';
import { useToast } from '../components/ToastProvider';
import { useAuth } from '../contexts/AuthContext';

import { useRealtimeData } from '../hooks/useRealtimeData';
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
  const { showSuccess, showInfo } = useToast();
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
      const all = await listInternships();
      return all.filter((i: any) => !i.isApproved).map((i: any) => ({
        id: i.id,
        title: i.title,
        company: i.company,
        location: i.location || 'Remote',
        type: 'Full-time',
        postedDate: i.createdAt,
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
      const usersApi = await listUsers();
      return usersApi.map((u: any) => ({
        id: u.id,
        name: u.name ?? u.email,
        email: u.email,
        role: u.role ?? 'student',
        joinDate: u.createdAt ?? '',
        status: 'active' as const
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
      await refreshInternships(); // Refresh real-time data
      showSuccess('Internship Approved', 'The internship has been approved successfully!');
    } catch (error) {
      console.error('Failed to approve internship:', error);
    }
  };

  const handleRejectInternship = async (id: number) => {
    try {
      // In a real implementation, call API to reject
      // await rejectInternship(id);
      await refreshInternships(); // Refresh real-time data
      showSuccess('Internship Rejected', 'The internship has been rejected.');
    } catch (error) {
      console.error('Failed to reject internship:', error);
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
      }
    }
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
        <div className="bg-gray-900 p-6 text-white">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="mt-1">Welcome back, {(user as any)?.name}</p>
        </div>
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-emerald-100 rounded-md p-3">
                <UsersIcon size={24} className="text-emerald-600" />
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
              <div className="flex-shrink-0 bg-emerald-100 rounded-md p-3">
                <BriefcaseIcon size={24} className="text-emerald-600" />
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
                <AlertCircleIcon size={24} className="text-yellow-700" />
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
            <button onClick={() => setActiveTab('analytics')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'analytics' ? 'border-gray-800 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Analytics
            </button>
            <button onClick={() => setActiveTab('realtime')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'realtime' ? 'border-gray-800 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Real-time Dashboard
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
                    <div className="flex-shrink-0 bg-emerald-100 rounded-full p-2">
                      <UsersIcon size={16} className="text-emerald-600" />
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
                    <div className="flex-shrink-0 bg-emerald-100 rounded-full p-2">
                      <BriefcaseIcon size={16} className="text-emerald-600" />
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
                              <Link to={`/internship-approval/${internship.id}`} className="text-emerald-600 hover:text-emerald-800 text-sm">
                                Review
                              </Link>
                            </div>)}
                        {pendingInternships.filter(i => i.status === 'pending').length > 3 && <div className="text-center mt-2">
                            <button onClick={() => setActiveTab('approvals')} className="text-sm text-emerald-600 hover:text-emerald-800">
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
                              {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : '—'}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => handleViewUser(user.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </button>
                            {user.role !== 'admin' && <>
                                <button 
                                  onClick={() => handleEditUser(user.id)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Edit
                                </button>
                                {user.status === 'active' ? <button 
                                    onClick={() => handleToggleUserStatus(user.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Disable
                                  </button> : <button 
                                    onClick={() => handleToggleUserStatus(user.id)}
                                    className="text-green-600 hover:text-green-900"
                                  >
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
          {activeTab === 'analytics' && <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Website Analytics</h2>
                <div className="inline-flex rounded-md shadow-sm border overflow-hidden">
                  <button onClick={() => setAnalyticsRange('7d')} className={`px-3 py-1.5 text-sm ${analyticsRange === '7d' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}>7d</button>
                  <button onClick={() => setAnalyticsRange('30d')} className={`px-3 py-1.5 text-sm border-l ${analyticsRange === '30d' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}>30d</button>
                  <button onClick={() => setAnalyticsRange('12m')} className={`px-3 py-1.5 text-sm border-l ${analyticsRange === '12m' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}>12m</button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">User Signups</h3>
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
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Site Traffic</h3>
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
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Internship Postings</h3>
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
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">User Roles Distribution</h3>
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
                </div>
              </div>
            </div>}
          
          {activeTab === 'realtime' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Real-time System Dashboard
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Activity size={16} className="animate-pulse text-green-500" />
                  <span>Live monitoring</span>
                </div>
              </div>

              {/* Real-time System Health */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-xl text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Users</p>
                      <p className="text-3xl font-bold">{realTimeMetrics.totalUsers}</p>
                      <p className="text-sm text-blue-200 mt-1">+12 today</p>
                    </div>
                    <UsersIcon size={28} className="text-blue-200" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-700 p-6 rounded-xl text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Active Now</p>
                      <p className="text-3xl font-bold">{realTimeMetrics.activeUsers}</p>
                      <p className="text-sm text-green-200 mt-1">93% online</p>
                    </div>
                    <Activity size={28} className="text-green-200 animate-pulse" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-xl text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Internships</p>
                      <p className="text-3xl font-bold">{realTimeMetrics.totalInternships}</p>
                      <p className="text-sm text-purple-200 mt-1">+3 pending</p>
                    </div>
                    <BriefcaseIcon size={28} className="text-purple-200" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-6 rounded-xl text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Pending</p>
                      <p className="text-3xl font-bold">{realTimeMetrics.pendingApprovals}</p>
                      <p className="text-sm text-orange-200 mt-1">Need review</p>
                    </div>
                    <ClockIcon size={28} className="text-orange-200" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 rounded-xl text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100">System Health</p>
                      <p className="text-3xl font-bold">{realTimeMetrics.systemHealth}%</p>
                      <p className="text-sm text-emerald-200 mt-1">All systems</p>
                    </div>
                    <CheckCircleIcon size={28} className="text-emerald-200" />
                  </div>
                </div>
              </div>

              {/* Live Status Banner */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Real-time Monitoring Active</h4>
                      <p className="text-gray-300">All systems operational • Data refreshes every 15 seconds</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Server time</p>
                    <p className="font-medium text-lg">{new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>;
};
export default AdminDashboard;