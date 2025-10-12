import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, MapPinIcon, CalendarIcon, ClockIcon, CheckIcon, XIcon } from 'lucide-react';
import { useToast } from '../components/ToastProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const InternshipApproval = () => {
  const { showWarning, showSuccess } = useToast();
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  // Generate mock internship data
  const generateMockInternship = (id: string) => {
    const mockInternships: Record<string, any> = {
      '1': {
        id: 1,
        title: 'Software Development Intern',
        company: 'Tech Innovations Inc.',
        location: 'San Francisco, CA',
        type: 'Full-time',
        duration: '3 months',
        deadline: '2023-06-30',
        salary: '$25/hr',
        description: "Join our engineering team to develop cutting-edge web applications using React and Node.js. You'll work directly with senior developers on real projects.",
        responsibilities: [
          'Develop and maintain web applications using React and Node.js',
          'Collaborate with design and product teams to implement new features',
          'Write clean, maintainable, and well-documented code',
          'Participate in code reviews and team meetings'
        ],
        requirements: [
          'Currently pursuing a degree in Computer Science or related field',
          'Experience with JavaScript, HTML, and CSS',
          'Familiarity with React and Node.js',
          'Strong problem-solving skills'
        ],
        benefits: [
          'Flexible working hours',
          'Mentorship from senior developers',
          'Opportunity to work on real projects',
          'Potential for full-time employment'
        ],
        companyEmail: 'careers@techinnovations.com',
        status: 'pending'
      },
      '2': {
        id: 2,
        title: 'Marketing Intern',
        company: 'Global Media Group',
        location: 'New York, NY',
        type: 'Part-time',
        duration: '6 months',
        deadline: '2023-07-15',
        salary: '$20/hr',
        description: 'Assist our marketing team in developing and implementing digital marketing campaigns. Learn about SEO, content marketing, and social media strategy.',
        responsibilities: [
          'Create and schedule social media content',
          'Analyze marketing campaign performance',
          'Assist with email marketing campaigns',
          'Support content creation for blog posts and newsletters'
        ],
        requirements: [
          'Currently pursuing a degree in Marketing or Communications',
          'Experience with social media platforms',
          'Strong written and verbal communication skills',
          'Familiarity with Google Analytics'
        ],
        benefits: [
          'Exposure to various marketing channels',
          'Professional development opportunities',
          'Networking events',
          'Flexible schedule'
        ],
        companyEmail: 'hr@globalmediagroup.com',
        status: 'pending'
      }
    };
    
    return mockInternships[id] || {
      id: Number(id),
      title: 'Sample Internship Position',
      company: 'Sample Company',
      location: 'Remote',
      type: 'Full-time',
      duration: '3 months',
      deadline: '2023-12-31',
      salary: 'Competitive',
      description: 'This is a sample internship position for demonstration purposes.',
      responsibilities: [
        'Assist with daily tasks',
        'Participate in team meetings',
        'Learn industry best practices'
      ],
      requirements: [
        'Strong work ethic',
        'Willingness to learn',
        'Good communication skills'
      ],
      benefits: [
        'Learning opportunities',
        'Mentorship',
        'Flexible schedule'
      ],
      companyEmail: 'sample@company.com',
      status: 'pending'
    };
  };

  useEffect(() => {
    // Load mock data
    try {
      const mockInternship = generateMockInternship(id || '');
      setInternship(mockInternship);
      setLoading(false);
    } catch (error) {
      console.error('Error generating mock internship:', error);
      setInternship(null);
      setLoading(false);
    }
  }, [id]);

  const handleApprove = () => {
    // Simulate approval
    setInternship((prev: any) => ({ ...(prev || {}), status: 'approved' }));
    showSuccess('Internship Approved', 'The internship has been approved successfully!');
    setTimeout(() => navigate('/admin-dashboard'), 1500);
  };

  const handleReject = () => {
    if (!rejectionReason) {
      showWarning('Reason Required', 'Please provide a reason for rejection');
      return;
    }
    // Simulate rejection
    setInternship((prev: any) => ({ ...(prev || {}), status: 'rejected', rejectionReason }));
    showSuccess('Internship Rejected', 'The internship has been rejected.');
    setTimeout(() => navigate('/admin-dashboard'), 1500);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-muted-foreground">Internship not found</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url('/images/Download Abstract green papercut style layers background for free.jpeg')` }}
      ></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Button 
          onClick={() => navigate(-1)} 
          variant="ghost"
          className="flex items-center mb-6 text-primary hover:bg-accent"
        >
          <ArrowLeftIcon size={16} className="mr-1" />
          Back to Dashboard
        </Button>
        
        {internship.status === 'approved' && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckIcon className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  This internship has been approved and is now live on the
                  platform.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {internship.status === 'rejected' && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <XIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  This internship has been rejected. Reason:{' '}
                  {internship.rejectionReason}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <Card className="border border-border shadow-lg">
          <CardHeader className="border-b border-border bg-muted/50">
            <CardTitle className="text-xl font-semibold text-foreground">
              Internship Approval
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Review this internship listing before approving or rejecting
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {internship.title}
                  </h2>
                  <p className="text-lg text-muted-foreground mt-1">
                    {internship.company}
                  </p>
                </div>
                <div className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {internship.type}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center text-muted-foreground">
                  <MapPinIcon size={18} className="mr-1" />
                  <span>{internship.location}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <CalendarIcon size={18} className="mr-1" />
                  <span>{internship.duration}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <ClockIcon size={18} className="mr-1" />
                  <span>
                    Deadline: {new Date(internship.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-muted-foreground">
                <span className="font-medium">Compensation:</span>{' '}
                {internship.salary}
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-foreground mb-3">
                Description
              </h3>
              <div className="bg-muted rounded-lg p-4">
                <div className="whitespace-pre-wrap text-foreground">
                  {internship.description}
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-foreground mb-3">
                Responsibilities
              </h3>
              <div className="bg-muted rounded-lg p-4">
                <ul className="list-disc list-inside space-y-1 text-foreground">
                  {internship.responsibilities.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-foreground mb-3">
                Requirements
              </h3>
              <div className="bg-muted rounded-lg p-4">
                <ul className="list-disc list-inside space-y-1 text-foreground">
                  {internship.requirements.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-foreground mb-3">Benefits</h3>
              <div className="bg-muted rounded-lg p-4">
                <ul className="list-disc list-inside space-y-1 text-foreground">
                  {internship.benefits.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium text-foreground mb-3">
                Company Contact
              </h3>
              <p className="text-foreground">{internship.companyEmail}</p>
            </div>
            
            {internship.status === 'pending' && (
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Admin Decision
                </h3>
                {showRejectionForm ? (
                  <div className="bg-muted rounded-lg p-4 mb-4">
                    <label htmlFor="rejectionReason" className="block text-sm font-medium text-foreground mb-2">
                      Reason for Rejection
                    </label>
                    <textarea
                      id="rejectionReason"
                      rows={3}
                      className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
                      placeholder="Provide a reason for rejecting this internship..."
                      value={rejectionReason}
                      onChange={e => setRejectionReason(e.target.value)}
                    ></textarea>
                    <div className="mt-4 flex justify-end space-x-3">
                      <Button
                        onClick={() => setShowRejectionForm(false)}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleReject}
                        variant="destructive"
                      >
                        Confirm Rejection
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end space-x-3">
                    <Button
                      onClick={() => setShowRejectionForm(true)}
                      variant="outline"
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={handleApprove}
                      variant="default"
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InternshipApproval;