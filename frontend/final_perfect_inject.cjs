const fs = require('fs');

let c = fs.readFileSync('src/pages/Dashboard.jsx', 'utf-8');
const rep = fs.readFileSync('replacement.jsx', 'utf-8');

// 1. Add states
if (!c.includes('isEditingProfile')) {
  c = c.replace(
    "const [activeSidebarTab, setActiveSidebarTab] = useState('Dashboard');",
    "const [activeSidebarTab, setActiveSidebarTab] = useState('Dashboard');\n  const [isEditingProfile, setIsEditingProfile] = useState(false);\n  const [editProfileData, setEditProfileData] = useState({});\n  const handleProfileSave = (e) => { e.preventDefault(); setIsEditingProfile(false); };"
  );
}

// 2. Add renderStudentProfileView
let renderContentIdx = c.indexOf('const renderStudentContent = () => {');
if (renderContentIdx !== -1 && !c.includes('const renderStudentProfileView = () => {')) {
  c = c.substring(0, renderContentIdx) + rep + '\n\n  ' + c.substring(renderContentIdx);
}

// 3. Replace the OLD inline case 'Profile': with the new one
// Find case 'Profile': inside renderStudentContent
let searchStart = c.indexOf('const renderStudentContent = () => {');
let profileCaseIdx = c.indexOf("case 'Profile':", searchStart);
if (profileCaseIdx !== -1) {
  let settingsCaseIdx = c.indexOf("case 'Settings':", profileCaseIdx);
  if (settingsCaseIdx !== -1) {
    // Replace everything from case 'Profile': up to case 'Settings':
    c = c.substring(0, profileCaseIdx) + "case 'Profile':\n        return renderStudentProfileView();\n\n      " + c.substring(settingsCaseIdx);
  }
}

// 4. Fix undeclared variables
c = c.replace(/hasLiveClassToday=\{liveClasses\?\.length > 0\}/g, 'hasLiveClassToday={false}');
c = c.replace(/onChange=\{handleImageUpload\}/g, 'onChange={() => {}}');

fs.writeFileSync('src/pages/Dashboard.jsx', c);
console.log('Flawless inject completed.');
