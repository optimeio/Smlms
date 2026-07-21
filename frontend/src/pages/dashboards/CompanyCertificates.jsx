import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../state/useAuth';
import { Award, PlusCircle, Calendar, Users, X, ExternalLink } from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, GradientButton, Badge, P } from '../../components/PremiumDesignSystem';

export default function CompanyCertificates() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [form, setForm] = useState({ studentEmail: '', courseTitle: '', certificateUrl: '' });
  const [toast, setToast] = useState(null);

  const assignedCourses = user?.assignedCourses || [];
  const assignableUsers = [...(user?.assignedStudents || []), ...(user?.assignedTrainers || [])];

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/certificates');
      const data = await res.json();
      if (data.success) {
        setCertificates(data.certificates.filter(c => c.issuedBy === user?.email));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [user]);

  const showToastMsg = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleIssue = async () => {
    if (!form.studentEmail || !form.courseTitle) {
      showToastMsg('User and Course are required.', 'error');
      return;
    }
    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          issuedBy: user?.email
        })
      });
      const data = await res.json();
      if (data.success) {
        showToastMsg('Certificate issued successfully!');
        setShowModal(false);
        setForm({ studentEmail: '', courseTitle: '', certificateUrl: '' });
        fetchCertificates();
        // Log activity
        await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actor: user?.companyName || user?.fullName || user?.email,
            action: 'Issued Certificate',
            details: `Issued certificate for "${form.courseTitle}" to ${form.studentEmail}`
          })
        });
      } else {
        showToastMsg(data.message || 'Failed to issue certificate.', 'error');
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
        title="Certificates"
        subtitle="Issue certificates to students and trainers upon course completion."
        emoji="🎓"
        actions={
          <GradientButton onClick={() => setShowModal(true)}>
            <PlusCircle size={16} /> Issue Certificate
          </GradientButton>
        }
      />

      <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
        {/* Table Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1fr',
          background: 'rgba(99,102,241,0.03)', padding: '18px 28px',
          borderBottom: `1px solid ${P.border}`,
        }}>
          {['Recipient', 'Course', 'Issue Date', 'Link'].map(h => (
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
            <div style={{ padding: 48, textAlign: 'center', color: P.inkMute }}>Loading certificates...</div>
          ) : certificates.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: P.inkMute }}>No certificates issued yet.</div>
          ) : (
            certificates.map((c, idx) => (
              <motion.div
                key={c._id || c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ backgroundColor: 'rgba(99,102,241,0.02)' }}
                style={{
                  display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1fr',
                  alignItems: 'center', padding: '20px 28px',
                  borderBottom: idx !== certificates.length - 1 ? `1px solid ${P.border}` : 'none',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontWeight: 700, color: P.ink }}>{c.studentEmail}</div>
                <div style={{ color: P.inkSoft, fontWeight: 500 }}>{c.courseTitle}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: P.inkSoft, fontSize: 13, fontWeight: 600 }}>
                  <Calendar size={14} color={P.inkMute} /> 
                  {new Date(c.issueDate).toLocaleDateString()}
                </div>
                <div>
                  {c.certificateUrl ? (
                    <a href={c.certificateUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, color: P.primary, fontWeight: 700, fontSize: 13 }}>
                      View <ExternalLink size={13} />
                    </a>
                  ) : (
                    <span style={{ color: P.inkMute, fontSize: 13 }}>N/A</span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </GlassCard>

      {/* Issue Certificate Modal */}
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
              style={{ backgroundColor: '#fff', padding: '32px', borderRadius: P.radius, width: '100%', maxWidth: '500px', boxShadow: P.shadowHover, border: `1px solid rgba(255,255,255,0.8)` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: P.ink, fontFamily: P.font }}>Issue New Certificate</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'rgba(91,92,255,0.1)', border: 'none', width: 36, height: 36, borderRadius: 10, cursor: 'pointer', color: P.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20}/></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Recipient</label>
                  <select value={form.studentEmail} onChange={e => setForm(prev => ({ ...prev, studentEmail: e.target.value }))} style={inputStyle}>
                    <option value="">-- Select Recipient --</option>
                    {assignableUsers.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Course</label>
                  <select value={form.courseTitle} onChange={e => setForm(prev => ({ ...prev, courseTitle: e.target.value }))} style={inputStyle}>
                    <option value="">-- Select Course --</option>
                    {assignedCourses.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Certificate URL/Link (Optional)</label>
                  <input type="text" placeholder="https://..." value={form.certificateUrl} onChange={e => setForm(prev => ({ ...prev, certificateUrl: e.target.value }))} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: 20, borderTop: `1px solid ${P.border}` }}>
                <GradientButton variant="ghost" onClick={() => setShowModal(false)}>Cancel</GradientButton>
                <GradientButton onClick={handleIssue}>Issue</GradientButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PremiumPage>
  );
}
