const { execSync } = require('child_process');
try {
  let c = execSync('git show main:src/pages/Dashboard.jsx').toString();
  let cases = [...c.matchAll(/case '(.*?)':/g)]; 
  console.log(cases.map(m => m[1]).join(', '));
} catch(e) {
  console.log('Error', e.message);
}
