import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, MapPinIcon, CalendarIcon, ClockIcon, CheckIcon, XIcon } from 'lucide-react';
import { getInternship, approveInternship, rejectInternship } from '../api';
import { useToast } from '../components/ToastProvider';
const InternshipApproval = () => {
  const { showWarning } = useToast();
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  useEffect(() => {
    // Load from API only
    getInternship(Number(id)).then((it: any) => {
      setInternship({
        ...it,
        companyEmail: (it.postedBy && it.postedBy.email) || ''
      } as any)
      setLoading(false)
    }).catch(() => {
      setInternship(null as any)
      setLoading(false)
    })
  }, [id]);
  const handleApprove = () => {
    approveInternship(Number(id)).then(() => {
      setInternship((prev: any) => ({ ...(prev || {}), status: 'approved' }));
      setTimeout(() => navigate('/admin-dashboard'), 1500);
    }).catch(() => {});
  };
  const handleReject = () => {
    if (!rejectionReason) {
      showWarning('Reason Required', 'Please provide a reason for rejection');
      return;
    }
    rejectInternship(Number(id), rejectionReason).then(() => {
      setInternship((prev: any) => ({ ...(prev || {}), status: 'rejected', rejectionReason }));
      setTimeout(() => navigate('/admin-dashboard'), 1500);
    }).catch(() => {});
  };
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }
  if (!internship) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600">Internship not found</div>
      </div>
    );
  }
  
  return <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-emerald-600 hover:text-emerald-800 mb-6">
        <ArrowLeftIcon size={16} className="mr-1" />
        Back to Dashboard
      </button>
      {internship.status === 'approved' && <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
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
        </div>}
      {internship.status === 'rejected' && <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
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
        </div>}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Internship Approval
          </h1>
          <p className="text-sm text-gray-500">
            Review this internship listing before approving or rejecting
          </p>
        </div>
        <div className="p-6">
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {internship.title}
                </h2>
                <p className="text-lg text-gray-600 mt-1">
                  {internship.company}
                </p>
              </div>
              <div className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {internship.type}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center text-gray-600">
                <MapPinIcon size={18} className="mr-1" />
                <span>{internship.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CalendarIcon size={18} className="mr-1" />
                <span>{internship.duration}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <ClockIcon size={18} className="mr-1" />
                <span>
                  Deadline: {new Date(internship.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="mt-2 text-gray-600">
              <span className="font-medium">Compensation:</span>{' '}
              {internship.salary}
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Description
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="whitespace-pre-wrap text-gray-700">
                {internship.description}
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Responsibilities
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {internship.responsibilities.map((item: string, index: number) => <li key={index}>{item}</li>)}
              </ul>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Requirements
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {internship.requirements.map((item: string, index: number) => <li key={index}>{item}</li>)}
              </ul>
            </div>
          </div>
          <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Benefits</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {internship.benefits.map((item: string, index: number) => <li key={index}>{item}</li>)}
              </ul>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Company Contact
            </h3>
            <p className="text-gray-700">{internship.companyEmail}</p>
          </div>
          {internship.status === 'pending' && <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Admin Decision
              </h3>
              {showRejectionForm ? <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Rejection
                  </label>
                  <textarea id="rejectionReason" rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Provide a reason for rejecting this internship..." value={rejectionReason} onChange={e => setRejectionReason(e.target.value)}></textarea>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button onClick={() => setShowRejectionForm(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Cancel
                    </button>
                    <button onClick={handleReject} className="px-4 py-2 bg-red-600 border border-red-600 rounded-md text-sm font-medium text-white hover:bg-red-700">
                      Confirm Rejection
                    </button>
                  </div>
                </div> : <div className="flex justify-end space-x-3">
                  <button onClick={() => setShowRejectionForm(true)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Reject
                  </button>
                  <button onClick={handleApprove} className="px-4 py-2 bg-emerald-600 border border-emerald-600 rounded-md text-sm font-medium text-white hover:bg-emerald-700">
                    Approve
                  </button>
                </div>}
            </div>}
        </div>
      </div>
    </div>;
};
export default InternshipApproval;