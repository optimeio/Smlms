import { useState, useEffect } from 'react';
import { Mail, Search, MessageSquare, AlertCircle, CheckCircle, Clock, MoreVertical, Filter, Send, Inbox, Tag } from 'lucide-react';
import { 
  AdminPage, 
  AdminPageHeader, 
  EnterpriseCard, 
  AdminButton, 
  AdminBadge,
  AdminSearch,
  A 
} from '../../components/AdminDesignSystem';

const stats = [
  { label: 'Total Inquiries', value: '142', icon: <Inbox size={20} />, change: '+12 today' },
  { label: 'Unresolved', value: '28', icon: <AlertCircle size={20} />, change: '4 high priority' },
  { label: 'Avg Response Time', value: '2.4h', icon: <Clock size={20} />, change: '-15m this week' },
  { label: 'Resolved Tickets', value: '114', icon: <CheckCircle size={20} />, change: '82% resolution rate' },
];

export default function AdminNotifications() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  useEffect(() => {
    // Mocking tickets/notifications data
    setTickets([
      { id: '1', name: 'John Smith', email: 'john@example.com', subject: 'Login Issue', message: 'I cannot access my dashboard after the recent update.', status: 'Open', priority: 'High', date: '2023-11-15T10:30:00Z', type: 'Technical' },
      { id: '2', name: 'Sarah Connor', email: 'sarah@techcorp.com', subject: 'Corporate Partnership Inquiry', message: 'We are interested in partnering for your training programs.', status: 'Pending', priority: 'Medium', date: '2023-11-14T14:15:00Z', type: 'Partnership' },
      { id: '3', name: 'Alan Turing', email: 'alan@student.edu', subject: 'Course Completion Certificate', message: 'When will I receive my certificate for the Data Science course?', status: 'Resolved', priority: 'Low', date: '2023-11-10T09:00:00Z', type: 'General' },
      { id: '4', name: 'Grace Hopper', email: 'grace@navy.mil', subject: 'Payment Failed', message: 'My credit card was charged but the course is not unlocked.', status: 'Open', priority: 'High', date: '2023-11-16T08:45:00Z', type: 'Billing' },
    ]);
  }, []);

  const filteredTickets = tickets.filter(t => 
    (filter === 'All' || t.status === filter) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) || 
     t.subject.toLowerCase().includes(search.toLowerCase()) || 
     t.email.toLowerCase().includes(search.toLowerCase()))
  );

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return { color: A.red, bg: '#FEF2F2' };
      case 'Medium': return { color: A.orange, bg: '#FFF7ED' };
      case 'Low': return { color: A.green, bg: '#ECFDF5' };
      default: return { color: A.inkMute, bg: '#F1F5F9' };
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return { color: A.primary, bg: '#EEF2FF' };
      case 'Pending': return { color: A.orange, bg: '#FFF7ED' };
      case 'Resolved': return { color: A.green, bg: '#ECFDF5' };
      default: return { color: A.inkMute, bg: '#F1F5F9' };
    }
  };

  return (
    <AdminPage>
      <AdminPageHeader 
        title="Support & Inquiries" 
        subtitle="Manage contact requests, resolve issues, and track communication history."
        emoji="💬"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 40 }}>
        {stats.map((stat) => (
          <EnterpriseCard key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EFF6FF', color: A.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 13, color: A.inkSoft, fontWeight: 600 }}>{stat.label}</p>
              <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: A.ink, fontFamily: A.font }}>{stat.value}</h3>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: stat.label.includes('Unresolved') ? A.red : A.green, fontWeight: 600 }}>{stat.change}</p>
            </div>
          </EnterpriseCard>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedTicket ? '1fr 1fr' : '1fr', gap: 32, alignItems: 'start', transition: 'all 0.3s ease' }}>
        
        {/* TICKETS LIST */}
        <EnterpriseCard style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 280px)', minHeight: 600 }}>
          <div style={{ padding: '24px', borderBottom: `1px solid ${A.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: A.ink, fontFamily: A.font }}>Inbox</h3>
              <div style={{ display: 'flex', gap: 8, background: '#F1F5F9', padding: 4, borderRadius: 24 }}>
                {['All', 'Open', 'Pending', 'Resolved'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{ 
                      background: filter === f ? '#fff' : 'transparent', 
                      color: filter === f ? A.ink : A.inkSoft, 
                      border: 'none', 
                      padding: '6px 12px', 
                      borderRadius: 20, 
                      fontSize: 13, 
                      fontWeight: 600, 
                      cursor: 'pointer',
                      boxShadow: filter === f ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            
            <AdminSearch 
              placeholder="Search subjects, names, or emails..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filteredTickets.map(ticket => {
              const priorityStyle = getPriorityColor(ticket.priority);
              const statusStyle = getStatusColor(ticket.status);
              const isSelected = selectedTicket?.id === ticket.id;

              return (
                <div 
                  key={ticket.id} 
                  onClick={() => setSelectedTicket(ticket)}
                  style={{ 
                    padding: 24, 
                    borderBottom: `1px solid ${A.border}`, 
                    cursor: 'pointer', 
                    background: isSelected ? `${A.primary}08` : A.surface,
                    borderLeft: isSelected ? `4px solid ${A.primary}` : `4px solid transparent`,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => !isSelected && (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={e => !isSelected && (e.currentTarget.style.background = A.surface)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <h4 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: A.ink }}>{ticket.subject}</h4>
                      <div style={{ fontSize: 13, color: A.inkSoft, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: A.ink }}>{ticket.name}</span>
                        <span>•</span>
                        <span>{new Date(ticket.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                      <span style={{ fontSize: 11, background: statusStyle.bg, color: statusStyle.color, padding: '4px 10px', borderRadius: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {ticket.status}
                      </span>
                      <span style={{ fontSize: 11, background: priorityStyle.bg, color: priorityStyle.color, padding: '2px 8px', borderRadius: 6, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <AlertCircle size={10} /> {ticket.priority}
                      </span>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: A.inkSoft, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                    {ticket.message}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                    <span style={{ fontSize: 12, color: A.inkSoft, display: 'flex', alignItems: 'center', gap: 4, background: '#F1F5F9', padding: '4px 8px', borderRadius: 6, fontWeight: 600 }}>
                      <Tag size={12} /> {ticket.type}
                    </span>
                  </div>
                </div>
              );
            })}
            {filteredTickets.length === 0 && (
              <div style={{ padding: 60, textAlign: 'center', color: A.inkMute }}>
                <MessageSquare size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>No tickets found matching your criteria.</p>
              </div>
            )}
          </div>
        </EnterpriseCard>

        {/* TICKET DETAILS */}
        {selectedTicket && (
          <EnterpriseCard style={{ padding: 0, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 280px)', minHeight: 600 }}>
            <div style={{ padding: 32, borderBottom: `1px solid ${A.border}`, background: '#F8FAFC' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h2 style={{ margin: '0 0 16px', fontSize: 22, fontWeight: 800, color: A.ink, fontFamily: A.font }}>{selectedTicket.subject}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#E2E8F0', color: A.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 }}>
                      {selectedTicket.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ margin: '0 0 4px', fontWeight: 700, color: A.ink, fontSize: 15 }}>{selectedTicket.name}</p>
                      <a href={`mailto:${selectedTicket.email}`} style={{ color: A.primary, fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>{selectedTicket.email}</a>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <AdminButton variant="outline">Mark Resolved</AdminButton>
                  <button style={{ background: '#fff', border: `1px solid ${A.border}`, padding: '0 10px', borderRadius: A.radiusSm, color: A.inkSoft, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: A.inkSoft, fontWeight: 500 }}>
                  <Clock size={16} /> {new Date(selectedTicket.date).toLocaleString()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: A.inkSoft, fontWeight: 500 }}>
                  <Tag size={16} /> {selectedTicket.type}
                </div>
              </div>
            </div>

            <div style={{ padding: 32, flex: 1, overflowY: 'auto' }}>
              <div style={{ marginBottom: 32 }}>
                <div style={{ background: '#F8FAFC', padding: 24, borderRadius: 16, border: `1px solid ${A.border}`, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: -10, left: 24, background: '#fff', padding: '0 8px', fontSize: 11, fontWeight: 700, color: A.inkSoft, border: `1px solid ${A.border}`, borderRadius: 12, textTransform: 'uppercase' }}>User</div>
                  <p style={{ margin: 0, fontSize: 15, color: A.ink, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {selectedTicket.message}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ padding: 24, borderTop: `1px solid ${A.border}`, background: '#F8FAFC' }}>
              <div style={{ position: 'relative' }}>
                <textarea 
                  placeholder="Type your reply here..." 
                  style={{ width: '100%', padding: '16px 16px 48px', borderRadius: A.radiusSm, border: `1px solid ${A.border}`, fontSize: 14, outline: 'none', background: '#fff', color: A.ink, fontFamily: A.font, resize: 'none', minHeight: 120, boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = A.primary}
                  onBlur={e => e.target.style.borderColor = A.border}
                />
                <div style={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', gap: 12 }}>
                  <button style={{ background: 'transparent', border: 'none', color: A.inkSoft, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save Draft</button>
                  <AdminButton variant="blue" icon={<Send size={14} />}>
                    Send Reply
                  </AdminButton>
                </div>
              </div>
            </div>
          </EnterpriseCard>
        )}
      </div>
    </AdminPage>
  );
}