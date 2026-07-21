import { Suspense, useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/useAuth';
import AppLayout from './AppLayout';

const roleNavigation = {
  Student: [
    { key: 'dashboard', label: 'Dashboard', path: '/app/a/dashboard' },
    { key: 'courses', label: 'My Courses', path: '/app/a/courses' },
    { key: 'live', label: 'Live Classes', path: '/app/a/live' },
    { key: 'assignments', label: 'Assignments & Quiz', path: '/app/a/assignments' },
    { key: 'certificates', label: 'Certificates', path: '/app/a/certificates' },
    { key: 'jobs', label: 'Job Offers', path: '/app/a/jobs' },
    { key: 'trainers', label: 'Trainer Directory', path: '/app/a/trainers' },
    { key: 'companies', label: 'Company Directory', path: '/app/a/companies' },
    { key: 'profile', label: 'Profile', path: '/app/a/profile' },
    { key: 'settings', label: 'Settings', path: '/app/a/settings' },
    { key: 'logout', label: 'Logout', action: 'logout' },
  ],
  Trainer: [
    { key: 'dashboard', label: 'Dashboard', path: '/app/b/dashboard' },
    { key: 'courses', label: 'My Courses', path: '/app/b/courses' },
    { key: 'students', label: 'Students', path: '/app/b/students' },
    { key: 'schedule', label: 'Schedule', path: '/app/b/schedule' },
    { key: 'live', label: 'Live Classes', path: '/app/b/live' },
    { key: 'assignments', label: 'Assignments', path: '/app/b/assignments' },
    { key: 'materials', label: 'Study Materials', path: '/app/b/materials' },
    { key: 'attendance', label: 'Attendance', path: '/app/b/attendance' },
    { key: 'reports', label: 'Reports', path: '/app/b/reports' },
    { key: 'notifications', label: 'Notifications', path: '/app/b/notifications' },
    { key: 'profile', label: 'Profile', path: '/app/b/profile' },
    { key: 'settings', label: 'Settings', path: '/app/b/settings' },
    { key: 'logout', label: 'Logout', action: 'logout' },
  ],
  Company: [
    { key: 'dashboard', label: 'Dashboard', path: '/app/c/dashboard' },
    { key: 'jobs', label: 'Job Offers', path: '/app/c/jobs' },
    { key: 'courses', label: 'My Courses', path: '/app/c/courses' },
    { key: 'live', label: 'Live Classes', path: '/app/c/live' },
    { key: 'assignments', label: 'Assignments', path: '/app/c/assignments' },
    { key: 'certificates', label: 'Certificates', path: '/app/c/certificates' },
    { key: 'notifications', label: 'Notifications', path: '/app/c/notifications' },
    { key: 'trainers', label: 'Trainer Directory', path: '/app/c/trainers' },
    { key: 'register-trainer', label: 'Register Trainer', path: '/app/c/register-trainer' },
    { key: 'profile', label: 'Profile', path: '/app/c/profile' },
    { key: 'settings', label: 'Settings', path: '/app/c/settings' },
    { key: 'logout', label: 'Logout', action: 'logout' },
  ],
  'Super Admin': [
    { key: 'dashboard', label: 'Dashboard', path: '/app/d/dashboard' },
    { key: 'users', label: 'User Management', path: '/app/d/users' },
    { key: 'companies', label: 'Companies', path: '/app/d/companies' },
    { key: 'students', label: 'Students', path: '/app/d/students' },
    { key: 'trainers', label: 'Trainers', path: '/app/d/trainers' },
    { key: 'spoc', label: 'SPOC', path: '/app/d/spoc' },
    { key: 'job-offers', label: 'Job Offers', path: '/app/d/job-offers' },
    { key: 'courses', label: 'Course Management', path: '/app/d/courses' },
    { key: 'categories', label: 'Categories', path: '/app/d/categories' },
    { key: 'scheduling', label: 'Scheduling', path: '/app/d/scheduling' },
    { key: 'live', label: 'Live Classes', path: '/app/d/live' },
    { key: 'assignments', label: 'Assignments', path: '/app/d/assignments' },
    { key: 'attendance', label: 'Attendance', path: '/app/d/attendance' },
    { key: 'certificates', label: 'Certificates', path: '/app/d/certificates' },
    { key: 'reports', label: 'Reports', path: '/app/d/reports' },
    { key: 'notifications', label: 'Notifications', path: '/app/d/notifications' },
    { key: 'system', label: 'System Settings', path: '/app/d/system' },
    { key: 'documents', label: 'Document Manager', path: '/app/d/documents' },
    { key: 'audit', label: 'Audit Logs', path: '/app/d/audit' },
    { key: 'profile', label: 'Profile', path: '/app/d/profile' },
    { key: 'logout', label: 'Logout', action: 'logout' },
  ],
};

export default function DashboardShell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');

  useEffect(() => {
    // FIX 2: Added .startsWith helper to correctly evaluate sub-routes if paths expand
    const navItems = user ? (roleNavigation[user.role] ?? roleNavigation.Student) : [];
    const activeItem = navItems.find(item => item.path && location.pathname.startsWith(item.path));
    if (activeItem) {
      setActiveTab(activeItem.label);
    }
  }, [location.pathname, user]);

  if (!user) {
    return null;
  }

  const currentSegment = location.pathname.replace(/^\/app\/?/, '').split('/')[0];
  const dashboardSegment = user.dashboard || 'a';
  const allowedPath = `/app/${dashboardSegment}`;

  if (!currentSegment || currentSegment === '') {
    return <Navigate to={allowedPath} replace />;
  }

  if (currentSegment !== dashboardSegment) {
    return <Navigate to={allowedPath} replace />;
  }

  const navItems = roleNavigation[user.role] ?? roleNavigation.Student;

  const handleSidebarAction = (item) => {
    if (item.action === 'logout') {
      logout();
      navigate('/login');
    } else if (item.path) {
      navigate(item.path);
      setActiveTab(item.label);
    } else {
      setActiveTab(item.label);
    }
  };

  // FIX 3: Pass down both name and path so your AppLayout designs can safely use either links or handlers
  const sidebarItems = navItems.map(item => ({
    name: item.label,
    path: item.path || '#',
    action: () => handleSidebarAction(item)
  }));

  return (
    <AppLayout
      user={user}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      sidebarItems={sidebarItems}
      onSignOut={() => handleSidebarAction({ action: 'logout' })}
    >
      <div style={{ position: 'relative', minHeight: '100%', overflow: 'hidden' }}>
        <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>Loading dashboard…</div>}>
          <Outlet />
        </Suspense>
      </div>
    </AppLayout>
  );
}
