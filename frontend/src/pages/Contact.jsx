import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CoursesModal from '../components/CoursesModal';
import { useNavigate } from 'react-router-dom';
import '../styles/Contact.css';

export default function Contact() {
  const navigate = useNavigate();
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    company: '',
    service: '',
    message: '',
    agree: false
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPhoneHighlighted, setIsPhoneHighlighted] = useState(false);

  // Phone OTP verification states
  const [showPhoneOTP, setShowPhoneOTP] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phoneOTPCode, setPhoneOTPCode] = useState(Array(6).fill(''));
  const [phoneOtpError, setPhoneOtpError] = useState('');
  const [phoneOtpSuccess, setPhoneOtpSuccess] = useState('');
  const [isVerifyingPhoneOTP, setIsVerifyingPhoneOTP] = useState(false);
  const [isSendingPhoneOTP, setIsSendingPhoneOTP] = useState(false);
  const otpInputRefs = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCoords({
        x: (e.clientX - window.innerWidth / 2) / 30,
        y: (e.clientY - window.innerHeight / 2) / 30
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const sendPhoneOTP = async (phone) => {
    setIsSendingPhoneOTP(true);
    setPhoneOtpError('');
    setPhoneOtpSuccess('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, isRegister: true })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPhoneOtpSuccess(data.message || 'OTP sent successfully!');
        setShowPhoneOTP(true);
      } else {
        setPhoneOtpError(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      console.error(err);
      setPhoneOtpError('Error sending OTP. Please try again.');
    } finally {
      setIsSendingPhoneOTP(false);
    }
  };

  const verifyPhoneOTP = async () => {
    const code = phoneOTPCode.join('');
    if (code.length < 6) {
      setPhoneOtpError('Please enter all 6 digits.');
      return;
    }
    setIsVerifyingPhoneOTP(true);
    setPhoneOtpError('');
    setPhoneOtpSuccess('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, otp: code })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPhoneOtpSuccess('Phone number verified successfully!');
        setIsPhoneVerified(true);
        setTimeout(() => {
          setShowPhoneOTP(false);
          setPhoneOtpSuccess('');
          submitInquiry();
        }, 1000);
      } else {
        setPhoneOtpError(data.message || 'Incorrect OTP. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setPhoneOtpError('Error verifying OTP.');
    } finally {
      setIsVerifyingPhoneOTP(false);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!isPhoneVerified) {
      sendPhoneOTP(formData.phone);
    } else {
      submitInquiry();
    }
  };

  const submitInquiry = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsPhoneVerified(false);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        company: '',
        service: '',
        message: '',
        agree: false
      });
    }, 3000);
  };

  const services = [
    "Software Development",
    "Web Development",
    "Mobile App Development",
    "Industrial Training",
    "Internships",
    "Placement Training",
    "Corporate Training",
    "LMS Platform",
    "Mechanical Design",
    "Civil Design",
    "AI & Data Science"
  ];

  return (
    <div className="contact-page-container">
      <Navbar />

      {/* Decorative Parallax Glowing Blobs */}
      <div className="hero-gradient-blobs">
        <div className="blob blob-orange" style={{ transform: `translate(${coords.x * 0.25}px, ${coords.y * 0.25}px)` }}></div>
        <div className="blob blob-purple" style={{ transform: `translate(${coords.x * -0.2}px, ${coords.y * -0.2}px)` }}></div>
        <div className="blob blob-pink" style={{ transform: `translate(${coords.x * 0.35}px, ${coords.y * 0.35}px)` }}></div>
        <div className="blob blob-blue" style={{ transform: `translate(${coords.x * -0.3}px, ${coords.y * -0.3}px)` }}></div>
      </div>

      {/* Sparks & Particles */}
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
      <div className="floating-tech-card-glass tech-cloud" style={{ transform: `translate(${coords.x * 1.2}px, ${coords.y * 1.2}px)` }}>☁️ Cloud</div>
      <div className="floating-tech-card-glass tech-ai" style={{ transform: `translate(${coords.x * 0.9}px, ${coords.y * 0.9}px)` }}>🤖 AI</div>
      <div className="floating-tech-card-glass tech-github" style={{ transform: `translate(${coords.x * 0.5}px, ${coords.y * 0.5}px)` }}>🐙 GitHub</div>

      <main className="contact-main">
        {/* ==================== HERO SECTION ==================== */}
        <section className="contact-hero-section">
          <div className="landing-container text-center">
            <div className="community-badge" style={{ margin: '0 auto 20px auto' }}>
              <span className="badge-arrow">📩</span>
              <span className="badge-text">CONTACT MBK TECHNOLOGY</span>
            </div>
            
            <h1 className="contact-main-heading">
              Let's Build Your <span className="highlight-orange-text">Future</span> Together
            </h1>
            
            <p className="contact-subtitle-desc" style={{ maxWidth: '600px', margin: '0 auto 30px auto' }}>
              Our team is ready to help you with training, internships, placements, software solutions, and career guidance.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button className="cta-button-orange glow-btn ripple">🟧 Send Inquiry</button>
              <button 
                onClick={() => {
                  setIsPhoneHighlighted(true);
                  // Scroll to the contact details section
                  document.querySelector('.contact-details-section')?.scrollIntoView({ behavior: 'smooth' });
                  // Reset highlight after 3 seconds
                  setTimeout(() => setIsPhoneHighlighted(false), 3000);
                }}
                className="cta-button-secondary ripple" 
                style={{ background: '#FFFFFF', color: '#FF6B00', border: '2px solid #FF6B00' }}
              >
                ⬜ Call Now
              </button>
            </div>
          </div>
        </section>

        {/* ==================== TWO-COLUMN CONTENT ==================== */}
        <section className="contact-details-section">
          <div className="landing-container contact-details-grid">
            
            {/* LEFT SIDE: Contact Info Card */}
            <motion.div 
              className="get-in-touch-card"
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2>Get In Touch</h2>
              <div className="contact-info-list">
                <div className="info-item-row hover-slide-effect">
                  <span className="info-icon-outline">📍</span>
                  <div className="info-item-body">
                    <strong>Office Address</strong>
                    <p>Fairlands, Salem - 636004, Tamil Nadu, India</p>
                  </div>
                </div>

                <div 
                  className="info-item-row hover-slide-effect"
                  style={{
                    transition: 'all 0.4s ease',
                    backgroundColor: isPhoneHighlighted ? 'rgba(255, 107, 0, 0.15)' : 'transparent',
                    border: isPhoneHighlighted ? '2px solid #FF6B00' : '1px solid transparent',
                    borderRadius: '12px',
                    padding: isPhoneHighlighted ? '12px 16px' : '0px',
                    boxShadow: isPhoneHighlighted ? '0 0 20px rgba(255, 107, 0, 0.25)' : 'none'
                  }}
                >
                  <span className="info-icon-outline" style={{ color: isPhoneHighlighted ? '#FF6B00' : 'inherit', transform: isPhoneHighlighted ? 'scale(1.15)' : 'scale(1)', transition: 'all 0.3s ease' }}>📞</span>
                  <div className="info-item-body">
                    <strong style={{ color: isPhoneHighlighted ? '#FF6B00' : 'inherit', transition: 'all 0.3s ease' }}>Phone Number</strong>
                    <p style={{ 
                      color: isPhoneHighlighted ? '#FF6B00' : '#4B5563', 
                      fontWeight: isPhoneHighlighted ? '800' : 'normal',
                      transition: 'all 0.3s'
                    }}>
                      +91 88076 53965
                    </p>
                  </div>
                </div>

                <div className="info-item-row hover-slide-effect">
                  <span className="info-icon-outline">📧</span>
                  <div className="info-item-body">
                    <strong>Email Address</strong>
                    <p>mbktechnologies8@gmail.com</p>
                  </div>
                </div>

                <div className="info-item-row hover-slide-effect">
                  <span className="info-icon-outline">🌐</span>
                  <div className="info-item-body">
                    <strong>Website</strong>
                    <p>www.mbktechnologies.info</p>
                  </div>
                </div>

                <div className="info-item-row hover-slide-effect">
                  <span className="info-icon-outline">🕒</span>
                  <div className="info-item-body">
                    <strong>Business Hours</strong>
                    <p>Mon - Sat: 9:00 AM - 7:00 PM IST</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '30px' }}>
                <span className="response-badge-pill">⚡ Usually replies within 24 Hours</span>
              </div>
            </motion.div>

            {/* RIGHT SIDE: Modern Inquiry Form */}
            <motion.div 
              className="modern-contact-form-card"
              initial={{ opacity: 0, x: 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2>Send Inquiry</h2>
              <p style={{ color: '#64748B', fontSize: '13.5px', marginBottom: '24px' }}>
                We usually respond within one business day.
              </p>

              {isSuccess && (
                <div className="contact-alert-success">
                  ✓ Inquiry sent successfully! Our coordinator will contact you shortly.
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-inputs-form">
                <div className="form-input-row-grid">
                  <div className="contact-field-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.fullName} 
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                      placeholder="Your Name" 
                    />
                  </div>
                  <div className="contact-field-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      required 
                      value={formData.phone} 
                      onChange={(e) => {
                        const numericVal = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData({...formData, phone: numericVal});
                        setIsPhoneVerified(false);
                      }} 
                      placeholder="Enter mobile number" 
                    />
                  </div>
                </div>

                <div className="form-input-row-grid">
                  <div className="contact-field-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                      placeholder="you@example.com" 
                    />
                  </div>
                  <div className="contact-field-group">
                    <label>Company / Organization</label>
                    <input 
                      type="text" 
                      value={formData.company} 
                      onChange={(e) => setFormData({...formData, company: e.target.value})} 
                      placeholder="Your Company (Optional)" 
                    />
                  </div>
                </div>

                <div className="contact-field-group">
                  <label>Select Service</label>
                  <select 
                    value={formData.service} 
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '12px',
                      outline: 'none',
                      fontSize: '14px',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <option value="">Select Service Option</option>
                    {services.map((srv, index) => (
                      <option key={index} value={srv}>{srv}</option>
                    ))}
                  </select>
                </div>

                <div className="contact-field-group">
                  <label>Message</label>
                  <textarea 
                    rows="3" 
                    required 
                    value={formData.message} 
                    onChange={(e) => setFormData({...formData, message: e.target.value})} 
                    placeholder="Describe your inquiry..."
                  ></textarea>
                </div>



                <div className="contact-field-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    required 
                    checked={formData.agree} 
                    onChange={(e) => setFormData({...formData, agree: e.target.checked})} 
                    style={{ width: 'auto' }}
                  />
                  <span style={{ fontSize: '12px', color: '#64748B' }}>I agree to the Privacy Policy</span>
                </div>

                <button type="submit" className="contact-submit-btn-orange ripple">
                  Send Message <span>→</span>
                </button>
              </form>
            </motion.div>

          </div>
        </section>

        {/* ==================== QUICK CONTACT CARDS ==================== */}
        <section className="quick-contacts-section">
          <div className="landing-container">
            <div className="quick-contacts-grid">
              {[
                { title: 'Admissions', emoji: '🎓', contact: 'admissions@smgroups.com' },
                { title: 'Training Support', emoji: '💻', contact: 'support@smgroups.com' },
                { title: 'Placement Cell', emoji: '💼', contact: 'placements@smgroups.com' },
                { title: 'Technical Support', emoji: '🎧', contact: 'tech@smgroups.com' }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  className="quick-glass-card"
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <span className="quick-emoji">{item.emoji}</span>
                  <h4>{item.title}</h4>
                  <p>{item.contact}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>



        {/* ==================== WHY CONTACT MBK ==================== */}
        <section className="about-values-section" style={{ padding: '60px 0' }}>
          <div className="landing-container">
            <h2 className="section-title-center">Why Contact MBK</h2>
            <div className="quick-contacts-grid">
              {[
                { emoji: '⚡', title: 'Quick Response', text: 'Prompt replies within one business day.' },
                { emoji: '👨‍💻', title: 'Expert Guidance', text: 'Interact directly with lead trainers.' },
                { emoji: '🎓', title: 'Career Support', text: 'Resume mapping and interview prep.' },
                { emoji: '💼', title: 'Industry Solutions', text: 'Tailored courses for corporate partners.' }
              ].map((value, idx) => (
                <motion.div 
                  key={idx}
                  className="quick-glass-card"
                  whileHover={{ y: -6, scale: 1.05 }}
                >
                  <span className="value-emoji">{value.emoji}</span>
                  <h4>{value.title}</h4>
                  <p style={{ color: '#64748B', fontWeight: '500', fontSize: '12.5px' }}>{value.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== SOCIAL MEDIA ==================== */}
        <section className="connect-socials-section">
          <div className="landing-container text-center">
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '24px' }}>Connect With Us</h2>
            <div className="connect-social-buttons">
              {[
                { 
                  name: 'LinkedIn', 
                  icon: (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="#0077B5" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  ) 
                },
                { 
                  name: 'Instagram', 
                  icon: (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="#E1306C" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  ) 
                },
                { 
                  name: 'Facebook', 
                  icon: (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  ) 
                },
                { 
                  name: 'YouTube', 
                  icon: (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="#FF0000" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.387.507 9.387.507s7.517 0 9.387-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  ) 
                },
                { 
                  name: 'GitHub', 
                  icon: (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="#181717" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  ) 
                }
              ].map((social, idx) => (
                <motion.button 
                  key={idx} 
                  className="social-btn-premium glow-btn"
                  whileHover={{ scale: 1.08 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {social.icon}
                  <span>{social.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== BOTTOM CTA ==================== */}
        <section className="about-cta-card-section">
          <div className="landing-container">
            <div className="large-cta-orange-card">
              <h2>Ready to Start Your Career?</h2>
              <p>Join thousands of learners building successful careers with MBK Technology.</p>
              <div className="cta-orange-buttons">
                <button onClick={() => navigate('/register')} className="cta-button-secondary glow-btn ripple" style={{ background: '#FFFFFF', color: '#FF6B00' }}>Register Now</button>
                <button onClick={() => navigate('/courses')} className="cta-button-secondary glow-btn ripple" style={{ background: 'transparent', color: '#FFFFFF', border: '2px solid #FFFFFF' }}>Explore Courses</button>
              </div>
            </div>
          </div>
        </section>

      </main>

      <CoursesModal isOpen={isCoursesOpen} onClose={() => setIsCoursesOpen(false)} />

      {/* Phone OTP Verification Modal */}
      {showPhoneOTP && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.15)',
            border: '1px solid #E5E7EB',
            color: '#0F172A'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Verify Your Phone Number</h3>
            <p style={{ fontSize: '13.5px', color: '#64748B', marginBottom: '24px' }}>
              We sent a 6-digit OTP verification code to <strong>{formData.phone}</strong>.
            </p>

            {phoneOtpError && (
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '10px 14px', borderRadius: '8px', fontSize: '12.5px', marginBottom: '16px', fontWeight: 600 }}>
                {phoneOtpError}
              </div>
            )}

            {phoneOtpSuccess && (
              <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', color: '#16A34A', padding: '10px 14px', borderRadius: '8px', fontSize: '12.5px', marginBottom: '16px', fontWeight: 600 }}>
                {phoneOtpSuccess}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
              {phoneOTPCode.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!/^\d*$/.test(val)) return;
                    const next = [...phoneOTPCode];
                    next[index] = val.slice(-1);
                    setPhoneOTPCode(next);
                    if (val && index < 5) {
                      otpInputRefs.current[index + 1]?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !phoneOTPCode[index] && index > 0) {
                      otpInputRefs.current[index - 1]?.focus();
                    }
                  }}
                  style={{
                    width: '45px',
                    height: '50px',
                    fontSize: '20px',
                    textAlign: 'center',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    fontWeight: 'bold',
                    backgroundColor: '#F8FAFC'
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setShowPhoneOTP(false);
                  setPhoneOtpError('');
                  setPhoneOtpSuccess('');
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={verifyPhoneOTP}
                disabled={isVerifyingPhoneOTP}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#F97316',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  opacity: isVerifyingPhoneOTP ? 0.7 : 1
                }}
              >
                {isVerifyingPhoneOTP ? 'Verify & Submit' : 'Verify & Submit'}
              </button>
            </div>

            <div style={{ marginTop: '20px', fontSize: '12.5px', color: '#64748B' }}>
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={() => sendPhoneOTP(formData.phone)}
                disabled={isSendingPhoneOTP}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#F97316',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {isSendingPhoneOTP ? 'Resending...' : 'Resend Code'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}