import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Phone, Building, Lock, Unlock, Search, Briefcase, Award, TrendingUp, Filter, Shield, Building2, MoreVertical, FileText } from 'lucide-react';
import { useAuth } from '../../state/useAuth';
import { generatePremiumResume } from '../../utils/resumeGenerator';
import { AdminPage, AdminPageHeader, EnterpriseCard, AdminButton, AdminBadge, AdminSearch, A } from '../../components/AdminDesignSystem';

const companyStats = [
  { label: 'Registered Companies', value: '84', icon: <Building2 size={20} />, change: '+3 this month' },
  { label: 'Active Collaborations', value: '32', icon: <Users size={20} />, change: '12 active projects' },
  { label: 'Internship Placements', value: '450+', icon: <TrendingUp size={20} />, change: '+45 this quarter' },
  { label: 'Verified Partners', value: '76', icon: <Shield size={20} />, change: '8 pending review' },
];

export default function AdminUserDirectory({ role, title, subtitle }) {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.email === 'admin@smgroups.com' || currentUser?.email === 'thesmgroups@gmail.com' || currentUser?.role === 'superadmin';
  
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [requestsModalOpen, setRequestsModalOpen] = useState(false);

  const fetchAccessRequests = async () => {
    try {
      const endpoint = isAdmin ? '/api/access-requests' : `/api/access-requests?requesterEmail=${currentUser?.email}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      if (data.success) {
        setAccessRequests(data.requests);
      }
    } catch (err) {
      console.error('Failed to fetch access requests:', err);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/users?role=${role}`);
        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
        } else {
          setError(data.message || 'Failed to fetch users');
        }

        if (isAdmin && role === 'student') {
          const courseRes = await fetch('/api/courses');
          const courseData = await courseRes.json();
          if (courseData.success) {
            setCourses(courseData.courses);
          }
        }
        
        await fetchAccessRequests();

      } catch (err) {
        setError('Unable to reach the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [role, isAdmin]);

  const handleAssignClick = (email) => {
    setSelectedUserEmail(email);
    setSelectedCourseId('');
    setAssignModalOpen(true);
  };

  const submitAssignment = async () => {
    if (!selectedCourseId) return alert('Please select a course to assign.');
    
    setAssigning(true);
    try {
      const res = await fetch('/api/admin/assign-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: selectedUserEmail, courseId: selectedCourseId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Course assigned successfully!');
        setAssignModalOpen(false);
        setUsers(users.map(u => {
          if (u.email === selectedUserEmail) {
            return { ...u, assignedCourses: data.assignedCourses };
          }
          return u;
        }));
      } else {
        alert(data.message || 'Failed to assign course.');
      }
    } catch (err) {
      alert('Error assigning course. Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  const getPrivacyStatus = (targetEmail) => {
    if (isAdmin) return 'Approved';
    if (targetEmail === currentUser?.email) return 'Approved';
    const req = accessRequests.find(r => r.targetEmail === targetEmail);
    if (!req) return 'None';
    return req.status;
  };

  const filteredUsers = users.filter(u => 
    (u.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.knowledge || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.expertise || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminPage>
      <AdminPageHeader 
        title={title} 
        subtitle={subtitle} 
        emoji={role === 'company' ? '🏢' : role === 'trainer' ? '👨‍🏫' : '👨‍🎓'} 
        actions={
          isAdmin ? (
            <AdminButton onClick={() => setRequestsModalOpen(true)} variant="blue" icon={<Lock size={16} />}>
              Manage Requests
            </AdminButton>
          ) : null
        }
      />

      {role === 'company' && isAdmin && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 36 }}>
          {companyStats.map((stat) => (
            <EnterpriseCard key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EFF6FF', color: A.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 13, color: A.inkSoft, fontWeight: 600 }}>{stat.label}</p>
                <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: A.ink, fontFamily: A.font }}>{stat.value}</h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: stat.label.includes('Verified') ? A.orange : A.green, fontWeight: 600 }}>{stat.change}</p>
              </div>
            </EnterpriseCard>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', gap: 16, flex: 1, minWidth: 300 }}>
          <AdminSearch 
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <AdminButton variant="outline" icon={<Filter size={16} />}>
            Filters
          </AdminButton>
        </div>
        {isAdmin && role === 'company' && (
          <AdminButton variant="blue" icon={<Building size={16} />}>
            Register Company
          </AdminButton>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: A.inkMute }}>Loading {title.toLowerCase()}...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: 60, color: A.red }}>{error}</div>
      ) : filteredUsers.length === 0 ? (
        <EnterpriseCard style={{ textAlign: 'center', padding: 60, color: A.inkMute }}>
          No {title.toLowerCase()} found matching your search.
        </EnterpriseCard>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {filteredUsers.map((user) => {
            const isApproved = getPrivacyStatus(user.email) === 'Approved';
            const exp = user.experience || (user.experienceYears ? `${user.experienceYears} Years` : null);
            const know = user.knowledge || user.expertise || null;

            return (
              <EnterpriseCard key={user._id || user.email} hover={true} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#F1F5F9', color: A.inkSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>
                      {(user.fullName || user.companyName || 'U').charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: A.ink }}>{user.fullName || user.companyName || 'User'}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <AdminBadge color={role === 'company' ? A.orange : role === 'trainer' ? A.blue : A.green}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </AdminBadge>
                      </div>
                    </div>
                  </div>
                  <button style={{ background: 'transparent', border: 'none', color: A.inkMute, cursor: 'pointer' }}>
                    <MoreVertical size={18} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  {isApproved ? (
                    <>
                      {user.email && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: A.inkSoft }}>
                          <Mail size={16} color={A.inkMute} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</span>
                        </div>
                      )}
                      {user.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: A.inkSoft }}>
                          <Phone size={16} color={A.inkMute} /> {user.phone}
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: A.inkMute }}>
                      <Lock size={16} /> Contact info hidden
                    </div>
                  )}

                  {exp && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: A.inkSoft }}>
                      <Briefcase size={16} color={A.inkMute} /> {exp}
                    </div>
                  )}
                  {know && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: A.inkSoft }}>
                      <Award size={16} color={A.inkMute} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{know}</span>
                    </div>
                  )}
                </div>

                {isAdmin && role === 'student' && (
                  <div style={{ borderTop: `1px solid ${A.border}`, paddingTop: 16, marginTop: 'auto' }}>
                    <AdminButton variant="outline" style={{ width: '100%' }} onClick={() => handleAssignClick(user.email)}>
                      Assign Course
                    </AdminButton>
                  </div>
                )}
                
                {role === 'student' && (
                  <div style={{ borderTop: isAdmin ? 'none' : `1px solid ${A.border}`, paddingTop: isAdmin ? 8 : 16, marginTop: isAdmin ? 0 : 'auto' }}>
                    <AdminButton variant="ghost" style={{ width: '100%' }} onClick={() => generatePremiumResume(user)} icon={<FileText size={16} />}>
                      Download Resume
                    </AdminButton>
                  </div>
                )}
              </EnterpriseCard>
            );
          })}
        </div>
      )}

      {/* Assignment Modal */}
      {assignModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <EnterpriseCard style={{ width: '100%', maxWidth: 500, padding: 32 }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 800, color: A.ink, fontFamily: A.font }}>Assign Course</h3>
            <p style={{ margin: '0 0 24px', color: A.inkSoft, fontSize: 14 }}>Select a course to assign to {selectedUserEmail}</p>
            
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: A.radiusSm, border: `1px solid ${A.border}`, background: A.bg, fontSize: 15, marginBottom: 24, outline: 'none', fontFamily: A.font, color: A.ink }}
            >
              <option value="">-- Choose Course --</option>
              {courses.map(c => (
                <option key={c._id || c.id} value={c._id || c.id}>{c.title}</option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <AdminButton variant="ghost" onClick={() => setAssignModalOpen(false)}>Cancel</AdminButton>
              <AdminButton variant="primary" onClick={submitAssignment} disabled={assigning}>
                {assigning ? 'Assigning...' : 'Confirm Assignment'}
              </AdminButton>
            </div>
          </EnterpriseCard>
        </div>
      )}
    </AdminPage>
  );
}
