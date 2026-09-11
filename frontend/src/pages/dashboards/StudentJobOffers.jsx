import React, { useState, useEffect } from 'react';
import { useAuth } from '../../state/useAuth';
import { 
  Briefcase, Building2, MapPin, GraduationCap, Clock, CheckCircle, 
  Sparkles, ExternalLink, Download, AlertCircle, ArrowRight, Eye, Check, X, ShieldCheck
} from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, EmptyState, P, Badge } from '../../components/PremiumDesignSystem';
import { Link } from 'react-router-dom';

const API = '/api';

export default function StudentJobOffers() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my_applications'); // 'my_applications' | 'matched_jobs'
  
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const [myApplications, setMyApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoadingJobs(true);
        const studentId = user.email || user._id || user.id;
        const res = await fetch(`${API}/jobs?studentId=${encodeURIComponent(studentId)}`);
        const data = await res.json();
        if (data.success) {
          setJobs(data.jobs || []);
        }
      } catch (err) {
        console.error('Failed to fetch assigned job offers:', err);
      } finally {
        setLoadingJobs(false);
      }
    };

    const fetchMyApplications = async () => {
      try {
        setLoadingApps(true);
        const email = user.email || user._id;
        const res = await fetch(`${API}/job-applications?applicantEmail=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.success) {
          setMyApplications(data.applications || []);
        }
      } catch (err) {
        console.error('Failed to fetch user applications:', err);
      } finally {
        setLoadingApps(false);
      }
    };

    if (user) {
      fetchJobs();
      fetchMyApplications();
    }
  }, [user]);

  const renderApplicationProgress = (status) => {
    let step1 = { status: 'complete', label: 'Application Submitted' };
    let step2 = { status: 'pending', label: 'Admin Review' };
    let step3 = { status: 'pending', label: 'Company Evaluation' };

    if (status === 'Pending Admin Approval') {
      step2 = { status: 'current', label: 'Admin Reviewing Credentials' };
      step3 = { status: 'pending', label: 'Awaiting Admin Approval' };
    } else if (status === 'Forwarded to Company') {
      step2 = { status: 'complete', label: 'Admin Approved & Forwarded' };
      step3 = { status: 'current', label: 'With Company Hiring Team' };
    } else if (status === 'Shortlisted by Company') {
      step2 = { status: 'complete', label: 'Admin Approved' };
      step3 = { status: 'complete', label: 'Shortlisted for Interview' };
    } else if (status === 'Selected by Company') {
      step2 = { status: 'complete', label: 'Admin Approved' };
      step3 = { status: 'complete', label: 'Selected & Offer Issued 🎉' };
    } else if (status === 'Rejected') {
      step2 = { status: 'rejected', label: 'Not Selected' };
      step3 = { status: 'rejected', label: 'Application Closed' };
    }

    return (
      <div style={{ marginTop: '16px', background: '#F8FAFC', borderRadius: '12px', padding: '16px 20px', border: '1px solid #E2E8F0' }}>
        <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '14px' }}>
          Real-Time Application Status Pipeline
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', flexWrap: 'wrap', gap: '12px' }}>
          {/* Step 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: '160px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10B981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', flexShrink: 0 }}>
              ✓
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#1E293B' }}>1. Submitted</div>
              <div style={{ fontSize: '11px', color: '#059669' }}>Profile Verified</div>
            </div>
          </div>

          {/* Connector 1 */}
          <div style={{ height: '2px', background: step2.status === 'complete' ? '#10B981' : step2.status === 'current' ? '#F59E0B' : '#E2E8F0', flex: '0.4', minWidth: '20px' }} />

          {/* Step 2 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1.2', minWidth: '180px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: step2.status === 'complete' ? '#10B981' : step2.status === 'current' ? '#F59E0B' : step2.status === 'rejected' ? '#EF4444' : '#CBD5E1',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', flexShrink: 0
            }}>
              {step2.status === 'complete' ? '✓' : step2.status === 'current' ? '⏳' : step2.status === 'rejected' ? '✕' : '2'}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#1E293B' }}>2. Admin Review</div>
              <div style={{ fontSize: '11px', color: step2.status === 'complete' ? '#059669' : step2.status === 'current' ? '#D97706' : '#64748B' }}>
                {step2.label}
              </div>
            </div>
          </div>

          {/* Connector 2 */}
          <div style={{ height: '2px', background: step3.status === 'complete' ? '#10B981' : step3.status === 'current' ? '#6366F1' : '#E2E8F0', flex: '0.4', minWidth: '20px' }} />

          {/* Step 3 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1.2', minWidth: '180px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: step3.status === 'complete' ? '#10B981' : step3.status === 'current' ? '#6366F1' : step3.status === 'rejected' ? '#EF4444' : '#CBD5E1',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', flexShrink: 0
            }}>
              {step3.status === 'complete' ? '🎉' : step3.status === 'current' ? '🚀' : step3.status === 'rejected' ? '✕' : '3'}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#1E293B' }}>3. Company Decision</div>
              <div style={{ fontSize: '11px', color: step3.status === 'complete' ? '#059669' : step3.status === 'current' ? '#4F46E5' : '#64748B' }}>
                {step3.label}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PremiumPage>
      <PageHeader
        title="Career Placement & Job Offers"
        subtitle="Track your real-time job applications, monitor Admin verification status, and explore matched career openings."
        emoji="💼"
      />

      {/* Tabs Switcher */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', borderBottom: '2px solid rgba(226, 232, 240, 0.6)', paddingBottom: '14px' }}>
        <button
          onClick={() => setActiveTab('my_applications')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 22px', borderRadius: '12px',
            background: activeTab === 'my_applications' ? 'linear-gradient(135deg, #4F46E5, #6366F1)' : '#F8FAFC',
            color: activeTab === 'my_applications' ? '#fff' : '#475569',
            border: activeTab === 'my_applications' ? 'none' : '1px solid #E2E8F0',
            fontWeight: '700', fontSize: '14px', cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'my_applications' ? '0 4px 14px rgba(79, 70, 229, 0.3)' : 'none'
          }}
        >
          <Sparkles size={17} /> My Job Applications
          <span style={{
            background: activeTab === 'my_applications' ? 'rgba(255,255,255,0.3)' : '#E2E8F0',
            color: activeTab === 'my_applications' ? '#fff' : '#64748B',
            fontSize: '11px', fontWeight: '800',
            padding: '2px 8px', borderRadius: '12px'
          }}>
            {myApplications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('matched_jobs')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 22px', borderRadius: '12px',
            background: activeTab === 'matched_jobs' ? 'linear-gradient(135deg, #4F46E5, #6366F1)' : '#F8FAFC',
            color: activeTab === 'matched_jobs' ? '#fff' : '#475569',
            border: activeTab === 'matched_jobs' ? 'none' : '1px solid #E2E8F0',
            fontWeight: '700', fontSize: '14px', cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'matched_jobs' ? '0 4px 14px rgba(79, 70, 229, 0.3)' : 'none'
          }}
        >
          <Briefcase size={17} /> Matched Opportunities
          <span style={{
            background: activeTab === 'matched_jobs' ? 'rgba(255,255,255,0.3)' : '#E2E8F0',
            color: activeTab === 'matched_jobs' ? '#fff' : '#64748B',
            fontSize: '11px', fontWeight: '800',
            padding: '2px 8px', borderRadius: '12px'
          }}>
            {jobs.length}
          </span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: MY SUBMITTED APPLICATIONS (LIVE TRACKING PIPELINE)   */}
      {/* ============================================================ */}
      {activeTab === 'my_applications' && (
        <div>
          {loadingApps ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                border: `3px solid ${P.blue}`, borderTopColor: 'transparent',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
          ) : myApplications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
              <Briefcase size={48} style={{ color: '#94A3B8', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1E293B', margin: '0 0 8px 0' }}>No Job Applications Submitted Yet</h3>
              <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '480px', margin: '0 auto 24px' }}>
                You haven't applied to any job openings yet. Visit the Job Fair to explore top company openings and submit your application for Admin review!
              </p>
              <Link
                to="/jobfair"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '12px 24px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
                  color: '#fff', textDecoration: 'none', fontWeight: '700', fontSize: '14px',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)'
                }}
              >
                Browse Job Fair Openings <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {myApplications.map(app => {
                const appId = app._id || app.id;
                const isPending = app.status === 'Pending Admin Approval';
                const isForwarded = app.status === 'Forwarded to Company';
                const isShortlisted = app.status === 'Shortlisted by Company';
                const isSelected = app.status === 'Selected by Company';

                return (
                  <GlassCard key={appId} style={{ padding: '24px', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                            {app.jobTitle}
                          </h3>
                          <span style={{
                            padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '800',
                            background: isSelected ? '#ECFDF5' : isShortlisted ? '#EEF2FF' : isForwarded ? '#D1FAE5' : '#FEF3C7',
                            color: isSelected ? '#047857' : isShortlisted ? '#4338CA' : isForwarded ? '#065F46' : '#D97706',
                            border: `1px solid ${isSelected ? '#6EE7B7' : isShortlisted ? '#C7D2FE' : isForwarded ? '#A7F3D0' : '#FDE68A'}`
                          }}>
                            {app.status}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '14px', marginTop: '6px', fontWeight: '600' }}>
                          <Building2 size={16} color="#4F46E5" />
                          <span>Hiring Company: {app.companyName || app.companyId || 'Partner Employer'}</span>
                          <span>•</span>
                          <span>Applied on: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recent'}</span>
                        </div>
                      </div>

                      {app.resumeUrl && (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '7px 14px', borderRadius: '8px',
                            background: '#F1F5F9', color: '#334155',
                            fontSize: '12px', fontWeight: '700', textDecoration: 'none',
                            border: '1px solid #CBD5E1'
                          }}
                        >
                          <Download size={14} /> My Submitted Resume
                        </a>
                      )}
                    </div>

                    {/* Live Progress Pipeline Bar */}
                    {renderApplicationProgress(app.status)}

                    {/* Admin/Company Notes Feedback Box */}
                    {app.adminNotes && (
                      <div style={{ marginTop: '14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '12px 16px' }}>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: '#15803D', textTransform: 'uppercase', marginBottom: '2px' }}>
                          Feedback & Notes from Reviewer:
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#166534', lineHeight: '1.5' }}>
                          {app.adminNotes}
                        </p>
                      </div>
                    )}
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: MATCHED OPPORTUNITIES (ADMIN TARGETED JOBS)           */}
      {/* ============================================================ */}
      {activeTab === 'matched_jobs' && (
        <div>
          {loadingJobs ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                border: `3px solid ${P.blue}`, borderTopColor: 'transparent',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={<Briefcase size={48} color={P.inkMute} />}
              title="No Assigned Job Offers Yet"
              subtitle="You don't have any direct targeted job matches right now. Visit the Job Fair to apply for public openings!"
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {jobs.map(job => (
                <GlassCard key={job._id || job.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: P.ink, margin: '0 0 4px 0' }}>{job.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: P.inkSoft, fontSize: 13, fontWeight: 500 }}>
                        <Building2 size={14} />
                        <span>Company: {job.companyName || job.companyId}</span>
                      </div>
                    </div>
                    <Badge color={P.green}>Admin Matched</Badge>
                  </div>

                  <p style={{ fontSize: 14, color: P.inkMute, lineHeight: 1.5, marginBottom: 20, flexGrow: 1 }}>
                    {job.description || 'No description provided.'}
                  </p>

                  <div style={{ background: 'rgba(91,92,255,0.04)', borderRadius: P.radiusSm, padding: 16, marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: P.blue, letterSpacing: 1.2, marginBottom: 12 }}>REQUIREMENTS</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: P.inkSoft }}>
                        <GraduationCap size={16} color={P.inkMute} />
                        <span>{job.requirements?.degree || 'Any Degree'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: P.inkSoft }}>
                        <Clock size={16} color={P.inkMute} />
                        <span>{job.requirements?.experience || 'Any Experience'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: P.inkSoft }}>
                        <CheckCircle size={16} color={P.inkMute} style={{ flexShrink: 0, marginTop: 2 }} />
                        <span style={{ lineHeight: 1.4 }}>{job.requirements?.skills?.join(', ') || 'General Skills'}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/jobfair"
                    style={{
                      width: '100%', padding: '12px', borderRadius: P.radiusSm, border: 'none',
                      background: `linear-gradient(135deg, ${P.primary}, ${P.secondary})`,
                      color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      boxShadow: P.shadow, textDecoration: 'none', boxSizing: 'border-box'
                    }}
                  >
                    Apply on Job Fair <ArrowRight size={16} />
                  </Link>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}
    </PremiumPage>
  );
}
