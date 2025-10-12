import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  allowGuest?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  allowGuest = false
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!user && !allowGuest) {
    return <Navigate to="/login" />;
  }

  // If user is not logged in but guest access is allowed, show the page
  if (!user && allowGuest) {
    return <>{children}</>;
  }

  // At this point, we know user is not null
  const currentUser = user!;

  if (!allowedRoles.includes(currentUser.role)) {
    // Show access denied message and redirect to appropriate dashboard
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page. Your role is: <span className="font-semibold text-emerald-600">{currentUser.role}</span>
          </p>
          <button
            onClick={() => {
              switch (currentUser.role) {
                case 'student':
                  window.location.href = '/student-dashboard';
                  break;
                case 'company':
                  window.location.href = '/company-dashboard';
                  break;
                case 'admin':
                  window.location.href = '/admin-dashboard';
                  break;
                default:
                  window.location.href = '/';
              }
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;