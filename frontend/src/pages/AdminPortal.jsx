import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPortal.css';
import '../styles/Dashboard.css';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const API = '/api/admin';
import AdminLiveClasses from './dashboards/AdminLiveClasses';
import AdminCompanyCourses from './dashboards/AdminCompanyCourses';
import AdminJobOffers from './dashboards/AdminJobOffers';
import { 
  AdminPage, AdminPageHeader, EnterpriseCard, AdminButton, AdminBadge, 
  AdminTableContainer, AdminTh, AdminTd, A 
} from '../components/AdminDesignSystem';
/* ---- CSV helper ---- */
function downloadCSV(rows, filename) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map(r =>
      headers.map(h => {
        let v = r[h] ?? '';
        if (Array.isArray(v)) v = v.join('; ');
        v = String(v).replace(/"/g, '""');
        return `"${v}"`;
      }).join(',')
    ),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ---- SVG Icons ---- */
const Icons = {
  Dashboard: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
  ),
  UserManagement: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Students: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
  ),
  Trainers: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
  ),
  Companies: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="10" width="20" height="12" rx="2"/><path d="M6 10V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6"/></svg>
  ),
  VerificationRequests: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
  ),
  Courses: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
  ),
  Jobs: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
  ),
  ContactRequests: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
  Reports: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  ),
  Settings: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  ),
  Logout: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  ),
  Search: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  ),
  Notification: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
  ),
  Lock: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  ),
  Edit: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
  ),
  Trash: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
  ),
  Check: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Cross: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  Folder: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
  ),
  Building: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
  ),
  Download: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
  ),
  Clock: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  Placements: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
  ),
  Certificates: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="m19 19.5-3-1.5-3 1.5V15h6v4.5Z"/><path d="M5 19.5 8 18l3 1.5V15H5v4.5Z"/><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"/></svg>
  ),
  Payments: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
  ),
  Analytics: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
  ),
  Calendar: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
  ),
  SupportTickets: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
  ),
  LiveClasses: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z"/><rect x="3" y="6" width="12" height="12" rx="2" ry="2"/></svg>
  )
};

const MENU_ITEMS = [
  { name: 'Dashboard', icon: Icons.Dashboard },
  { name: 'Students', icon: Icons.Students },
  { name: 'Trainers', icon: Icons.Trainers },
  { name: 'Companies', icon: Icons.Companies },
  { name: 'Courses', icon: Icons.Courses },
  { name: 'Company Courses', icon: Icons.Courses },
  { name: 'Live Classes', icon: Icons.LiveClasses },
  { name: 'Job Offers', icon: Icons.Jobs },
  { name: 'Trainer Requests', icon: Icons.SupportTickets },
  { name: 'Student Requests', icon: Icons.SupportTickets },
  { name: 'Contact Requests', icon: Icons.ContactRequests },
  { name: 'Reports', icon: Icons.Reports },
  { name: 'Activity Logs', icon: Icons.Reports },
  { name: 'Settings', icon: Icons.Settings }
];

export default function AdminPortal() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [toast, setToast] = useState(null);
  const [viewingResume, setViewingResume] = useState(null);

  // Verification requests state
  const [verifications, setVerifications] = useState([]);

  // Contact requests state
  const [contactRequests, setContactRequests] = useState([]);
  
  // System Requests State (Trainer/Student requests from companies)
  const [systemRequests, setSystemRequests] = useState([]);
  
  // Activity logs state
  const [activityLogs, setActivityLogs] = useState([]);

  // Courses state
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedScheduleCourse, setSelectedScheduleCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    id: null,
    title: '',
    name: '',
    originalPrice: '',
    price: '',
    description: '',
    image: '',
    imageFile: '',
    ppt: '',
    pptFile: '',
    video: '',
    videoFile: '',
    programType: 'Student Development Program',
    totalDurationHours: '',
    trainingDays: '',
    startDate: '',
    dailyStartTime: ''
  });
  const [showCourseAssignModal, setShowCourseAssignModal] = useState(false);
  const [courseToAssign, setCourseToAssign] = useState(null);
  const [assigneeEmail, setAssigneeEmail] = useState('');
  const [assigningCourse, setAssigningCourse] = useState(false);

  const [showTrainerAssignModal, setShowTrainerAssignModal] = useState(false);
  const [selectedCompanyEmail, setSelectedCompanyEmail] = useState('');
  const [selectedTrainerEmail, setSelectedTrainerEmail] = useState('');

  // Company Assignment State
  const [showCompanyAssignModal, setShowCompanyAssignModal] = useState(false);
  const [companyToAssign, setCompanyToAssign] = useState(null);
  const [assignSelections, setAssignSelections] = useState({ courses: [], trainers: [], students: [] });
  const [assigningCompany, setAssigningCompany] = useState(false);

  // Image Cropping State
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageFileName, setImageFileName] = useState('');

  // Detailed Course Content View & Assign Box states
  const [selectedCourseForContent, setSelectedCourseForContent] = useState(null);
  const [activeContentSection, setActiveContentSection] = useState('PPT');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignCollege, setAssignCollege] = useState('');
  const [assignDepartment, setAssignDepartment] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState([]);
  
  // Enrolled Users Modal State
  const [showEnrolledModal, setShowEnrolledModal] = useState(false);
  const [enrolledActiveTab, setEnrolledActiveTab] = useState('student');

  const fetchRegisteredUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setRegisteredUsers(data.users || []);
      }
    } catch (err) {
      console.error('Error fetching registered users:', err);
    }
  };

  const handleAssignCourseToStudent = async (studentEmail) => {
    try {
      const student = registeredUsers.find(u => u.email === studentEmail);
      if (!student) return;

      const courseTitle = selectedCourseForContent.title;
      const alreadyAssigned = (student.assignedCourses || []).includes(courseTitle);
      
      let updatedCourses;
      if (alreadyAssigned) {
        updatedCourses = (student.assignedCourses || []).filter(c => c !== courseTitle);
      } else {
        updatedCourses = [...(student.assignedCourses || []), courseTitle];
      }

      const res = await fetch(`/api/admin/users/${studentEmail}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courses: updatedCourses })
      });
      const data = await res.json();
      if (data.success) {
        showToast(alreadyAssigned ? 'Course unassigned successfully!' : 'Course assigned successfully!');
        fetchRegisteredUsers();
      } else {
        showToast(data.message || 'Failed to update course assignment.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error assigning course.', 'error');
    }
  };

  const handleUpdateUserApproval = async (email, newStatus) => {
    try {
      const isApproved = newStatus === 'Approved';
      const res = await fetch(`/api/admin/users/${email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Profile ${newStatus.toLowerCase()} successfully!`);
        fetchRegisteredUsers();
      } else {
        showToast(data.message || 'Failed to update status.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error updating status.', 'error');
    }
  };

  const renderUsersListTab = (roleName) => {
    const filteredUsers = registeredUsers.filter(u => u.role === roleName && 
      ((u.fullName || u.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
       (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
      <AdminPage>
        <AdminPageHeader 
          title={`${roleName.charAt(0).toUpperCase() + roleName.slice(1)}s Directory`}
          subtitle={`View and manage ${roleName} registrations, details, and verification status.`}
          emoji="👥"
        />

        <EnterpriseCard>
          <AdminTableContainer>
            <thead>
              <tr>
                <AdminTh>Details</AdminTh>
                <AdminTh>Location & Contact</AdminTh>
                {roleName === 'student' && <AdminTh>College & Dept</AdminTh>}
                {roleName === 'trainer' && <AdminTh>Expertise</AdminTh>}
                {roleName === 'company' && <AdminTh>Industry & Website</AdminTh>}
                <AdminTh>Status</AdminTh>
                <AdminTh>Action</AdminTh>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <AdminTd colSpan={roleName === 'student' || roleName === 'trainer' || roleName === 'company' ? 5 : 4} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                    No {roleName} records found.
                  </AdminTd>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isApproved = user.isApproved;
                  const statusText = user.status || (isApproved ? 'Approved' : 'Pending');
                  return (
                    <tr key={user.email}>
                      <AdminTd>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#005F7A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                            {user.fullName?.[0] || user.companyName?.[0] || 'U'}
                          </div>
                          <div>
                            <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>{user.fullName || user.companyName}</h5>
                            <p style={{ margin: 0, fontSize: '12.5px', color: '#64748B' }}>{user.email}</p>
                          </div>
                        </div>
                      </AdminTd>
                      <AdminTd>
                        <div style={{ fontWeight: 500, color: '#334155' }}>📞 {user.phone || user.hrPhone || 'N/A'}</div>
                        <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>📍 {user.location || user.district || 'N/A'}</div>
                      </AdminTd>
                      {roleName === 'student' && (
                        <AdminTd>
                          <div style={{ fontWeight: 600, color: '#334155' }}>{user.college || 'N/A'}</div>
                          <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>{user.department || 'N/A'}</div>
                        </AdminTd>
                      )}
                      {roleName === 'trainer' && (
                        <AdminTd>
                          <div style={{ fontWeight: 600, color: '#334155' }}>{user.expertise || 'N/A'}</div>
                          <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>{user.experienceYears ? `${user.experienceYears} Yrs Exp` : 'N/A'}</div>
                        </AdminTd>
                      )}
                      {roleName === 'company' && (
                        <AdminTd>
                          <div style={{ fontWeight: 600, color: '#334155' }}>{user.industry || 'N/A'}</div>
                          <div style={{ color: '#3B82F6', fontSize: '12px', marginTop: '4px' }}>
                            <a href={user.website} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{user.website || 'N/A'}</a>
                          </div>
                        </AdminTd>
                      )}
                      <AdminTd>
                        <AdminBadge variant={statusText === 'Approved' ? 'success' : statusText === 'Pending' ? 'warning' : 'danger'}>
                          {statusText}
                        </AdminBadge>
                      </AdminTd>
                      <AdminTd>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <AdminButton
                            variant="outline"
                            onClick={() => setViewingResume(user)}
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            👁 View
                          </AdminButton>
                          {roleName === 'company' && (
                            <AdminButton
                              variant="blue"
                              onClick={() => {
                                setCompanyToAssign(user);
                                setAssignSelections({
                                  courses: user.assignedCourses || [],
                                  trainers: user.assignedTrainers || [],
                                  students: user.assignedStudents || []
                                });
                                setShowCompanyAssignModal(true);
                              }}
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                            >
                              ⚙ Assign
                            </AdminButton>
                          )}
                          <AdminButton
                            variant="success"
                            onClick={() => handleUpdateUserApproval(user.email, 'Approved')}
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            ✔ Approve
                          </AdminButton>
                          <AdminButton
                            variant="danger"
                            onClick={() => handleUpdateUserApproval(user.email, 'Rejected')}
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            ✖ Reject
                          </AdminButton>
                        </div>
                      </AdminTd>
                    </tr>
                  );
                })
              )}
            </tbody>
          </AdminTableContainer>
        </EnterpriseCard>
      </AdminPage>
    );
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchContactRequests = async () => {
    try {
      const res = await fetch('/api/admin/access-requests');
      const data = await res.json();
      if (data.success) {
        setContactRequests(data.requests || []);
      }
    } catch (err) {
      console.error('Error fetching contact requests:', err);
    }
  };

  const handleUpdateAccessRequest = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/access-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Request successfully ${newStatus.toLowerCase()}!`);
        fetchContactRequests();
      } else {
        showToast(data.message || 'Failed to update request.', 'error');
      }
    } catch (err) {
      console.error('Error updating access request:', err);
      showToast('Connection error updating request.', 'error');
    }
  };

  // Derived activities based on actual registrations
  const activities = useMemo(() => {
    if (!registeredUsers || registeredUsers.length === 0) {
      return [
        { text: 'System initialized. Waiting for registrations...', time: 'Now', success: true }
      ];
    }
    return registeredUsers
      .slice(-4)
      .reverse()
      .map(u => ({
        text: `New ${u.role || 'user'} registered: ${u.fullName || u.companyName || u.email}`,
        time: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent',
        success: true
      }));
  }, [registeredUsers]);

  const fetchActivityLogs = async () => {
    try {
      const res = await fetch('/api/activities');
      const data = await res.json();
      if (data.success) {
        setActivityLogs(data.activities || []);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
  };

  const fetchSystemRequests = async () => {
    try {
      const res = await fetch('/api/requests');
      const data = await res.json();
      if (data.success) {
        setSystemRequests(data.requests || []);
      }
    } catch (err) {
      console.error('Error fetching system requests:', err);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      if (data.success) {
        setAnalyticsData(data.analytics || []);
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || (user.email !== 'admin@smgroups.com' && user.email !== 'thesmgroups@gmail.com')) {
      navigate('/login');
    } else {
      fetchContactRequests();
      fetchCourses();
      fetchRegisteredUsers();
      fetchSystemRequests();
      fetchAnalyticsData();
      if (activeTab === 'Activity Logs') {
        fetchActivityLogs();
      }
    }
  }, [navigate, activeTab]);

  const handleSaveCompanyAssignments = async () => {
    if (!companyToAssign) return;
    setAssigningCompany(true);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(companyToAssign.email)}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courses: assignSelections.courses,
          trainers: assignSelections.trainers,
          students: assignSelections.students
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Assignments updated successfully!');
        setShowCompanyAssignModal(false);
        fetchRegisteredUsers(); // refresh data
      } else {
        showToast(data.message || 'Failed to update assignments.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error updating assignments.', 'error');
    } finally {
      setAssigningCompany(false);
    }
  };

  const renderCompanyAssignModal = () => {
    if (!companyToAssign) return null;
    
    // Get all available options
    const availableCourses = courses;
    const availableTrainers = registeredUsers.filter(u => u.role === 'trainer' && u.isApproved);
    const availableStudents = registeredUsers.filter(u => u.role === 'student' && u.isApproved);

    const toggleSelection = (category, itemValue) => {
      setAssignSelections(prev => {
        const current = prev[category] || [];
        if (current.includes(itemValue)) {
          return { ...prev, [category]: current.filter(val => val !== itemValue) };
        } else {
          return { ...prev, [category]: [...current, itemValue] };
        }
      });
    };

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Assign to {companyToAssign.companyName || companyToAssign.fullName}</h3>
            <button onClick={() => setShowCompanyAssignModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}>×</button>
          </div>
          
          <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Courses Selection */}
            <div>
              <h4 style={{ margin: '0 0 12px 0', color: '#005F7A' }}>Assign Courses</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {availableCourses.map(c => (
                  <label key={c.title} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', backgroundColor: assignSelections.courses.includes(c.title) ? '#f0fdf4' : '#fff' }}>
                    <input type="checkbox" checked={assignSelections.courses.includes(c.title)} onChange={() => toggleSelection('courses', c.title)} />
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{c.title}</span>
                  </label>
                ))}
                {availableCourses.length === 0 && <span style={{ fontSize: '13px', color: '#64748b' }}>No courses available</span>}
              </div>
            </div>

            {/* Trainers Selection */}
            <div>
              <h4 style={{ margin: '0 0 12px 0', color: '#005F7A' }}>Assign Trainers</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {availableTrainers.map(t => (
                  <label key={t.email} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', backgroundColor: assignSelections.trainers.includes(t.email) ? '#f0fdf4' : '#fff' }}>
                    <input type="checkbox" checked={assignSelections.trainers.includes(t.email)} onChange={() => toggleSelection('trainers', t.email)} />
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{t.fullName}</span>
                  </label>
                ))}
                {availableTrainers.length === 0 && <span style={{ fontSize: '13px', color: '#64748b' }}>No approved trainers available</span>}
              </div>
            </div>

            {/* Students Selection */}
            <div>
              <h4 style={{ margin: '0 0 12px 0', color: '#005F7A' }}>Assign Students</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {availableStudents.map(s => (
                  <label key={s.email} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', backgroundColor: assignSelections.students.includes(s.email) ? '#f0fdf4' : '#fff' }}>
                    <input type="checkbox" checked={assignSelections.students.includes(s.email)} onChange={() => toggleSelection('students', s.email)} />
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{s.fullName}</span>
                  </label>
                ))}
                {availableStudents.length === 0 && <span style={{ fontSize: '13px', color: '#64748b' }}>No approved students available</span>}
              </div>
            </div>
          </div>
          
          <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button onClick={() => setShowCompanyAssignModal(false)} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleSaveCompanyAssignments} disabled={assigningCompany} style={{ padding: '10px 20px', backgroundColor: '#005F7A', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              {assigningCompany ? 'Saving...' : 'Save Assignments'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleVerifyStatus = (id, newStatus) => {
    setVerifications(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
    showToast(`Verification request updated to ${newStatus}`);
    
    // Add to activity
    const item = verifications.find(v => v.id === id);
    if (item) {
      setActivities(prev => [
        { text: `${item.type} profile verification updated to ${newStatus}: ${item.name}`, time: 'Just now', success: newStatus === 'Approved' },
        ...prev
      ]);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAssignTrainerToCompany = async () => {
    if (!selectedCompanyEmail || !selectedTrainerEmail) {
      showToast('Please select a company and a trainer.', 'error');
      return;
    }
    try {
      const companyUser = registeredUsers.find(u => u.email === selectedCompanyEmail);
      if (!companyUser) return showToast('Company not found.', 'error');
      
      const currentTrainers = companyUser.assignedTrainers || [];
      if (currentTrainers.includes(selectedTrainerEmail)) {
         showToast('Trainer is already assigned to this company.', 'error');
         return;
      }
      const newTrainers = [...currentTrainers, selectedTrainerEmail];
      
      const res = await fetch(`/api/admin/users/${selectedCompanyEmail}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainers: newTrainers })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Trainer assigned to company successfully!');
        setShowTrainerAssignModal(false);
        fetchUsers();
      } else {
        showToast(data.message || 'Failed to assign trainer.', 'error');
      }
    } catch (err) {
      showToast('Server error.', 'error');
    }
  };

  const handleRemoveActivity = async (logId) => {
    try {
      const res = await fetch(`/api/activities/${logId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setActivityLogs(prev => prev.filter(a => (a._id || a.id) !== logId));
        showToast('Activity log removed.');
      } else {
        showToast(data.message || 'Failed to remove activity.', 'error');
      }
    } catch (err) {
      showToast('Network error removing activity.', 'error');
    }
  };

  const handleRemoveRequest = async (reqId) => {
    try {
      const res = await fetch(`/api/requests/${reqId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSystemRequests(prev => prev.filter(r => (r._id || r.id) !== reqId));
        showToast('Request removed.');
      } else {
        showToast(data.message || 'Failed to remove request.', 'error');
      }
    } catch (err) {
      showToast('Network error removing request.', 'error');
    }
  };

  const renderActivityLogsTab = () => (
    <AdminPage>
      <AdminPageHeader 
        title="Activity Logs" 
        subtitle="Monitor actions performed by Companies and other users."
        emoji="📜"
      />
      <EnterpriseCard>
        <AdminTableContainer>
          <thead>
            <tr>
              <AdminTh>Timestamp</AdminTh>
              <AdminTh>Actor</AdminTh>
              <AdminTh>Action</AdminTh>
              <AdminTh>Details</AdminTh>
              <AdminTh>Remove</AdminTh>
            </tr>
          </thead>
          <tbody>
            {activityLogs.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>No activities logged yet.</td></tr>
            ) : (
              activityLogs.map((log) => (
                <tr key={log._id || log.id}>
                  <AdminTd style={{ color: '#64748b', fontSize: '13px' }}>{new Date(log.timestamp).toLocaleString()}</AdminTd>
                  <AdminTd style={{ fontWeight: 600 }}>{log.actor}</AdminTd>
                  <AdminTd><AdminBadge variant="success">{log.action}</AdminBadge></AdminTd>
                  <AdminTd style={{ color: '#475569', fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                    {log.details || '-'}
                    {log.action === 'Trainer Request' && (
                      <AdminButton 
                        variant="blue"
                        onClick={() => {
                           const comp = registeredUsers.find(u => (u.companyName === log.actor || u.fullName === log.actor || u.email === log.actor) && (u.role?.toLowerCase() === 'company'));
                           setSelectedCompanyEmail(comp ? comp.email : '');
                           setSelectedTrainerEmail('');
                           setShowTrainerAssignModal(true);
                        }}
                        style={{ marginLeft: 12 }}
                      >
                        Assign Trainer
                      </AdminButton>
                    )}
                  </AdminTd>
                  <AdminTd>
                    <AdminButton
                      variant="danger"
                      onClick={() => handleRemoveActivity(log._id || log.id)}
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      Remove
                    </AdminButton>
                  </AdminTd>
                </tr>
              ))
            )}
          </tbody>
        </AdminTableContainer>
      </EnterpriseCard>
    </AdminPage>
  );

  const renderRequestsTab = (tabName) => {
    const requestType = tabName === 'Trainer Requests' ? 'Trainer' : 'Student';
    const filteredRequests = systemRequests.filter(req => req.requestType === requestType);

    return (
      <AdminPage>
        <AdminPageHeader 
          title={tabName} 
          subtitle={`Manage ${requestType.toLowerCase()} requests from companies.`}
          emoji="📝"
        />
        <EnterpriseCard>
          <AdminTableContainer>
            <thead>
              <tr>
                <AdminTh>Date</AdminTh>
                <AdminTh>Company</AdminTh>
                <AdminTh>Details</AdminTh>
                <AdminTh>Action</AdminTh>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>No {requestType.toLowerCase()} requests found.</td></tr>
              ) : (
                filteredRequests.map((req, idx) => (
                  <tr key={req._id || req.id || idx}>
                    <AdminTd style={{ color: '#64748b', fontSize: '13px' }}>{new Date(req.createdAt).toLocaleDateString()}</AdminTd>
                    <AdminTd style={{ fontWeight: 600 }}>{req.requesterName}</AdminTd>
                    <AdminTd style={{ color: '#475569', fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                      {req.details ? (
                        <>
                          <div><strong>Course:</strong> {req.details.course}</div>
                          {requestType === 'Trainer' ? (
                            <div><strong>Reason:</strong> {req.details.reason}</div>
                          ) : (
                            <div><strong>Number of Students:</strong> {req.details.count}</div>
                          )}
                          <div><strong>Date:</strong> {req.details.date}</div>
                          <div><strong>Session/Duration:</strong> {req.details.duration}</div>
                        </>
                      ) : (
                         <span>Legacy Request (Check Activity Logs)</span>
                      )}
                    </AdminTd>
                    <AdminTd>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {requestType === 'Trainer' && (
                          <AdminButton 
                            variant="blue"
                            onClick={() => {
                               const comp = registeredUsers.find(u => (u.companyName === req.requesterName || u.fullName === req.requesterName || u.email === req.requesterEmail) && (u.role?.toLowerCase() === 'company'));
                               setSelectedCompanyEmail(comp ? comp.email : '');
                               setSelectedTrainerEmail('');
                               setShowTrainerAssignModal(true);
                            }}
                          >
                            Assign Trainer
                          </AdminButton>
                        )}
                        <AdminButton
                          variant="danger"
                          onClick={() => handleRemoveRequest(req._id || req.id)}
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Remove
                        </AdminButton>
                      </div>
                    </AdminTd>
                  </tr>
                ))
              )}
            </tbody>
          </AdminTableContainer>
        </EnterpriseCard>
      </AdminPage>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Company Courses':
        return <AdminCompanyCourses />;
      case 'Job Offers':
        return <AdminJobOffers adminUser={JSON.parse(localStorage.getItem('adminUser')) || {}} />;
      case 'Activity Logs':
        return renderActivityLogsTab();
      case 'Dashboard':
        return (() => {
          // ─── Derived Data ───
          const totalStudents = registeredUsers.filter(u => u.role === 'student').length;
          const totalTrainers = registeredUsers.filter(u => u.role === 'trainer').length;
          const totalCompanies = registeredUsers.filter(u => u.role === 'company').length;
          const pendingApprovals = registeredUsers.filter(u => u.status === 'Pending' || u.isApproved === false).length;
          const activeCourses = courses.length;
          const totalUsers = registeredUsers.length;
          const approvedUsers = registeredUsers.filter(u => u.isApproved).length;
          const verificationRate = totalUsers > 0 ? Math.round((approvedUsers / totalUsers) * 100) : 0;
          const courseCompletionRate = 78; // Placeholder

          // ─── Sparkline generator ───
          const generateSparkline = (seed, points = 8) => {
            const vals = [];
            let v = 30 + (seed * 17) % 20;
            for (let i = 0; i < points; i++) {
              v = Math.max(5, Math.min(45, v + ((seed * (i + 1) * 7) % 21) - 10));
              vals.push(v);
            }
            const step = 100 / (points - 1);
            const pathPoints = vals.map((val, i) => `${i * step},${50 - val}`);
            return `M${pathPoints.join(' L')}`;
          };

          // ─── Area chart data (registrations over time) ───
          const chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
          const chartData = [12, 19, 14, 25, 22, 31, totalStudents > 0 ? totalStudents : 28];
          const chartMax = Math.max(...chartData) + 5;
          const chartW = 500;
          const chartH = 180;
          const chartPadX = 40;
          const chartPadY = 20;
          const innerW = chartW - chartPadX * 2;
          const innerH = chartH - chartPadY * 2;
          const chartPoints = chartData.map((d, i) => ({
            x: chartPadX + (i / (chartData.length - 1)) * innerW,
            y: chartPadY + innerH - (d / chartMax) * innerH
          }));
          const linePath = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
          const areaPath = `${linePath} L${chartPoints[chartPoints.length - 1].x},${chartH - chartPadY} L${chartPoints[0].x},${chartH - chartPadY} Z`;

          // ─── Progress Ring Component ───
          const ProgressRing = ({ percent, color, size = 80, strokeWidth = 7, label }) => {
            const r = (size - strokeWidth) / 2;
            const circ = 2 * Math.PI * r;
            const offset = circ - (percent / 100) * circ;
            return (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <svg width={size} height={size} className="admin-progress-ring">
                  <circle className="admin-progress-ring-bg" cx={size / 2} cy={size / 2} r={r} />
                  <circle
                    className="admin-progress-ring-fill"
                    cx={size / 2} cy={size / 2} r={r}
                    stroke={color}
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                  />
                  <text
                    x="50%" y="50%" dominantBaseline="central" textAnchor="middle"
                    style={{ fontSize: '16px', fontWeight: 800, fill: '#0F172A', transform: 'rotate(90deg)', transformOrigin: 'center' }}
                  >
                    {percent}%
                  </text>
                </svg>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textAlign: 'center' }}>{label}</span>
              </div>
            );
          };

          // ─── KPI Card Config ───
          const kpiCards = [
            { label: 'Total Students', value: totalStudents, icon: '👨‍🎓', gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', glow: 'rgba(59,130,246,0.25)', trend: '+12%', trendUp: true, seed: 1 },
            { label: 'Total Trainers', value: totalTrainers, icon: '👨‍🏫', gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)', glow: 'rgba(6,182,212,0.25)', trend: '+8%', trendUp: true, seed: 2 },
            { label: 'Companies', value: totalCompanies, icon: '🏢', gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', glow: 'rgba(139,92,246,0.25)', trend: '+5%', trendUp: true, seed: 3 },
            { label: 'Pending Approvals', value: pendingApprovals, icon: '⏳', gradient: 'linear-gradient(135deg, #F97316, #EA580C)', glow: 'rgba(249,115,22,0.25)', trend: pendingApprovals > 0 ? `${pendingApprovals} new` : '0', trendUp: false, seed: 4 },
            { label: 'Active Courses', value: activeCourses, icon: '📚', gradient: 'linear-gradient(135deg, #10B981, #059669)', glow: 'rgba(16,185,129,0.25)', trend: '+3', trendUp: true, seed: 5 },
          ];

          // ─── Activity colors ───
          const getActivityStyle = (text) => {
            if (text.includes('student')) return { bg: '#EFF6FF', color: '#3B82F6', dot: '👨‍🎓' };
            if (text.includes('trainer')) return { bg: '#ECFEFF', color: '#06B6D4', dot: '👨‍🏫' };
            if (text.includes('company')) return { bg: '#F3E8FF', color: '#8B5CF6', dot: '🏢' };
            return { bg: '#F0FDF4', color: '#10B981', dot: '✓' };
          };

          return (
            <AdminPage>
              <AdminPageHeader
                title="Command Center"
                subtitle="Real-time overview of your platform's performance and activity."
                emoji="🚀"
              />

              {/* ═══════════ KPI CARDS GRID ═══════════ */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {kpiCards.map((card, i) => (
                  <div
                    key={i}
                    className={`admin-kpi-card admin-stagger-${i + 1}`}
                    style={{ '--kpi-gradient': card.gradient, '--kpi-glow': card.glow }}
                  >
                    {/* Top row: icon + trend */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div className="admin-kpi-icon">{card.icon}</div>
                      <span className={`admin-kpi-trend ${card.trendUp ? 'up' : 'down'}`}>
                        {card.trendUp ? '↑' : '●'} {card.trend}
                      </span>
                    </div>
                    {/* Value + Label */}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div className="admin-kpi-value">{card.value}</div>
                      <div className="admin-kpi-label">{card.label}</div>
                    </div>
                    {/* Sparkline */}
                    <svg className="admin-sparkline" viewBox="0 0 100 50" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id={`spark-${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={card.glow.replace('0.25', '0.4')} />
                          <stop offset="100%" stopColor={card.glow.replace('0.25', '0')} />
                        </linearGradient>
                      </defs>
                      <path d={`${generateSparkline(card.seed)} L100,50 L0,50 Z`} fill={`url(#spark-${i})`} />
                      <path d={generateSparkline(card.seed)} fill="none" stroke={card.glow.replace('0.25', '0.6')} strokeWidth="2" className="admin-chart-line" />
                    </svg>
                  </div>
                ))}
              </div>

              {/* ═══════════ MIDDLE ROW: Chart + Timeline ═══════════ */}
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px', marginBottom: '28px' }}>

                {/* ─── Registration Analytics Chart ─── */}
                <div className="admin-section-card">
                  <div className="admin-section-header">
                    <div className="admin-section-title">
                      <div className="admin-section-title-icon" style={{ background: '#EFF6FF', color: '#3B82F6' }}>📊</div>
                      Registration Analytics
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['7d', '30d', '90d'].map((range) => (
                        <button key={range} style={{
                          padding: '5px 14px', borderRadius: '8px', border: '1px solid #E2E8F0',
                          background: range === '30d' ? '#0F172A' : '#F8FAFC',
                          color: range === '30d' ? '#FFFFFF' : '#64748B',
                          fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}>{range}</button>
                      ))}
                    </div>
                  </div>

                  <div style={{ width: '100%', height: 240, marginTop: 16 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData.length > 0 ? analyticsData : chartData.map((v, i) => ({ name: chartLabels[i], revenue: v * 100, students: v }))}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 600 }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* ─── Premium Activity Timeline ─── */}
                <div className="admin-section-card">
                  <div className="admin-section-header">
                    <div className="admin-section-title">
                      <div className="admin-section-title-icon" style={{ background: '#F0FDF4', color: '#10B981' }}>⚡</div>
                      Recent Activity
                    </div>
                    <AdminButton variant="outline" onClick={() => setActiveTab('Activity Logs')} style={{ fontSize: '12px', padding: '6px 14px' }}>View All</AdminButton>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {activities && activities.length > 0 ? (
                      activities.slice(0, 5).map((act, i) => {
                        const style = getActivityStyle(act.text.toLowerCase());
                        return (
                          <div key={i} className="admin-timeline-item" style={{ animation: `admin-slideInLeft 0.4s ease-out ${i * 0.08}s both` }}>
                            <div className="admin-timeline-dot" style={{ background: style.bg, color: style.color, fontSize: '15px' }}>
                              {style.dot}
                            </div>
                            <div className="admin-timeline-content">
                              <p className="admin-timeline-text">{act.text}</p>
                              <p className="admin-timeline-time">{act.time}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p style={{ color: '#64748B', fontSize: '13px', textAlign: 'center', padding: '30px 0' }}>No recent activities found.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ═══════════ BOTTOM ROW: Status + Actions + Courses ═══════════ */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>

                {/* ─── Platform Status (Progress Rings) ─── */}
                <div className="admin-section-card">
                  <div className="admin-section-header">
                    <div className="admin-section-title">
                      <div className="admin-section-title-icon" style={{ background: '#FEF3C7', color: '#F59E0B' }}>📈</div>
                      Platform Status
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '8px 0 12px' }}>
                    <ProgressRing percent={verificationRate} color="#3B82F6" label="Verified Users" />
                    <ProgressRing percent={courseCompletionRate} color="#10B981" label="Course Progress" />
                    <ProgressRing percent={totalStudents > 0 ? Math.min(Math.round((totalStudents / (totalStudents + pendingApprovals || 1)) * 100), 100) : 0} color="#8B5CF6" label="Active Rate" />
                  </div>
                </div>

                {/* ─── Quick Actions Grid ─── */}
                <div className="admin-section-card">
                  <div className="admin-section-header">
                    <div className="admin-section-title">
                      <div className="admin-section-title-icon" style={{ background: '#EDE9FE', color: '#7C3AED' }}>⚡</div>
                      Quick Actions
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                      { label: 'Add Course', icon: '➕', bg: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', tab: 'Courses' },
                      { label: 'Students', icon: '👨‍🎓', bg: 'linear-gradient(135deg, #10B981, #059669)', tab: 'Students' },
                      { label: 'Reports', icon: '📊', bg: 'linear-gradient(135deg, #F59E0B, #D97706)', tab: 'Reports' },
                      { label: 'Trainers', icon: '👨‍🏫', bg: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', tab: 'Trainers' },
                    ].map((action, i) => (
                      <button
                        key={i}
                        className="admin-quick-action"
                        onClick={() => setActiveTab(action.tab)}
                      >
                        <div className="admin-quick-action-icon" style={{ background: action.bg }}>
                          {action.icon}
                        </div>
                        <span className="admin-quick-action-label">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ─── Top Courses Bar Chart ─── */}
                <div className="admin-section-card">
                  <div className="admin-section-header">
                    <div className="admin-section-title">
                      <div className="admin-section-title-icon" style={{ background: '#ECFDF5', color: '#10B981' }}>🏆</div>
                      Top Courses
                    </div>
                  </div>
                  <div>
                    {courses.length > 0 ? (
                      courses.slice(0, 5).map((course, i) => {
                        const barColors = [
                          'linear-gradient(90deg, #3B82F6, #60A5FA)',
                          'linear-gradient(90deg, #10B981, #34D399)',
                          'linear-gradient(90deg, #8B5CF6, #A78BFA)',
                          'linear-gradient(90deg, #F59E0B, #FBBF24)',
                          'linear-gradient(90deg, #06B6D4, #22D3EE)',
                        ];
                        const pct = Math.max(20, 100 - i * 18);
                        return (
                          <div key={i} className="admin-bar-chart-item">
                            <span className="admin-bar-chart-label" title={course.title}>{course.title}</span>
                            <div className="admin-bar-chart-track">
                              <div className="admin-bar-chart-fill" style={{ width: `${pct}%`, background: barColors[i % barColors.length] }} />
                            </div>
                            <span className="admin-bar-chart-value">{pct}%</span>
                          </div>
                        );
                      })
                    ) : (
                      <p style={{ color: '#64748B', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>No courses yet.</p>
                    )}
                  </div>
                </div>

              </div>
            </AdminPage>
          );
        })();
      case 'Contact Requests':
        return renderContactRequestsTab();
      case 'Courses':
        return renderCoursesTab();
      case 'Students':
        return renderUsersListTab('student');
      case 'Trainers':
        return renderUsersListTab('trainer');
      case 'Companies':
        return renderUsersListTab('company');
      case 'Reports':
        return renderReportsTab();
      case 'Settings':
        return renderSettingsTab();
      case 'Trainer Requests':
        return renderRequestsTab('Trainer Requests');
      case 'Student Requests':
        return renderRequestsTab('Student Requests');
      case 'Live Classes':
        return (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #cbd5e1', padding: '30px' }}>
            <AdminLiveClasses />
          </div>
        );
      default:
        return (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #cbd5e1', padding: '30px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#005F7A' }}>{activeTab} Management Panel</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Full list records control and CSV downloads are accessible via custom sub-tabs.</p>
            <button onClick={() => showToast('Full list database records loaded')} style={{
              padding: '10px 20px',
              backgroundColor: '#005F7A',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 700,
              marginTop: '15px'
            }}>Refresh Database List</button>
          </div>
        );
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropImage = async () => {
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setCourseForm(prev => ({ ...prev, image: croppedImage, imageFile: imageFileName }));
      setShowCropModal(false);
      setImageToCrop(null);
    } catch (e) {
      console.error(e);
      showToast('Failed to crop image', 'error');
    }
  };

  const cancelCrop = () => {
    setShowCropModal(false);
    setImageToCrop(null);
  };

  const handleSaveCourse = async () => {
    if (!courseForm.title.trim()) {
      showToast('Course Title is required.', 'error');
      return;
    }
    if (!courseForm.description.trim()) {
      showToast('Course Description/Content is required.', 'error');
      return;
    }

    try {
      const url = courseForm.id ? `/api/admin/courses/${courseForm.id}` : '/api/admin/courses';
      const method = courseForm.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: courseForm.title,
          name: courseForm.name,
          originalPrice: courseForm.originalPrice,
          price: courseForm.price,
          description: courseForm.description,
          content: courseForm.description, // compatibility
          image: courseForm.image,
          imageFile: courseForm.imageFile,
          pptFile: courseForm.pptFile,
          video: courseForm.video,
          videoFile: courseForm.videoFile,
          programType: courseForm.programType,
          totalDurationHours: courseForm.totalDurationHours,
          trainingDays: courseForm.trainingDays,
          startDate: courseForm.startDate,
          dailyStartTime: courseForm.dailyStartTime
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(courseForm.id ? 'Course updated successfully!' : 'Course created successfully!');
        setShowCourseModal(false);
        fetchCourses();
      } else {
        showToast(data.message || 'Failed to save course.', 'error');
      }
    } catch (err) {
      console.error('Error saving course:', err);
      showToast('Network error saving course.', 'error');
    }
  };

  const handleAssignCourse = async (e) => {
    e.preventDefault();
    if (!assigneeEmail || !courseToAssign) return;
    setAssigningCourse(true);
    try {
      const res = await fetch('/api/admin/assign-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: assigneeEmail, courseId: courseToAssign.title })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Course assigned successfully!');
        setShowCourseAssignModal(false);
        setAssigneeEmail('');
        fetchRegisteredUsers();
      } else {
        showToast(data.message || 'Failed to assign course.', true);
      }
    } catch (err) {
      console.error(err);
      showToast('Error assigning course.', true);
    } finally {
      setAssigningCourse(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showToast('Course deleted successfully!');
        fetchCourses();
      } else {
        showToast(data.message || 'Failed to delete course.', 'error');
      }
    } catch (err) {
      console.error('Error deleting course:', err);
      showToast('Network error deleting course.', 'error');
    }
  };

  const renderCourseContentDetailsPage = () => {
    const course = selectedCourseForContent;

    // Filter students by selected college & department
    const studentsList = registeredUsers.filter(u => 
      u.role === 'student' && 
      (assignCollege ? u.college === assignCollege : true) &&
      (assignDepartment ? u.department === assignDepartment : true)
    );

    // Mock students for demonstration if no database students are found
    const fallbackStudents = [
      { fullName: 'Arun Kumar', email: 'arun@gce.edu', college: 'Government College of Engineering', department: 'Computer Science', assignedCourses: [] },
      { fullName: 'Priya Dharshini', email: 'priya@sit.edu', college: 'Salem Institute of Technology', department: 'Information Technology', assignedCourses: [course.title] },
      { fullName: 'Vijay Sethupathi', email: 'vijay@lms.edu', college: 'LMS Engineering College', department: 'Computer Science', assignedCourses: [] },
      { fullName: 'Ananya Panday', email: 'ananya@psg.edu', college: 'PSG College of Technology', department: 'Electronics & Communication', assignedCourses: [] }
    ].filter(s => 
      (assignCollege ? s.college === assignCollege : true) &&
      (assignDepartment ? s.department === assignDepartment : true)
    );

    const displayStudents = studentsList.length > 0 ? studentsList : fallbackStudents;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', position: 'relative', minHeight: '85vh', paddingBottom: '80px' }}>
        {/* Header with back button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => {
              setSelectedCourseForContent(null);
              setShowAssignModal(false);
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              color: '#475569',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ← Back to Courses
          </button>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{course.title}</h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>Manage contents (PPT, Videos, Assignments, Certificates) and assign to students.</p>
          </div>
        </div>

        {/* Tab Navigation for Course Material */}
        <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', gap: '10px' }}>
          {['PPT', 'VIDEOS', 'ASSIGNMENT', 'CERTIFICATE'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveContentSection(tab)}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: 'none',
                fontSize: '14px',
                fontWeight: 700,
                color: activeContentSection === tab ? '#005F7A' : '#64748b',
                borderBottom: activeContentSection === tab ? '3px solid #005F7A' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
          {activeContentSection === 'PPT' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '15px' }}>PPT Presentations</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { name: 'Lecture Slides 1: Introduction & Environment Setup.pptx', size: '12.4 MB' },
                  { name: 'Lecture Slides 2: Core Architectures & Frameworks.pptx', size: '18.1 MB' },
                  { name: 'Lecture Slides 3: Advanced Concepts & Best Practices.pptx', size: '22.5 MB' },
                  { name: 'Lecture Slides 4: Capstone Project Preparation.pptx', size: '9.8 MB' }
                ].map((ppt, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '24px' }}>📊</span>
                      <div>
                        <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '14px' }}>{ppt.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Size: {ppt.size}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => showToast('PPT download started!')} style={{ padding: '8px 14px', backgroundColor: '#005F7A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Download</button>
                      <button onClick={() => showToast('Slides opened in fullscreen view')} style={{ padding: '8px 14px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>View Slides</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeContentSection === 'VIDEOS' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '15px' }}>Video Lectures</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div style={{ backgroundColor: '#0f172a', borderRadius: '16px', height: '360px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff', position: 'relative' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }} onClick={() => showToast('Playing lecture video...')}>
                    <span style={{ fontSize: '32px', marginLeft: '6px' }}>▶</span>
                  </div>
                  <div style={{ position: 'absolute', bottom: '20px', left: '20px', fontSize: '16px', fontWeight: 700 }}>
                    Lecture 1: Course Overview and Introduction
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#475569', fontWeight: 700 }}>Playlist</h4>
                  {[
                    { title: 'Video 1: Welcome & Setup', duration: '15:24' },
                    { title: 'Video 2: Core Mechanics', duration: '28:40' },
                    { title: 'Video 3: Technical Implementation', duration: '45:10' },
                    { title: 'Video 4: Deployment & QA', duration: '22:15' }
                  ].map((vid, idx) => (
                    <div key={idx} style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: idx === 0 ? '#f0fdf4' : '#ffffff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => showToast(`Loaded ${vid.title}`)}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{vid.title}</span>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>{vid.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeContentSection === 'ASSIGNMENT' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '15px' }}>Course Assignments</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { title: 'Assignment 1: Initialize Project Directory & Git Repository', due: 'End of Week 1' },
                  { title: 'Assignment 2: Schema Design & Data Modeling', due: 'End of Week 2' },
                  { title: 'Assignment 3: Backend API Endpoints Implementation', due: 'End of Week 3' },
                  { title: 'Assignment 4: Final Capstone Deployment & Live Demo', due: 'End of Course' }
                ].map((ass, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '14px' }}>{ass.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Due Date: <strong>{ass.due}</strong></div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => showToast('Editing assignment details...')} style={{ padding: '8px 14px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Edit</button>
                      <button onClick={() => showToast('Loading submissions report...')} style={{ padding: '8px 14px', backgroundColor: '#005F7A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Review Submissions</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeContentSection === 'CERTIFICATE' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0, width: '100%', textAlign: 'left' }}>Certificate Template Preview</h3>
              
              {/* Outer Certificate Box */}
              <div style={{
                width: '100%',
                maxWidth: '850px',
                backgroundColor: '#ffffff',
                backgroundImage: 'radial-gradient(circle, #ffffff 60%, #fffbf2 100%)',
                padding: '40px 50px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                color: '#0f172a',
                fontFamily: "'Inter', 'Outfit', sans-serif",
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Top Corner Golden Background Shapes */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '12px',
                  background: 'linear-gradient(90deg, #F59E0B 0%, #D97706 50%, #F59E0B 100%)'
                }} />

                {/* Top Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  {/* Left Logo (MBK Tech) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '220px', textAlign: 'left' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>M</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '14px', color: '#1e293b', lineHeight: 1.1 }}>MBK</div>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px' }}>TECHNOLOGY</div>
                      <div style={{ fontSize: '7px', color: '#94a3b8', fontWeight: 600 }}>Skills to Success</div>
                    </div>
                  </div>

                  {/* Golden Center Medal with ribbons */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', height: '60px', width: '60px' }}>
                    {/* Ribbons */}
                    <div style={{ position: 'absolute', top: '25px', left: '16px', width: '10px', height: '35px', backgroundColor: '#dc2626', transform: 'rotate(-10deg)', zIndex: 1 }} />
                    <div style={{ position: 'absolute', top: '25px', right: '16px', width: '10px', height: '35px', backgroundColor: '#dc2626', transform: 'rotate(10deg)', zIndex: 1 }} />
                    {/* Golden Circle Medal */}
                    <div style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      backgroundColor: '#fbbf24',
                      backgroundImage: 'radial-gradient(circle, #fde047 30%, #d97706 100%)',
                      border: '3px solid #fbbf24',
                      boxShadow: '0 4px 10px rgba(217, 119, 6, 0.3)',
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{ width: '31px', height: '31px', borderRadius: '50%', border: '1px dashed #ffffff' }} />
                    </div>
                  </div>

                  {/* Right Logo (CarrierZ) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end', width: '220px', textAlign: 'right' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '14px', color: '#ec4899', lineHeight: 1.1 }}>CarrierZ</div>
                      <div style={{ fontSize: '8px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px' }}>Skills to Success</div>
                    </div>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>C</div>
                  </div>
                </div>

                {/* Certificate Core Text */}
                <h1 style={{
                  fontSize: '26px',
                  fontWeight: 800,
                  color: '#d97706',
                  letterSpacing: '3px',
                  margin: '0 0 4px 0',
                  textTransform: 'uppercase'
                }}>
                  Certificate of Completion
                </h1>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#475569',
                  letterSpacing: '4px',
                  margin: '0 0 20px 0',
                  textTransform: 'uppercase'
                }}>
                  Congratulations
                </div>

                <div style={{
                  fontSize: '24px',
                  fontWeight: 900,
                  color: '#0f172a',
                  margin: '10px 0',
                  fontFamily: "'Outfit', sans-serif"
                }}>
                  Mathivanan R
                </div>

                <div style={{ fontSize: '13px', fontStyle: 'italic', color: '#64748b', margin: '8px 0' }}>
                  has successfully completed the
                </div>

                <div style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#dc2626',
                  margin: '6px 0',
                  textTransform: 'uppercase'
                }}>
                  "Internship Completion Certificate"
                </div>

                <div style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#1e293b',
                  margin: '0 0 16px 0'
                }}>
                  Conducted by MBK Technology, (an initiative under The SM Groups).
                </div>

                <p style={{
                  fontSize: '11px',
                  lineHeight: '1.7',
                  color: '#475569',
                  maxWidth: '720px',
                  margin: '0 auto 24px auto',
                  textAlign: 'justify'
                }}>
                  This is to certify that the candidate has successfully completed the Two-Week Internship Program
                  in <strong>{course.title || 'Digital Marketing'}</strong>, fulfilling all the academic and practical requirements of the program. We
                  appreciate the candidate's dedication, commitment, and sincere efforts throughout the internship,
                  and wish them continued success in their academic and professional journey in the field of {course.title || 'Digital Marketing'}.
                </p>

                {/* Date Issued */}
                <div style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#475569',
                  textTransform: 'uppercase',
                  marginBottom: '30px'
                }}>
                  Issued On: {new Date().toLocaleDateString('en-GB')}
                </div>

                {/* Footer Badges & Signature */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  padding: '0 10px',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '20px'
                }}>
                  {/* SM Groups */}
                  <div style={{ textAlign: 'left', width: '150px' }}>
                    <div style={{ fontWeight: 800, color: '#dc2626', fontSize: '11px', lineHeight: 1.1 }}>SM GROUPS</div>
                    <div style={{ fontSize: '8px', color: '#94a3b8', fontWeight: 600 }}>TSMG SERVICES PVT. LTD</div>
                  </div>

                  {/* Cisco */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', height: '10px', marginBottom: '2px' }}>
                      <div style={{ width: '2px', height: '6px', backgroundColor: '#0284c7' }} />
                      <div style={{ width: '2px', height: '10px', backgroundColor: '#0284c7' }} />
                      <div style={{ width: '2px', height: '8px', backgroundColor: '#0284c7' }} />
                      <div style={{ width: '2px', height: '10px', backgroundColor: '#0284c7' }} />
                      <div style={{ width: '2px', height: '6px', backgroundColor: '#0284c7' }} />
                    </div>
                    <div style={{ fontWeight: 800, color: '#0284c7', fontSize: '11px', letterSpacing: '1px' }}>CISCO</div>
                  </div>

                  {/* Sri Tech */}
                  <div style={{ textAlign: 'center', width: '120px' }}>
                    <span style={{ fontWeight: 700, color: '#16a34a', fontSize: '11px' }}>SRI TECH</span>
                  </div>

                  {/* Authorized Signatory */}
                  <div style={{ textAlign: 'right', width: '180px' }}>
                    <div style={{
                      fontFamily: "'Caveat', 'Great Vibes', cursive",
                      fontSize: '18px',
                      color: '#1e3a8a',
                      marginBottom: '4px',
                      fontStyle: 'italic',
                      fontWeight: 'bold'
                    }}>
                      P. Gnanf
                    </div>
                    <div style={{ borderBottom: '1px solid #cbd5e1', marginBottom: '4px' }} />
                    <div style={{ fontSize: '9px', fontWeight: 700, color: '#1e293b' }}>Authorized Signatory</div>
                    <div style={{ fontSize: '8px', color: '#64748b' }}>MBK Technology</div>
                  </div>
                </div>
              </div>

              <button onClick={() => showToast('Certificate template saved!')} style={{ padding: '10px 24px', backgroundColor: '#005F7A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}>
                Save Template Settings
              </button>
            </div>
          )}
        </div>

        {/* BOTTOM RIGHT ASSIGN BOX BUTTON */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          zIndex: 999
        }}>
          {!showAssignModal ? (
            <button
              onClick={() => {
                setShowAssignModal(true);
                fetchRegisteredUsers();
              }}
              style={{
                padding: '16px 28px',
                backgroundColor: '#16a34a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50px',
                boxShadow: '0 10px 25px rgba(22, 163, 74, 0.4)',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'transform 0.2s'
              }}
            >
              <span>🤝</span> Assign This Course
            </button>
          ) : (
            <div style={{
              width: '380px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 15px 50px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>Assign Course</h4>
                <button onClick={() => setShowAssignModal(false)} style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}>×</button>
              </div>

              {/* College Dropdown */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Select College</label>
                <select
                  value={assignCollege}
                  onChange={(e) => {
                    setAssignCollege(e.target.value);
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                >
                  <option value="">-- All Colleges --</option>
                  <option value="Government College of Engineering">Government College of Engineering</option>
                  <option value="Salem Institute of Technology">Salem Institute of Technology</option>
                  <option value="LMS Engineering College">LMS Engineering College</option>
                  <option value="PSG College of Technology">PSG College of Technology</option>
                </select>
              </div>

              {/* Department Dropdown */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Select Department</label>
                <select
                  value={assignDepartment}
                  onChange={(e) => {
                    setAssignDepartment(e.target.value);
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                >
                  <option value="">-- All Departments --</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Electrical & Electronics">Electrical & Electronics</option>
                </select>
              </div>

              {/* Students List */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Registered Students ({displayStudents.length})</label>
                <div style={{ maxHeight: '160px', overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {displayStudents.length === 0 ? (
                    <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', padding: '10px' }}>No students found for this department.</div>
                  ) : (
                    displayStudents.map((student, idx) => {
                      const isAssigned = (student.assignedCourses || []).includes(course.title);
                      return (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderBottom: '1px solid #f1f5f9', fontSize: '12.5px' }}>
                          <div>
                            <div style={{ fontWeight: 700, color: '#1e293b' }}>{student.fullName}</div>
                            <div style={{ fontSize: '10.5px', color: '#64748b' }}>{student.email}</div>
                          </div>
                          <button
                            onClick={() => {
                              if (!student._id && !student.id) {
                                if (isAssigned) {
                                  student.assignedCourses = student.assignedCourses.filter(c => c !== course.title);
                                  showToast('Course unassigned (mock)!');
                                } else {
                                  student.assignedCourses.push(course.title);
                                  showToast('Course assigned (mock)!');
                                }
                                fetchRegisteredUsers();
                              } else {
                                handleAssignCourseToStudent(student.email);
                              }
                            }}
                            style={{
                              padding: '5px 10px',
                              backgroundColor: isAssigned ? '#fee2e2' : '#d1fae5',
                              color: isAssigned ? '#b91c1c' : '#065f46',
                              border: 'none',
                              borderRadius: '6px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              fontSize: '11px'
                            }}
                          >
                            {isAssigned ? 'Unassign' : 'Assign Free'}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEnrolledUsersModal = () => {
    // Filter users based on role and ensure they have at least one enrolled course
    const enrolledUsers = registeredUsers.filter(u => {
      const roleMatches = (u.role || 'student').toLowerCase() === enrolledActiveTab;
      const hasCourses = u.purchasedCourses && u.purchasedCourses.length > 0;
      return roleMatches && hasCourses;
    });

    const displayedUsers = enrolledUsers.filter(u => 
      (u.fullName || u.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getCourseTitle = (id) => {
      const c = courses.find(course => course._id === id || course.id === id || course.title === id);
      return c ? c.title : id;
    };

    return (
      <div className="modal-overlay" style={{ 
        zIndex: 9999, 
        backgroundColor: 'rgba(15, 23, 42, 0.4)', 
        backdropFilter: 'blur(8px)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div className="modal-content" style={{ 
          maxWidth: '850px', 
          width: '100%', 
          maxHeight: '85vh', 
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.5)',
          padding: '32px',
          position: 'relative'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h3 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '28px', 
                fontWeight: 800, 
                background: 'linear-gradient(135deg, #005F7A 0%, #0284c7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Enrolled {enrolledActiveTab === 'student' ? 'Students' : 'Trainers'}
              </h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '15px' }}>Manage and view course enrollments in real-time</p>
            </div>
            <button 
              onClick={() => setShowEnrolledModal(false)} 
              style={{ 
                border: 'none', 
                background: '#f1f5f9', 
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px', 
                cursor: 'pointer', 
                color: '#64748b',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
            >
              &times;
            </button>
          </div>

          {/* Controls: Tabs & Search */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <div style={{ 
              display: 'flex', 
              background: '#f8fafc', 
              padding: '6px', 
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <button
                onClick={() => setEnrolledActiveTab('student')}
                style={{
                  padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                  background: enrolledActiveTab === 'student' ? '#ffffff' : 'transparent',
                  color: enrolledActiveTab === 'student' ? '#0f172a' : '#64748b',
                  boxShadow: enrolledActiveTab === 'student' ? '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                🎓 Students
              </button>
              <button
                onClick={() => setEnrolledActiveTab('trainer')}
                style={{
                  padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                  background: enrolledActiveTab === 'trainer' ? '#ffffff' : 'transparent',
                  color: enrolledActiveTab === 'trainer' ? '#0f172a' : '#64748b',
                  boxShadow: enrolledActiveTab === 'trainer' ? '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                👨‍🏫 Trainers
              </button>
            </div>

            <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px 12px 44px', borderRadius: '12px', border: '1px solid #cbd5e1',
                  fontSize: '15px', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s',
                  backgroundColor: '#f8fafc'
                }}
                onFocus={(e) => e.target.style.borderColor = '#005F7A'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>
          </div>

          {/* User List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {displayedUsers.length > 0 ? (
              displayedUsers.map((u, idx) => {
                const name = u.fullName || u.companyName || 'Unknown';
                const initial = name.charAt(0).toUpperCase();
                return (
                  <div key={idx} style={{ 
                    padding: '24px', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '16px', 
                    background: 'linear-gradient(to right, #ffffff, #f8fafc)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.02)'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                      
                      {/* Avatar & Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ 
                          width: '56px', height: '56px', borderRadius: '50%', 
                          background: 'linear-gradient(135deg, #0284c7 0%, #005F7A 100%)',
                          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '24px', fontWeight: 800, boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)'
                        }}>
                          {initial}
                        </div>
                        <div>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{name}</h4>
                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '13px', color: '#64748b' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              ✉️ {u.email}
                            </span>
                            { (u.phone || u.hrPhone) && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                📱 {u.phone || u.hrPhone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Course Count Badge */}
                      <div style={{ 
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                        color: '#ffffff', padding: '6px 14px', borderRadius: '30px', 
                        fontSize: '13px', fontWeight: 700, boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)',
                        display: 'flex', alignItems: 'center', gap: '6px'
                      }}>
                        🎯 {u.purchasedCourses.length} Enrolled
                      </div>
                    </div>
                    
                    {/* Course Tags */}
                    <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed #cbd5e1' }}>
                      <h5 style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Active Programs
                      </h5>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {u.purchasedCourses.map((courseId, cIdx) => (
                          <div key={cIdx} style={{ 
                            background: '#ffffff', 
                            padding: '8px 16px', 
                            borderRadius: '10px', 
                            fontSize: '13px', 
                            fontWeight: 600, 
                            color: '#005F7A', 
                            border: '1px solid #e0f2fe',
                            boxShadow: '0 2px 4px rgba(0, 95, 122, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <span style={{ color: '#0ea5e9' }}>❖</span> {getCourseTitle(courseId)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ 
                textAlign: 'center', padding: '60px 20px', color: '#64748b', 
                background: '#f8fafc', borderRadius: '16px', border: '2px dashed #cbd5e1' 
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '18px' }}>No Enrollments Found</h4>
                <p style={{ margin: 0, fontSize: '14px' }}>There are no {enrolledActiveTab}s matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCoursesTab = () => {
    if (selectedCourseForContent) {
      return renderCourseContentDetailsPage();
    }

    const filteredCourses = courses.filter(c => 
      (c.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description || c.content || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <AdminPage>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <AdminPageHeader 
            title="Courses Management" 
            subtitle="Create, edit, view and manage all academic training programs."
            emoji="📚"
          />
          <div style={{ display: 'flex', gap: '12px' }}>
            <AdminButton 
              variant="outline"
              onClick={() => {
                fetchRegisteredUsers();
                setShowEnrolledModal(true);
              }}
            >
              View Enrolled Users
            </AdminButton>
            <AdminButton 
              variant="blue"
              onClick={() => {
                setCourseForm({ 
                  id: null, title: '', name: '', originalPrice: '', price: '', description: '', image: '', imageFile: '', ppt: '', pptFile: '', video: '', videoFile: '', programType: 'Student Development Program',
                  totalDurationHours: '', trainingDays: '', startDate: '', dailyStartTime: ''
                });
                setShowCourseModal(true);
              }}
            >
              + Add New Course
            </AdminButton>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {filteredCourses.length === 0 ? (
            <EnterpriseCard style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#64748b' }}>
              No courses found. Add a course to get started!
            </EnterpriseCard>
          ) : (
            filteredCourses.map((c) => (
              <EnterpriseCard key={c._id || c.id} style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ height: '180px', backgroundColor: c.image ? '#ffffff' : '#e2e8f0', position: 'relative', overflow: 'hidden' }}>
                    {c.image ? (
                      <img 
                        src={c.image} 
                        alt={c.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                        onError={(e) => {
                          const fallback = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
                          if (e.target.src !== fallback) {
                            e.target.src = fallback;
                          }
                        }}
                      />
                    ) : (
                      <img 
                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80" 
                        alt="Course Placeholder" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    )}
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffffff',
                      padding: '4px 10px',
                      borderRadius: '30px',
                      fontSize: '12px',
                      fontWeight: 700
                    }}>
                      ₹{c.price || 'Free'}
                    </span>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#005F7A', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      {c.name || 'Core Program'}
                    </span>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>{c.title}</h4>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {c.description || c.content}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', width: '100%', marginBottom: '8px' }}>
                    <AdminButton 
                      variant="blue"
                      style={{ flex: 1 }}
                      onClick={() => {
                        setSelectedCourseForContent(c);
                        setActiveContentSection('PPT');
                        fetchRegisteredUsers();
                      }}
                    >
                      📚 Manage Course Content
                    </AdminButton>
                    {c.schedule && c.schedule.length > 0 && (
                      <AdminButton 
                        variant="outline"
                        style={{ flex: 1, borderColor: '#005F7A', color: '#005F7A' }}
                        onClick={() => {
                          setSelectedScheduleCourse(c);
                          setShowScheduleModal(true);
                        }}
                      >
                        📅 View Schedule
                      </AdminButton>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                    <AdminButton 
                      variant="outline"
                      style={{ flex: 1, borderColor: '#3b82f6', color: '#3b82f6' }}
                      onClick={() => {
                        setCourseToAssign(c);
                        setShowCourseAssignModal(true);
                      }}
                    >
                      Assign
                    </AdminButton>
                    <AdminButton 
                      variant="outline"
                      style={{ flex: 1 }}
                      onClick={() => {
                        setCourseForm({
                          id: c._id || c.id,
                          title: c.title || '',
                          name: c.name || '',
                          originalPrice: c.originalPrice || '',
                          price: c.price || '',
                          description: c.description || c.content || '',
                          image: c.image || '',
                          imageFile: '',
                          ppt: c.ppt || '',
                          pptFile: c.pptName || '',
                          video: c.video || '',
                          videoFile: c.videoName || '',
                          programType: c.programType || 'Student Development Program',
                          totalDurationHours: c.totalDurationHours || '',
                          trainingDays: c.trainingDays || '',
                          startDate: c.startDate ? new Date(c.startDate).toISOString() : '',
                          dailyStartTime: c.dailyStartTime || ''
                        });
                        setShowCourseModal(true);
                      }}
                    >
                      Edit
                    </AdminButton>
                    <AdminButton 
                      variant="outline"
                      style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444' }}
                      onClick={() => handleDeleteCourse(c._id || c.id)}
                    >
                      Delete
                    </AdminButton>
                  </div>
                </div>
              </EnterpriseCard>
            ))
          )}
        </div>
      </AdminPage>
    );
  };

  const renderReportsTab = () => {
    return (
      <AdminPage>
        <AdminPageHeader 
          title="Reports & Feedback Center" 
          subtitle="Review issues, feedback, and reports submitted by students, trainers, or companies for assigned work."
          emoji="📊"
        />

        <EnterpriseCard style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
          No reports or feedback submissions found.
        </EnterpriseCard>
      </AdminPage>
    );
  };

  const renderSettingsTab = () => {
    return (
      <AdminPage>
        <AdminPageHeader 
          title="System Settings Configuration" 
          subtitle="Configure platform general preferences, SMTP email servers, security modes, and view access audit logs."
          emoji="⚙️"
        />

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }} className="responsive-row">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* General Preferences */}
            <EnterpriseCard style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>LMS Platform Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Site Brand Name</label>
                  <input type="text" defaultValue="MBK Technology LMS & Placement" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Student Directory View Mode</label>
                  <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}>
                    <option value="masked">Masked Contact Info (Approved Only)</option>
                    <option value="public">Fully Public Directory</option>
                    <option value="private">Private (Admin View Only)</option>
                  </select>
                </div>
              </div>
            </EnterpriseCard>

            {/* Email SMTP Configuration */}
            <EnterpriseCard style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>Email Notification Server (SMTP)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>SMTP Host</label>
                    <input type="text" defaultValue="smtp.gmail.com" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>SMTP Port</label>
                    <input type="text" defaultValue="587" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>System Mail Sender Address</label>
                  <input type="text" defaultValue="notifications@mbklms.com" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }} />
                </div>
              </div>
            </EnterpriseCard>
          </div>

          {/* Side panel: Info Audit Logs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <EnterpriseCard style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>Security Audit Logs</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { text: 'SMTP Test connection success', time: '10 mins ago' },
                  { text: 'Backup users.json to local cloud storage', time: '1 hr ago' },
                  { text: 'Admin profile login from IP 192.168.1.5', time: '3 hrs ago' },
                  { text: 'SMTP password changed by admin', time: '1 day ago' }
                ].map((log, idx) => (
                  <div key={idx} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <div style={{ fontSize: '12.5px', color: '#1e293b', fontWeight: 600 }}>{log.text}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{log.time}</div>
                  </div>
                ))}
              </div>
            </EnterpriseCard>
            
            <AdminButton 
              variant="blue"
              onClick={() => showToast('Settings successfully updated!')}
              style={{ width: '100%' }}
            >
              Save Configuration
            </AdminButton>
          </div>
        </div>
      </AdminPage>
    );
  };

  const handleRemoveContactRequest = async (reqId) => {
    try {
      const res = await fetch(`/api/admin/access-requests/${reqId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setContactRequests(prev => prev.filter(r => (r._id || r.id) !== reqId));
        showToast('Contact request removed.');
      } else {
        showToast(data.message || 'Failed to remove request.', 'error');
      }
    } catch (err) {
      showToast('Network error removing request.', 'error');
    }
  };

  const renderContactRequestsTab = () => {
    return (
      <AdminPage>
        <AdminPageHeader 
          title="Contact & Resume Access Requests" 
          subtitle="Approve or reject requests from users to see private profile details (contact numbers, emails, and resume links)."
          emoji="📨"
        />

        <EnterpriseCard>
          {contactRequests.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              No access requests found.
            </div>
          ) : (
            <AdminTableContainer>
              <thead>
                <tr>
                  <AdminTh>Requester User</AdminTh>
                  <AdminTh>Target Profile</AdminTh>
                  <AdminTh>Status</AdminTh>
                  <AdminTh>Date Submitted</AdminTh>
                  <AdminTh>Action</AdminTh>
                </tr>
              </thead>
              <tbody>
                {contactRequests.map((row) => {
                  const rowId = row._id || row.id;
                  return (
                    <tr key={rowId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <AdminTd>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{row.requesterName}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{row.requesterEmail} ({row.requesterRole})</div>
                      </AdminTd>
                      <AdminTd>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{row.targetName}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{row.targetEmail} ({row.targetRole})</div>
                      </AdminTd>
                      <AdminTd>
                        <AdminBadge variant={row.status === 'Pending' ? 'warning' : row.status === 'Approved' ? 'success' : 'danger'}>
                          {row.status}
                        </AdminBadge>
                      </AdminTd>
                      <AdminTd>
                        {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}
                      </AdminTd>
                      <AdminTd>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {row.status === 'Pending' ? (
                            <>
                              <AdminButton onClick={() => {
                                handleUpdateAccessRequest(rowId, 'Approved');
                              }} variant="blue">Approve</AdminButton>
                              
                              <AdminButton onClick={() => {
                                handleUpdateAccessRequest(rowId, 'Rejected');
                              }} variant="outline">Reject</AdminButton>
                            </>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>Processed</span>
                          )}
                          <AdminButton
                            variant="danger"
                            onClick={() => handleRemoveContactRequest(rowId)}
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            Remove
                          </AdminButton>
                        </div>
                      </AdminTd>
                    </tr>
                  );
                })}
              </tbody>
            </AdminTableContainer>
          )}
        </EnterpriseCard>
      </AdminPage>
    );
  };

  return (
    <div className="admin-layout-wrapper">
      {/* Mobile Drawer Overlay */}
      {mobileSidebar && (
        <div 
          className="admin-mobile-overlay"
          onClick={() => setMobileSidebar(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${mobileSidebar ? 'open' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          {/* Logo brand area */}
          <div className="admin-logo-area">
            <img 
              src="/logo.png" 
              alt="MBK Technology" 
              className="w-10 h-10 object-contain rounded-lg bg-white p-0.5"
            />
            <div>
              <h2>MBK Tech</h2>
              <span>Super Admin System</span>
            </div>
          </div>

          {/* Menus */}
          <div className="admin-menu-list">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setMobileSidebar(false);
                }}
                className={`admin-menu-item ${activeTab === item.name ? 'active' : ''}`}
              >
                <span className="menu-icon">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer logout button */}
        <div className="admin-sidebar-footer">
          <button
            onClick={handleSignOut}
            className="admin-signout-btn"
          >
            <span className="menu-icon">{Icons.Logout}</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main panel container */}
      <div className="admin-main-content">
        {/* Top Header */}
        <header className="admin-top-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileSidebar(!mobileSidebar)}
            >
              ☰
            </button>
            {/* Search bar */}
            <div className="admin-search-wrapper">
              <span className="search-icon">{Icons.Search}</span>
              <input
                type="text"
                placeholder="Search user profile, verification files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-search-input"
              />
            </div>
          </div>

          {/* User profile avatar info */}
          <div className="admin-nav-actions">
            <button className="nav-action-btn relative">
              {Icons.Notification}
              <span className="notification-dot" />
            </button>
            
            <div className="admin-user-profile">
              <div className="admin-user-info hidden sm:block">
                <h4>Super Admin</h4>
                <span>Super Admin System</span>
              </div>
              <div className="admin-avatar-circle">
                SA
              </div>
            </div>
          </div>
        </header>

        {/* Content panel */}
        <main className="admin-content-area">
          {renderContent()}
        </main>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontSize: '13px',
          fontWeight: 600,
          zIndex: 9999
        }}>
          {toast.msg}
        </div>
      )}

      {/* Admin Student Resume Viewer Modal */}
      {viewingResume && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            border: '1px solid #E2E8F0',
            color: '#0F172A',
            position: 'relative'
          }}>
            <button
              onClick={() => setViewingResume(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                border: 'none',
                background: 'transparent',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#64748B'
              }}
            >
              ×
            </button>

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#005F7A', marginBottom: '20px' }}>
              User Profile Details
            </h3>

            {/* Resume Container */}
            <div style={{
              border: '1px solid #CBD5E1',
              borderRadius: '12px',
              padding: '20px',
              backgroundColor: '#F8FAFC',
              maxHeight: '380px',
              overflowY: 'auto',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #005F7A', paddingBottom: '10px', marginBottom: '14px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>
                    {viewingResume.fullName || viewingResume.companyName || viewingResume.name || 'N/A'}
                  </h4>
                  <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'capitalize' }}>
                    Role: {viewingResume.role || viewingResume.type || 'User'}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#00B4D8', textTransform: 'capitalize' }}>
                    Status: {viewingResume.status || (viewingResume.isApproved ? 'Approved' : 'Pending')}
                  </span>
                </div>
              </div>

              {/* General Contact Info */}
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#005F7A', display: 'block', marginBottom: '4px' }}>Contact Information</span>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#475569' }}>📧 Email: {viewingResume.email || 'N/A'}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#475569' }}>📞 Phone: {viewingResume.phone || viewingResume.hrPhone || 'N/A'}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#475569' }}>📍 Location: {viewingResume.location || viewingResume.district || 'N/A'}</p>
                {viewingResume.address && (
                  <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#475569' }}>🏠 Address: {viewingResume.address}</p>
                )}
              </div>

              {/* Student Details */}
              {(viewingResume.role === 'student' || viewingResume.type === 'Student') && (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#005F7A', display: 'block', marginBottom: '4px' }}>Education</span>
                    <p style={{ margin: 0, fontSize: '12.5px', fontWeight: 700 }}>{viewingResume.college || 'N/A'}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#475569' }}>
                      Degree: {viewingResume.degree || 'N/A'} • Dept: {viewingResume.department || 'N/A'}
                    </p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#475569' }}>
                      Graduation Year: {viewingResume.gradYear || 'N/A'} • CGPA: {viewingResume.cgpa || 'N/A'}
                    </p>
                    {viewingResume.dob && (
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#475569' }}>DOB: {viewingResume.dob}</p>
                    )}
                    {viewingResume.gender && (
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#475569' }}>Gender: {viewingResume.gender}</p>
                    )}
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#005F7A', display: 'block', marginBottom: '4px' }}>Skills</span>
                    <p style={{ margin: 0, fontSize: '12.5px', color: '#475569' }}>
                      {Array.isArray(viewingResume.skills) ? viewingResume.skills.join(', ') : viewingResume.skills || 'N/A'}
                    </p>
                  </div>

                  {(viewingResume.projectTitle || viewingResume.projectDesc) && (
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#005F7A', display: 'block', marginBottom: '4px' }}>Academic Project</span>
                      <p style={{ margin: 0, fontSize: '12.5px', fontWeight: 700 }}>{viewingResume.projectTitle || 'Untitled Project'}</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: '#475569' }}>{viewingResume.projectDesc || 'No description provided.'}</p>
                    </div>
                  )}
                </>
              )}

              {/* Trainer Details */}
              {(viewingResume.role === 'trainer' || viewingResume.type === 'Trainer') && (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#005F7A', display: 'block', marginBottom: '4px' }}>Professional Details</span>
                    <p style={{ margin: 0, fontSize: '12.5px', fontWeight: 700 }}>Expertise: {viewingResume.expertise || 'N/A'}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#475569' }}>
                      Experience: {viewingResume.experienceYears ? `${viewingResume.experienceYears} Years` : 'N/A'}
                    </p>
                    {viewingResume.gender && (
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#475569' }}>Gender: {viewingResume.gender}</p>
                    )}
                  </div>

                  {viewingResume.summary && (
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#005F7A', display: 'block', marginBottom: '4px' }}>Professional Summary</span>
                      <p style={{ margin: 0, fontSize: '12.5px', color: '#475569', lineHeight: '1.4' }}>{viewingResume.summary}</p>
                    </div>
                  )}

                  {(viewingResume.courseName || viewingResume.category) && (
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#005F7A', display: 'block', marginBottom: '4px' }}>Proposed Course</span>
                      <p style={{ margin: 0, fontSize: '12.5px', fontWeight: 700 }}>{viewingResume.courseName || 'Untitled Course'}</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#475569' }}>
                        Category: {viewingResume.category || 'N/A'} • Duration: {viewingResume.duration || 'N/A'}
                      </p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#475569' }}>
                        Level: {viewingResume.level || 'N/A'} • Mode: {viewingResume.teachingMode || 'N/A'}
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Company Details */}
              {(viewingResume.role === 'company' || viewingResume.type === 'Company') && (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#005F7A', display: 'block', marginBottom: '4px' }}>Corporate Profile</span>
                    <p style={{ margin: 0, fontSize: '12.5px', fontWeight: 700 }}>Industry: {viewingResume.industry || 'N/A'}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#475569' }}>
                      Website: <a href={viewingResume.website} target="_blank" rel="noreferrer" style={{ color: '#005F7A', textDecoration: 'underline' }}>{viewingResume.website || 'N/A'}</a>
                    </p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#475569' }}>
                      Company Size: {viewingResume.companySize || 'N/A'}
                    </p>
                  </div>

                  {viewingResume.companyDesc && (
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#005F7A', display: 'block', marginBottom: '4px' }}>About Company</span>
                      <p style={{ margin: 0, fontSize: '12.5px', color: '#475569', lineHeight: '1.4' }}>{viewingResume.companyDesc}</p>
                    </div>
                  )}

                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#005F7A', display: 'block', marginBottom: '4px' }}>Recruitment Details</span>
                    <p style={{ margin: 0, fontSize: '12.5px', color: '#475569' }}><strong>Job Roles:</strong> {viewingResume.jobRoles || 'N/A'}</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#475569' }}><strong>Required Skills:</strong> {viewingResume.requiredSkills || 'N/A'}</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#475569' }}><strong>Experience Required:</strong> {viewingResume.expRequired || 'N/A'}</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#475569' }}><strong>Work Mode:</strong> {viewingResume.workMode || 'N/A'}</p>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#005F7A', display: 'block', marginBottom: '4px' }}>HR Contact</span>
                    <p style={{ margin: 0, fontSize: '12.5px', color: '#475569' }}>Name: {viewingResume.hrName || 'N/A'} ({viewingResume.hrDesignation || 'N/A'})</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: '#475569' }}>Email: {viewingResume.hrEmail || 'N/A'}</p>
                  </div>
                </>
              )}
            </div>

            {/* Privacy Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#0284C7',
              backgroundColor: '#F0F9FF',
              border: '1px solid #BAE6FD',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              marginBottom: '20px'
            }}>
              <span>🛡️</span> Private Information Protected
            </div>

            {/* Actions Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    let text = `Name: ${viewingResume.fullName || viewingResume.companyName || viewingResume.name || 'N/A'}\n`;
                    text += `Email: ${viewingResume.email || 'N/A'}\n`;
                    text += `Phone: ${viewingResume.phone || viewingResume.hrPhone || 'N/A'}\n`;
                    text += `Location: ${viewingResume.location || viewingResume.district || 'N/A'}\n`;
                    if (viewingResume.role === 'student') {
                      text += `College: ${viewingResume.college || 'N/A'}\n`;
                      text += `Degree: ${viewingResume.degree || 'N/A'} • Dept: ${viewingResume.department || 'N/A'}\n`;
                      text += `Grad Year: ${viewingResume.gradYear || 'N/A'} • CGPA: ${viewingResume.cgpa || 'N/A'}\n`;
                      text += `Skills: ${Array.isArray(viewingResume.skills) ? viewingResume.skills.join(', ') : viewingResume.skills || 'N/A'}\n`;
                      text += `Project: ${viewingResume.projectTitle || 'N/A'}\n`;
                      text += `Project Description: ${viewingResume.projectDesc || 'N/A'}\n`;
                    }
                    const blob = new Blob([text], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${(viewingResume.fullName || viewingResume.companyName || viewingResume.name || 'User').replace(/\s+/g, '_')}_Resume.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  style={{ padding: '10px 16px', backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '8px', cursor: 'pointer', fontSize: '12.5px', fontWeight: 700 }}
                >
                  Download Profile Data
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    if (viewingResume.role) {
                      handleUpdateUserApproval(viewingResume.email, 'Approved');
                    } else {
                      handleVerifyStatus(viewingResume.id, 'Approved');
                    }
                    setViewingResume(null);
                  }}
                  style={{ padding: '10px 20px', backgroundColor: '#16a34a', color: '#FFFFFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12.5px', fontWeight: 700 }}
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    if (viewingResume.role) {
                      handleUpdateUserApproval(viewingResume.email, 'Rejected');
                    } else {
                      handleVerifyStatus(viewingResume.id, 'Rejected');
                    }
                    setViewingResume(null);
                  }}
                  style={{ padding: '10px 20px', backgroundColor: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12.5px', fontWeight: 700 }}
                >
                  Reject
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
      
      {/* Course Assignment Modal */}
      {showCourseAssignModal && courseToAssign && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px',
            padding: '30px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowCourseAssignModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#005F7A', marginBottom: '20px' }}>
              Assign Course: {courseToAssign.title}
            </h3>
            <form onSubmit={handleAssignCourse} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Select User (Student or Trainer)</label>
                <select 
                  required
                  value={assigneeEmail}
                  onChange={(e) => setAssigneeEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                >
                  <option value="">-- Select a User --</option>
                  {registeredUsers
                    .filter(u => u.role === 'student' || u.role === 'trainer')
                    .map(u => (
                      <option key={u.email} value={u.email}>
                        {u.fullName || u.companyName || u.email} ({u.role})
                      </option>
                    ))
                  }
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button"
                  onClick={() => setShowCourseAssignModal(false)}
                  style={{ padding: '10px 16px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={assigningCourse}
                  style={{ padding: '10px 20px', backgroundColor: '#005F7A', color: '#fff', border: 'none', borderRadius: '8px', cursor: assigningCourse ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {assigningCourse ? 'Assigning...' : 'Assign Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Creation/Edit Modal */}
      {showCourseModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '520px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            border: '1px solid #E2E8F0',
            color: '#0F172A',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowCourseModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                border: 'none',
                background: 'transparent',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#64748B'
              }}
            >
              ×
            </button>

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#005F7A', marginBottom: '20px' }}>
              {courseForm.id ? 'Edit Course Details' : 'Create New Course'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Course Title</label>
                <input 
                  type="text" 
                  value={courseForm.title}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. AutoCAD Mechanical Design"
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Course Name</label>
                <input 
                  type="text" 
                  value={courseForm.name}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. SolidWorks 2026 Core"
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Original Price (Strike-through) (₹)</label>
                  <input 
                    type="text" 
                    value={courseForm.originalPrice}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                    placeholder="e.g. 4999"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Course Price (₹)</label>
                  <input 
                    type="text" 
                    value={courseForm.price}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="e.g. 999"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Course Description</label>
                <textarea 
                  rows="3"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide a comprehensive course description..."
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Total Duration (Hours)</label>
                  <input 
                    type="number" 
                    value={courseForm.totalDurationHours}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, totalDurationHours: e.target.value }))}
                    placeholder="e.g. 45"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Training Days</label>
                  <input 
                    type="number" 
                    value={courseForm.trainingDays}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, trainingDays: e.target.value }))}
                    placeholder="e.g. 9"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Start Date</label>
                  <input 
                    type="date" 
                    value={courseForm.startDate ? courseForm.startDate.split('T')[0] : ''}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, startDate: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Daily Start Time</label>
                  <input 
                    type="time" 
                    value={courseForm.dailyStartTime}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, dailyStartTime: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Program Category</label>
                <select 
                  value={courseForm.programType}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, programType: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px', outline: 'none', backgroundColor: '#fff' }}
                >
                  <option value="Student Development Program">Student Development Program (SDP)</option>
                  <option value="Faculty Development Program">Faculty Development Program (FDP)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Course Cover Image</label>
                <label style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  width: '100%', padding: '12px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', 
                  borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: '#64748b', transition: 'all 0.2s'
                }}>
                  <span style={{ fontSize: '16px' }}>🖼️</span>
                  {courseForm.imageFile ? courseForm.imageFile : 'Click to Upload Course Image'}
                  <input 
                    type="file" 
                    accept="image/*"
                    onClick={(e) => { e.target.value = null; }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImageToCrop(reader.result);
                          setImageFileName(file.name);
                          setShowCropModal(true);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                </label>
                {courseForm.image && (
                  <div style={{ marginTop: '10px', height: '140px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <img 
                      src={courseForm.image} 
                      alt="Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onLoad={(e) => { e.target.style.display = 'block'; }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Course PPT Presentation</label>
                <label style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  width: '100%', padding: '12px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', 
                  borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: '#64748b', transition: 'all 0.2s'
                }}>
                  <span style={{ fontSize: '16px' }}>📊</span>
                  {courseForm.pptFile ? courseForm.pptFile : 'Click to Upload PPT Presentation'}
                  <input 
                    type="file" 
                    accept=".ppt,.pptx"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setCourseForm(prev => ({
                            ...prev,
                            ppt: reader.result,
                            pptFile: file.name
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                </label>
                {courseForm.pptFile && <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '6px', fontWeight: 600 }}>📎 Loaded: {courseForm.pptFile}</div>}
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Course Video Lecture</label>
                <label style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  width: '100%', padding: '12px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', 
                  borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: '#64748b', transition: 'all 0.2s'
                }}>
                  <span style={{ fontSize: '16px' }}>🎬</span>
                  {courseForm.videoFile ? courseForm.videoFile : 'Click to Upload Video Lecture'}
                  <input 
                    type="file" 
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setCourseForm(prev => ({
                            ...prev,
                            video: reader.result,
                            videoFile: file.name
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                </label>
                {courseForm.videoFile && <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '6px', fontWeight: 600 }}>🎬 Loaded: {courseForm.videoFile}</div>}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '25px' }}>
              <button 
                onClick={() => setShowCourseModal(false)}
                style={{ padding: '10px 16px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveCourse}
                style={{ padding: '10px 20px', backgroundColor: '#005F7A', color: '#FFFFFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}
              >
                {courseForm.id ? 'Save Changes' : 'Create Course'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Assign Trainer Modal */}
      {showTrainerAssignModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 20px 0' }}>Assign Trainer to Company</h3>
            
            <div className="form-group">
              <label>Select Company</label>
              <select 
                value={selectedCompanyEmail} 
                onChange={(e) => setSelectedCompanyEmail(e.target.value)}
                className="form-input"
              >
                <option value="">-- Select Company --</option>
                {registeredUsers.filter(u => u.role?.toLowerCase() === 'company').map(c => (
                  <option key={c.email} value={c.email}>{c.companyName || c.fullName || c.email}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginTop: 16 }}>
              <label>Select Trainer</label>
              <select 
                value={selectedTrainerEmail} 
                onChange={(e) => setSelectedTrainerEmail(e.target.value)}
                className="form-input"
              >
                <option value="">-- Select Trainer --</option>
                {registeredUsers.filter(u => u.role?.toLowerCase() === 'trainer').map(t => (
                  <option key={t.email} value={t.email}>{t.fullName || t.email}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: 24 }}>
              <button 
                onClick={() => setShowTrainerAssignModal(false)}
                style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button 
                onClick={handleAssignTrainerToCompany}
                style={{ padding: '8px 16px', background: '#4c5fd5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Crop Image Modal */}
      {showCropModal && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '90%', maxWidth: '600px', height: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#1B1F3B' }}>Adjust Image</h3>
              <button onClick={cancelCrop} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <div style={{ position: 'relative', flex: 1, backgroundColor: '#333' }}>
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '200px' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Zoom:</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <button
                onClick={handleCropImage}
                style={{ padding: '10px 20px', backgroundColor: '#005F7A', color: '#FFFFFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}
              >
                Crop & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showCompanyAssignModal && renderCompanyAssignModal()}
      {showScheduleModal && selectedScheduleCourse && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '16px',
            width: '100%', maxWidth: '800px', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '16px 16px 0 0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#005F7A', margin: 0 }}>
                Course Schedule: {selectedScheduleCourse.title}
              </h3>
              <button 
                onClick={() => {
                  setShowScheduleModal(false);
                  setSelectedScheduleCourse(null);
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div style={{ padding: '24px', overflowY: 'auto' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontWeight: 600, fontSize: '13px' }}>Day</th>
                      <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontWeight: 600, fontSize: '13px' }}>Date</th>
                      <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontWeight: 600, fontSize: '13px' }}>Session Timing</th>
                      <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontWeight: 600, fontSize: '13px' }}>Duration</th>
                      <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontWeight: 600, fontSize: '13px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedScheduleCourse.schedule.map((session, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#0f172a', fontWeight: 500 }}>Day {session.dayNumber}</td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#475569' }}>
                          {new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#475569' }}>
                          {session.startTime} - {session.endTime}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#475569' }}>{session.durationHours} Hours</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ 
                            padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                            backgroundColor: session.status === 'Completed' ? '#dcfce7' : '#e0f2fe',
                            color: session.status === 'Completed' ? '#166534' : '#0369a1'
                          }}>
                            {session.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEnrolledModal && renderEnrolledUsersModal()}
    </div>
  );
}
