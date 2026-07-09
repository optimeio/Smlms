const fs = require('fs');

let c = fs.readFileSync('src/pages/Dashboard.jsx', 'utf-8');

// The duplicate case was injected by my script doing:
// case 'Profile':
//   return renderStudentProfileView();
// followed closely by another `case 'Profile':`

const badPattern = /case 'Profile':\s*return renderStudentProfileView\(\);\s*case 'Profile':/g;
if (badPattern.test(c)) {
  c = c.replace(badPattern, "case 'Profile':\n        return renderStudentProfileView();");
} else {
  // If my script instead injected it before default:
  const badPattern2 = /case 'Profile':\s*return renderStudentProfileView\(\);\s*default:/g;
  if (badPattern2.test(c)) {
     // Wait, if it's duplicate, it means 'case Profile' was already in the switch.
     // Let's just find the switch and clean it.
     let idx = c.indexOf('const renderStudentContent = () => {');
     if (idx !== -1) {
       let endIdx = c.indexOf('const renderContent = () => {', idx);
       let sub = c.substring(idx, endIdx);
       // Just replace all `case 'Profile':` and their returns with nothing, 
       // then add one correct `case 'Profile': return renderStudentProfileView();` before default:
       sub = sub.replace(/case 'Profile':[\s\S]*?(?=case|default)/g, '');
       sub = sub.replace('default:', "case 'Profile':\n        return renderStudentProfileView();\n      default:");
       c = c.substring(0, idx) + sub + c.substring(endIdx);
     }
  }
}

fs.writeFileSync('src/pages/Dashboard.jsx', c);
console.log('Fixed duplicates!');
