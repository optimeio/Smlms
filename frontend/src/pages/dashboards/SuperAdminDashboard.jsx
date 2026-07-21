import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Layers, Settings, AlertCircle, TrendingUp, Activity, Shield, CheckSquare, Bell, Sparkles, MoreVertical } from 'lucide-react';
import { 
  AdminPage, 
  AdminPageHeader, 
  EnterpriseCard, 
  AdminStatWidget, 
  AdminButton, 
  A,
  AdminBadge
} from '../../components/AdminDesignSystem';

const stats = [
  { label: 'Total Users', value: '584', icon: <Users size={24} />, gradientFrom: '#6366F1', gradientTo: '#8B5CF6', trend: '12%', trendUp: true },
  { label: 'Active Courses', value: '34', icon: <BookOpen size={24} />, gradientFrom: '#3B82F6', gradientTo: '#06B6D4', trend: '4%', trendUp: true },
  { label: 'Current Programs', value: '18', icon: <Layers size={24} />, gradientFrom: '#22C55E', gradientTo: '#10B981', trend: '2', trendUp: true },
  { label: 'Open Tickets', value: '12', icon: <Settings size={24} />, gradientFrom: '#F59E0B', gradientTo: '#F97316', trend: '3', trendUp: false },
];

const metrics = [
  { name: 'Platform uptime', value: '99.98%' },
  { name: 'New signups (Today)', value: '96' },
  { name: 'Course launches', value: '4' },
  { name: 'Support avg response', value: '1h 20m' },
];

export default function SuperAdminDashboard() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch('/api/requests')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRequests(data.requests);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <AdminPage>
      {/* Premium Header Section */}
      <AdminPageHeader 
        title="Super Admin Dashboard"
        subtitle="Overview of platform health, user activity, and global management insights."
        emoji="⚡"
        actions={
          <>
            <AdminButton variant="outline" icon={<Settings size={16} />}>
              System Settings
            </AdminButton>
            <AdminButton variant="blue" icon={<Sparkles size={16} />}>
              Generate Report
            </AdminButton>
          </>
        }
      />

      {/* Stats Cards */}
      <div className="mbk-grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 40 }}>
        {stats.map((item) => (
          <AdminStatWidget
            key={item.label}
            label={item.label}
            value={item.value}
            icon={item.icon}
            gradientFrom={item.gradientFrom}
            gradientTo={item.gradientTo}
            trend={item.trend}
            trendUp={item.trendUp}
          />
        ))}
      </div>

      <div className="mbk-grid-responsive" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
        
        {/* Left Column: Requests & Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Incoming Requests */}
          <EnterpriseCard hover={false}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#FFF7ED', color: A.orange, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: A.ink, fontFamily: A.font }}>Action Required</h3>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: A.inkSoft }}>Pending requests and approvals</p>
                </div>
              </div>
              <AdminButton variant="ghost">View All</AdminButton>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {requests.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: A.inkMute, fontSize: 14 }}>
                  No pending requests right now.
                </div>
              ) : (
                requests.map(req => (
                  <div key={req._id || req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, border: `1px solid ${A.border}`, borderRadius: A.radiusSm, background: '#fff', transition: 'all 0.2s', cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.borderColor = A.primary; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.02)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = A.border; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#F1F5F9', color: A.inkSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                        {req.requesterName ? req.requesterName.charAt(0) : 'U'}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: A.ink }}>{req.requesterName}</span>
                          <AdminBadge color={req.status === 'Pending' ? A.orange : A.blue}>{req.status}</AdminBadge>
                        </div>
                        <div style={{ fontSize: 13, color: A.inkSoft }}>Requested <strong style={{ color: A.ink }}>{req.requestType || 'Resource'}</strong></div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ fontSize: 12, color: A.inkMute, fontWeight: 500 }}>{new Date(req.createdAt).toLocaleDateString()}</span>
                      <button style={{ background: 'transparent', border: 'none', color: A.inkMute, cursor: 'pointer' }}>
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </EnterpriseCard>

          {/* Security & System Tasks Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <EnterpriseCard>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#FEF2F2', color: A.red, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: A.ink, fontFamily: A.font }}>Security Alerts</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ padding: 16, background: '#FEF2F2', borderRadius: A.radiusSm, border: '1px solid #FECACA' }}>
                  <strong style={{ display: 'block', color: A.red, fontSize: 13, marginBottom: 4, fontWeight: 700 }}>High Priority</strong>
                  <span style={{ color: A.inkSoft, fontSize: 13, lineHeight: 1.5 }}>Review MFA rollout for new users. 12 accounts pending setup.</span>
                </div>
                <div style={{ padding: 16, background: A.bg, borderRadius: A.radiusSm, border: `1px solid ${A.border}` }}>
                  <strong style={{ display: 'block', color: A.ink, fontSize: 13, marginBottom: 4, fontWeight: 600 }}>Access Control</strong>
                  <span style={{ color: A.inkSoft, fontSize: 13, lineHeight: 1.5 }}>Update access policy for external trainers.</span>
                </div>
              </div>
            </EnterpriseCard>

            <EnterpriseCard>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#F5F3FF', color: A.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckSquare size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: A.ink, fontFamily: A.font }}>System Tasks</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: A.bg, borderRadius: A.radiusSm, border: `1px solid ${A.border}` }}>
                  <input type="checkbox" style={{ width: 18, height: 18, accentColor: A.primary }} />
                  <span style={{ color: A.ink, fontSize: 14, fontWeight: 500 }}>Review instructor approvals.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: A.bg, borderRadius: A.radiusSm, border: `1px solid ${A.border}` }}>
                  <input type="checkbox" style={{ width: 18, height: 18, accentColor: A.primary }} />
                  <span style={{ color: A.ink, fontSize: 14, fontWeight: 500 }}>Audit scheduled content updates.</span>
                </div>
              </div>
            </EnterpriseCard>
          </div>
        </div>

        {/* Right Column: Metrics & Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Operational Metrics */}
          <EnterpriseCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#EFF6FF', color: A.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: A.ink, fontFamily: A.font }}>Platform Health</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {metrics.map((metric) => (
                <div key={metric.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: `1px solid ${A.border}` }}>
                  <span style={{ color: A.inkSoft, fontSize: 14, fontWeight: 500 }}>{metric.name}</span>
                  <strong style={{ color: A.ink, fontSize: 15, fontWeight: 700 }}>{metric.value}</strong>
                </div>
              ))}
            </div>
            <AdminButton variant="outline" style={{ width: '100%', marginTop: 16 }}>View Detailed Logs</AdminButton>
          </EnterpriseCard>

          {/* Quick Actions */}
          <EnterpriseCard>
            <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 700, color: A.ink, fontFamily: A.font }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <button style={{ padding: 16, background: A.bg, border: `1px solid ${A.border}`, borderRadius: A.radiusSm, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = A.primary} onMouseLeave={e => e.currentTarget.style.borderColor = A.border}>
                <Users size={20} color={A.primary} />
                <span style={{ fontSize: 13, fontWeight: 600, color: A.ink }}>Add User</span>
              </button>
              <button style={{ padding: 16, background: A.bg, border: `1px solid ${A.border}`, borderRadius: A.radiusSm, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = A.primary} onMouseLeave={e => e.currentTarget.style.borderColor = A.border}>
                <BookOpen size={20} color={A.secondary} />
                <span style={{ fontSize: 13, fontWeight: 600, color: A.ink }}>New Course</span>
              </button>
            </div>
          </EnterpriseCard>
        </div>

      </div>
    </AdminPage>
  );
}
