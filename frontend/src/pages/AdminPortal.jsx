import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPortal.css';
import '../styles/Dashboard.css';

const API = '/api/admin';

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
  )
};

const MENU_ITEMS = [
  { name: 'Dashboard', icon: Icons.Dashboard },
  { name: 'Students', icon: Icons.Students },
  { name: 'Trainers', icon: Icons.Trainers },
  { name: 'Companies', icon: Icons.Companies },
  { name: 'Courses', icon: Icons.Courses },
  { name: 'Contact Requests', icon: Icons.ContactRequests },
  { name: 'Reports', icon: Icons.Reports },
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

  // Courses state
  const [courses, setCourses] = useState([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseForm, setCourseForm] = useState({
    id: null,
    title: '',
    name: '',
    price: '',
    description: '',
    image: '',
    imageFile: '',
    ppt: '',
    pptFile: '',
    video: '',
    videoFile: '',
    programType: 'Student Development Program'
  });

  // Detailed Course Content View & Assign Box states
  const [selectedCourseForContent, setSelectedCourseForContent] = useState(null);
  const [activeContentSection, setActiveContentSection] = useState('PPT');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignCollege, setAssignCollege] = useState('');
  const [assignDepartment, setAssignDepartment] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState([]);

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {roleName.charAt(0).toUpperCase() + roleName.slice(1)}s Directory
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>
            View and manage {roleName} registrations, details, and verification status.
          </p>
        </div>

        <div className="admin-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Details</th>
                  <th>Location & Contact</th>
                  {roleName === 'student' && <th>College & Dept</th>}
                  {roleName === 'trainer' && <th>Expertise</th>}
                  {roleName === 'company' && <th>Industry & Website</th>}
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={roleName === 'student' || roleName === 'trainer' || roleName === 'company' ? 5 : 4} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                      No {roleName} records found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isApproved = user.isApproved;
                    const statusText = user.status || (isApproved ? 'Approved' : 'Pending');
                    return (
                      <tr key={user.email}>
                        <td>
                          <div className="table-user-cell">
                            <div className="table-avatar">{user.fullName?.[0] || user.companyName?.[0] || 'U'}</div>
                            <div className="table-user-info">
                              <h5>{user.fullName || user.companyName}</h5>
                              <p>{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>📞 {user.phone || user.hrPhone || 'N/A'}</div>
                          <div style={{ color: '#64748b', fontSize: '12px' }}>📍 {user.location || user.district || 'N/A'}</div>
                        </td>
                        {roleName === 'student' && (
                          <td>
                            <div style={{ fontWeight: 600 }}>{user.college || 'N/A'}</div>
                            <div style={{ color: '#64748b', fontSize: '12px' }}>{user.department || 'N/A'}</div>
                          </td>
                        )}
                        {roleName === 'trainer' && (
                          <td>
                            <div style={{ fontWeight: 600 }}>{user.expertise || 'N/A'}</div>
                            <div style={{ color: '#64748b', fontSize: '12px' }}>{user.experienceYears ? `${user.experienceYears} Yrs Exp` : 'N/A'}</div>
                          </td>
                        )}
                        {roleName === 'company' && (
                          <td>
                            <div style={{ fontWeight: 600 }}>{user.industry || 'N/A'}</div>
                            <div style={{ color: '#FF6B00', fontSize: '12px' }}>
                              <a href={user.website} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{user.website || 'N/A'}</a>
                            </div>
                          </td>
                        )}
                        <td>
                          <span className={`status-badge ${statusText === 'Approved' ? 'success' : statusText === 'Pending' ? 'warn' : 'error'}`}>
                            {statusText}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => setViewingResume(user)}
                              className="quick-action-btn"
                              style={{ padding: '6px 12px', background: '#F1F1F1', color: '#0F172A', border: '1px solid #EFEFEF' }}
                            >
                              👁 View
                            </button>
                            <button
                              onClick={() => handleUpdateUserApproval(user.email, 'Approved')}
                              className="quick-action-btn"
                              style={{ padding: '6px 12px', background: '#F0FDF4', color: '#22C55E', border: '1px solid #DCFCE7' }}
                            >
                              ✔ Approve
                            </button>
                            <button
                              onClick={() => handleUpdateUserApproval(user.email, 'Rejected')}
                              className="quick-action-btn"
                              style={{ padding: '6px 12px', background: '#FEF2F2', color: '#EF4444', border: '1px solid #FEE2E2' }}
                            >
                              ✖ Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || (user.email !== 'admin@smgroups.com' && user.email !== 'thesmgroups@gmail.com')) {
      navigate('/login');
    } else {
      fetchContactRequests();
      fetchCourses();
      fetchRegisteredUsers();
    }
  }, [navigate, activeTab]);

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

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="admin-dashboard-container">
            {/* Top KPI Section */}
            <div className="kpi-cards-container">
              <div className="kpi-card-box">
                <div className="kpi-icon-box cyan">{Icons.Students}</div>
                <div className="kpi-details">
                  <h3>{registeredUsers.filter(u => u.role === 'student').length}</h3>
                  <p>Total Students</p>
                </div>
              </div>

              <div className="kpi-card-box">
                <div className="kpi-icon-box blue">{Icons.Trainers}</div>
                <div className="kpi-details">
                  <h3>{registeredUsers.filter(u => u.role === 'trainer').length}</h3>
                  <p>Total Trainers</p>
                </div>
              </div>

              <div className="kpi-card-box">
                <div className="kpi-icon-box gray">{Icons.Companies}</div>
                <div className="kpi-details">
                  <h3>{registeredUsers.filter(u => u.role === 'company').length}</h3>
                  <p>Registered Companies</p>
                </div>
              </div>

              <div className="kpi-card-box">
                <div className="kpi-icon-box orange">{Icons.VerificationRequests}</div>
                <div className="kpi-details">
                  <h3>{registeredUsers.filter(u => u.status === 'Pending' || u.isApproved === false).length}</h3>
                  <p>Pending Approvals</p>
                </div>
              </div>

              <div className="kpi-card-box">
                <div className="kpi-icon-box green">{Icons.Courses}</div>
                <div className="kpi-details">
                  <h3>{courses.length}</h3>
                  <p>Active Courses</p>
                </div>
              </div>
            </div>

            {/* Dashboard Panels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="panel-card">
                <div className="panel-header">
                  <h3 className="panel-title">Recent Activity Logs</h3>
                </div>
                {activities && activities.length > 0 ? (
                  <div className="activity-list">
                    {activities.slice(0, 8).map((act, i) => (
                      <div key={i} className="activity-item">
                        <span className="activity-icon" style={{ color: act.success ? '#16A34A' : '#EF4444' }}>
                          {act.success ? '✓' : '✗'}
                        </span>
                        <div className="activity-details">
                          <p className="activity-text">{act.text}</p>
                          <p className="activity-time">{act.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '20px 0', color: '#64748B', fontSize: '13px' }}>
                    No recent activities found.
                  </div>
                )}
              </div>
            </div>
          </div>
        );
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
          price: courseForm.price,
          description: courseForm.description,
          content: courseForm.description, // compatibility
          image: courseForm.image,
          imageFile: courseForm.imageFile,
          ppt: courseForm.ppt,
          pptFile: courseForm.pptFile,
          video: courseForm.video,
          videoFile: courseForm.videoFile,
          programType: courseForm.programType
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Courses Management</h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>Create, edit, view and manage all academic training programs.</p>
          </div>
          <button 
            onClick={() => {
              setCourseForm({ id: null, title: '', name: '', price: '', description: '', image: '', imageFile: '', ppt: '', pptFile: '', video: '', videoFile: '', programType: 'Student Development Program' });
              setShowCourseModal(true);
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#005F7A',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s'
            }}
          >
            <span>+</span> Add New Course
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {filteredCourses.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #cbd5e1',
              padding: '40px',
              textAlign: 'center',
              color: '#64748b'
            }}>
              No courses found. Add a course to get started!
            </div>
          ) : (
            filteredCourses.map((c) => (
              <div key={c._id || c.id} style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #cbd5e1',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s'
              }}>
                <div>
                  <div style={{ height: '160px', backgroundColor: '#e2e8f0', position: 'relative', overflow: 'hidden' }}>
                    {c.image ? (
                      <img 
                        src={c.image} 
                        alt={c.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
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
                  <button 
                    onClick={() => {
                      setSelectedCourseForContent(c);
                      setActiveContentSection('PPT');
                      fetchRegisteredUsers();
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: '#005F7A',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    📚 Manage Course Content
                  </button>
                  <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                    <button 
                      onClick={() => {
                        setCourseForm({
                          id: c._id || c.id,
                          title: c.title || '',
                          name: c.name || '',
                          price: c.price || '',
                          description: c.description || c.content || '',
                          image: c.image || '',
                          imageFile: '',
                          ppt: c.ppt || '',
                          pptFile: c.pptName || '',
                          video: c.video || '',
                          videoFile: c.videoName || '',
                          programType: c.programType || 'Student Development Program'
                        });
                        setShowCourseModal(true);
                      }}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        backgroundColor: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        color: '#475569',
                        fontWeight: 600,
                        fontSize: '12.5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteCourse(c._id || c.id)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '8px',
                        color: '#ef4444',
                        fontWeight: 600,
                        fontSize: '12.5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderReportsTab = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Reports & Feedback Center</h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>
            Review issues, feedback, and reports submitted by students, trainers, or companies for assigned work.
          </p>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #cbd5e1',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
          color: '#64748b'
        }}>
          No reports or feedback submissions found.
        </div>
      </div>
    );
  };

  const renderSettingsTab = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>System Settings Configuration</h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>Configure platform general preferences, SMTP email servers, security modes, and view access audit logs.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }} className="responsive-row">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* General Preferences */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #cbd5e1', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
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
            </div>

            {/* Email SMTP Configuration */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #cbd5e1', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
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
            </div>
          </div>

          {/* Side panel: Info Audit Logs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #cbd5e1', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
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
            </div>
            
            <button onClick={() => showToast('Settings successfully updated!')} style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#005F7A',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '13.5px'
            }}>Save Configuration</button>
          </div>
        </div>
      </div>
    );
  };

  const renderContactRequestsTab = () => {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #cbd5e1',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Contact & Resume Access Requests
          </h3>
          <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '6px' }}>
            Approve or reject requests from users to see private profile details (contact numbers, emails, and resume links).
          </p>
        </div>

        {contactRequests.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            No access requests found.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Requester User</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Target Profile</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Date Submitted</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {contactRequests.map((row) => {
                  const rowId = row._id || row.id;
                  return (
                    <tr key={rowId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{row.requesterName}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{row.requesterEmail} ({row.requesterRole})</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{row.targetName}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{row.targetEmail} ({row.targetRole})</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: row.status === 'Pending' ? '#fef3c7' : row.status === 'Approved' ? '#d1fae5' : '#fee2e2',
                          color: row.status === 'Pending' ? '#b45309' : row.status === 'Approved' ? '#065f46' : '#b91c1c'
                        }}>{row.status}</span>
                      </td>
                      <td style={{ padding: '12px', color: '#64748b', fontSize: '13px' }}>
                        {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {row.status === 'Pending' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => {
                              handleUpdateAccessRequest(rowId, 'Approved');
                            }} style={{ padding: '6px 12px', backgroundColor: '#005F7A', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Approve</button>
                            
                            <button onClick={() => {
                              handleUpdateAccessRequest(rowId, 'Rejected');
                            }} style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Reject</button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12.5px', color: '#94a3b8', fontStyle: 'italic' }}>Resolved</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
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
        <div>
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

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Course Price (₹)</label>
                <input 
                  type="text" 
                  value={courseForm.price}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g. 15000"
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px' }}
                />
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
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setCourseForm(prev => ({
                          ...prev,
                          image: reader.result, // base64 string
                          imageFile: file.name
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ width: '100%', padding: '6px 0', fontSize: '13px' }}
                />
                {courseForm.image && (
                  <div style={{ marginTop: '10px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px dashed #cbd5e1' }}>
                    <img src={courseForm.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Course PPT Presentation</label>
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
                          ppt: reader.result, // base64 string
                          pptFile: file.name
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ width: '100%', padding: '6px 0', fontSize: '13px' }}
                />
                {courseForm.pptFile && <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>📎 Loaded PPT: {courseForm.pptFile}</div>}
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Course Video Lecture</label>
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
                          video: reader.result, // base64 string
                          videoFile: file.name
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ width: '100%', padding: '6px 0', fontSize: '13px' }}
                />
                {courseForm.videoFile && <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>🎬 Loaded Video: {courseForm.videoFile}</div>}
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
    </div>
  );
}
