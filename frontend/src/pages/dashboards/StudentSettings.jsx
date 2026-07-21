import { useState } from 'react';
import { useAuth } from '../../state/useAuth';
import { Shield, Bell, Lock, Eye, EyeOff, Globe, Moon, Sun, Trash2, Download, Monitor, HelpCircle, BookOpen, Bug, Headphones } from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, GradientButton, P } from '../../components/PremiumDesignSystem';

function Toggle({ value, onChange }) {
  return (
    <div onClick={onChange} style={{
      width: 48, height: 26, borderRadius: 14, cursor: 'pointer',
      background: value ? `linear-gradient(135deg, ${P.primary}, ${P.secondary})` : '#cbd5e1',
      position: 'relative', transition: 'background .25s', boxShadow: value ? '0 4px 12px rgba(91,92,255,0.25)' : 'none',
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 3, left: value ? 25 : 3,
        transition: 'left .25s cubic-bezier(.4,0,.2,1)', boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      }} />
    </div>
  );
}

function SettingRow({ title, desc, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#f8fafc', borderRadius: P.radiusSm, transition: 'background .15s' }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: P.ink }}>{title}</div>
        <div style={{ fontSize: 12, color: P.inkMute, marginTop: 2 }}>{desc}</div>
      </div>
      {children}
    </div>
  );
}

function SectionCard({ icon, iconBg, iconColor, title, desc, children }) {
  return (
    <GlassCard style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <div style={{ width: 44, height: 44, borderRadius: P.radiusSm, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}>
          {icon}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: P.ink }}>{title}</h3>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: P.inkMute }}>{desc}</p>
        </div>
      </div>
      {children}
    </GlassCard>
  );
}

const inputStyle = {
  width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${P.border}`,
  fontSize: 14, color: P.ink, outline: 'none', boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', fontFamily: P.font,
  transition: 'border-color .2s, box-shadow .2s',
};
const labelStyle = { fontSize: 13, fontWeight: 700, color: P.inkSoft, marginBottom: 8, display: 'block' };

export default function StudentSettings() {
  const { user, updateUser } = useAuth();
  
  const settings = user?.settings || {};

  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const [emailNotif, setEmailNotif] = useState(settings.emailNotif !== false);
  const [assignmentNotif, setAssignmentNotif] = useState(settings.assignmentNotif !== false);
  const [courseNotif, setCourseNotif] = useState(settings.courseNotif !== false);
  const [loginAlert, setLoginAlert] = useState(settings.loginAlert === true);
  const [theme, setTheme] = useState(settings.theme || 'light');
  const [language, setLanguage] = useState(settings.language || 'en');
  const [timezone, setTimezone] = useState(settings.timezone || 'Asia/Kolkata');
  const [profileVisibility, setProfileVisibility] = useState(settings.profileVisibility !== false);
  const [analytics, setAnalytics] = useState(settings.analytics !== false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSettingChange = async (key, value, setter) => {
    setter(value);
    
    // Save to backend immediately
    const updatedSettings = { ...settings, [key]: value };
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(user.email)}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: updatedSettings }),
      });
      const data = await res.json();
      if (data.success) {
        if (updateUser) updateUser({ ...user, settings: updatedSettings });
      } else {
        showToast('Failed to save setting', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error while saving', 'error');
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) return showToast('Please fill all password fields.', 'error');
    if (passwordData.newPassword.length < 8) return showToast('New password must be at least 8 characters.', 'error');
    if (passwordData.newPassword !== passwordData.confirmPassword) return showToast('Passwords do not match.', 'error');
    setSaving(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast(data.message || 'Failed to change password.', 'error');
      }
    } catch {
      showToast('Server error.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PremiumPage>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: toast.type === 'error' ? 'rgba(255,92,138,0.06)' : 'rgba(34,197,94,0.06)',
          color: toast.type === 'error' ? P.red : P.green,
          border: `1px solid ${toast.type === 'error' ? 'rgba(255,92,138,0.2)' : 'rgba(34,197,94,0.2)'}`,
          padding: '14px 28px', borderRadius: P.radiusSm, fontWeight: 700, fontSize: 14,
          boxShadow: P.shadow, backdropFilter: 'blur(20px)',
        }}>
          {toast.msg}
        </div>
      )}

      <PageHeader title="Settings" emoji="⚙️" subtitle="Configure your account preferences and security." />

      {/* Security */}
      <SectionCard icon={<Shield size={22} />} iconBg="rgba(249,115,22,0.1)" iconColor="#f97316" title="Security" desc="Manage your password and account security">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div style={{ position: 'relative' }}>
            <label style={labelStyle}>Current Password</label>
            <input type={showCurrent ? 'text' : 'password'} style={inputStyle} value={passwordData.currentPassword}
              onChange={e => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))} placeholder="Enter current password" />
            <div onClick={() => setShowCurrent(!showCurrent)} style={{ position: 'absolute', right: 14, top: 38, cursor: 'pointer', color: P.inkMute }}>
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <label style={labelStyle}>New Password</label>
            <input type={showNew ? 'text' : 'password'} style={inputStyle} value={passwordData.newPassword}
              onChange={e => setPasswordData(p => ({ ...p, newPassword: e.target.value }))} placeholder="Min 8 characters" />
            <div onClick={() => setShowNew(!showNew)} style={{ position: 'absolute', right: 14, top: 38, cursor: 'pointer', color: P.inkMute }}>
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Confirm New Password</label>
            <input type="password" style={inputStyle} value={passwordData.confirmPassword}
              onChange={e => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="Re-enter new password" />
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${P.border}`, margin: '0 0 20px', paddingTop: 20 }}>
          <SettingRow title="Login Alerts" desc="Get notified when a new device logs into your account">
            <Toggle value={loginAlert} onChange={() => handleSettingChange('loginAlert', !loginAlert, setLoginAlert)} />
          </SettingRow>
        </div>

        <GradientButton onClick={handleChangePassword} disabled={saving}>
          <Lock size={15} /> {saving ? 'Saving...' : 'Change Password'}
        </GradientButton>
      </SectionCard>

      {/* Notifications */}
      <SectionCard icon={<Bell size={22} />} iconBg="rgba(255,92,138,0.1)" iconColor={P.red} title="Notification Preferences" desc="Choose how and when you receive updates">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SettingRow title="Email Notifications" desc="Receive updates about platform activity via email">
            <Toggle value={emailNotif} onChange={() => handleSettingChange('emailNotif', !emailNotif, setEmailNotif)} />
          </SettingRow>
          <SettingRow title="Assignment Alerts" desc="Get notified about new assignments and deadlines">
            <Toggle value={assignmentNotif} onChange={() => handleSettingChange('assignmentNotif', !assignmentNotif, setAssignmentNotif)} />
          </SettingRow>
          <SettingRow title="Course Updates" desc="Alerts for live classes and course material updates">
            <Toggle value={courseNotif} onChange={() => handleSettingChange('courseNotif', !courseNotif, setCourseNotif)} />
          </SettingRow>
        </div>
      </SectionCard>

      {/* Appearance */}
      <SectionCard icon={<Monitor size={22} />} iconBg="rgba(91,92,255,0.1)" iconColor={P.primary} title="Appearance & Language" desc="Customize how the platform looks for you">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          <div>
            <label style={labelStyle}>Theme</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['light', 'dark', 'system'].map(t => (
                <div key={t} onClick={() => handleSettingChange('theme', t, setTheme)} style={{
                  flex: 1, padding: '14px 12px', borderRadius: 12, textAlign: 'center', cursor: 'pointer',
                  background: theme === t ? `rgba(91,92,255,0.06)` : '#f8fafc',
                  border: `2px solid ${theme === t ? P.primary : P.border}`,
                  fontWeight: 700, fontSize: 13, color: theme === t ? P.primary : P.inkMute,
                  transition: 'all .2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                }}>
                  {t === 'light' && <Sun size={18} />}
                  {t === 'dark' && <Moon size={18} />}
                  {t === 'system' && <Monitor size={18} />}
                  <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Language</label>
            <select style={inputStyle} value={language} onChange={e => handleSettingChange('language', e.target.value, setLanguage)}>
              <option value="en">English</option>
              <option value="ta">Tamil</option>
              <option value="hi">Hindi</option>
              <option value="te">Telugu</option>
              <option value="kn">Kannada</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Timezone</label>
            <select style={inputStyle} value={timezone} onChange={e => handleSettingChange('timezone', e.target.value, setTimezone)}>
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="America/New_York">America/New York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST)</option>
              <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
            </select>
          </div>
        </div>
      </SectionCard>

      {/* Data & Privacy */}
      <SectionCard icon={<Globe size={22} />} iconBg="rgba(34,197,94,0.1)" iconColor={P.green} title="Data & Privacy" desc="Manage your data and account">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          <SettingRow title="Profile Visibility" desc="Allow recruiters and trainers to see your academic profile">
            <Toggle value={profileVisibility} onChange={() => handleSettingChange('profileVisibility', !profileVisibility, setProfileVisibility)} />
          </SettingRow>
          <SettingRow title="Learning Analytics" desc="Allow the platform to analyze your progress to recommend courses">
            <Toggle value={analytics} onChange={() => handleSettingChange('analytics', !analytics, setAnalytics)} />
          </SettingRow>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <GradientButton variant="primary" onClick={() => showToast('Your data export has been started. You will receive it via email.')}>
            <Download size={15} /> Export My Data
          </GradientButton>
          <GradientButton variant="danger" onClick={() => { if (window.confirm('Are you sure? This action is irreversible.')) showToast('Account deletion request sent to admin.'); }}>
            <Trash2 size={15} /> Delete Account
          </GradientButton>
        </div>
      </SectionCard>

      {/* Help & Support */}
      <SectionCard icon={<HelpCircle size={22} />} iconBg="rgba(79,140,255,0.1)" iconColor={P.blue} title="Help & Support" desc="Get assistance or report issues">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {[
            { title: 'Student Guide', desc: 'Browse platform tutorials and FAQs', icon: <BookOpen size={20} />, color: P.primary },
            { title: 'Contact Support', desc: 'Reach out to our support team', icon: <Headphones size={20} />, color: P.blue },
            { title: 'Report a Bug', desc: 'Let us know about any issues', icon: <Bug size={20} />, color: P.red },
          ].map(item => (
            <div key={item.title} style={{
              padding: 20, background: '#f8fafc', borderRadius: P.radiusSm, cursor: 'pointer',
              border: `1px solid ${P.border}`, transition: 'all .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = P.shadow; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ color: item.color, marginBottom: 12 }}>{item.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: P.ink, marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: P.inkMute, lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div style={{ textAlign: 'center', padding: '8px 0 16px', color: P.inkMute, fontSize: 12 }}>
        MBK LMS Platform &bull; Version 2.1.0 &bull; &copy; {new Date().getFullYear()}
      </div>
    </PremiumPage>
  );
}
