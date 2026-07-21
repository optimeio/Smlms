import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Calendar, Clock, PlusCircle, Users, PlayCircle, MoreVertical, Settings, CalendarDays, ExternalLink } from 'lucide-react';
import { 
  AdminPage, 
  AdminPageHeader, 
  EnterpriseCard, 
  AdminButton, 
  AdminBadge,
  A 
} from '../../components/AdminDesignSystem';
import { useAuth } from '../../state/useAuth';

const stats = [
  { label: 'Upcoming Sessions', value: '24', icon: <CalendarDays size={20} />, change: 'Next 7 days' },
  { label: 'Total Hours Delivered', value: '1,420', icon: <Clock size={20} />, change: '+120 this month' },
  { label: 'Avg. Attendance', value: '86%', icon: <Users size={20} />, change: '+4% overall' },
  { label: 'Active Trainers', value: '42', icon: <Video size={20} />, change: 'Hosting sessions' },
];

export default function AdminLiveClasses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [students, setStudents] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [courseId, setCourseId] = useState('');
  const [trainerId, setTrainerId] = useState('');
  const [studentIds, setStudentIds] = useState([]); 
  
  const initialDay = { topicName: '', classDate: '', startTime: '10:00', endTime: '12:00', meetingLink: '' };
  const [scheduleDays, setScheduleDays] = useState([{ ...initialDay }]);
  const [assigning, setAssigning] = useState(false);

  const handleAddDay = () => setScheduleDays([...scheduleDays, { ...initialDay }]);
  const handleRemoveDay = (index) => setScheduleDays(scheduleDays.filter((_, i) => i !== index));
  const updateDay = (index, field, value) => {
    const updated = [...scheduleDays];
    updated[index][field] = value;
    setScheduleDays(updated);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, trainersRes, studentsRes, liveRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/users?role=trainer'),
        fetch('/api/users?role=student'),
        fetch('/api/live-classes')
      ]);

      const [coursesData, trainersData, studentsData, liveData] = await Promise.all([
        coursesRes.json(),
        trainersRes.json(),
        studentsRes.json(),
        liveRes.json()
      ]);

      if (coursesData.success) setCourses(coursesData.courses);
      if (trainersData.success) setTrainers(trainersData.users || []);
      if (studentsData.success) setStudents(studentsData.users || []);
      if (liveData.success) setLiveClasses(liveData.liveClasses);
    } catch (err) {
      console.error('Failed to fetch admin live class data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentToggle = (studentId) => {
    if (studentIds.includes(studentId)) {
      setStudentIds(studentIds.filter(id => id !== studentId));
    } else {
      setStudentIds([...studentIds, studentId]);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!courseId || !trainerId || studentIds.length === 0 || scheduleDays.length === 0) {
      alert("Please fill Course, Trainer, Students and add at least one day.");
      return;
    }

    setAssigning(true);
    const selectedCourse = courses.find(c => (c._id || c.id || c.title) === courseId);
    const selectedTrainer = trainers.find(t => (t._id || t.id || t.email) === trainerId);
    const trainerName = selectedTrainer ? (selectedTrainer.fullName || selectedTrainer.email) : trainerId;
    
    let classesToCreate = scheduleDays.map((day, idx) => ({
      courseId,
      courseTitle: selectedCourse?.title,
      trainerId,
      trainerName, 
      studentIds,
      timing: `${day.classDate}T${day.startTime}`,
      endTime: day.endTime,
      duration: `${day.startTime} - ${day.endTime}`,
      topicName: day.topicName,
      meetingLink: day.meetingLink,
      status: 'Upcoming',
      assignedByRole: 'admin',
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
        alert(`${scheduleDays.length} Live classes generated successfully!`);
        setCourseId('');
        setTrainerId('');
        setStudentIds([]);
        setScheduleDays([{ ...initialDay }]);
        fetchData();
      } else {
        alert(data.message || "Failed to generate schedule.");
      }
    } catch (err) {
      alert("Error generating schedule.");
    } finally {
      setAssigning(false);
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

  const adminGrouped = groupClassesByCourse(liveClasses.filter(c => c.assignedByRole !== 'company'));
  const companyGrouped = groupClassesByCourse(liveClasses.filter(c => c.assignedByRole === 'company'));

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: A.radiusSm, border: `1px solid ${A.border}`, fontSize: 14, color: A.ink, boxSizing: 'border-box', background: A.surface, fontFamily: A.font, outline: 'none', transition: 'border-color 0.2s' };
  const labelStyle = { display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: A.inkSoft };

  return (
    <AdminPage>
      <AdminPageHeader 
        title="Live Classes Management" 
        subtitle="Schedule sessions, track attendance, and oversee real-time virtual classrooms."
        emoji="🎥"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 40 }}>
        {stats.map((stat) => (
          <EnterpriseCard key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EFF6FF', color: A.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 13, color: A.inkSoft, fontWeight: 600 }}>{stat.label}</p>
              <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: A.ink, fontFamily: A.font }}>{stat.value}</h3>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: A.green, fontWeight: 600 }}>{stat.change}</p>
            </div>
          </EnterpriseCard>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* ASSIGN FORM */}
        <EnterpriseCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#ECFDF5', color: A.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PlusCircle size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: A.ink, fontFamily: A.font }}>Schedule Class</h3>
          </div>

          <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={labelStyle}>Course</label>
              <select style={inputStyle} value={courseId} onChange={e => setCourseId(e.target.value)} required>
                <option value="">-- Select a Course --</option>
                {courses.map(c => (
                  <option key={c._id || c.id || c.title} value={c._id || c.id || c.title}>{c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Trainer</label>
              <select style={inputStyle} value={trainerId} onChange={e => setTrainerId(e.target.value)} required>
                <option value="">-- Select a Trainer --</option>
                {trainers.map(t => (
                  <option key={t._id || t.id || t.email} value={t._id || t.id || t.email}>{t.fullName || t.email}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Students / Batch</label>
              <div style={{ ...inputStyle, maxHeight: 180, overflowY: 'auto', background: A.surface, padding: '8px 12px' }}>
                {students.map(s => (
                  <label key={s._id || s.id || s.email} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px', cursor: 'pointer', borderRadius: 8, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = A.bg} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <input 
                      type="checkbox" 
                      style={{ width: 16, height: 16, accentColor: A.primary }}
                      checked={studentIds.includes(s._id || s.id || s.email)} 
                      onChange={() => handleStudentToggle(s._id || s.id || s.email)}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: A.ink }}>{s.fullName || 'Unknown Student'}</span>
                      <span style={{ fontSize: 12, color: A.inkMute }}>{s.email}</span>
                    </div>
                  </label>
                ))}
                {students.length === 0 && <span style={{ fontSize: 13, color: A.inkMute, padding: 8 }}>No students available</span>}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ ...labelStyle, marginBottom: 0, fontSize: 16, color: A.primary }}>Schedule Builder</label>
                <AdminButton type="button" variant="outline" onClick={handleAddDay} style={{ padding: '6px 12px', fontSize: 13 }}>+ Add Day</AdminButton>
              </div>
              
              {scheduleDays.map((day, idx) => (
                <div key={idx} style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: `1px solid ${A.border}`, position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontWeight: 800, color: A.ink }}>Day {idx + 1}</span>
                    {scheduleDays.length > 1 && (
                      <button type="button" onClick={() => handleRemoveDay(idx)} style={{ background: 'none', border: 'none', color: A.red, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Remove</button>
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

            <AdminButton variant="blue" type="submit" disabled={assigning} style={{ marginTop: 8, width: '100%', padding: '14px 0' }}>
              {assigning ? 'Saving Schedule...' : 'Save Schedule'}
            </AdminButton>
          </form>
        </EnterpriseCard>

        {/* SCHEDULED CLASSES LIST */}
        <EnterpriseCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#EFF6FF', color: A.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarDays size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: A.ink, fontFamily: A.font }}>Scheduled Sessions</h3>
            </div>
            <AdminButton variant="ghost" icon={<ExternalLink size={16} />}>View Calendar</AdminButton>
          </div>
          
          {loading ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: A.inkMute }}>Loading schedule...</div>
          ) : liveClasses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: A.inkMute, background: A.bg, borderRadius: A.radiusSm, border: `1px dashed ${A.border}` }}>
              <Video size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
              <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: A.inkSoft }}>No live classes assigned yet.</p>
              <p style={{ margin: '4px 0 0', fontSize: 13 }}>Use the form to schedule a new session.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {Object.keys(adminGrouped).length > 0 && (
                <div>
                  <h4 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800, color: A.ink, display: 'flex', alignItems: 'center', gap: 8 }}>
                    Admin Scheduled Courses <span style={{ background: A.primary, color: '#fff', padding: '2px 8px', borderRadius: 12, fontSize: 12 }}>{Object.keys(adminGrouped).length}</span>
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {Object.entries(adminGrouped).map(([courseName, classesInCourse]) => (
                      <div key={courseName} style={{ background: A.surface, border: `1px solid ${A.border}`, borderRadius: A.radiusSm, overflow: 'hidden' }}>
                        <div style={{ padding: '16px 20px', background: A.bg, borderBottom: `1px solid ${A.border}`, fontWeight: 800, color: A.ink, fontSize: 16 }}>
                          {courseName}
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
                            <thead>
                              <tr style={{ background: 'rgba(59,130,246,0.05)', color: A.inkSoft, fontWeight: 700 }}>
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
                                <tr key={idx} style={{ borderBottom: `1px solid ${A.border}`, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                  <td style={{ padding: '16px 20px', fontWeight: 600, color: A.ink }}>Day {cls.dayNumber || '-'}</td>
                                  <td style={{ padding: '16px 20px', color: A.ink }}>{cls.topicName || '-'}</td>
                                  <td style={{ padding: '16px 20px', color: A.inkSoft }}>{new Date(cls.timing).toLocaleDateString()}</td>
                                  <td style={{ padding: '16px 20px', color: A.inkSoft }}>{cls.duration}</td>
                                  <td style={{ padding: '16px 20px', color: A.inkSoft }}>{cls.trainerName || cls.trainerId || '-'}</td>
                                  <td style={{ padding: '16px 20px' }}>
                                    {(cls.meetingLink || cls.externalLink) ? <a href={cls.meetingLink || cls.externalLink} target="_blank" rel="noreferrer" style={{ color: A.primary, textDecoration: 'none', fontWeight: 600 }}>Join Link</a> : '-'}
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
                <div style={{ marginTop: 24 }}>
                  <h4 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800, color: A.ink, display: 'flex', alignItems: 'center', gap: 8 }}>
                    Company Scheduled Courses <span style={{ background: '#F59E0B', color: '#fff', padding: '2px 8px', borderRadius: 12, fontSize: 12 }}>{Object.keys(companyGrouped).length}</span>
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {Object.entries(companyGrouped).map(([courseName, classesInCourse]) => (
                      <div key={courseName} style={{ background: A.surface, border: `1px solid ${A.border}`, borderRadius: A.radiusSm, overflow: 'hidden' }}>
                        <div style={{ padding: '16px 20px', background: 'rgba(245,158,11,0.05)', borderBottom: `1px solid ${A.border}`, fontWeight: 800, color: A.ink, fontSize: 16 }}>
                          {courseName}
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
                            <thead>
                              <tr style={{ background: 'rgba(245,158,11,0.03)', color: A.inkSoft, fontWeight: 700 }}>
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
                                <tr key={idx} style={{ borderBottom: `1px solid ${A.border}`, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                  <td style={{ padding: '16px 20px', fontWeight: 600, color: A.ink }}>Day {cls.dayNumber || '-'}</td>
                                  <td style={{ padding: '16px 20px', color: A.ink }}>{cls.topicName || '-'}</td>
                                  <td style={{ padding: '16px 20px', color: A.inkSoft }}>{new Date(cls.timing).toLocaleDateString()}</td>
                                  <td style={{ padding: '16px 20px', color: A.inkSoft }}>{cls.duration}</td>
                                  <td style={{ padding: '16px 20px', color: A.inkSoft }}>{cls.trainerName || cls.trainerId || '-'}</td>
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
            </div>
          )}
        </EnterpriseCard>
      </div>
    </AdminPage>
  );
}
