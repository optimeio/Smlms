const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.jsx', 'utf-8');
let lines = content.split('\n');

if (!content.includes('import StudentSidebar')) {
  // Inject import at top
  const firstImportIdx = lines.findIndex(l => l.startsWith('import '));
  if (firstImportIdx !== -1) {
    lines.splice(firstImportIdx, 0, "import StudentSidebar from '../components/StudentSidebar';");
  }
}

// Find return inside the component Dashboard.
const dashboardIdx = lines.findIndex(l => l.includes('export default function Dashboard'));
let returnIdx = -1;
if(dashboardIdx !== -1) {
  for(let i = dashboardIdx; i < lines.length; i++) {
    if(lines[i].trim() === 'return (') {
      returnIdx = i;
      // Make sure it's the right one (has admin-layout-wrapper after it)
      if (lines[i+1].includes('admin-layout-wrapper') || lines[i+2].includes('admin-layout-wrapper')) {
        break;
      }
    }
  }
}

const rightMainPanelIdx = lines.findIndex((l, i) => i > returnIdx && l.includes('{/* RIGHT MAIN PANEL */}'));

if (returnIdx !== -1 && rightMainPanelIdx !== -1) {
  const injection = `  return (
    <div className="admin-layout-wrapper" style={{ paddingLeft: user.role === 'student' ? (window.innerWidth > 1024 ? '280px' : '0') : undefined }}>
      {user.role === 'student' ? (
        <StudentSidebar 
          user={user}
          activeTab={activeSidebarTab}
          setActiveTab={setActiveSidebarTab}
          handleSignOut={handleSignOut}
          assignmentsCount={user.assignments?.length || 0}
          hasLiveClassToday={liveClasses?.length > 0}
          isMobileOpen={isMobileMenuOpen}
          setIsMobileOpen={setIsMobileMenuOpen}
        />
      ) : (
        <>
          {/* MOBILE DRAWER SIDEBAR */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 z-50 bg-slate-900/60 lg:hidden flex transition-opacity duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <aside 
                className="w-[280px] h-full p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 transform translate-x-0"
                style={{ backgroundColor: '#FFFFFF' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src="/logo.png" alt="MBK Technology Logo" className="h-12 w-12 object-contain" />
                      <div className="lms-logo-text">
                        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#4C5FD5', fontFamily: "'Inter', sans-serif", lineHeight: 1.1 }}>MBK</h2>
                        <p style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontWeight: 800, margin: '2px 0 0 0', letterSpacing: '1.2px', fontFamily: "'Inter', sans-serif" }}>CarrierZ</p>
                      </div>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-655 text-2xl bg-transparent border-0 cursor-pointer">✕</button>
                  </div>

                  <nav className="admin-menu-list">
                    {getSidebarItems().filter(item => item.name !== 'Logout' && item.name !== 'Settings').map((item) => (
                      <div
                        key={item.name}
                        onClick={() => { setActiveSidebarTab(item.name); setIsMobileMenuOpen(false); }}
                        className={\`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer text-sm font-semibold transition-all duration-250 \${activeSidebarTab === item.name ? 'text-white font-bold' : 'text-slate-500 hover:bg-[#F3F5FF] hover:text-[#4C5FD5]'}\`}
                        style={{ backgroundColor: activeSidebarTab === item.name ? '#4C5FD5' : 'transparent' }}
                      >
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                    ))}
                    
                    {getSidebarItems().filter(item => item.name === 'Logout' || item.name === 'Settings').map((item) => (
                      <div
                        key={item.name}
                        onClick={() => { if (item.action) { item.action(); } else { setActiveSidebarTab(item.name); setIsMobileMenuOpen(false); } }}
                        className={\`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer text-sm font-semibold transition-all duration-250 \${activeSidebarTab === item.name ? 'text-white font-bold' : (item.name === 'Logout' ? 'text-rose-500 hover:bg-rose-50' : 'text-slate-500 hover:bg-[#F3F5FF] hover:text-[#4C5FD5]')}\`}
                        style={{ backgroundColor: activeSidebarTab === item.name ? '#4C5FD5' : 'transparent' }}
                      >
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </nav>
                </div>
                <div className="text-xs text-slate-400 pt-4 border-t border-slate-100">© 2026 MBK CarrierZ</div>
              </aside>
            </div>
          )}

          {/* DESKTOP SIDEBAR */}
          <aside className="admin-sidebar" style={{ overflowY: 'auto' }}>
            <div>
              <div className="admin-logo-area">
                <img src="/logo.png" alt="MBK Technology Logo" />
                <div>
                  <h2>MBK Tech</h2>
                  <span>LMS System</span>
                </div>
              </div>

              <nav className="admin-menu-list">
                {getSidebarItems().filter(item => item.name !== 'Logout' && item.name !== 'Settings').map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveSidebarTab(item.name)}
                    className={\`admin-menu-item \${activeSidebarTab === item.name ? 'active' : ''}\`}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                ))}

                {getSidebarItems().filter(item => item.name === 'Logout' || item.name === 'Settings').map((item) => (
                  <button
                    key={item.name}
                    onClick={() => { if (item.action) { item.action(); } else { setActiveSidebarTab(item.name); } }}
                    className={\`admin-menu-item \${item.name === 'Logout' ? 'admin-signout-btn' : ''} \${activeSidebarTab === item.name ? 'active' : ''}\`}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        </>
      )}`;

  lines.splice(returnIdx, rightMainPanelIdx - returnIdx, injection);
  
  let resultContent = lines.join('\n');
  resultContent = resultContent.replace(
    '<div className="admin-main-content">',
    '<div className="admin-main-content" style={user.role === "student" ? { marginLeft: 0 } : {}}>'
  );

  fs.writeFileSync('src/pages/Dashboard.jsx', resultContent);
  console.log('Success!');
} else {
  console.log('Could not find indices', returnIdx, rightMainPanelIdx);
}
