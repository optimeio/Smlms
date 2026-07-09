const fs = require('fs');
let c = fs.readFileSync('src/pages/Dashboard.jsx', 'utf-8');
let startIdx = c.indexOf('const renderStudentContent = () => {');
let endIdx = c.indexOf('const renderTrainerContent = () => {');
let section = c.substring(startIdx, endIdx);
let cases = [...section.matchAll(/case '(.*?)':/g)];
console.log('Student Cases:', cases.map(m => m[1]).join(', '));
