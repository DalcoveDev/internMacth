import React from 'react';
import { useAuth } from '../contexts/AuthContext';

// Role definitions and permissions
export type Role = 'student' | 'company' | 'admin';
export type Permission = 
  | 'read_internships'
  | 'create_internships'
  | 'edit_internships'
  | 'delete_internships'
  | 'approve_internships'
  | 'read_applications'
  | 'create_applications'
  | 'edit_applications'
  | 'approve_applications'
  | 'reject_applications'
  | 'read_users'
  | 'create_users'
  | 'edit_users'
  | 'delete_users'
  | 'read_analytics'
  | 'read_admin_analytics'
  | 'manage_system';

// Role-permission mapping
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  student: [
    'read_internships',
    'create_applications',
    'read_applications', // Own applications only
    'read_analytics' // Own analytics only
  ],
  company: [
    'read_internships',
    'create_internships',
    'edit_internships', // Own internships only
    'delete_internships', // Own internships only
    'read_applications', // For own internships only
    'approve_applications', // For own internships only
    'reject_applications', // For own internships only
    'read_analytics' // Own analytics only
  ],
  admin: [
    'read_internships',
    'create_internships',
    'edit_internships',
    'delete_internships',
    'approve_internships',
    'read_applications',
    'create_applications',
    'edit_applications',
    'approve_applications',
    'reject_applications',
    'read_users',
    'create_users',
    'edit_users',
    'delete_users',
    'read_analytics',
    'read_admin_analytics',
    'manage_system'
  ]
};

// Hook for role-based access control
export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!user) return false;
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (!user) return false;
    return permissions.every(permission => hasPermission(permission));
  };

  const getUserPermissions = (): Permission[] => {
    if (!user) return [];
    return ROLE_PERMISSIONS[user.role] ?? [];
  };

  const canAccessRoute = (requiredRoles: Role[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  const canManageResource = (resourceType: 'internship' | 'application' | 'user', resourceOwnerId?: number): boolean => {
    if (!user) return false;

    // Admin can manage everything
    if (user.role === 'admin') return true;

    // Users can only manage their own resources (if ownership is specified)
    if (resourceOwnerId !== undefined && user.id !== resourceOwnerId) return false;

    // Check specific permissions based on resource type
    switch (resourceType) {
      case 'internship':
        return hasPermission('edit_internships') || hasPermission('delete_internships');
      case 'application':
        return hasPermission('edit_applications') || hasPermission('approve_applications');
      case 'user':
        return hasPermission('edit_users');
      default:
        return false;
    }
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getUserPermissions,
    canAccessRoute,
    canManageResource,
    userRole: user?.role,
    isAuthenticated: !!user
  };
};

// Component wrapper for permission-based rendering
interface PermissionGateProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  requiredPermission,
  requiredPermissions = [],
  requireAll = false,
  fallback = null
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  let hasAccess = false;

  if (requiredPermission) {
    hasAccess = hasPermission(requiredPermission);
  } else if (requiredPermissions.length > 0) {
    hasAccess = requireAll 
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
  } else {
    hasAccess = true; // No restrictions
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

// Role-based component wrapper
interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: React.ReactNode;
}

export const RoleGate: React.FC<RoleGateProps> = ({
  children,
  allowedRoles,
  fallback = null
}) => {
  const { canAccessRoute } = usePermissions();
  
  return canAccessRoute(allowedRoles) ? <>{children}</> : <>{fallback}</>;
};

// Utility functions for common permission checks
export const canCreateInternship = (userRole?: Role): boolean => {
  return userRole === 'company' || userRole === 'admin';
};

export const canApproveInternship = (userRole?: Role): boolean => {
  return userRole === 'admin';
};

export const canApplyToInternship = (userRole?: Role): boolean => {
  return userRole === 'student';
};

export const canManageApplications = (userRole?: Role): boolean => {
  return userRole === 'company' || userRole === 'admin';
};

export const canAccessAdminFeatures = (userRole?: Role): boolean => {
  return userRole === 'admin';
};

// Default export
export default usePermissions;