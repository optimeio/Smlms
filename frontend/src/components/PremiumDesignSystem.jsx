/**
 * Premium Design System - Shared components for the ultra-premium Student LMS Dashboard.
 * Glassmorphism, soft neumorphism, gradient icons, premium spacing.
 * Powered by Framer Motion.
 */
import React from 'react';
import { motion } from 'framer-motion';

/* ─── Design Tokens ─── */
export const P = {
  primary:    'var(--primary)',
  secondary:  'var(--secondary)',
  blue:       'var(--accent-blue)',
  green:      'var(--success)',
  orange:     'var(--warning)',
  red:        'var(--danger)',
  bg:         'var(--bg-color)',
  surface:    'var(--surface-color)',
  ink:        'var(--ink)',
  inkSoft:    'var(--ink-soft)',
  inkMute:    'var(--ink-mute)',
  border:     'var(--border-color)',
  shadow:     'var(--shadow-sm)',
  shadowHover:'var(--shadow-float)',
  radius:     22,
  radiusSm:   14,
  font:       "'Plus Jakarta Sans','Inter','Segoe UI',sans-serif",
};

/* ─── Premium Background (Aurora blobs) ─── */
export function PremiumBackground() {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{ position: 'fixed', top: -200, left: -150, width: 700, height: 700, background: 'radial-gradient(circle, rgba(91,92,255,0.07) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        style={{ position: 'fixed', top: 150, right: -250, width: 900, height: 900, background: 'radial-gradient(circle, rgba(124,92,255,0.05) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }} 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
        style={{ position: 'fixed', bottom: -150, left: '25%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(79,140,255,0.05) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} 
      />
    </>
  );
}

/* ─── Premium Page Wrapper ─── */
export function PremiumPage({ children }) {
  return (
    <div className="mbk-premium-page" style={{ position: 'relative', minHeight: '100%', background: P.bg, overflow: 'hidden' }}>
      <PremiumBackground />
      <motion.div 
        className="mbk-premium-page-inner"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ position: 'relative', zIndex: 1, padding: '36px 40px' }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─── Page Header ─── */
export function PageHeader({ title, subtitle, emoji, actions }) {
  return (
    <div className="mbk-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900, color: P.ink, letterSpacing: '-0.5px', fontFamily: P.font }}>
          {title} {emoji && <span style={{ display: 'inline-block' }}>{emoji}</span>}
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: 15, fontWeight: 500, color: P.inkSoft }}>{subtitle}</p>
      </div>
      {actions && <div style={{ display: 'flex', gap: 12 }}>{actions}</div>}
    </div>
  );
}

/* ─── Glass Card ─── */
export function GlassCard({ children, style = {}, hover = true, className = '', onClick }) {
  return (
    <motion.div
      className={`mbk-glass-card ${className}`}
      whileHover={hover ? { y: -4, boxShadow: P.shadowHover } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        background: 'var(--glass-bg, rgba(255,255,255,0.7))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${P.border}`,
        borderRadius: P.radius,
        padding: 28,
        boxShadow: P.shadow,
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

/* ─── Stat Card ─── */
export function PremiumStatCard({ label, value, icon, gradientFrom, gradientTo }) {
  return (
    <GlassCard className="mbk-stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ position: 'relative', width: 52, height: 52 }}>
        <div style={{ position: 'absolute', inset: -4, background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`, borderRadius: 18, opacity: 0.15, filter: 'blur(10px)' }} />
        <div style={{ position: 'relative', width: '100%', height: '100%', background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          {icon}
        </div>
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: 36, fontWeight: 900, color: P.ink, lineHeight: 1, letterSpacing: '-1px', fontFamily: P.font }}>{value}</h3>
        <p style={{ margin: '8px 0 0', fontSize: 14, fontWeight: 600, color: P.inkMute }}>{label}</p>
      </div>
    </GlassCard>
  );
}

/* ─── Buttons ─── */
export function GradientButton({ children, onClick, disabled, style = {}, variant = 'primary', ...rest }) {
  const variants = {
    primary:  { bg: `linear-gradient(135deg, ${P.primary}, ${P.secondary})`, shadow: `0 10px 25px rgba(91,92,255,0.3)` },
    success:  { bg: `linear-gradient(135deg, ${P.green}, #43E97B)`, shadow: `0 10px 25px rgba(34,197,94,0.3)` },
    danger:   { bg: `linear-gradient(135deg, ${P.red}, #FF758C)`, shadow: `0 10px 25px rgba(255,92,138,0.3)` },
    outline:  { bg: 'transparent', shadow: 'none' },
    ghost:    { bg: `rgba(91,92,255,0.08)`, shadow: 'none' },
  };
  const v = variants[variant] || variants.primary;
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  return (
    <motion.button
      whileHover={disabled ? {} : { y: -2, scale: 1.02, boxShadow: v.shadow }}
      whileTap={disabled ? {} : { y: 0, scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      {...rest}
      style={{
        padding: '12px 24px',
        background: disabled ? '#e2e8f0' : v.bg,
        color: disabled ? P.inkMute : isOutline ? P.primary : isGhost ? P.primary : '#fff',
        border: isOutline ? `1.5px solid ${P.border}` : 'none',
        borderRadius: 12,
        fontWeight: 700,
        fontSize: 14,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : (isOutline || isGhost) ? 'none' : `0 4px 12px rgba(91,92,255,0.15)`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontFamily: P.font,
        ...style,
      }}
    >
      {children}
    </motion.button>
  );
}

/* ─── Badge ─── */
export function Badge({ children, color = P.primary, bg }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', borderRadius: 20,
      background: bg || 'rgba(91,92,255,0.08)',
      color: color, fontSize: 11, fontWeight: 800, letterSpacing: '0.3px',
    }}>
      {children}
    </span>
  );
}

/* ─── Section Title ─── */
export function SectionTitle({ children, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
      <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: P.ink, fontFamily: P.font }}>{children}</h3>
      {action}
    </div>
  );
}

/* ─── Empty State ─── */
export function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.15 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 16 }}
      >
        {icon}
      </motion.div>
      <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: P.ink }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 14, color: P.inkMute }}>{subtitle}</p>
    </div>
  );
}
