const fs = require('fs');

let c = fs.readFileSync('src/pages/Dashboard.jsx', 'utf-8');
const rep = fs.readFileSync('replacement.jsx', 'utf-8');

// 1. Add states
c = c.replace(
  "const [activeSidebarTab, setActiveSidebarTab] = useState('Dashboard');",
  "const [activeSidebarTab, setActiveSidebarTab] = useState('Dashboard');\n  const [isEditingProfile, setIsEditingProfile] = useState(false);\n  const [editProfileData, setEditProfileData] = useState({});\n  const handleProfileSave = (e) => { e.preventDefault(); setIsEditingProfile(false); };"
);

// 2. Add renderStudentProfileView BEFORE renderStudentContent
let renderContentIdx = c.indexOf('const renderStudentContent = () => {');
if (renderContentIdx !== -1) {
  c = c.substring(0, renderContentIdx) + rep + '\n\n  ' + c.substring(renderContentIdx);
}

// 3. Add case Profile INSIDE renderStudentContent
renderContentIdx = c.indexOf('const renderStudentContent = () => {'); // Find again since it moved
if (renderContentIdx !== -1) {
  let switchIdx = c.indexOf('switch (activeSidebarTab) {', renderContentIdx);
  if (switchIdx !== -1) {
    c = c.substring(0, switchIdx + 27) + "\n      case 'Profile':\n        return renderStudentProfileView();" + c.substring(switchIdx + 27);
  }
}

// 4. Fix liveClasses and image upload
c = c.replace(/hasLiveClassToday=\{liveClasses\?\.length > 0\}/g, 'hasLiveClassToday={false}');
c = c.replace(/onChange=\{handleImageUpload\}/g, 'onChange={() => {}}');

fs.writeFileSync('src/pages/Dashboard.jsx', c);
console.log('Final inject done!');
