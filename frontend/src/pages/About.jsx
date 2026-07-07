import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CoursesModal from '../components/CoursesModal';
import { Link } from 'react-router-dom';
import '../styles/About.css';

export default function About() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [stats, setStats] = useState({
    students: 0,
    companies: 0,
    courses: 0,
    success: 0,
    trainers: 0,
    clients: 0
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCoords({
        x: (e.clientX - window.innerWidth / 2) / 30,
        y: (e.clientY - window.innerHeight / 2) / 30
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Count up animation
    const duration = 2000;
    const steps = 50;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setStats({
        students: Math.min(Math.floor((25000 / steps) * currentStep), 25000),
        companies: Math.min(Math.floor((500 / steps) * currentStep), 500),
        courses: Math.min(Math.floor((120 / steps) * currentStep), 120),
        success: Math.min(Math.floor((95 / steps) * currentStep), 95),
        trainers: Math.min(Math.floor((40 / steps) * currentStep), 40),
        clients: Math.min(Math.floor((505 / steps) * currentStep), 50)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="about-page-container">
      <Navbar />

      {/* Decorative Blobs */}
      <div className="hero-gradient-blobs">
        <div className="blob blob-orange" style={{ transform: `translate(${coords.x * 0.25}px, ${coords.y * 0.25}px)` }}></div>
        <div className="blob blob-purple" style={{ transform: `translate(${coords.x * -0.2}px, ${coords.y * -0.2}px)` }}></div>
        <div className="blob blob-pink" style={{ transform: `translate(${coords.x * 0.35}px, ${coords.y * 0.35}px)` }}></div>
        <div className="blob blob-blue" style={{ transform: `translate(${coords.x * -0.3}px, ${coords.y * -0.3}px)` }}></div>
      </div>

      {/* Sparkles & Plus signs */}
      <div className="sparkle sparkle-1">✦</div>
      <div className="sparkle sparkle-2">✦</div>
      <div className="plus-icon plus-1">+</div>
      <div className="plus-icon plus-2">+</div>
      <div className="orange-dot dot-1"></div>
      <div className="orange-dot dot-2"></div>

      {/* Floating Tech Badges */}
      <div className="floating-tech-card-glass tech-react" style={{ transform: `translate(${coords.x * 0.7}px, ${coords.y * 0.7}px)` }}>⚛️ React</div>
      <div className="floating-tech-card-glass tech-python" style={{ transform: `translate(${coords.x * 1.1}px, ${coords.y * 1.1}px)` }}>🐍 Python</div>
      <div className="floating-tech-card-glass tech-java" style={{ transform: `translate(${coords.x * 0.8}px, ${coords.y * 0.8}px)` }}>☕ Java</div>
      <div className="floating-tech-card-glass tech-node" style={{ transform: `translate(${coords.x * 1.0}px, ${coords.y * 1.0}px)` }}>🟢 Node</div>
      <div className="floating-tech-card-glass tech-sql" style={{ transform: `translate(${coords.x * 0.6}px, ${coords.y * 0.6}px)` }}>🛢️ SQL</div>
      <div className="floating-tech-card-glass tech-aws" style={{ transform: `translate(${coords.x * 1.2}px, ${coords.y * 1.2}px)` }}>☁️ AWS</div>
      <div className="floating-tech-card-glass tech-docker" style={{ transform: `translate(${coords.x * 0.9}px, ${coords.y * 0.9}px)` }}>🐋 Docker</div>
      <div className="floating-tech-card-glass tech-github" style={{ transform: `translate(${coords.x * 0.5}px, ${coords.y * 0.5}px)` }}>🐙 GitHub</div>

      <main className="about-main">
        {/* ==================== HERO SECTION ==================== */}
        <section className="about-hero-section">
          <div className="landing-container hero-grid-about">
            <div className="about-hero-left">
              <div className="community-badge animate-pulse-badge">
                <span className="badge-arrow">🚀</span>
                <span className="badge-text">ABOUT MBK TECHNOLOGY</span>
              </div>
              
              <h1 className="about-main-heading">
                Engineering Excellence <br />
                Building Tomorrow's <br />
                <span className="highlight-gradient-text">Digital Workforce</span>
              </h1>

              <p className="about-subtitle-desc">
                MBK Technology empowers students, professionals, and organizations through industry-driven training, internships, real-world projects, LMS solutions, and placement services.
              </p>

              <div className="about-hero-ctas">
                <Link to="/courses" className="cta-button-orange glow-btn ripple" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Explore Courses</Link>
                <button className="cta-button-secondary ripple">Our Services</button>
              </div>
            </div>

            <div className="about-hero-right">
              <div className="illustration-card-container">
                <div className="illustration-icon">🎓</div>
                <div className="illustration-laptop">💻 Coding & Development</div>
                <div className="illustration-details">
                  <span>🤖 AI Tech</span>
                  <span>☁️ Cloud Architecture</span>
                  <span>📊 Live Analytics</span>
                  <span>💼 Placement Solutions</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== WHY MBK TECHNOLOGY ==================== */}
        <section className="about-pillars-section">
          <div className="landing-container">
            <h2 className="section-title-center">Why MBK Technology</h2>
            <div className="pillars-grid-6">
              {[
                { emoji: '🎓', title: 'Industry-Oriented Learning', text: 'Gain hands-on corporate practical knowledge.' },
                { emoji: '💼', title: 'Placement Assistance', text: 'Secure interviews with top hiring partners.' },
                { emoji: '🏆', title: 'Certifications', text: 'Earn industry-approved verifiable badges.' },
                { emoji: '💻', title: 'Live Projects', text: 'Build real-world industrial systems.' },
                { emoji: '🤖', title: 'AI Resume Builder', text: 'Generate professional ATS-friendly resumes.' },
                { emoji: '👨‍🏫', title: 'Expert Mentorship', text: 'Learn directly from certified professionals.' }
              ].map((card, idx) => (
                <motion.div 
                  key={idx}
                  className="pillar-card-glass"
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <span className="pillar-emoji">{card.emoji}</span>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== MISSION & VISION ==================== */}
        <section className="about-mission-section">
          <div className="landing-container">
            <div className="mission-vision-grid">
              <motion.div 
                className="mission-vision-glass-card shine-effect"
                initial={{ opacity: 0, x: -35 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="mission-vision-header">
                  <span className="card-icon-emoji">🎯</span>
                  <h2>Our Mission</h2>
                </div>
                <p>Empowering learners with practical industry skills through innovative education.</p>
              </motion.div>

              <motion.div 
                className="mission-vision-glass-card shine-effect"
                initial={{ opacity: 0, x: 35 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="mission-vision-header">
                  <span className="card-icon-emoji">👁️</span>
                  <h2>Our Vision</h2>
                </div>
                <p>Building India's most trusted technology learning and placement ecosystem.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ==================== OUR JOURNEY ==================== */}
        <section className="about-timeline-section" style={{ padding: '80px 0' }}>
          <div className="landing-container">
            <div className="text-center" style={{ marginBottom: '50px' }}>
              <div className="community-badge" style={{ margin: '0 auto 16px auto', display: 'inline-flex' }}>
                <span className="badge-arrow">⚡</span>
                <span className="badge-text" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>EVOLUTIONARY PATH</span>
              </div>
              <h2 className="section-title-center" style={{ marginTop: '10px' }}>Our Journey</h2>
              <p style={{ maxWidth: '680px', margin: '16px auto 0 auto', color: '#64748B', lineHeight: '1.6', fontSize: '15px' }}>
                From Salem-based beginnings to institution-ready scale, MBK Technology has grown through skill delivery, digital transformation, strategic partnerships, and global readiness.
              </p>
            </div>

            <div className="timeline-horizontal-scroll">
              <div className="timeline-container-horizontal" style={{ display: 'flex', gap: '30px', paddingBottom: '20px' }}>
                {[
                  { 
                    year: '2018', 
                    title: 'The Ignition', 
                    desc: 'The inception of MBK Technology in Salem, founded on the principle of bridging the severe gap between academic engineering and industry application.' 
                  },
                  { 
                    year: '2020', 
                    title: 'Digital Transformation', 
                    desc: 'Successfully launched comprehensive Full Stack, UI/UX, and AI training modules, training over 1,000+ students during the global digital shift.' 
                  },
                  { 
                    year: '2022', 
                    title: 'Strategic Expansion', 
                    desc: 'Forged strategic alliances with government skill development councils and state-level initiatives, becoming a trusted regional trainer deployment partner.' 
                  },
                  { 
                    year: '2025', 
                    title: 'Global Readiness', 
                    desc: 'Now a premier technical academy with a network of 50+ partner institutions, consistently delivering job-ready talent to the global tech ecosystem.' 
                  }
                ].map((item, idx) => (
                  <div key={idx} className="evolution-timeline-card">
                    <span className="node-year" style={{ color: '#FF6B00', fontWeight: '800', fontSize: '24px', display: 'block', marginBottom: '8px' }}>{item.year}</span>
                    <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>{item.title}</h4>
                    <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5', margin: 0 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>



        {/* ==================== OUR SERVICES ==================== */}
        <section className="about-features-section">
          <div className="landing-container">
            <h2 className="section-title-center">Our Services</h2>
            <div className="services-list-grid">
              {[
                { title: 'Software Development', icon: '💻' },
                { title: 'LMS Solutions', icon: '🎓' },
                { title: 'Industrial Training', icon: '⚙️' },
                { title: 'Internships', icon: '💼' },
                { title: 'Placement Training', icon: '🎯' },
                { title: 'Corporate Training', icon: '🏢' },
                { title: 'Mechanical Design', icon: '🔧' },
                { title: 'Civil Design', icon: '🏛️' }
              ].map((service, idx) => (
                <motion.div 
                  key={idx}
                  className="service-card-premium"
                  whileHover={{ y: -6 }}
                >
                  <span className="service-card-icon-wrap">{service.icon}</span>
                  <h4>{service.title}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        </section>



        {/* ==================== WHY STUDENTS CHOOSE US ==================== */}
        <section className="about-choose-us-section">
          <div className="landing-container choose-us-split">
            <div className="choose-us-left">
              <div className="illustration-card-container">
                <span className="illustration-large-emoji">🎯</span>
                <p>Student Success Hub</p>
              </div>
            </div>

            <div className="choose-us-right">
              <h2>Why Students Choose Us</h2>
              <ul className="choose-checklist">
                {[
                  'Industry Experts', 'Practical Learning', 'Live Projects',
                  'AI Powered LMS', 'Resume Builder', 'Placement Cell',
                  'Career Mentoring', 'Mock Interviews'
                ].map((item, idx) => (
                  <li key={idx}>
                    <span className="check-icon-green">✔</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>



        {/* ==================== TRUST SECTION ==================== */}
        <section className="about-trust-section">
          <div className="landing-container">
            <h2 className="section-title-center">Trusted By</h2>
            <div className="trust-grid-cards">
              {[
                { title: 'Students', text: 'Transforming skills into high-paying professional roles.', emoji: '👨‍🎓' },
                { title: 'Trainers', text: 'Sharing knowledge on an enterprise LMS system.', emoji: '👨‍🏫' },
                { title: 'Companies', text: 'Hiring verified, placement-ready tech candidates.', emoji: '🏢' },
                { title: 'Admin', text: 'Managing verification cycles and data operations.', emoji: '🛡️' }
              ].map((trust, idx) => (
                <motion.div 
                  key={idx}
                  className="trust-interactive-card"
                  whileHover={{ y: -6 }}
                >
                  <span className="trust-emoji">{trust.emoji}</span>
                  <h4>{trust.title}</h4>
                  <p>{trust.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <CoursesModal isOpen={isCoursesOpen} onClose={() => setIsCoursesOpen(false)} />

      {/* ==================== ABOUT PAGE CTA / CONTACT FOOTER ==================== */}
      <footer style={{ backgroundColor: '#0F172A', padding: '60px 20px 30px 20px', borderTop: '1px solid #1E293B', color: '#FFFFFF' }}>
        <div className="landing-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', paddingBottom: '40px', textAlign: 'left' }}>
            
            <div>
              <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#FF6B00' }}>CTA / Contact</span>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginTop: '10px', marginBottom: '14px', lineHeight: 1.3 }}>
                Talk to MBK about courses, trainer operations, or portal-backed delivery.
              </h2>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                Connect with the team for institutional training, course programs, trainer deployment, documentation workflows, or operational visibility through the MBK portal.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', margin: '0 0 4px 0', color: '#94A3B8' }}>Direct call</h4>
                  <a href="tel:+918807653965" style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#FF6B00'} onMouseLeave={(e) => e.target.style.color = '#FFFFFF'}>+91 88076 53965</a>
                </div>
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', margin: '0 0 4px 0', color: '#94A3B8' }}>Email</h4>
                  <a href="mailto:mbktechnologies8@gmail.com" style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', textDecoration: 'none', wordBreak: 'break-all', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#FF6B00'} onMouseLeave={(e) => e.target.style.color = '#FFFFFF'}>mbktechnologies8@gmail.com</a>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', margin: '0 0 4px 0', color: '#94A3B8' }}>Salem office</h4>
                <p style={{ fontSize: '13.5px', color: '#CBD5E1', margin: 0, lineHeight: 1.4 }}>
                  IInd Floor, OM Shiva Towers, 259-B, Advaitha Ashram Rd, Fairlands, Salem, Tamil Nadu - 636004, India
                </p>
              </div>

              <div style={{ borderTop: '1px solid #1E293B', paddingTop: '15px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 6px 0', color: '#FFFFFF' }}>MBK Carrierz</h4>
                <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 14px 0', lineHeight: 1.4 }}>
                  Courses, trainer operations, documentation, and dashboard-backed delivery for institutions.
                </p>
                <button 
                  onClick={() => setIsCoursesOpen(true)} 
                  className="cta-button-secondary glow-btn ripple" 
                  style={{ background: '#FF6B00', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#FB923C'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#FF6B00'}
                >
                  Open Portal
                </button>
              </div>
            </div>

          </div>

          <div style={{ borderTop: '1px solid #1E293B', paddingTop: '20px', textAlign: 'center', marginTop: '20px' }}>
            <p style={{ color: '#64748B', fontSize: '12.5px', margin: 0 }}>&copy; 2026 MBK Technology. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}