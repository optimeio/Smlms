import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardCheck, UserCheck, Star, Calendar, CheckCircle2, 
  Send, FileText, Award, AlertCircle, TrendingUp, Users 
} from 'lucide-react';
import { useAuth } from '../../state/AuthContext';
import { 
  PremiumPage, PageHeader, GlassCard, PremiumStatCard, 
  GradientButton, Badge, SectionTitle, EmptyState, P 
} from '../../components/PremiumDesignSystem';

export default function SupervisorEvaluations() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);

  // Weekly eval form
  const [week, setWeek] = useState(4);
  const [techRating, setTechRating] = useState(5);
  const [softRating, setSoftRating] = useState(5);
  const [punctuality, setPunctuality] = useState(98);
  const [deliverablesStatus, setDeliverablesStatus] = useState('Exceeds Expectations');
  const [supervisorNotes, setSupervisorNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/internships/applications');
      if (res.ok) {
        const data = await res.json();
        // Filter or display all active interns
        const list = data.data || [];
        setApplications(list.length > 0 ? list : [
          {
            _id: 'app-001',
            studentName: 'Tharani S',
            studentId: 'std-101',
            internshipTitle: 'Full Stack Engineering Intern',
            companyName: 'Optime Cloud Solutions',
            status: 'active',
            startDate: '2026-08-01',
            weeklyEvaluations: [
              { week: 1, techRating: 4, softRating: 5, notes: 'Quick onboarding and environment setup.' },
              { week: 2, techRating: 5, softRating: 5, notes: 'Completed API authentication task ahead of schedule.' },
              { week: 3, techRating: 5, softRating: 4, notes: 'Demonstrated solid understanding of React state management.' }
            ]
          }
        ]);
      }
    } catch (err) {
      console.error('Failed to load interns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectApp = (app) => {
    setSelectedApp(app);
    setWeek((app.weeklyEvaluations?.length || 0) + 1);
    setSupervisorNotes('');
  };

  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    setSubmitting(true);
    setSuccessMsg('');

    try {
      const res = await fetch(`/api/internships/applications/${selectedApp._id || selectedApp.id}/evaluate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          week: Number(week),
          techRating: Number(techRating),
          softRating: Number(softRating),
          punctuality: Number(punctuality),
          deliverablesStatus,
          notes: supervisorNotes,
          evaluator: user?.name || 'Industry Supervisor'
        })
      });

      if (res.ok) {
        setSuccessMsg(`Week ${week} evaluation recorded successfully!`);
        fetchInterns();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Evaluation submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PremiumPage>
      <PageHeader
        title="Industry Supervisor Logbook"
        subtitle="Log weekly progress, technical assessments, and professional conduct for your interns"
        emoji="📋"
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        <PremiumStatCard
          label="Active Mentees"
          value={applications.length}
          icon={<Users size={24} />}
          gradientFrom="#5B5CFF"
          gradientTo="#8B5CF6"
        />
        <PremiumStatCard
          label="Avg Performance"
          value="4.8 / 5.0"
          icon={<Star size={24} />}
          gradientFrom="#F59E0B"
          gradientTo="#D97706"
        />
        <PremiumStatCard
          label="Evaluations Logged"
          value="18"
          icon={<ClipboardCheck size={24} />}
          gradientFrom="#10B981"
          gradientTo="#059669"
        />
        <PremiumStatCard
          label="Punctuality Avg"
          value="96%"
          icon={<TrendingUp size={24} />}
          gradientFrom="#06B6D4"
          gradientTo="#3B82F6"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedApp ? '1fr 1fr' : '1fr', gap: 28, alignItems: 'start' }}>
        {/* Intern List */}
        <GlassCard>
          <SectionTitle>Assigned Industry Interns</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {applications.map((app) => {
              const isSelected = selectedApp?._id === app._id;
              return (
                <div
                  key={app._id || app.id}
                  style={{
                    padding: 18,
                    borderRadius: 14,
                    border: isSelected ? `2px solid ${P.primary}` : `1px solid ${P.border}`,
                    background: isSelected ? 'rgba(91,92,255,0.04)' : 'rgba(0,0,0,0.01)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: P.ink }}>
                      {app.studentName || 'Tharani S'}
                    </div>
                    <div style={{ fontSize: 13, color: P.inkSoft, marginTop: 2 }}>
                      {app.internshipTitle || 'Full Stack Engineering Intern'}
                    </div>
                    <div style={{ fontSize: 12, color: P.inkMute, marginTop: 4 }}>
                      Logs: <b>{app.weeklyEvaluations?.length || 3} weeks recorded</b>
                    </div>
                  </div>

                  <GradientButton
                    variant={isSelected ? 'primary' : 'outline'}
                    onClick={() => handleSelectApp(app)}
                  >
                    Log Weekly Review
                  </GradientButton>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Evaluation Form */}
        {selectedApp && (
          <GlassCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <SectionTitle>Weekly Evaluation Entry</SectionTitle>
              <button onClick={() => setSelectedApp(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: P.inkMute }}>✕</button>
            </div>

            {successMsg && (
              <div style={{ padding: 12, borderRadius: 10, background: 'rgba(34,197,94,0.12)', color: '#16a34a', marginBottom: 16, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={16} /> {successMsg}
              </div>
            )}

            <div style={{ marginBottom: 16, padding: 12, borderRadius: 10, background: 'rgba(91,92,255,0.04)', border: `1px solid ${P.border}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: P.ink }}>{selectedApp.studentName}</div>
              <div style={{ fontSize: 12, color: P.inkSoft }}>{selectedApp.internshipTitle}</div>
            </div>

            <form onSubmit={handleSubmitEvaluation} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: P.ink, marginBottom: 4 }}>Internship Week</label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={week}
                    onChange={(e) => setWeek(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${P.border}`, fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: P.ink, marginBottom: 4 }}>Punctuality (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={punctuality}
                    onChange={(e) => setPunctuality(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${P.border}`, fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: P.ink, marginBottom: 4 }}>Tech Competency (1-5)</label>
                  <select
                    value={techRating}
                    onChange={(e) => setTechRating(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${P.border}`, fontSize: 13 }}
                  >
                    <option value="5">5 - Exceptional (Self-reliant)</option>
                    <option value="4">4 - High Quality</option>
                    <option value="3">3 - Satisfactory</option>
                    <option value="2">2 - Needs Guidance</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: P.ink, marginBottom: 4 }}>Teamwork & Attitude (1-5)</label>
                  <select
                    value={softRating}
                    onChange={(e) => setSoftRating(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${P.border}`, fontSize: 13 }}
                  >
                    <option value="5">5 - Proactive & Collaborative</option>
                    <option value="4">4 - Good Communicator</option>
                    <option value="3">3 - Standard</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: P.ink, marginBottom: 4 }}>Deliverables Assessment</label>
                <select
                  value={deliverablesStatus}
                  onChange={(e) => setDeliverablesStatus(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${P.border}`, fontSize: 13 }}
                >
                  <option value="Exceeds Expectations">Exceeds Expectations</option>
                  <option value="Met All Deliverables">Met All Deliverables</option>
                  <option value="Partially Completed">Partially Completed</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: P.ink, marginBottom: 4 }}>Supervisor Feedback & Recommendations</label>
                <textarea
                  rows={3}
                  value={supervisorNotes}
                  onChange={(e) => setSupervisorNotes(e.target.value)}
                  placeholder="Note specific accomplishments, architecture contributions, or areas of focus for next week..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${P.border}`, fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>

              <GradientButton type="submit" disabled={submitting}>
                <Award size={16} />
                {submitting ? 'Signing Log...' : 'Sign & Submit Weekly Log'}
              </GradientButton>
            </form>
          </GlassCard>
        )}
      </div>
    </PremiumPage>
  );
}
