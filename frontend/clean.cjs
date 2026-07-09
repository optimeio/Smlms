const fs = require('fs');
let c = fs.readFileSync('src/pages/Dashboard.jsx', 'utf-8');
let idx = c.indexOf('return renderMessagesView();');
if (idx !== -1) {
  let endIdx = c.indexOf("case 'Settings':", idx);
  if (endIdx !== -1) {
    c = c.substring(0, idx + 28) + '\n\n      ' + c.substring(endIdx);
    fs.writeFileSync('src/pages/Dashboard.jsx', c);
    console.log('Cleaned up old inline profile block');
  }
}
