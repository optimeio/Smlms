import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../state/useAuth';
import { BookOpen, FileText, Sparkles, UserCheck, MessageSquare, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { generatePremiumResume } from '../../utils/resumeGenerator';
import { PremiumPage, PageHeader, GlassCard, GradientButton, Badge, P } from '../../components/PremiumDesignSystem';

export default function CompanyTrainers() {
  const { user } = useAuth();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        // Fetch latest company profile to get up-to-date assignedTrainers list
        const profileRes = await fetch(`/api/users/${user?.email}?requester=${user?.email}`);
        const profileData = await profileRes.json();
        const latestAssignedTrainers = profileData.success ? (profileData.user?.assignedTrainers || []) : (user?.assignedTrainers || []);

        const res = await fetch('/api/users');
        const data = await res.json();
        if (data.success) {
          // Filter to only those whose email is in assignedTrainers or registered by this company
          setTrainers(data.users.filter(u => 
            u.role?.toLowerCase() === 'trainer' && 
            (latestAssignedTrainers.includes(u.email) || u.companyEmail === user?.email)
          ));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, [user]);

  const getProfileAgeLabel = (createdAt) => {
    if (!createdAt) return 'Joined some time ago';
    const created = new Date(createdAt);
    const diffTime = Math.abs(new Date() - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      return '🆕 New (Today)';
    }
    if (diffDays <= 7) {
      return `🆕 New (${diffDays} days ago)`;
    }
    return `Joined ${diffDays} days ago`;
  };

  // Check if a trainer was registered by this company (full access to details)
  const isOwnTrainer = (trainer) => {
    return trainer.companyEmail === user?.email;
  };

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

  const detailRow = (icon, label, value) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: P.inkSoft, fontWeight: 600 }}>
      <div style={{ 
        width: 30, height: 30, borderRadius: 8, 
        background: 'rgba(91,92,255,0.06)', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
      }}>
        {icon}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span style={{ fontSize: 10, color: P.inkMute, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
        <span style={{ color: P.ink, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value || 'N/A'}</span>
      </div>
    </div>
  );

  return (
    <PremiumPage>
      <PageHeader
        title="Trainer Directory"
        subtitle="View the profiles of trainers assigned to your company."
        emoji="👨‍🏫"
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: P.inkMute }}>Loading trainers...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
          {trainers.length === 0 ? (
            <GlassCard style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 60 }}>
              <p style={{ color: P.inkMute, margin: 0 }}>No trainers have been assigned to your company yet.</p>
            </GlassCard>
          ) : (
            trainers.map((trainer, idx) => {
              const ownTrainer = isOwnTrainer(trainer);
              return (
                <motion.div
                  key={trainer._id || trainer.id || trainer.email}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
                    {/* Header */}
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
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <h3 style={{ margin: '0 0 6px 0', fontSize: 18, fontWeight: 800, color: P.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {trainer.fullName || 'Unnamed Trainer'}
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                          <Badge color={P.green} bg="rgba(34,197,94,0.1)">
                            Active Trainer
                          </Badge>
                          {ownTrainer && (
                            <Badge color="#e67e22" bg="rgba(230,126,34,0.1)">
                              Your Hire
                            </Badge>
                          )}
                          <Badge 
                            color={getProfileAgeLabel(trainer.createdAt).includes('New') ? P.primary : P.inkMute} 
                            bg={getProfileAgeLabel(trainer.createdAt).includes('New') ? 'rgba(91,92,255,0.1)' : 'rgba(100,116,139,0.06)'}
                          >
                            {getProfileAgeLabel(trainer.createdAt)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Private Details — visible for company-registered trainers */}
                    {ownTrainer ? (
                      <div style={{ 
                        display: 'flex', flexDirection: 'column', gap: 10, 
                        borderTop: `1px solid ${P.border}`, paddingTop: 16, marginTop: 4 
                      }}>
                        {detailRow(<Mail size={14} color={P.primary} />, 'Email', trainer.email)}
                        {detailRow(<Phone size={14} color={P.primary} />, 'Phone', trainer.phone)}
                        {trainer.specialization && detailRow(<BookOpen size={14} color={P.primary} />, 'Specialization', trainer.specialization)}
                        {trainer.courseName && detailRow(<FileText size={14} color={P.primary} />, 'Course', trainer.courseName)}
                        {trainer.teachingMode && detailRow(<Clock size={14} color={P.primary} />, 'Teaching Mode', trainer.teachingMode)}

                        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                          <GradientButton
                            onClick={() => generatePremiumResume(trainer, false)}
                            style={{ flex: 1, padding: '10px 14px' }}
                          >
                            <FileText size={16} /> View Resume
                          </GradientButton>
                        </div>
                      </div>
                    ) : (
                      /* External trainers — require admin request for contact */
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
                    )}
                  </GlassCard>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </PremiumPage>
  );
}

