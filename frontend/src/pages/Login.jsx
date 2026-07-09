import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showManageAccountModal, setShowManageAccountModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const googleAccounts = [
    { name: 'John Doe', email: 'john.doe@gmail.com', avatarBg: '#1a73e8' },
    { name: 'Jane Smith', email: 'jane.smith@gmail.com', avatarBg: '#ea4335' },
    { name: 'Mark Wilson', email: 'mark.wilson@gmail.com', avatarBg: '#fbbc05' }
  ];

  const microsoftAccounts = [
    { name: 'Sarah Jenkins', email: 'sarah.jenkins@outlook.com', avatarBg: '#0078d4' },
    { name: 'Michael Miller', email: 'michael.miller@outlook.com', avatarBg: '#107c41' },
    { name: 'Emily Davis', email: 'emily.davis@outlook.com', avatarBg: '#d83b01' }
  ];

  const handleSocialAccountSelect = async (providerEmail) => {
    setShowManageAccountModal(false);
    setServerError('');
    setIsSubmitting(true);
    
    // Map generic account emails to real system credentials
    let email = '';
    let password = '';
    
    if (providerEmail === 'john.doe@gmail.com' || providerEmail === 'sarah.jenkins@outlook.com') {
      email = 'admin@smgroups.com';
      password = 'admin123';
    } else if (providerEmail === 'jane.smith@gmail.com' || providerEmail === 'emily.davis@outlook.com') {
      email = 'theoptime.io@gmail.com';
      password = 'tharan1234';
    } else if (providerEmail === 'mark.wilson@gmail.com') {
      email = 'hemalathamuthu09@gmail.com';
      password = 'hemalatha123';
    } else if (providerEmail === 'michael.miller@outlook.com') {
      email = 'thepavech@gmail.com';
      password = 'Password123';
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        setServerError(data.message || 'Invalid email or password.');
      } else {
        setIsSuccess(true);
        localStorage.setItem('user', JSON.stringify(data.user));
        setTimeout(() => {
          if (data.user.email === 'admin@smgroups.com' || data.user.email === 'thesmgroups@gmail.com') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }, 1500);
      }
    } catch (err) {
      console.error('Login error:', err);
      setServerError('Unable to connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stats counters
  const [stats, setStats] = useState({
    students: 0,
    companies: 0,
    courses: 0,
    rate: 0
  });

  // Mouse move coords for subtle parallax (restricted to icons/blobs)
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCoords({
        x: (e.clientX - window.innerWidth / 2) / 45,
        y: (e.clientY - window.innerHeight / 2) / 45
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Count-up stats
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
        rate: Math.min(Math.floor((95 / steps) * currentStep), 95)
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

  const validateField = (name, value) => {
    let error = '';
    if (name === 'email') {
      if (!value) {
        error = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Please enter a valid email address.';
      }
    } else if (name === 'password') {
      if (!value) {
        error = 'Password is required.';
      } else if (value.length < 8) {
        error = 'Password must be at least 8 characters.';
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val,
    }));

    const fieldError = validateField(name, val);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    const emailError = validateField('email', formData.email);
    const passwordError = validateField('password', formData.password);
    
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setServerError(data.message || 'Invalid email or password.');
      } else {

        setIsSuccess(true);
        localStorage.setItem('user', JSON.stringify(data.user));
        setTimeout(() => {
          if (data.user.email === 'admin@smgroups.com' || data.user.email === 'thesmgroups@gmail.com') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }, 1500);
      }
    } catch (err) {
      console.error('Login connection error:', err);
      setServerError('Unable to connect to the server. Please check if the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page-container">
      <Navbar />

      <main className="login-main-section">
        <div className="login-container login-grid">
          
          {/* Left Column (Hero Section - 55% width) */}
          <div className="login-left-column">
            
            {/* Soft background blobs only behind the hero */}
            <div className="hero-gradient-blobs">
              <div className="blob blob-orange" style={{ transform: `translate(${coords.x * 0.3}px, ${coords.y * 0.3}px)` }}></div>
              <div className="blob blob-purple" style={{ transform: `translate(${coords.x * -0.2}px, ${coords.y * -0.2}px)` }}></div>
              <div className="blob blob-pink" style={{ transform: `translate(${coords.x * 0.4}px, ${coords.y * 0.4}px)` }}></div>
              <div className="blob blob-blue" style={{ transform: `translate(${coords.x * -0.4}px, ${coords.y * -0.4}px)` }}></div>
            </div>

            {/* Floating particles around hero area */}
            <div className="sparkle sparkle-1">✦</div>
            <div className="sparkle sparkle-2">✦</div>
            <div className="plus-icon plus-1">+</div>
            <div className="plus-icon plus-2">+</div>
            <div className="orange-dot dot-1"></div>
            <div className="orange-dot dot-2"></div>
            

            <div className="floating-tech-card-glass tech-sql" style={{ transform: `translate(${coords.x * 0.7}px, ${coords.y * 0.7}px) rotate(-4deg)` }}>🛢️</div>
            <div className="floating-tech-card-glass tech-cloud" style={{ transform: `translate(${coords.x * 1.3}px, ${coords.y * 1.3}px) rotate(8deg)` }}>☁️</div>
            <div className="floating-tech-card-glass tech-ai" style={{ transform: `translate(${coords.x * 1.0}px, ${coords.y * 1.0}px) rotate(-6deg)` }}>🤖</div>
            <div className="floating-tech-card-glass tech-node" style={{ transform: `translate(${coords.x * 1.2}px, ${coords.y * 1.2}px) rotate(5deg)` }}>🟢</div>

            {/* Welcome Badge */}
            <motion.div 
              className="login-badge-container animate-float"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="badge-title">Welcome Back to MBK Technology</span>
            </motion.div>

            {/* Heading with slide up and shine transitions */}
            <motion.h1 
              className="login-heading"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="orange-gradient-text">Welcome</span> Back <br />
              Continue Your <br />
              <span className="orange-gradient-text gradient-shine">Professional Journey</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="login-subtitle-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Sign in to access your dashboard, courses, internships, placement opportunities, training programs, and company services.
            </motion.p>

            {/* 4 Feature Badges Checklist */}
            <div className="login-features-list">
              {[
                { title: 'Secure Login', desc: '✓' },
                { title: 'Career Opportunities', desc: '✓' },
                { title: 'Live Projects', desc: '✓' },
                { title: 'AI Resume Builder', desc: '✓' }
              ].map((item, idx) => (
                <motion.div 
                  key={idx} 
                  className="login-feature-badge-row"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + (idx * 0.08) }}
                >
                  <span className="feature-check-icon">✓</span>
                  <span className="feature-check-title">{item.title}</span>
                </motion.div>
              ))}
            </div>

            {/* Stats section */}
            <div className="login-stats-grid">
              <div className="stat-card">
                <h3>{stats.students.toLocaleString()}+</h3>
                <p>Students</p>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-card">
                <h3>{stats.companies}+</h3>
                <p>Companies</p>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-card">
                <h3>{stats.courses}+</h3>
                <p>Courses</p>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-card">
                <h3>{stats.rate}%</h3>
                <p>Placement Rate</p>
              </div>
            </div>

          </div>

          {/* Right Column (Login Card - 45% width) */}
          <div className="login-right-column">
            <motion.div 
              className="premium-login-card glassmorphism-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            >
              <h2 className="card-login-title"><span className="orange-gradient-text">Welcome</span> Back</h2>
              <p className="card-login-subtitle">Sign in to your MBK Technology account</p>

              {serverError && (
                <div className="login-alert-error">
                  <span>⚠️</span> {serverError}
                </div>
              )}

              {isSuccess && (
                <div className="login-alert-success">
                  <span>✓</span> Login successful! Redirecting...
                </div>
              )}

              <form onSubmit={handleSubmit} className="login-credentials-form">
                
                {/* Email Input */}
                <div className="login-input-group">
                  <label htmlFor="email"><span className="orange-gradient-text">Email Address</span></label>
                  <div className="input-with-icon-redesigned">
                    <span className="field-icon-span-orange">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </span>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'input-field-error' : ''}
                    />
                  </div>
                  {errors.email && <span className="validation-error-msg">{errors.email}</span>}
                </div>

                {/* Password Input */}
                <div className="login-input-group">
                  <label htmlFor="password"><span className="orange-gradient-text">Password</span></label>
                  <div className="input-with-icon-redesigned">
                    <span className="field-icon-span-orange">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </span>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={errors.password ? 'input-field-error' : ''}
                    />
                    <button
                      type="button"
                      className="password-visibility-toggle"
                      onClick={() => setShowPassword(prev => !prev)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.password && <span className="validation-error-msg">{errors.password}</span>}
                </div>

                {/* Options */}
                <div className="login-form-options-redesigned">
                  <label className="remember-me-checkbox-custom">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="checkbox-box-glow"></span>
                    <span>Remember Me</span>
                  </label>
                  <Link to="/forgot-password" className="forgot-password-link-orange">
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="login-submit-button-premium-orange ripple"
                >
                  {isSubmitting ? 'Signing In...' : 'Login'}
                </button>
              </form>



              <div className="card-footer-create">
                Don't have an account? <Link to="/register" className="create-account-link-orange">Create Account</Link>
              </div>

            </motion.div>
          </div>

        </div>
      </main>

      {/* Manage Accounts Modal */}
      {showManageAccountModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          {selectedProvider === 'Google' ? (
            /* Google's Authentic Account Chooser UI */
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              padding: '40px 36px 36px 36px',
              maxWidth: '450px',
              width: '100%',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.05)',
              border: '1px solid #dadce0',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              color: '#202124',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              {/* Close Button */}
              <button 
                onClick={() => setShowManageAccountModal(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: '#5f6368',
                  padding: '4px'
                }}
              >
                ✕
              </button>

              {/* Google Logo */}
              <div style={{ marginBottom: '16px' }}>
                <svg viewBox="0 0 24 24" width="75" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
              </div>
              
              <h2 style={{ fontSize: '24px', fontWeight: 400, margin: '8px 0 4px 0', color: '#202124', letterSpacing: '-0.5px' }}>Choose an account</h2>
              <p style={{ fontSize: '16px', color: '#3c4043', margin: '0 0 28px 0', fontWeight: 400 }}>to continue to Google</p>

              <div style={{ width: '100%', borderTop: '1px solid #dadce0', display: 'flex', flexDirection: 'column' }}>
                {googleAccounts.map((account, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleSocialAccountSelect(account.email)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 0',
                      borderBottom: '1px solid #dadce0',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      backgroundColor: '#FFFFFF',
                      width: '100%'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7f8f9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: account.avatarBg,
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 500,
                      fontSize: '13px'
                    }}>
                      {account.name.charAt(0)}
                    </div>
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: '14px', color: '#3c4043' }}>{account.name}</div>
                      <div style={{ fontSize: '12px', color: '#5f6368' }}>{account.email}</div>
                    </div>
                  </div>
                ))}
                
                {/* Use another account */}
                <div 
                  onClick={() => setShowManageAccountModal(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 0',
                    borderBottom: '1px solid #dadce0',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    backgroundColor: '#FFFFFF',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7f8f9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #dadce0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#5f6368" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <div style={{ textAlign: 'left', fontWeight: 500, fontSize: '14px', color: '#3c4043' }}>
                    Use another account
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '24px', fontSize: '12px', color: '#757575' }}>
                <span>English (United States)</span>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span style={{ cursor: 'pointer' }}>Help</span>
                  <span style={{ cursor: 'pointer' }}>Privacy</span>
                  <span style={{ cursor: 'pointer' }}>Terms</span>
                </div>
              </div>
            </div>
          ) : (
            /* Microsoft's Authentic Account Chooser UI */
            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '44px 44px 36px 44px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              border: '1px solid #cccccc',
              fontFamily: '"Segoe UI", -apple-system, sans-serif',
              color: '#1b1b1b',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}>
              {/* Close Button */}
              <button 
                onClick={() => setShowManageAccountModal(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: '#505050',
                  padding: '4px'
                }}
              >
                ✕
              </button>

              {/* Microsoft Logo */}
              <div style={{ display: 'flex', gap: '2px', marginBottom: '24px' }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: '#F25022' }}></span>
                <span style={{ width: '10px', height: '10px', backgroundColor: '#7FBA00' }}></span>
                <div style={{ flexBasis: '100%', height: 0 }}></div>
                <span style={{ width: '10px', height: '10px', backgroundColor: '#00A4EF' }}></span>
                <span style={{ width: '10px', height: '10px', backgroundColor: '#FFB900' }}></span>
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 16px 0', color: '#1b1b1b' }}>Pick an account</h2>

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {microsoftAccounts.map((account, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleSocialAccountSelect(account.email)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 8px',
                      cursor: 'pointer',
                      transition: 'background-color 0.1s',
                      backgroundColor: '#FFFFFF',
                      width: '100%'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eaeaea'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: account.avatarBg,
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: '12px'
                    }}>
                      {account.name.split(' ').map(n => n.charAt(0)).join('')}
                    </div>
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '15px', color: '#1b1b1b' }}>{account.name}</div>
                      <div style={{ fontSize: '13px', color: '#676767' }}>{account.email}</div>
                    </div>
                  </div>
                ))}

                {/* Use another account */}
                <div 
                  onClick={() => setShowManageAccountModal(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 8px',
                    cursor: 'pointer',
                    transition: 'background-color 0.1s',
                    backgroundColor: '#FFFFFF',
                    width: '100%',
                    marginTop: '8px',
                    borderTop: '1px solid #e5e5e5'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eaeaea'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#eaeaea',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    color: '#505050'
                  }}>
                    +
                  </div>
                  <div style={{ textAlign: 'left', fontWeight: 600, fontSize: '15px', color: '#1b1b1b' }}>
                    Use another account
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', width: '100%', marginTop: '36px', fontSize: '11px', color: '#505050' }}>
                <span style={{ cursor: 'pointer' }}>Terms of use</span>
                <span style={{ cursor: 'pointer' }}>Privacy & cookies</span>
                <span style={{ cursor: 'pointer' }}>...</span>
              </div>
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}