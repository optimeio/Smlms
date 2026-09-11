import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, QrCode, Award, Download, Share2, CheckCircle2, 
  ExternalLink, Sparkles, Building2, UserCheck, Star, Briefcase 
} from 'lucide-react';
import { useAuth } from '../../state/AuthContext';
import { 
  PremiumPage, PageHeader, GlassCard, 
  GradientButton, Badge, SectionTitle, P 
} from '../../components/PremiumDesignSystem';

export default function StudentSkillPassport() {
  const { user } = useAuth();
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const studentId = user?._id || user?.id || 'std-101';
  const passportId = `MBK-${studentId.toString().slice(-6).toUpperCase()}-PASS`;

  useEffect(() => {
    fetchPassport();
  }, [studentId]);

  const fetchPassport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/certificates/passport/${studentId}`);
      if (res.ok) {
        const data = await res.json();
        setPassport(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch passport:', err);
    } finally {
      setLoading(false);
    }
  };

  const verifyUrl = `${window.location.origin}/verify/${passportId}`;

  const copyVerifyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <PremiumPage>
      <PageHeader
        title="Digital Skill Passport"
        subtitle="Cryptographically verifiable SkillOS credential, verified competencies & industry endorsements"
        emoji="🛡️"
        actions={
          <div style={{ display: 'flex', gap: 12 }}>
            <GradientButton variant="ghost" onClick={copyVerifyLink}>
              <Share2 size={16} />
              {copied ? 'Link Copied!' : 'Share Passport'}
            </GradientButton>
            <GradientButton onClick={() => window.print()}>
              <Download size={16} />
              Export PDF
            </GradientButton>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, alignItems: 'start' }}>
        {/* Passport Card (Visual ID) */}
        <motion.div
          initial={{ rotateY: -10, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #1e1e38 0%, #0d0e1f 100%)',
            borderRadius: 24,
            padding: 36,
            color: '#fff',
            boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.12)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Holographic glowing orb background */}
            <div style={{
              position: 'absolute', top: -80, right: -80, width: 260, height: 260,
              background: 'radial-gradient(circle, rgba(91,92,255,0.4) 0%, transparent 70%)',
              filter: 'blur(40px)', pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute', bottom: -60, left: -60, width: 220, height: 220,
              background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
              filter: 'blur(40px)', pointerEvents: 'none'
            }} />

            {/* Passport Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'linear-gradient(135deg, #5B5CFF, #EC4899)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900
                }}>
                  <ShieldCheck size={26} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '0.5px' }}>MBK SkillOS</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', textTransform: 'uppercase' }}>Verified Skill Passport</div>
                </div>
              </div>
              <Badge color="#4ADE80" bg="rgba(74,222,128,0.15)">
                ● VERIFIED ACTIVE
              </Badge>
            </div>

            {/* Student Info */}
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 28, position: 'relative', zIndex: 1 }}>
              <div style={{
                width: 80, height: 80, borderRadius: 20,
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, fontWeight: 800, border: '2px solid rgba(255,255,255,0.2)'
              }}>
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ST'}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{user?.name || 'Tharani S'}</h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                  Candidate ID: <span style={{ fontFamily: 'monospace', color: '#93C5FD' }}>{studentId}</span>
                </p>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.12)', padding: '2px 8px', borderRadius: 6 }}>
                    Level: Industry Ready
                  </span>
                  <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.12)', padding: '2px 8px', borderRadius: 6 }}>
                    SPI: 885 / 1000
                  </span>
                </div>
              </div>
            </div>

            {/* Competency Badges on Card */}
            <div style={{ marginBottom: 28, position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Endorsed Core Competencies
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Full-Stack Development', 'React.js Architecture', 'Node.js & Microservices', 'Cloud Infrastructure', 'Agile & DevOps'].map((skill, idx) => (
                  <span key={idx} style={{
                    fontSize: 12, fontWeight: 600,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    padding: '6px 12px', borderRadius: 8,
                    display: 'flex', alignItems: 'center', gap: 6
                  }}>
                    <Sparkles size={12} color="#FBBF24" /> {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom QR & Verification Bar */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 20, position: 'relative', zIndex: 1
            }}>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>PASSPORT TOKEN</div>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: '#60A5FA' }}>{passportId}</div>
              </div>
              <div style={{
                background: '#fff', padding: 8, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <QrCode size={44} color="#1e1e38" />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <a 
              href={`/verify/${passportId}`} 
              target="_blank" 
              rel="noreferrer"
              style={{ fontSize: 13, color: P.primary, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}
            >
              Preview Public Verification Portal <ExternalLink size={14} />
            </a>
          </div>
        </motion.div>

        {/* Verification & Endorsement Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <GlassCard>
            <SectionTitle>Multi-Stakeholder Endorsements</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { title: 'Training Institute / Guru', name: 'MBK Skill Center - Lead Trainer', status: 'Endorsed', date: 'Sept 2026', icon: <UserCheck size={18} color="#5B5CFF" /> },
                { title: 'Partner College / Dean', name: 'Dept. of Information Technology', status: 'Endorsed', date: 'Aug 2026', icon: <Building2 size={18} color="#10B981" /> },
                { title: 'Industry Internship Partner', name: 'Optime Cloud Solutions', status: 'Verified Hours', date: 'Sept 2026', icon: <Briefcase size={18} color="#F59E0B" /> }
              ].map((end, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 14, background: 'rgba(0,0,0,0.02)', border: `1px solid ${P.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ padding: 8, borderRadius: 10, background: 'rgba(91,92,255,0.08)' }}>
                      {end.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: P.ink }}>{end.title}</div>
                      <div style={{ fontSize: 12, color: P.inkSoft }}>{end.name}</div>
                    </div>
                  </div>
                  <Badge color="#16a34a" bg="rgba(34,197,94,0.1)">
                    <CheckCircle2 size={12} /> {end.status}
                  </Badge>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <SectionTitle>Verified Skill Progression Breakdown</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { domain: 'Core Engineering (React, Node, DB)', progress: 92, level: 'Industry Ready' },
                { domain: 'System Design & APIs', progress: 84, level: 'Advanced' },
                { domain: 'DevOps & Cloud Deployment', progress: 78, level: 'Advanced' },
                { domain: 'Professional Ethics & Soft Skills', progress: 95, level: 'Industry Ready' }
              ].map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                    <span style={{ color: P.ink }}>{item.domain}</span>
                    <span style={{ color: P.primary }}>{item.level} ({item.progress}%)</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${item.progress}%`,
                      background: 'linear-gradient(90deg, #5B5CFF, #8B5CF6)',
                      borderRadius: 4
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </PremiumPage>
  );
}
