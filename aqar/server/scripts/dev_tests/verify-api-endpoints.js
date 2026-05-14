/**
 * Backend API Endpoint Verification Script
 * Task 9.1: Verify all backend API endpoints are functional
 * 
 * This script uses supertest to verify all API endpoints
 */

const request = require('supertest');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

// Test credentials from seeded data
const TEST_CREDENTIALS = {
  admin: { email: 'admin@aqar.com', password: 'Admin@123456' },
  owner: { email: 'ahmed.hassan@example.com', password: 'Password@123' },
  agent: { email: 'fatima.ali@example.com', password: 'Password@123' },
  buyer: { email: 'mohamed.ibrahim@example.com', password: 'Password@123' }
};

// Store tokens
let tokens = {};
let results = { passed: 0, failed: 0, tests: [] };

// Helper functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function logTest(name, passed, details = '') {
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${name}`);
  if (details) console.log(`   ${details}`);
  results.tests.push({ name, passed, details });
  passed ? results.passed++ : results.failed++;
}

// Test functions
async function testSection(title, testFn) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${title}`);
  console.log('='.repeat(60));
  await testFn();
}

async function runTests() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   Backend API Verification - Task 9.1                      ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\nBase URL: ${BASE_URL}\n`);

  // 1. Test Authentication
  await testSection('1. AUTHENTICATION ENDPOINTS', async () => {
    // Admin login
    await delay(1500);
    try {
      const res = await request(BASE_URL)
        .post('/api/auth/login')
        .send(TEST_CREDENTIALS.admin);
      
      if (res.status === 200 && res.body.data?.token) {
        tokens.admin = res.body.data.token;
        logTest('Admin login', true, `Role: ${res.body.data.user.role}`);
      } else {
        logTest('Admin login', false, `Status: ${res.status}, Token: ${!!res.body.data?.token}`);
      }
    } catch (error) {
      logTest('Admin login', false, error.message);
    }

    // Owner login
    await delay(1500);
    try {
      const res = await request(BASE_URL)
        .post('/api/auth/login')
        .send(TEST_CREDENTIALS.owner);
      
      if (res.status === 200 && res.body.data?.token) {
        tokens.owner = res.body.data.token;
        logTest('Owner login', true, `Role: ${res.body.data.user.role}`);
      } else {
        logTest('Owner login', false, `Status: ${res.status}, Token: ${!!res.body.data?.token}`);
      }
    } catch (error) {
      logTest('Owner login', false, error.message);
    }

    // Buyer login
    await delay(1500);
    try {
      const res = await request(BASE_URL)
        .post('/api/auth/login')
        .send(TEST_CREDENTIALS.buyer);
      
      if (res.status === 200 && res.body.data?.token) {
        tokens.buyer = res.body.data.token;
        logTest('Buyer login', true, `Role: ${res.body.data.user.role}`);
      } else {
        logTest('Buyer login', false, `Status: ${res.status}, Token: ${!!res.body.data?.token}`);
      }
    } catch (error) {
      logTest('Buyer login', false, error.message);
    }

    // Test invalid credentials
    await delay(1500);
    try {
      const res = await request(BASE_URL)
        .post('/api/auth/login')
        .send({ email: 'admin@aqar.com', password: 'wrong' });
      
      logTest('Invalid credentials rejection', res.status === 401, `Status: ${res.status}`);
    } catch (error) {
      logTest('Invalid credentials rejection', false, error.message);
    }

    // Test get profile
    await delay(1500);
    if (tokens.admin) {
      try {
        const res = await request(BASE_URL)
          .get('/api/auth/me')
          .set('Authorization', `Bearer ${tokens.admin}`);
        
        const success = res.status === 200 && res.body.user && !res.body.user.password;
        logTest('Get authenticated profile', success, `Email: ${res.body.user?.email}`);
      } catch (error) {
        logTest('Get authenticated profile', false, error.message);
      }
    }
  });

  // 2. Test Property Endpoints
  await testSection('2. PROPERTY ENDPOINTS', async () => {
    // Get all properties
    await delay(1000);
    try {
      const res = await request(BASE_URL).get('/api/properties');
      const allApproved = res.body.data?.every(p => p.isApproved === true);
      logTest('Get all approved properties', res.status === 200 && allApproved, 
        `Count: ${res.body.data?.length}`);
    } catch (error) {
      logTest('Get all approved properties', false, error.message);
    }

    // Filter by status
    await delay(1000);
    try {
      const res = await request(BASE_URL).get('/api/properties?status=rent');
      const allRent = res.body.data?.every(p => p.status === 'rent');
      logTest('Filter by status (rent)', allRent, `Count: ${res.body.data?.length}`);
    } catch (error) {
      logTest('Filter by status (rent)', false, error.message);
    }

    // Filter by type
    await delay(1000);
    try {
      const res = await request(BASE_URL).get('/api/properties?type=residential');
      const allResidential = res.body.data?.every(p => p.type === 'residential');
      logTest('Filter by type (residential)', allResidential, `Count: ${res.body.data?.length}`);
    } catch (error) {
      logTest('Filter by type (residential)', false, error.message);
    }

    // Filter by city
    await delay(1000);
    try {
      const res = await request(BASE_URL).get('/api/properties?city=Cairo');
      const allCairo = res.body.data?.every(p => p.location.city.toLowerCase() === 'cairo');
      logTest('Filter by city (Cairo)', allCairo, `Count: ${res.body.data?.length}`);
    } catch (error) {
      logTest('Filter by city (Cairo)', false, error.message);
    }

    // Price range filter
    await delay(1000);
    try {
      const res = await request(BASE_URL).get('/api/properties?minPrice=1000000&maxPrice=5000000');
      const inRange = res.body.data?.every(p => p.price >= 1000000 && p.price <= 5000000);
      logTest('Filter by price range', inRange, `Count: ${res.body.data?.length}`);
    } catch (error) {
      logTest('Filter by price range', false, error.message);
    }

    // Pagination
    await delay(1000);
    try {
      const res = await request(BASE_URL).get('/api/properties?page=1&limit=3');
      const success = res.body.pagination && res.body.data?.length <= 3;
      logTest('Pagination', success, `Page: ${res.body.pagination?.page}, Items: ${res.body.data?.length}`);
    } catch (error) {
      logTest('Pagination', false, error.message);
    }

    // Sort by price
    await delay(1000);
    try {
      const res = await request(BASE_URL).get('/api/properties?sort=price_asc');
      const prices = res.body.data?.map(p => p.price) || [];
      const sorted = prices.every((p, i) => i === 0 || p >= prices[i - 1]);
      logTest('Sort by price ascending', sorted, `First 3: ${prices.slice(0, 3).join(', ')}`);
    } catch (error) {
      logTest('Sort by price ascending', false, error.message);
    }

    // Get property by ID
    await delay(1000);
    try {
      const listRes = await request(BASE_URL).get('/api/properties');
      if (listRes.body.data?.length > 0) {
        const propertyId = listRes.body.data[0]._id;
        const res = await request(BASE_URL).get(`/api/properties/${propertyId}`);
        const success = res.status === 200 && res.body.data?.owner?.name;
        logTest('Get property by ID with owner', success, `Owner: ${res.body.data?.owner?.name}`);
      }
    } catch (error) {
      logTest('Get property by ID with owner', false, error.message);
    }

    // Get owner's listings
    await delay(1000);
    if (tokens.owner) {
      try {
        const res = await request(BASE_URL)
          .get('/api/properties/my-listings')
          .set('Authorization', `Bearer ${tokens.owner}`);
        
        logTest('Get owner\'s listings', res.status === 200, `Count: ${res.body.data?.length}`);
      } catch (error) {
        logTest('Get owner\'s listings', false, error.message);
      }
    }
  });

  // 3. Test Admin Endpoints
  await testSection('3. ADMIN ENDPOINTS', async () => {
    if (!tokens.admin) {
      console.log('⚠️  Skipping - no admin token');
      return;
    }

    // Get platform stats
    await delay(1000);
    try {
      const res = await request(BASE_URL)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${tokens.admin}`);
      
      const success = res.status === 200 && res.body.data?.totalUsers !== undefined;
      logTest('Get platform statistics', success, 
        `Users: ${res.body.data?.totalUsers}, Properties: ${res.body.data?.totalProperties}`);
    } catch (error) {
      logTest('Get platform statistics', false, error.message);
    }

    // Get all users
    await delay(1000);
    try {
      const res = await request(BASE_URL)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${tokens.admin}`);
      
      const noPasswords = res.body.data?.every(u => !u.password);
      logTest('Get all users', res.status === 200 && noPasswords, 
        `Count: ${res.body.data?.length}, Passwords excluded: ${noPasswords}`);
    } catch (error) {
      logTest('Get all users', false, error.message);
    }

    // Get all listings
    await delay(1000);
    try {
      const res = await request(BASE_URL)
        .get('/api/admin/listings')
        .set('Authorization', `Bearer ${tokens.admin}`);
      
      const hasUnapproved = res.body.data?.some(p => !p.isApproved);
      logTest('Get all listings (incl. unapproved)', res.status === 200, 
        `Total: ${res.body.data?.length}, Has unapproved: ${hasUnapproved}`);
    } catch (error) {
      logTest('Get all listings (incl. unapproved)', false, error.message);
    }

    // Filter unapproved
    await delay(1000);
    try {
      const res = await request(BASE_URL)
        .get('/api/admin/listings?isApproved=false')
        .set('Authorization', `Bearer ${tokens.admin}`);
      
      const allUnapproved = res.body.data?.every(p => p.isApproved === false);
      logTest('Filter unapproved listings', allUnapproved, 
        `Pending: ${res.body.data?.length}`);
    } catch (error) {
      logTest('Filter unapproved listings', false, error.message);
    }

    // Test non-admin rejection
    await delay(1000);
    if (tokens.buyer) {
      try {
        const res = await request(BASE_URL)
          .get('/api/admin/stats')
          .set('Authorization', `Bearer ${tokens.buyer}`);
        
        logTest('Non-admin access rejection', res.status === 403, `Status: ${res.status}`);
      } catch (error) {
        logTest('Non-admin access rejection', false, error.message);
      }
    }
  });

  // 4. Test Error Handling
  await testSection('4. ERROR HANDLING', async () => {
    // 404 for non-existent route
    await delay(1000);
    try {
      const res = await request(BASE_URL).get('/api/nonexistent');
      logTest('404 for non-existent route', res.status === 404, `Status: ${res.status}`);
    } catch (error) {
      logTest('404 for non-existent route', false, error.message);
    }

    // Invalid property ID
    await delay(1000);
    try {
      const res = await request(BASE_URL).get('/api/properties/invalid-id');
      logTest('Invalid ID format rejection', res.status === 400, `Status: ${res.status}`);
    } catch (error) {
      logTest('Invalid ID format rejection', false, error.message);
    }

    // Unauthorized access
    await delay(1000);
    try {
      const res = await request(BASE_URL).get('/api/auth/me');
      logTest('Unauthorized access rejection', res.status === 401, `Status: ${res.status}`);
    } catch (error) {
      logTest('Unauthorized access rejection', false, error.message);
    }
  });

  // Print Summary
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`\n✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📊 Total:  ${results.passed + results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.tests.filter(t => !t.passed).forEach(t => 
      console.log(`   - ${t.name}${t.details ? ': ' + t.details : ''}`));
  }

  console.log('\n✅ Backend API verification complete!\n');
  
  return results.failed === 0;
}

// Run tests
runTests()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  });
