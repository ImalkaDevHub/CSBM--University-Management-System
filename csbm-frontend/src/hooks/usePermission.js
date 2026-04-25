import { useState, useEffect } from 'react';
import { rolePermissions } from '../config/rolePermissions';

export const usePermission = () => {
    const [role, setRole] = useState(() => {
        const storedRole = localStorage.getItem('userRole');
        return storedRole ? storedRole.toLowerCase() : '';
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const storedRole = localStorage.getItem('userRole');
            setRole(storedRole ? storedRole.toLowerCase() : '');
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const hasPermission = (permissionKey) => {
        if (!role) return false;
        if (role === 'super_admin') return true;
        const permissions = rolePermissions[role] || [];
        return permissions.includes('*') || permissions.includes(permissionKey);
    };

    return { role, hasPermission };
};
