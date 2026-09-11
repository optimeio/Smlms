import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Send, Sparkles, Compass, Lightbulb, BookOpen, 
  CheckCircle2, ArrowRight, User, Code, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../state/AuthContext';
import { 
  PremiumPage, PageHeader, GlassCard, 
  GradientButton, Badge, SectionTitle, P 
} from '../../components/PremiumDesignSystem';

export default function StudentAIAssistant() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tutor'); // 'tutor' | 'gap'

  // Tutor state
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${user?.name || 'there'}! 👋 I am your MBK SkillOS AI Tutor. How can I help you master your skills today? You can ask me to explain any coding concept, debug code, or give practice problems!`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Career Gap state
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');
  const [currentSkills, setCurrentSkills] = useState('JavaScript, React, Node.js, HTML/CSS, Git');
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [gapLoading, setGapLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputQuery.trim() || chatLoading) return;

    const userMsg = { role: 'user', content: inputQuery };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/learn-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: inputQuery, studentId: user?._id || 'std-101' })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply || data.answer || 'Here is what I found...' }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Apologies, I encountered an issue processing your query. Please try again.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error with AI service.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleRunGapAnalysis = async (e) => {
    e?.preventDefault();
    setGapLoading(true);
    try {
      const res = await fetch('/api/ai/career-gap-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          currentSkills: currentSkills.split(',').map(s => s.trim())
        })
      });
      if (res.ok) {
        const data = await res.json();
        setGapAnalysis(data.analysis || data);
      }
    } catch (err) {
      console.error('Gap analysis error:', err);
    } finally {
      setGapLoading(false);
    }
  };

  const quickPrompts = [
    "Explain how React useEffect cleanup works with an example",
    "What is the difference between SQL and NoSQL databases?",
    "Give me 3 practical interview questions on REST APIs",
    "How to prepare a Docker container for a Node.js web app?"
  ];

  return (
    <PremiumPage>
      <PageHeader
        title="AI Learning & Career Assistant"
        subtitle="24/7 intelligent tutoring, automated doubt solving, and personalized career gap diagnosis"
        emoji="🤖"
        actions={
          <div style={{ display: 'flex', background: 'rgba(91,92,255,0.08)', padding: 4, borderRadius: 12 }}>
            <button
              onClick={() => setActiveTab('tutor')}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 13,
                background: activeTab === 'tutor' ? P.primary : 'transparent',
                color: activeTab === 'tutor' ? '#fff' : P.inkSoft,
                transition: 'all 0.2s'
              }}
            >
              💬 AI Skill Tutor
            </button>
            <button
              onClick={() => setActiveTab('gap')}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 13,
                background: activeTab === 'gap' ? P.primary : 'transparent',
                color: activeTab === 'gap' ? '#fff' : P.inkSoft,
                transition: 'all 0.2s'
              }}
            >
              🎯 Career Gap Analysis
            </button>
          </div>
        }
      />

      {activeTab === 'tutor' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          {/* Chat Container */}
          <GlassCard style={{ display: 'flex', flexDirection: 'column', height: '640px', padding: 0, overflow: 'hidden' }}>
            <div style={{
              padding: '16px 24px',
              borderBottom: `1px solid ${P.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(91,92,255,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg, #5B5CFF, #8B5CF6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Bot size={20} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: P.ink }}>SkillOS Interactive Tutor</div>
                  <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>● Online & Ready</div>
                </div>
              </div>
              <Badge color={P.primary}>Gemini / Claude Engine</Badge>
            </div>

            {/* Chat Body */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}>
              {messages.map((m, idx) => {
                const isUser = m.role === 'user';
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: 'flex',
                      justifyContent: isUser ? 'flex-end' : 'flex-start',
                      gap: 12
                    }}
                  >
                    {!isUser && (
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'linear-gradient(135deg, #5B5CFF, #8B5CF6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Bot size={16} color="#fff" />
                      </div>
                    )}
                    <div style={{
                      maxWidth: '75%',
                      padding: '14px 18px',
                      borderRadius: 16,
                      background: isUser ? `linear-gradient(135deg, ${P.primary}, ${P.secondary})` : 'rgba(0,0,0,0.03)',
                      color: isUser ? '#fff' : P.ink,
                      border: isUser ? 'none' : `1px solid ${P.border}`,
                      fontSize: 14,
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      boxShadow: isUser ? '0 4px 12px rgba(91,92,255,0.2)' : 'none'
                    }}>
                      {m.content}
                    </div>
                    {isUser && (
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: '#e2e8f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <User size={16} color={P.ink} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
              {chatLoading && (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#5B5CFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={16} color="#fff" />
                  </div>
                  <div style={{ padding: '10px 16px', borderRadius: 14, background: 'rgba(0,0,0,0.03)', fontSize: 13, color: P.inkMute }}>
                    SkillOS AI is thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} style={{
              padding: 16,
              borderTop: `1px solid ${P.border}`,
              display: 'flex',
              gap: 12,
              background: 'rgba(255,255,255,0.8)'
            }}>
              <input
                type="text"
                placeholder="Ask about a coding problem, architectural concept, or formula..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: `1.5px solid ${P.border}`,
                  fontSize: 14,
                  outline: 'none',
                  background: '#fff'
                }}
              />
              <GradientButton type="submit" disabled={!inputQuery.trim() || chatLoading}>
                <Send size={16} />
              </GradientButton>
            </form>
          </GlassCard>

          {/* Quick Prompts & Tips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <GlassCard>
              <SectionTitle>💡 Quick Practice Prompts</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {quickPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => { setInputQuery(p); }}
                    style={{
                      textAlign: 'left',
                      padding: 12,
                      borderRadius: 10,
                      border: `1px solid ${P.border}`,
                      background: 'rgba(0,0,0,0.01)',
                      fontSize: 12,
                      fontWeight: 600,
                      color: P.inkSoft,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(91,92,255,0.06)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.01)'}
                  >
                    <Sparkles size={14} color={P.primary} />
                    <span>{p}</span>
                  </button>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <SectionTitle>SkillOS AI Capabilities</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: P.inkSoft }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Code size={18} color="#5B5CFF" />
                  <div>Syntax & Algorithmic Debugging with code explanations</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <BookOpen size={18} color="#10B981" />
                  <div>Curriculum-aligned concept breakdowns</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Lightbulb size={18} color="#F59E0B" />
                  <div>Mock technical interview questions & scoring</div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      ) : (
        /* Career Gap Analysis View */
        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 28, alignItems: 'start' }}>
          <GlassCard>
            <SectionTitle>Target Role & Skill Diagnosis</SectionTitle>
            <form onSubmit={handleRunGapAnalysis} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: P.ink, marginBottom: 6 }}>
                  Target Career / Job Role
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Architect, Cloud Engineer"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: `1.5px solid ${P.border}`,
                    fontSize: 14,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: P.ink, marginBottom: 6 }}>
                  Your Current Skills (Comma Separated)
                </label>
                <textarea
                  rows={4}
                  value={currentSkills}
                  onChange={(e) => setCurrentSkills(e.target.value)}
                  placeholder="e.g. JavaScript, HTML, CSS, React, MongoDB"
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

              <GradientButton type="submit" disabled={gapLoading}>
                <Sparkles size={16} />
                {gapLoading ? 'Analyzing Skill Gap...' : 'Run Career Gap Diagnosis'}
              </GradientButton>
            </form>
          </GlassCard>

          {/* Gap Analysis Output */}
          <GlassCard>
            <SectionTitle>
              <span>Diagnosis & Custom Roadmap</span>
              {gapAnalysis && <Badge color="#16a34a" bg="rgba(34,197,94,0.1)">Match Index: {gapAnalysis.matchScore || '82%'}</Badge>}
            </SectionTitle>

            {gapAnalysis ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Summary */}
                <div style={{
                  padding: 16,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, rgba(91,92,255,0.05), rgba(139,92,246,0.05))',
                  border: `1px solid ${P.border}`
                }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: P.ink, marginBottom: 4 }}>
                    Career Readiness for: {targetRole}
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: P.inkSoft, lineHeight: 1.6 }}>
                    {gapAnalysis.summary || `You have a strong baseline foundation for ${targetRole}. Mastering the missing high-demand competencies below will boost your profile to Top 10% Industry Readiness.`}
                  </p>
                </div>

                {/* Missing Competencies */}
                <div>
                  <h4 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 800, color: P.ink }}>
                    Critical Skill Gaps Identified
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {(gapAnalysis.missingSkills || ['Docker & Containerization', 'Kubernetes Orchestration', 'Microservices Architecture', 'GraphQL & Redis Caching']).map((sk, idx) => (
                      <div key={idx} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: 12, borderRadius: 10,
                        background: 'rgba(239,68,68,0.05)',
                        border: '1px solid rgba(239,68,68,0.15)',
                        fontSize: 13, fontWeight: 600, color: '#dc2626'
                      }}>
                        <AlertCircle size={16} />
                        {sk}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actionable Recommendations */}
                <div>
                  <h4 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 800, color: P.ink }}>
                    Suggested Learning Plan (Next 4-6 Weeks)
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(gapAnalysis.recommendations || [
                      'Complete the "Docker & Kubernetes for Cloud Deployments" lab on SkillOS.',
                      'Build a distributed microservice project with Redis pub/sub queue.',
                      'Submit a Capstone project with automated CI/CD pipeline for Trainer endorsement.'
                    ]).map((rec, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: P.inkSoft }}>
                        <CheckCircle2 size={16} color="#16a34a" style={{ marginTop: 2, flexShrink: 0 }} />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: P.inkMute }}>
                <Compass size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                <div style={{ fontSize: 15, fontWeight: 700, color: P.inkSoft }}>No analysis generated yet</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>Select your target role and click "Run Career Gap Diagnosis" to get personalized recommendations.</div>
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </PremiumPage>
  );
}
