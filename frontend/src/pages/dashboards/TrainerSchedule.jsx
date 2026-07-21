import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../state/useAuth';
import { Calendar, Clock, Video, Copy, ExternalLink } from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, GradientButton, Badge, P } from '../../components/PremiumDesignSystem';

export default function TrainerSchedule() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (data.success) {
          const myCourses = data.courses.filter(c => user.assignedCourses?.includes(c._id || c.id) || false);
          setCourses(myCourses);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  // Generate some mock schedule based on assigned courses
  const scheduleItems = courses.map((course, idx) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = ['10:00 AM - 11:30 AM', '02:00 PM - 03:30 PM', '04:00 PM - 05:30 PM'];
    return {
      ...course,
      day: days[idx % days.length],
      time: times[idx % times.length],
    };
  });

  const dayColors = {
    Monday: { from: '#6366F1', to: '#8B5CF6' },
    Tuesday: { from: '#3B82F6', to: '#06B6D4' },
    Wednesday: { from: '#22C55E', to: '#10B981' },
    Thursday: { from: '#F59E0B', to: '#F97316' },
    Friday: { from: '#EF4444', to: '#F43F5E' },
  };

  return (
    <PremiumPage>
      <PageHeader
        title="My Schedule"
        subtitle="View your assigned live classes schedule."
        emoji="📅"
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: P.inkMute }}>Loading schedule...</div>
      ) : (
        <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
          {/* Table Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '140px 1fr 220px 150px',
            background: 'rgba(99,102,241,0.03)', padding: '18px 28px',
            borderBottom: `1px solid ${P.border}`,
          }}>
            {['Day', 'Course', 'Time', 'Action'].map(h => (
              <div key={h} style={{
                fontWeight: 800, fontSize: 12, color: P.inkMute,
                textTransform: 'uppercase', letterSpacing: '0.8px',
                textAlign: h === 'Action' ? 'right' : 'left',
              }}>
                {h}
              </div>
            ))}
          </div>

          {/* Table Body */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {scheduleItems.map((item, idx) => {
              const colors = dayColors[item.day] || dayColors.Monday;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(99,102,241,0.02)' }}
                  style={{
                    display: 'grid', gridTemplateColumns: '140px 1fr 220px 150px',
                    alignItems: 'center', padding: '20px 28px',
                    borderBottom: idx !== scheduleItems.length - 1 ? `1px solid ${P.border}` : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {/* Day */}
                  <div>
                    <Badge color={colors.from} bg={`${colors.from}12`}>
                      {item.day}
                    </Badge>
                  </div>

                  {/* Course */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 14,
                      background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                      flexShrink: 0,
                    }}>
                      <Video size={20} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, color: P.ink, fontSize: 15, fontWeight: 700 }}>{item.title}</h4>
                      <span style={{ fontSize: 12, color: P.inkMute, fontWeight: 500 }}>{item.level}</span>
                    </div>
                  </div>

                  {/* Time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: P.inkSoft, fontSize: 14, fontWeight: 600 }}>
                    <Clock size={16} color={P.inkMute} /> {item.time}
                  </div>

                  {/* Action */}
                  <div style={{ textAlign: 'right' }}>
                    <GradientButton variant="ghost" style={{ padding: '8px 16px' }}>
                      <Copy size={14} /> Copy Link
                    </GradientButton>
                  </div>
                </motion.div>
              );
            })}
            {scheduleItems.length === 0 && (
              <div style={{ padding: 60, textAlign: 'center', color: P.inkMute, fontSize: 14 }}>
                No scheduled classes assigned by Admin.
              </div>
            )}
          </div>
        </GlassCard>
      )}
    </PremiumPage>
  );
}
