const http = require('http');

const endpoints = [
  '/api/skills',
  '/api/skills/leaderboard',
  '/api/attendance?studentId=std-101',
  '/api/discipline/std-101',
  '/api/projects',
  '/api/batches',
  '/api/lab-equipment',
  '/api/internships',
  '/api/placement/matching',
  '/api/certificates/verify/MBK-101-PASS'
];

async function checkEndpoint(path) {
  return new Promise((resolve) => {
    http.get(`http://127.0.0.1:5001${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`[PASS] ${res.statusCode} ${path} -> success: ${json.success}`);
          resolve(true);
        } catch (e) {
          console.log(`[FAIL] ${res.statusCode} ${path} -> non-json response`);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.log(`[ERROR] ${path} -> ${err.message}`);
      resolve(false);
    });
  });
}

async function run() {
  console.log('Testing MBK SkillOS Endpoints...\n');
  for (const ep of endpoints) {
    await checkEndpoint(ep);
  }
}

run();
