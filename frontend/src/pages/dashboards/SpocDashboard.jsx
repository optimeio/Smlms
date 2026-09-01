import { useState, useEffect } from 'react'; // trigger HMR
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, BookOpen, Users, Calendar, BarChart3, GraduationCap, Sparkles, X, PlusCircle, UserCheck } from 'lucide-react';
import { useAuth } from '../../state/useAuth';
import { PremiumPage, PageHeader, GlassCard, GradientButton, Badge, PremiumStatCard, P } from '../../components/PremiumDesignSystem';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

const employeeProgressData = [
  { name: 'Week 1', completed: 20, inProgress: 45 },
  { name: 'Week 2', completed: 35, inProgress: 40 },
  { name: 'Week 3', completed: 50, inProgress: 35 },
  { name: 'Week 4', completed: 75, inProgress: 20 },
];
const COLORS = ['#6366F1', '#10B981'];

export default function SpocDashboard() {
  const { user } = useAuth();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showLiveClassModal, setShowLiveClassModal] = useState(false);
  
  const [assignForm, setAssignForm] = useState({ studentEmail: '', courseTitle: '' });
  const [liveClassForm, setLiveClassForm] = useState({ courseTitle: '', trainerEmail: '', studentEmails: [], timing: '', duration: '' });
  const [showRequestTrainerModal, setShowRequestTrainerModal] = useState(false);
  const [requestTrainerForm, setRequestTrainerForm] = useState({ reason: '', course: '', date: '', duration: '' });
  const [showRequestStudentModal, setShowRequestStudentModal] = useState(false);
  const [requestStudentForm, setRequestStudentForm] = useState({ course: '', count: '', date: '', duration: '' });
  
  const [toast, setToast] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch('/api/requests')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const myRequests = data.requests.filter(r => r.requesterEmail === user?.email);
          setRequests(myRequests);
        }
      })
      .catch(err => console.error(err));
  }, [user]);

  const assignedCourses = user?.assignedCourses || [];
  const assignedTrainers = user?.assignedTrainers || [];
  const assignedStudents = user?.assignedStudents || [];

  const stats = [
    { label: 'Total Employees', value: assignedStudents.length.toString(), icon: <Building2 size={22} />, gradientFrom: '#6366F1', gradientTo: '#8B5CF6' },
    { label: 'Active Trainings', value: assignedCourses.length.toString(), icon: <BookOpen size={22} />, gradientFrom: '#3B82F6', gradientTo: '#06B6D4' },
    { label: 'Assigned Trainers', value: assignedTrainers.length.toString(), icon: <Users size={22} />, gradientFrom: '#22C55E', gradientTo: '#10B981' },
    { label: 'Upcoming Sessions', value: '0', icon: <Calendar size={22} />, gradientFrom: '#F59E0B', gradientTo: '#F97316' },
    { label: 'Attendance %', value: '0%', icon: <BarChart3 size={22} />, gradientFrom: '#EF4444', gradientTo: '#F43F5E' },
    { label: 'Certificates Generated', value: '0', icon: <GraduationCap size={22} />, gradientFrom: '#EC4899', gradientTo: '#F472B6' },
  ];

  const showToastMsg = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const logActivity = async (action, details) => {
    try {
      await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actor: user?.companyName || user?.fullName || user?.email,
          action,
          details
        })
      });
    } catch (err) {
      console.error('Failed to log activity', err);
    }
  };

  const handleAssignCourse = async () => {
    if (!assignForm.studentEmail || !assignForm.courseTitle) {
      showToastMsg('Please select a student and a course.', 'error');
      return;
    }
    try {
      const res = await fetch('/api/admin/assign-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: assignForm.studentEmail, courseId: assignForm.courseTitle })
      });
      const data = await res.json();
      if (data.success) {
        showToastMsg('Course assigned successfully!');
        setShowAssignModal(false);
        setAssignForm({ studentEmail: '', courseTitle: '' });
        await logActivity('Assigned Course', `Assigned course "${assignForm.courseTitle}" to student ${assignForm.studentEmail}`);
      } else {
        showToastMsg(data.message || 'Failed to assign course.', 'error');
      }
    } catch (err) {
      showToastMsg('Server error.', 'error');
    }
  };

  const handleRequestTrainerSubmit = async () => {
    if (!requestTrainerForm.reason || !requestTrainerForm.course || !requestTrainerForm.date || !requestTrainerForm.duration) {
      showToastMsg('Please fill all fields for the trainer request.', 'error');
      return;
    }
    try {
      const detailsStr = `Requested a trainer for course "${requestTrainerForm.course}". Date: ${requestTrainerForm.date}, Duration: ${requestTrainerForm.duration}. Reason: ${requestTrainerForm.reason}`;
      await logActivity('Trainer Request', detailsStr);
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterEmail: user?.email,
          requesterName: user?.companyName || user?.fullName,
          requesterRole: 'Company',
          targetEmail: 'admin@smgroups.com',
          targetRole: 'Admin',
          targetName: 'Admin',
          requestType: 'Trainer',
          details: requestTrainerForm
        })
      });
      const data = await response.json();
      if (data.success) {
        showToastMsg('Request send successfully');
        setShowRequestTrainerModal(false);
        setRequestTrainerForm({ reason: '', course: '', date: '', duration: '' });
      } else {
        showToastMsg('Failed to send trainer request.', 'error');
      }
    } catch (err) {
      showToastMsg('Server error while sending request.', 'error');
    }
  };

  const handleRequestStudentSubmit = async () => {
    if (!requestStudentForm.course || !requestStudentForm.count || !requestStudentForm.date || !requestStudentForm.duration) {
      showToastMsg('Please fill all fields for the student request.', 'error');
      return;
    }
    try {
      const detailsStr = `Requested students for course "${requestStudentForm.course}". Count: ${requestStudentForm.count}. Date: ${requestStudentForm.date}, Session: ${requestStudentForm.duration}.`;
      await logActivity('Student Request', detailsStr);
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterEmail: user?.email,
          requesterName: user?.companyName || user?.fullName,
          requesterRole: 'Company',
          targetEmail: 'admin@smgroups.com',
          targetRole: 'Admin',
          targetName: 'Admin',
          requestType: 'Student',
          details: requestStudentForm
        })
      });
      const data = await response.json();
      if (data.success) {
        showToastMsg('Request send successfully');
        setShowRequestStudentModal(false);
        setRequestStudentForm({ course: '', count: '', date: '', duration: '' });
      } else {
        showToastMsg('Failed to send student request.', 'error');
      }
    } catch (err) {
      showToastMsg('Server error while sending request.', 'error');
    }
  };

  return (
    <PremiumPage>
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: toast.type === 'error' ? 'rgba(255,92,138,0.06)' : 'rgba(34,197,94,0.06)',
          color: toast.type === 'error' ? P.red : P.green,
          border: `1px solid ${toast.type === 'error' ? 'rgba(255,92,138,0.2)' : 'rgba(34,197,94,0.2)'}`,
          padding: '14px 28px', borderRadius: P.radiusSm, fontWeight: 700, fontSize: 14,
          boxShadow: P.shadow, backdropFilter: 'blur(20px)',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'linear-gradient(135deg, #5B5CFF 0%, #7C5CFF 50%, #B886FF 100%)',
          borderRadius: 24,
          padding: '36px 40px',
          marginBottom: 32,
          position: 'relative',
          overflow: 'hidden',
          color: '#fff',
        }}
      >
        {/* Decorative background blobs */}
        <div style={{ position: 'absolute', top: -60, right: -40, width: 220, height: 220, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -30, right: 80, width: 140, height: 140, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
        
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Sparkles size={20} style={{ opacity: 0.8 }} />
              <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.9, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Company Dashboard</span>
            </div>
            <h1 style={{ margin: '0 0 10px', fontSize: 32, fontWeight: 900, letterSpacing: '-0.5px', fontFamily: P.font }}>
              Welcome back, {user?.companyName || 'Corporate Partner'}! 🏢
            </h1>
            <p style={{ margin: 0, fontSize: 15, opacity: 0.85, lineHeight: 1.6, maxWidth: 500 }}>
              Manage your employees, courses, and live classes.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <GradientButton
              onClick={() => setShowRequestStudentModal(true)}
              style={{
                background: 'linear-gradient(135deg, #FF5C8A, #FF758C)',
                border: 'none',
                boxShadow: '0 8px 24px rgba(255,92,138,0.3)',
              }}
            >
              <UserCheck size={16} /> Request Student
            </GradientButton>
            <GradientButton
              onClick={() => setShowRequestTrainerModal(true)}
              style={{
                background: 'linear-gradient(135deg, #FF8A00, #FFB347)',
                border: 'none',
                boxShadow: '0 8px 24px rgba(255,138,0,0.3)',
              }}
            >
              <UserCheck size={16} /> Request Trainer
            </GradientButton>
            <GradientButton
              onClick={() => setShowAssignModal(true)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              }}
            >
              <PlusCircle size={16} /> Assign Course
            </GradientButton>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="mbk-grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
        {stats.map((item, idx) => (
          <PremiumStatCard
            key={item.label}
            label={item.label}
            value={item.value}
            icon={item.icon}
            gradientFrom={item.gradientFrom}
            gradientTo={item.gradientTo}
          />
        ))}
      </div>



      {/* Main Grid Content */}
      <div className="mbk-grid-responsive" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Employee Progress */}
        <GlassCard style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 42, height: 42, borderRadius: 14, background: 'linear-gradient(135deg, #5B5CFF, #7C5CFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <BarChart3 size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: P.ink, fontFamily: P.font }}>Employee Progress Trends</h3>
          </div>
          <div style={{ width: '100%', height: 300, marginTop: 24 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeeProgressData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={P.border} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: P.inkMute, fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: P.inkMute, fontSize: 12 }} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: 12, border: `1px solid ${P.border}`, boxShadow: '0 10px 25px rgba(0,0,0,0.05)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
                  itemStyle={{ fontWeight: 600 }}
                  cursor={{ fill: 'rgba(99,102,241,0.05)' }}
                />
                <Bar dataKey="completed" name="Completed Modules" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="inProgress" name="In Progress" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="mbk-grid-responsive" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Batch Status */}
        <GlassCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 42, height: 42, borderRadius: 14, background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <BookOpen size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: P.ink, fontFamily: P.font }}>Batch Status</h3>
          </div>
          <div style={{ padding: '40px 20px', textAlign: 'center', color: P.inkMute, fontSize: 14 }}>
            No active batches.
          </div>
        </GlassCard>

        {/* Upcoming Training Sessions */}
        <GlassCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 42, height: 42, borderRadius: 14, background: 'linear-gradient(135deg, #F59E0B, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Calendar size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: P.ink, fontFamily: P.font }}>Upcoming Training Sessions</h3>
          </div>
          <div style={{ padding: '40px 20px', textAlign: 'center', color: P.inkMute, fontSize: 14 }}>
            No upcoming sessions.
          </div>
        </GlassCard>

        {/* Recent Requests */}
        <GlassCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 42, height: 42, borderRadius: 14, background: 'linear-gradient(135deg, #EC4899, #F472B6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <UserCheck size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: P.ink, fontFamily: P.font }}>Recent Requests</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 300, overflowY: 'auto' }}>
            {requests.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: P.inkMute, fontSize: 14 }}>
                No recent requests.
              </div>
            ) : (
              requests.map((req, i) => (
                <div key={i} style={{ padding: 12, border: `1px solid ${P.border}`, borderRadius: 8, background: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: P.ink }}>Requested {req.requestType}</span>
                    <span style={{ fontSize: 11, background: req.status === 'Pending' ? '#fef3c7' : '#e0e7ff', color: req.status === 'Pending' ? '#d97706' : '#4338ca', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>{req.status}</span>
                  </div>
                  <div style={{ fontSize: 11, color: P.inkMute }}>{new Date(req.createdAt).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>

      {/* Assign Course Modal */}
      <AnimatePresence>
        {showAssignModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              style={{ backgroundColor: '#fff', padding: '32px', borderRadius: P.radius, width: '100%', maxWidth: '500px', boxShadow: P.shadowHover, border: `1px solid rgba(255,255,255,0.8)` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: P.ink, fontFamily: P.font }}>Assign Course to Student</h3>
                <button onClick={() => setShowAssignModal(false)} style={{ background: 'rgba(91,92,255,0.1)', border: 'none', width: 36, height: 36, borderRadius: 10, cursor: 'pointer', color: P.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20}/></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: P.inkSoft, fontSize: 13 }}>Select Student</label>
                  <select
                    value={assignForm.studentEmail}
                    onChange={e => setAssignForm(prev => ({ ...prev, studentEmail: e.target.value }))}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${P.border}`, fontSize: 14, fontFamily: P.font, color: P.ink, outline: 'none' }}
                  >
                    <option value="">-- Select Student --</option>
                    {assignedStudents.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: P.inkSoft, fontSize: 13 }}>Select Course</label>
                  <select
                    value={assignForm.courseTitle}
                    onChange={e => setAssignForm(prev => ({ ...prev, courseTitle: e.target.value }))}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${P.border}`, fontSize: 14, fontFamily: P.font, color: P.ink, outline: 'none' }}
                  >
                    <option value="">-- Select Course --</option>
                    {assignedCourses.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: 20, borderTop: `1px solid ${P.border}` }}>
                <GradientButton variant="ghost" onClick={() => setShowAssignModal(false)}>Cancel</GradientButton>
                <GradientButton onClick={handleAssignCourse}>Assign Course</GradientButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Request Trainer Modal */}
      <AnimatePresence>
        {showRequestTrainerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              style={{ backgroundColor: '#fff', padding: '32px', borderRadius: P.radius, width: '100%', maxWidth: '500px', boxShadow: P.shadowHover, border: `1px solid rgba(255,255,255,0.8)` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: P.ink, fontFamily: P.font }}>Request a Trainer</h3>
                <button onClick={() => setShowRequestTrainerModal(false)} style={{ background: 'rgba(91,92,255,0.1)', border: 'none', width: 36, height: 36, borderRadius: 10, cursor: 'pointer', color: P.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20}/></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: P.inkSoft, fontSize: 13 }}>Course Needed</label>
                  <input
                    type="text"
                    placeholder="E.g., React Fundamentals"
                    value={requestTrainerForm.course}
                    onChange={e => setRequestTrainerForm(prev => ({ ...prev, course: e.target.value }))}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${P.border}`, fontSize: 14, fontFamily: P.font, color: P.ink, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: P.inkSoft, fontSize: 13 }}>Date of Session</label>
                  <input
                    type="date"
                    value={requestTrainerForm.date}
                    onChange={e => setRequestTrainerForm(prev => ({ ...prev, date: e.target.value }))}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${P.border}`, fontSize: 14, fontFamily: P.font, color: P.ink, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: P.inkSoft, fontSize: 13 }}>Duration</label>
                  <input
                    type="text"
                    placeholder="E.g., 2 weeks or 10 hours"
                    value={requestTrainerForm.duration}
                    onChange={e => setRequestTrainerForm(prev => ({ ...prev, duration: e.target.value }))}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${P.border}`, fontSize: 14, fontFamily: P.font, color: P.ink, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: P.inkSoft, fontSize: 13 }}>Reason for Trainer</label>
                  <textarea
                    rows={3}
                    placeholder="Why do you need this trainer?"
                    value={requestTrainerForm.reason}
                    onChange={e => setRequestTrainerForm(prev => ({ ...prev, reason: e.target.value }))}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${P.border}`, fontSize: 14, fontFamily: P.font, color: P.ink, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: 20, borderTop: `1px solid ${P.border}` }}>
                <GradientButton variant="ghost" onClick={() => setShowRequestTrainerModal(false)}>Cancel</GradientButton>
                <GradientButton onClick={handleRequestTrainerSubmit}>Submit Request</GradientButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Request Student Modal */}
      <AnimatePresence>
        {showRequestStudentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              style={{ backgroundColor: '#fff', padding: '32px', borderRadius: P.radius, width: '100%', maxWidth: '500px', boxShadow: P.shadowHover, border: `1px solid rgba(255,255,255,0.8)` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: P.ink, fontFamily: P.font }}>Request Students</h3>
                <button onClick={() => setShowRequestStudentModal(false)} style={{ background: 'rgba(91,92,255,0.1)', border: 'none', width: 36, height: 36, borderRadius: 10, cursor: 'pointer', color: P.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20}/></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: P.inkSoft, fontSize: 13 }}>Course Needed</label>
                  <input
                    type="text"
                    placeholder="E.g., Python Basics"
                    value={requestStudentForm.course}
                    onChange={e => setRequestStudentForm(prev => ({ ...prev, course: e.target.value }))}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${P.border}`, fontSize: 14, fontFamily: P.font, color: P.ink, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: P.inkSoft, fontSize: 13 }}>Number of Students</label>
                  <input
                    type="number"
                    placeholder="E.g., 20"
                    value={requestStudentForm.count}
                    onChange={e => setRequestStudentForm(prev => ({ ...prev, count: e.target.value }))}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${P.border}`, fontSize: 14, fontFamily: P.font, color: P.ink, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: P.inkSoft, fontSize: 13 }}>Date</label>
                  <input
                    type="date"
                    value={requestStudentForm.date}
                    onChange={e => setRequestStudentForm(prev => ({ ...prev, date: e.target.value }))}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${P.border}`, fontSize: 14, fontFamily: P.font, color: P.ink, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: P.inkSoft, fontSize: 13 }}>Session Timing / Duration</label>
                  <input
                    type="text"
                    placeholder="E.g., Morning Session, 2 weeks"
                    value={requestStudentForm.duration}
                    onChange={e => setRequestStudentForm(prev => ({ ...prev, duration: e.target.value }))}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${P.border}`, fontSize: 14, fontFamily: P.font, color: P.ink, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: 20, borderTop: `1px solid ${P.border}` }}>
                <GradientButton variant="ghost" onClick={() => setShowRequestStudentModal(false)}>Cancel</GradientButton>
                <GradientButton onClick={handleRequestStudentSubmit}>Submit Request</GradientButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PremiumPage>
  );
}
