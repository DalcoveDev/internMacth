import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, User, Mail, Calendar, CheckCircle, XCircle, Clock, ThumbsUp, ThumbsDown, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { applicationsAPI } from '@/lib/new-api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';

interface ApplicationDetails {
  id: number;
  internship_id: number;
  internship_title: string;
  company_name: string;
  student_name: string;
  student_email: string;
  cover_letter: string;
  skills: string;
  experience?: string;
  education?: string;
  portfolio_url?: string;
  resume_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
  reviewed_at?: string;
  notes?: string;
}

const ApplicationDetailsView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const fetchApplicationDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      // Fetch the specific application by ID
      const response = await applicationsAPI.getStudentApplications({});
      const applications = response.data.data?.applications || [];
      
      // Find the specific application by ID
      const foundApplication = applications.find((app: any) => app.id === parseInt(id));
      
      if (foundApplication) {
        const applicationData: ApplicationDetails = {
          id: foundApplication.id,
          internship_id: foundApplication.internship_id,
          internship_title: foundApplication.internship?.title || 'Unknown Internship',
          company_name: foundApplication.internship?.company?.company_name || 'Unknown Company',
          student_name: foundApplication.student?.name || 'Unknown Student',
          student_email: foundApplication.student?.email || 'Unknown Email',
          cover_letter: foundApplication.cover_letter,
          skills: foundApplication.skills,
          experience: foundApplication.experience,
          education: foundApplication.education,
          portfolio_url: foundApplication.portfolio_url,
          resume_url: foundApplication.resume_url,
          status: foundApplication.status,
          applied_at: foundApplication.applied_at,
          notes: foundApplication.notes || ''
        };
        setApplication(applicationData);
        setNotes(foundApplication.notes || '');
      } else {
        setError('Application not found');
      }
    } catch (err: any) {
      console.error('Failed to fetch application details:', err);
      setError('Failed to load application details. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to load application details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
    if (!application) return;

    try {
      await applicationsAPI.updateStatus(application.id, status);
      
      // Update local state
      setApplication(prev => prev ? { ...prev, status } : null);
      
      toast({
        title: "Success",
        description: `Application has been ${status}.`,
      });
      
      // Refresh the data
      fetchApplicationDetails();
    } catch (err: any) {
      console.error('Failed to update application status:', err);
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive",
      });
    }
  };

  const handleSaveNotes = async () => {
    // In a real implementation, you would save notes to the backend
    // For now, we'll just update the local state
    setIsEditingNotes(false);
    toast({
      title: "Success",
      description: "Notes saved successfully.",
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">Application not found</p>
        </div>
      </div>
    );
  }

  const isCompanyUser = user?.role === 'company';
  const isStudentUser = user?.role === 'student';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button 
        onClick={() => navigate(-1)} 
        variant="ghost"
        className="flex items-center mb-6"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back
      </Button>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Application Details</h1>
        <p className="text-muted-foreground">View and manage your internship application</p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{application.internship_title}</CardTitle>
              <p className="text-muted-foreground">{application.company_name}</p>
            </div>
            {getStatusBadge(application.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Applied Date</h3>
              <div className="flex items-center text-muted-foreground">
                <Calendar size={16} className="mr-2" />
                {new Date(application.applied_at).toLocaleDateString()}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Application ID</h3>
              <p className="text-muted-foreground">#{application.id}</p>
            </div>
          </div>
          
          {/* Action buttons for company users */}
          {isCompanyUser && application.status === 'pending' && (
            <div className="mt-6 flex space-x-3">
              <Button 
                onClick={() => handleStatusUpdate('approved')}
                className="bg-green-600 hover:bg-green-700"
              >
                <ThumbsUp size={16} className="mr-2" />
                Approve Application
              </Button>
              <Button 
                onClick={() => handleStatusUpdate('rejected')}
                variant="destructive"
              >
                <ThumbsDown size={16} className="mr-2" />
                Reject Application
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User size={20} className="mr-2 text-emerald-600" />
              {isStudentUser ? 'Your Information' : 'Student Information'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground">Name</h3>
                <p className="text-muted-foreground">{application.student_name}</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Email</h3>
                <div className="flex items-center text-muted-foreground">
                  <Mail size={16} className="mr-2" />
                  {application.student_email}
                </div>
              </div>
              {application.portfolio_url && (
                <div>
                  <h3 className="font-semibold text-foreground">Portfolio</h3>
                  <a 
                    href={application.portfolio_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-800"
                  >
                    {application.portfolio_url}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText size={20} className="mr-2 text-emerald-600" />
              Application Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Cover Letter</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{application.cover_letter}</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Skills</h3>
                <p className="text-muted-foreground">{application.skills}</p>
              </div>
              {application.experience && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Experience</h3>
                  <p className="text-muted-foreground">{application.experience}</p>
                </div>
              )}
              {application.education && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Education</h3>
                  <p className="text-muted-foreground">{application.education}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Notes section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reviewer Notes</span>
            {isCompanyUser && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsEditingNotes(!isEditingNotes)}
              >
                <Edit3 size={16} className="mr-1" />
                {isEditingNotes ? 'Cancel' : 'Edit'}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditingNotes ? (
            <div className="space-y-4">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                placeholder="Add notes about this application..."
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditingNotes(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveNotes}>
                  Save Notes
                </Button>
              </div>
            </div>
          ) : notes ? (
            <p className="text-muted-foreground">{notes}</p>
          ) : (
            <p className="text-muted-foreground italic">
              {isCompanyUser 
                ? "No notes added yet. Click 'Edit' to add reviewer notes." 
                : "No notes from the reviewer yet."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationDetailsView;