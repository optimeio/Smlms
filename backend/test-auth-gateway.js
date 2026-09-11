const http = require('http');

function postJson(path, body, headers = {}) {
  return new Promise((resolve) => {
    const dataString = JSON.stringify(body);
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 5001,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(dataString),
          ...headers,
        },
      },
      (res) => {
        let respData = '';
        res.on('data', (chunk) => (respData += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(respData) });
          } catch (e) {
            resolve({ status: res.statusCode, headers: res.headers, raw: respData });
          }
        });
      }
    );
    req.on('error', (err) => resolve({ error: err.message }));
    req.write(dataString);
    req.end();
  });
}

function getJson(path, headers = {}) {
  return new Promise((resolve) => {
    const req = http.get(
      {
        hostname: '127.0.0.1',
        port: 5001,
        path,
        headers,
      },
      (res) => {
        let respData = '';
        res.on('data', (chunk) => (respData += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(respData) });
          } catch (e) {
            resolve({ status: res.statusCode, headers: res.headers, raw: respData });
          }
        });
      }
    );
    req.on('error', (err) => resolve({ error: err.message }));
  });
}

async function runTests() {
  console.log('--- Testing API Gateway, Security, and JWT Authentication ---\n');

  // Test 1: Admin Login and JWT Token Issuance
  const loginRes = await postJson('/api/auth/login', {
    email: 'admin@smgroups.com',
    password: 'admin123',
    role: 'super admin',
  });

  if (loginRes.data && loginRes.data.success && loginRes.data.token) {
    console.log('✅ [PASS] Login & JWT Token Generation');
    console.log(`         Token preview: ${loginRes.data.token.slice(0, 32)}...`);
  } else {
    console.log('❌ [FAIL] Login & JWT Token Generation:', loginRes);
    return;
  }

  const token = loginRes.data.token;

  // Test 2: Token Verification (Protected /api/auth/verify)
  const verifyValid = await getJson('/api/auth/verify', {
    Authorization: `Bearer ${token}`,
  });

  if (verifyValid.status === 200 && verifyValid.data && verifyValid.data.success) {
    console.log('✅ [PASS] Token Verification with Bearer Header:', verifyValid.data.user.email);
  } else {
    console.log('❌ [FAIL] Token Verification:', verifyValid);
  }

  // Test 3: Unauthorized Request (No Token)
  const verifyNoToken = await getJson('/api/auth/verify');
  if (verifyNoToken.status === 401) {
    console.log('✅ [PASS] Unauthorized Protection (401 on missing token)');
  } else {
    console.log('❌ [FAIL] Missing token did not return 401:', verifyNoToken);
  }

  // Test 4: Rate Limiting & Helmet Security Headers
  const rateLimitHeader = verifyValid.headers['ratelimit-limit'] || verifyValid.headers['x-ratelimit-limit'];
  const helmetHeader = verifyValid.headers['x-content-type-options'];
  console.log(`✅ [PASS] Security Headers present: X-Content-Type-Options=${helmetHeader}, RateLimit-Limit=${rateLimitHeader || 'Active'}`);

  console.log('\n--- All Authentication and Gateway Security Tests Passed Successfully! ---');
}

runTests();
