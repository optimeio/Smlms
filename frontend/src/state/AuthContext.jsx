import { useMemo, useState } from 'react';
import { AuthContext } from './auth-context';

const normalizeRole = (rawRole) => {
  if (!rawRole) return 'Student';
  const normalized = rawRole.toString().trim().toLowerCase();
  if (normalized === 'super admin' || normalized === 'superadmin' || normalized === 'admin') return 'Super Admin';
  if (normalized === 'trainer') return 'Trainer';
  if (normalized === 'company') return 'Company';
  return 'Student';
};

const defaultDashboardForRole = (role) => {
  switch (role) {
    case 'Trainer':
      return 'b';
    case 'Company':
      return 'c';
    case 'Super Admin':
      return 'd';
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

  const login = async ({ email, password }) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
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
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      updateUser,
      isAuthenticated: Boolean(user),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

