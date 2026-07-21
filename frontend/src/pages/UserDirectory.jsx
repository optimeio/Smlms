import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, Phone, Building, PlusCircle, Lock, Unlock, X, FileText, Search, Briefcase, Award, TrendingUp, Filter, CheckCircle, Shield, Building2 } from 'lucide-react';
import { useAuth } from '../state/useAuth';
import { generatePremiumResume } from '../utils/resumeGenerator';
import { PremiumPage, PageHeader, GlassCard, GradientButton, Badge, P } from '../components/PremiumDesignSystem';

const companyStats = [
  { label: 'Registered Companies', value: '84', icon: <Building2 size={20} />, change: '+3 this month' },
  { label: 'Active Collaborations', value: '32', icon: <Users size={20} />, change: '12 active projects' },
  { label: 'Internship Placements', value: '450+', icon: <TrendingUp size={20} />, change: '+45 this quarter' },
  { label: 'Verified Partners', value: '76', icon: <Shield size={20} />, change: '8 pending review' },
];

export default function UserDirectory({ role, title, subtitle }) {
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
      const endpoint = isAdmin ? '/api/access-requests' : `/api/access-requests?requesterEmail=${currentUser.email}`;
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

  const handleRequestAccess = async (targetUser) => {
    try {
      const res = await fetch('/api/access-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterEmail: currentUser.email,
          targetEmail: targetUser.email,
          requesterName: currentUser.fullName,
          targetName: targetUser.fullName,
          requesterRole: currentUser.role,
          targetRole: targetUser.role
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Access request sent! You will be notified once the admin approves.');
        await fetchAccessRequests();
      } else {
        alert(data.message || 'Failed to send request.');
      }
    } catch (err) {
      alert('Error sending request.');
    }
  };

  const handleUpdateRequest = async (id, status) => {
    try {
      const res = await fetch(`/api/access-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        fetchAccessRequests();
      }
    } catch (err) {
      alert('Error updating request.');
    }
  };

  const getPrivacyStatus = (targetEmail) => {
    if (isAdmin) return 'Approved';
    if (targetEmail === currentUser?.email) return 'Approved';
    const req = accessRequests.find(r => r.targetEmail === targetEmail);
    if (!req) return 'None';
    return req.status; // 'Pending', 'Approved', 'Rejected'
  };

  const filteredUsers = users.filter(u => 
    (u.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.knowledge || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.expertise || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PremiumPage>
      <PageHeader 
        title={title} 
        subtitle={subtitle} 
        emoji={role === 'company' ? '🏢' : role === 'trainer' ? '👨‍🏫' : '👨‍🎓'} 
        actions={
          isAdmin ? (
            <GradientButton onClick={() => setRequestsModalOpen(true)} variant="primary">
              <Lock size={16} /> Manage Requests
            </GradientButton>
          ) : null
        }
      />

      {role === 'company' && isAdmin && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
          {companyStats.map((stat) => (
            <GlassCard key={stat.label} style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(91,92,255,0.1)', color: P.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 13, color: P.inkMute, fontWeight: 700 }}>{stat.label}</p>
                <h3 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: P.ink, fontFamily: P.font }}>{stat.value}</h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: stat.label.includes('Verified') ? '#F59E0B' : P.green, fontWeight: 600 }}>{stat.change}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', gap: 16, flex: 1, minWidth: 300 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
            <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: P.inkMute }} />
            <input 
              type="text" 
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: P.radius, border: `1px solid ${P.border}`, fontSize: 14, outline: 'none', background: '#f8fafc', color: P.ink, fontFamily: P.font }}
            />
          </div>
          <button style={{ padding: '0 16px', borderRadius: P.radius, border: `1px solid ${P.border}`, fontSize: 14, outline: 'none', background: '#fff', color: P.ink, fontFamily: P.font, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}>
            <Filter size={16} /> Filters
          </button>
        </div>
        {isAdmin && role === 'company' && (
          <GradientButton>+ Register Company</GradientButton>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: P.inkMute }}>Loading {title.toLowerCase()}...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: 60, color: P.red }}>{error}</div>
      ) : filteredUsers.length === 0 ? (
        <GlassCard style={{ textAlign: 'center', padding: 60, color: P.inkMute }}>
          No {title.toLowerCase()} found matching your search.
        </GlassCard>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {filteredUsers.map((user, idx) => {
            const privacyStatus = getPrivacyStatus(user.email);
            const isApproved = privacyStatus === 'Approved';
            const exp = user.experience || (user.experienceYears ? `${user.experienceYears} Years` : null);
            const know = user.knowledge || user.expertise || null;

            return (
              <GlassCard 
                key={user._id || user.id || user.email}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  padding: 24,
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = P.shadowHover}
                onMouseLeave={e => e.currentTarget.style.boxShadow = P.shadow}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg, ${P.primary}, ${P.secondary})`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, overflow: 'hidden', flexShrink: 0, boxShadow: `0 4px 12px rgba(91,92,255,0.3)` }}>
                    {user.profilePhoto ? <img src={user.profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user.fullName ? user.fullName.charAt(0).toUpperCase() : <Users size={24} />)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: P.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.fullName || 'Unknown User'}</h3>
                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Badge bg={`rgba(91,92,255,0.1)`} color={P.primary}>{user.role.toUpperCase()}</Badge>
                      {role === 'company' && isAdmin && (
                        <span style={{ fontSize: 11, background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <CheckCircle size={10} /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: P.inkSoft, marginTop: 4 }}>
                  {user.college && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Building size={16} color={P.inkMute} />
                      <span style={{ fontWeight: 600, color: P.ink }}>{user.college} {user.department ? `(${user.department})` : ''}</span>
                    </div>
                  )}
                  
                  {(exp || know) && (
                    <div style={{ background: '#f8fafc', padding: 12, borderRadius: P.radiusSm, border: `1px solid ${P.border}` }}>
                      {exp && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                          <Briefcase size={14} color={P.blue} style={{ marginTop: 2 }}/>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: P.inkMute, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Experience</div>
                            <div style={{ fontWeight: 600, color: P.ink }}>{exp}</div>
                          </div>
                        </div>
                      )}
                      {know && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                          <Award size={14} color={P.orange} style={{ marginTop: 2 }}/>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: P.inkMute, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expertise / Industry</div>
                            <div style={{ fontWeight: 600, color: P.ink }}>{know}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {isApproved ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Mail size={16} color={P.inkMute} />
                        <span style={{ fontWeight: 600, color: P.ink }}>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Phone size={16} color={P.inkMute} />
                          <span style={{ fontWeight: 600, color: P.ink }}>{user.phone}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: `1px dashed ${P.border}`, textAlign: 'center', marginTop: 8 }}>
                      <Lock size={20} color={P.inkMute} style={{ marginBottom: 8 }} />
                      <p style={{ margin: '0 0 12px', fontSize: 13, color: P.inkSoft, fontWeight: 500 }}>Contact information is private</p>
                      {privacyStatus === 'None' && (
                        <GradientButton onClick={() => handleRequestAccess(user)} variant="ghost" style={{ width: '100%' }}>
                          Request Access
                        </GradientButton>
                      )}
                      {privacyStatus === 'Pending' && (
                        <Badge color={P.orange} bg="rgba(245,158,11,0.1)">Request Pending</Badge>
                      )}
                      {privacyStatus === 'Rejected' && (
                        <Badge color={P.red} bg="rgba(255,92,138,0.1)">Request Rejected</Badge>
                      )}
                    </div>
                  )}
                </div>
                
                {isAdmin && role === 'student' && (
                  <div style={{ marginTop: 12, paddingTop: 16, borderTop: `1px solid ${P.border}` }}>
                    <p style={{ margin: '0 0 10px 0', fontSize: 12, fontWeight: 700, color: P.inkMute, textTransform: 'uppercase' }}>Assigned Courses ({user.assignedCourses?.length || 0})</p>
                    <GradientButton 
                      onClick={() => handleAssignClick(user.email)}
                      variant="outline"
                      style={{ width: '100%', borderStyle: 'dashed' }}
                    >
                      <PlusCircle size={15} /> Assign Course
                    </GradientButton>
                  </div>
                )}

                {role === 'company' && isAdmin && (
                  <div style={{ display: 'flex', gap: 8, borderTop: `1px solid ${P.border}`, paddingTop: 16, marginTop: 'auto' }}>
                    <button style={{ flex: 1, padding: '8px', background: '#f8fafc', border: `1px solid ${P.border}`, borderRadius: P.radiusSm, color: P.ink, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      Partnerships
                    </button>
                    <button style={{ flex: 1, padding: '8px', background: P.blue, border: 'none', borderRadius: P.radiusSm, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      Review
                    </button>
                  </div>
                )}

                {role !== 'company' && (
                  <div style={{ marginTop: 'auto', paddingTop: isAdmin && role === 'student' ? 12 : 16, borderTop: isAdmin && role === 'student' ? 'none' : `1px solid ${P.border}` }}>
                    <GradientButton 
                      onClick={() => generatePremiumResume(user, !isApproved)}
                      style={{ width: '100%' }}
                    >
                      <FileText size={15} /> View Full Profile
                    </GradientButton>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Assign Course Modal */}
      <AnimatePresence>
        {assignModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              style={{ background: '#fff', borderRadius: P.radius, padding: 32, width: '100%', maxWidth: 420, boxShadow: P.shadowHover, border: `1px solid rgba(255,255,255,0.8)` }}
            >
              <h3 style={{ margin: '0 0 8px 0', fontSize: 20, fontWeight: 800, color: P.ink, fontFamily: P.font }}>Assign Course</h3>
              <p style={{ margin: '0 0 20px 0', fontSize: 14, color: P.inkMute }}>Assign a new course to <strong>{selectedUserEmail}</strong></p>
              <select 
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${P.border}`, marginBottom: 24, fontSize: 14, fontFamily: P.font, color: P.ink, outline: 'none' }}
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
              >
                <option value="">-- Select a Course --</option>
                {courses.map(c => (
                  <option key={c._id || c.id} value={c._id || c.id}>{c.title}</option>
                ))}
              </select>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <GradientButton variant="ghost" onClick={() => setAssignModalOpen(false)}>Cancel</GradientButton>
                <GradientButton onClick={submitAssignment} disabled={assigning}>
                  {assigning ? 'Assigning...' : 'Assign Course'}
                </GradientButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Requests Modal (Admin) */}
      <AnimatePresence>
        {requestsModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              style={{ background: '#fff', borderRadius: P.radius, padding: 32, width: '100%', maxWidth: 650, maxHeight: '85vh', overflowY: 'auto', boxShadow: P.shadowHover, border: `1px solid rgba(255,255,255,0.8)` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: P.ink, fontFamily: P.font }}>Manage Privacy Requests</h3>
                <button onClick={() => setRequestsModalOpen(false)} style={{ background: 'rgba(91,92,255,0.1)', border: 'none', width: 36, height: 36, borderRadius: 10, cursor: 'pointer', color: P.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20}/></button>
              </div>
              
              {accessRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: P.inkMute, background: 'rgba(0,0,0,0.02)', borderRadius: 16 }}>No pending requests found.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {accessRequests.map(req => (
                    <div key={req._id || req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 20, border: `1px solid ${P.border}`, borderRadius: 16, background: '#fafafa' }}>
                      <div>
                        <p style={{ margin: '0 0 8px 0', fontWeight: 700, fontSize: 14, color: P.ink }}>
                          {req.requesterName || req.requesterEmail} 
                          <span style={{color: P.inkMute, fontWeight: 500, margin: '0 6px'}}>requested access to</span> 
                          {req.targetName || req.targetEmail}
                        </p>
                        <Badge 
                          color={req.status === 'Approved' ? P.green : req.status === 'Rejected' ? P.red : P.orange}
                          bg={req.status === 'Approved' ? 'rgba(34,197,94,0.1)' : req.status === 'Rejected' ? 'rgba(255,92,138,0.1)' : 'rgba(245,158,11,0.1)'}
                        >
                          {req.status}
                        </Badge>
                      </div>
                      {req.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: 10 }}>
                          <GradientButton variant="success" onClick={() => handleUpdateRequest(req._id || req.id, 'Approved')} style={{ padding: '8px 16px' }}>Approve</GradientButton>
                          <GradientButton variant="danger" onClick={() => handleUpdateRequest(req._id || req.id, 'Rejected')} style={{ padding: '8px 16px' }}>Reject</GradientButton>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PremiumPage>
  );
}
