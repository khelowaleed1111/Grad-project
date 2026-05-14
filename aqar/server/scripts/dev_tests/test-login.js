const request = require('supertest');

const BASE_URL = 'http://localhost:5000';

async function testLogin() {
  try {
    const response = await request(BASE_URL)
      .post('/api/auth/login')
      .send({
        email: 'admin@aqar.com',
        password: 'Admin@123456'
      });
    
    console.log('Status:', response.status);
    console.log('Response body:', JSON.stringify(response.body, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLogin();
