const fs = require('fs');

// 1. Remove from StudentSidebar.jsx
let sidebarContent = fs.readFileSync('src/components/StudentSidebar.jsx', 'utf-8');
const profileLineRegex = /\s*\{\s*name:\s*'Profile',\s*icon:\s*UserCircle2\s*\},?\n?/g;
sidebarContent = sidebarContent.replace(profileLineRegex, '\n');
fs.writeFileSync('src/components/StudentSidebar.jsx', sidebarContent);
console.log('Removed from StudentSidebar.jsx');

// 2. Remove from Dashboard.jsx
let dashboardContent = fs.readFileSync('src/pages/Dashboard.jsx', 'utf-8');

// Remove the case 'Profile'
const caseProfileRegex = /\s*case 'Profile':\s*if\s*\(user\.role === 'student'\)\s*return\s*renderStudentProfileView\(\);\s*return\s*<div.*?<\/div>;\n?/g;
dashboardContent = dashboardContent.replace(caseProfileRegex, '\n');

// Remove renderStudentProfileView function
let lines = dashboardContent.split('\n');
let s1 = lines.findIndex(l => l.includes('const renderStudentProfileView = () => {'));

if (s1 !== -1) {
  // Find the end of it by looking for the next function, e.g., const renderContent = () => {
  let e1 = lines.findIndex((l, i) => i > s1 && l.includes('const renderContent = () => {'));
  if (e1 !== -1) {
    // Remove from s1 up to e1 (excluding e1)
    lines.splice(s1, e1 - s1);
    dashboardContent = lines.join('\n');
    console.log('Removed renderStudentProfileView from Dashboard!');
  } else {
    console.log('Could not find end of renderStudentProfileView');
  }
}

fs.writeFileSync('src/pages/Dashboard.jsx', dashboardContent);
console.log('Done reverting!');
