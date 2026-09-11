import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderGit2, ExternalLink, GitBranch, CheckCircle2, XCircle, 
  Award, Star, MessageSquare, Send, Sparkles, Filter, Check, Clock
} from 'lucide-react';
import { useAuth } from '../../state/AuthContext';
import { 
  PremiumPage, PageHeader, GlassCard, PremiumStatCard, 
  GradientButton, Badge, SectionTitle, EmptyState, P 
} from '../../components/PremiumDesignSystem';

export default function TrainerProjectEvaluations() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Review form state
  const [score, setScore] = useState(85);
  const [badge, setBadge] = useState('Certified Full-Stack Builder');
  const [feedback, setFeedback] = useState('');
  const [reviewStatus, setReviewStatus] = useState('approved');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = (proj) => {
    setSelectedProject(proj);
    setScore(proj.evaluation?.score || 85);
    setBadge(proj.evaluation?.badge || 'Certified Full-Stack Builder');
    setFeedback(proj.evaluation?.feedback || '');
    setReviewStatus(proj.status === 'submitted' ? 'approved' : proj.status);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;
    setSubmitting(true);
    setStatusMsg('');

    try {
      const res = await fetch(`/api/projects/${selectedProject._id || selectedProject.id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: reviewStatus,
          score: Number(score),
          feedback,
          badge,
          evaluatedBy: user?.name || 'Trainer Evaluation Board'
        })
      });

      if (res.ok) {
        setStatusMsg('Project review submitted successfully!');
        fetchProjects();
        setTimeout(() => {
          setSelectedProject(null);
          setStatusMsg('');
        }, 1500);
      }
    } catch (err) {
      console.error('Submit review error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const pendingCount = projects.filter(p => p.status === 'submitted').length;
  const approvedCount = projects.filter(p => p.status === 'approved').length;

  return (
    <PremiumPage>
      <PageHeader
        title="Project & Capstone Evaluation"
        subtitle="Review student project submissions, assign industry badges, and evaluate code deliverables"
        emoji="🏆"
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        <PremiumStatCard
          label="Total Submissions"
          value={projects.length}
          icon={<FolderGit2 size={24} />}
          gradientFrom="#5B5CFF"
          gradientTo="#8B5CF6"
        />
        <PremiumStatCard
          label="Pending Review"
          value={pendingCount}
          icon={<Clock size={24} />}
          gradientFrom="#F59E0B"
          gradientTo="#D97706"
        />
        <PremiumStatCard
          label="Endorsed Capstones"
          value={approvedCount}
          icon={<CheckCircle2 size={24} />}
          gradientFrom="#10B981"
          gradientTo="#059669"
        />
        <PremiumStatCard
          label="Badges Awarded"
          value={approvedCount}
          icon={<Award size={24} />}
          gradientFrom="#EC4899"
          gradientTo="#8B5CF6"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedProject ? '1fr 1fr' : '1fr', gap: 24, alignItems: 'start' }}>
        {/* Project List */}
        <GlassCard>
          <SectionTitle>Student Capstone Submissions</SectionTitle>
          {projects.length === 0 ? (
            <EmptyState
              icon={<FolderGit2 size={48} />}
              title="No projects to review"
              subtitle="Student capstone project submissions will appear here for evaluation."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {projects.map((proj) => {
                const isSelected = selectedProject?._id === proj._id || selectedProject?.id === proj.id;
                const isApproved = proj.status === 'approved';
                const isPending = proj.status === 'submitted';
                return (
                  <div
                    key={proj._id || proj.id}
                    style={{
                      padding: 20,
                      borderRadius: 16,
                      border: isSelected ? `2px solid ${P.primary}` : `1px solid ${P.border}`,
                      background: isSelected ? 'rgba(91,92,255,0.04)' : 'rgba(0,0,0,0.01)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 16,
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: P.ink }}>
                          {proj.title}
                        </h4>
                        <Badge
                          color={isApproved ? '#16a34a' : isPending ? '#d97706' : '#dc2626'}
                          bg={isApproved ? 'rgba(34,197,94,0.1)' : isPending ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)'}
                        >
                          {proj.status?.toUpperCase()}
                        </Badge>
                      </div>
                      <p style={{ margin: '0 0 10px', fontSize: 13, color: P.inkSoft }}>
                        {proj.description?.slice(0, 100)}...
                      </p>
                      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: P.inkMute }}>
                        <span>Author: <b>{proj.studentName || 'Student ' + (proj.studentId || '')}</b></span>
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noreferrer" style={{ color: P.primary, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                            <GitBranch size={13} /> Repo
                          </a>
                        )}
                        {proj.liveUrl && (
                          <a href={proj.liveUrl} target="_blank" rel="noreferrer" style={{ color: P.primary, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                            <ExternalLink size={13} /> Live Demo
                          </a>
                        )}
                      </div>
                    </div>

                    <div>
                      <GradientButton
                        variant={isSelected ? 'primary' : 'outline'}
                        onClick={() => handleOpenReview(proj)}
                      >
                        {isApproved ? 'Update Evaluation' : 'Evaluate & Score'}
                      </GradientButton>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>

        {/* Evaluation Drawer / Form */}
        {selectedProject && (
          <GlassCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <SectionTitle>Capstone Evaluation Form</SectionTitle>
              <button 
                onClick={() => setSelectedProject(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: P.inkMute }}
              >
                ✕
              </button>
            </div>

            {statusMsg && (
              <div style={{ padding: 12, borderRadius: 10, background: 'rgba(34,197,94,0.12)', color: '#16a34a', marginBottom: 16, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={16} /> {statusMsg}
              </div>
            )}

            <div style={{ marginBottom: 20, padding: 16, borderRadius: 12, background: 'rgba(91,92,255,0.04)', border: `1px solid ${P.border}` }}>
              <h4 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 800, color: P.ink }}>
                {selectedProject.title}
              </h4>
              <p style={{ margin: 0, fontSize: 13, color: P.inkSoft, lineHeight: 1.5 }}>
                {selectedProject.description}
              </p>
            </div>

            <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: P.ink, marginBottom: 6 }}>
                  Evaluation Decision
                </label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => setReviewStatus('approved')}
                    style={{
                      flex: 1, padding: '10px 14px', borderRadius: 10,
                      border: reviewStatus === 'approved' ? '2px solid #16a34a' : `1px solid ${P.border}`,
                      background: reviewStatus === 'approved' ? 'rgba(34,197,94,0.1)' : '#fff',
                      color: reviewStatus === 'approved' ? '#16a34a' : P.inkSoft,
                      fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                    }}
                  >
                    <CheckCircle2 size={16} /> Approve & Endorse
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewStatus('changes_requested')}
                    style={{
                      flex: 1, padding: '10px 14px', borderRadius: 10,
                      border: reviewStatus === 'changes_requested' ? '2px solid #dc2626' : `1px solid ${P.border}`,
                      background: reviewStatus === 'changes_requested' ? 'rgba(239,68,68,0.1)' : '#fff',
                      color: reviewStatus === 'changes_requested' ? '#dc2626' : P.inkSoft,
                      fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                    }}
                  >
                    <XCircle size={16} /> Request Revisions
                  </button>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: P.ink }}>
                    Score (0 - 100)
                  </label>
                  <span style={{ fontSize: 15, fontWeight: 900, color: P.primary }}>{score} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: P.ink, marginBottom: 6 }}>
                  Endorsement Badge
                </label>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: `1.5px solid ${P.border}`,
                    fontSize: 14
                  }}
                >
                  <option value="Certified Full-Stack Builder">Certified Full-Stack Builder</option>
                  <option value="Best System Architecture">Best System Architecture</option>
                  <option value="Exemplary UI/UX Execution">Exemplary UI/UX Execution</option>
                  <option value="Cloud Ready Capstone">Cloud Ready Capstone</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: P.ink, marginBottom: 6 }}>
                  Detailed Evaluation Feedback & Rubric Notes
                </label>
                <textarea
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide constructive feedback on modularity, test coverage, UI polish, and production readiness..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: `1.5px solid ${P.border}`,
                    fontSize: 14,
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <GradientButton type="submit" disabled={submitting}>
                <Award size={16} />
                {submitting ? 'Recording Evaluation...' : 'Save & Publish Evaluation'}
              </GradientButton>
            </form>
          </GlassCard>
        )}
      </div>
    </PremiumPage>
  );
}
