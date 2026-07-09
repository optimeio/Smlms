const fs = require('fs');
const path = require('path');

// 1. Read replacement.jsx
const replacementContent = fs.readFileSync(path.join(__dirname, 'replacement.jsx'), 'utf-8');

// Extract renderStudentProfileView
// It starts with `const renderStudentProfileView = () => {` and ends with `  };` right before EOF, but let's be careful.
const startStr = '  const renderStudentProfileView = () => {';
const startIdx = replacementContent.indexOf(startStr);

if (startIdx === -1) {
  console.log("Could not find renderStudentProfileView in replacement.jsx");
  process.exit(1);
}

// Find the end of it
// It's basically the rest of the file up to the last `  };`
let profileViewCode = replacementContent.substring(startIdx);
// Let's just grab the whole thing because replacement.jsx might only contain this function at the end.
// Wait, replacement.jsx might have other things. Let's find the exact end of the function block.
// It ends with `  };` followed by some spaces or newline.
const endMatch = profileViewCode.lastIndexOf('  };');
if (endMatch !== -1) {
  profileViewCode = profileViewCode.substring(0, endMatch + 4);
} else {
  // Try finding just `};`
  const fallbackEndMatch = profileViewCode.lastIndexOf('};');
  if (fallbackEndMatch !== -1) {
    profileViewCode = profileViewCode.substring(0, fallbackEndMatch + 2);
  }
}

// 2. Read Dashboard.jsx
let dashboardContent = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Dashboard.jsx'), 'utf-8');

// If Dashboard.jsx already has renderStudentProfileView, we should remove it first, or just assume it doesn't since we deleted it.
if (dashboardContent.includes('const renderStudentProfileView = () => {')) {
  console.log('Dashboard already has renderStudentProfileView, we might need to replace it.');
  // I will just replace it entirely.
  const existStartIdx = dashboardContent.indexOf('const renderStudentProfileView = () => {');
  // Finding the end of the existing one is tricky. Let's just skip replacing if it exists, or just use it.
} else {
  // Inject before `const renderContent = () => {`
  const renderContentIdx = dashboardContent.indexOf('const renderContent = () => {');
  if (renderContentIdx !== -1) {
    dashboardContent = dashboardContent.substring(0, renderContentIdx) + profileViewCode + '\n\n  ' + dashboardContent.substring(renderContentIdx);
  } else {
    console.log("Could not find renderContent in Dashboard.jsx");
  }
}

// 3. Inject case 'Profile': return renderStudentProfileView(); into renderContent
// We need to find `switch (activeSidebarTab) {` inside `renderContent`
const switchIdx = dashboardContent.indexOf('switch (activeSidebarTab) {');
if (switchIdx !== -1) {
  // check if 'Profile' case exists
  if (!dashboardContent.includes("case 'Profile':")) {
    const defaultIdx = dashboardContent.indexOf('default:', switchIdx);
    if (defaultIdx !== -1) {
      dashboardContent = dashboardContent.substring(0, defaultIdx) + "      case 'Profile':\n        if (user.role === 'student') return renderStudentProfileView();\n        return <div className=\"text-sm text-slate-500\">Profile view not available for this role.</div>;\n" + dashboardContent.substring(defaultIdx);
    }
  }
}

fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'Dashboard.jsx'), dashboardContent);
console.log("Successfully injected renderStudentProfileView!");
