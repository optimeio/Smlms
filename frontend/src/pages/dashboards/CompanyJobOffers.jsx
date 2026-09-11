import React, { useState, useEffect } from 'react';
import { 
  Plus, Users, CheckCircle, RefreshCw, Briefcase, Mail, Phone, 
  MapPin, ExternalLink, Download, MessageSquare, Award, Clock, 
  Check, X, Search, FileText, ChevronRight, Sparkles 
} from 'lucide-react';
import { useAuth } from '../../state/useAuth';

const API = '/api';

export default function CompanyJobOffers() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'postings'
  
  // Jobs state
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
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

  // Applications state (Admin verified only)
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [appSearch, setAppSearch] = useState('');
  const [appFilter, setAppFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const companyId = user?._id || user?.id || user?.email;
      const res = await fetch(`${API}/jobs?companyId=${encodeURIComponent(companyId || '')}`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoadingApps(true);
      const companyId = user?.email || user?._id || user?.id;
      const res = await fetch(`${API}/job-applications?companyId=${encodeURIComponent(companyId || '')}`);
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error('Error fetching company job applications:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchJobs();
      fetchApplications();
    }
  }, [user]);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = formData.requirements.skills.split(',').map(s => s.trim());
      const payload = {
        companyId: user?.email || user?._id || user?.id,
        companyName: user?.companyName || user?.fullName || 'Company Partner',
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

  const handleUpdateAppStatus = async (appId, newStatus) => {
    try {
      setActionLoading(appId);
      const res = await fetch(`${API}/job-applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchApplications();
      } else {
        alert(data.message || 'Failed to update candidate status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Network error while updating status.');
    } finally {
      setActionLoading(null);
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

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      (app.applicantName && app.applicantName.toLowerCase().includes(appSearch.toLowerCase())) ||
      (app.applicantEmail && app.applicantEmail.toLowerCase().includes(appSearch.toLowerCase())) ||
      (app.jobTitle && app.jobTitle.toLowerCase().includes(appSearch.toLowerCase())) ||
      (app.college && app.college.toLowerCase().includes(appSearch.toLowerCase()));

    if (!matchesSearch) return false;
    if (appFilter === 'all') return true;
    return app.status === appFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Forwarded to Company':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: '#D1FAE5', color: '#065F46', borderRadius: '12px', fontSize: '12px', fontWeight: '700', border: '1px solid #A7F3D0' }}>
            <CheckCircle size={12} /> Verified by Admin
          </span>
        );
      case 'Shortlisted by Company':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: '#E0E7FF', color: '#4338CA', borderRadius: '12px', fontSize: '12px', fontWeight: '700', border: '1px solid #C7D2FE' }}>
            <Award size={12} /> Shortlisted
          </span>
        );
      case 'Selected by Company':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: '#ECFDF5', color: '#047857', borderRadius: '12px', fontSize: '12px', fontWeight: '700', border: '1px solid #6EE7B7' }}>
            🎉 Selected & Hired
          </span>
        );
      case 'Rejected':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: '#FEE2E2', color: '#DC2626', borderRadius: '12px', fontSize: '12px', fontWeight: '700', border: '1px solid #FECACA' }}>
            <X size={12} /> Rejected
          </span>
        );
      default:
        return (
          <span style={{ padding: '4px 10px', background: '#F1F5F9', color: '#64748B', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
            {status}
          </span>
        );
    }
  };

  return (
    <div style={{ padding: '28px', background: '#fff', borderRadius: '16px', minHeight: '650px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', margin: '0 0 6px 0' }}>
            Company Recruitment & Hiring Portal
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#64748B' }}>
            Access verified candidate applications forwarded by the MBK Admin team and manage your job listings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => { fetchJobs(); fetchApplications(); }}
            style={{ padding: '9px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#334155' }}
          >
            <RefreshCw size={15} /> Refresh
          </button>
          <button
            onClick={() => setShowModal(true)}
            style={{ padding: '9px 18px', borderRadius: '10px', background: 'linear-gradient(135deg, #4F46E5, #6366F1)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)' }}
          >
            <Plus size={16} /> Post New Job
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '2px solid #F1F5F9', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('applications')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '10px',
            background: activeTab === 'applications' ? '#4F46E5' : '#F8FAFC',
            color: activeTab === 'applications' ? '#fff' : '#475569',
            border: activeTab === 'applications' ? 'none' : '1px solid #E2E8F0',
            fontWeight: '700', fontSize: '14px', cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'applications' ? '0 4px 12px rgba(79, 70, 229, 0.25)' : 'none'
          }}
        >
          <Users size={18} /> Verified Candidate Applications
          <span style={{
            background: activeTab === 'applications' ? 'rgba(255,255,255,0.3)' : '#10B981',
            color: '#fff', fontSize: '11px', fontWeight: '800',
            padding: '2px 8px', borderRadius: '12px'
          }}>
            {applications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('postings')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '10px',
            background: activeTab === 'postings' ? '#4F46E5' : '#F8FAFC',
            color: activeTab === 'postings' ? '#fff' : '#475569',
            border: activeTab === 'postings' ? 'none' : '1px solid #E2E8F0',
            fontWeight: '700', fontSize: '14px', cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'postings' ? '0 4px 12px rgba(79, 70, 229, 0.25)' : 'none'
          }}
        >
          <Briefcase size={18} /> Posted Job Openings
          <span style={{
            background: activeTab === 'postings' ? 'rgba(255,255,255,0.3)' : '#E2E8F0',
            color: activeTab === 'postings' ? '#fff' : '#64748B',
            fontSize: '11px', fontWeight: '800',
            padding: '2px 8px', borderRadius: '12px'
          }}>
            {jobs.length}
          </span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: VERIFIED CANDIDATE APPLICATIONS (ADMIN FORWARDED)    */}
      {/* ============================================================ */}
      {activeTab === 'applications' && (
        <div>
          {/* Search & Filter Header */}
          <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '14px 18px', border: '1px solid #E2E8F0', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '8px 14px', flex: '1', minWidth: '260px' }}>
              <Search size={16} color="#64748B" />
              <input
                type="text"
                value={appSearch}
                onChange={e => setAppSearch(e.target.value)}
                placeholder="Search candidates by name, email, skills, or degree..."
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px', color: '#1E293B' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { key: 'all', label: 'All Verified' },
                { key: 'Forwarded to Company', label: 'New Inflow' },
                { key: 'Shortlisted by Company', label: 'Shortlisted' },
                { key: 'Selected by Company', label: 'Selected' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setAppFilter(tab.key)}
                  style={{
                    padding: '6px 14px', borderRadius: '20px',
                    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                    background: appFilter === tab.key ? '#4F46E5' : '#fff',
                    color: appFilter === tab.key ? '#fff' : '#475569',
                    border: '1px solid #E2E8F0', transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {loadingApps ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
              <p>Loading candidate applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#F8FAFC', borderRadius: '12px', border: '1px dashed #CBD5E1', color: '#64748B' }}>
              <Sparkles size={40} style={{ margin: '0 auto 12px', color: '#6366F1' }} />
              <h3 style={{ margin: '0 0 6px 0', color: '#1E293B' }}>No Candidate Applications Yet</h3>
              <p style={{ margin: 0, fontSize: '14px', maxWidth: '460px', marginInline: 'auto' }}>
                When students apply for your jobs and MBK Administrators verify their credentials, their complete candidate profiles will appear here for shortlisting and hiring.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {filteredApplications.map(app => {
                const appId = app._id || app.id;
                const isShortlisted = app.status === 'Shortlisted by Company';
                const isSelected = app.status === 'Selected by Company';

                return (
                  <div
                    key={appId}
                    style={{
                      background: '#fff', borderRadius: '14px',
                      border: isSelected ? '2px solid #10B981' : isShortlisted ? '2px solid #6366F1' : '1px solid #E2E8F0',
                      padding: '22px', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.04)'
                    }}
                  >
                    {/* Header Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <h3 style={{ margin: 0, fontSize: '19px', fontWeight: '800', color: '#0F172A' }}>
                            {app.applicantName}
                          </h3>
                          {getStatusBadge(app.status)}
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                          <span style={{ color: '#4F46E5', fontWeight: '700' }}>Target: {app.jobTitle}</span>
                          <span>•</span>
                          <span>Applied on: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recent'}</span>
                        </div>
                      </div>

                      {/* Direct Outreach Contact Badges */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {app.applicantEmail && (
                          <a
                            href={`mailto:${app.applicantEmail}?subject=Regarding Your Application for ${encodeURIComponent(app.jobTitle)}`}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '6px',
                              padding: '6px 12px', borderRadius: '8px',
                              background: '#EEF2FF', color: '#4338CA', textDecoration: 'none',
                              fontSize: '12px', fontWeight: '700', border: '1px solid #C7D2FE'
                            }}
                          >
                            <Mail size={13} /> Email Candidate
                          </a>
                        )}
                        {app.applicantPhone && (
                          <a
                            href={`https://wa.me/${app.applicantPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '6px',
                              padding: '6px 12px', borderRadius: '8px',
                              background: '#ECFDF5', color: '#047857', textDecoration: 'none',
                              fontSize: '12px', fontWeight: '700', border: '1px solid #A7F3D0'
                            }}
                          >
                            <MessageSquare size={13} /> WhatsApp
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Candidate Academic & Skill Details */}
                    <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '14px 18px', marginBottom: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>🎓 Qualification</div>
                        <div style={{ fontSize: '13px', color: '#1E293B', fontWeight: '600', marginTop: '2px' }}>
                          {app.qualification || 'B.Tech / Degree'} • {app.college || 'MBK Partner College'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>⏱️ Experience</div>
                        <div style={{ fontSize: '13px', color: '#1E293B', fontWeight: '600', marginTop: '2px' }}>
                          {app.experience || 'Fresher'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>💻 Verified Skills</div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                          {Array.isArray(app.skills) && app.skills.length > 0 ? (
                            app.skills.map((s, idx) => (
                              <span key={idx} style={{ background: '#E0E7FF', color: '#3730A3', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px' }}>
                                {s}
                              </span>
                            ))
                          ) : (
                            <span style={{ fontSize: '12px', color: '#64748B' }}>General Skills</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Cover Letter / Notes */}
                    {app.coverLetter && (
                      <div style={{ background: '#FFFBEB', border: '1px solid #FEF3C7', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' }}>
                        <div style={{ fontSize: '11px', color: '#B45309', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
                          Candidate Pitch / Cover Letter:
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#78350F', lineHeight: '1.5' }}>
                          "{app.coverLetter}"
                        </p>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '14px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {app.resumeUrl && (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '6px',
                              padding: '7px 14px', borderRadius: '8px',
                              background: '#4F46E5', color: '#fff',
                              fontSize: '12px', fontWeight: '700', textDecoration: 'none'
                            }}
                          >
                            <Download size={14} /> View / Download Resume
                          </a>
                        )}
                        {app.linkedin && (
                          <a
                            href={app.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '4px',
                              padding: '6px 10px', borderRadius: '8px',
                              background: '#F1F5F9', color: '#0A66C2',
                              fontSize: '12px', fontWeight: '600', textDecoration: 'none', border: '1px solid #E2E8F0'
                            }}
                          >
                            <ExternalLink size={12} /> LinkedIn
                          </a>
                        )}
                        {app.portfolio && (
                          <a
                            href={app.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '4px',
                              padding: '6px 10px', borderRadius: '8px',
                              background: '#F1F5F9', color: '#4F46E5',
                              fontSize: '12px', fontWeight: '600', textDecoration: 'none', border: '1px solid #E2E8F0'
                            }}
                          >
                            <ExternalLink size={12} /> Portfolio
                          </a>
                        )}
                      </div>

                      {/* Hiring Decision Controls */}
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {!isShortlisted && !isSelected && (
                          <button
                            onClick={() => handleUpdateAppStatus(appId, 'Shortlisted by Company')}
                            disabled={actionLoading === appId}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '6px',
                              padding: '8px 14px', borderRadius: '8px',
                              background: '#EEF2FF', color: '#4338CA',
                              border: '1px solid #C7D2FE', fontWeight: '700', fontSize: '13px',
                              cursor: 'pointer'
                            }}
                          >
                            <Award size={14} /> Shortlist
                          </button>
                        )}

                        {!isSelected ? (
                          <button
                            onClick={() => handleUpdateAppStatus(appId, 'Selected by Company')}
                            disabled={actionLoading === appId}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '6px',
                              padding: '8px 18px', borderRadius: '8px',
                              background: 'linear-gradient(135deg, #10B981, #059669)',
                              color: '#fff', border: 'none', fontWeight: '700', fontSize: '13px',
                              cursor: 'pointer', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
                            }}
                          >
                            <CheckCircle size={15} /> Select & Hire Candidate
                          </button>
                        ) : (
                          <span style={{ fontSize: '13px', color: '#059669', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Check size={18} /> Candidate Selected for Hiring
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: POSTED JOB OPENINGS                                  */}
      {/* ============================================================ */}
      {activeTab === 'postings' && (
        <div>
          {loadingJobs ? (
            <p>Loading job offers...</p>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#64748B' }}>
              No job offers found. Click "Post New Job" to create one.
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
        </div>
      )}

      {/* Modal for Creating New Job */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '500px', color: '#1B1F3B' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', color: '#1B1F3B' }}>Create New Job Offer</h3>
            <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold', color: '#475569' }}>Job Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Full Stack Developer" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E7E9F5', boxSizing: 'border-box', color: '#1B1F3B', background: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold', color: '#475569' }}>Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Key responsibilities and qualifications..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E7E9F5', boxSizing: 'border-box', minHeight: '80px', color: '#1B1F3B', background: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold', color: '#475569' }}>Required Degree (MBK)</label>
                <input required type="text" value={formData.requirements.degree} onChange={e => setFormData({...formData, requirements: {...formData.requirements, degree: e.target.value}})} placeholder="e.g., B.Tech / BCA / MCA" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E7E9F5', boxSizing: 'border-box', color: '#1B1F3B', background: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold', color: '#475569' }}>Required Experience (MBK)</label>
                <input required type="text" value={formData.requirements.experience} onChange={e => setFormData({...formData, requirements: {...formData.requirements, experience: e.target.value}})} placeholder="e.g., 0-2 Years" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E7E9F5', boxSizing: 'border-box', color: '#1B1F3B', background: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold', color: '#475569' }}>Required Skills (comma separated)</label>
                <input required type="text" value={formData.requirements.skills} onChange={e => setFormData({...formData, requirements: {...formData.requirements, skills: e.target.value}})} placeholder="e.g., React, Node.js, Python" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E7E9F5', boxSizing: 'border-box', color: '#1B1F3B', background: '#fff' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #E7E9F5', background: '#fff', color: '#1B1F3B', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#4C5FD5', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Submit Offer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
