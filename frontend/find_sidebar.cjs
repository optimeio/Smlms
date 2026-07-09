const fs = require('fs');
let c = fs.readFileSync('src/pages/Dashboard.jsx', 'utf-8');
let lines = c.split('\n');
let idx = lines.findIndex(l => l.includes('w-64'));
if(idx !== -1) console.log(lines.slice(idx - 2, idx + 10).join('\n'));
