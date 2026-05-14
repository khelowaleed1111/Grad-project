/**
 * Manual Backend API Verification Script
 * Task 9.1: Verify all backend API endpoints are functional
 * 
 * This script manually tests all API endpoints with proper delays to avoid rate limiting
 */

const http = require('http');
const https = require('https');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

// Test credentials from seeded data
const TEST_CREDENTIALS = {
  admin: {
    email: 'admin@aqar.com',
    password: 'Admin@123456'
  },
  owner: {
    email: 'ahmed.hassan@example.com',
    password: 'Password@123'
  },
  agent: {
    email: 'fatima.ali@example.com',
    password: 'Password@123'
  },
  buyer: {
    email: 'mohamed.ibrahim@example.com',
    password: 'Password@123'
  }
};

// Store tokens
let tokens = {};
let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to log test results
function logTest(name, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${name}`);
  if (details) {
    console.log(`   ${details}`);
  }
  testResults.tests.push({ name, passed, details });
  if (passed) {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
}

// Test functions
async function testHealthEndpoint() {
  console.log('\n=== Testing Health Endpoint ===');
  try {
    const response = await axios.get(`${BASE_URL}/api/health`);
    logTest('Health endpoint', response.status === 200, `Status: ${response.status}`);
    return true;
  } catch (error) {
    logTest('Health endpoint', false, error.message);
    return false;
  }
}

async function testAuthenticationEndpoints() {
  console.log('\n=== Testing Authentication Endpoints ===');
  
  // Test admin login
  await delay(1000);
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, TEST_CREDENTIALS.admin);
    const success = response.data.success && response.data.token && response.data.user;
    logTest('Admin login', success, `Token received: ${!!response.data.token}`);
    if (success) {
      tokens.admin = response.data.token;
    }
  } catch (error) {
    logTest('Admin login', false, error.response?.data?.message || error.message);
  }
  
  // Test owner login
  await delay(1000);
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, TEST_CREDENTIALS.owner);
    const success = response.data.success && response.data.token;
    logTest('Owner login', success, `Role: ${response.data.user?.role}`);
    if (success) {
      tokens.owner = response.data.token;
    }
  } catch (error) {
    logTest('Owner login', false, error.response?.data?.message || error.message);
  }
  
  // Test agent login
  await delay(1000);
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, TEST_CREDENTIALS.agent);
    const success = response.data.success && response.data.token;
    logTest('Agent login', success, `Role: ${response.data.user?.role}`);
    if (success) {
      tokens.agent = response.data.token;
    }
  } catch (error) {
    logTest('Agent login', false, error.response?.data?.message || error.message);
  }
  
  // Test buyer login
  await delay(1000);
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, TEST_CREDENTIALS.buyer);
    const success = response.data.success && response.data.token;
    logTest('Buyer login', success, `Role: ${response.data.user?.role}`);
    if (success) {
      tokens.buyer = response.data.token;
    }
  } catch (error) {
    logTest('Buyer login', false, error.response?.data?.message || error.message);
  }
  
  // Test invalid credentials
  await delay(1000);
  try {
    await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@aqar.com',
      password: 'wrongpassword'
    });
    logTest('Invalid credentials rejection', false, 'Should have been rejected');
  } catch (error) {
    const success = error.response?.status === 401;
    logTest('Invalid credentials rejection', success, `Status: ${error.response?.status}`);
  }
  
  // Test get profile
  await delay(1000);
  if (tokens.admin) {
    try {
      const response = await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${tokens.admin}` }
      });
      const success = response.data.success && response.data.user && !response.data.user.password;
      logTest('Get authenticated profile', success, `Email: ${response.data.user?.email}`);
    } catch (error) {
      logTest('Get authenticated profile', false, error.response?.data?.message || error.message);
    }
  }
  
  // Test unauthorized access
  await delay(1000);
  try {
    await axios.get(`${BASE_URL}/api/auth/me`);
    logTest('Unauthorized access rejection', false, 'Should have been rejected');
  } catch (error) {
    const success = error.response?.status === 401;
    logTest('Unauthorized access rejection', success, `Status: ${error.response?.status}`);
  }
}

async function testPropertyEndpoints() {
  console.log('\n=== Testing Property Endpoints ===');
  
  // Test get all properties
  await delay(1000);
  try {
    const response = await axios.get(`${BASE_URL}/api/properties`);
    const success = response.data.success && Array.isArray(response.data.data);
    const allApproved = response.data.data.every(p => p.isApproved === true);
    logTest('Get all properties', success && allApproved, 
      `Count: ${response.data.data.length}, All approved: ${allApproved}`);
  } catch (error) {
    logTest('Get all properties', false, error.message);
  }
  
  // Test filter by status
  await delay(1000);
  try {
    const response = await axios.get(`${BASE_URL}/api/properties?status=rent`);
    const allRent = response.data.data.every(p => p.status === 'rent');
    logTest('Filter by status (rent)', allRent, `Count: ${response.data.data.length}`);
  } catch (error) {
    logTest('Filter by status (rent)', false, error.message);
  }
  
  // Test filter by type
  await delay(1000);
  try {
    const response = await axios.get(`${BASE_URL}/api/properties?type=residential`);
    const allResidential = response.data.data.every(p => p.type === 'residential');
    logTest('Filter by type (residential)', allResidential, `Count: ${response.data.data.length}`);
  } catch (error) {
    logTest('Filter by type (residential)', false, error.message);
  }
  
  // Test filter by city
  await delay(1000);
  try {
    const response = await axios.get(`${BASE_URL}/api/properties?city=Cairo`);
    const allCairo = response.data.data.every(p => p.location.city.toLowerCase() === 'cairo');
    logTest('Filter by city (Cairo)', allCairo, `Count: ${response.data.data.length}`);
  } catch (error) {
    logTest('Filter by city (Cairo)', false, error.message);
  }
  
  // Test price range filter
  await delay(1000);
  try {
    const response = await axios.get(`${BASE_URL}/api/properties?minPrice=1000000&maxPrice=5000000`);
    const inRange = response.data.data.every(p => p.price >= 1000000 && p.price <= 5000000);
    logTest('Filter by price range', inRange, `Count: ${response.data.data.length}`);
  } catch (error) {
    logTest('Filter by price range', false, error.message);
  }
  
  // Test pagination
  await delay(1000);
  try {
    const response = await axios.get(`${BASE_URL}/api/properties?page=1&limit=3`);
    const success = response.data.pagination && response.data.data.length <= 3;
    logTest('Pagination', success, 
      `Page: ${response.data.pagination?.page}, Limit: ${response.data.pagination?.limit}`);
  } catch (error) {
    logTest('Pagination', false, error.message);
  }
  
  // Test sort by price ascending
  await delay(1000);
  try {
    const response = await axios.get(`${BASE_URL}/api/properties?sort=price_asc`);
    const prices = response.data.data.map(p => p.price);
    const sorted = prices.every((price, i) => i === 0 || price >= prices[i - 1]);
    logTest('Sort by price ascending', sorted, `Prices: ${prices.slice(0, 3).join(', ')}...`);
  } catch (error) {
    logTest('Sort by price ascending', false, error.message);
  }
  
  // Test get property by ID
  await delay(1000);
  try {
    const listResponse = await axios.get(`${BASE_URL}/api/properties`);
    if (listResponse.data.data.length > 0) {
      const propertyId = listResponse.data.data[0]._id;
      const response = await axios.get(`${BASE_URL}/api/properties/${propertyId}`);
      const success = response.data.success && response.data.data.owner && response.data.data.owner.name;
      logTest('Get property by ID with owner populated', success, 
        `Owner: ${response.data.data.owner?.name}`);
    }
  } catch (error) {
    logTest('Get property by ID with owner populated', false, error.message);
  }
  
  // Test get owner's listings
  await delay(1000);
  if (tokens.owner) {
    try {
      const response = await axios.get(`${BASE_URL}/api/properties/my-listings`, {
        headers: { Authorization: `Bearer ${tokens.owner}` }
      });
      const success = response.data.success && Array.isArray(response.data.data);
      logTest('Get owner\'s listings', success, `Count: ${response.data.data.length}`);
    } catch (error) {
      logTest('Get owner\'s listings', false, error.response?.data?.message || error.message);
    }
  }
}

async function testAdminEndpoints() {
  console.log('\n=== Testing Admin Endpoints ===');
  
  if (!tokens.admin) {
    console.log('⚠️  Skipping admin tests - no admin token available');
    return;
  }
  
  // Test get platform stats
  await delay(1000);
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${tokens.admin}` }
    });
    const success = response.data.success && 
      response.data.data.totalUsers !== undefined &&
      response.data.data.totalProperties !== undefined;
    logTest('Get platform statistics', success, 
      `Users: ${response.data.data.totalUsers}, Properties: ${response.data.data.totalProperties}`);
  } catch (error) {
    logTest('Get platform statistics', false, error.response?.data?.message || error.message);
  }
  
  // Test get all users
  await delay(1000);
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${tokens.admin}` }
    });
    const success = response.data.success && Array.isArray(response.data.data);
    const noPasswords = response.data.data.every(u => !u.password);
    logTest('Get all users', success && noPasswords, 
      `Count: ${response.data.data.length}, Passwords excluded: ${noPasswords}`);
  } catch (error) {
    logTest('Get all users', false, error.response?.data?.message || error.message);
  }
  
  // Test get all listings (including unapproved)
  await delay(1000);
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/listings`, {
      headers: { Authorization: `Bearer ${tokens.admin}` }
    });
    const success = response.data.success && Array.isArray(response.data.data);
    const hasUnapproved = response.data.data.some(p => !p.isApproved);
    logTest('Get all listings (including unapproved)', success, 
      `Total: ${response.data.data.length}, Has unapproved: ${hasUnapproved}`);
  } catch (error) {
    logTest('Get all listings (including unapproved)', false, error.response?.data?.message || error.message);
  }
  
  // Test filter unapproved listings
  await delay(1000);
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/listings?isApproved=false`, {
      headers: { Authorization: `Bearer ${tokens.admin}` }
    });
    const allUnapproved = response.data.data.every(p => p.isApproved === false);
    logTest('Filter unapproved listings', allUnapproved, 
      `Pending approvals: ${response.data.data.length}`);
  } catch (error) {
    logTest('Filter unapproved listings', false, error.response?.data?.message || error.message);
  }
  
  // Test non-admin access rejection
  await delay(1000);
  if (tokens.buyer) {
    try {
      await axios.get(`${BASE_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${tokens.buyer}` }
      });
      logTest('Non-admin access rejection', false, 'Should have been rejected');
    } catch (error) {
      const success = error.response?.status === 403;
      logTest('Non-admin access rejection', success, `Status: ${error.response?.status}`);
    }
  }
}

async function testErrorHandling() {
  console.log('\n=== Testing Error Handling ===');
  
  // Test 404 for non-existent route
  await delay(1000);
  try {
    await axios.get(`${BASE_URL}/api/nonexistent`);
    logTest('404 for non-existent route', false, 'Should have returned 404');
  } catch (error) {
    const success = error.response?.status === 404;
    logTest('404 for non-existent route', success, `Status: ${error.response?.status}`);
  }
  
  // Test invalid property ID format
  await delay(1000);
  try {
    await axios.get(`${BASE_URL}/api/properties/invalid-id`);
    logTest('Invalid ID format rejection', false, 'Should have been rejected');
  } catch (error) {
    const success = error.response?.status === 400;
    logTest('Invalid ID format rejection', success, `Status: ${error.response?.status}`);
  }
  
  // Test missing required fields
  await delay(1000);
  if (tokens.owner) {
    try {
      await axios.post(`${BASE_URL}/api/properties`, 
        { title: 'Test' },
        { headers: { Authorization: `Bearer ${tokens.owner}` } }
      );
      logTest('Missing required fields rejection', false, 'Should have been rejected');
    } catch (error) {
      const success = error.response?.status === 400;
      logTest('Missing required fields rejection', success, `Status: ${error.response?.status}`);
    }
  }
}

// Main execution
async function runAllTests() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   Backend API Verification - Task 9.1                      ║');
  console.log('║   Testing all endpoints with seeded data                   ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\nBase URL: ${BASE_URL}`);
  console.log('Starting tests...\n');
  
  try {
    await testHealthEndpoint();
    await testAuthenticationEndpoints();
    await testPropertyEndpoints();
    await testAdminEndpoints();
    await testErrorHandling();
    
    // Print summary
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║   TEST SUMMARY                                             ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(`\n✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📊 Total:  ${testResults.passed + testResults.failed}`);
    console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
    
    if (testResults.failed > 0) {
      console.log('\n❌ Failed Tests:');
      testResults.tests
        .filter(t => !t.passed)
        .forEach(t => console.log(`   - ${t.name}: ${t.details}`));
    }
    
    console.log('\n✅ Backend API verification complete!');
    console.log('\nKey Findings:');
    console.log('  • Authentication endpoints: ' + (tokens.admin && tokens.owner ? '✓' : '✗'));
    console.log('  • Property endpoints: ' + (testResults.tests.filter(t => t.name.includes('property') || t.name.includes('Filter')).every(t => t.passed) ? '✓' : '✗'));
    console.log('  • Admin endpoints: ' + (testResults.tests.filter(t => t.name.includes('admin') || t.name.includes('Admin')).every(t => t.passed) ? '✓' : '✗'));
    console.log('  • Error handling: ' + (testResults.tests.filter(t => t.name.includes('rejection') || t.name.includes('404')).every(t => t.passed) ? '✓' : '✗'));
    
    process.exit(testResults.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('\n❌ Fatal error during testing:', error.message);
    process.exit(1);
  }
}

// Run tests
runAllTests();
