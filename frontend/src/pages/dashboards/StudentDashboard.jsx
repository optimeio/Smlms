import { useState, useEffect } from 'react';
import { BookOpen, Video, FileText, Bell, CheckCircle, GraduationCap, ChevronRight, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../../state/useAuth';
import { PremiumPage, PageHeader, GlassCard, PremiumStatCard, GradientButton, Badge, SectionTitle, EmptyState, P } from '../../components/PremiumDesignSystem';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [coursesRes, liveRes] = await Promise.all([
          fetch('/api/courses'),
          fetch(`/api/live-classes?studentId=${user?._id || user?.id || user?.email}`)
        ]);
        const coursesData = await coursesRes.json();
        const liveData = await liveRes.json();
        if (coursesData.success) {
          const matched = coursesData.courses.filter(c => user?.assignedCourses?.includes(c.title));
          setAssignedCourses(matched);
        }
        if (liveData.success) setLiveClasses(liveData.liveClasses);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const stats = [
    { label: 'Enrolled Courses', value: assignedCourses.length.toString(), icon: <BookOpen size={24} />, from: '#5B5CFF', to: '#7C5CFF' },
    { label: "Today's Live Classes", value: liveClasses.length.toString(), icon: <Video size={24} />, from: '#FF5C8A', to: '#FF758C' },
    { label: 'Pending Assignments', value: '0', icon: <FileText size={24} />, from: '#F59E0B', to: '#FFC837' },
    { label: 'Completed Courses', value: '0', icon: <CheckCircle size={24} />, from: '#22C55E', to: '#43E97B' },
    { label: 'Certificates Earned', value: '0', icon: <GraduationCap size={24} />, from: '#4F8CFF', to: '#00C6FF' },
    { label: 'Notifications', value: '1', icon: <Bell size={24} />, from: '#8B5CF6', to: '#A78BFA' },
  ];

  return (
    <PremiumPage>
      <PageHeader title="Student Dashboard" emoji="👋" subtitle="Track your learning progress and stay on top of upcoming classes." />

      {/* Live Class Banner */}
      {liveClasses.length > 0 && (() => {
        const cls = liveClasses[0];
        const classDate = new Date(cls.timing);
        const diffMin = Math.floor((classDate - new Date()) / 60000);
        if (diffMin > -120 && diffMin < 24 * 60) {
          const isLive = diffMin <= 15 && diffMin >= -120;
          return (
            <GlassCard hover={false} style={{ marginBottom: 32, background: isLive ? 'rgba(255,92,138,0.04)' : 'rgba(91,92,255,0.04)', border: `1px solid ${isLive ? 'rgba(255,92,138,0.15)' : P.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: isLive ? 'rgba(255,92,138,0.1)' : 'rgba(91,92,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isLive ? P.red : P.primary }}>
                  <Bell size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: P.ink }}>{isLive ? 'Live Class Starting Now!' : 'Upcoming Live Class Alert'}</h4>
                  <p style={{ margin: '4px 0 0', fontSize: 14, color: P.inkSoft }}>
                    Session for <strong>{cls.courseTitle}</strong> at {classDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <GradientButton variant={isLive ? 'danger' : 'primary'} onClick={() => window.open(cls.externalLink || '#', '_blank')}>
                {isLive ? 'Join Now' : 'View Details'}
              </GradientButton>
            </GlassCard>
          );
        }
        return null;
      })()}

      {/* Stats Grid */}
      <div className="mbk-grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 40 }}>
        {stats.map(s => (
          <PremiumStatCard key={s.label} label={s.label} value={s.value} icon={s.icon} gradientFrom={s.from} gradientTo={s.to} />
        ))}
      </div>

      {/* 3 Column Bottom Grid */}
      <div className="mbk-grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>

        {/* Card 1: Courses */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column' }}>
          <SectionTitle action={<GradientButton variant="ghost" style={{ padding: '6px 12px', fontSize: 12 }}>View All</GradientButton>}>My Courses</SectionTitle>
          {loading ? <p style={{ color: P.inkMute }}>Loading...</p> : assignedCourses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {assignedCourses.slice(0, 3).map((c, i) => (
                <div key={c._id || c.id} style={{
                  display: 'flex', flexDirection: 'column', gap: 12, padding: 16,
                  background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                  borderRadius: P.radiusMd, cursor: 'pointer',
                  border: `1px solid ${P.border}`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02), inset 0 2px 0 rgba(255,255,255,0.8)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative', overflow: 'hidden'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.06), inset 0 2px 0 rgba(255,255,255,1)';
                    e.currentTarget.style.borderColor = P.blue;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02), inset 0 2px 0 rgba(255,255,255,0.8)';
                    e.currentTarget.style.borderColor = P.border;
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: `linear-gradient(to bottom, ${P.blue}, #00C6FF)` }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, rgba(91,92,255,0.1), rgba(0,198,255,0.1))`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: P.blue, flexShrink: 0, border: '1px solid rgba(91,92,255,0.2)' }}>
                      <BookOpen size={22} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: P.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</p>
                      <p style={{ margin: '4px 0 0', fontSize: 13, color: P.inkSoft, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.content || c.description || 'Course materials & lectures'}</p>
                    </div>
                    <div style={{ background: '#f1f5f9', padding: '6px', borderRadius: '50%', color: P.inkSoft }}>
                      <ChevronRight size={18} />
                    </div>
                  </div>
                  
                  {/* Mock Progress Bar */}
                  <div style={{ marginTop: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, fontWeight: 600, color: P.inkMute }}>
                      <span>Course Progress</span>
                      <span style={{ color: P.blue }}>{45 + (i * 15)}%</span>
                    </div>
                    <div style={{ width: '100%', height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${45 + (i * 15)}%`, height: '100%', background: `linear-gradient(90deg, ${P.blue}, #00C6FF)`, borderRadius: 3 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : <EmptyState icon={<BookOpen size={48} />} title="No enrolled courses" subtitle="Browse courses to get started" />}
        </GlassCard>

        {/* Card 2: Upcoming Live Class */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: -60, right: -60, opacity: 0.04 }}><Video size={280} color={P.secondary} /></div>
          <SectionTitle>Upcoming Live Class</SectionTitle>
          {liveClasses.length > 0 ? (() => {
            const cls = liveClasses[0];
            const classDate = new Date(cls.timing);
            const diffMin = Math.floor((classDate - new Date()) / 60000);
            const isLive = diffMin <= 15 && diffMin >= -120;
            const isPast = diffMin < -120;
            const timeStatus = isLive ? 'Started' : isPast ? 'Ended' : `Starts in ${Math.floor(diffMin / 60) > 0 ? Math.floor(diffMin / 60) + 'h ' : ''}${diffMin % 60}m`;

            return (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', zIndex: 1 }}>
                {isLive && <Badge color="#ef4444" bg="#fee2e2"><div style={{ width: 6, height: 6, background: '#ef4444', borderRadius: '50%', animation: 'pulse 2s infinite' }} /> LIVE NOW</Badge>}
                <h4 style={{ margin: '12px 0 0', fontSize: 20, fontWeight: 800, color: P.ink }}>{cls.courseTitle}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                  <Badge color={isLive ? P.green : isPast ? P.inkMute : '#d97706'}>{timeStatus}</Badge>
                  {cls.assignedByRole === 'company' ? (
                    <Badge color="#F59E0B" bg="#fef3c7">Assigned by Company</Badge>
                  ) : (
                    <Badge color={P.blue} bg="rgba(91,92,255,0.1)">Assigned by Admin</Badge>
                  )}
                </div>
                <div style={{ margin: '20px 0', padding: 16, background: '#f8fafc', borderRadius: 12 }}>
                  <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: P.inkSoft }}>Instructor Session</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: P.inkMute, marginBottom: 4 }}><Calendar size={14} /> {classDate.toLocaleDateString()}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: P.inkMute }}><Clock size={14} /> {classDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <GradientButton disabled={isPast} variant={isLive ? 'success' : 'primary'} onClick={() => window.location.href = '/app/a/live'} style={{ width: '100%' }}>
                    {isPast ? 'Session Ended' : isLive ? 'Join Live Class' : 'View Schedule'}
                  </GradientButton>
                </div>
              </div>
            );
          })() : <EmptyState icon={<Video size={48} />} title="No scheduled classes" subtitle="Check back later" />}
        </GlassCard>

        {/* Card 3: Announcements */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column' }}>
          <SectionTitle action={<GradientButton variant="ghost" style={{ padding: '6px 12px', fontSize: 12 }}>View All</GradientButton>}>Recent Announcements</SectionTitle>
          <div style={{ padding: 18, background: '#f8fafc', borderRadius: P.radiusSm, borderLeft: `4px solid ${P.primary}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: P.ink }}>Welcome to MBK LMS</h4>
              <Badge color={P.blue}>TODAY</Badge>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: P.inkSoft, lineHeight: 1.6 }}>
              Check your live classes section for upcoming sessions and new course materials.
            </p>
          </div>
        </GlassCard>
      </div>
      {/* Course Schedules (Full Width) */}
      {assignedCourses.some(c => c.schedule && c.schedule.length > 0) && (
        <GlassCard style={{ marginTop: 24, overflowX: 'auto' }}>
          <SectionTitle>My Live Classes Schedule</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: 16 }}>
            <thead>
              <tr>
                <th style={{ padding: '12px 16px', borderBottom: `2px solid ${P.border}`, color: P.inkMute, fontWeight: 600, fontSize: '13px' }}>Course</th>
                <th style={{ padding: '12px 16px', borderBottom: `2px solid ${P.border}`, color: P.inkMute, fontWeight: 600, fontSize: '13px' }}>Day</th>
                <th style={{ padding: '12px 16px', borderBottom: `2px solid ${P.border}`, color: P.inkMute, fontWeight: 600, fontSize: '13px' }}>Date</th>
                <th style={{ padding: '12px 16px', borderBottom: `2px solid ${P.border}`, color: P.inkMute, fontWeight: 600, fontSize: '13px' }}>Session Timing</th>
                <th style={{ padding: '12px 16px', borderBottom: `2px solid ${P.border}`, color: P.inkMute, fontWeight: 600, fontSize: '13px' }}>Duration</th>
                <th style={{ padding: '12px 16px', borderBottom: `2px solid ${P.border}`, color: P.inkMute, fontWeight: 600, fontSize: '13px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {assignedCourses.flatMap(course => 
                (course.schedule || []).map((session, idx) => {
                  const sessionDate = new Date(session.date);
                  const today = new Date();
                  const isToday = sessionDate.toDateString() === today.toDateString();
                  return (
                    <tr key={`${course._id || course.id}-${idx}`} style={{ 
                      borderBottom: `1px solid ${P.border}`,
                      backgroundColor: isToday ? 'rgba(91,92,255,0.05)' : 'transparent',
                      borderLeft: isToday ? `4px solid ${P.blue}` : '4px solid transparent'
                    }}>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: P.ink, fontWeight: 600 }}>{course.title}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: P.inkSoft, fontWeight: 500 }}>Day {session.dayNumber}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: P.inkSoft }}>
                        {sessionDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        {isToday && <span style={{ marginLeft: 8, fontSize: '11px', color: P.blue, fontWeight: 700, backgroundColor: 'rgba(91,92,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>TODAY</span>}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: P.inkSoft }}>
                        {session.startTime} - {session.endTime}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: P.inkSoft }}>{session.durationHours} Hours</td>
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
                  );
                })
              )}
            </tbody>
          </table>
        </GlassCard>
      )}
    </PremiumPage>
  );
}
