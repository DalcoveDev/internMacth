import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles
}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case 'student':
        return <Navigate to="/student-dashboard" />;
      case 'company':
        return <Navigate to="/company-dashboard" />;
      case 'admin':
        return <Navigate to="/admin-dashboard" />;
      default:
        return <Navigate to="/" />;
    }
  }
  return <>{children}</>;
};
export default ProtectedRoute;