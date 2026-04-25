const http = require('http');

const data = JSON.stringify({
    email: 'newtest@example.com',
    password: 'password123',
    fullName: 'Test User'
});

const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Body:', body);
    });
});

req.on('error', (error) => {
    console.error('Request Error:', error.message);
});

req.write(data);
req.end();
