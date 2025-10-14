import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, FileText, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ApplicationConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [applicationData, setApplicationData] = useState({
    internshipTitle: '',
    company: '',
    applicationId: null as number | null
  });

  useEffect(() => {
    // Get application data from location state
    if (location.state) {
      setApplicationData(location.state as any);
    }
  }, [location.state]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
          Application Submitted Successfully!
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your application for <span className="font-semibold">{applicationData.internshipTitle}</span> at <span className="font-semibold">{applicationData.company}</span> has been received.
        </p>
      </div>

      <div className="mt-12 bg-card rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">What happens next?</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-base font-medium text-foreground">Review Process</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                The company will review your application. This typically takes 3-5 business days.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-base font-medium text-foreground">Status Updates</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You'll receive email notifications about your application status.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <Button 
          onClick={() => navigate('/student-dashboard')}
          className="px-6 py-3"
        >
          View My Applications
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate('/search')}
          className="px-6 py-3"
        >
          Browse More Internships
        </Button>
      </div>
    </div>
  );
};

export default ApplicationConfirmation;