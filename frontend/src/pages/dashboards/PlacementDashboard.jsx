import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, Users, Calendar, CheckCircle2, Search, Filter, 
  Send, Sparkles, Building, Video, Clock, Plus, ExternalLink 
} from 'lucide-react';
import { useAuth } from '../../state/AuthContext';
import { 
  PremiumPage, PageHeader, GlassCard, PremiumStatCard, 
  GradientButton, Badge, SectionTitle, EmptyState, P 
} from '../../components/PremiumDesignSystem';

export default function PlacementDashboard() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('All');
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  // New Interview Form
  const [candidateName, setCandidateName] = useState('');
  const [companyName, setCompanyName] = useState('Optime Cloud Solutions');
  const [roleTitle, setRoleTitle] = useState('Full Stack Software Engineer');
  const [date, setDate] = useState('2026-09-15');
  const [time, setTime] = useState('11:00 AM');
  const [type, setType] = useState('Technical Round');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPlacementData();
  }, []);

  const fetchPlacementData = async () => {
    setLoading(true);
    try {
      const [matchRes, intRes] = await Promise.all([
        fetch('/api/placement/matching'),
        fetch('/api/interviews')
      ]);
      if (matchRes.ok) {
        const mData = await matchRes.json();
        setCandidates(mData.data || []);
      }
      if (intRes.ok) {
        const iData = await intRes.json();
        setInterviews(iData.data || []);
      }
    } catch (err) {
      console.error('Failed to load placement data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!candidateName.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName,
          companyName,
          roleTitle,
          date,
          time,
          type,
          status: 'scheduled'
        })
      });

      if (res.ok) {
        setShowInterviewModal(false);
        setCandidateName('');
        fetchPlacementData();
      }
    } catch (err) {
      console.error('Schedule interview error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PremiumPage>
      <PageHeader
        title="Placement Officer & Matching Engine"
        subtitle="Algorithmic candidate-to-job matching, mock interview scheduling, and drive coordination"
        emoji="🎯"
        actions={
          <GradientButton onClick={() => setShowInterviewModal(true)}>
            <Plus size={18} /> Schedule Interview / Mock
          </GradientButton>
        }
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        <PremiumStatCard
          label="Placement Ready Pool"
          value="142"
          icon={<Users size={24} />}
          gradientFrom="#5B5CFF"
          gradientTo="#8B5CF6"
        />
        <PremiumStatCard
          label="Scheduled Drives"
          value="8"
          icon={<Building size={24} />}
          gradientFrom="#10B981"
          gradientTo="#059669"
        />
        <PremiumStatCard
          label="Interviews Scheduled"
          value={interviews.length || 16}
          icon={<Calendar size={24} />}
          gradientFrom="#06B6D4"
          gradientTo="#3B82F6"
        />
        <PremiumStatCard
          label="Top Match Score"
          value="96%"
          icon={<Sparkles size={24} />}
          gradientFrom="#F59E0B"
          gradientTo="#D97706"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28, alignItems: 'start' }}>
        {/* Candidates Matching Matrix */}
        <GlassCard>
          <SectionTitle>Algorithmic Candidate Matching Pool</SectionTitle>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${P.border}`, color: P.inkMute, fontSize: 13, fontWeight: 700 }}>
                  <th style={{ padding: '12px 14px' }}>CANDIDATE</th>
                  <th style={{ padding: '12px 14px' }}>TARGET ROLE</th>
                  <th style={{ padding: '12px 14px' }}>SPI SCORE</th>
                  <th style={{ padding: '12px 14px' }}>ALGORITHM MATCH</th>
                  <th style={{ padding: '12px 14px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {(candidates.length > 0 ? candidates : [
                  { studentName: 'Tharani S', targetRole: 'Full Stack Engineer', spi: 885, matchScore: '95%', status: 'Shortlisted' },
                  { studentName: 'Karthik Raja', targetRole: 'Cloud DevOps Specialist', spi: 860, matchScore: '91%', status: 'Available' },
                  { studentName: 'Ananya Sharma', targetRole: 'Frontend UI Architect', spi: 890, matchScore: '94%', status: 'Interviewing' },
                  { studentName: 'Rohan Mehra', targetRole: 'Backend & Data Engineer', spi: 830, matchScore: '87%', status: 'Available' }
                ]).map((cand, idx) => (
                  <tr key={cand._id || cand.id || idx} style={{ borderBottom: `1px solid ${P.border}` }}>
                    <td style={{ padding: '16px 14px', fontWeight: 700, color: P.ink }}>
                      {cand.studentName}
                    </td>
                    <td style={{ padding: '16px 14px', color: P.inkSoft, fontSize: 13 }}>
                      {cand.targetRole}
                    </td>
                    <td style={{ padding: '16px 14px', fontWeight: 800, color: P.primary, fontSize: 13 }}>
                      {cand.spi || 885} / 1000
                    </td>
                    <td style={{ padding: '16px 14px' }}>
                      <Badge color="#16a34a" bg="rgba(34,197,94,0.1)">
                        ⚡ {cand.matchScore || '92%'} Match
                      </Badge>
                    </td>
                    <td style={{ padding: '16px 14px' }}>
                      <Badge color="#5B5CFF" bg="rgba(91,92,255,0.1)">
                        {cand.status || 'Ready'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Scheduled Interviews & Mocks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <GlassCard>
            <SectionTitle>Upcoming Interviews & Mock Rounds</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(interviews.length > 0 ? interviews : [
                { candidateName: 'Tharani S', companyName: 'Optime Cloud', roleTitle: 'Full Stack Engineer', date: '2026-09-15', time: '11:00 AM', type: 'Technical Round 1' },
                { candidateName: 'Karthik Raja', companyName: 'Google Cloud Partner', roleTitle: 'DevOps Intern', date: '2026-09-16', time: '02:30 PM', type: 'System Architecture' },
                { candidateName: 'Ananya Sharma', companyName: 'Fintech Neo', roleTitle: 'UI Specialist', date: '2026-09-18', time: '10:00 AM', type: 'Culture & Fit' }
              ]).map((iv, i) => (
                <div key={iv._id || iv.id || i} style={{ padding: 14, borderRadius: 12, background: 'rgba(0,0,0,0.02)', border: `1px solid ${P.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: P.ink }}>{iv.candidateName}</div>
                    <Badge color="#06B6D4" bg="rgba(6,182,212,0.1)">{iv.type}</Badge>
                  </div>
                  <div style={{ fontSize: 13, color: P.inkSoft }}>{iv.companyName} • {iv.roleTitle}</div>
                  <div style={{ fontSize: 12, color: P.inkMute, marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={12} /> {iv.date} at {iv.time}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <SectionTitle>Top Hiring Partner Companies</SectionTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Optime Cloud', 'Cognizant', 'Tata Consultancy', 'Infosys Digital', 'Accenture Labs', 'Zoho Corp'].map((c, idx) => (
                <span key={idx} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(91,92,255,0.06)', border: `1px solid ${P.border}`, fontSize: 12, fontWeight: 700, color: P.inkSoft }}>
                  {c}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showInterviewModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20
        }}>
          <GlassCard style={{ maxWidth: 480, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: P.ink }}>Schedule Placement / Mock Interview</h3>
              <button onClick={() => setShowInterviewModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: P.inkMute }}>✕</button>
            </div>

            <form onSubmit={handleScheduleInterview} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: P.ink, marginBottom: 4 }}>Candidate Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tharani S"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${P.border}`, fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: P.ink, marginBottom: 4 }}>Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${P.border}`, fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: P.ink, marginBottom: 4 }}>Role Title</label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${P.border}`, fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: P.ink, marginBottom: 4 }}>Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${P.border}`, fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: P.ink, marginBottom: 4 }}>Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${P.border}`, fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: P.ink, marginBottom: 4 }}>Interview Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${P.border}`, fontSize: 13 }}
                >
                  <option value="Technical Round">Technical Round</option>
                  <option value="Mock Interview Practice">Mock Interview Practice</option>
                  <option value="Coding Assessment">Coding Assessment</option>
                  <option value="HR & Culture Fit">HR & Culture Fit</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <GradientButton type="button" variant="outline" onClick={() => setShowInterviewModal(false)} style={{ flex: 1 }}>
                  Cancel
                </GradientButton>
                <GradientButton type="submit" disabled={submitting} style={{ flex: 1 }}>
                  {submitting ? 'Scheduling...' : 'Schedule Interview'}
                </GradientButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </PremiumPage>
  );
}
