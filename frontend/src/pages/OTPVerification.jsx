import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const OTP_LENGTH = 6;
const RESEND_TIMER = 120; // seconds

export default function OTPVerification() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem('reset_email') || '';

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [timeLeft, setTimeLeft] = useState(RESEND_TIMER);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inputRefs = useRef([]);

  /* Redirect if no email in session */
  useEffect(() => {
    if (!email) navigate('/forgot-password');
  }, [email, navigate]);

  /* Countdown timer */
  useEffect(() => {
    if (timeLeft <= 0) { setCanResend(true); return; }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  /* OTP input handlers */
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1); // only last char
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...otp];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    e.preventDefault();
  };

  /* Submit OTP */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError('Please enter all 6 digits.');
      return;
    }
    setError('');
    setIsVerifying(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Verification failed. Please try again.');
      } else {
        setSuccess('Code verified! Redirecting to reset password…');
        setTimeout(() => navigate('/reset-password'), 1500);
      }
    } catch {
      setError('Unable to reach the server. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  /* Resend OTP */
  const handleResend = async () => {
    if (!canResend || isResending) return;
    setError('');
    setIsResending(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to resend code.');
      } else {
        setOtp(Array(OTP_LENGTH).fill(''));
        setTimeLeft(RESEND_TIMER);
        setCanResend(false);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError('Unable to reach the server.');
    } finally {
      setIsResending(false);
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
            to="/forgot-password"
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
            <div style={{ fontSize: '44px', marginBottom: '12px' }}>📧</div>
            <h1 className="auth-title">Verify Your Email</h1>
            <p className="auth-subtitle" style={{ lineHeight: 1.6 }}>
              We sent a 6-digit code to<br />
              <strong style={{ color: 'var(--black-soft)' }}>{email}</strong>
            </p>
          </div>

          {error && (
            <div style={{
              background: '#fff1f2', color: '#c41e3a', padding: '12px 16px',
              borderRadius: '8px', marginBottom: '16px', fontSize: '14px',
              fontWeight: 500, border: '1px solid #fecdd3',
            }}>
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div style={{
              background: '#f0fdf4', color: '#16a34a', padding: '12px 16px',
              borderRadius: '8px', marginBottom: '16px', fontSize: '14px',
              fontWeight: 600, border: '1px solid #bbf7d0',
            }}>
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* OTP boxes */}
            <div className="otp-inputs" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  className="otp-input"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength="1"
                  autoComplete="off"
                  whileFocus={{ scale: 1.1, borderColor: '#C41E3A' }}
                  style={{
                    borderColor: digit ? '#C41E3A' : undefined,
                    color: digit ? '#C41E3A' : undefined,
                    fontWeight: digit ? '800' : undefined,
                  }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  disabled={isVerifying}
                />
              ))}
            </div>

            {/* Timer & resend */}
            <div className="otp-timer" style={{ textAlign: 'center', marginBottom: '20px' }}>
              {!canResend ? (
                <span style={{ color: 'var(--gray-500)', fontSize: '14px' }}>
                  Code expires in{' '}
                  <strong style={{ color: timeLeft <= 30 ? '#C41E3A' : 'inherit' }}>
                    {formatTime(timeLeft)}
                  </strong>
                </span>
              ) : (
                <span style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    style={{
                      background: 'none', border: 'none', color: 'var(--red-primary)',
                      fontWeight: 700, cursor: 'pointer', fontSize: '14px', padding: 0,
                    }}
                  >
                    {isResending ? 'Sending…' : 'Resend Code'}
                  </button>
                </span>
              )}
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={isVerifying || otp.join('').length < OTP_LENGTH}
              style={{ opacity: otp.join('').length < OTP_LENGTH ? 0.65 : 1 }}
            >
              {isVerifying ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{
                    width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite',
                    display: 'inline-block',
                  }} />
                  Verifying…
                </span>
              ) : 'Verify Code'}
            </button>
          </form>
        </motion.div>
      </div>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
