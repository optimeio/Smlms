import { useState } from 'react';
import { Settings, Shield, Bell, User, Monitor, Save, Smartphone } from 'lucide-react';
import { 
  AdminPage, 
  AdminPageHeader, 
  EnterpriseCard, 
  AdminButton,
  A 
} from '../../components/AdminDesignSystem';

const Toggle = ({ checked, onChange, label, description }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: `1px solid ${A.border}` }}>
    <div>
      <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: A.ink }}>{label}</p>
      {description && <p style={{ margin: 0, fontSize: 13, color: A.inkSoft }}>{description}</p>}
    </div>
    <div 
      onClick={() => onChange(!checked)}
      style={{ 
        width: 44, 
        height: 24, 
        borderRadius: 12, 
        background: checked ? A.primary : '#CBD5E1', 
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.3s'
      }}
    >
      <div style={{ 
        width: 20, 
        height: 20, 
        borderRadius: '50%', 
        background: '#fff', 
        position: 'absolute', 
        top: 2, 
        left: checked ? 22 : 2, 
        transition: 'left 0.3s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }} />
    </div>
  </div>
);

export default function AdminSystem() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [settings, setSettings] = useState({
    emailNotifs: true,
    pushNotifs: false,
    weeklyReports: true,
    twoFactor: false,
    publicProfile: true,
    maintenanceMode: false,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  const tabs = [
    { id: 'Profile', icon: <User size={18} /> },
    { id: 'Security', icon: <Shield size={18} /> },
    { id: 'Notifications', icon: <Bell size={18} /> },
    { id: 'System', icon: <Monitor size={18} /> },
  ];

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: A.radiusSm, border: `1px solid ${A.border}`, fontSize: 14, color: A.ink, boxSizing: 'border-box', background: A.surface, fontFamily: A.font, outline: 'none', transition: 'border-color 0.2s' };
  const labelStyle = { display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: A.inkSoft, textTransform: 'uppercase', letterSpacing: '0.5px' };

  return (
    <AdminPage>
      <AdminPageHeader 
        title="Settings & Configuration" 
        subtitle="Manage your profile, system preferences, and security settings."
        emoji="⚙️"
      />

      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        {/* SIDEBAR TABS */}
        <EnterpriseCard style={{ padding: '16px', width: 240, flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: activeTab === tab.id ? `${A.primary}15` : 'transparent',
                  color: activeTab === tab.id ? A.primary : A.inkSoft,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  fontFamily: A.font
                }}
              >
                {tab.icon} {tab.id}
              </button>
            ))}
          </div>
        </EnterpriseCard>

        {/* SETTINGS CONTENT */}
        <EnterpriseCard style={{ padding: 32, flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, borderBottom: `1px solid ${A.border}`, paddingBottom: 24 }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: A.ink, fontFamily: A.font }}>
              {activeTab} Settings
            </h3>
            <AdminButton variant="blue" onClick={handleSave} disabled={saving} icon={<Save size={16} />}>
              {saving ? 'Saving...' : 'Save Changes'}
            </AdminButton>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {activeTab === 'Profile' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16 }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#EFF6FF', color: A.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800 }}>
                    A
                  </div>
                  <div>
                    <AdminButton variant="outline" style={{ marginBottom: 8 }}>Change Avatar</AdminButton>
                    <p style={{ margin: 0, fontSize: 13, color: A.inkMute }}>JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input type="text" style={inputStyle} defaultValue="Admin User" onFocus={e => e.target.style.borderColor = A.primary} onBlur={e => e.target.style.borderColor = A.border} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input type="email" style={inputStyle} defaultValue="admin@smgroups.com" onFocus={e => e.target.style.borderColor = A.primary} onBlur={e => e.target.style.borderColor = A.border} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Bio / Organization</label>
                  <textarea style={{ ...inputStyle, minHeight: 100, resize: 'none' }} defaultValue="System Administrator for MBK Tech platform." onFocus={e => e.target.style.borderColor = A.primary} onBlur={e => e.target.style.borderColor = A.border} />
                </div>
                <Toggle 
                  label="Public Profile" 
                  description="Allow your profile to be visible to trainers and students."
                  checked={settings.publicProfile}
                  onChange={(v) => setSettings({...settings, publicProfile: v})}
                />
              </>
            )}

            {activeTab === 'Security' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <label style={labelStyle}>Current Password</label>
                    <input type="password" style={inputStyle} placeholder="••••••••" onFocus={e => e.target.style.borderColor = A.primary} onBlur={e => e.target.style.borderColor = A.border} />
                  </div>
                  <div>
                    <label style={labelStyle}>New Password</label>
                    <input type="password" style={inputStyle} placeholder="New password" onFocus={e => e.target.style.borderColor = A.primary} onBlur={e => e.target.style.borderColor = A.border} />
                  </div>
                </div>
                
                <div style={{ marginTop: 24 }}>
                  <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 800, color: A.ink }}>Two-Factor Authentication</h4>
                  <div style={{ padding: 20, background: A.surface, border: `1px solid ${A.border}`, borderRadius: A.radiusSm }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EFF6FF', color: A.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Smartphone size={20} />
                        </div>
                        <div>
                          <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: A.ink }}>Authenticator App</p>
                          <p style={{ margin: 0, fontSize: 13, color: A.inkSoft }}>Use an app like Google Authenticator or Authy.</p>
                        </div>
                      </div>
                      <AdminButton variant="outline">Enable</AdminButton>
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: 16 }}>
                  <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 800, color: A.ink }}>Active Sessions</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: `1px solid ${A.border}` }}>
                    <div>
                      <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: A.ink }}>Windows PC - Chrome</p>
                      <p style={{ margin: 0, fontSize: 13, color: A.green, fontWeight: 600 }}>Active Now</p>
                    </div>
                    <button style={{ background: 'transparent', border: 'none', color: A.red, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Log out</button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Notifications' && (
              <>
                <Toggle 
                  label="Email Notifications" 
                  description="Receive daily summaries and critical alerts via email."
                  checked={settings.emailNotifs}
                  onChange={(v) => setSettings({...settings, emailNotifs: v})}
                />
                <Toggle 
                  label="Push Notifications" 
                  description="Receive browser push notifications for real-time events."
                  checked={settings.pushNotifs}
                  onChange={(v) => setSettings({...settings, pushNotifs: v})}
                />
                <Toggle 
                  label="Weekly Reports" 
                  description="Get a weekly digest of platform activity and statistics."
                  checked={settings.weeklyReports}
                  onChange={(v) => setSettings({...settings, weeklyReports: v})}
                />
              </>
            )}

            {activeTab === 'System' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <label style={labelStyle}>Platform Name</label>
                    <input type="text" style={inputStyle} defaultValue="MBK Tech" onFocus={e => e.target.style.borderColor = A.primary} onBlur={e => e.target.style.borderColor = A.border} />
                  </div>
                  <div>
                    <label style={labelStyle}>Support Email</label>
                    <input type="email" style={inputStyle} defaultValue="support@smgroups.com" onFocus={e => e.target.style.borderColor = A.primary} onBlur={e => e.target.style.borderColor = A.border} />
                  </div>
                </div>
                <Toggle 
                  label="Maintenance Mode" 
                  description="Disable user access temporarily while updating the system."
                  checked={settings.maintenanceMode}
                  onChange={(v) => setSettings({...settings, maintenanceMode: v})}
                />
                <div style={{ marginTop: 24, padding: 20, borderRadius: 12, border: `1px solid #FEF2F2`, background: '#FEF2F2' }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 800, color: A.red }}>Danger Zone</h4>
                  <p style={{ margin: '0 0 16px', fontSize: 13, color: A.inkSoft }}>Once you delete the platform data, there is no going back. Please be certain.</p>
                  <button style={{ background: '#fff', border: `1px solid ${A.red}`, color: A.red, padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Delete All Test Data</button>
                </div>
              </>
            )}
          </div>
        </EnterpriseCard>
      </div>
    </AdminPage>
  );
}