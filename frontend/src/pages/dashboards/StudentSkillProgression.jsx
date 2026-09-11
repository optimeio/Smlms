import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../state/useAuth';
import { 
  Zap, Award, TrendingUp, Trophy, Star, ShieldCheck, CheckCircle2, 
  Layers, ArrowRight, Sparkles, BookOpen, Clock, Target, Cpu 
} from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, StatCard, Badge, GradientButton, ProgressBar, EmptyState, TabPillGroup, P } from '../../components/PremiumDesignSystem';

export default function StudentSkillProgression() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('skills'); // 'skills' | 'leaderboard' | 'badges'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const studentId = user?._id || user?.id || user?.email;
        const [skillsRes, progRes, leadRes] = await Promise.all([
          fetch('/api/skills'),
          fetch(`/api/skills/progress/${encodeURIComponent(studentId)}`),
          fetch('/api/skills/leaderboard')
        ]);
        
        const skillsData = skillsRes.ok ? await skillsRes.json() : { success: false, skills: [] };
        const progData = progRes.ok ? await progRes.json() : { success: false, progress: [] };
        const leadData = leadRes.ok ? await leadRes.json() : { success: false, leaderboard: [] };

        if (skillsData.success) setSkills(skillsData.skills || []);
        if (progData.success) setProgressList(progData.progress || []);
        if (leadData.success) setLeaderboard(leadData.leaderboard || []);
      } catch (err) {
        console.error('Failed to load skill progression:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const totalPoints = progressList.reduce((acc, p) => acc + (p.points || 0), 1250);
  const avgPerfIndex = progressList.length > 0 ? Math.round(progressList.reduce((acc, p) => acc + (p.performanceIndex || 85), 0) / progressList.length) : 88;
  const totalBadgesCount = progressList.reduce((acc, p) => acc + (p.badges?.length || 0), 4);

  const getLevelColor = (level) => {
    switch (level) {
      case 'Industry Ready': return '#10B981';
      case 'Advanced': return '#6366F1';
      case 'Intermediate': return '#F59E0B';
      default: return '#3B82F6';
    }
  };

  return (
    <PremiumPage>
      <PageHeader 
        badge="SkillOS Progression Matrix"
        title={
          <span>
            Mastery & <span style={{ background: 'linear-gradient(135deg, #FF6B00, #FF9F43)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Skill Levels</span>
          </span>
        }
        subtitle="Track your technical progression from Beginner to Industry Ready with real-time competency evaluations."
      />

      {/* Stats Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard 
          title="Performance Index" 
          value={`${avgPerfIndex}%`} 
          subtitle="Top 15% across cohorts" 
          icon={<TrendingUp size={24} color="#6366F1" />} 
          trend={+4.2} 
        />
        <StatCard 
          title="Skill Reward Points" 
          value={totalPoints.toLocaleString()} 
          subtitle="Earned via labs & projects" 
          icon={<Zap size={24} color="#FF6B00" />} 
          trend={+180} 
        />
        <StatCard 
          title="Verified Badges" 
          value={totalBadgesCount.toString()} 
          subtitle="Digital skill credentials" 
          icon={<Award size={24} color="#10B981" />} 
        />
        <StatCard 
          title="Leaderboard Rank" 
          value="#4" 
          subtitle="In Embedded & Hardware track" 
          icon={<Trophy size={24} color="#F59E0B" />} 
        />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
        <button
          onClick={() => setActiveTab('skills')}
          style={{
            padding: '10px 20px', borderRadius: '12px', border: 'none',
            background: activeTab === 'skills' ? 'linear-gradient(135deg, #FF6B00, #FF9F43)' : '#FFFFFF',
            color: activeTab === 'skills' ? '#FFFFFF' : '#64748B',
            fontWeight: '700', fontSize: '14px', cursor: 'pointer',
            boxShadow: activeTab === 'skills' ? '0 4px 12px rgba(255, 107, 0, 0.25)' : '0 1px 3px rgba(0,0,0,0.05)',
            transition: 'all 0.2s'
          }}
        >
          ⚡ Technical Skills Matrix ({progressList.length})
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          style={{
            padding: '10px 20px', borderRadius: '12px', border: 'none',
            background: activeTab === 'badges' ? 'linear-gradient(135deg, #FF6B00, #FF9F43)' : '#FFFFFF',
            color: activeTab === 'badges' ? '#FFFFFF' : '#64748B',
            fontWeight: '700', fontSize: '14px', cursor: 'pointer',
            boxShadow: activeTab === 'badges' ? '0 4px 12px rgba(255, 107, 0, 0.25)' : '0 1px 3px rgba(0,0,0,0.05)',
            transition: 'all 0.2s'
          }}
        >
          🏆 Earned Badges ({totalBadgesCount})
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          style={{
            padding: '10px 20px', borderRadius: '12px', border: 'none',
            background: activeTab === 'leaderboard' ? 'linear-gradient(135deg, #FF6B00, #FF9F43)' : '#FFFFFF',
            color: activeTab === 'leaderboard' ? '#FFFFFF' : '#64748B',
            fontWeight: '700', fontSize: '14px', cursor: 'pointer',
            boxShadow: activeTab === 'leaderboard' ? '0 4px 12px rgba(255, 107, 0, 0.25)' : '0 1px 3px rgba(0,0,0,0.05)',
            transition: 'all 0.2s'
          }}
        >
          🥇 Cohort Leaderboard
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>Loading skill progression...</div>
      ) : activeTab === 'skills' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {progressList.map((item, idx) => (
            <GlassCard key={item.id || idx} hover={true} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255, 107, 0, 0.1)', color: '#FF6B00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                    {idx === 0 ? '⚡' : idx === 1 ? '🔌' : idx === 2 ? '🚗' : '💻'}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '17px', color: '#1E293B', fontWeight: '700' }}>{item.skillName}</h3>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>Core Specialization</span>
                  </div>
                </div>
                <span style={{ 
                  background: `${getLevelColor(item.currentLevel)}15`, 
                  color: getLevelColor(item.currentLevel), 
                  padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: `1px solid ${getLevelColor(item.currentLevel)}30` 
                }}>
                  {item.currentLevel}
                </span>
              </div>

              {/* Progression Stage Bar */}
              <div style={{ margin: '14px 0 20px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: '#64748B' }}>Mastery Progress</span>
                  <span style={{ color: '#1E293B', fontWeight: '700' }}>{item.progress || 50}%</span>
                </div>
                <ProgressBar progress={item.progress || 50} color={getLevelColor(item.currentLevel)} />
              </div>

              {/* Progression Stage Steps */}
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', marginBottom: '16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', textAlign: 'center' }}>
                {['Beginner', 'Intermediate', 'Advanced', 'Industry Ready'].map((lvl, lIdx) => {
                  const stageIndex = ['Beginner', 'Intermediate', 'Advanced', 'Industry Ready'].indexOf(item.currentLevel);
                  const isPassed = lIdx <= stageIndex;
                  return (
                    <div key={lvl} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: isPassed ? '#10B981' : '#E2E8F0', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                        {isPassed ? '✓' : lIdx + 1}
                      </div>
                      <span style={{ fontSize: '10px', color: isPassed ? '#1E293B' : '#94A3B8', fontWeight: isPassed ? '700' : '500' }}>
                        {lvl.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Badges Earned for this skill */}
              <div style={{ marginTop: 'auto', borderTop: '1px solid #F1F5F9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FF6B00', fontSize: '13px', fontWeight: '700' }}>
                  <Zap size={15} />
                  <span>+{item.points || 250} Pts</span>
                </div>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  {item.badges?.length || 1} Badges Unlocked
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : activeTab === 'badges' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {[
            { title: 'Foundations Master', desc: 'Completed all core fundamental hardware theory and pass rate > 85%', icon: '🥇', rarity: 'Gold Badge' },
            { title: 'Circuit & PCB Ace', desc: 'Successfully routed and verified a 4-layer microcontroller breakout PCB', icon: '⚡', rarity: 'Platinum Badge' },
            { title: 'Hardware Prototyper', desc: 'Programmed FreeRTOS tasks and hardware timers on ARM Cortex-M4', icon: '🔌', rarity: 'Specialist' },
            { title: 'Industry Capstone Hero', desc: 'Submitted verified industry live project evaluated by supervisor', icon: '🏆', rarity: 'Mastery' },
            { title: 'Fast Learner', desc: 'Achieved 100% punctuality across 20 consecutive training days', icon: '⏱️', rarity: 'Discipline' }
          ].map((badge, idx) => (
            <GlassCard key={idx} hover={true} style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)', border: '2px solid #FF6B00', fontSize: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', boxShadow: '0 8px 20px rgba(255, 107, 0, 0.15)' }}>
                {badge.icon}
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1E293B', fontWeight: '700' }}>{badge.title}</h3>
              <span style={{ display: 'inline-block', background: '#F1F5F9', color: '#475569', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '12px', marginBottom: '12px' }}>
                {badge.rarity}
              </span>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>{badge.desc}</p>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard style={{ padding: '0px', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#1E293B', fontWeight: '700' }}>Top Performing Engineers</h3>
            <span style={{ fontSize: '13px', color: '#64748B' }}>Updated Hourly</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '14px 20px' }}>Rank</th>
                  <th style={{ padding: '14px 20px' }}>Student</th>
                  <th style={{ padding: '14px 20px' }}>College / Department</th>
                  <th style={{ padding: '14px 20px' }}>Progression Level</th>
                  <th style={{ padding: '14px 20px' }}>Performance Index</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Skill Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((userRow, idx) => (
                  <tr key={userRow.id || idx} style={{ borderBottom: '1px solid #F1F5F9', background: idx === 3 ? 'rgba(255, 107, 0, 0.04)' : '#FFFFFF' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '700', color: idx < 3 ? '#FF6B00' : '#64748B' }}>
                      {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#1E293B' }}>
                      {userRow.name} {idx === 3 && <span style={{ fontSize: '11px', background: '#FF6B00', color: '#fff', padding: '2px 6px', borderRadius: '8px', marginLeft: '6px' }}>You</span>}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748B' }}>{userRow.college}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ background: `${getLevelColor(userRow.level)}15`, color: getLevelColor(userRow.level), padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: '700' }}>
                        {userRow.level}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#1E293B', fontWeight: '700' }}>{userRow.performanceIndex}%</td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: '800', color: '#FF6B00' }}>
                      {userRow.points?.toLocaleString()} Pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </PremiumPage>
  );
}
