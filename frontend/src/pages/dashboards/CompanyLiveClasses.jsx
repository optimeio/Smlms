import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../state/useAuth';
import { Video, Calendar, Clock, PlusCircle, Users, X, Clock3 } from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, GradientButton, Badge, P } from '../../components/PremiumDesignSystem';

export default function CompanyLiveClasses() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLiveClassModal, setShowLiveClassModal] = useState(false);
  const initialDay = { topicName: '', classDate: '', startTime: '10:00', endTime: '12:00', meetingLink: '' };
  const [scheduleDays, setScheduleDays] = useState([{ ...initialDay }]);
  const [liveClassForm, setLiveClassForm] = useState({ 
    courseTitle: '', trainerEmail: '', studentEmails: []
  });

  const handleAddDay = () => setScheduleDays([...scheduleDays, { ...initialDay }]);
  const handleRemoveDay = (index) => setScheduleDays(scheduleDays.filter((_, i) => i !== index));
  const updateDay = (index, field, value) => {
    const updated = [...scheduleDays];
    updated[index][field] = value;
    setScheduleDays(updated);
  };
  const [toast, setToast] = useState(null);

  const assignedCourses = user?.assignedCourses || [];
  const assignedTrainers = user?.assignedTrainers || [];
  const assignedStudents = user?.assignedStudents || [];

  const fetchLiveClasses = async () => {
    try {
      const res = await fetch('/api/live-classes');
      const data = await res.json();
      if (data.success) {
        // Filter classes scheduled by this company, or for their students
        const companyClasses = data.liveClasses.filter(c => 
          c.trainerId === user?.email || 
          c.studentIds?.some(s => assignedStudents.includes(s)) ||
          assignedCourses.includes(c.courseId)
        );
        setClasses(companyClasses);
      }
    } catch (err) {
      console.error('Failed to fetch live classes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLiveClasses();
      const interval = setInterval(fetchLiveClasses, 3000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const showToastMsg = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleScheduleLiveClass = async () => {
    if (!liveClassForm.courseTitle || !liveClassForm.trainerEmail || liveClassForm.studentEmails.length === 0 || scheduleDays.length === 0) {
      showToastMsg('Please fill Course, Trainer, Students and add at least one day.', 'error');
      return;
    }
    
    let classesToCreate = scheduleDays.map((day, idx) => ({
      courseId: liveClassForm.courseTitle,
      courseTitle: liveClassForm.courseTitle,
      trainerId: liveClassForm.trainerEmail,
      studentIds: liveClassForm.studentEmails,
      timing: `${day.classDate}T${day.startTime}`,
      endTime: day.endTime,
      duration: `${day.startTime} - ${day.endTime}`,
      topicName: day.topicName,
      meetingLink: day.meetingLink,
      status: 'Upcoming',
      assignedByRole: 'company',
      assignerId: user?.email,
      dayNumber: idx + 1
    }));
    
    try {
      const res = await fetch('/api/live-classes/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classes: classesToCreate })
      });
      const data = await res.json();
      if (data.success) {
        showToastMsg(`${scheduleDays.length} Live classes scheduled successfully!`);
        setShowLiveClassModal(false);
        setLiveClassForm({ courseTitle: '', trainerEmail: '', studentEmails: [] });
        setScheduleDays([{ ...initialDay }]);
        fetchLiveClasses();
        // Log activity
        await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actor: user?.companyName || user?.fullName || user?.email,
            action: 'Scheduled Live Class',
            details: `Scheduled "${liveClassForm.courseTitle}" with trainer ${liveClassForm.trainerEmail}`
          })
        });
      } else {
        showToastMsg(data.message || 'Failed to schedule class.', 'error');
      }
    } catch (err) {
      showToastMsg('Server error.', 'error');
    }
  };

  const groupClassesByCourse = (classes) => {
    return classes.reduce((acc, cls) => {
      const key = cls.courseTitle || 'Unknown Course';
      if (!acc[key]) acc[key] = [];
      acc[key].push(cls);
      return acc;
    }, {});
  };

  const adminGrouped = groupClassesByCourse(classes.filter(c => c.assignedByRole !== 'company'));
  const companyGrouped = groupClassesByCourse(classes.filter(c => c.assignedByRole === 'company'));

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
        title="Live Classes"
        subtitle="Schedule and manage live classes for your employees."
        emoji="🎥"
        actions={
          <GradientButton onClick={() => setShowLiveClassModal(true)}>
            <PlusCircle size={16} /> Schedule Live Class
          </GradientButton>
        }
      />

      <GlassCard style={{ padding: 28 }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: P.inkMute }}>Loading live classes...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {Object.keys(adminGrouped).length > 0 && (
              <div>
                <h4 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800, color: P.ink, display: 'flex', alignItems: 'center', gap: 8 }}>
                  Admin Assigned <Badge color={P.blue}>{Object.keys(adminGrouped).length}</Badge>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {Object.entries(adminGrouped).map(([courseName, classesInCourse]) => (
                    <div key={courseName} style={{ background: 'rgba(255,255,255,0.5)', border: `1px solid ${P.border}`, borderRadius: P.radiusSm, overflow: 'hidden' }}>
                      <div style={{ padding: '16px 20px', background: 'rgba(99,102,241,0.05)', borderBottom: `1px solid ${P.border}`, fontWeight: 800, color: P.ink, fontSize: 16 }}>
                        {courseName}
                      </div>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
                          <thead>
                            <tr style={{ background: 'rgba(99,102,241,0.02)', color: P.inkSoft, fontWeight: 700 }}>
                              <th style={{ padding: '12px 20px' }}>Day</th>
                              <th style={{ padding: '12px 20px' }}>Topic</th>
                              <th style={{ padding: '12px 20px' }}>Date</th>
                              <th style={{ padding: '12px 20px' }}>Time</th>
                              <th style={{ padding: '12px 20px' }}>Trainer</th>
                              <th style={{ padding: '12px 20px' }}>Meeting Link</th>
                              <th style={{ padding: '12px 20px' }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {classesInCourse.map((cls, idx) => (
                              <tr key={idx} style={{ borderBottom: `1px solid ${P.border}`, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.03)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                <td style={{ padding: '16px 20px', fontWeight: 600, color: P.ink }}>Day {cls.dayNumber || '-'}</td>
                                <td style={{ padding: '16px 20px', color: P.ink }}>{cls.topicName || '-'}</td>
                                <td style={{ padding: '16px 20px', color: P.inkSoft }}>{new Date(cls.timing).toLocaleDateString()}</td>
                                <td style={{ padding: '16px 20px', color: P.inkSoft }}>{cls.duration}</td>
                                <td style={{ padding: '16px 20px', color: P.inkSoft }}>{cls.trainerName || cls.trainerId || '-'}</td>
                                <td style={{ padding: '16px 20px' }}>
                                  {(cls.meetingLink || cls.externalLink) ? <a href={cls.meetingLink || cls.externalLink} target="_blank" rel="noreferrer" style={{ color: P.primary, textDecoration: 'none', fontWeight: 600 }}>Join Link</a> : '-'}
                                </td>
                                <td style={{ padding: '16px 20px' }}>
                                  <span style={{ padding: '4px 8px', background: cls.status === 'Completed' ? '#dcfce7' : '#f1f5f9', color: cls.status === 'Completed' ? '#166534' : '#475569', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                                    {cls.status || 'Upcoming'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(companyGrouped).length > 0 && (
              <div>
                <h4 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800, color: P.ink, display: 'flex', alignItems: 'center', gap: 8 }}>
                  Company Scheduled <Badge color="#F59E0B" bg="#fef3c7">{Object.keys(companyGrouped).length}</Badge>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {Object.entries(companyGrouped).map(([courseName, classesInCourse]) => (
                    <div key={courseName} style={{ background: 'rgba(255,255,255,0.5)', border: `1px solid ${P.border}`, borderRadius: P.radiusSm, overflow: 'hidden' }}>
                      <div style={{ padding: '16px 20px', background: 'rgba(245,158,11,0.05)', borderBottom: `1px solid ${P.border}`, fontWeight: 800, color: P.ink, fontSize: 16 }}>
                        {courseName}
                      </div>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
                          <thead>
                            <tr style={{ background: 'rgba(245,158,11,0.03)', color: P.inkSoft, fontWeight: 700 }}>
                              <th style={{ padding: '12px 20px' }}>Day</th>
                              <th style={{ padding: '12px 20px' }}>Topic</th>
                              <th style={{ padding: '12px 20px' }}>Date</th>
                              <th style={{ padding: '12px 20px' }}>Time</th>
                              <th style={{ padding: '12px 20px' }}>Trainer</th>
                              <th style={{ padding: '12px 20px' }}>Meeting Link</th>
                              <th style={{ padding: '12px 20px' }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {classesInCourse.map((cls, idx) => (
                              <tr key={idx} style={{ borderBottom: `1px solid ${P.border}`, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.03)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                <td style={{ padding: '16px 20px', fontWeight: 600, color: P.ink }}>Day {cls.dayNumber || '-'}</td>
                                <td style={{ padding: '16px 20px', color: P.ink }}>{cls.topicName || '-'}</td>
                                <td style={{ padding: '16px 20px', color: P.inkSoft }}>{new Date(cls.timing).toLocaleDateString()}</td>
                                <td style={{ padding: '16px 20px', color: P.inkSoft }}>{cls.duration}</td>
                                <td style={{ padding: '16px 20px', color: P.inkSoft }}>{cls.trainerName || cls.trainerId || '-'}</td>
                                <td style={{ padding: '16px 20px' }}>
                                  {(cls.meetingLink || cls.externalLink) ? <a href={cls.meetingLink || cls.externalLink} target="_blank" rel="noreferrer" style={{ color: '#F59E0B', textDecoration: 'none', fontWeight: 600 }}>Join Link</a> : '-'}
                                </td>
                                <td style={{ padding: '16px 20px' }}>
                                  <span style={{ padding: '4px 8px', background: cls.status === 'Completed' ? '#dcfce7' : '#f1f5f9', color: cls.status === 'Completed' ? '#166534' : '#475569', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                                    {cls.status || 'Upcoming'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {classes.length === 0 && (
              <div style={{ padding: '60px 0', textAlign: 'center', color: P.inkMute }}>
                No live classes scheduled yet.
              </div>
            )}
          </div>
        )}
      </GlassCard>

      {/* Schedule Live Class Modal */}
      <AnimatePresence>
        {showLiveClassModal && (
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
                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: P.ink, fontFamily: P.font }}>Schedule Live Class</h3>
                <button onClick={() => setShowLiveClassModal(false)} style={{ background: 'rgba(91,92,255,0.1)', border: 'none', width: 36, height: 36, borderRadius: 10, cursor: 'pointer', color: P.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20}/></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Select Course</label>
                    <select value={liveClassForm.courseTitle} onChange={e => setLiveClassForm(prev => ({ ...prev, courseTitle: e.target.value }))} style={inputStyle}>
                      <option value="">-- Select Course --</option>
                      {assignedCourses.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Select Trainer</label>
                    <select value={liveClassForm.trainerEmail} onChange={e => setLiveClassForm(prev => ({ ...prev, trainerEmail: e.target.value }))} style={inputStyle}>
                      <option value="">-- Select Trainer --</option>
                      {assignedTrainers.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Select Students (Hold Ctrl/Cmd to select multiple)</label>
                  <select multiple value={liveClassForm.studentEmails} onChange={e => {
                    const options = Array.from(e.target.options);
                    const selected = options.filter(o => o.selected).map(o => o.value);
                    setLiveClassForm(prev => ({ ...prev, studentEmails: selected }));
                  }} style={{ ...inputStyle, minHeight: '100px' }}>
                    {assignedStudents.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ ...labelStyle, marginBottom: 0, fontSize: 16, color: P.primary }}>Schedule Builder</label>
                    <GradientButton variant="outline" onClick={handleAddDay} style={{ padding: '6px 12px', fontSize: 13 }}>+ Add Day</GradientButton>
                  </div>
                  
                  {scheduleDays.map((day, idx) => (
                    <div key={idx} style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: `1px solid ${P.border}`, position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span style={{ fontWeight: 800, color: P.ink }}>Day {idx + 1}</span>
                        {scheduleDays.length > 1 && (
                          <button type="button" onClick={() => handleRemoveDay(idx)} style={{ background: 'none', border: 'none', color: P.red, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Remove</button>
                        )}
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12, marginBottom: 12 }}>
                        <div>
                          <label style={{ ...labelStyle, fontSize: 12 }}>Topic Name</label>
                          <input type="text" placeholder="e.g., Introduction to Course" style={{ ...inputStyle, padding: '10px' }} value={day.topicName} onChange={e => updateDay(idx, 'topicName', e.target.value)} required />
                        </div>
                        <div>
                          <label style={{ ...labelStyle, fontSize: 12 }}>Class Date</label>
                          <input type="date" style={{ ...inputStyle, padding: '10px' }} value={day.classDate} onChange={e => updateDay(idx, 'classDate', e.target.value)} required />
                        </div>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: 12 }}>
                        <div>
                          <label style={{ ...labelStyle, fontSize: 12 }}>Start Time</label>
                          <input type="time" style={{ ...inputStyle, padding: '10px' }} value={day.startTime} onChange={e => updateDay(idx, 'startTime', e.target.value)} required />
                        </div>
                        <div>
                          <label style={{ ...labelStyle, fontSize: 12 }}>End Time</label>
                          <input type="time" style={{ ...inputStyle, padding: '10px' }} value={day.endTime} onChange={e => updateDay(idx, 'endTime', e.target.value)} required />
                        </div>
                        <div>
                          <label style={{ ...labelStyle, fontSize: 12 }}>Meeting Link (Optional)</label>
                          <input type="url" placeholder="Zoom/Meet Link" style={{ ...inputStyle, padding: '10px' }} value={day.meetingLink} onChange={e => updateDay(idx, 'meetingLink', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: 20, borderTop: `1px solid ${P.border}` }}>
                <GradientButton variant="ghost" onClick={() => setShowLiveClassModal(false)}>Cancel</GradientButton>
                <GradientButton onClick={handleScheduleLiveClass}>Schedule Class</GradientButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PremiumPage>
  );
}
