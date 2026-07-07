import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem('reset_email') || '';

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  /* Guard — must come from OTP verification */
  useEffect(() => {
    if (!email) navigate('/forgot-password');
  }, [email, navigate]);

  const validate = () => {
    const errs = {};
    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters.';
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
      errs.password = 'Password must contain letters and numbers.';
    }
    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  /* Password strength indicator */
  const getStrength = (pw) => {
    if (!pw) return { label: '', color: '#e2e8f0', width: '0%' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const map = [
      { label: 'Weak',   color: '#ef4444', width: '25%' },
      { label: 'Fair',   color: '#f97316', width: '50%' },
      { label: 'Good',   color: '#eab308', width: '75%' },
      { label: 'Strong', color: '#22c55e', width: '100%' },
    ];
    return map[score - 1] || map[0];
  };
  const strength = getStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    setServerError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.message || 'Failed to reset password. Please try again.');
      } else {
        setIsSuccess(true);
        sessionStorage.removeItem('reset_email');
        // Auto-login: store user info and redirect to dashboard
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch {
      setServerError('Unable to reach the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const EyeIcon = ({ show }) => show ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  if (isSuccess) {
    return (
      <>
        <Navbar />
        <div className="auth-container">
          <motion.div
            className="auth-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div style={{ textAlign: 'center', padding: '20px 10px' }}>
              <motion.div
                style={{ fontSize: '56px', marginBottom: '20px' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              >
                🎉
              </motion.div>
              <h2 style={{ color: 'var(--black-soft)', marginBottom: '10px', fontSize: '22px', fontWeight: 800 }}>
                Password Reset Successful!
              </h2>
              <p style={{ color: 'var(--gray-600)', marginBottom: '8px', lineHeight: 1.6 }}>
                Your password has been updated. You can now sign in with your new password.
              </p>
              <p style={{ color: 'var(--gray-400)', fontSize: '13px', marginBottom: '28px' }}>
                Redirecting to login page…
              </p>
              <Link to="/login" className="auth-button" style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>
                Go to Login
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/otp-verification"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '13.5px', color: 'var(--gray-500)', textDecoration: 'none',
              marginBottom: '20px', fontWeight: '600',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back</span>
          </Link>

          <div className="auth-header">
            <div style={{ fontSize: '44px', marginBottom: '12px' }}>🔑</div>
            <h1 className="auth-title">Create New Password</h1>
            <p className="auth-subtitle" style={{ lineHeight: 1.6 }}>
              Setting a new password for<br />
              <strong style={{ color: 'var(--black-soft)' }}>{email}</strong>
            </p>
          </div>

          {serverError && (
            <div style={{
              background: '#fff1f2', color: '#c41e3a', padding: '12px 16px',
              borderRadius: '8px', marginBottom: '18px', fontSize: '14px',
              fontWeight: 500, border: '1px solid #fecdd3',
            }}>
              ⚠️ {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(p => !p)}
                  aria-label="Toggle password visibility"
                >
                  <EyeIcon show={showPassword} />
                </button>
              </div>

              {/* Strength bar */}
              {formData.password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                    <motion.div
                      style={{ height: '100%', background: strength.color, borderRadius: '2px' }}
                      initial={{ width: 0 }}
                      animate={{ width: strength.width }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p style={{ fontSize: '12px', color: strength.color, marginTop: '4px', fontWeight: 600 }}>
                    Strength: {strength.label}
                  </p>
                </div>
              )}
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirm(p => !p)}
                  aria-label="Toggle confirm password visibility"
                >
                  <EyeIcon show={showConfirm} />
                </button>
              </div>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            {/* Requirements checklist */}
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '14px 16px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '10px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Password Requirements
              </p>
              {[
                { label: 'At least 8 characters',           met: formData.password.length >= 8 },
                { label: 'Contains letters (A–Z)',           met: /[A-Za-z]/.test(formData.password) },
                { label: 'Contains numbers (0–9)',           met: /\d/.test(formData.password) },
                { label: 'Passwords match',                  met: formData.password && formData.password === formData.confirmPassword },
              ].map(({ label, met }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ color: met ? '#22c55e' : '#cbd5e1', fontSize: '14px' }}>{met ? '✓' : '○'}</span>
                  <span style={{ fontSize: '13px', color: met ? '#15803d' : '#94a3b8', fontWeight: met ? 600 : 400 }}>{label}</span>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{
                    width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite',
                    display: 'inline-block',
                  }} />
                  Resetting Password…
                </span>
              ) : 'Reset Password'}
            </button>
          </form>
        </motion.div>
      </div>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
