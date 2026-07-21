import { useState } from 'react';
import styles from '../../styles/DashboardShell.module.css';
import { useAuth } from '../../state/useAuth';
import { P, GradientButton, GlassCard, SectionTitle } from '../../components/PremiumDesignSystem';

const metrics = [
  { label: 'Completion Rate', value: '76%', detail: 'Up 8% from last week' },
  { label: 'Average Score', value: '92', detail: 'Across all quizzes' },
  { label: 'Active Students', value: '128', detail: 'Engaged today' },
];

export default function DashboardC() {
  const { user } = useAuth();
  const [requestStatus, setRequestStatus] = useState('');

  const handleRequestStudent = async () => {
    try {
      setRequestStatus('sending');
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterEmail: user?.email,
          requesterName: user?.companyName || user?.fullName,
          requesterRole: 'Company',
          targetEmail: 'admin@smgroups.com', // Dummy/admin target email
          targetRole: 'Admin',
          targetName: 'Admin'
        })
      });
      const data = await response.json();
      if (data.success) {
        setRequestStatus('success');
        setTimeout(() => setRequestStatus(''), 3000);
      } else {
        setRequestStatus('error');
      }
    } catch (err) {
      console.error(err);
      setRequestStatus('error');
    }
  };

  return (
    <section className={styles.panel} style={{ padding: '24px 40px', background: P.bg }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <SectionTitle>Company Overview</SectionTitle>
        <GradientButton 
          variant={requestStatus === 'success' ? 'success' : 'primary'}
          onClick={handleRequestStudent} 
          disabled={requestStatus === 'sending'}
        >
          {requestStatus === 'sending' ? 'Sending...' : requestStatus === 'success' ? 'Request Sent!' : 'Request Student'}
        </GradientButton>
      </div>

      <div className={styles.metricGrid}>
        {metrics.map((metric) => (
          <GlassCard key={metric.label} style={{ padding: 20 }}>
            <p className={styles.metricLabel} style={{ color: P.inkMute, fontWeight: 700, margin: '0 0 8px' }}>{metric.label}</p>
            <p className={styles.metricValue} style={{ color: P.ink, fontSize: 32, fontWeight: 900, margin: '0 0 4px' }}>{metric.value}</p>
            <p className={styles.cardDetail} style={{ color: P.blue, fontSize: 13, fontWeight: 600, margin: 0 }}>{metric.detail}</p>
          </GlassCard>
        ))}
      </div>
      <div className={styles.chartCard} style={{ marginTop: 24, background: '#fff', borderRadius: P.radiusLg, padding: 24, border: `1px solid ${P.border}`, boxShadow: P.shadow }}>
        <div className={styles.cardHeader} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 className={styles.cardTitle} style={{ margin: '0 0 4px', color: P.ink, fontSize: 18, fontWeight: 800 }}>Analytics Snapshot</h2>
            <p className={styles.cardSubtitle} style={{ margin: 0, color: P.inkMute, fontSize: 14 }}>Engagement patterns for your current program.</p>
          </div>
          <span className={styles.badge} style={{ background: 'rgba(91,92,255,0.1)', color: P.primary, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>Insights</span>
        </div>
        <div className={styles.chartPlaceholder} role="img" aria-label="Placeholder for analytic chart" style={{ background: '#f8fafc', height: 200, borderRadius: P.radiusMd, display: 'flex', alignItems: 'center', justifyContent: 'center', color: P.inkMute }}>
          <p>Interactive analytics chart placeholder.</p>
        </div>
      </div>
    </section>
  );
}
