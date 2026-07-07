import { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/Home.css';

export default function Home() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / 30;
      const y = (e.clientY - window.innerHeight / 2) / 30;
      setCoords({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="home-page-container">
      <Navbar />

      {/* Mouse Parallax Glowing Blobs behind Heading */}
      <div className="hero-gradient-blobs">
        <div className="blob blob-orange" style={{ transform: `translate(${coords.x * 0.3}px, ${coords.y * 0.3}px)` }}></div>
        <div className="blob blob-purple" style={{ transform: `translate(${coords.x * -0.2}px, ${coords.y * -0.2}px)` }}></div>
        <div className="blob blob-pink" style={{ transform: `translate(${coords.x * 0.4}px, ${coords.y * 0.4}px)` }}></div>
        <div className="blob blob-blue" style={{ transform: `translate(${coords.x * -0.4}px, ${coords.y * -0.4}px)` }}></div>
      </div>

      {/* Decorative Particles */}
      <div className="sparkle sparkle-1">✦</div>
      <div className="sparkle sparkle-2">✦</div>
      <div className="plus-icon plus-1">+</div>
      <div className="plus-icon plus-2">+</div>
      <div className="orange-dot dot-1"></div>
      <div className="orange-dot dot-2"></div>
      <div className="floating-circle circle-1"></div>
      <div className="floating-circle circle-2"></div>

      {/* Glassmorphism Floating Tech Cards around Heading */}
      <div className="floating-tech-card-glass tech-react" style={{ transform: `translate(${coords.x * 0.7}px, ${coords.y * 0.7}px) rotate(8deg)` }}>
        <span>⚛️ React</span>
      </div>
      <div className="floating-tech-card-glass tech-python" style={{ transform: `translate(${coords.x * 1.1}px, ${coords.y * 1.1}px) rotate(-6deg)` }}>
        <span>🐍 Python</span>
      </div>
      <div className="floating-tech-card-glass tech-java" style={{ transform: `translate(${coords.x * 0.8}px, ${coords.y * 0.8}px) rotate(5deg)` }}>
        <span>☕ Java</span>
      </div>
      <div className="floating-tech-card-glass tech-node" style={{ transform: `translate(${coords.x * 1.0}px, ${coords.y * 1.0}px) rotate(-7deg)` }}>
        <span>🟢 Node.js</span>
      </div>
      <div className="floating-tech-card-glass tech-sql" style={{ transform: `translate(${coords.x * 0.6}px, ${coords.y * 0.6}px) rotate(4deg)` }}>
        <span>🛢️ SQL</span>
      </div>
      <div className="floating-tech-card-glass tech-cloud" style={{ transform: `translate(${coords.x * 1.2}px, ${coords.y * 1.2}px) rotate(8deg)` }}>
        <span>☁️ Cloud</span>
      </div>

      <main className="landing-main">
        <section className="landing-hero-section">
          <div className="landing-container hero-grid">
            
            {/* Left Content Column */}
            <div className="hero-left-content">
              <div className="community-badge animate-pulse-badge">
                <span className="badge-arrow">⬦⬥⬦</span>
                <span className="badge-text">JOIN THE MBK COMMUNITY</span>
                <span className="badge-line"></span>
              </div>
              
              {/* Premium Heading with reveal animations */}
              <h1 className="hero-main-title">
                <motion.span 
                  className="heading-start-text"
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{ display: 'inline-block' }}
                >
                  Start Your
                </motion.span>{" "}
                <motion.span 
                  className="heading-journey-text gradient-glow-text"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 9, delay: 0.2 }}
                  style={{ display: 'inline-block' }}
                >
                  Journey
                  <span className="light-sweep-shine"></span>
                </motion.span>{" "}
                <br />
                <motion.span 
                  className="heading-mbk-text"
                  initial={{ opacity: 0, x: -35 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  style={{ display: 'inline-block', position: 'relative' }}
                >
                  with <span className="highlight-text">MBK Technology</span>

                  {/* Career Swoosh SVG */}
                  <svg className="swoosh-arrow" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10,45 C70,10 130,50 185,15" stroke="url(#swoosh-grad)" strokeWidth="3" strokeLinecap="round" />
                    <polyline points="175,10 185,15 178,25" stroke="url(#swoosh-grad)" strokeWidth="3" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="swoosh-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF6B00" />
                        <stop offset="50%" stopColor="#FF4D8D" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.span>
              </h1>
              
              <p className="hero-description-paragraph">
                Join students, trainers, and companies on a unified platform built for career growth, training excellence, and business collaboration.
              </p>

              <div className="bullet-points-list">
                {[
                  {
                    title: "Industry-Relevant Training",
                    desc: "Learn from certified experts and real-world projects.",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bullet-icon">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
                      </svg>
                    )
                  },
                  {
                    title: "Verified Opportunities",
                    desc: "Access internships, jobs, and placement support.",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bullet-icon">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    )
                  },
                  {
                    title: "Trusted by Partners",
                    desc: "Connect with verified companies and mentors.",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bullet-icon">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    )
                  }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    className="bullet-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + (idx * 0.1) }}
                  >
                    <div className="bullet-icon-container pulse-icon">
                      {item.icon}
                    </div>
                    <div className="bullet-text-content">
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Account Creation Card Column */}
            <div className="hero-right-card">
              <motion.div 
                className="create-account-card animate-float-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                <h2 className="card-title">Create Your Account</h2>
                
                <div className="hat-divider">
                  <span className="divider-line"></span>
                  <span className="divider-hat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hat-icon">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
                    </svg>
                  </span>
                  <span className="divider-line"></span>
                </div>

                <p className="card-subtitle">Choose your role to get started</p>

                <div className="roles-grid">
                  {/* Student Card */}
                  <motion.div 
                    className="role-option student-role"
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="role-icon-wrapper student-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
                      </svg>
                    </div>
                    <h4 className="role-title">Student</h4>
                    <p className="role-description">Access courses, internships and career opportunities.</p>
                    <Link to="/register?type=student" className="role-btn btn-student bounce-on-click">
                      Register as Student <span>→</span>
                    </Link>
                  </motion.div>

                  {/* Trainer Card */}
                  <motion.div 
                    className="role-option trainer-role"
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="role-icon-wrapper trainer-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                    </div>
                    <h4 className="role-title">Trainer</h4>
                    <p className="role-description">Create and manage training programs and courses.</p>
                    <Link to="/register?type=trainer" className="role-btn btn-trainer bounce-on-click">
                      Register as Trainer <span>→</span>
                    </Link>
                  </motion.div>

                  {/* Company Card */}
                  <motion.div 
                    className="role-option company-role"
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="role-icon-wrapper company-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="10" width="20" height="12" rx="2" ry="2"/>
                        <path d="M12 22V10"/>
                        <path d="M17 22V2"/>
                        <path d="M7 22v-4"/>
                      </svg>
                    </div>
                    <h4 className="role-title">Company</h4>
                    <p className="role-description">Post jobs, hire talent and collaborate with MBK.</p>
                    <Link to="/register?type=company" className="role-btn btn-company bounce-on-click">
                      Register as Company <span>→</span>
                    </Link>
                  </motion.div>
                </div>

                <div className="card-footer-login">
                  Already have an account? <Link to="/login" className="login-link">Login here</Link>
                </div>
              </motion.div>
            </div>

          </div>
        </section>

        {/* Bottom Features Banner */}
        <section className="landing-bottom-bar-section">
          <div className="landing-container">
            <div className="bottom-features-bar">
              
              <div className="bottom-feature-item">
                <div className="feature-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div className="feature-item-text">
                  <h5>100% Secure</h5>
                  <p>Your data is protected</p>
                </div>
              </div>

              <div className="bottom-feature-divider"></div>

              <div className="bottom-feature-item">
                <div className="feature-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="7"/>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                  </svg>
                </div>
                <div className="feature-item-text">
                  <h5>Quality Assured</h5>
                  <p>Industry standard training</p>
                </div>
              </div>

              <div className="bottom-feature-divider"></div>

              <div className="bottom-feature-item">
                <div className="feature-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                </div>
                <div className="feature-item-text">
                  <h5>Expert Support</h5>
                  <p>24/7 dedicated support</p>
                </div>
              </div>

              <div className="bottom-feature-divider"></div>

              <div className="bottom-feature-item">
                <div className="feature-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                </div>
                <div className="feature-item-text">
                  <h5>Career Growth</h5>
                  <p>Build your future with us</p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}