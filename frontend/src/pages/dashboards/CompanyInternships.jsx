import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, Plus, Users, UserCheck, Calendar, DollarSign, 
  MapPin, CheckCircle2, XCircle, Search, Filter, Sparkles, Building2
} from 'lucide-react';
import { useAuth } from '../../state/AuthContext';
import { 
  PremiumPage, PageHeader, GlassCard, PremiumStatCard, 
  GradientButton, Badge, SectionTitle, EmptyState, P 
} from '../../components/PremiumDesignSystem';

export default function CompanyInternships() {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);

  // Form State for new internship
  const [title, setTitle] = useState('');
  const [role, setRole] = useState('Full Stack Engineering Intern');
  const [duration, setDuration] = useState('3 Months');
  const [stipend, setStipend] = useState('₹25,000 / month');
  const [location, setLocation] = useState('Remote / Hybrid');
  const [requiredSkills, setRequiredSkills] = useState('React, Node.js, MongoDB, REST APIs');
  const [slots, setSlots] = useState(5);
  const [creating, setCreating] = useState(false);

  const companyId = user?._id || user?.id || 'comp-101';
  const companyName = user?.name || 'Optime Cloud Solutions';

  useEffect(() => {
    fetchInternshipData();
  }, [companyId]);

  const fetchInternshipData = async () => {
    setLoading(true);
    try {
      const [intRes, appRes] = await Promise.all([
        fetch('/api/internships'),
        fetch('/api/internships/applications')
      ]);
      if (intRes.ok) {
        const intData = await intRes.json();
        setInternships(intData.data || []);
      }
      if (appRes.ok) {
        const appData = await appRes.json();
        setApplications(appData.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch internships:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInternship = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);

    try {
      const res = await fetch('/api/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          companyName,
          title,
          role,
          duration,
          stipend,
          location,
          requiredSkills: requiredSkills.split(',').map(s => s.trim()),
          slots: Number(slots),
          status: 'active'
        })
      });

      if (res.ok) {
        setShowPostModal(false);
        setTitle('');
        fetchInternshipData();
      }
    } catch (err) {
      console.error('Failed to create internship:', err);
    } finally {
      setCreating(false);
    }
  };

  const totalSlots = internships.reduce((sum, item) => sum + (item.slots || 0), 0);
  const totalApplicants = applications.length;

  return (
    <PremiumPage>
      <PageHeader
        title="Industry Internships & Talent Pipeline"
        subtitle="Manage live industry internship openings, evaluate applicants, and track intern progress"
        emoji="💼"
        actions={
          <GradientButton onClick={() => setShowPostModal(true)}>
            <Plus size={18} /> Post New Internship
          </GradientButton>
        }
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        <PremiumStatCard
          label="Active Openings"
          value={internships.length}
          icon={<Briefcase size={24} />}
          gradientFrom="#5B5CFF"
          gradientTo="#8B5CF6"
        />
        <PremiumStatCard
          label="Total Available Seats"
          value={totalSlots}
          icon={<Users size={24} />}
          gradientFrom="#06B6D4"
          gradientTo="#3B82F6"
        />
        <PremiumStatCard
          label="SkillOS Candidates Applied"
          value={totalApplicants}
          icon={<UserCheck size={24} />}
          gradientFrom="#10B981"
          gradientTo="#059669"
        />
        <PremiumStatCard
          label="Avg. SPI Match"
          value="88%"
          icon={<Sparkles size={24} />}
          gradientFrom="#F59E0B"
          gradientTo="#D97706"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 28, alignItems: 'start' }}>
        {/* Active Openings List */}
        <GlassCard>
          <SectionTitle>Your Internship Programs</SectionTitle>
          {internships.length === 0 ? (
            <EmptyState
              icon={<Briefcase size={48} />}
              title="No internship programs created yet"
              subtitle="Post an internship program to start receiving pre-assessed candidates."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {internships.map((prog) => (
                <div
                  key={prog._id || prog.id}
                  style={{
                    padding: 20,
                    borderRadius: 16,
                    border: `1px solid ${P.border}`,
                    background: 'rgba(0,0,0,0.01)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: P.ink }}>
                        {prog.title}
                      </h4>
                      <div style={{ fontSize: 13, color: P.inkSoft, marginTop: 2 }}>{prog.role} • {prog.companyName}</div>
                    </div>
                    <Badge color="#16a34a" bg="rgba(34,197,94,0.1)">
                      {prog.slots} Slots Available
                    </Badge>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 12, color: P.inkSoft }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} /> {prog.duration}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><DollarSign size={14} /> {prog.stipend}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {prog.location}</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                    {(prog.requiredSkills || []).map((sk, i) => (
                      <span key={i} style={{ fontSize: 11, fontWeight: 600, background: 'rgba(91,92,255,0.08)', color: P.primary, padding: '3px 8px', borderRadius: 6 }}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Applicant Stream */}
        <GlassCard>
          <SectionTitle>Candidate Talent Pool</SectionTitle>
          {applications.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: P.inkMute }}>
              <Users size={36} style={{ opacity: 0.3, marginBottom: 8 }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: P.inkSoft }}>No applicants yet</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Candidates matching your required skills will appear here.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {applications.map((app) => (
                <div
                  key={app._id || app.id}
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    border: `1px solid ${P.border}`,
                    background: 'rgba(0,0,0,0.02)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: P.ink }}>
                      {app.studentName || 'Tharani S'}
                    </div>
                    <div style={{ fontSize: 12, color: P.inkSoft, marginTop: 2 }}>
                      Applying for: <b>{app.internshipTitle || 'Full Stack Intern'}</b>
                    </div>
                    <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 700, marginTop: 4 }}>
                      ⚡ SkillOS Match: {app.matchScore || '92%'} • SPI: 885
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <Badge color="#5B5CFF" bg="rgba(91,92,255,0.1)">
                      {app.status || 'Under Review'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Post Internship Modal */}
      {showPostModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20
        }}>
          <GlassCard style={{ maxWidth: 540, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: P.ink }}>Post Internship Opportunity</h3>
              <button onClick={() => setShowPostModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: P.inkMute }}>✕</button>
            </div>

            <form onSubmit={handleCreateInternship} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: P.ink, marginBottom: 4 }}>Program Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cloud & Full Stack Engineering Summer Cohort"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${P.border}`, fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: P.ink, marginBottom: 4 }}>Role Domain</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${P.border}`, fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: P.ink, marginBottom: 4 }}>Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${P.border}`, fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: P.ink, marginBottom: 4 }}>Monthly Stipend</label>
                  <input
                    type="text"
                    value={stipend}
                    onChange={(e) => setStipend(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${P.border}`, fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: P.ink, marginBottom: 4 }}>Available Slots</label>
                  <input
                    type="number"
                    min="1"
                    value={slots}
                    onChange={(e) => setSlots(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${P.border}`, fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: P.ink, marginBottom: 4 }}>Location / Format</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${P.border}`, fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: P.ink, marginBottom: 4 }}>Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={requiredSkills}
                  onChange={(e) => setRequiredSkills(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${P.border}`, fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <GradientButton type="button" variant="outline" onClick={() => setShowPostModal(false)} style={{ flex: 1 }}>
                  Cancel
                </GradientButton>
                <GradientButton type="submit" disabled={creating} style={{ flex: 1 }}>
                  {creating ? 'Publishing...' : 'Publish Opening'}
                </GradientButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </PremiumPage>
  );
}
