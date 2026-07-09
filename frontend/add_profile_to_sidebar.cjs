const fs = require('fs');
let content = fs.readFileSync('src/components/StudentSidebar.jsx', 'utf-8');
content = content.replace(/{ type: 'label', name: 'ACCOUNT' },/g, "{ type: 'label', name: 'ACCOUNT' },\n    { name: 'Profile', icon: UserCircle2 },");
fs.writeFileSync('src/components/StudentSidebar.jsx', content);
console.log('Re-added Profile to StudentSidebar.jsx');
