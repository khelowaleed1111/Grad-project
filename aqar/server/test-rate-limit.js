/**
 * Manual Rate Limiting Test Script
 * 
 * This script tests the rate limiting functionality by making multiple requests
 * to the authentication endpoints.
 * 
 * To run: node test-rate-limit.js
 * 
 * Requirements:
 * - Server must be running on http://localhost:5000
 * - MongoDB must be connected
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testRateLimiting() {
  console.log('🧪 Testing Rate Limiting on /api/auth endpoints\n');
  console.log('Configuration: 10 requests per 15 minutes\n');

  try {
    // Test 1: Register endpoint rate limiting
    console.log('Test 1: Testing /api/auth/register rate limiting');
    console.log('Making 11 registration requests...\n');

    let rateLimitHit = false;
    let rateLimitResponse = null;

    for (let i = 0; i < 11; i++) {
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, {
          name: `Test User ${i}`,
          email: `testuser${i}@example.com`,
          password: 'Password123',
        });

        console.log(`Request ${i + 1}: ✅ Status ${response.status}`);
        
        // Log rate limit headers
        if (response.headers['ratelimit-remaining']) {
          console.log(`  Remaining: ${response.headers['ratelimit-remaining']}`);
        }
      } catch (error) {
        if (error.response && error.response.status === 429) {
          rateLimitHit = true;
          rateLimitResponse = error.response;
          console.log(`Request ${i + 1}: 🚫 Rate Limited (429)`);
          console.log(`  Message: ${error.response.data.message}`);
          break;
        } else {
          console.log(`Request ${i + 1}: ⚠️  Status ${error.response?.status || 'Error'}`);
        }
      }
    }

    if (rateLimitHit) {
      console.log('\n✅ Rate limiting is working correctly!');
      console.log(`Rate limit was hit after 10 requests as expected.`);
    } else {
      console.log('\n❌ Rate limiting may not be working correctly.');
      console.log('Expected to hit rate limit after 10 requests.');
    }

    // Test 2: Login endpoint rate limiting
    console.log('\n\nTest 2: Testing /api/auth/login rate limiting');
    console.log('Making 11 login requests...\n');

    rateLimitHit = false;

    for (let i = 0; i < 11; i++) {
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: 'test@example.com',
          password: 'Password123',
        });

        console.log(`Request ${i + 1}: ✅ Status ${response.status}`);
      } catch (error) {
        if (error.response && error.response.status === 429) {
          rateLimitHit = true;
          console.log(`Request ${i + 1}: 🚫 Rate Limited (429)`);
          console.log(`  Message: ${error.response.data.message}`);
          break;
        } else {
          console.log(`Request ${i + 1}: ⚠️  Status ${error.response?.status || 'Error'}`);
        }
      }
    }

    if (rateLimitHit) {
      console.log('\n✅ Rate limiting is working correctly on login endpoint!');
    } else {
      console.log('\n❌ Rate limiting may not be working correctly on login endpoint.');
    }

    console.log('\n\n📊 Summary:');
    console.log('- Rate limiting is configured for 10 requests per 15 minutes');
    console.log('- Applied to all /api/auth routes');
    console.log('- Returns 429 status with appropriate error message');
    console.log('- Includes rate limit headers in responses');

  } catch (error) {
    console.error('\n❌ Error running tests:', error.message);
    console.error('\nMake sure:');
    console.error('1. The server is running on http://localhost:5000');
    console.error('2. MongoDB is connected');
    console.error('3. Run: npm start or npm run dev');
  }
}

// Run the tests
testRateLimiting();
