/**
 * Admin Premium Design System - Ultra-premium SaaS Admin Dashboard
 * White backgrounds, soft shadows, rounded 18-24px corners, clean enterprise UI.
 */
import React from 'react';
import { motion } from 'framer-motion';

/* ─── Design Tokens ─── */
export const A = {
  primary:    'var(--primary, #6366F1)',
  secondary:  'var(--secondary, #8B5CF6)',
  blue:       '#3B82F6',
  green:      '#10B981',
  orange:     '#F59E0B',
  red:        '#EF4444',
  bg:         '#F8FAFC',
  surface:    '#FFFFFF',
  ink:        '#0F172A',
  inkSoft:    '#475569',
  inkMute:    '#94A3B8',
  border:     '#E2E8F0',
  shadow:     '0 4px 20px rgba(0, 0, 0, 0.03)',
  shadowHover:'0 10px 30px rgba(0, 0, 0, 0.08)',
  radius:     20,
  radiusSm:   12,
  font:       "'Inter', 'Segoe UI', sans-serif",
};

/* ─── Admin Page Wrapper ─── */
export function AdminPage({ children }) {
  return (
    <div style={{ position: 'relative', minHeight: '100%', background: A.bg, overflow: 'hidden' }}>
      {/* Decorative premium header gradient (subtle) */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 250, background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)', zIndex: 0 }} />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ position: 'relative', zIndex: 1, padding: '40px 48px' }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─── Page Header ─── */
export function AdminPageHeader({ title, subtitle, emoji, actions }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: A.ink, letterSpacing: '-0.5px', fontFamily: A.font }}>
          {title} {emoji && <span style={{ display: 'inline-block' }}>{emoji}</span>}
        </h1>
        {subtitle && <p style={{ margin: '6px 0 0', fontSize: 15, fontWeight: 500, color: A.inkSoft }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 12 }}>{actions}</div>}
    </div>
  );
}

/* ─── Enterprise Card ─── */
export function EnterpriseCard({ children, style = {}, hover = false, className = '', onClick }) {
  return (
    <motion.div
      className={className}
      onClick={onClick}
      whileHover={hover ? { y: -4, boxShadow: A.shadowHover } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        background: A.surface,
        border: `1px solid ${A.border}`,
        borderRadius: A.radius,
        padding: 24,
        boxShadow: A.shadow,
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Stat Widget ─── */
export function AdminStatWidget({ label, value, icon, gradientFrom, gradientTo, trend, trendUp = true }) {
  return (
    <EnterpriseCard style={{ display: 'flex', flexDirection: 'column', gap: 16 }} hover={true}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: 48, height: 48, background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: `0 8px 16px rgba(0,0,0,0.1)` }}>
          {icon}
        </div>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: trendUp ? '#ECFDF5' : '#FEF2F2', color: trendUp ? A.green : A.red, padding: '4px 10px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
            {trendUp ? '↑' : '↓'} {trend}
          </div>
        )}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: A.ink, lineHeight: 1.2, letterSpacing: '-1px', fontFamily: A.font }}>{value}</h3>
        <p style={{ margin: '4px 0 0', fontSize: 14, fontWeight: 600, color: A.inkSoft }}>{label}</p>
      </div>
    </EnterpriseCard>
  );
}

/* ─── Buttons ─── */
export function AdminButton({ children, onClick, disabled, style = {}, variant = 'primary', icon }) {
  const variants = {
    primary:  { bg: A.ink, color: '#fff', border: 'none', shadow: `0 4px 12px rgba(15, 23, 42, 0.2)` },
    blue:     { bg: A.primary, color: '#fff', border: 'none', shadow: `0 4px 12px rgba(99, 102, 241, 0.3)` },
    outline:  { bg: A.surface, color: A.ink, border: `1px solid ${A.border}`, shadow: '0 2px 6px rgba(0,0,0,0.02)' },
    ghost:    { bg: '#F1F5F9', color: A.ink, border: 'none', shadow: 'none' },
    danger:   { bg: '#FEF2F2', color: A.red, border: 'none', shadow: 'none' },
  };
  const v = variants[variant] || variants.primary;

  return (
    <motion.button
      whileHover={disabled ? {} : { y: -2, boxShadow: v.shadow || '0 6px 16px rgba(0,0,0,0.06)' }}
      whileTap={disabled ? {} : { y: 0, scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '10px 20px',
        background: disabled ? '#E2E8F0' : v.bg,
        color: disabled ? A.inkMute : v.color,
        border: v.border,
        borderRadius: A.radiusSm,
        fontWeight: 600,
        fontSize: 14,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : v.shadow,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontFamily: A.font,
        transition: 'background 0.2s',
        ...style,
      }}
    >
      {icon}
      {children}
    </motion.button>
  );
}

/* ─── Table Container ─── */
export function AdminTableContainer({ children }) {
  return (
    <div style={{ background: A.surface, border: `1px solid ${A.border}`, borderRadius: A.radius, overflow: 'hidden', boxShadow: A.shadow }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: A.font }}>
          {children}
        </table>
      </div>
    </div>
  );
}

export function AdminTh({ children }) {
  return (
    <th style={{ padding: '16px 24px', background: '#F8FAFC', color: A.inkSoft, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: `1px solid ${A.border}` }}>
      {children}
    </th>
  );
}

export function AdminTd({ children }) {
  return (
    <td style={{ padding: '16px 24px', borderBottom: `1px solid ${A.border}`, color: A.ink, fontSize: 14, fontWeight: 500 }}>
      {children}
    </td>
  );
}

/* ─── Badge ─── */
export function AdminBadge({ children, color = A.primary, bg }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 12px', borderRadius: 20,
      background: bg || `${color}15`,
      color: color, fontSize: 12, fontWeight: 600,
    }}>
      {children}
    </span>
  );
}

/* ─── Search Bar ─── */
export function AdminSearch({ placeholder = "Search...", value, onChange, style={} }) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 400, ...style }}>
      <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: A.inkMute }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          padding: '12px 16px 12px 40px',
          background: A.surface,
          border: `1px solid ${A.border}`,
          borderRadius: A.radiusSm,
          fontSize: 14,
          color: A.ink,
          fontFamily: A.font,
          outline: 'none',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          transition: 'all 0.2s'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = A.primary;
          e.target.style.boxShadow = `0 0 0 3px ${A.primary}33`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = A.border;
          e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
        }}
      />
    </div>
  );
}
