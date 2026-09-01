import React, { useState, useEffect } from 'react';
import { useAuth } from '../../state/useAuth';
import { PremiumPage, PageHeader, GlassCard, GradientButton, Badge, EmptyState, P } from '../../components/PremiumDesignSystem';
import { FileText, Clock, User, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrainerAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [grading, setGrading] = useState(false);
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', courseTitle: '' });
  const [creating, setCreating] = useState(false);

  const fetchAssignments = async () => {
    try {
      const res = await fetch('/api/assignments');
      const data = await res.json();
      if (data.success) {
        // Filter assignments created by this trainer (or company)
        const myAssignments = data.assignments.filter(a => a.createdBy === user.email);
        setAssignments(myAssignments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [user]);

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    setGrading(true);
    try {
      const res = await fetch(`/api/assignments/${selectedAssignmentId}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentEmail: selectedSubmission.studentEmail, grade, feedback })
      });
      const data = await res.json();
      if (data.success) {
        alert('Grade submitted successfully!');
        setSelectedSubmission(null);
        setSelectedAssignmentId(null);
        setGrade('');
        setFeedback('');
        fetchAssignments();
      } else {
        alert('Failed to submit grade');
      }
    } catch (err) {
      alert('Error submitting grade');
    } finally {
      setGrading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newAssignment,
          createdBy: user.email,
          assignedTo: [] // assign to all for now
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Assignment created successfully!');
        setIsCreatingAssignment(false);
        setNewAssignment({ title: '', description: '', dueDate: '', courseTitle: '' });
        fetchAssignments();
      } else {
        alert('Failed to create assignment');
      }
    } catch (err) {
      alert('Error creating assignment');
    } finally {
      setCreating(false);
    }
  };

  return (
    <PremiumPage>
      <PageHeader 
        title="Manage Assignments" 
        subtitle="Review student submissions, provide feedback, or create new assignments."
        emoji="👨‍🏫"
        action={
          <GradientButton variant="primary" onClick={() => setIsCreatingAssignment(true)}>
            + Create Assignment
          </GradientButton>
        }
      />
      
      {loading ? (
        <p style={{ color: P.inkMute }}>Loading assignments...</p>
      ) : assignments.length === 0 ? (
        <GlassCard>
          <EmptyState 
            icon={<FileText size={48} />}
            title="No assignments created"
            subtitle="You haven't created any assignments yet."
          />
        </GlassCard>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {assignments.map(assignment => (
            <GlassCard key={assignment._id || assignment.id} style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20, color: P.ink, fontFamily: P.font }}>{assignment.title}</h3>
                  <p style={{ margin: '4px 0 0', fontSize: 14, color: P.inkSoft }}>Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                </div>
                <Badge variant="primary">{assignment.submissions?.length || 0} Submissions</Badge>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {!assignment.submissions || assignment.submissions.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', background: '#F8FAFC', borderRadius: 12, color: P.inkMute }}>
                    No students have submitted this assignment yet.
                  </div>
                ) : (
                  assignment.submissions.map(sub => (
                    <div key={sub.studentEmail} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: '#F8FAFC', borderRadius: 12, border: `1px solid ${P.border}` }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <User size={14} color={P.inkSoft} />
                          <span style={{ fontWeight: 600, color: P.ink, fontSize: 14 }}>{sub.studentEmail}</span>
                        </div>
                        <a href={sub.fileUrl} target="_blank" rel="noreferrer" style={{ color: P.primary, fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <FileText size={12} /> View Submission
                        </a>
                      </div>
                      
                      {sub.grade ? (
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#166534', fontWeight: 600, fontSize: 14 }}>
                            <CheckCircle size={14} /> Graded: {sub.grade}
                          </div>
                        </div>
                      ) : (
                        <GradientButton variant="primary" onClick={() => { setSelectedSubmission(sub); setSelectedAssignmentId(assignment._id || assignment.id); }}>
                          Grade Now
                        </GradientButton>
                      )}
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {selectedSubmission && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: P.surface, padding: 32, borderRadius: 24, width: '100%', maxWidth: 500 }}>
            <h2 style={{ margin: '0 0 8px', fontFamily: P.font, color: P.ink }}>Grade Submission</h2>
            <p style={{ margin: '0 0 24px', color: P.inkSoft }}>Student: {selectedSubmission.studentEmail}</p>
            
            <form onSubmit={handleGradeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: P.inkSoft }}>Grade / Score</label>
                <input 
                  type="text" 
                  value={grade} 
                  onChange={e => setGrade(e.target.value)}
                  placeholder="e.g. 95/100 or A+"
                  required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: `1px solid ${P.border}`, fontSize: 14 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: P.inkSoft }}>Feedback</label>
                <textarea 
                  value={feedback} 
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Great job on..."
                  rows={4}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: `1px solid ${P.border}`, fontSize: 14, resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <GradientButton type="button" variant="outline" onClick={() => setSelectedSubmission(null)} style={{ flex: 1 }}>Cancel</GradientButton>
                <GradientButton type="submit" variant="primary" disabled={grading} style={{ flex: 1 }}>
                  {grading ? 'Submitting...' : 'Submit Grade'}
                </GradientButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {isCreatingAssignment && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: P.surface, padding: 32, borderRadius: 24, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 24px', fontFamily: P.font, color: P.ink }}>Create New Assignment</h2>
            
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: P.inkSoft }}>Assignment Title</label>
                <input 
                  type="text" 
                  value={newAssignment.title} 
                  onChange={e => setNewAssignment({...newAssignment, title: e.target.value})}
                  required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: `1px solid ${P.border}`, fontSize: 14 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: P.inkSoft }}>Description</label>
                <textarea 
                  value={newAssignment.description} 
                  onChange={e => setNewAssignment({...newAssignment, description: e.target.value})}
                  required
                  rows={4}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: `1px solid ${P.border}`, fontSize: 14, resize: 'vertical' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: P.inkSoft }}>Course Title (Optional)</label>
                <input 
                  type="text" 
                  value={newAssignment.courseTitle} 
                  onChange={e => setNewAssignment({...newAssignment, courseTitle: e.target.value})}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: `1px solid ${P.border}`, fontSize: 14 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: P.inkSoft }}>Due Date</label>
                <input 
                  type="date" 
                  value={newAssignment.dueDate} 
                  onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                  required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: `1px solid ${P.border}`, fontSize: 14 }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <GradientButton type="button" variant="outline" onClick={() => setIsCreatingAssignment(false)} style={{ flex: 1 }}>Cancel</GradientButton>
                <GradientButton type="submit" variant="primary" disabled={creating} style={{ flex: 1 }}>
                  {creating ? 'Creating...' : 'Create Assignment'}
                </GradientButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </PremiumPage>
  );
}