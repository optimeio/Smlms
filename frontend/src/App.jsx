import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, useEffect } from 'react';
import { useAuth } from './state/useAuth';
import './App.css';

import Home from './pages/Home';
import Courses from './pages/Courses';
import AdditionalCourses from './pages/AdditionalCourses';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentSignup from './pages/StudentSignup';
import TrainerSignup from './pages/TrainerSignup';
import CompanySignup from './pages/CompanySignup';
import About from './pages/About';
import Contact from './pages/Contact';
import ForgotPassword from './pages/ForgotPassword';
import OTPVerification from './pages/OTPVerification';
import ResetPassword from './pages/ResetPassword';
import AdminPortal from './pages/AdminPortal';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardShell from './components/DashboardShell';
import DashboardLanding from './pages/DashboardLanding';
import ProfilePage from './pages/ProfilePage';
import UserDirectory from './pages/UserDirectory';

const StudentDashboard = lazy(() => import('./pages/dashboards/StudentDashboard'));
const StudentJobOffers = lazy(() => import('./pages/dashboards/StudentJobOffers'));
const StudentSettings = lazy(() => import('./pages/dashboards/StudentSettings'));
const StudentCourses = lazy(() => import('./pages/dashboards/StudentCourses'));
const CoursePlayer = lazy(() => import('./pages/dashboards/CoursePlayer'));
const StudentLiveClasses = lazy(() => import('./pages/dashboards/StudentLiveClasses'));
const StudentCertificates = lazy(() => import('./pages/dashboards/StudentCertificates'));
const TrainerDashboard = lazy(() => import('./pages/dashboards/TrainerDashboard'));
const TrainerCourses = lazy(() => import('./pages/dashboards/TrainerCourses'));
const TrainerSchedule = lazy(() => import('./pages/dashboards/TrainerSchedule'));
const TrainerLiveClasses = lazy(() => import('./pages/dashboards/TrainerLiveClasses'));
const TrainerAttendance = lazy(() => import('./pages/dashboards/TrainerAttendance'));
const SpocDashboard = lazy(() => import('./pages/dashboards/SpocDashboard'));
const CompanyCourses = lazy(() => import('./pages/dashboards/CompanyCourses'));
const CompanyJobOffers = lazy(() => import('./pages/dashboards/CompanyJobOffers'));
const CompanyLiveClasses = lazy(() => import('./pages/dashboards/CompanyLiveClasses'));
const CompanyAssignments = lazy(() => import('./pages/dashboards/CompanyAssignments'));
const CompanyCertificates = lazy(() => import('./pages/dashboards/CompanyCertificates'));
const CompanyTrainers = lazy(() => import('./pages/dashboards/CompanyTrainers'));
const RegisterTrainer = lazy(() => import('./pages/dashboards/RegisterTrainer'));
const CompanyNotifications = lazy(() => import('./pages/dashboards/CompanyNotifications'));
const CompanySettings = lazy(() => import('./pages/dashboards/CompanySettings'));
const SuperAdminDashboard = lazy(() => import('./pages/dashboards/SuperAdminDashboard'));
const AdminLiveClasses = lazy(() => import('./pages/dashboards/AdminLiveClasses'));

const StudentAssignments = lazy(() => import('./pages/dashboards/StudentAssignments'));
const TrainerAssignments = lazy(() => import('./pages/dashboards/TrainerAssignments'));
const TrainerMaterials = lazy(() => import('./pages/dashboards/TrainerMaterials'));
const TrainerReports = lazy(() => import('./pages/dashboards/TrainerReports'));
const TrainerMessages = lazy(() => import('./pages/dashboards/TrainerMessages'));
const TrainerNotifications = lazy(() => import('./pages/dashboards/TrainerNotifications'));
const TrainerSettings = lazy(() => import('./pages/dashboards/TrainerSettings'));

const AdminUsers = lazy(() => import('./pages/dashboards/AdminUsers'));
const AdminEnrolledCourses = lazy(() => import('./pages/dashboards/AdminEnrolledCourses'));
const AdminSpoc = lazy(() => import('./pages/dashboards/AdminSpoc'));
const AdminCourses = lazy(() => import('./pages/dashboards/AdminCourses'));
const AdminJobOffers = lazy(() => import('./pages/dashboards/AdminJobOffers'));
const AdminCategories = lazy(() => import('./pages/dashboards/AdminCategories'));
const AdminScheduling = lazy(() => import('./pages/dashboards/AdminScheduling'));
const AdminAssignments = lazy(() => import('./pages/dashboards/AdminAssignments'));
const AdminAttendance = lazy(() => import('./pages/dashboards/AdminAttendance'));
const AdminCertificates = lazy(() => import('./pages/dashboards/AdminCertificates'));
const AdminReports = lazy(() => import('./pages/dashboards/AdminReports'));
const AdminNotifications = lazy(() => import('./pages/dashboards/AdminNotifications'));
const AdminSystem = lazy(() => import('./pages/dashboards/AdminSystem'));
const AdminDocuments = lazy(() => import('./pages/dashboards/AdminDocuments'));
const AdminAudit = lazy(() => import('./pages/dashboards/AdminAudit'));
const AdminProfile = lazy(() => import('./pages/dashboards/AdminProfile'));
const AdminUserDirectory = lazy(() => import('./pages/dashboards/AdminUserDirectory'));


const PlaceholderPage = ({ title, description = 'This page is currently under construction.' }) => {
  const location = window.location.pathname;
  const pathParts = location.split('/');
  const routeName = pathParts[pathParts.length - 1];
  const resolvedTitle = title || (routeName.charAt(0).toUpperCase() + routeName.slice(1));

  return (
    <div style={{ padding: 40, background: '#fff', borderRadius: 14, border: '1px solid #eef0f3', textAlign: 'center' }}>
      <h2 style={{ color: '#1B1F3B', margin: '0 0 8px 0' }}>{resolvedTitle}</h2>
      <p style={{ color: '#64748B', margin: 0 }}>{description}</p>
    </div>
  );
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  
  if (user.email === 'admin@smgroups.com' || user.email === 'thesmgroups@gmail.com') {
    return <Navigate to="/admin" replace />;
  }

  const role = (user.role || '').toLowerCase();
  switch (role) {
    case 'student':
      return <Navigate to="/app/a/dashboard" replace />;
    case 'trainer':
      return <Navigate to="/app/b/dashboard" replace />;
    case 'spoc':
    case 'company':
      return <Navigate to="/app/c/dashboard" replace />;
    case 'superadmin':
      return <Navigate to="/app/d/dashboard" replace />;
    default:
      return <Navigate to="/app/a/dashboard" replace />;
  }
};

const ThemeManager = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    const theme = user?.settings?.theme || 'light';
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
    }
  }, [user?.settings?.theme]);
  
  return null;
};

export default function App() {
  return (
    <Router>
      <ThemeManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/additional-courses" element={<AdditionalCourses />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/student" element={<StudentSignup />} />
        <Route path="/register/trainer" element={<TrainerSignup />} />
        <Route path="/register/company" element={<CompanySignup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />
        <Route path="/admin" element={<AdminPortal />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardLanding />} />
          <Route path="a">
            <Route index element={<StudentDashboard />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="live" element={<StudentLiveClasses />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="certificates" element={<StudentCertificates />} />
            <Route path="jobs" element={<StudentJobOffers />} />
            <Route path="students" element={<UserDirectory role="student" title="Student Directory" subtitle="Browse student records, enrollment status, and academic details." />} />
            <Route path="trainers" element={<UserDirectory role="trainer" title="Trainer Directory" subtitle="Browse trainer profiles, expertise, and contact information." />} />
            <Route path="companies" element={<UserDirectory role="company" title="Company Directory" subtitle="Browse company partners, programs, and placement contacts." />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<StudentSettings />} />
            <Route path="*" element={<PlaceholderPage />} />
          </Route>
          <Route path="player/:courseId" element={<CoursePlayer />} />
          <Route path="b">
            <Route index element={<TrainerDashboard />} />
            <Route path="dashboard" element={<TrainerDashboard />} />
            <Route path="courses" element={<TrainerCourses />} />
            <Route path="students" element={<UserDirectory role="student" title="Students" subtitle="Browse student records, enrollment status, and academic details." />} />
            <Route path="schedule" element={<TrainerSchedule />} />
            <Route path="live" element={<TrainerLiveClasses />} />
            <Route path="assignments" element={<TrainerAssignments />} />
            <Route path="materials" element={<TrainerMaterials />} />
            <Route path="attendance" element={<TrainerAttendance />} />
            <Route path="reports" element={<TrainerReports />} />
            <Route path="messages" element={<TrainerMessages />} />
            <Route path="notifications" element={<TrainerNotifications />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<TrainerSettings />} />
            <Route path="*" element={<PlaceholderPage />} />
          </Route>
          <Route path="c">
            <Route index element={<SpocDashboard />} />
            <Route path="dashboard" element={<SpocDashboard />} />
            <Route path="jobs" element={<CompanyJobOffers />} />
            <Route path="courses" element={<CompanyCourses />} />
            <Route path="live" element={<CompanyLiveClasses />} />
            <Route path="assignments" element={<CompanyAssignments />} />
            <Route path="certificates" element={<CompanyCertificates />} />
            <Route path="trainers" element={<CompanyTrainers />} />
            <Route path="register-trainer" element={<RegisterTrainer />} />
            <Route path="notifications" element={<CompanyNotifications />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<CompanySettings />} />
            <Route path="*" element={<PlaceholderPage />} />
          </Route>
          <Route path="d">
            <Route index element={<SuperAdminDashboard />} />
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="companies" element={<AdminUserDirectory role="company" title="Company Directory" subtitle="Browse company partners, programs, and placement contacts." />} />
            <Route path="students" element={<AdminUserDirectory role="student" title="Student Directory" subtitle="Browse student records, enrollment status, and academic details." />} />
            <Route path="trainers" element={<AdminUserDirectory role="trainer" title="Trainer Directory" subtitle="Browse trainer profiles, expertise, and contact information." />} />
            <Route path="spoc" element={<AdminSpoc />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="enrolled" element={<AdminEnrolledCourses />} />
            <Route path="job-offers" element={<AdminJobOffers />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="scheduling" element={<AdminScheduling />} />
            <Route path="live" element={<AdminLiveClasses />} />
            <Route path="assignments" element={<AdminAssignments />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="certificates" element={<AdminCertificates />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="system" element={<AdminSystem />} />
            <Route path="documents" element={<AdminDocuments />} />
            <Route path="audit" element={<AdminAudit />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="*" element={<PlaceholderPage />} />
          </Route>
        </Route>
        <Route path="*" element={<div style={{ padding: '50px', textAlign: 'center', color: 'var(--text-primary)' }}>Page not found</div>} />
      </Routes>
    </Router>
  );
}