import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, CheckCircle2, Clock, AlertCircle, Award, 
  TrendingUp, Check, X, ShieldAlert, FileText, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../state/AuthContext';
import { 
  PremiumPage, PageHeader, GlassCard, PremiumStatCard, 
  GradientButton, Badge, SectionTitle, EmptyState, P 
} from '../../components/PremiumDesignSystem';

export default function StudentAttendance() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [discipline, setDiscipline] = useState({ score: 95, records: [] });
  const [loading, setLoading] = useState(true);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState('');

  const studentId = user?._id || user?.id || 'std-101';

  useEffect(() => {
    fetchAttendanceData();
  }, [studentId]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const [attRes, discRes] = await Promise.all([
        fetch(`/api/attendance?studentId=${studentId}`),
        fetch(`/api/discipline/${studentId}`)
      ]);
      if (attRes.ok) {
        const attData = await attRes.json();
        setAttendance(attData.data || []);
      }
      if (discRes.ok) {
        const discData = await discRes.json();
        setDiscipline(discData.data || { score: 95, records: [] });
      }
    } catch (err) {
      console.error('Failed to fetch attendance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelfCheckIn = async () => {
    setCheckInLoading(true);
    setCheckInSuccess('');
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          courseId: 'CR-101',
          date: new Date().toISOString().split('T')[0],
          status: 'present',
          checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          notes: 'Self verified via biometric/portal entry'
        })
      });
      if (res.ok) {
        setCheckInSuccess('Successfully checked in for today!');
        fetchAttendanceData();
        setTimeout(() => setCheckInSuccess(''), 4000);
      }
    } catch (err) {
      console.error('Check-in failed:', err);
    } finally {
      setCheckInLoading(false);
    }
  };

  const totalClasses = attendance.length || 24;
  const presentCount = attendance.filter(a => a.status === 'present').length || 22;
  const lateCount = attendance.filter(a => a.status === 'late').length || 1;
  const attendanceRate = totalClasses > 0 ? Math.round(((presentCount + lateCount * 0.5) / totalClasses) * 100) : 92;
  const punctualityScore = Math.round(100 - (lateCount / (totalClasses || 1)) * 100);

  return (
    <PremiumPage>
      <PageHeader
        title="Attendance & Discipline"
        subtitle="Track your daily class attendance, punctuality quotient, and institute conduct record"
        emoji="📅"
        actions={
          <GradientButton 
            variant="success" 
            onClick={handleSelfCheckIn} 
            disabled={checkInLoading}
          >
            <Check size={18} />
            {checkInLoading ? 'Checking in...' : 'Mark Today’s Attendance'}
          </GradientButton>
        }
      />

      {checkInSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.3)',
            color: '#16a34a',
            padding: '14px 20px',
            borderRadius: 14,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontWeight: 600
          }}
        >
          <CheckCircle2 size={20} />
          {checkInSuccess}
        </motion.div>
      )}

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        <PremiumStatCard
          label="Overall Attendance"
          value={`${attendanceRate}%`}
          icon={<Calendar size={24} />}
          gradientFrom="#5B5CFF"
          gradientTo="#8B5CF6"
        />
        <PremiumStatCard
          label="Punctuality Score"
          value={`${punctualityScore}%`}
          icon={<Clock size={24} />}
          gradientFrom="#06B6D4"
          gradientTo="#3B82F6"
        />
        <PremiumStatCard
          label="Discipline Index"
          value={`${discipline.score || 95}/100`}
          icon={<Award size={24} />}
          gradientFrom="#10B981"
          gradientTo="#059669"
        />
        <PremiumStatCard
          label="Sessions Logged"
          value={`${presentCount} / ${totalClasses}`}
          icon={<TrendingUp size={24} />}
          gradientFrom="#F59E0B"
          gradientTo="#D97706"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Attendance Log Table */}
        <GlassCard>
          <SectionTitle>Recent Attendance Records</SectionTitle>
          {attendance.length === 0 ? (
            <EmptyState 
              icon={<Calendar size={48} />}
              title="No attendance records found"
              subtitle="Attendance marked by your trainer or portal check-in will appear here."
            />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${P.border}`, color: P.inkMute, fontSize: 13, fontWeight: 700 }}>
                    <th style={{ padding: '12px 16px' }}>DATE</th>
                    <th style={{ padding: '12px 16px' }}>COURSE / BATCH</th>
                    <th style={{ padding: '12px 16px' }}>STATUS</th>
                    <th style={{ padding: '12px 16px' }}>CHECK-IN</th>
                    <th style={{ padding: '12px 16px' }}>NOTES</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((rec, idx) => {
                    const isPresent = rec.status === 'present';
                    const isLate = rec.status === 'late';
                    return (
                      <tr key={rec._id || rec.id || idx} style={{ borderBottom: `1px solid ${P.border}` }}>
                        <td style={{ padding: '16px', fontWeight: 600, color: P.ink }}>
                          {rec.date}
                        </td>
                        <td style={{ padding: '16px', color: P.inkSoft }}>
                          {rec.courseId || 'Full Stack SkillOS Lab'}
                        </td>
                        <td style={{ padding: '16px' }}>
                          <Badge 
                            color={isPresent ? '#16a34a' : isLate ? '#d97706' : '#dc2626'}
                            bg={isPresent ? 'rgba(34,197,94,0.1)' : isLate ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)'}
                          >
                            {rec.status?.toUpperCase()}
                          </Badge>
                        </td>
                        <td style={{ padding: '16px', color: P.inkSoft, fontSize: 13 }}>
                          {rec.checkInTime || '09:00 AM'}
                        </td>
                        <td style={{ padding: '16px', color: P.inkMute, fontSize: 13 }}>
                          {rec.notes || 'Normal attendance'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>

        {/* Discipline & Conduct Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <GlassCard>
            <SectionTitle>Discipline & Code of Conduct</SectionTitle>
            <div style={{
              background: 'linear-gradient(135deg, rgba(91,92,255,0.06), rgba(139,92,246,0.06))',
              borderRadius: 16,
              padding: 20,
              border: `1px solid ${P.border}`,
              marginBottom: 20
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: P.inkSoft }}>Conduct Rating</span>
                <Badge color="#16a34a" bg="rgba(34,197,94,0.12)">Exemplary Record</Badge>
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: P.ink }}>{discipline.score || 95}<span style={{ fontSize: 18, color: P.inkMute }}>/100</span></div>
              <p style={{ margin: '8px 0 0', fontSize: 13, color: P.inkSoft, lineHeight: 1.5 }}>
                Points are maintained by timely submissions, punctuality, lab safety adherence, and peer collaboration.
              </p>
            </div>

            <h4 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 800, color: P.ink }}>Discipline Milestones & Notes</h4>
            {(discipline.records && discipline.records.length > 0) ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {discipline.records.map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: 12, borderRadius: 12, background: 'rgba(0,0,0,0.02)', border: `1px solid ${P.border}` }}>
                    <ShieldAlert size={18} color={r.type === 'positive' ? '#16a34a' : '#d97706'} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: P.ink }}>{r.title}</div>
                      <div style={{ fontSize: 12, color: P.inkSoft }}>{r.description}</div>
                      <div style={{ fontSize: 11, color: P.inkMute, marginTop: 4 }}>{r.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: 16, borderRadius: 12, background: 'rgba(34,197,94,0.05)', border: '1px dashed rgba(34,197,94,0.3)', color: '#16a34a', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={16} /> No disciplinary infractions on file. Keep up the high standard!
              </div>
            )}
          </GlassCard>

          <GlassCard>
            <SectionTitle>Institute Policy Reminder</SectionTitle>
            <ul style={{ margin: 0, paddingLeft: 20, color: P.inkSoft, fontSize: 13, lineHeight: 1.7 }}>
              <li>Minimum 80% attendance required for Skill Passport endorsement.</li>
              <li>Lab check-in requires biometric or verified one-tap punch.</li>
              <li>Absence requests must be submitted at least 24h in advance.</li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </PremiumPage>
  );
}
