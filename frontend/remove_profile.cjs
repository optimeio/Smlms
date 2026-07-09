const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.jsx', 'utf-8');

// 1. Remove Profile from Sidebar Items
content = content.replace(/\{\s*name:\s*'Profile',\s*icon:[\s\S]*?<\/svg>\s*\},?\n?/g, '');

// 2. Remove case 'Profile': return renderProfileView();
content = content.replace(/case\s+'Profile':\s*return\s+renderProfileView\(\);\s*/g, '');

// 3. Remove clickable Profile Header Logic
content = content.replace(/onClick=\{\(\)\s*=>\s*setActiveSidebarTab\('Profile'\)\}/g, '');
content = content.replace(/title="View Profile"/g, '');
content = content.replace(/cursor-pointer pl-4/g, 'pl-4');

// 4. We can safely remove the function renderStudentProfileView
let lines = content.split('\n');
let s1 = lines.findIndex(l => l.includes('const renderStudentProfileView = () => {'));
let e1 = lines.findIndex(l => l.includes('const renderLiveClassesView = () => {'));

if (s1 !== -1 && e1 !== -1 && e1 > s1) {
  lines.splice(s1, e1 - s1);
  content = lines.join('\n');
  console.log('Removed renderStudentProfileView!');
} else {
  console.log('Could not find renderStudentProfileView properly', s1, e1);
}

fs.writeFileSync('src/pages/Dashboard.jsx', content);
console.log('Done!');
