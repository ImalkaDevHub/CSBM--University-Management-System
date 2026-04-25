import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { usePermission } from '../hooks/usePermission';

const ProtectedRoute = ({ children, permission, allowedRoles }) => {
    const { role, hasPermission } = usePermission();
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Global bypass for super_admin
    if (userRole === 'super_admin' || role === 'super_admin') {
        return children ? children : <Outlet />;
    }

    // Support legacy allowedRoles check
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Support new permission check
    if (permission && !hasPermission(permission)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
