import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Layers, ClipboardList, Calendar, CheckCircle, Star, Video, ArrowUpRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../state/useAuth';
import { PremiumPage, PageHeader, GlassCard, GradientButton, Badge, PremiumStatCard, SectionTitle, P } from '../../components/PremiumDesignSystem';

export default function TrainerDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [liveClasses, setLiveClasses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, studentsRes, liveRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/users?role=student'),
          fetch(`/api/live-classes?trainerId=${user?._id || user?.id || user?.email}`)
        ]);
        const courseData = await courseRes.json();
        const studentData = await studentsRes.json();
        const liveData = await liveRes.json();

        if (courseData.success) {
          const myCourses = courseData.courses.filter(c => user.assignedCourses?.includes(c._id || c.id) || false);
          setCourses(myCourses);
        }
        if (studentData.success) {
          setStudentsCount(studentData.users.length);
        }
      } catch (err) {
        console.error('Failed to fetch trainer data', err);
      }
    };
    fetchData();
  }, [user]);

  const stats = [
    { label: 'Assigned Courses', value: courses.length.toString(), icon: <BookOpen size={22} />, gradientFrom: '#6366F1', gradientTo: '#8B5CF6' },
    { label: 'Total Students', value: studentsCount.toString(), icon: <Users size={22} />, gradientFrom: '#3B82F6', gradientTo: '#06B6D4' },
    { label: 'Active Batches', value: '1', icon: <Layers size={22} />, gradientFrom: '#22C55E', gradientTo: '#10B981' },
    { label: 'Pending Assignments', value: '0', icon: <ClipboardList size={22} />, gradientFrom: '#F59E0B', gradientTo: '#F97316' }
  ];

  return (
    <PremiumPage>
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)',
          borderRadius: 24,
          padding: '36px 40px',
          marginBottom: 32,
          position: 'relative',
          overflow: 'hidden',
          color: '#fff',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -60, right: -40, width: 200, height: 200, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -30, right: 80, width: 120, height: 120, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: 20, right: 200, width: 60, height: 60, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Sparkles size={20} style={{ opacity: 0.8 }} />
              <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.9, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Trainer Dashboard</span>
            </div>
            <h1 style={{ margin: '0 0 10px', fontSize: 32, fontWeight: 900, letterSpacing: '-0.5px', fontFamily: P.font }}>
              Welcome back, {user?.fullName?.split(' ')[0] || 'Trainer'}! 👋
            </h1>
            <p style={{ margin: 0, fontSize: 15, opacity: 0.85, lineHeight: 1.6, maxWidth: 500 }}>
              Manage your courses, track student progress, and review assignments.
            </p>
          </div>
          <GradientButton
            onClick={() => {}}
            style={{
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}
          >
            + New Course
          </GradientButton>
        </div>
      </motion.div>

      {/* Statistics */}
      <div className="mbk-grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
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

      {/* Two-column layout */}
      <div className="mbk-grid-responsive" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Scheduled Classes */}
        <GlassCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Calendar size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: P.ink, fontFamily: P.font }}>Scheduled Classes</h3>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {liveClasses.slice(0, 3).map((cls, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 4 }}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 16, background: 'rgba(99,102,241,0.03)', borderRadius: 14,
                  border: `1px solid ${P.border}`, transition: 'all 0.2s',
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: P.ink, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {cls.courseTitle}
                    {cls.assignedByRole === 'company' ? (
                      <span style={{ fontSize: 10, background: '#fef3c7', color: '#F59E0B', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>COMPANY</span>
                    ) : (
                      <span style={{ fontSize: 10, background: 'rgba(91,92,255,0.1)', color: P.blue, padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>ADMIN</span>
                    )}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: P.inkMute }}>{new Date(cls.timing).toLocaleString()} • {cls.duration}</p>
                </div>
                <GradientButton variant="ghost" onClick={() => window.open(cls.externalLink || 'https://meet.google.com/eup-rgcq-ing', '_blank')} style={{ padding: '8px 16px' }}>
                  <Video size={14} /> Start Class
                </GradientButton>
              </motion.div>
            ))}
            {liveClasses.length === 0 && (
              <div style={{ padding: 32, textAlign: 'center', color: P.inkMute, fontSize: 14 }}>
                No classes scheduled.
              </div>
            )}
          </div>
        </GlassCard>

        {/* Recent Submissions */}
        <GlassCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, background: 'linear-gradient(135deg, #F59E0B, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <ClipboardList size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: P.ink, fontFamily: P.font }}>Recent Submissions</h3>
            </div>
            <Badge color={P.orange} bg="rgba(245,158,11,0.1)">12 Pending</Badge>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 32, textAlign: 'center', color: P.inkMute, fontSize: 14 }}>
              No submissions yet.
            </div>
          </div>
          <GradientButton variant="outline" style={{ width: '100%', borderStyle: 'dashed', marginTop: 8 }}>
            View All Submissions
          </GradientButton>
        </GlassCard>
      </div>

      <div className="mbk-grid-responsive" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Student Feedback */}
        <GlassCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 42, height: 42, borderRadius: 14, background: 'linear-gradient(135deg, #22C55E, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Star size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: P.ink, fontFamily: P.font }}>Student Feedback</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { name: 'Anonymous Student', rating: '★★★★★', comment: '"Excellent explanation of complex concepts. The interactive labs really helped."' },
              { name: 'Anonymous Student', rating: '★★★★☆', comment: '"Great session! Would love some more practical examples on hooks."' }
            ].map((fb, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.01 }}
                style={{
                  padding: 16, background: 'rgba(34,197,94,0.03)', borderRadius: 14,
                  border: `1px solid ${P.border}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: P.ink }}>{fb.name}</span>
                  <span style={{ color: '#fbbf24', fontSize: 13, letterSpacing: 2 }}>{fb.rating}</span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: P.inkSoft, fontStyle: 'italic', lineHeight: 1.6 }}>{fb.comment}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 42, height: 42, borderRadius: 14, background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <CheckCircle size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: P.ink, fontFamily: P.font }}>Quick Actions</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { label: 'Create Quiz', emoji: '📝', color: '#6366F1' },
              { label: 'Upload Material', emoji: '📁', color: '#3B82F6' },
              { label: 'Mark Attendance', emoji: '✅', color: '#22C55E' },
            ].map((action) => (
              <motion.button
                key={action.label}
                whileHover={{ y: -3, boxShadow: P.shadowHover }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: 20,
                  background: 'rgba(255,255,255,0.8)',
                  border: `1px solid ${P.border}`,
                  borderRadius: 16,
                  fontWeight: 700,
                  color: P.ink,
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontSize: 14,
                  fontFamily: P.font,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: 28 }}>{action.emoji}</span>
                {action.label}
              </motion.button>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Course Schedules (Full Width) */}
      {courses.some(c => c.schedule && c.schedule.length > 0) && (
        <GlassCard style={{ marginTop: 24, overflowX: 'auto' }}>
          <SectionTitle>My Assigned Courses Schedule</SectionTitle>
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
              {courses.flatMap(course => 
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
