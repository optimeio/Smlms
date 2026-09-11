import React, { useState, useEffect } from 'react';
import { 
  Send, Users, CheckCircle, Search, User, Briefcase, Building2, 
  FileText, ExternalLink, Mail, Phone, MapPin, Award, Check, X, 
  Clock, ArrowRight, Filter, AlertCircle, Eye, ChevronDown, ChevronUp, Download
} from 'lucide-react';
import { AdminPage, AdminPageHeader, AdminBadge } from '../../components/AdminDesignSystem';
import { useAuth } from '../../state/useAuth';

const API = '/api';

export default function AdminJobOffers() {
  const { user: adminUser } = useAuth();
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'jobs'
  
  // Jobs state
  const [jobs, setJobs] = useState([]);
  const [students, setStudents] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [matchingStudents, setMatchingStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  // Applications state
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [appSearch, setAppSearch] = useState('');
  const [appFilter, setAppFilter] = useState('all'); // 'all' | 'Pending Admin Approval' | 'Forwarded to Company' | 'Rejected'
  const [selectedAppDetail, setSelectedAppDetail] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(null); // { appId, action: 'approve' | 'reject' }

  useEffect(() => {
    fetchJobs();
    fetchStudents();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const res = await fetch(`${API}/jobs`);
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

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API}/admin/users?role=student`);
      const data = await res.json();
      if (data.success) {
        setStudents(data.users || []);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoadingApps(true);
      const res = await fetch(`${API}/job-applications`);
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleMatchStudents = (job) => {
    setSelectedJob(job);
    setSelectedStudentIds(job.targetedStudents || []);
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

  const handleApproveJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to approve this job for the public Job Fair?')) return;
    try {
      const res = await fetch(`${API}/jobs/${jobId}/approve`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (data.success) {
        alert('Job approved and is now visible on the Job Fair page!');
        fetchJobs();
      } else {
        alert(data.message || 'Failed to approve job');
      }
    } catch (err) {
      console.error('Error approving job:', err);
      alert('Failed to approve job');
    }
  };

  // Application Approval / Rejection Handlers
  const handleApproveApplication = async (appId, notes = '') => {
    try {
      setActionLoading(appId);
      const res = await fetch(`${API}/job-applications/${appId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes: notes })
      });
      const data = await res.json();
      if (data.success) {
        alert('Application approved and forwarded to the hiring company dashboard!');
        setShowNoteModal(null);
        setAdminNoteInput('');
        fetchApplications();
      } else {
        alert(data.message || 'Failed to approve application');
      }
    } catch (err) {
      console.error('Error approving application:', err);
      alert('Network error while approving application.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectApplication = async (appId, reason = '') => {
    try {
      setActionLoading(appId);
      const res = await fetch(`${API}/job-applications/${appId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason || 'Application did not match company criteria at this time.' })
      });
      const data = await res.json();
      if (data.success) {
        alert('Application marked as Rejected.');
        setShowNoteModal(null);
        setAdminNoteInput('');
        fetchApplications();
      } else {
        alert(data.message || 'Failed to reject application');
      }
    } catch (err) {
      console.error('Error rejecting application:', err);
      alert('Network error while updating application.');
    } finally {
      setActionLoading(null);
    }
  };

  const pendingAppsCount = applications.filter(a => a.status === 'Pending Admin Approval').length;
  const forwardedAppsCount = applications.filter(a => a.status === 'Forwarded to Company' || a.status === 'Shortlisted by Company' || a.status === 'Selected by Company').length;
  const selectedAppsCount = applications.filter(a => a.status === 'Selected by Company').length;

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      (app.applicantName && app.applicantName.toLowerCase().includes(appSearch.toLowerCase())) ||
      (app.applicantEmail && app.applicantEmail.toLowerCase().includes(appSearch.toLowerCase())) ||
      (app.jobTitle && app.jobTitle.toLowerCase().includes(appSearch.toLowerCase())) ||
      (app.companyName && app.companyName.toLowerCase().includes(appSearch.toLowerCase())) ||
      (app.college && app.college.toLowerCase().includes(appSearch.toLowerCase()));

    if (!matchesSearch) return false;
    if (appFilter === 'all') return true;
    return appFilter === 'forwarded' 
      ? ['Forwarded to Company', 'Shortlisted by Company', 'Selected by Company'].includes(app.status)
      : app.status === appFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending Admin Approval':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: '#FEF3C7', color: '#D97706', borderRadius: '12px', fontSize: '12px', fontWeight: '700', border: '1px solid #FDE68A' }}>
            <Clock size={12} /> Pending Admin Review
          </span>
        );
      case 'Forwarded to Company':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: '#D1FAE5', color: '#059669', borderRadius: '12px', fontSize: '12px', fontWeight: '700', border: '1px solid #A7F3D0' }}>
            <CheckCircle size={12} /> Forwarded to Company
          </span>
        );
      case 'Shortlisted by Company':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: '#E0E7FF', color: '#4338CA', borderRadius: '12px', fontSize: '12px', fontWeight: '700', border: '1px solid #C7D2FE' }}>
            <Award size={12} /> Shortlisted by Company
          </span>
        );
      case 'Selected by Company':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: '#ECFDF5', color: '#047857', borderRadius: '12px', fontSize: '12px', fontWeight: '700', border: '1px solid #6EE7B7' }}>
            🎉 Selected & Hired
          </span>
        );
      case 'Rejected':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: '#FEE2E2', color: '#DC2626', borderRadius: '12px', fontSize: '12px', fontWeight: '700', border: '1px solid #FECACA' }}>
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
    <AdminPage>
      <AdminPageHeader 
        title="Job Fair & Candidate Placement" 
        subtitle="Review real-time candidate applications, approve & forward verified profiles to hiring companies, and manage direct MBK matching." 
      />

      {/* Modern Tabs Header */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '2px solid #E2E8F0', paddingBottom: '12px' }}>
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
          <Briefcase size={18} /> Candidate Applications
          {pendingAppsCount > 0 && (
            <span style={{
              background: activeTab === 'applications' ? '#EF4444' : '#EF4444',
              color: '#fff', fontSize: '11px', fontWeight: '800',
              padding: '2px 8px', borderRadius: '12px'
            }}>
              {pendingAppsCount} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '10px',
            background: activeTab === 'jobs' ? '#4F46E5' : '#F8FAFC',
            color: activeTab === 'jobs' ? '#fff' : '#475569',
            border: activeTab === 'jobs' ? 'none' : '1px solid #E2E8F0',
            fontWeight: '700', fontSize: '14px', cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'jobs' ? '0 4px 12px rgba(79, 70, 229, 0.25)' : 'none'
          }}
        >
          <Building2 size={18} /> Job Postings & Student Matching
          <span style={{
            background: activeTab === 'jobs' ? 'rgba(255,255,255,0.3)' : '#E2E8F0',
            color: activeTab === 'jobs' ? '#fff' : '#64748B',
            fontSize: '11px', fontWeight: '800',
            padding: '2px 8px', borderRadius: '12px'
          }}>
            {jobs.length}
          </span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: CANDIDATE APPLICATIONS (REAL-TIME JOB FAIR INTAKE)   */}
      {/* ============================================================ */}
      {activeTab === 'applications' && (
        <div>
          {/* Summary Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '16px 20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ color: '#64748B', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Total Received</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B' }}>{applications.length}</div>
            </div>
            <div style={{ background: '#FEF3C7', borderRadius: '12px', padding: '16px 20px', border: '1px solid #FDE68A', boxShadow: '0 2px 4px rgba(217, 119, 6, 0.05)' }}>
              <div style={{ color: '#92400E', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Pending Admin Review</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#B45309' }}>{pendingAppsCount}</div>
            </div>
            <div style={{ background: '#ECFDF5', borderRadius: '12px', padding: '16px 20px', border: '1px solid #A7F3D0', boxShadow: '0 2px 4px rgba(5, 150, 105, 0.05)' }}>
              <div style={{ color: '#065F46', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Forwarded to Companies</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#059669' }}>{forwardedAppsCount}</div>
            </div>
            <div style={{ background: '#EEF2FF', borderRadius: '12px', padding: '16px 20px', border: '1px solid #C7D2FE', boxShadow: '0 2px 4px rgba(79, 70, 229, 0.05)' }}>
              <div style={{ color: '#3730A3', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Selected & Hired</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#4F46E5' }}>{selectedAppsCount}</div>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '16px 20px', border: '1px solid #E2E8F0', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '8px 14px', flex: '1', minWidth: '260px' }}>
              <Search size={16} color="#64748B" />
              <input
                type="text"
                value={appSearch}
                onChange={e => setAppSearch(e.target.value)}
                placeholder="Search by candidate name, email, role, job title, or college..."
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px', color: '#1E293B' }}
              />
              {appSearch && (
                <button onClick={() => setAppSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>&times;</button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { key: 'all', label: 'All' },
                { key: 'Pending Admin Approval', label: 'Pending Review' },
                { key: 'forwarded', label: 'Forwarded' },
                { key: 'Selected by Company', label: 'Selected' },
                { key: 'Rejected', label: 'Rejected' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setAppFilter(tab.key)}
                  style={{
                    padding: '6px 14px', borderRadius: '20px',
                    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                    background: appFilter === tab.key ? '#1E293B' : '#F1F5F9',
                    color: appFilter === tab.key ? '#fff' : '#475569',
                    border: 'none', transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Applications List */}
          {loadingApps ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
              <div style={{ width: '32px', height: '32px', border: '3px solid #4F46E5', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
              <p>Loading real-time candidate submissions...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '12px', border: '1px dashed #CBD5E1', color: '#64748B' }}>
              <AlertCircle size={40} style={{ margin: '0 auto 12px', color: '#94A3B8' }} />
              <h3 style={{ margin: '0 0 6px 0', color: '#1E293B' }}>No Applications Found</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>
                {appSearch || appFilter !== 'all' 
                  ? 'Try changing your search keywords or filter criteria.' 
                  : 'Candidates who click "Apply Now" on the Job Fair will show up here for your verification.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredApplications.map(app => {
                const appId = app._id || app.id;
                const isPending = app.status === 'Pending Admin Approval';
                const isForwarded = app.status === 'Forwarded to Company' || app.status === 'Shortlisted by Company' || app.status === 'Selected by Company';
                
                return (
                  <div
                    key={appId}
                    style={{
                      background: '#fff', borderRadius: '14px',
                      border: isPending ? '2px solid #F59E0B' : '1px solid #E2E8F0',
                      padding: '22px', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.04)',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    {/* Header Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        <div style={{
                          width: '48px', height: '48px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, #4F46E5, #9333EA)',
                          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '18px', fontWeight: '800', flexShrink: 0
                        }}>
                          {app.applicantName ? app.applicantName.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>
                              {app.applicantName}
                            </h3>
                            {getStatusBadge(app.status)}
                          </div>
                          <div style={{ fontSize: '13px', color: '#64748B', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Mail size={13} /> {app.applicantEmail}
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Phone size={13} /> {app.applicantPhone || 'Not provided'}
                            </span>
                            {app.location && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={13} /> {app.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Job & Target Company Info */}
                      <div style={{ textAlign: 'right', background: '#F8FAFC', padding: '8px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Target Role & Company</div>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#4F46E5' }}>{app.jobTitle}</div>
                        <div style={{ fontSize: '12px', color: '#334155', fontWeight: '600' }}>{app.companyName || app.companyId || 'Hiring Partner'}</div>
                      </div>
                    </div>

                    {/* Academic & Qualifications Grid */}
                    <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '14px 16px', marginBottom: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>🎓 Qualification & College</div>
                        <div style={{ fontSize: '13px', color: '#1E293B', fontWeight: '600', marginTop: '2px' }}>
                          {app.qualification || 'Not Specified'} • {app.college || 'MBK SkillOS Network'}
                        </div>
                        {app.department && <div style={{ fontSize: '12px', color: '#64748B' }}>Dept: {app.department}</div>}
                      </div>

                      <div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>⏱️ Experience & Expected Salary</div>
                        <div style={{ fontSize: '13px', color: '#1E293B', fontWeight: '600', marginTop: '2px' }}>
                          Experience: {app.experience || 'Fresher'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>Expected CTC: {app.expectedSalary || 'Standard / Best in Industry'}</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>💻 Key Skills</div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                          {Array.isArray(app.skills) && app.skills.length > 0 ? (
                            app.skills.map((skill, idx) => (
                              <span key={idx} style={{ background: '#E0E7FF', color: '#3730A3', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px' }}>
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span style={{ fontSize: '12px', color: '#64748B' }}>General Skills</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pitch / Cover Letter Excerpt */}
                    {app.coverLetter && (
                      <div style={{ background: '#FFFBEB', border: '1px solid #FEF3C7', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' }}>
                        <div style={{ fontSize: '11px', color: '#B45309', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
                          Candidate Pitch / Cover Letter:
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#78350F', lineHeight: '1.5', fontStyle: 'italic' }}>
                          "{app.coverLetter}"
                        </p>
                      </div>
                    )}

                    {/* Links & Resume row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '14px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {app.resumeUrl && (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '6px',
                              padding: '6px 12px', borderRadius: '8px',
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
                        {app.github && (
                          <a
                            href={app.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '4px',
                              padding: '6px 10px', borderRadius: '8px',
                              background: '#F1F5F9', color: '#1E293B',
                              fontSize: '12px', fontWeight: '600', textDecoration: 'none', border: '1px solid #E2E8F0'
                            }}
                          >
                            <ExternalLink size={12} /> GitHub
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
                        <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                          Applied on: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>

                      {/* Action Buttons for Admin Approval & Forwarding */}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {isPending && (
                          <>
                            <button
                              onClick={() => setShowNoteModal({ appId, action: 'reject' })}
                              disabled={actionLoading === appId}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '8px 16px', borderRadius: '8px',
                                background: '#FEE2E2', color: '#DC2626',
                                border: '1px solid #FECACA', fontWeight: '700', fontSize: '13px',
                                cursor: 'pointer'
                              }}
                            >
                              <X size={15} /> Reject
                            </button>

                            <button
                              onClick={() => handleApproveApplication(appId)}
                              disabled={actionLoading === appId}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '8px 18px', borderRadius: '8px',
                                background: 'linear-gradient(135deg, #10B981, #059669)',
                                color: '#fff', border: 'none', fontWeight: '700', fontSize: '13px',
                                cursor: 'pointer', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
                              }}
                            >
                              <CheckCircle size={15} />
                              {actionLoading === appId ? 'Forwarding...' : 'Approve & Forward to Company'}
                            </button>
                          </>
                        )}

                        {isForwarded && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '12px', color: '#059669', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Check size={16} /> Forwarded to {app.companyName || 'Company'}
                            </span>
                            <button
                              onClick={() => setShowNoteModal({ appId, action: 'reject' })}
                              style={{
                                background: 'none', border: 'none', color: '#94A3B8',
                                fontSize: '12px', cursor: 'pointer', textDecoration: 'underline'
                              }}
                            >
                              Revoke / Reject
                            </button>
                          </div>
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
      {/* TAB 2: JOB POSTINGS & STUDENT TARGETING (EXISTING MBK MATCH) */}
      {/* ============================================================ */}
      {activeTab === 'jobs' && (
        <div>
          {loadingJobs ? (
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

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #E7E9F5', paddingTop: '16px' }}>
                      {job.status === 'Pending' && (
                        <button
                          onClick={() => handleApproveJob(job._id || job.id)}
                          style={{ background: '#10B981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          <CheckCircle size={16} /> Approve for Job Fair
                        </button>
                      )}
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
        </div>
      )}

      {/* Admin Notes & Reject Reason Modal */}
      {showNoteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0F172A' }}>
              {showNoteModal.action === 'reject' ? 'Reject Application' : 'Add Note to Forwarded Application'}
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748B' }}>
              {showNoteModal.action === 'reject' 
                ? 'Provide a brief reason for rejecting this candidate application:' 
                : 'Optional recommendation or note to forward to the company hiring team:'}
            </p>
            <textarea
              rows={4}
              value={adminNoteInput}
              onChange={e => setAdminNoteInput(e.target.value)}
              placeholder={showNoteModal.action === 'reject' ? 'e.g. Qualification criteria not met for this specific role.' : 'e.g. Strongly recommended candidate with high placement test scores.'}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box', outline: 'none', marginBottom: '20px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => { setShowNoteModal(null); setAdminNoteInput(''); }}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#fff', color: '#475569', cursor: 'pointer', fontWeight: '600' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (showNoteModal.action === 'reject') {
                    handleRejectApplication(showNoteModal.appId, adminNoteInput);
                  } else {
                    handleApproveApplication(showNoteModal.appId, adminNoteInput);
                  }
                }}
                style={{
                  padding: '8px 18px', borderRadius: '8px', border: 'none',
                  background: showNoteModal.action === 'reject' ? '#DC2626' : '#10B981',
                  color: '#fff', cursor: 'pointer', fontWeight: '700'
                }}
              >
                {showNoteModal.action === 'reject' ? 'Confirm Rejection' : 'Approve & Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
