import { useState } from 'react';
import { Activity, ShieldAlert, LogIn, UserPlus, FileEdit, Settings, Filter, Search, Download, Clock } from 'lucide-react';
import { 
  AdminPage, 
  AdminPageHeader, 
  EnterpriseCard, 
  AdminButton,
  AdminSearch,
  AdminBadge,
  A 
} from '../../components/AdminDesignSystem';

// Mock Audit Logs
const auditLogs = [
  { id: 1, user: 'Admin User', role: 'Superadmin', action: 'System Settings Updated', type: 'system', timestamp: '2 mins ago', details: 'Updated email SMTP configuration.', ip: '192.168.1.1' },
  { id: 2, user: 'John Smith', role: 'Trainer', action: 'Failed Login Attempt', type: 'security', timestamp: '15 mins ago', details: 'Invalid password provided 3 times.', ip: '10.0.0.45' },
  { id: 3, user: 'Sarah Connor', role: 'Company', action: 'Created New Course', type: 'content', timestamp: '1 hour ago', details: 'Created "Advanced AI Concepts" in draft.', ip: '45.22.11.9' },
  { id: 4, user: 'Alice Wonderland', role: 'Student', action: 'Registered Account', type: 'user', timestamp: '3 hours ago', details: 'Signed up via Google OAuth.', ip: '192.168.1.100' },
  { id: 5, user: 'Admin User', role: 'Superadmin', action: 'Approved Trainer Profile', type: 'admin', timestamp: '5 hours ago', details: 'Approved profile for John Smith.', ip: '192.168.1.1' },
  { id: 6, user: 'System', role: 'System', action: 'Database Backup Completed', type: 'system', timestamp: '1 day ago', details: 'Automated daily backup successful.', ip: 'localhost' },
];

const getIconForType = (type) => {
  switch(type) {
    case 'security': return <ShieldAlert size={18} />;
    case 'user': return <UserPlus size={18} />;
    case 'content': return <FileEdit size={18} />;
    case 'system': return <Settings size={18} />;
    case 'admin': return <Activity size={18} />;
    default: return <Activity size={18} />;
  }
};

const getColorForType = (type) => {
  switch(type) {
    case 'security': return { bg: '#FEF2F2', color: A.red };
    case 'user': return { bg: '#ECFDF5', color: A.green };
    case 'content': return { bg: '#EFF6FF', color: A.blue };
    case 'system': return { bg: '#F5F3FF', color: A.secondary };
    case 'admin': return { bg: '#FFF7ED', color: A.orange };
    default: return { bg: '#F1F5F9', color: A.inkSoft };
  }
};

export default function AdminAudit() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter(log => 
    (filter === 'All' || log.type === filter.toLowerCase()) &&
    (log.user.toLowerCase().includes(search.toLowerCase()) || 
     log.action.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminPage>
      <AdminPageHeader 
        title="Activity Log & Audit Trail" 
        subtitle="Monitor platform activity, security events, and user actions in real-time."
        emoji="📋"
      />

      <EnterpriseCard style={{ padding: '24px 32px', marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ display: 'flex', gap: 16, flex: 1, minWidth: 300, flexWrap: 'wrap', alignItems: 'center' }}>
            <AdminSearch 
              placeholder="Search events, users, or IPs..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 250 }}
            />
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {['All', 'Security', 'User', 'Content', 'System', 'Admin'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: 20, 
                    border: `1px solid ${filter === f ? A.primary : A.border}`, 
                    background: filter === f ? `${A.primary}15` : A.surface, 
                    color: filter === f ? A.primary : A.inkSoft, 
                    fontSize: 13, 
                    fontWeight: 600, 
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontFamily: A.font,
                    transition: 'all 0.2s'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <AdminButton variant="outline" icon={<Download size={16} />}>
            Export Logs
          </AdminButton>
        </div>
      </EnterpriseCard>

      <EnterpriseCard style={{ padding: 32 }}>
        <div style={{ position: 'relative' }}>
          {/* Timeline Line */}
          <div style={{ position: 'absolute', left: 24, top: 0, bottom: 0, width: 2, background: A.border, zIndex: 0 }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, position: 'relative', zIndex: 1 }}>
            {filteredLogs.map((log) => {
              const style = getColorForType(log.type);
              return (
                <div key={log.id} style={{ display: 'flex', gap: 24 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: A.surface, border: `2px solid ${A.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4, zIndex: 2 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: style.bg, color: style.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {getIconForType(log.type)}
                    </div>
                  </div>
                  
                  <div style={{ flex: 1, background: '#F8FAFC', padding: 24, borderRadius: 16, border: `1px solid ${A.border}`, transition: 'all 0.2s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.borderColor = A.primary} onMouseLeave={e => e.currentTarget.style.borderColor = A.border}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <h4 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: A.ink }}>{log.action}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: A.inkSoft, fontWeight: 500 }}>
                          <span style={{ color: A.ink, fontWeight: 600 }}>{log.user}</span>
                          <span style={{ padding: '2px 8px', background: '#E2E8F0', borderRadius: 12, fontSize: 11, fontWeight: 700, color: A.ink }}>{log.role}</span>
                          <span>•</span>
                          <span>IP: {log.ip}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: A.inkMute, fontWeight: 600 }}>
                        <Clock size={14} /> {log.timestamp}
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: 14, color: A.inkSoft, lineHeight: 1.5 }}>{log.details}</p>
                  </div>
                </div>
              );
            })}
            {filteredLogs.length === 0 && (
              <div style={{ padding: '60px 0', textAlign: 'center', color: A.inkMute }}>
                <Activity size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>No activity logs found for this filter.</p>
              </div>
            )}
          </div>
        </div>
      </EnterpriseCard>
    </AdminPage>
  );
}