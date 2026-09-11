import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, Building2, Award, TrendingUp, Users, 
  CheckCircle2, BookOpen, BarChart3, Star, Sparkles 
} from 'lucide-react';
import { useAuth } from '../../state/AuthContext';
import { 
  PremiumPage, PageHeader, GlassCard, PremiumStatCard, 
  GradientButton, Badge, SectionTitle, P 
} from '../../components/PremiumDesignSystem';

export default function CollegeDashboard() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollegeOverview();
  }, []);

  const fetchCollegeOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/college/overview');
      if (res.ok) {
        const data = await res.json();
        setOverview(data.data);
      }
    } catch (err) {
      console.error('Failed to load college overview:', err);
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    { name: 'Computer Science & Engineering', students: 240, avgSpi: 840, industryReady: '78%', placementPlaced: 45 },
    { name: 'Information Technology', students: 180, avgSpi: 815, industryReady: '72%', placementPlaced: 38 },
    { name: 'AI & Data Science', students: 120, avgSpi: 890, industryReady: '88%', placementPlaced: 28 },
    { name: 'Electronics & Communication', students: 160, avgSpi: 760, industryReady: '64%', placementPlaced: 22 }
  ];

  return (
    <PremiumPage>
      <PageHeader
        title="Partner College & University Analytics"
        subtitle="Department-wise skill progression, placement readiness, and academic accreditation metrics"
        emoji="🎓"
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        <PremiumStatCard
          label="Total Enrolled Undergraduates"
          value="700"
          icon={<GraduationCap size={24} />}
          gradientFrom="#5B5CFF"
          gradientTo="#8B5CF6"
        />
        <PremiumStatCard
          label="Industry Ready Percentage"
          value="75.5%"
          icon={<Sparkles size={24} />}
          gradientFrom="#10B981"
          gradientTo="#059669"
        />
        <PremiumStatCard
          label="Skill Passports Verified"
          value="520"
          icon={<Award size={24} />}
          gradientFrom="#06B6D4"
          gradientTo="#3B82F6"
        />
        <PremiumStatCard
          label="Active Campus Drives"
          value="12"
          icon={<Building2 size={24} />}
          gradientFrom="#F59E0B"
          gradientTo="#D97706"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28, alignItems: 'start' }}>
        {/* Department Table */}
        <GlassCard>
          <SectionTitle>Departmental Skill Progression Index (SPI)</SectionTitle>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${P.border}`, color: P.inkMute, fontSize: 13, fontWeight: 700 }}>
                  <th style={{ padding: '12px 14px' }}>DEPARTMENT</th>
                  <th style={{ padding: '12px 14px' }}>STUDENTS</th>
                  <th style={{ padding: '12px 14px' }}>AVG SPI</th>
                  <th style={{ padding: '12px 14px' }}>INDUSTRY READY</th>
                  <th style={{ padding: '12px 14px' }}>OFFERS</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept, idx) => (
                  <tr key={idx} style={{ borderBottom: `1px solid ${P.border}` }}>
                    <td style={{ padding: '16px 14px', fontWeight: 700, color: P.ink }}>
                      {dept.name}
                    </td>
                    <td style={{ padding: '16px 14px', color: P.inkSoft, fontSize: 13 }}>
                      {dept.students}
                    </td>
                    <td style={{ padding: '16px 14px', fontWeight: 800, color: P.primary, fontSize: 13 }}>
                      {dept.avgSpi} / 1000
                    </td>
                    <td style={{ padding: '16px 14px' }}>
                      <Badge color="#16a34a" bg="rgba(34,197,94,0.1)">
                        {dept.industryReady}
                      </Badge>
                    </td>
                    <td style={{ padding: '16px 14px', color: P.inkSoft, fontSize: 13 }}>
                      {dept.placementPlaced} offers
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Skill Readiness Distribution */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <GlassCard>
            <SectionTitle>Overall Competency Matrix</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Industry Ready (Level 4)', count: '528 Students', pct: 75.5, color: '#10B981' },
                { label: 'Advanced (Level 3)', count: '112 Students', pct: 16.0, color: '#5B5CFF' },
                { label: 'Intermediate (Level 2)', count: '45 Students', pct: 6.5, color: '#F59E0B' },
                { label: 'Beginner (Level 1)', count: '15 Students', pct: 2.0, color: '#EC4899' }
              ].map((tier, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                    <span style={{ color: P.ink }}>{tier.label}</span>
                    <span style={{ color: tier.color }}>{tier.count} ({tier.pct}%)</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${tier.pct}%`, background: tier.color, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <SectionTitle>Accreditation & NAAC/NBA Compliance</SectionTitle>
            <p style={{ margin: 0, fontSize: 13, color: P.inkSoft, lineHeight: 1.6 }}>
              Student Skill Passports are fully auditable with cryptographic QR verification, satisfying continuous assessment & outcome-based education (OBE) guidelines.
            </p>
          </GlassCard>
        </div>
      </div>
    </PremiumPage>
  );
}
