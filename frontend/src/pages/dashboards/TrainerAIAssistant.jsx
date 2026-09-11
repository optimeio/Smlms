import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, BookOpen, CheckSquare, Copy, Check, Download, 
  HelpCircle, RefreshCw, FileText, Plus 
} from 'lucide-react';
import { 
  PremiumPage, PageHeader, GlassCard, 
  GradientButton, Badge, SectionTitle, P 
} from '../../components/PremiumDesignSystem';

export default function TrainerAIAssistant() {
  const [taskType, setTaskType] = useState('quiz'); // 'quiz' | 'lesson' | 'rubric'
  const [topic, setTopic] = useState('React Hooks & Performance Optimization');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [questionCount, setQuestionCount] = useState(5);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setGeneratedResult(null);

    try {
      const res = await fetch('/api/ai/trainer-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType,
          topic,
          difficulty,
          questionCount: Number(questionCount),
          additionalNotes
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedResult(data.result || data);
      }
    } catch (err) {
      console.error('Failed to generate trainer content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedResult) return;
    const text = typeof generatedResult === 'string' ? generatedResult : JSON.stringify(generatedResult, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <PremiumPage>
      <PageHeader
        title="AI Trainer & Curriculum Assistant"
        subtitle="Instantly generate industry-aligned quizzes, hands-on lab exercises, and evaluation rubrics"
        emoji="✨"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 28, alignItems: 'start' }}>
        {/* Configuration Card */}
        <GlassCard>
          <SectionTitle>Generation Settings</SectionTitle>
          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: P.ink, marginBottom: 6 }}>
                Content Type
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[
                  { id: 'quiz', label: 'Quiz / Exam' },
                  { id: 'lesson', label: 'Lab Exercise' },
                  { id: 'rubric', label: 'Rubric' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTaskType(t.id)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 10,
                      border: taskType === t.id ? `2px solid ${P.primary}` : `1px solid ${P.border}`,
                      background: taskType === t.id ? 'rgba(91,92,255,0.08)' : '#fff',
                      color: taskType === t.id ? P.primary : P.inkSoft,
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: P.ink, marginBottom: 6 }}>
                Topic / Concept
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Asynchronous Node.js & Event Loop, Docker Compose"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: P.ink, marginBottom: 6 }}>
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: `1.5px solid ${P.border}`,
                    fontSize: 13
                  }}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced / Industry</option>
                </select>
              </div>

              {taskType === 'quiz' && (
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: P.ink, marginBottom: 6 }}>
                    Questions
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: `1.5px solid ${P.border}`,
                      fontSize: 13,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: P.ink, marginBottom: 6 }}>
                Specific Instructions / Context (Optional)
              </label>
              <textarea
                rows={3}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="e.g. Focus on real-world edge cases and code output analysis..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: `1.5px solid ${P.border}`,
                  fontSize: 13,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <GradientButton type="submit" disabled={loading}>
              <Sparkles size={16} />
              {loading ? 'Generating Curriculum...' : 'Generate with SkillOS AI'}
            </GradientButton>
          </form>
        </GlassCard>

        {/* Results Card */}
        <GlassCard>
          <SectionTitle
            action={
              generatedResult && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <GradientButton variant="ghost" onClick={handleCopy} style={{ padding: '6px 14px', fontSize: 12 }}>
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy'}
                  </GradientButton>
                </div>
              )
            }
          >
            <span>Generated Content</span>
            {generatedResult && <Badge color="#16a34a" bg="rgba(34,197,94,0.1)">{difficulty}</Badge>}
          </SectionTitle>

          {loading ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: P.inkSoft }}>
              <Sparkles size={36} color={P.primary} style={{ animation: 'spin 2s linear infinite', marginBottom: 12 }} />
              <div style={{ fontSize: 15, fontWeight: 700 }}>Generating {taskType} for "{topic}"...</div>
              <div style={{ fontSize: 13, color: P.inkMute, marginTop: 4 }}>SkillOS AI is structuring answers, options, and explanations.</div>
            </div>
          ) : generatedResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {Array.isArray(generatedResult.questions) ? (
                generatedResult.questions.map((q, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      background: 'rgba(0,0,0,0.02)',
                      border: `1px solid ${P.border}`
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 800, color: P.ink, marginBottom: 10 }}>
                      Q{idx + 1}. {q.question}
                    </div>
                    {q.options && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            style={{
                              padding: '8px 12px',
                              borderRadius: 8,
                              fontSize: 13,
                              background: opt === q.answer ? 'rgba(34,197,94,0.1)' : '#fff',
                              border: opt === q.answer ? '1px solid #16a34a' : `1px solid ${P.border}`,
                              color: opt === q.answer ? '#16a34a' : P.inkSoft,
                              fontWeight: opt === q.answer ? 700 : 500
                            }}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                    {q.explanation && (
                      <div style={{ fontSize: 12, color: P.inkMute, borderTop: `1px dashed ${P.border}`, paddingTop: 8, marginTop: 6 }}>
                        💡 <b>Explanation:</b> {q.explanation}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{
                  padding: 20,
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.02)',
                  border: `1px solid ${P.border}`,
                  fontSize: 14,
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  color: P.ink
                }}>
                  {typeof generatedResult === 'string' ? generatedResult : JSON.stringify(generatedResult, null, 2)}
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: P.inkMute }}>
              <BookOpen size={44} style={{ opacity: 0.3, marginBottom: 12 }} />
              <div style={{ fontSize: 15, fontWeight: 700, color: P.inkSoft }}>Ready to generate curriculum</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Select your parameters on the left and click Generate.</div>
            </div>
          )}
        </GlassCard>
      </div>
    </PremiumPage>
  );
}
