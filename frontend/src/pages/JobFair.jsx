import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Building, MapPin, Clock, Search, ChevronRight, CheckCircle, GraduationCap, Cpu, Upload, Link as LinkIcon, Send, X, AlertCircle, Sparkles, User, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react';
import { GlassCard, GradientButton, P } from '../components/PremiumDesignSystem';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../state/useAuth';
import '../styles/Home.css';

const API = '/api';

export default function JobFair() {
  const { user } = useAuth();
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Application Modal States
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    applicantRole: 'student',
    qualification: '',
    college: '',
    department: '',
    experience: 'Fresher',
    skills: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    resumeUrl: '',
    coverLetter: '',
    expectedSalary: ''
  });

  // Pre-fill form when user logs in or selects job
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        applicantName: user.fullName || user.companyName || prev.applicantName,
        applicantEmail: user.email || prev.applicantEmail,
        applicantPhone: user.phone || prev.applicantPhone,
        applicantRole: user.role?.toLowerCase() || 'student',
        qualification: user.knowledge || user.degree || prev.qualification,
        college: user.college || prev.college,
        department: user.department || prev.department,
        experience: user.experience || prev.experience,
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : (user.expertise || user.skills || prev.skills),
        linkedin: user.linkedin || prev.linkedin,
        resumeUrl: user.resume || prev.resumeUrl,
        location: user.address || prev.location
      }));
    }
  }, [user]);

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
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        }
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApplyModal = (job) => {
    setSelectedJob(job);
    setSubmitSuccess(false);
    setSubmitError('');
    setResumeFile(null);

    // Populate or reset form
    if (user) {
      setFormData({
        applicantName: user.fullName || user.companyName || '',
        applicantEmail: user.email || '',
        applicantPhone: user.phone || '',
        applicantRole: user.role?.toLowerCase() || 'student',
        qualification: user.knowledge || user.degree || '',
        college: user.college || '',
        department: user.department || '',
        experience: user.experience || 'Fresher',
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : (user.expertise || user.skills || ''),
        location: user.address || '',
        linkedin: user.linkedin || '',
        github: '',
        portfolio: '',
        resumeUrl: user.resume || '',
        coverLetter: '',
        expectedSalary: ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!formData.applicantName || !formData.applicantEmail || !formData.applicantPhone) {
      setSubmitError('Please fill in your Name, Email, and Phone Number.');
      return;
    }

    try {
      setIsApplying(true);
      setSubmitError('');

      const submissionForm = new FormData();
      submissionForm.append('jobId', selectedJob._id || selectedJob.id || '');
      submissionForm.append('jobTitle', selectedJob.title || '');
      submissionForm.append('companyId', selectedJob.companyId || '');
      submissionForm.append('companyName', selectedJob.companyName || 'Partner Company');
      submissionForm.append('applicantId', user?._id || user?.id || formData.applicantEmail);
      submissionForm.append('applicantName', formData.applicantName);
      submissionForm.append('applicantEmail', formData.applicantEmail);
      submissionForm.append('applicantPhone', formData.applicantPhone);
      submissionForm.append('applicantRole', formData.applicantRole);
      submissionForm.append('qualification', formData.qualification);
      submissionForm.append('college', formData.college);
      submissionForm.append('department', formData.department);
      submissionForm.append('experience', formData.experience);
      submissionForm.append('skills', formData.skills);
      submissionForm.append('location', formData.location);
      submissionForm.append('linkedin', formData.linkedin);
      submissionForm.append('github', formData.github);
      submissionForm.append('portfolio', formData.portfolio);
      submissionForm.append('coverLetter', formData.coverLetter);
      submissionForm.append('expectedSalary', formData.expectedSalary);
      submissionForm.append('resumeUrl', formData.resumeUrl);

      if (resumeFile) {
        submissionForm.append('resume', resumeFile);
      }

      const res = await fetch(`${API}/job-applications`, {
        method: 'POST',
        body: submissionForm
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(data.message || 'Failed to submit application. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      setSubmitError('Network error while submitting application.');
    } finally {
      setIsApplying(false);
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
              MBK Tech
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
            Discover verified career openings, submit your credentials for Admin review, and connect with top corporate partners.
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
          <GradientButton onClick={fetchJobs}>Find Jobs</GradientButton>
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
                        <span>{job.companyName || 'Verified Corporate Partner'}</span>
                      </div>
                    </div>
                    <span style={{ background: '#E0E7FF', color: '#4C5FD5', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Active Opening</span>
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
                          <div style={{ fontSize: '14px', color: '#1E293B', fontWeight: '500' }}>{job.requirements?.degree || 'Any Degree'}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: '#DCFCE7', padding: '8px', borderRadius: '8px', color: '#16A34A' }}>
                          <Clock size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>Experience</div>
                          <div style={{ fontSize: '14px', color: '#1E293B', fontWeight: '500' }}>{job.requirements?.experience || 'Fresher / All levels'}</div>
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
                  <GradientButton 
                    style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center' }} 
                    onClick={() => handleOpenApplyModal(job)}
                  >
                    Apply Now <ChevronRight size={18} style={{ marginLeft: '4px' }} />
                  </GradientButton>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
      </div>

      {/* Real-Time Job Application Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div 
            style={{ 
              position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', 
              backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', 
              alignItems: 'center', justifyContent: 'center', padding: '20px' 
            }}
            onClick={() => setSelectedJob(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#ffffff',
                width: '100%',
                maxWidth: '750px',
                maxHeight: '90vh',
                borderRadius: '24px',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* Modal Header */}
              <div style={{ 
                padding: '24px 30px', 
                background: 'linear-gradient(135deg, #1B1F3B 0%, #312E81 100%)', 
                color: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ background: '#FF6B00', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                      Job Application
                    </span>
                    <span style={{ fontSize: '13px', color: '#E0E7FF' }}>• {selectedJob.companyName || 'Corporate Partner'}</span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>
                    {selectedJob.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: 'none',
                    color: '#ffffff',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div style={{ padding: '28px 30px', overflowY: 'auto', flex: 1 }}>
                {submitSuccess ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ 
                      width: '72px', height: '72px', borderRadius: '50%', 
                      background: '#DCFCE7', color: '#16A34A', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 20px auto'
                    }}>
                      <CheckCircle2 size={42} />
                    </div>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B', marginBottom: '10px' }}>
                      Application Submitted Successfully!
                    </h3>
                    <p style={{ color: '#64748B', fontSize: '15px', lineHeight: '1.6', maxWidth: '520px', margin: '0 auto 24px auto' }}>
                      Your application for <strong>{selectedJob.title}</strong> has been received and routed to <strong>MBK Tech Administration</strong> for verification.
                    </p>
                    
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px', maxWidth: '500px', margin: '0 auto 24px auto', textAlign: 'left' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <Sparkles size={20} color="#FF6B00" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <strong style={{ fontSize: '14px', color: '#1E293B', display: 'block', marginBottom: '4px' }}>What happens next?</strong>
                          <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>
                            Once the Admin reviews and approves your credentials, your complete profile and resume will be securely forwarded directly to <strong>{selectedJob.companyName || 'the hiring company'}</strong> for interview scheduling.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedJob(null)}
                      style={{
                        padding: '12px 32px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '15px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Done & Return to Job Fair
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitApplication}>
                    {/* Information Banner */}
                    <div style={{ 
                      background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', 
                      padding: '14px 16px', marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '12px' 
                    }}>
                      <AlertCircle size={18} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <p style={{ margin: 0, fontSize: '13px', color: '#1E40AF', lineHeight: '1.5' }}>
                        <strong>Direct Admin Review Pipeline:</strong> Complete all required details below. Your submission is received by the MBK Admin team for vetting before being forwarded to the hiring team.
                      </p>
                    </div>

                    {submitError && (
                      <div style={{ background: '#FEF2F2', border: '1px solid #F87171', color: '#DC2626', padding: '12px', borderRadius: '10px', fontSize: '14px', marginBottom: '20px' }}>
                        {submitError}
                      </div>
                    )}

                    {/* Section 1: Personal & Contact */}
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={16} color="#4F46E5" /> 1. Personal & Contact Information
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Full Name *</label>
                          <input 
                            type="text"
                            name="applicantName"
                            value={formData.applicantName}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g. John Doe"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Email Address *</label>
                          <input 
                            type="email"
                            name="applicantEmail"
                            value={formData.applicantEmail}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g. john@example.com"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Mobile / WhatsApp *</label>
                          <input 
                            type="tel"
                            name="applicantPhone"
                            value={formData.applicantPhone}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g. +91 9876543210"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Current City / State</label>
                          <input 
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="e.g. Chennai, Tamil Nadu"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Academic & Qualifications */}
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <GraduationCap size={16} color="#4F46E5" /> 2. Academic & Experience Profile
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Highest Qualification / Degree</label>
                          <input 
                            type="text"
                            name="qualification"
                            value={formData.qualification}
                            onChange={handleInputChange}
                            placeholder="e.g. B.E / B.Tech (ECE)"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>College / Institution</label>
                          <input 
                            type="text"
                            name="college"
                            value={formData.college}
                            onChange={handleInputChange}
                            placeholder="e.g. Anna University"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Experience Level</label>
                          <select
                            name="experience"
                            value={formData.experience}
                            onChange={handleInputChange}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box', background: '#fff' }}
                          >
                            <option value="Fresher">Fresher / Recent Graduate</option>
                            <option value="1-2 Years">1 - 2 Years</option>
                            <option value="3-5 Years">3 - 5 Years</option>
                            <option value="5+ Years">5+ Years (Senior)</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Expected CTC / Stipend</label>
                          <input 
                            type="text"
                            name="expectedSalary"
                            value={formData.expectedSalary}
                            onChange={handleInputChange}
                            placeholder="e.g. ₹4.5 LPA / ₹15,000/mo"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>

                      <div style={{ marginTop: '14px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Key Technical Skills (comma separated)</label>
                        <input 
                          type="text"
                          name="skills"
                          value={formData.skills}
                          onChange={handleInputChange}
                          placeholder="e.g. Python, React, SolidWorks, Embedded C, AutoCAD"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>

                    {/* Section 3: Resume & Links */}
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={16} color="#4F46E5" /> 3. Application Materials & Links
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>LinkedIn Profile URL</label>
                          <input 
                            type="url"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleInputChange}
                            placeholder="https://linkedin.com/in/..."
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Portfolio / GitHub URL</label>
                          <input 
                            type="url"
                            name="github"
                            value={formData.github}
                            onChange={handleInputChange}
                            placeholder="https://github.com/..."
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>

                      {/* Resume Upload Box */}
                      <div style={{ 
                        border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '16px', 
                        background: '#F8FAFC', textAlign: 'center', marginBottom: '14px' 
                      }}>
                        <Upload size={24} color="#64748B" style={{ margin: '0 auto 6px auto' }} />
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1E293B', cursor: 'pointer', marginBottom: '4px' }}>
                          <span style={{ color: '#4F46E5', textDecoration: 'underline' }}>Click to upload your Resume</span> (PDF, DOCX)
                          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ display: 'none' }} />
                        </label>
                        <span style={{ fontSize: '12px', color: '#64748B' }}>
                          {resumeFile ? `Selected: ${resumeFile.name}` : (formData.resumeUrl ? `Using saved profile resume: ${formData.resumeUrl}` : 'Max file size 10MB')}
                        </span>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Cover Letter / Why should we hire you?</label>
                        <textarea 
                          name="coverLetter"
                          rows={3}
                          value={formData.coverLetter}
                          onChange={handleInputChange}
                          placeholder="Briefly highlight your core strengths, past projects, and motivation for this role..."
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }}
                        />
                      </div>
                    </div>

                    {/* Submit Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '18px' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedJob(null)}
                        style={{ padding: '12px 20px', borderRadius: '10px', background: '#F1F5F9', color: '#475569', border: 'none', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isApplying}
                        style={{
                          padding: '12px 28px',
                          borderRadius: '10px',
                          background: isApplying ? '#94A3B8' : 'linear-gradient(135deg, #FF6B00 0%, #FF8A00 100%)',
                          color: '#ffffff',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '15px',
                          cursor: isApplying ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 14px rgba(255, 107, 0, 0.35)'
                        }}
                      >
                        {isApplying ? 'Submitting to Admin...' : 'Submit Application'} <Send size={16} />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
