import { useState, useEffect } from 'react';
import { Search, Filter, Briefcase, Star, Clock, CheckCircle, XCircle, FileText, UserCheck, MoreVertical, Award, Calendar } from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, GradientButton, P } from '../../components/PremiumDesignSystem';

const stats = [
  { label: 'Active Trainers', value: '142', icon: <UserCheck size={20} />, change: '+8 this month' },
  { label: 'Pending Approvals', value: '12', icon: <Clock size={20} />, change: 'Action required' },
  { label: 'Avg. Rating', value: '4.8', icon: <Star size={20} />, change: 'Consistently high' },
  { label: 'Total Sessions', value: '8,420', icon: <Calendar size={20} />, change: '+320 this week' },
];

export default function AdminSpoc() {
  const [trainers, setTrainers] = useState([]);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    fetch('/api/users?role=trainer')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.users.length > 0) {
          setTrainers(data.users);
        } else {
          // Mock data for UI
          setTrainers([
            { _id: '1', fullName: 'Dr. Alan Turing', email: 'alan@example.com', expertise: 'Data Science', rating: 4.9, sessions: 142, status: 'Verified' },
            { _id: '2', fullName: 'Grace Hopper', email: 'grace@example.com', expertise: 'Software Engineering', rating: 4.8, sessions: 89, status: 'Verified' },
            { _id: '3', fullName: 'Ada Lovelace', email: 'ada@example.com', expertise: 'Algorithms', rating: 5.0, sessions: 12, status: 'Pending Review' },
          ]);
        }
      })
      .catch(() => setTrainers([]));
  }, []);

  const filteredTrainers = trainers.filter(t => 
    (t.fullName || '').toLowerCase().includes(search.toLowerCase()) || 
    (t.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PremiumPage>
      <PageHeader 
        title="Trainer Management" 
        subtitle="Review applications, verify documents, and monitor trainer performance metrics."
        emoji="👨‍🏫"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        {stats.map((stat) => (
          <GlassCard key={stat.label} style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(91,92,255,0.1)', color: P.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 13, color: P.inkMute, fontWeight: 700 }}>{stat.label}</p>
              <h3 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: P.ink, fontFamily: P.font }}>{stat.value}</h3>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: stat.label === 'Pending Approvals' ? '#F59E0B' : P.green, fontWeight: 600 }}>{stat.change}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, flex: 1, minWidth: 300 }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
              <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: P.inkMute }} />
              <input 
                type="text" 
                placeholder="Search trainers..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: P.radius, border: `1px solid ${P.border}`, fontSize: 14, outline: 'none', background: '#f8fafc', color: P.ink, fontFamily: P.font }}
              />
            </div>
            <button style={{ padding: '0 16px', borderRadius: P.radius, border: `1px solid ${P.border}`, fontSize: 14, outline: 'none', background: '#fff', color: P.ink, fontFamily: P.font, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}>
              <Filter size={16} /> Filters
            </button>
          </div>
          <GradientButton>+ Invite Trainer</GradientButton>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {filteredTrainers.map(trainer => (
            <div key={trainer._id} style={{ border: `1px solid ${P.border}`, borderRadius: P.radiusMd, padding: 20, background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', position: 'relative', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={e => e.currentTarget.style.boxShadow = P.shadowHover} onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18 }}>
                    {trainer.fullName ? trainer.fullName.charAt(0) : 'T'}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: P.ink }}>{trainer.fullName || 'Unknown Trainer'}</h4>
                    <p style={{ margin: '2px 0 0', fontSize: 13, color: P.inkMute }}>{trainer.expertise || 'General'}</p>
                  </div>
                </div>
                <span style={{ background: trainer.status === 'Verified' ? '#dcfce7' : '#fef3c7', color: trainer.status === 'Verified' ? '#15803d' : '#d97706', padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {trainer.status === 'Verified' ? <CheckCircle size={12} /> : <Clock size={12} />}
                  {trainer.status}
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: P.radiusSm }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: P.inkSoft, fontSize: 12, fontWeight: 700, marginBottom: 4 }}><Star size={14} color="#F59E0B" /> Rating</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: P.ink }}>{trainer.rating || 'N/A'}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: P.radiusSm }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: P.inkSoft, fontSize: 12, fontWeight: 700, marginBottom: 4 }}><Briefcase size={14} color={P.blue} /> Sessions</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: P.ink }}>{trainer.sessions || 0}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, borderTop: `1px solid ${P.border}`, paddingTop: 16 }}>
                <button style={{ flex: 1, padding: '8px', background: '#f8fafc', border: `1px solid ${P.border}`, borderRadius: P.radiusSm, color: P.ink, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <FileText size={14} /> Documents
                </button>
                {trainer.status !== 'Verified' && (
                  <button style={{ flex: 1, padding: '8px', background: P.green, border: 'none', borderRadius: P.radiusSm, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </PremiumPage>
  );
}