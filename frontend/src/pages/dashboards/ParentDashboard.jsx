import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, User, Award, Calendar, CheckCircle2, Star, 
  ShieldCheck, ArrowUpRight, MessageSquare, BookOpen, Clock 
} from 'lucide-react';
import { useAuth } from '../../state/AuthContext';
import { 
  PremiumPage, PageHeader, GlassCard, PremiumStatCard, 
  GradientButton, Badge, SectionTitle, P 
} from '../../components/PremiumDesignSystem';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [wardData, setWardData] = useState({
    name: 'Tharani S',
    studentId: 'std-101',
    cohort: 'Batch 2026 Full Stack Cloud Engineering',
    institute: 'MBK Skill Center of Excellence',
    attendanceRate: 94,
    spiScore: 885,
    disciplineScore: 98,
    status: 'Industry Ready (Level 4)',
    recentMilestones: [
      { title: 'Passed Full Stack Capstone Defense', date: 'Sept 08, 2026', badge: 'Certified Full-Stack Builder' },
      { title: 'Completed Cloud Architecture Assessment', date: 'Aug 28, 2026', badge: 'Cloud Master' },
      { title: '100% Punctuality for August Month', date: 'Aug 31, 2026', badge: 'Punctuality Honor' }
    ],
    trainerNotes: [
      { trainer: 'Dr. Sarah Jenkins', date: 'Sept 09, 2026', note: 'Tharani has demonstrated exceptional problem-solving in distributed microservices.' },
      { trainer: 'Eng. Marcus Vance', date: 'Aug 20, 2026', note: 'Consistent engagement and proactive teamwork during lab practicals.' }
    ]
  });

  return (
    <PremiumPage>
      <PageHeader
        title="Parent & Guardian Observatory"
        subtitle="Transparent visibility into your ward’s skill progression, attendance, and career milestones"
        emoji="👨‍👩‍👧"
        actions={
          <GradientButton onClick={() => window.open('/app/a/passport', '_blank')}>
            <ShieldCheck size={18} /> View Ward’s Skill Passport
          </GradientButton>
        }
      />

      {/* Ward Info Card */}
      <GlassCard style={{ marginBottom: 32, padding: 28, background: 'linear-gradient(135deg, rgba(91,92,255,0.06), rgba(236,72,153,0.04))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 20,
              background: 'linear-gradient(135deg, #5B5CFF, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontWeight: 800, color: '#fff'
            }}>
              {wardData.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: P.ink }}>{wardData.name}</h2>
                <Badge color="#16a34a" bg="rgba(34,197,94,0.12)">● {wardData.status}</Badge>
              </div>
              <div style={{ fontSize: 14, color: P.inkSoft, marginTop: 4 }}>
                {wardData.cohort} • <b>{wardData.institute}</b>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: P.inkMute, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Skill Performance Index</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: P.primary }}>{wardData.spiScore} <span style={{ fontSize: 16, color: P.inkMute }}>/ 1000</span></div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        <PremiumStatCard
          label="Attendance Quotient"
          value={`${wardData.attendanceRate}%`}
          icon={<Calendar size={24} />}
          gradientFrom="#10B981"
          gradientTo="#059669"
        />
        <PremiumStatCard
          label="Skill Readiness"
          value="Level 4"
          icon={<Award size={24} />}
          gradientFrom="#5B5CFF"
          gradientTo="#8B5CF6"
        />
        <PremiumStatCard
          label="Discipline Index"
          value={`${wardData.disciplineScore}/100`}
          icon={<ShieldCheck size={24} />}
          gradientFrom="#06B6D4"
          gradientTo="#3B82F6"
        />
        <PremiumStatCard
          label="Certifications Earned"
          value="6 Verified"
          icon={<Star size={24} />}
          gradientFrom="#F59E0B"
          gradientTo="#D97706"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 28, alignItems: 'start' }}>
        {/* Recent Milestones */}
        <GlassCard>
          <SectionTitle>Academic & Skill Milestones Achieved</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {wardData.recentMilestones.map((m, idx) => (
              <div key={idx} style={{ padding: 16, borderRadius: 14, background: 'rgba(0,0,0,0.02)', border: `1px solid ${P.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ padding: 10, borderRadius: 10, background: 'rgba(91,92,255,0.08)', color: P.primary }}>
                    <Award size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: P.ink }}>{m.title}</div>
                    <div style={{ fontSize: 12, color: P.inkMute, marginTop: 2 }}>{m.date}</div>
                  </div>
                </div>
                <Badge color="#5B5CFF" bg="rgba(91,92,255,0.1)">
                  {m.badge}
                </Badge>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Trainer Remarks */}
        <GlassCard>
          <SectionTitle>Trainer & Faculty Notes</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {wardData.trainerNotes.map((note, i) => (
              <div key={i} style={{ padding: 16, borderRadius: 14, background: 'rgba(91,92,255,0.03)', border: `1px solid ${P.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: P.ink }}>{note.trainer}</span>
                  <span style={{ fontSize: 11, color: P.inkMute }}>{note.date}</span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: P.inkSoft, lineHeight: 1.5 }}>
                  "{note.note}"
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </PremiumPage>
  );
}
