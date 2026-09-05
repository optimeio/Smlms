import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Building, MapPin, Clock, Search, ChevronRight, CheckCircle, GraduationCap, Cpu } from 'lucide-react';
import { GlassCard, GradientButton } from '../components/PremiumDesignSystem';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Home.css';

const API = '/api';

export default function JobFair() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();

    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / 30;
      const y = (e.clientY - window.innerHeight / 2) / 30;
      setCoords({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/jobs?status=Approved`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (job.requirements?.skills && job.requirements.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="home-page-container">
      <Navbar />

      {/* Mouse Parallax Glowing Blobs */}
      <div className="hero-gradient-blobs" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div className="blob blob-orange" style={{ transform: `translate(${coords.x * 0.3}px, ${coords.y * 0.3}px)` }}></div>
        <div className="blob blob-purple" style={{ transform: `translate(${coords.x * -0.2}px, ${coords.y * -0.2}px)` }}></div>
        <div className="blob blob-pink" style={{ transform: `translate(${coords.x * 0.4}px, ${coords.y * 0.4}px)` }}></div>
        <div className="blob blob-blue" style={{ transform: `translate(${coords.x * -0.4}px, ${coords.y * -0.4}px)` }}></div>
      </div>

      {/* Decorative Particles */}
      <div className="sparkle sparkle-1" style={{ zIndex: 1 }}>✦</div>
      <div className="sparkle sparkle-2" style={{ zIndex: 1 }}>✦</div>
      <div className="plus-icon plus-1" style={{ zIndex: 1 }}>+</div>
      <div className="plus-icon plus-2" style={{ zIndex: 1 }}>+</div>
      <div className="orange-dot dot-1" style={{ zIndex: 1 }}></div>
      <div className="orange-dot dot-2" style={{ zIndex: 1 }}></div>
      <div className="floating-circle circle-1" style={{ zIndex: 1 }}></div>
      <div className="floating-circle circle-2" style={{ zIndex: 1 }}></div>

      <div style={{ minHeight: '100vh', paddingTop: '80px', position: 'relative', zIndex: 2 }}>
        
        <div style={{ textAlign: 'center', marginTop: '60px', marginBottom: '40px' }}>
          <h1 className="hero-main-title" style={{ fontSize: '3.5rem', marginBottom: '20px' }}>
            <motion.span 
              className="heading-start-text"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ display: 'inline-block' }}
            >
              Oprime
            </motion.span>{" "}
            <motion.span 
              className="heading-journey-text gradient-glow-text"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 9, delay: 0.2 }}
              style={{ display: 'inline-block' }}
            >
              Job Fair
              <span className="light-sweep-shine"></span>
            </motion.span>
          </h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ fontSize: '1.25rem', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}
          >
            Discover exciting career opportunities from top companies.
          </motion.p>
        </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 40px 24px' }}>
        {/* Search Bar */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '40px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} color="#64748B" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search by job title, skills, or keywords..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '16px', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.3s' }}
              onFocus={(e) => e.target.style.borderColor = '#4C5FD5'}
              onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
            />
          </div>
          <GradientButton>Find Jobs</GradientButton>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#64748B' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #E2E8F0', borderTopColor: '#4C5FD5', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }}></div>
            <p>Loading opportunities...</p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Briefcase size={64} color="#CBD5E1" style={{ margin: '0 auto 16px auto', display: 'block' }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#1E293B' }}>No Jobs Found</h3>
            <p style={{ color: '#64748B', fontSize: '16px' }}>Try adjusting your search criteria or check back later for new opportunities.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {filteredJobs.map(job => (
              <GlassCard key={job._id || job.id} hover={true} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#1E293B', fontWeight: 'bold' }}>{job.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '14px' }}>
                        <Building size={16} />
                        <span>Top Company</span>
                      </div>
                    </div>
                    <span style={{ background: '#E0E7FF', color: '#4C5FD5', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Active</span>
                  </div>
                  
                  <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {job.description}
                  </p>

                  <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Requirements</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: '#E0E7FF', padding: '8px', borderRadius: '8px', color: '#4C5FD5' }}>
                          <GraduationCap size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>Degree</div>
                          <div style={{ fontSize: '14px', color: '#1E293B', fontWeight: '500' }}>{job.requirements?.degree || 'Not specified'}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: '#DCFCE7', padding: '8px', borderRadius: '8px', color: '#16A34A' }}>
                          <Clock size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>Experience</div>
                          <div style={{ fontSize: '14px', color: '#1E293B', fontWeight: '500' }}>{job.requirements?.experience || 'Not specified'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {job.requirements?.skills && job.requirements.skills.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {job.requirements.skills.map((skill, index) => (
                          <span key={index} style={{ background: '#F1F5F9', color: '#475569', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px', marginTop: 'auto' }}>
                  <GradientButton style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center' }} onClick={() => alert('Application form opening soon!')}>
                    Apply Now <ChevronRight size={18} style={{ marginLeft: '4px' }} />
                  </GradientButton>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
      </div>
      <Footer />
    </div>
  );
}
