import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, MapPinIcon, CalendarIcon, ClockIcon, CheckIcon, XIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Import the real API client
import { internshipsAPI } from '@/lib/new-api-client';

const InternshipApproval = () => {
  const { toast } = useToast();
  const {
    id
  } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [internship, setInternship] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  // Helper functions for showing toast notifications
  const showError = (message: string, title: string = "Error") => {
    toast({
      title,
      description: message,
      variant: "destructive",
    });
  };

  const showSuccess = (message: string, title: string = "Success") => {
    toast({
      title,
      description: message,
    });
  };

  useEffect(() => {
    // Load real internship data
    const loadInternshipData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await internshipsAPI.getById(Number(id));
        const internshipData = response.data.data?.internship;
        
        if (!internshipData) {
          showError('Internship not found');
          return;
        }
        
        setInternship({
          id: internshipData.id,
          title: internshipData.title,
          company: internshipData.company_name || 'Unknown Company',
          location: internshipData.location,
          type: internshipData.type,
          duration: internshipData.duration,
          deadline: internshipData.deadline,
          salary: internshipData.salary_min ? `$${internshipData.salary_min}/hr` : 'Unpaid',
          description: internshipData.description,
          responsibilities: internshipData.responsibilities ? internshipData.responsibilities.split(',') : [],
          requirements: internshipData.requirements ? internshipData.requirements.split(',') : [],
          benefits: internshipData.benefits ? internshipData.benefits.split(',') : [],
          companyEmail: internshipData.posted_by_email || 'contact@company.com',
          postedDate: internshipData.created_at,
          status: internshipData.is_approved ? 'approved' : (internshipData.is_active ? 'pending' : 'rejected')
        });
      } catch (error: any) {
        console.error('Error loading internship:', error);
        let errorMessage = 'Failed to load internship details.';
        
        if (error.response?.status === 404) {
          errorMessage = 'Internship not found.';
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        showError(errorMessage);
        setInternship(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadInternshipData();
  }, [id]);

  const handleApprove = async () => {
    if (!internship) return;
    
    try {
      await internshipsAPI.approve(internship.id);
      setInternship((prev: any) => ({ ...prev, status: 'approved' }));
      showSuccess('Internship Approved', 'The internship has been approved successfully!');
      setTimeout(() => navigate('/admin-dashboard'), 1500);
    } catch (error: any) {
      console.error('Error approving internship:', error);
      let errorMessage = 'Failed to approve the internship. Please try again.';
      
      if (error.response?.status === 404) {
        errorMessage = 'Internship not found.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showError(errorMessage);
    }
  };

  const handleReject = async () => {
    if (!internship) {
      showError('Internship Required', 'No internship selected');
      return;
    }
    
    try {
      await internshipsAPI.reject(internship.id);
      setInternship((prev: any) => ({ ...prev, status: 'rejected' }));
      showSuccess('Internship Rejected', 'The internship has been rejected.');
      setTimeout(() => navigate('/admin-dashboard'), 1500);
    } catch (error: any) {
      console.error('Error rejecting internship:', error);
      let errorMessage = 'Failed to reject the internship. Please try again.';
      
      if (error.response?.status === 404) {
        errorMessage = 'Internship not found.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showError(errorMessage);
    }
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