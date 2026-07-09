const fs = require('fs');

let dashboard = fs.readFileSync('src/pages/Dashboard.jsx', 'utf-8');
let replacement = fs.readFileSync('replacement.jsx', 'utf-8');

// The replacement starts with `const renderStudentProfileView = () => {`
// Let's rename it to match the existing one `const renderProfileView = () => {`
replacement = replacement.replace('const renderStudentProfileView = () => {', 'const renderProfileView = () => {');

// The existing one in Dashboard starts with `const renderProfileView = () => {`
// and ends somewhere before the next render function. Let's find it.
const startIdx = dashboard.indexOf('const renderProfileView = () => {');
if (startIdx !== -1) {
  const nextRenderIdx = dashboard.indexOf('const renderSettingsView = () => {', startIdx);
  if (nextRenderIdx !== -1) {
    dashboard = dashboard.substring(0, startIdx) + replacement + '\n\n  ' + dashboard.substring(nextRenderIdx);
    fs.writeFileSync('src/pages/Dashboard.jsx', dashboard);
    console.log('Swapped Profile View!');
  } else {
    console.log('Could not find next render function');
  }
} else {
  console.log('Could not find renderProfileView');
}
