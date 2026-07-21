import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, BookOpen, Video, BarChart3, ClipboardList, Award, Users,
  UserCog, Building2, User, Settings, LogOut, Search, Bell, LayoutDashboard,
  Trophy, Layers, ShieldCheck, Calendar, Clock, TrendingUp, FileText, Mail,
  ChevronDown, Menu, X, Check, UserPlus
} from 'lucide-react';
import { P } from './PremiumDesignSystem';

const labelToIcon = {
  'Dashboard': LayoutDashboard, 'My Courses': BookOpen, 'Live Classes': Video,
  'Assignments': ClipboardList, 'Assignments & Quiz': ClipboardList, 'Certificates': GraduationCap,
  'Students Directory': Users, 'Trainers Directory': UserCog, 'Companies Directory': Building2,
  'Profile': User, 'Settings': Settings, 'Logout': LogOut, 'Reports': BarChart3,
  'Earnings': TrendingUp, 'Messages': Mail, 'Notifications': Bell, 'Schedule': Calendar,
  'Scheduling': Calendar, 'Attendance': Clock, 'Employees': Users, 'Training Programs': Layers,
  'Trainer Directory': UserCog, 'Student Directory': Users, 'Company Directory': Building2,
  'Trainers': UserCog, 'User Management': Users, 'Companies': Building2, 'Students': Users,
  'SPOC': ShieldCheck, 'Course Management': BookOpen, 'Categories': Layers, 'Study Materials': FileText,
  'System Settings': Settings, 'Document Manager': FileText, 'Audit Logs': ClipboardList,
  'Job Opportunities': Trophy, 'Job Posts': ClipboardList, 'Applicants': Users,
  'Interviews': Calendar, 'Hired Candidates': Award, 'Register Trainer': UserPlus,
  'Job Offers': Trophy,
};

function SidebarContent({ mainItems, settingsItem, logoutItem, activeTab, onTabChange, onSignOut, onClose }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "32px 28px 24px" }}>
        <div style={{ 
          width: 44, height: 44, borderRadius: 14, 
          background: '#fff', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          boxShadow: `0 8px 24px rgba(91,92,255,0.1)`,
          padding: 2,
          boxSizing: 'border-box'
        }}>
          <img src="/logo.png" alt="MBK Tech Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} />
        </div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 19, color: P.ink, lineHeight: 1.1, letterSpacing: -0.5, fontFamily: P.font }}>
            MBK <span style={{ color: P.primary }}>LMS</span>
          </div>
          <div style={{ fontSize: 10, letterSpacing: 1.5, color: P.inkMute, fontWeight: 700, marginTop: 4 }}>
            LEARNING PLATFORM
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: P.inkSoft, padding: 4 }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Main Menu Links */}
      <div style={{ padding: "8px 24px", flexGrow: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, color: P.inkMute, marginBottom: 16, marginTop: 8 }}>
          MAIN MENU
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {mainItems.map((item) => {
            const Icon = labelToIcon[item.name] || LayoutDashboard;
            const isActive = activeTab === item.name;
            return (
              <motion.div
                key={item.name}
                whileHover={{ x: isActive ? 0 : 4, background: isActive ? `linear-gradient(135deg, ${P.primary}, ${P.secondary})` : 'rgba(91,92,255,0.05)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (item.action) item.action();
                  else onTabChange(item.name);
                  if (onClose) onClose();
                }}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "12px 16px", borderRadius: P.radiusSm,
                  fontSize: 14.5, fontWeight: isActive ? 700 : 600,
                  cursor: "pointer",
                  color: isActive ? "#fff" : P.inkSoft,
                  background: isActive ? `linear-gradient(135deg, ${P.primary}, ${P.secondary})` : "transparent",
                  boxShadow: isActive ? P.shadow : 'none',
                  transition: 'background 0.2s, color 0.2s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Icon size={18} strokeWidth={2.2} />
                <span>{item.name}</span>
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* Settings & Logout Links */}
      <div style={{ padding: "20px 24px 32px", position: 'relative' }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, color: P.inkMute, marginBottom: 16 }}>
          PREFERENCES
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {settingsItem && (
            <motion.div
              whileHover={{ x: 4, background: 'rgba(91,92,255,0.05)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { if (settingsItem.action) settingsItem.action(); else onTabChange(settingsItem.name); if (onClose) onClose(); }}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "12px 16px", borderRadius: P.radiusSm,
                fontSize: 14.5, fontWeight: activeTab === settingsItem.name ? 700 : 600,
                cursor: "pointer",
                color: activeTab === settingsItem.name ? P.primary : P.inkSoft,
                background: activeTab === settingsItem.name ? 'rgba(91,92,255,0.08)' : "transparent",
              }}
            >
              <Settings size={18} strokeWidth={2.2} />
              <span>{settingsItem.name}</span>
            </motion.div>
          )}
          {logoutItem && (
            <motion.div
              whileHover={{ x: 4, background: 'rgba(255,92,138,0.08)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (logoutItem.action) { logoutItem.action(); } else { onSignOut(); }
                if (onClose) onClose();
              }}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "12px 16px", borderRadius: P.radiusSm,
                fontSize: 14.5, fontWeight: 600,
                cursor: "pointer", color: P.red,
              }}
            >
              <LogOut size={18} strokeWidth={2.2} />
              <span>{logoutItem.name}</span>
            </motion.div>
          )}
        </nav>
      </div>
    </div>
  );
}

export default function AppLayout({
  user = {},
  activeTab = 'Dashboard',
  onTabChange = () => {},
  sidebarItems = [],
  onSearch = () => {},
  onSignOut = () => {},
  children
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const initials = (user.fullName || user.email || 'U')
    .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const mainItems = sidebarItems.filter(item => item.name !== 'Settings' && item.name !== 'Logout');
  const settingsItem = sidebarItems.find(item => item.name === 'Settings');
  const logoutItem = sidebarItems.find(item => item.name === 'Logout');

  const triggerSignOut = () => setShowLogoutConfirm(true);

  return (
    <div style={{ display: "flex", background: P.bg, height: "100vh", width: '100%', fontFamily: P.font, overflow: 'hidden' }}>
      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(27,31,59,0.4)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={e => e.stopPropagation()}
              style={{ width: 280, height: '100vh', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRight: `1px solid ${P.border}` }}
            >
              <SidebarContent mainItems={mainItems} settingsItem={settingsItem} logoutItem={logoutItem} activeTab={activeTab} onTabChange={onTabChange} onSignOut={triggerSignOut} onClose={() => setIsMobileOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="mbk-sidebar-desktop" style={{
        width: 280, height: '100vh', flexShrink: 0,
        background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
        borderRight: `1px solid ${P.border}`, zIndex: 50
      }}>
        <SidebarContent mainItems={mainItems} settingsItem={settingsItem} logoutItem={logoutItem} activeTab={activeTab} onTabChange={onTabChange} onSignOut={triggerSignOut} />
      </aside>

      {/* Right Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative', overflowY: 'auto' }}>
        
        {/* Top Header */}
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 40px", background: 'rgba(247,249,255,0.7)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          borderBottom: `1px solid ${P.border}`, position: 'sticky', top: 0, zIndex: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button className="mbk-hamburger" onClick={() => setIsMobileOpen(true)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Menu size={24} color={P.ink} />
            </button>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: P.ink, letterSpacing: -0.5, margin: 0, fontFamily: P.font }}>
                {activeTab}
              </h1>
              <div style={{ fontSize: 13, color: P.inkMute, marginTop: 4, fontWeight: 500 }}>
                {dateStr}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              {isSearchOpen ? (
                <motion.div initial={{ width: 42, opacity: 0 }} animate={{ width: 250, opacity: 1 }} style={{ display: 'flex', alignItems: 'center', background: P.surface, borderRadius: 30, border: `1px solid ${P.blue}`, padding: '0 14px', height: 42, boxShadow: `0 0 0 3px rgba(91,92,255,0.1)` }}>
                  <Search size={16} color={P.blue} />
                  <input autoFocus type="text" placeholder="Search courses, classes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: 10, fontSize: 14, color: P.ink, width: '100%', fontFamily: P.font }} />
                  <X size={16} color={P.inkMute} style={{ cursor: 'pointer' }} onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} />
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsSearchOpen(true)} style={{ width: 42, height: 42, borderRadius: '50%', background: P.surface, border: `1px solid ${P.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: P.shadow }}>
                  <Search size={18} color={P.inkSoft} />
                </motion.div>
              )}
            </div>
            
            {/* Messages */}
            <div style={{ position: 'relative' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setIsMailOpen(!isMailOpen); setIsNotifOpen(false); setIsDropdownOpen(false); }} style={{ width: 42, height: 42, borderRadius: '50%', background: isMailOpen ? 'rgba(91,92,255,0.08)' : P.surface, border: `1px solid ${isMailOpen ? P.blue : P.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: P.shadow, position: 'relative' }}>
                <Mail size={18} color={isMailOpen ? P.blue : P.inkSoft} />
                <div style={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: '50%', background: P.orange, border: '2px solid #fff' }} />
              </motion.div>
              <AnimatePresence>
                {isMailOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} style={{ position: 'absolute', top: '100%', right: -60, marginTop: 12, width: 320, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: P.radiusMd, border: `1px solid ${P.border}`, boxShadow: P.shadowHover, zIndex: 100, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: `1px solid ${P.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: P.ink }}>Messages</h4>
                      <span style={{ fontSize: 12, color: P.blue, fontWeight: 600, cursor: 'pointer' }}>Mark all read</span>
                    </div>
                    <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
                      {[1,2,3].map(i => (
                        <div key={i} style={{ display: 'flex', gap: 12, padding: 12, borderRadius: P.radiusSm, cursor: 'pointer', background: i === 1 ? 'rgba(91,92,255,0.04)' : 'transparent', transition: 'background 0.2s' }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: P.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 'bold' }}>T{i}</div>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: P.ink }}>Trainer {i}</p>
                            <p style={{ margin: '2px 0 0', fontSize: 12, color: P.inkMute, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>Don't forget the assignment due tomorrow!</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: 12, borderTop: `1px solid ${P.border}`, textAlign: 'center', fontSize: 13, color: P.blue, fontWeight: 700, cursor: 'pointer' }}>View All Messages</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setIsNotifOpen(!isNotifOpen); setIsMailOpen(false); setIsDropdownOpen(false); }} style={{ width: 42, height: 42, borderRadius: '50%', background: isNotifOpen ? 'rgba(255,92,138,0.08)' : P.surface, border: `1px solid ${isNotifOpen ? P.red : P.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: P.shadow, position: 'relative' }}>
                <Bell size={18} color={isNotifOpen ? P.red : P.inkSoft} />
                <div style={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: '50%', background: P.red, border: '2px solid #fff' }} />
              </motion.div>
              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} style={{ position: 'absolute', top: '100%', right: -20, marginTop: 12, width: 320, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: P.radiusMd, border: `1px solid ${P.border}`, boxShadow: P.shadowHover, zIndex: 100, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: `1px solid ${P.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: P.ink }}>Notifications</h4>
                      <span style={{ fontSize: 12, color: P.blue, fontWeight: 600, cursor: 'pointer' }}>Clear all</span>
                    </div>
                    <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
                      <div style={{ display: 'flex', gap: 12, padding: 12, borderRadius: P.radiusSm, cursor: 'pointer', background: 'rgba(255,92,138,0.04)' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,92,138,0.1)', color: P.red, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Video size={16} /></div>
                        <div>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: P.ink }}>Live Class Starting</p>
                          <p style={{ margin: '2px 0 0', fontSize: 12, color: P.inkMute }}>React Advanced Concepts in 10 mins</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 12, padding: 12, borderRadius: P.radiusSm, cursor: 'pointer' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Award size={16} /></div>
                        <div>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: P.ink }}>Certificate Earned</p>
                          <p style={{ margin: '2px 0 0', fontSize: 12, color: P.inkMute }}>You completed HTML/CSS Basics!</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: 12, borderTop: `1px solid ${P.border}`, textAlign: 'center', fontSize: 13, color: P.blue, fontWeight: 700, cursor: 'pointer' }}>View All Notifications</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ width: 1, height: 24, background: P.border, margin: '0 4px' }} />

            {/* Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <motion.div whileHover={{ opacity: 0.8 }} onClick={() => { setIsDropdownOpen(!isDropdownOpen); setIsMailOpen(false); setIsNotifOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", padding: '4px 12px 4px 4px', background: P.surface, borderRadius: 30, border: `1px solid ${P.border}`, boxShadow: P.shadow }}>
                <div style={{ position: 'relative' }} onClick={(e) => { e.stopPropagation(); setShowPhotoViewer(true); }}>
                  {user.profilePhoto ? (
                    <img src={user.profilePhoto} alt="Avatar" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: 'cover', cursor: 'zoom-in' }} />
                  ) : (
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${P.primary}, ${P.secondary})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
                      {initials}
                    </div>
                  )}
                  {/* Online Indicator */}
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: '50%', background: P.green, border: `2.5px solid ${P.surface}` }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: P.ink, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {user.fullName?.split(' ')[0] || 'User'} <ChevronDown size={14} color={P.inkMute} />
                  </div>
                </div>
              </motion.div>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                      background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
                      borderRadius: P.radiusSm, border: `1px solid ${P.border}`,
                      boxShadow: P.shadowHover, width: 200, zIndex: 100, overflow: 'hidden', padding: 8
                    }}
                  >
                    <div style={{ padding: '8px 12px', borderBottom: `1px solid ${P.border}`, marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: P.ink }}>{user.fullName || 'User Name'}</div>
                      <div style={{ fontSize: 12, color: P.inkMute, fontWeight: 500 }}>{user.email || 'user@example.com'}</div>
                    </div>
                    {[
                      { icon: User, label: 'My Profile', action: () => onTabChange('Profile') },
                      { icon: Settings, label: 'Settings', action: () => onTabChange('Settings') },
                      { icon: LogOut, label: 'Sign Out', action: triggerSignOut, color: P.red }
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ background: item.color ? 'rgba(255,92,138,0.08)' : 'rgba(91,92,255,0.05)' }}
                        onClick={() => { item.action(); setIsDropdownOpen(false); }}
                        style={{ padding: '10px 12px', borderRadius: 8, fontSize: 13.5, fontWeight: 600, color: item.color || P.inkSoft, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                      >
                        <item.icon size={16} /> {item.label}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main style={{ flex: 1, minHeight: 0 }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mbk-sidebar-desktop { display: none !important; }
          .mbk-hamburger { display: block !important; }
        }
      `}</style>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 10000, 
              background: 'rgba(11, 16, 40, 0.4)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              style={{
                background: '#fff', borderRadius: P.radius, padding: 32,
                width: '100%', maxWidth: 400, boxShadow: P.shadowHover,
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
              }}
            >
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,92,138,0.1)', color: P.red, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <LogOut size={32} />
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 900, color: P.ink, fontFamily: P.font }}>Ready to leave?</h3>
              <p style={{ margin: '0 0 24px', fontSize: 15, color: P.inkSoft, lineHeight: 1.5 }}>
                You are about to securely log out of your MBK LMS session. Are you sure?
              </p>
              <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  style={{ flex: 1, background: '#f1f5f9', border: 'none', padding: '12px', borderRadius: P.radiusSm, color: P.ink, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => { setShowLogoutConfirm(false); onSignOut(); }}
                  style={{ flex: 1, background: P.red, border: 'none', padding: '12px', borderRadius: P.radiusSm, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,92,138,0.3)' }}
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Photo Lightbox Viewer */}
      <AnimatePresence>
        {showPhotoViewer && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setShowPhotoViewer(false)}
            style={{ 
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
              background: 'rgba(11, 16, 40, 0.85)', backdropFilter: 'blur(20px)', 
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
              zIndex: 9999, cursor: 'zoom-out' 
            }}
          >
            {/* Animated glowing backplate */}
            <motion.div
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.8}
              whileDrag={{ scale: 1.03, cursor: 'grabbing' }}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'grab' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Radial gradient glow behind the photo */}
              <div style={{
                position: 'absolute', inset: -40,
                background: `radial-gradient(circle, ${P.primary}44 0%, ${P.secondary}22 50%, transparent 100%)`,
                filter: 'blur(50px)', zIndex: 0, pointerEvents: 'none'
              }} />

              {/* Main image container */}
              <div style={{
                position: 'relative', zIndex: 1,
                padding: 12, background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 32, boxShadow: '0 30px 70px rgba(0,0,0,0.4)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16
              }}>
                <img 
                  src={user.profilePhoto || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&h=500&fit=crop'} 
                  alt="Profile Full View" 
                  style={{ 
                    maxWidth: '80vw', maxHeight: '65vh', 
                    borderRadius: 22, objectFit: 'contain',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                  }} 
                />
                
                {/* Floating User Info Plate */}
                <div style={{
                  padding: '14px 28px', background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 20, width: 'calc(100% - 56px)', textAlign: 'center',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
                  marginBottom: 4
                }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: '-0.3px', fontFamily: P.font }}>
                    {user.fullName || 'User Profile'}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 800, marginTop: 4, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {user.role || 'Member'}
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPhotoViewer(false)}
                style={{
                  marginTop: 24, width: 44, height: 44, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', backdropFilter: 'blur(10px)', zIndex: 2, transition: 'border-color 0.2s'
                }}
              >
                ✕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
