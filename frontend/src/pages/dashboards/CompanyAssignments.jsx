import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../state/useAuth';
import { ClipboardList, PlusCircle, Calendar, Users, X, FileText } from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, GradientButton, Badge, P } from '../../components/PremiumDesignSystem';

export default function CompanyAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', courseTitle: '', assignedTo: [] });
  const [toast, setToast] = useState(null);

  const assignedCourses = user?.assignedCourses || [];
  const assignableUsers = [...(user?.assignedStudents || []), ...(user?.assignedTrainers || [])];

  const fetchAssignments = async () => {
    try {
      const res = await fetch('/api/assignments');
      const data = await res.json();
      if (data.success) {
        setAssignments(data.assignments.filter(a => a.createdBy === user?.email));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [user]);

  const showToastMsg = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAssign = async () => {
    if (!form.title || !form.courseTitle || form.assignedTo.length === 0) {
      showToastMsg('Title, Course, and Assignees are required.', 'error');
      return;
    }
    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          createdBy: user?.email
        })
      });
      const data = await res.json();
      if (data.success) {
        showToastMsg('Assignment created successfully!');
        setShowModal(false);
        setForm({ title: '', description: '', dueDate: '', courseTitle: '', assignedTo: [] });
        fetchAssignments();
        // Log activity
        await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actor: user?.companyName || user?.fullName || user?.email,
            action: 'Assigned Task',
            details: `Created assignment "${form.title}" for ${form.assignedTo.length} users`
          })
        });
      } else {
        showToastMsg(data.message || 'Failed to create assignment.', 'error');
      }
    } catch (err) {
      showToastMsg('Server error.', 'error');
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${P.border}`,
    fontSize: 14, color: P.ink, outline: 'none', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', fontFamily: P.font,
    transition: 'border-color .2s, box-shadow .2s',
  };
  const labelStyle = { fontSize: 13, fontWeight: 700, color: P.inkSoft, marginBottom: 8, display: 'block' };

  return (
    <PremiumPage>
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

      <PageHeader
        title="Assignments"
        subtitle="Assign tasks or assessments to your students and trainers."
        emoji="📝"
        actions={
          <GradientButton onClick={() => setShowModal(true)}>
            <PlusCircle size={16} /> Create Assignment
          </GradientButton>
        }
      />

      <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
        {/* Table Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.2fr 1.2fr',
          background: 'rgba(99,102,241,0.03)', padding: '18px 28px',
          borderBottom: `1px solid ${P.border}`,
        }}>
          {['Title', 'Course', 'Due Date', 'Assigned To'].map(h => (
            <div key={h} style={{
              fontWeight: 800, fontSize: 12, color: P.inkMute,
              textTransform: 'uppercase', letterSpacing: '0.8px',
            }}>
              {h}
            </div>
          ))}
        </div>

        {/* Table Body */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center', color: P.inkMute }}>Loading assignments...</div>
          ) : assignments.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: P.inkMute }}>No assignments created yet.</div>
          ) : (
            assignments.map((a, idx) => (
              <motion.div
                key={a._id || a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ backgroundColor: 'rgba(99,102,241,0.02)' }}
                style={{
                  display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.2fr 1.2fr',
                  alignItems: 'center', padding: '20px 28px',
                  borderBottom: idx !== assignments.length - 1 ? `1px solid ${P.border}` : 'none',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontWeight: 700, color: P.ink, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FileText size={16} color={P.primary} />
                  {a.title}
                </div>
                <div style={{ color: P.inkSoft, fontWeight: 500 }}>{a.courseTitle}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: P.inkSoft, fontSize: 13, fontWeight: 600 }}>
                  <Calendar size={14} color={P.inkMute} /> 
                  {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'No due date'}
                </div>
                <div>
                  <Badge color={P.blue} bg="rgba(59,130,246,0.08)">
                    {a.assignedTo?.length || 0} Users
                  </Badge>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </GlassCard>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
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
              style={{ backgroundColor: '#fff', padding: '32px', borderRadius: P.radius, width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: P.shadowHover, border: `1px solid rgba(255,255,255,0.8)` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: P.ink, fontFamily: P.font }}>Create New Assignment</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'rgba(91,92,255,0.1)', border: 'none', width: 36, height: 36, borderRadius: 10, cursor: 'pointer', color: P.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20}/></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Assignment Title</label>
                  <input type="text" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} style={{ ...inputStyle, minHeight: '80px' }} />
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Course</label>
                    <select value={form.courseTitle} onChange={e => setForm(prev => ({ ...prev, courseTitle: e.target.value }))} style={inputStyle}>
                      <option value="">-- Select Course --</option>
                      {assignedCourses.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Due Date</label>
                    <input type="date" value={form.dueDate} onChange={e => setForm(prev => ({ ...prev, dueDate: e.target.value }))} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Assign To (Hold Ctrl/Cmd to select multiple)</label>
                  <select multiple value={form.assignedTo} onChange={e => {
                    const options = Array.from(e.target.options);
                    const selected = options.filter(o => o.selected).map(o => o.value);
                    setForm(prev => ({ ...prev, assignedTo: selected }));
                  }} style={{ ...inputStyle, minHeight: '100px' }}>
                    {assignableUsers.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: 20, borderTop: `1px solid ${P.border}` }}>
                <GradientButton variant="ghost" onClick={() => setShowModal(false)}>Cancel</GradientButton>
                <GradientButton onClick={handleAssign}>Assign</GradientButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PremiumPage>
  );
}
