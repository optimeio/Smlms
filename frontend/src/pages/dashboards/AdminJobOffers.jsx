import React, { useState, useEffect } from 'react';

import { Send, Users, CheckCircle, Search, User } from 'lucide-react';
import { AdminPage, AdminPageHeader, AdminBadge } from '../../components/AdminDesignSystem';

import { useAuth } from '../../state/useAuth';

const API = '/api';

export default function AdminJobOffers() {
  const { user: adminUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [matchingStudents, setMatchingStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  useEffect(() => {
    fetchJobs();
    fetchStudents();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/jobs`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      // Assuming AdminPortal already has a way to fetch users, or we fetch here
      const res = await fetch(`${API}/admin/users?role=student`);
      const data = await res.json();
      if (data.success) {
        setStudents(data.users);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const handleMatchStudents = (job) => {
    setSelectedJob(job);
    setSelectedStudentIds(job.targetedStudents || []);
    
    // In a real scenario, we might do complex matching based on job.requirements vs student profile
    // Here we just show all students and let admin filter/select
    setMatchingStudents(students);
  };

  const handleToggleStudent = (studentId) => {
    if (selectedStudentIds.includes(studentId)) {
      setSelectedStudentIds(selectedStudentIds.filter(id => id !== studentId));
    } else {
      setSelectedStudentIds([...selectedStudentIds, studentId]);
    }
  };

  const handleSendToStudents = async () => {
    if (!selectedJob) return;
    try {
      const res = await fetch(`${API}/jobs/${selectedJob._id || selectedJob.id}/send`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentIds: selectedStudentIds })
      });
      const data = await res.json();
      if (data.success) {
        alert('Job offer forwarded to selected students successfully!');
        setSelectedJob(null);
        fetchJobs();
      }
    } catch (err) {
      console.error('Error sending job:', err);
      alert('Failed to send job');
    }
  };

  return (
    <AdminPage>
      <AdminPageHeader title="Job Offers Management" subtitle="Review company job offers and forward to matching students based on MBK requirements" />

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#64748B' }}>
          No job offers available.
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '24px' }}>
          {/* Jobs List */}
          <div style={{ flex: selectedJob ? '1' : '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {jobs.map(job => (
              <div key={job._id || job.id} style={{ border: '1px solid #E7E9F5', borderRadius: '12px', padding: '20px', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1B1F3B' }}>{job.title}</h3>
                    <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#64748B' }}>{job.description}</p>
                    
                    <div style={{ background: '#F8F9FC', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                      <strong style={{ fontSize: '12px', color: '#1B1F3B' }}>MBK Requirements:</strong>
                      <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                        <span>🎓 {job.requirements?.degree || 'Any'}</span>
                        <span style={{ margin: '0 8px' }}>•</span>
                        <span>⏱️ {job.requirements?.experience || 'Any'}</span>
                        <span style={{ margin: '0 8px' }}>•</span>
                        <span>💻 {job.requirements?.skills?.join(', ') || 'None specified'}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <AdminBadge status={job.status} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #E7E9F5', paddingTop: '16px' }}>
                  <button
                    onClick={() => handleMatchStudents(job)}
                    style={{ background: '#4C5FD5', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    <Users size={16} /> Find Matching Students
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Student Matching Sidebar */}
          {selectedJob && (
            <div style={{ flex: '1', border: '1px solid #E7E9F5', borderRadius: '12px', background: '#fff', padding: '24px', position: 'sticky', top: '24px', height: 'calc(100vh - 100px)', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>Target Students</h3>
                <button onClick={() => setSelectedJob(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
              </div>
              <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>Select students who meet the MBK requirements for <strong>{selectedJob.title}</strong>.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {matchingStudents.map(student => {
                  const isSelected = selectedStudentIds.includes(student._id || student.id || student.email);
                  const sId = student._id || student.id || student.email;
                  return (
                    <div key={sId} onClick={() => handleToggleStudent(sId)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: `1px solid ${isSelected ? '#4C5FD5' : '#E7E9F5'}`, borderRadius: '8px', cursor: 'pointer', background: isSelected ? '#F5F7FF' : '#fff' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${isSelected ? '#4C5FD5' : '#CBD5E1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4C5FD5' }} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1B1F3B' }}>{student.fullName || student.email}</div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>{student.college} • {student.department}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleSendToStudents}
                disabled={selectedStudentIds.length === 0}
                style={{ width: '100%', padding: '12px', background: selectedStudentIds.length > 0 ? '#10B981' : '#CBD5E1', color: '#fff', border: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', cursor: selectedStudentIds.length > 0 ? 'pointer' : 'not-allowed' }}
              >
                <Send size={18} /> Send to {selectedStudentIds.length} Students
              </button>
            </div>
          )}
        </div>
      )}
    </AdminPage>
  );
}
