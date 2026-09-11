import { useMemo, useState } from 'react';
import { AuthContext } from './auth-context';

const normalizeRole = (rawRole) => {
  if (!rawRole) return 'Student';
  const normalized = rawRole.toString().trim().toLowerCase().replace(/[-_]/g, ' ');
  if (normalized === 'super admin' || normalized === 'superadmin' || normalized === 'admin') return 'Super Admin';
  if (normalized === 'industry trainer') return 'Industry Trainer';
  if (normalized === 'trainer' || normalized === 'guru') return 'Trainer';
  if (normalized === 'training institute' || normalized === 'institute') return 'Training Institute';
  if (normalized === 'college') return 'College';
  if (normalized === 'industry supervisor' || normalized === 'supervisor') return 'Industry Supervisor';
  if (normalized === 'company' || normalized === 'spoc') return 'Company';
  if (normalized === 'placement officer' || normalized === 'placement') return 'Placement Officer';
  if (normalized === 'parent') return 'Parent';
  return 'Student';
};

const defaultDashboardForRole = (role) => {
  switch (role) {
    case 'Trainer':
    case 'Industry Trainer':
      return 'b';
    case 'Company':
    case 'Industry Supervisor':
      return 'c';
    case 'Super Admin':
      return 'd';
    case 'Training Institute':
      return 'e';
    case 'College':
      return 'f';
    case 'Placement Officer':
      return 'g';
    case 'Parent':
      return 'h';
    default:
      return 'a';
  }
};

const normalizeUser = (rawUser) => {
  if (!rawUser) return null;
  const normalizedRole = normalizeRole(rawUser.role);
  return {
    ...rawUser,
    role: normalizedRole,
    dashboard: rawUser.dashboard || defaultDashboardForRole(normalizedRole),
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? normalizeUser(JSON.parse(storedUser)) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const login = async ({ email, password, role }) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      const text = await response.text().catch(() => '');
      throw new Error(`Server returned ${response.status} ${response.statusText}: ${text || 'No response body'}`);
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Unable to sign in. Please check your email and password.');
    }

    const normalizedRole = normalizeRole(data.user.role);
    const normalizedUser = normalizeUser({
      ...data.user,
      role: normalizedRole,
    });

    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }

    localStorage.setItem('user', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
    return normalizedUser;
  };

  const loginWithGoogle = async ({ credential, requestedRole = 'Student' }) => {
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential, requestedRole }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Google sign in failed');
    }

    const normalizedRole = normalizeRole(data.user.role);
    const normalizedUser = normalizeUser({
      ...data.user,
      role: normalizedRole,
    });

    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
    }

    localStorage.setItem('user', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
    return normalizedUser;
  };

  const updateUser = (updatedUserData) => {
    const normalizedUser = normalizeUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setToken(null);
  };

  const authFetch = (url, options = {}) => {
    const headers = {
      ...(options.headers || {}),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return fetch(url, { ...options, headers });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      loginWithGoogle,
      logout,
      updateUser,
      authFetch,
      isAuthenticated: Boolean(user),
    }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { useAuth } from './useAuth';
