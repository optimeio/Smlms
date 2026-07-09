const fs = require('fs');

let dashboard = fs.readFileSync('src/pages/Dashboard.jsx', 'utf-8');
const replacement = fs.readFileSync('replacement.jsx', 'utf-8');

// 1. Add states if not present
if (!dashboard.includes('const [isEditingProfile')) {
  dashboard = dashboard.replace(
    "const [activeSidebarTab, setActiveSidebarTab] = useState('Dashboard');",
    "const [activeSidebarTab, setActiveSidebarTab] = useState('Dashboard');\n  const [isEditingProfile, setIsEditingProfile] = useState(false);\n  const [editProfileData, setEditProfileData] = useState({});\n  const handleProfileSave = (e) => { e.preventDefault(); setIsEditingProfile(false); };"
  );
}

// 2. Add renderStudentProfileView if not present
if (!dashboard.includes('const renderStudentProfileView = () => {')) {
  dashboard = dashboard.replace(
    "const renderStudentContent = () => {",
    replacement + "\n\n  const renderStudentContent = () => {"
  );
}

// 3. Add case 'Profile' if not present
if (!dashboard.includes("case 'Profile':")) {
  dashboard = dashboard.replace(
    "switch (activeSidebarTab) {",
    "switch (activeSidebarTab) {\n      case 'Profile':\n        return renderStudentProfileView();"
  );
}

fs.writeFileSync('src/pages/Dashboard.jsx', dashboard);
console.log('Fully injected profile view properly!');
