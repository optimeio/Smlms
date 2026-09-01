const http = require('http');

const data = JSON.stringify({
  title: 'Test Course 2',
  syllabus: 'Test Syllabus',
  image: '',
  price: '1000',
  originalPrice: '',
  companyName: 'Test Company',
  startDate: null
});

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/company-courses',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
