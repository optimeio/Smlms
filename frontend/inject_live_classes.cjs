const fs = require('fs');

// 1. Update StudentSidebar.jsx
let sidebarC = fs.readFileSync('src/components/StudentSidebar.jsx', 'utf-8');
if (!sidebarC.includes("{ name: 'Live Classes'")) {
  sidebarC = sidebarC.replace(
    "{ name: 'My Courses', icon: BookOpen },",
    "{ name: 'My Courses', icon: BookOpen },\n    { name: 'Live Classes', icon: MonitorPlay },"
  );
  fs.writeFileSync('src/components/StudentSidebar.jsx', sidebarC);
}

// 2. Add Live Classes UI to Dashboard.jsx
let dashboardC = fs.readFileSync('src/pages/Dashboard.jsx', 'utf-8');

const liveClassesUI = `
  const renderLiveClassesView = () => {
    const upcomingClasses = [
      { id: 1, title: 'React Performance Optimization', instructor: 'Dan Abramov', time: 'Today, 2:00 PM', duration: '1h 30m', type: 'Live', attendees: 145 },
      { id: 2, title: 'Advanced State Management', instructor: 'Kent C. Dodds', time: 'Tomorrow, 10:00 AM', duration: '2h', type: 'Upcoming', attendees: 89 },
      { id: 3, title: 'CSS Grid & Flexbox Mastery', instructor: 'Josh Comeau', time: 'Jul 10, 4:00 PM', duration: '1h', type: 'Upcoming', attendees: 210 }
    ];

    const pastClasses = [
      { id: 4, title: 'Intro to Next.js App Router', instructor: 'Lee Robinson', time: 'Yesterday', duration: '1h 45m', type: 'Recorded', views: 1205 },
      { id: 5, title: 'TypeScript Fundamentals', instructor: 'Matt Pocock', time: 'Jul 5', duration: '2h 15m', type: 'Recorded', views: 890 }
    ];

    return (
      <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
        <div 
          className="relative rounded-2xl overflow-hidden shadow-sm border border-[#E7E9F5] bg-white p-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F5E7B]/10 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Live Now
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Fullstack System Design Architecture</h2>
              <p className="text-slate-500 text-sm mb-4">Learn how to architect scalable applications from scratch with live Q&A.</p>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1"><span className="text-lg">👨‍🏫</span> Instructor: Sarah Drasner</div>
                <div className="flex items-center gap-1"><span className="text-lg">⏱️</span> Started 15 mins ago</div>
                <div className="flex items-center gap-1"><span className="text-lg">👥</span> 342 Watching</div>
              </div>
            </div>
            <button className="px-6 py-3 bg-[#0F5E7B] hover:bg-[#0B4A62] text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-[#0F5E7B]/20 shrink-0">
              Join Classroom
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Classes */}
          <div className="border border-[#E7E9F5] rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              📅 Upcoming Sessions
            </h3>
            <div className="flex flex-col gap-3">
              {upcomingClasses.map(cls => (
                <div key={cls.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-[#0F5E7B]/30 hover:bg-[#0F5E7B]/5 transition-colors flex items-center justify-between group cursor-pointer">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">{cls.title}</h4>
                    <div className="flex gap-3 text-xs text-slate-500 font-medium">
                      <span>{cls.time}</span>
                      <span>•</span>
                      <span>{cls.instructor}</span>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white border border-[#0F5E7B] text-[#0F5E7B] text-xs font-bold rounded-lg transition-all">
                    RSVP
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recorded Classes */}
          <div className="border border-[#E7E9F5] rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              📼 Recent Recordings
            </h3>
            <div className="flex flex-col gap-3">
              {pastClasses.map(cls => (
                <div key={cls.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-[#0F5E7B]/30 hover:bg-[#0F5E7B]/5 transition-colors flex items-center justify-between group cursor-pointer">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">{cls.title}</h4>
                    <div className="flex gap-3 text-xs text-slate-500 font-medium">
                      <span>{cls.time}</span>
                      <span>•</span>
                      <span>{cls.views} views</span>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all">
                    Watch Replay
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
`;

if (!dashboardC.includes('const renderLiveClassesView = () => {')) {
  let renderContentIdx = dashboardC.indexOf('const renderStudentContent = () => {');
  dashboardC = dashboardC.substring(0, renderContentIdx) + liveClassesUI + '\n  ' + dashboardC.substring(renderContentIdx);
}

if (!dashboardC.includes("case 'Live Classes':")) {
  let profileCaseIdx = dashboardC.indexOf("case 'Profile':");
  dashboardC = dashboardC.substring(0, profileCaseIdx) + "case 'Live Classes':\n        return renderLiveClassesView();\n\n      " + dashboardC.substring(profileCaseIdx);
}

fs.writeFileSync('src/pages/Dashboard.jsx', dashboardC);
console.log('Live Classes injected successfully.');
