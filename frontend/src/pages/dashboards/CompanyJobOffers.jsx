import React, { useState, useEffect } from 'react';

import { Plus, Users, CheckCircle, RefreshCw } from 'lucide-react';

import { useAuth } from '../../state/useAuth';

const API = '/api';

export default function CompanyJobOffers() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: {
      skills: '',
      degree: '',
      experience: ''
    }
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/jobs?companyId=${user._id || user.id}`);
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

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = formData.requirements.skills.split(',').map(s => s.trim());
      const payload = {
        companyId: user._id || user.id,
        title: formData.title,
        description: formData.description,
        requirements: {
          ...formData.requirements,
          skills: skillsArray
        }
      };
      const res = await fetch(`${API}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setJobs([data.job, ...jobs]);
        setShowModal(false);
        setFormData({ title: '', description: '', requirements: { skills: '', degree: '', experience: '' } });
      }
    } catch (err) {
      console.error('Error creating job:', err);
      alert('Failed to create job offer');
    }
  };

  const handleSelectStudent = async (jobId, studentId) => {
    try {
      const res = await fetch(`${API}/jobs/${jobId}/select`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
      });
      const data = await res.json();
      if (data.success) {
        alert('Student selected successfully!');
        fetchJobs();
      }
    } catch (err) {
      console.error('Error selecting student:', err);
    }
  };

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', minHeight: '600px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1B1F3B' }}>Job Offers</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={fetchJobs}
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #E7E9F5', background: '#fff', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            onClick={() => setShowModal(true)}
            style={{ padding: '8px 16px', borderRadius: '8px', background: '#4C5FD5', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            <Plus size={16} /> New Job Offer
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading job offers...</p>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#64748B' }}>
          No job offers found. Click "New Job Offer" to create one.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {jobs.map(job => (
            <div key={job._id || job.id} style={{ border: '1px solid #E7E9F5', borderRadius: '12px', padding: '20px', background: '#F8F9FC' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#1B1F3B', fontSize: '18px' }}>{job.title}</h3>
              <span style={{ display: 'inline-block', padding: '4px 12px', background: job.status === 'Pending' ? '#FEF3C7' : '#D1FAE5', color: job.status === 'Pending' ? '#D97706' : '#059669', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', marginBottom: '12px' }}>
                {job.status}
              </span>
              <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px' }}>{job.description}</p>
              
              <div style={{ marginBottom: '16px' }}>
                <strong style={{ fontSize: '12px', color: '#1B1F3B' }}>MBK Requirements:</strong>
                <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', fontSize: '13px', color: '#475569' }}>
                  <li><strong>Degree:</strong> {job.requirements?.degree}</li>
                  <li><strong>Experience:</strong> {job.requirements?.experience}</li>
                  <li><strong>Skills:</strong> {job.requirements?.skills?.join(', ')}</li>
                </ul>
              </div>

              {job.targetedStudents && job.targetedStudents.length > 0 && (
                <div style={{ marginTop: '16px', borderTop: '1px solid #E7E9F5', paddingTop: '16px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#1B1F3B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={16} /> Students Forwarded by Admin ({job.targetedStudents.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {job.targetedStudents.map(studentId => {
                      const isSelected = job.selectedStudents && job.selectedStudents.includes(studentId);
                      return (
                        <div key={studentId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E7E9F5' }}>
                          <span style={{ fontSize: '13px', color: '#475569' }}>Student ID: {studentId}</span>
                          {isSelected ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#10B981', fontWeight: 'bold' }}>
                              <CheckCircle size={14} /> Selected
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSelectStudent(job._id || job.id, studentId)}
                              style={{ background: '#4C5FD5', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
                            >
                              Select Student
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '20px' }}>Create New Job Offer</h3>
            <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold' }}>Job Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E7E9F5', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold' }}>Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E7E9F5', boxSizing: 'border-box', minHeight: '80px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold' }}>Required Degree (MBK)</label>
                <input required type="text" value={formData.requirements.degree} onChange={e => setFormData({...formData, requirements: {...formData.requirements, degree: e.target.value}})} placeholder="e.g., B.Tech Computer Science" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E7E9F5', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold' }}>Required Experience (MBK)</label>
                <input required type="text" value={formData.requirements.experience} onChange={e => setFormData({...formData, requirements: {...formData.requirements, experience: e.target.value}})} placeholder="e.g., 0-2 Years" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E7E9F5', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold' }}>Required Skills (comma separated)</label>
                <input required type="text" value={formData.requirements.skills} onChange={e => setFormData({...formData, requirements: {...formData.requirements, skills: e.target.value}})} placeholder="e.g., React, Node.js, Python" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E7E9F5', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #E7E9F5', background: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#4C5FD5', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Submit Offer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
