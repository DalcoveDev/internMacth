// Mock API implementation that returns mock data instead of making actual API calls

// Mock data generators
const generateMockInternships = () => {
  return [
    {
      id: 1,
      title: 'Software Development Intern',
      company: 'Tech Innovations Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      duration: '3 months',
      deadline: '2023-06-30',
      salary: '$25/hr',
      description: "Join our engineering team to develop cutting-edge web applications using React and Node.js. You'll work directly with senior developers on real projects.",
      skills: 'React, JavaScript, Node.js',
      postedById: 1,
      createdAt: '2023-05-15',
      updatedAt: '2023-05-15',
      isApproved: true,
      postedBy: {
        email: 'careers@techinnovations.com'
      }
    },
    {
      id: 2,
      title: 'Marketing Intern',
      company: 'Global Media Group',
      location: 'New York, NY',
      type: 'Part-time',
      duration: '6 months',
      deadline: '2023-07-15',
      salary: '$20/hr',
      description: 'Assist our marketing team in developing and implementing digital marketing campaigns. Learn about SEO, content marketing, and social media strategy.',
      skills: 'Marketing, Social Media, Content Creation',
      postedById: 2,
      createdAt: '2023-05-10',
      updatedAt: '2023-05-10',
      isApproved: true,
      postedBy: {
        email: 'hr@globalmediagroup.com'
      }
    },
    {
      id: 3,
      title: 'Data Science Intern',
      company: 'Analytics Pro',
      location: 'Remote',
      type: 'Full-time',
      duration: '4 months',
      deadline: '2023-06-25',
      salary: '$30/hr',
      description: 'Work with our data science team to analyze large datasets and build predictive models. Great opportunity to apply machine learning skills in a real-world setting.',
      skills: 'Python, Machine Learning, Data Analysis',
      postedById: 3,
      createdAt: '2023-05-05',
      updatedAt: '2023-05-05',
      isApproved: false,
      postedBy: {
        email: 'jobs@analyticspro.com'
      }
    }
  ];
};

const generateMockUsers = () => {
  return [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@student.com',
      role: 'student',
      createdAt: '2023-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'company',
      createdAt: '2023-02-20'
    },
    {
      id: 3,
      name: 'Admin User',
      email: 'admin@internmatch.com',
      role: 'admin',
      createdAt: '2023-01-01'
    }
  ];
};

const generateMockApplications = () => {
  return [
    {
      id: 1,
      internshipId: 1,
      studentName: 'John Doe',
      studentEmail: 'john.doe@student.com',
      coverLetter: 'I am very interested in this position...',
      skills: 'React, JavaScript, Node.js',
      studentPhone: '+1234567890',
      education: 'Computer Science, Stanford University',
      experience: '2 years of web development experience',
      portfolio: 'https://github.com/johndoe',
      availability: 'Available immediately',
      status: 'pending',
      createdAt: '2023-05-16'
    },
    {
      id: 2,
      internshipId: 1,
      studentName: 'Alice Johnson',
      studentEmail: 'alice.johnson@student.com',
      coverLetter: 'This position aligns perfectly with my career goals...',
      skills: 'Python, Data Analysis',
      studentPhone: '+1987654321',
      education: 'Data Science, MIT',
      experience: 'Interned at DataCorp last summer',
      portfolio: 'https://linkedin.com/in/alicejohnson',
      availability: 'Starting June 2023',
      status: 'approved',
      createdAt: '2023-05-17'
    }
  ];
};

// Mock dashboard data generators
export async function getAdminDashboardData() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    stats: {
      totalUsers: 42,
      totalInternships: 28,
      pendingApprovals: 5,
      totalApplications: 156,
      userStats: {
        student: 28,
        company: 12,
        admin: 2
      }
    },
    recentActivity: [
      {
        type: 'user',
        action: 'registered',
        name: 'John Doe',
        date: new Date().toISOString()
      },
      {
        type: 'internship',
        action: 'posted',
        name: 'Software Engineering Intern',
        company: 'Tech Corp',
        date: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    users: generateMockUsers().slice(0, 10),
    pendingInternships: generateMockInternships().filter(i => !i.isApproved),
    recentApplications: generateMockApplications()
  };
}

export async function getStudentDashboardData() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    stats: {
      totalApplications: 12,
      pendingApplications: 5,
      approvedApplications: 3
    },
    applications: generateMockApplications()
  };
}

export async function getCompanyDashboardData() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    stats: {
      activeInternships: 2,
      pendingInternships: 1,
      totalApplications: 15,
      pendingApplications: 8
    },
    internships: generateMockInternships(),
    recentApplications: generateMockApplications()
  };
}

// Paginated endpoints
export async function listInternships(page = 1, limit = 10) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const allInternships = generateMockInternships();
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = allInternships.slice(start, end);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total: allInternships.length,
      totalPages: Math.ceil(allInternships.length / limit)
    }
  };
}

export async function listUsers(page = 1, limit = 10) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const allUsers = generateMockUsers();
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = allUsers.slice(start, end);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total: allUsers.length,
      totalPages: Math.ceil(allUsers.length / limit)
    }
  };
}

export async function listApplications(page = 1, limit = 10) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const allApplications = generateMockApplications();
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = allApplications.slice(start, end);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total: allApplications.length,
      totalPages: Math.ceil(allApplications.length / limit)
    }
  };
}

export async function getInternship(id: number) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const internships = generateMockInternships();
  const internship = internships.find(i => i.id === id);
  
  if (!internship) {
    throw new Error('Internship not found');
  }
  
  return {
    ...internship,
    responsibilities: [
      'Develop and maintain web applications',
      'Collaborate with design and product teams',
      'Write clean, maintainable code',
      'Participate in code reviews'
    ],
    requirements: [
      'Currently pursuing a degree in Computer Science',
      'Experience with JavaScript, HTML, and CSS',
      'Familiarity with React and Node.js',
      'Strong problem-solving skills'
    ],
    benefits: [
      'Flexible working hours',
      'Mentorship from senior developers',
      'Opportunity to work on real projects'
    ]
  };
}

export async function postInternship(data: any) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return a mock response
  return {
    id: Date.now(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isApproved: false
  };
}

export async function approveInternship(_id: number) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return a mock response
  return { success: true, message: 'Internship approved successfully' };
}

export async function rejectInternship(_id: number, _reason = '') {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return a mock response
  return { success: true, message: 'Internship rejected successfully' };
}

export async function deleteInternship(_id: number) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return a mock response
  return { success: true, message: 'Internship deleted successfully' };
}

export async function createUser(data: any) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return a mock response
  return {
    id: Date.now(),
    ...data,
    createdAt: new Date().toISOString()
  };
}

export async function updateUser(id: number, data: any) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return a mock response
  return {
    id,
    ...data,
    updatedAt: new Date().toISOString()
  };
}

export async function toggleUserStatus(_id: number, _status: 'active' | 'inactive') {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return a mock response
  return { success: true, message: `User status updated to ${status}` };
}

export async function getApplication(id: number) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const applications = generateMockApplications();
  const application = applications.find(a => a.id === id);
  
  if (!application) {
    throw new Error('Application not found');
  }
  
  return application;
}

export async function updateApplicationStatus(_id: number, _status: 'pending'|'approved'|'rejected') {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return a mock response
  return { success: true, message: `Application status updated to ${status}` };
}

export async function signup(data: any) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a mock response
  return {
    user: {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString()
    },
    token: 'mock_jwt_token_' + Date.now()
  };
}

export async function login(data: any) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return a mock response
  const users = generateMockUsers();
  const user = users.find(u => u.email === data.email && u.role === data.role);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  return {
    user: {
      ...user,
      token: 'mock_jwt_token_' + Date.now()
    },
    token: 'mock_jwt_token_' + Date.now()
  };
}

export async function createApplication(data: any) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return a mock response
  return {
    id: Date.now(),
    ...data,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
}

// Performance monitoring functions (mock implementations)
export function getAPIMetrics() {
  return [];
}

export function getAverageResponseTime() {
  return 0;
}

export function getSuccessRate() {
  return 100;
}