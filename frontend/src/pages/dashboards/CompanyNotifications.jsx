import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../state/useAuth';
import { BookOpen, FileText, Bell, MessageSquare } from 'lucide-react';
import { generatePremiumResume } from '../../utils/resumeGenerator';
import { PremiumPage, PageHeader, GlassCard, GradientButton, Badge, P } from '../../components/PremiumDesignSystem';

export default function CompanyNotifications() {
  const { user } = useAuth();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        if (data.success) {
          const assignedTrainers = user?.assignedTrainers || [];
          setTrainers(data.users.filter(u => u.role?.toLowerCase() === 'trainer' && assignedTrainers.includes(u.email)));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, [user]);

  const handleRequestContact = async (trainerName) => {
    try {
      await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actor: user?.companyName || user?.fullName || user?.email,
          action: 'Contact Details Request',
          details: `Requested contact details for trainer: ${trainerName}`
        })
      });
      alert('Request sent to admin successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to send request.');
    }
  };

  return (
    <PremiumPage>
      <PageHeader
        title="Notifications"
        subtitle="Your latest updates and assigned trainers."
        emoji="🔔"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 }}>
        {user?.notifications && user.notifications.length > 0 ? (
          user.notifications.map((n, idx) => (
            <motion.div
              key={n.id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Bell size={16} color={P.primary} />
                    <strong style={{ color: P.primary, fontSize: 15, fontWeight: 800 }}>{n.sender || 'System'}</strong>
                  </div>
                  <span style={{ fontSize: 12, color: P.inkMute, fontWeight: 600 }}>{n.time}</span>
                </div>
                <p style={{ margin: 0, color: P.inkSoft, fontSize: 14, lineHeight: 1.5 }}>{n.text}</p>
              </GlassCard>
            </motion.div>
          ))
        ) : (
          <GlassCard style={{ textAlign: 'center', padding: 48 }}>
            <p style={{ color: P.inkMute, margin: 0 }}>No new notifications.</p>
          </GlassCard>
        )}
      </div>

      <h3 style={{ margin: '0 0 20px 0', fontSize: 20, fontWeight: 800, color: P.ink, fontFamily: P.font }}>Assigned Trainers</h3>
      
      {loading ? (
        <div style={{ color: P.inkMute }}>Loading trainers...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {trainers.length === 0 ? (
            <GlassCard style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 48 }}>
              <p style={{ color: P.inkMute, margin: 0 }}>No trainers have been assigned to your company yet.</p>
            </GlassCard>
          ) : (
            trainers.map((trainer, idx) => (
              <motion.div
                key={trainer._id || trainer.id || trainer.email}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                      width: 60, height: 60, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${P.primary}, ${P.secondary})`,
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 24, fontWeight: 800, flexShrink: 0,
                      boxShadow: '0 8px 20px rgba(91,92,255,0.2)'
                    }}>
                      {trainer.fullName?.charAt(0) || trainer.email?.charAt(0)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ margin: '0 0 6px 0', fontSize: 18, fontWeight: 800, color: P.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {trainer.fullName || 'Unnamed Trainer'}
                      </h3>
                      <Badge color={P.green} bg="rgba(34,197,94,0.1)">
                        Active Trainer
                      </Badge>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: `1px solid ${P.border}`, paddingTop: 16, marginTop: 4 }}>
                    {trainer.specialization && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: P.inkSoft, fontSize: 14, fontWeight: 600 }}>
                        <BookOpen size={16} color={P.inkMute} />
                        <span>{trainer.specialization}</span>
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                      <GradientButton
                        onClick={() => generatePremiumResume(trainer, true)}
                        style={{ flex: 1, padding: '10px 14px' }}
                      >
                        <FileText size={16} /> View Resume
                      </GradientButton>
                      <GradientButton
                        onClick={() => handleRequestContact(trainer.fullName || trainer.email)}
                        variant="outline"
                        style={{ flex: 1, padding: '10px 14px' }}
                      >
                        <MessageSquare size={14} /> Contact
                      </GradientButton>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      )}
    </PremiumPage>
  );
}
