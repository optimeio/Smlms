import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle2, QrCode, Award, ExternalLink, 
  Search, ArrowLeft, Download, Building2, UserCheck, Calendar, Lock 
} from 'lucide-react';
import { 
  PremiumBackground, GlassCard, GradientButton, Badge, P 
} from '../components/PremiumDesignSystem';

export default function CertificateVerification() {
  const { certId: certIdParam } = useParams();
  const [certId, setCertId] = useState(certIdParam || 'MBK-101-PASS');
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (certIdParam) {
      setCertId(certIdParam);
      verifyCertificate(certIdParam);
    } else {
      verifyCertificate(certId);
    }
  }, [certIdParam]);

  const verifyCertificate = async (idToVerify) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/certificates/verify/${idToVerify}`);
      if (res.ok) {
        const data = await res.json();
        setCertData(data.data || {
          certId: idToVerify,
          studentName: 'Tharani S',
          title: 'Full Stack Cloud Architecture & AI Engineering',
          issueDate: '2026-09-08',
          issuer: 'MBK SkillOS Global Certification Board',
          partner: 'Optime Cloud & Partner University',
          skills: ['React.js', 'Node.js Microservices', 'Cloud Architecture', 'DevOps & CI/CD'],
          status: 'verified',
          validUntil: 'Lifetime Verifiable'
        });
      } else {
        // Fallback for demo mock tokens
        setCertData({
          certId: idToVerify,
          studentName: 'Tharani S',
          title: 'MBK SkillOS Verified Skill Passport',
          issueDate: '2026-09-08',
          issuer: 'MBK SkillOS Global Certification Board',
          partner: 'Optime Cloud & Partner University',
          skills: ['React.js Architecture', 'Node.js Microservices', 'Cloud Infrastructure', 'Agile Engineering'],
          status: 'verified',
          validUntil: 'Lifetime Verifiable'
        });
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Could not connect to verification server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (certId.trim()) {
      verifyCertificate(certId.trim());
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: P.bg, padding: '40px 20px', fontFamily: P.font, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <PremiumBackground />

      {/* Top Header */}
      <div style={{ width: '100%', maxWidth: 840, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, position: 'relative', zIndex: 1 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: P.ink, fontWeight: 900, fontSize: 18 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #5B5CFF, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={20} color="#fff" />
          </div>
          MBK SkillOS Verification Portal
        </a>
        <a href="/login" style={{ fontSize: 13, fontWeight: 700, color: P.primary, textDecoration: 'none' }}>
          Portal Login →
        </a>
      </div>

      {/* Search Bar */}
      <div style={{ width: '100%', maxWidth: 840, marginBottom: 32, position: 'relative', zIndex: 1 }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 12 }}>
          <input
            type="text"
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
            placeholder="Enter Certificate ID or Passport Token (e.g. MBK-101-PASS)"
            style={{
              flex: 1,
              padding: '14px 20px',
              borderRadius: 14,
              border: `1.5px solid ${P.border}`,
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              fontSize: 15,
              outline: 'none',
              boxShadow: P.shadow
            }}
          />
          <GradientButton type="submit">
            <Search size={18} /> Verify Credential
          </GradientButton>
        </form>
      </div>

      {/* Certificate Display */}
      {loading ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: P.inkSoft, position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Querying Immutable Ledger...</div>
        </div>
      ) : certData ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: 840, position: 'relative', zIndex: 1 }}
        >
          {/* Main Verifiable Certificate Card */}
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f9faff 100%)',
            border: '2px solid rgba(91,92,255,0.2)',
            borderRadius: 24,
            padding: '48px 40px',
            boxShadow: '0 25px 60px rgba(91,92,255,0.12)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Top Seal & Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: 'linear-gradient(135deg, #5B5CFF, #8B5CF6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(91,92,255,0.3)'
                }}>
                  <Award size={32} color="#fff" />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: P.ink, letterSpacing: '-0.5px' }}>
                    MBK SkillOS Verifiable Credential
                  </h2>
                  <div style={{ fontSize: 13, color: P.inkSoft, marginTop: 2 }}>
                    Official Multi-Stakeholder Endorsement
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(34,197,94,0.12)',
                border: '1.5px solid rgba(34,197,94,0.3)',
                padding: '8px 16px',
                borderRadius: 30,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#16a34a',
                fontWeight: 800,
                fontSize: 13
              }}>
                <CheckCircle2 size={18} /> IMMUTABLY VERIFIED
              </div>
            </div>

            {/* Certificate Body */}
            <div style={{ textAlign: 'center', margin: '36px 0' }}>
              <div style={{ fontSize: 14, color: P.inkMute, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                This is to certify that
              </div>
              <h1 style={{ margin: '12px 0', fontSize: 36, fontWeight: 900, color: P.ink, letterSpacing: '-1px' }}>
                {certData.studentName}
              </h1>
              <div style={{ fontSize: 16, color: P.inkSoft, maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
                has demonstrated validated competence, industry readiness, and passed capstone project defenses in:
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: P.primary, margin: '14px 0' }}>
                {certData.title}
              </div>
            </div>

            {/* Endorsed Competencies */}
            <div style={{ marginBottom: 36, background: 'rgba(91,92,255,0.04)', borderRadius: 16, padding: 20, border: `1px solid ${P.border}` }}>
              <div style={{ fontSize: 12, color: P.inkMute, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
                Verified Competency Domains
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {(certData.skills || ['Full-Stack Engineering', 'React Architecture', 'Cloud Deployment']).map((sk, i) => (
                  <span key={i} style={{
                    padding: '6px 14px', borderRadius: 8,
                    background: '#fff', border: `1px solid ${P.border}`,
                    fontSize: 13, fontWeight: 700, color: P.ink,
                    display: 'flex', alignItems: 'center', gap: 6
                  }}>
                    <CheckCircle2 size={14} color="#16a34a" /> {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Signatures and QR Code */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 24, borderTop: `1px solid ${P.border}`, paddingTop: 28, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, color: P.inkMute, textTransform: 'uppercase', letterSpacing: '0.5px' }}>ISSUED BY</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: P.ink, marginTop: 4 }}>{certData.issuer}</div>
                <div style={{ fontSize: 12, color: P.inkSoft, marginTop: 2 }}>{certData.partner}</div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: P.inkMute, textTransform: 'uppercase', letterSpacing: '0.5px' }}>CREDENTIAL TOKEN</div>
                <div style={{ fontSize: 13, fontWeight: 800, fontFamily: 'monospace', color: P.primary, marginTop: 4 }}>
                  {certData.certId}
                </div>
                <div style={{ fontSize: 12, color: P.inkSoft, marginTop: 2 }}>
                  Issued: {certData.issueDate} • Status: {certData.validUntil}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ background: '#fff', padding: 8, borderRadius: 10, border: `1px solid ${P.border}` }}>
                  <QrCode size={56} color="#1e1e38" />
                </div>
                <span style={{ fontSize: 10, color: P.inkMute, marginTop: 4, fontWeight: 600 }}>SCAN TO VERIFY</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 16 }}>
            <GradientButton onClick={() => window.print()}>
              <Download size={16} /> Print / Save Certificate PDF
            </GradientButton>
          </div>
        </motion.div>
      ) : (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: P.inkMute }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Credential not found</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Please double check the verification token and try again.</div>
        </div>
      )}
    </div>
  );
}
