import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to send OTP. Please try again.');
      } else {
        setSuccess('Verification code sent! Redirecting…');
        // Save email so OTP & reset pages can use it
        sessionStorage.setItem('reset_email', email);
        setTimeout(() => navigate('/otp-verification'), 1500);
      }
    } catch (err) {
      setError('Unable to reach the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

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
            to="/login"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '13.5px', color: 'var(--gray-500)', textDecoration: 'none',
              marginBottom: '20px', fontWeight: '600', transition: 'color 0.2s ease',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Login</span>
          </Link>

          <div className="auth-header">
            <div style={{ fontSize: '44px', marginBottom: '12px' }}>🔒</div>
            <h1 className="auth-title">Forgot Password?</h1>
            <p className="auth-subtitle" style={{ lineHeight: 1.6 }}>
              Enter your registered email address and we'll send a 6-digit verification code to reset your password.
            </p>
          </div>

          {error && (
            <div style={{
              background: '#fff1f2', color: '#c41e3a', padding: '12px 16px',
              borderRadius: '8px', marginBottom: '18px', fontSize: '14px',
              fontWeight: 500, border: '1px solid #fecdd3',
            }}>
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div style={{
              background: '#f0fdf4', color: '#16a34a', padding: '12px 16px',
              borderRadius: '8px', marginBottom: '18px', fontSize: '14px',
              fontWeight: 600, border: '1px solid #bbf7d0',
            }}>
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={isLoading}
              style={{ marginTop: '8px' }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{
                    width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite',
                    display: 'inline-block',
                  }} />
                  Sending Code…
                </span>
              ) : 'Send Verification Code'}
            </button>
          </form>
        </motion.div>
      </div>
      <Footer />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
