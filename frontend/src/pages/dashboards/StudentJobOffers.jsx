import React, { useState, useEffect } from 'react';
import { useAuth } from '../../state/useAuth';
import { Briefcase, Building2, MapPin, GraduationCap, Clock, CheckCircle } from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, EmptyState, P, Badge } from '../../components/PremiumDesignSystem';

const API = '/api';

export default function StudentJobOffers() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Using user.email or _id based on how they were targeted in AdminJobOffers
        const studentId = user.email || user._id || user.id;
        const res = await fetch(`${API}/jobs?studentId=${studentId}`);
        const data = await res.json();
        if (data.success) {
          setJobs(data.jobs);
        }
      } catch (err) {
        console.error('Failed to fetch assigned job offers:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchJobs();
  }, [user]);

  return (
    <PremiumPage>
      <PageHeader
        title="Job Offers"
        subtitle="Exclusive job opportunities matched to your profile by MBK Tech administrators."
        emoji="💼"
      />

      {loading ? (
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
          title="No Job Offers Yet"
          subtitle="You don't have any assigned job offers at the moment. Keep completing courses to improve your chances!"
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
                    <span>Company ID: {job.companyId}</span>
                  </div>
                </div>
                <Badge color={P.green}>New Match</Badge>
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

              <button style={{
                width: '100%', padding: '12px', borderRadius: P.radiusSm, border: 'none',
                background: `linear-gradient(135deg, ${P.primary}, ${P.secondary})`,
                color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: P.shadow
              }}>
                Apply Now
              </button>
            </GlassCard>
          ))}
        </div>
      )}
    </PremiumPage>
  );
}
