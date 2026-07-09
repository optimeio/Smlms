const fs = require('fs');

let sidebarContent = fs.readFileSync('src/components/StudentSidebar.jsx', 'utf-8');
const profileLineRegex = /\s*\{\s*name:\s*'Profile',\s*icon:\s*UserCircle2\s*\},?\n?/g;
sidebarContent = sidebarContent.replace(profileLineRegex, '\n');
fs.writeFileSync('src/components/StudentSidebar.jsx', sidebarContent);
console.log('Removed Profile from StudentSidebar.jsx');
