// API implementation that makes actual API calls to the backend
import { toast } from '@/hooks/use-toast';
import { 
  authAPI, 
  usersAPI, 
  internshipsAPI, 
  applicationsAPI
} from '@/lib/new-api-client';

// Enhanced error handling wrapper
const handleApiError = (error: any, operation: string) => {
  console.error(`${operation} error:`, error);
  
  const errorMessage = error.message || `Failed to ${operation.toLowerCase()}`;
  
  toast({
    title: `${operation} Failed`,
    description: errorMessage,
    variant: "destructive",
  });
  
  throw error;
};

// Success notification wrapper
const showSuccess = (message: string, title: string = "Success") => {
  toast({
    title,
    description: message,
  });
};

// Dashboard data functions
export async function getAdminDashboardData() {
  try {
    // Fetch real dashboard data from backend
    const response = await usersAPI.getAdminStats();
    return response.data.data;
  } catch (error) {
    handleApiError(error, 'Fetch Admin Dashboard Data');
  }
}

export async function getStudentDashboardData() {
  try {
    // Fetch real student dashboard data from backend
    const response = await applicationsAPI.getStudentApplications();
    return response.data.data;
  } catch (error) {
    handleApiError(error, 'Fetch Student Dashboard Data');
  }
}

export async function getCompanyDashboardData() {
  try {
    // Fetch real company dashboard data from backend
    const [internshipsResponse, applicationsResponse] = await Promise.all([
      internshipsAPI.getAll(),
      applicationsAPI.getCompanyApplications()
    ]);
    
    return {
      stats: {
        activeInternships: internshipsResponse.data.data?.internships?.filter((i: any) => i.is_approved).length || 0,
        pendingInternships: internshipsResponse.data.data?.internships?.filter((i: any) => !i.is_approved).length || 0,
        totalApplications: applicationsResponse.data.data?.applications?.length || 0,
        pendingApplications: applicationsResponse.data.data?.applications?.filter((a: any) => a.status === 'pending').length || 0
      },
      internships: internshipsResponse.data.data?.internships || [],
      recentApplications: applicationsResponse.data.data?.applications?.slice(0, 5) || []
    };
  } catch (error) {
    handleApiError(error, 'Fetch Company Dashboard Data');
  }
}

// Paginated endpoints
export async function listInternships(page = 1, limit = 10) {
  try {
    const response = await internshipsAPI.getAll({ page, limit });
    return response.data.data;
  } catch (error) {
    handleApiError(error, 'List Internships');
  }
}

export async function listUsers(page = 1, limit = 10) {
  try {
    const response = await usersAPI.getAll({ page, limit });
    return response.data.data;
  } catch (error) {
    handleApiError(error, 'List Users');
  }
}

export async function listApplications(page = 1, limit = 10) {
  try {
    const response = await applicationsAPI.getStudentApplications({ page, limit });
    return response.data.data;
  } catch (error) {
    handleApiError(error, 'List Applications');
  }
}

export async function getInternship(id: number) {
  try {
    const response = await internshipsAPI.getById(id);
    return response.data.data.internship;
  } catch (error) {
    handleApiError(error, 'Get Internship');
  }
}

export async function postInternship(data: any) {
  try {
    const response = await internshipsAPI.create(data);
    showSuccess('Internship posted successfully! It will be reviewed by admin.');
    return response.data.data;
  } catch (error) {
    handleApiError(error, 'Post Internship');
  }
}

export async function approveInternship(id: number) {
  try {
    const response = await internshipsAPI.approve(id);
    showSuccess('Internship approved successfully!');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Approve Internship');
  }
}

export async function rejectInternship(id: number) {
  try {
    const response = await internshipsAPI.reject(id);
    showSuccess('Internship rejected successfully!');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Reject Internship');
  }
}

export async function deleteInternship(id: number) {
  try {
    const response = await internshipsAPI.delete(id);
    showSuccess('Internship deleted successfully!');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Delete Internship');
  }
}

export async function createUser(data: any) {
  try {
    const response = await authAPI.register(data);
    return response.data.data.user;
  } catch (error) {
    handleApiError(error, 'Create User');
  }
}

export async function updateUser(id: number, data: any) {
  try {
    const response = await usersAPI.update(id, data);
    return response.data.data;
  } catch (error) {
    handleApiError(error, 'Update User');
  }
}

export async function toggleUserStatus(id: number, status: 'active' | 'inactive') {
  try {
    // This would require a specific API endpoint for toggling user status
    // For now, we'll use the update user endpoint
    const response = await usersAPI.update(id, { status });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Toggle User Status');
  }
}

export async function getApplication(id: number) {
  try {
    // This would require a specific API endpoint for getting a single application
    // For now, we'll fetch all applications and filter
    const response = await applicationsAPI.getStudentApplications();
    const applications = response.data.data.applications || [];
    const application = applications.find((a: any) => a.id === id);
    
    if (!application) {
      throw new Error('Application not found');
    }
    
    return application;
  } catch (error) {
    handleApiError(error, 'Get Application');
  }
}

export async function updateApplicationStatus(id: number, status: 'pending'|'approved'|'rejected') {
  try {
    const response = await applicationsAPI.updateStatus(id, status);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Update Application Status');
  }
}

export async function signup(data: any) {
  try {
    const response = await authAPI.register(data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Signup');
  }
}

export async function login(data: any) {
  try {
    const response = await authAPI.login(data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Login');
  }
}

export async function createApplication(data: any) {
  try {
    const response = await applicationsAPI.create(data);
    showSuccess('Application submitted successfully! You will be notified of updates.');
    return response.data.data;
  } catch (error) {
    handleApiError(error, 'Create Application');
  }
}

// Performance monitoring functions
export function getAPIMetrics() {
  // This would require a specific API endpoint for metrics
  // For now, return empty array
  return [];
}

export function getAverageResponseTime() {
  // This would require a specific API endpoint for metrics
  // For now, return 0
  return 0;
}

export function getSuccessRate() {
  // This would require a specific API endpoint for metrics
  // For now, return 100
  return 100;
}