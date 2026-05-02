import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermission } from '../hooks/usePermission';

/**
 * ProtectedRoute — Guards routes by auth state and role.
 *
 * Props:
 *   allowedRoles  string[]  — list of roles allowed (e.g. ['admin','student'])
 *   permission    string    — fine-grained permission key (rolePermissions.js)
 *   children                — when used as a wrapper component
 *                             (no children = uses <Outlet> for nested routes)
 */
const ProtectedRoute = ({ children, permission, allowedRoles }) => {
    const { user, token } = useAuth();
    const { hasPermission } = usePermission();

    // 1. Not authenticated at all
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    const userRole = (user.role || '').toLowerCase();

    // 2. super_admin bypasses all checks
    if (userRole === 'super_admin') {
        return children ? children : <Outlet />;
    }

    // 3. allowedRoles check
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 4. Fine-grained permission check (rolePermissions.js)
    if (permission && !hasPermission(permission)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;

