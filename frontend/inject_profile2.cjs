const fs = require('fs');
const path = require('path');

// 1. Read replacement.jsx
const replacementContent = fs.readFileSync(path.join(__dirname, 'replacement.jsx'), 'utf-8');

const startStr = '  const renderStudentProfileView = () => {';
const startIdx = replacementContent.indexOf(startStr);

let profileViewCode = replacementContent.substring(startIdx);
const endMatch = profileViewCode.lastIndexOf('  };');
if (endMatch !== -1) {
  profileViewCode = profileViewCode.substring(0, endMatch + 4);
} else {
  const fallbackEndMatch = profileViewCode.lastIndexOf('};');
  if (fallbackEndMatch !== -1) {
    profileViewCode = profileViewCode.substring(0, fallbackEndMatch + 2);
  }
}

// 2. Read Dashboard.jsx
let dashboardContent = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Dashboard.jsx'), 'utf-8');

if (!dashboardContent.includes('const renderStudentProfileView = () => {')) {
  // Inject before `const renderStudentContent = () => {`
  const renderContentIdx = dashboardContent.indexOf('const renderStudentContent = () => {');
  if (renderContentIdx !== -1) {
    dashboardContent = dashboardContent.substring(0, renderContentIdx) + profileViewCode + '\n\n  ' + dashboardContent.substring(renderContentIdx);
  } else {
    console.log("Could not find renderStudentContent in Dashboard.jsx");
  }
} else {
  console.log("Dashboard already has renderStudentProfileView");
}

// 3. Inject case 'Profile': return renderStudentProfileView(); into renderStudentContent
const renderStudentContentIdx = dashboardContent.indexOf('const renderStudentContent = () => {');
if (renderStudentContentIdx !== -1) {
  const switchIdx = dashboardContent.indexOf('switch (activeSidebarTab) {', renderStudentContentIdx);
  if (switchIdx !== -1) {
    if (!dashboardContent.includes("case 'Profile':\n        return renderStudentProfileView();")) {
      const defaultIdx = dashboardContent.indexOf('default:', switchIdx);
      if (defaultIdx !== -1) {
        dashboardContent = dashboardContent.substring(0, defaultIdx) + "      case 'Profile':\n        return renderStudentProfileView();\n" + dashboardContent.substring(defaultIdx);
      }
    }
  }
}

fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'Dashboard.jsx'), dashboardContent);
console.log("Successfully injected renderStudentProfileView!");
