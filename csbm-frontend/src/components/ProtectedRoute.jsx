import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute Wrapper
 * Supports two modes:
 *  1. Layout mode (no children) — renders <Outlet /> for nested routes inside MainLayout
 *  2. Wrapper mode (with children) — renders children directly for standalone routes
 *
 * @param {Array} allowedRoles - Roles permitted to access the route
 * @param {ReactNode} children  - Optional child element (wrapper mode)
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // 1. Not logged in → Login
    if (!token || !userRole) {
        return <Navigate to="/login" replace />;
    }

    // 2. Role not allowed → redirect to their home
    const roleLower = userRole?.toLowerCase();
    const allowedLower = allowedRoles.map(r => r.toLowerCase());

    if (!allowedLower.includes(roleLower)) {
        if (roleLower === 'student') return <Navigate to="/student-dashboard" replace />;
        if (roleLower === 'admin') return <Navigate to="/admin-dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    // 3. Authorized — render children (wrapper mode) or Outlet (layout mode)
    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
