const fs = require('fs');

let dashboardContent = fs.readFileSync('src/pages/Dashboard.jsx', 'utf-8');
let lines = dashboardContent.split('\n');

let s1 = lines.findIndex(l => l.includes('const renderStudentProfileView = () => {'));
if (s1 !== -1) {
  // find the next `  const render` function
  let e1 = lines.findIndex((l, i) => i > s1 && l.includes('  const render') && l.includes(' = () => {'));
  if (e1 !== -1) {
    console.log(`Removing from line ${s1} to ${e1}`);
    lines.splice(s1, e1 - s1);
    fs.writeFileSync('src/pages/Dashboard.jsx', lines.join('\n'));
    console.log('Successfully removed renderStudentProfileView!');
  } else {
    console.log('Could not find next render function.');
  }
} else {
  console.log('renderStudentProfileView not found.');
}
