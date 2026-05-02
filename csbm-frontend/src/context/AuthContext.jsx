import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * AuthContext — Single source of truth for authenticated user state.
 * Reads from / writes to localStorage so it stays in sync with Login.jsx.
 *
 * Provides:
 *   user   → { _id, name, email, role, ... } | null
 *   token  → string | null
 *   login(userData, token) → call this after successful login
 *   logout()               → clears everything and redirects to /login
 */
const AuthContext = createContext(null);

const readLocalStorage = () => {
  try {
    const token = localStorage.getItem('token');
    const raw   = localStorage.getItem('user');
    const role  = localStorage.getItem('userRole');   // fallback role key
    const name  = localStorage.getItem('userName');   // fallback name key

    if (!token) return { token: null, user: null };

    let user = raw ? JSON.parse(raw) : null;

    // Patch missing fields from flat localStorage keys (Login.jsx compat)
    if (user) {
      if (!user.role && role) user.role = role.toLowerCase();
      if (!user.name && name) user.name = name;
    } else if (role) {
      // No user object stored — build a minimal one from flat keys
      user = { role: role.toLowerCase(), name: name || '' };
    }

    return { token, user };
  } catch {
    return { token: null, user: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(readLocalStorage);

  // Re-sync when another tab changes localStorage
  useEffect(() => {
    const handleStorage = () => setAuth(readLocalStorage());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  /** Call after a successful login API response */
  const login = useCallback((userData, token) => {
    localStorage.setItem('token',    token);
    localStorage.setItem('userRole', (userData.role || '').toLowerCase());
    localStorage.setItem('userName', userData.name || userData.fullName || '');
    localStorage.setItem('user',     JSON.stringify(userData));
    setAuth({ token, user: { ...userData, role: (userData.role || '').toLowerCase() } });
  }, []);

  /** Call on logout */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('user');
    setAuth({ token: null, user: null });
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider value={{ user: auth.user, token: auth.token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/** Convenience hook */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
