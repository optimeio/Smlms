import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../state/useAuth';
import { 
  FolderGit2, Plus, ExternalLink, GitBranch, Upload, CheckCircle2, 
  Clock, Star, MessageSquare, Award, User, Sparkles, Send, FileText, Check 
} from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, StatCard, Badge, GradientButton, ProgressBar, EmptyState, P } from '../../components/PremiumDesignSystem';

export default function StudentProjectsPortfolio() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'portfolio' | 'submit'
  
  // Submit Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Hardware / Embedded Systems',
    description: '',
    skills: '',
    githubUrl: '',
    liveUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const studentId = user?._id || user?.id || user?.email;
      const [projRes, portRes] = await Promise.all([
        fetch(`/api/projects?studentId=${encodeURIComponent(studentId)}`),
        fetch(`/api/portfolio/${encodeURIComponent(studentId)}`)
      ]);
      const projData = projRes.ok ? await projRes.json() : { success: false, projects: [] };
      const portData = portRes.ok ? await portRes.json() : { success: false, portfolio: null };

      if (projData.success) setProjects(projData.projects || []);
      if (portData.success) setPortfolio(portData.portfolio);
    } catch (err) {
      console.error('Failed to load projects/portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    try {
      setIsSubmitting(true);
      const studentId = user?._id || user?.id || user?.email;
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          studentId,
          studentEmail: user?.email,
          studentName: user?.fullName || 'Student Innovator'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        setFormData({ title: '', category: 'Hardware / Embedded Systems', description: '', skills: '', githubUrl: '', liveUrl: '' });
        await fetchData();
        setTimeout(() => {
          setSubmitSuccess(false);
          setActiveTab('projects');
        }, 1500);
      }
    } catch (err) {
      console.error('Project submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved': return { bg: '#DCFCE7', color: '#16A34A', label: 'Approved & Verified' };
      case 'Under Review': return { bg: '#FEF3C7', color: '#D97706', label: 'Under Review' };
      case 'Needs Revision': return { bg: '#FEE2E2', color: '#DC2626', label: 'Needs Revision' };
      default: return { bg: '#E0E7FF', color: '#4F46E5', label: 'Submitted' };
    }
  };

  return (
    <PremiumPage>
      <PageHeader 
        badge="Product & Portfolio System"
        title={
          <span>
            Projects & <span style={{ background: 'linear-gradient(135deg, #FF6B00, #FF9F43)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Digital Portfolio</span>
          </span>
        }
        subtitle="Build real-world engineering products, receive trainer & industry supervisor evaluations, and publish your digital portfolio."
        actions={
          <GradientButton onClick={() => setActiveTab('submit')}>
            <Plus size={18} style={{ marginRight: '6px' }} /> Submit New Project
          </GradientButton>
        }
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
        <button
          onClick={() => setActiveTab('projects')}
          style={{
            padding: '10px 20px', borderRadius: '12px', border: 'none',
            background: activeTab === 'projects' ? 'linear-gradient(135deg, #FF6B00, #FF9F43)' : '#FFFFFF',
            color: activeTab === 'projects' ? '#FFFFFF' : '#64748B',
            fontWeight: '700', fontSize: '14px', cursor: 'pointer',
            boxShadow: activeTab === 'projects' ? '0 4px 12px rgba(255, 107, 0, 0.25)' : '0 1px 3px rgba(0,0,0,0.05)',
            transition: 'all 0.2s'
          }}
        >
          📂 My Projects ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab('portfolio')}
          style={{
            padding: '10px 20px', borderRadius: '12px', border: 'none',
            background: activeTab === 'portfolio' ? 'linear-gradient(135deg, #FF6B00, #FF9F43)' : '#FFFFFF',
            color: activeTab === 'portfolio' ? '#FFFFFF' : '#64748B',
            fontWeight: '700', fontSize: '14px', cursor: 'pointer',
            boxShadow: activeTab === 'portfolio' ? '0 4px 12px rgba(255, 107, 0, 0.25)' : '0 1px 3px rgba(0,0,0,0.05)',
            transition: 'all 0.2s'
          }}
        >
          🌟 Live Digital Portfolio View
        </button>
        <button
          onClick={() => setActiveTab('submit')}
          style={{
            padding: '10px 20px', borderRadius: '12px', border: 'none',
            background: activeTab === 'submit' ? 'linear-gradient(135deg, #FF6B00, #FF9F43)' : '#FFFFFF',
            color: activeTab === 'submit' ? '#FFFFFF' : '#64748B',
            fontWeight: '700', fontSize: '14px', cursor: 'pointer',
            boxShadow: activeTab === 'submit' ? '0 4px 12px rgba(255, 107, 0, 0.25)' : '0 1px 3px rgba(0,0,0,0.05)',
            transition: 'all 0.2s'
          }}
        >
          ➕ Submit Capstone Project
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>Loading projects...</div>
      ) : activeTab === 'projects' ? (
        <div>
          {projects.length === 0 ? (
            <GlassCard style={{ textAlign: 'center', padding: '60px' }}>
              <FolderGit2 size={56} color="#CBD5E1" style={{ margin: '0 auto 16px auto', display: 'block' }} />
              <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#1E293B' }}>No Projects Submitted Yet</h3>
              <p style={{ color: '#64748B', marginBottom: '24px' }}>Submit your practical lab capstone or hardware prototype to receive trainer & industry feedback.</p>
              <GradientButton onClick={() => setActiveTab('submit')}>
                <Plus size={18} style={{ marginRight: '6px' }} /> Submit Your First Project
              </GradientButton>
            </GlassCard>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
              {projects.map((proj, idx) => {
                const badge = getStatusBadge(proj.status);
                return (
                  <GlassCard key={proj._id || proj.id || idx} hover={true} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <span style={{ fontSize: '12px', color: '#64748B', background: '#F1F5F9', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>
                        {proj.category}
                      </span>
                      <span style={{ background: badge.bg, color: badge.color, fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '14px' }}>
                        {badge.label}
                      </span>
                    </div>

                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#1E293B', fontWeight: '700' }}>{proj.title}</h3>
                    <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#64748B', lineHeight: '1.6', flex: 1 }}>{proj.description}</p>

                    {/* Skill Tags */}
                    {proj.skills && proj.skills.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                        {proj.skills.map((s, sIdx) => (
                          <span key={sIdx} style={{ background: '#FFF7ED', color: '#C2410C', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '8px' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Feedback Block if available */}
                    {(proj.trainerFeedback || proj.industryFeedback) && (
                      <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', borderLeft: '3px solid #10B981', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1E293B', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>
                          <MessageSquare size={14} color="#10B981" /> Evaluator Feedback:
                        </div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>
                          "{proj.trainerFeedback || proj.industryFeedback}"
                        </p>
                      </div>
                    )}

                    {/* Project Links */}
                    <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '14px', marginTop: 'auto' }}>
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1E293B', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
                          <GitBranch size={16} /> Repository
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FF6B00', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
                          <ExternalLink size={16} /> Live Demo
                        </a>
                      )}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      ) : activeTab === 'portfolio' ? (
        /* Digital Portfolio View */
        <GlassCard style={{ padding: '36px', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: '24px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B00, #FF9F43)', color: '#fff', fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {(portfolio?.student?.name || 'S').charAt(0)}
              </div>
              <div>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', color: '#1E293B', fontWeight: '800' }}>{portfolio?.student?.name}</h2>
                <p style={{ margin: '0 0 6px 0', color: '#64748B', fontSize: '14px' }}>{portfolio?.student?.college} • {portfolio?.student?.department}</p>
                <span style={{ display: 'inline-block', background: '#DCFCE7', color: '#16A34A', fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '12px' }}>
                  ✓ MBK SkillOS Verified Digital Portfolio
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#64748B' }}>Overall Performance Index</div>
              <div style={{ fontSize: '28px', color: '#FF6B00', fontWeight: '800' }}>{portfolio?.performanceIndex || 92}%</div>
            </div>
          </div>

          {/* Verified Skills Section */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1E293B', fontWeight: '700' }}>⚡ Verified Technical Competencies</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
              {(portfolio?.skills || []).map((sk, idx) => (
                <div key={idx} style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '700', fontSize: '13px', color: '#1E293B' }}>{sk.name}</span>
                    <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '700' }}>{sk.level}</span>
                  </div>
                  <ProgressBar progress={sk.progress || 70} color="#FF6B00" />
                </div>
              ))}
            </div>
          </div>

          {/* Capstone Projects Section */}
          <div>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1E293B', fontWeight: '700' }}>📁 Capstone Engineering Projects</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(portfolio?.projects || []).map((p, idx) => (
                <div key={idx} style={{ padding: '18px', borderRadius: '14px', border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <h4 style={{ margin: 0, fontSize: '16px', color: '#1E293B', fontWeight: '700' }}>{p.title}</h4>
                    <span style={{ fontSize: '12px', color: '#16A34A', fontWeight: '700' }}>✓ Verified</span>
                  </div>
                  <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#64748B' }}>{p.description}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {(p.skills || []).map((s, sIdx) => (
                      <span key={sIdx} style={{ background: '#F1F5F9', color: '#475569', fontSize: '11px', padding: '2px 8px', borderRadius: '6px' }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      ) : (
        /* Submit Project Form */
        <GlassCard style={{ maxWidth: '700px', margin: '0 auto', padding: '36px' }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', color: '#1E293B', fontWeight: '800' }}>Submit Capstone / Lab Project</h2>
          <p style={{ margin: '0 0 24px 0', color: '#64748B', fontSize: '14px' }}>Your project will be reviewed by your course trainer and industry supervisor for digital badge verification.</p>

          <AnimatePresence>
            {submitSuccess && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#DCFCE7', color: '#16A34A', padding: '14px', borderRadius: '12px', marginBottom: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={18} /> Project submitted successfully for evaluation!
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>Project Title *</label>
              <input 
                type="text" 
                required 
                placeholder="e.g., STM32 CAN Telemetry Node & BMS Interface"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>Specialization Track / Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#fff' }}
              >
                <option value="Hardware / Embedded Systems">Hardware / Embedded Systems</option>
                <option value="Electric Vehicle & BMS">Electric Vehicle & BMS</option>
                <option value="IoT & Edge Computing">IoT & Edge Computing</option>
                <option value="Full Stack Cloud Development">Full Stack Cloud Development</option>
                <option value="CAD & Mechanical Design">CAD & Mechanical Design</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>Description & Architecture *</label>
              <textarea 
                required 
                rows={4} 
                placeholder="Describe your design, microcontrollers used, protocols implemented, and key outcomes..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>Skills & Technologies (comma-separated)</label>
              <input 
                type="text" 
                placeholder="e.g., ARM Cortex-M4, CAN Bus, FreeRTOS, Altium"
                value={formData.skills}
                onChange={e => setFormData({ ...formData, skills: e.target.value })}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>GitHub / Repository URL</label>
                <input 
                  type="url" 
                  placeholder="https://github.com/..."
                  value={formData.githubUrl}
                  onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>Live Demo / Video Link</label>
                <input 
                  type="url" 
                  placeholder="https://drive.google.com/..."
                  value={formData.liveUrl}
                  onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '12px' }}>
              <GradientButton type="submit" disabled={isSubmitting} style={{ width: '100%', justifyContent: 'center' }}>
                {isSubmitting ? 'Submitting...' : 'Submit Project for Evaluation'}
              </GradientButton>
            </div>
          </form>
        </GlassCard>
      )}
    </PremiumPage>
  );
}
