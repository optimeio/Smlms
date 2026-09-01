import React, { useState, useEffect } from 'react';
import { useAuth } from '../../state/useAuth';
import { PremiumPage, PageHeader, GlassCard, GradientButton, Badge, EmptyState, P } from '../../components/PremiumDesignSystem';
import { FileText, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [submissionType, setSubmissionType] = useState('link'); // 'link' or 'file'
  const [fileBase64, setFileBase64] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, [user]);

  const fetchAssignments = async () => {
    try {
      const res = await fetch('/api/assignments');
      const data = await res.json();
      if (data.success) {
        // Only show assignments assigned to this student or where assignedTo is empty (all)
        const myAssignments = data.assignments.filter(a => 
          a.assignedTo.length === 0 || a.assignedTo.includes(user.email)
        );
        setAssignments(myAssignments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalUrl = submissionType === 'link' ? fileUrl : fileBase64;
    if (!finalUrl) {
      alert('Please provide a link or upload a file.');
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch(`/api/assignments/${selectedAssignment._id || selectedAssignment.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentEmail: user.email, fileUrl: finalUrl })
      });
      const data = await res.json();
      if (data.success) {
        alert('Assignment submitted successfully!');
        setSelectedAssignment(null);
        setFileUrl('');
        setFileBase64('');
        fetchAssignments(); // refresh
      } else {
        alert('Failed to submit assignment');
      }
    } catch (err) {
      alert('Error submitting assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFileBase64(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const getSubmission = (assignment) => {
    if (!assignment.submissions) return null;
    return assignment.submissions.find(s => s.studentEmail === user.email);
  };

  return (
    <PremiumPage>
      <PageHeader 
        title="My Assignments" 
        subtitle="View your tasks, submit work, and check your grades."
        emoji="📝"
      />
      
      {loading ? (
        <p style={{ color: P.inkMute }}>Loading assignments...</p>
      ) : assignments.length === 0 ? (
        <GlassCard>
          <EmptyState 
            icon={<FileText size={48} />}
            title="No assignments yet"
            subtitle="You don't have any pending assignments."
          />
        </GlassCard>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {assignments.map(assignment => {
            const submission = getSubmission(assignment);
            const isSubmitted = !!submission;
            const isGraded = submission && submission.grade !== null && submission.grade !== undefined;
            
            return (
              <GlassCard key={assignment._id || assignment.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 18, color: P.ink, fontFamily: P.font }}>{assignment.title}</h3>
                  {isGraded ? (
                    <Badge variant="success">Graded</Badge>
                  ) : isSubmitted ? (
                    <Badge variant="primary">Submitted</Badge>
                  ) : (
                    <Badge variant="warning">Pending</Badge>
                  )}
                </div>
                
                <p style={{ margin: '0 0 16px', fontSize: 14, color: P.inkSoft, flex: 1 }}>{assignment.description}</p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: P.inkMute, marginBottom: 20 }}>
                  <Clock size={14} />
                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
                
                {isGraded ? (
                  <div style={{ background: '#F0FDF4', padding: 12, borderRadius: 8, border: '1px solid #BBF7D0', marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#166534' }}>Grade</span>
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#15803D' }}>{submission.grade}</span>
                    </div>
                    {submission.feedback && (
                      <p style={{ margin: 0, fontSize: 13, color: '#166534' }}>"{submission.feedback}"</p>
                    )}
                  </div>
                ) : null}

                {!isSubmitted ? (
                  <GradientButton variant="primary" onClick={() => setSelectedAssignment(assignment)} style={{ width: '100%' }}>
                    Submit Work
                  </GradientButton>
                ) : !isGraded ? (
                  <GradientButton variant="outline" onClick={() => setSelectedAssignment(assignment)} style={{ width: '100%' }}>
                    Update Submission
                  </GradientButton>
                ) : (
                  <GradientButton variant="outline" disabled style={{ width: '100%', opacity: 0.7 }}>
                    Graded (Locked)
                  </GradientButton>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}

      {selectedAssignment && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: P.surface, padding: 32, borderRadius: 24, width: '100%', maxWidth: 500 }}>
            <h2 style={{ margin: '0 0 8px', fontFamily: P.font, color: P.ink }}>Submit Assignment</h2>
            <p style={{ margin: '0 0 24px', color: P.inkSoft }}>{selectedAssignment.title}</p>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer', color: P.inkSoft }}>
                  <input type="radio" name="subType" checked={submissionType === 'link'} onChange={() => setSubmissionType('link')} />
                  URL Link
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer', color: P.inkSoft }}>
                  <input type="radio" name="subType" checked={submissionType === 'file'} onChange={() => setSubmissionType('file')} />
                  File Upload
                </label>
              </div>

              {submissionType === 'link' ? (
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: P.inkSoft }}>Submission URL (Github/Drive link)</label>
                  <input 
                    type="url" 
                    value={fileUrl} 
                    onChange={e => setFileUrl(e.target.value)}
                    placeholder="https://github.com/your/repo"
                    required={submissionType === 'link'}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: `1px solid ${P.border}`, fontSize: 14 }}
                  />
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: P.inkSoft }}>Upload Assignment File</label>
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    required={submissionType === 'file'}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: `1px solid ${P.border}`, fontSize: 14 }}
                  />
                </div>
              )}
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <GradientButton type="button" variant="outline" onClick={() => setSelectedAssignment(null)} style={{ flex: 1 }}>Cancel</GradientButton>
                <GradientButton type="submit" variant="primary" disabled={submitting} style={{ flex: 1 }}>
                  {submitting ? 'Submitting...' : 'Submit Work'}
                </GradientButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </PremiumPage>
  );
}