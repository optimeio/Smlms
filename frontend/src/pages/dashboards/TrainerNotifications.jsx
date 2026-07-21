import React, { useState, useEffect } from 'react';
import { PremiumPage, PageHeader, GlassCard, EmptyState, P } from '../../components/PremiumDesignSystem';
import { Bell, Clock, Building } from 'lucide-react';
import { useAuth } from '../../state/useAuth';

export default function TrainerNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        if (data.success) {
          const me = data.users.find(u => u.email === user?.email);
          if (me && me.notifications) {
            setNotifications(me.notifications);
          }
        }
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.email) {
      fetchNotifications();
    } else {
      setTimeout(() => setLoading(false), 0);
    }
  }, [user]);

  return (
    <PremiumPage>
      <PageHeader 
        title="Trainer Notifications" 
        subtitle="Stay updated on your new assignments and alerts."
        emoji="🔔"
      />
      <GlassCard>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: P.inkMute }}>Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <EmptyState 
              icon={<Bell size={64} color={P.primary} />}
              title="No Notifications"
              subtitle="You're all caught up! When you get assigned to new companies or courses, they will appear here."
            />
          ) : (
            notifications.map((notif, idx) => (
              <div 
                key={notif.id || idx}
                style={{
                  padding: 20, 
                  background: 'rgba(99,102,241,0.03)', 
                  borderRadius: 14,
                  border: `1px solid ${P.border}`,
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start'
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                  <Building size={20} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: P.ink }}>
                    {notif.sender || 'System'}
                  </h4>
                  <p style={{ margin: '0 0 12px', fontSize: 14, color: P.inkSoft, lineHeight: 1.5 }}>
                    {notif.text}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: P.inkMute, fontWeight: 600 }}>
                    <Clock size={14} />
                    {notif.time || new Date(notif.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </PremiumPage>
  );
}