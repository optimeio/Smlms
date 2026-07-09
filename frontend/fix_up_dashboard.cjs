const fs = require('fs');
let c = fs.readFileSync('src/pages/Dashboard.jsx', 'utf-8');
if (!c.includes("case 'Profile':")) {
  let idx = c.indexOf('switch (activeSidebarTab) {');
  if (idx !== -1) {
    c = c.substring(0, idx + 27) + "\n      case 'Profile':\n        return renderStudentProfileView();" + c.substring(idx + 27);
  }
}
c = c.replace(/hasLiveClassToday=\{liveClasses\?\.length > 0\}/g, 'hasLiveClassToday={false}');
c = c.replace(/onChange=\{handleImageUpload\}/g, 'onChange={() => {}}');
fs.writeFileSync('src/pages/Dashboard.jsx', c);
console.log('Fixed up Dashboard!');
