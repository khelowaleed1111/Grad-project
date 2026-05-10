/**
 * Manual API Testing Script for Aqar Platform
 * 
 * This script tests all backend API endpoints manually to ensure they work correctly.
 * It covers authentication, property management, admin, and user endpoints.
 * 
 * Prerequisites:
 * - Server must be running on http://localhost:5000
 * - MongoDB must be connected
 * - Cloudinary credentials must be configured (for image upload tests)
 * 
 * Run: node manual-api-tests.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:5000/api';
const TEST_RESULTS = [];
let authToken = null;
let adminToken = null;
let testUserId = null;
let testPropertyId = null;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Helper functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`Testing: ${testName}`, 'cyan');
  log('='.repeat(60), 'cyan');
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue');
}

function recordResult(endpoint, method, status, success, message, data = null) {
  TEST_RESULTS.push({
    endpoint,
    method,
    status,
    success,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
}

// Test functions

/**
 * Test 1: Health Check
 */
async function testHealthCheck() {
  logTest('Health Check Endpoint');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    
    if (response.status === 200 && response.data.success) {
      logSuccess('Health check passed');
      logInfo(`Message: ${response.data.message}`);
      logInfo(`Timestamp: ${response.data.timestamp}`);
      recordResult('/health', 'GET', 200, true, 'Health check successful', response.data);
      return true;
    } else {
      logError('Health check failed - unexpected response');
      recordResult('/health', 'GET', response.status, false, 'Unexpected response');
      return false;
    }
  } catch (error) {
    logError(`Health check failed: ${error.message}`);
    recordResult('/health', 'GET', error.response?.status || 0, false, error.message);
    return false;
  }
}

/**
 * Test 2: User Registration
 */
async function testUserRegistration() {
  logTest('User Registration');
  
  const testUser = {
    name: 'Test User',
    email: `testuser${Date.now()}@example.com`,
    password: 'TestPass123',
    phone: '+201234567890',
    role: 'owner',
  };
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, testUser);
    
    if (response.status === 201 && response.data.success && response.data.token) {
      authToken = response.data.token;
      testUserId = response.data.user._id;
      logSuccess('User registration successful');
      logInfo(`User ID: ${testUserId}`);
      logInfo(`Email: ${testUser.email}`);
      logInfo(`Token received: ${authToken.substring(0, 20)}...`);
      recordResult('/auth/register', 'POST', 201, true, 'Registration successful', {
        userId: testUserId,
        email: testUser.email,
      });
      return true;
    } else {
      logError('Registration failed - unexpected response');
      recordResult('/auth/register', 'POST', response.status, false, 'Unexpected response');
      return false;
    }
  } catch (error) {
    logError(`Registration failed: ${error.response?.data?.message || error.message}`);
    if (error.response?.data?.errors) {
      error.response.data.errors.forEach(err => {
        logError(`  - ${err.field}: ${err.message}`);
      });
    }
    recordResult('/auth/register', 'POST', error.response?.status || 0, false, error.message);
    return false;
  }
}

/**
 * Test 3: User Login
 */
async function testUserLogin(email, password) {
  logTest('User Login');
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });
    
    if (response.status === 200 && response.data.success && response.data.token) {
      authToken = response.data.token;
      logSuccess('Login successful');
      logInfo(`Token: ${authToken.substring(0, 20)}...`);
      logInfo(`User: ${response.data.user.name} (${response.data.user.role})`);
      recordResult('/auth/login', 'POST', 200, true, 'Login successful', {
        userId: response.data.user._id,
        role: response.data.user.role,
      });
      return true;
    } else {
      logError('Login failed - unexpected response');
      recordResult('/auth/login', 'POST', response.status, false, 'Unexpected response');
      return false;
    }
  } catch (error) {
    logError(`Login failed: ${error.response?.data?.message || error.message}`);
    recordResult('/auth/login', 'POST', error.response?.status || 0, false, error.message);
    return false;
  }
}

/**
 * Test 4: Invalid Login Credentials
 */
async function testInvalidLogin() {
  logTest('Invalid Login Credentials');
  
  try {
    await axios.post(`${BASE_URL}/auth/login`, {
      email: 'invalid@example.com',
      password: 'wrongpassword',
    });
    
    logError('Invalid login should have failed but succeeded');
    recordResult('/auth/login', 'POST', 200, false, 'Invalid login succeeded unexpectedly');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      logSuccess('Invalid login correctly rejected with 401');
      logInfo(`Message: ${error.response.data.message}`);
      recordResult('/auth/login', 'POST', 401, true, 'Invalid login correctly rejected');
      return true;
    } else {
      logError(`Unexpected error: ${error.message}`);
      recordResult('/auth/login', 'POST', error.response?.status || 0, false, error.message);
      return false;
    }
  }
}

/**
 * Test 5: Get Current User Profile
 */
async function testGetMe() {
  logTest('Get Current User Profile');
  
  if (!authToken) {
    logError('No auth token available - skipping test');
    return false;
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    
    if (response.status === 200 && response.data.success) {
      logSuccess('Profile retrieved successfully');
      logInfo(`Name: ${response.data.user.name}`);
      logInfo(`Email: ${response.data.user.email}`);
      logInfo(`Role: ${response.data.user.role}`);
      recordResult('/auth/me', 'GET', 200, true, 'Profile retrieved', response.data.user);
      return true;
    } else {
      logError('Failed to retrieve profile');
      recordResult('/auth/me', 'GET', response.status, false, 'Unexpected response');
      return false;
    }
  } catch (error) {
    logError(`Failed to retrieve profile: ${error.response?.data?.message || error.message}`);
    recordResult('/auth/me', 'GET', error.response?.status || 0, false, error.message);
    return false;
  }
}

/**
 * Test 6: Unauthorized Access (No Token)
 */
async function testUnauthorizedAccess() {
  logTest('Unauthorized Access (No Token)');
  
  try {
    await axios.get(`${BASE_URL}/auth/me`);
    
    logError('Unauthorized access should have failed but succeeded');
    recordResult('/auth/me', 'GET', 200, false, 'Unauthorized access succeeded unexpectedly');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      logSuccess('Unauthorized access correctly rejected with 401');
      logInfo(`Message: ${error.response.data.message}`);
      recordResult('/auth/me', 'GET', 401, true, 'Unauthorized access correctly rejected');
      return true;
    } else {
      logError(`Unexpected error: ${error.message}`);
      recordResult('/auth/me', 'GET', error.response?.status || 0, false, error.message);
      return false;
    }
  }
}

/**
 * Test 7: Create Property Listing
 */
async function testCreateProperty() {
  logTest('Create Property Listing');
  
  if (!authToken) {
    logError('No auth token available - skipping test');
    return false;
  }
  
  const propertyData = {
    title: 'Test Property - Luxury Apartment',
    description: 'A beautiful test property with amazing views and modern amenities.',
    price: 500000,
    status: 'sale',
    type: 'residential',
    rooms: 3,
    bathrooms: 2,
    area: 150,
    address: '123 Test Street',
    city: 'Cairo',
    country: 'Egypt',
    lat: 30.0444,
    lng: 31.2357,
  };
  
  try {
    const response = await axios.post(`${BASE_URL}/properties`, propertyData, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    
    if (response.status === 201 && response.data.success) {
      testPropertyId = response.data.data._id;
      logSuccess('Property created successfully');
      logInfo(`Property ID: ${testPropertyId}`);
      logInfo(`Title: ${response.data.data.title}`);
      logInfo(`Price: ${response.data.data.price}`);
      logInfo(`Approved: ${response.data.data.isApproved}`);
      recordResult('/properties', 'POST', 201, true, 'Property created', {
        propertyId: testPropertyId,
      });
      return true;
    } else {
      logError('Failed to create property');
      recordResult('/properties', 'POST', response.status, false, 'Unexpected response');
      return false;
    }
  } catch (error) {
    logError(`Failed to create property: ${error.response?.data?.message || error.message}`);
    recordResult('/properties', 'POST', error.response?.status || 0, false, error.message);
    return false;
  }
}

/**
 * Test 8: Get All Properties (Public)
 */
async function testGetAllProperties() {
  logTest('Get All Properties (Public)');
  
  try {
    const response = await axios.get(`${BASE_URL}/properties`);
    
    if (response.status === 200 && response.data.success) {
      logSuccess('Properties retrieved successfully');
      logInfo(`Total properties: ${response.data.count}`);
      logInfo(`Current page: ${response.data.pagination?.page || 1}`);
      logInfo(`Total pages: ${response.data.pagination?.totalPages || 1}`);
      recordResult('/properties', 'GET', 200, true, 'Properties retrieved', {
        count: response.data.count,
      });
      return true;
    } else {
      logError('Failed to retrieve properties');
      recordResult('/properties', 'GET', response.status, false, 'Unexpected response');
      return false;
    }
  } catch (error) {
    logError(`Failed to retrieve properties: ${error.response?.data?.message || error.message}`);
    recordResult('/properties', 'GET', error.response?.status || 0, false, error.message);
    return false;
  }
}

/**
 * Test 9: Get Property by ID
 */
async function testGetPropertyById() {
  logTest('Get Property by ID');
  
  if (!testPropertyId) {
    logError('No test property ID available - skipping test');
    return false;
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/properties/${testPropertyId}`);
    
    if (response.status === 200 && response.data.success) {
      logSuccess('Property retrieved successfully');
      logInfo(`Title: ${response.data.data.title}`);
      logInfo(`Price: ${response.data.data.price}`);
      logInfo(`Views: ${response.data.data.views}`);
      logInfo(`Owner: ${response.data.data.owner?.name || 'N/A'}`);
      recordResult(`/properties/${testPropertyId}`, 'GET', 200, true, 'Property retrieved');
      return true;
    } else {
      logError('Failed to retrieve property');
      recordResult(`/properties/${testPropertyId}`, 'GET', response.status, false, 'Unexpected response');
      return false;
    }
  } catch (error) {
    logError(`Failed to retrieve property: ${error.response?.data?.message || error.message}`);
    recordResult(`/properties/${testPropertyId}`, 'GET', error.response?.status || 0, false, error.message);
    return false;
  }
}

/**
 * Test 10: Filter Properties by Status
 */
async function testFilterPropertiesByStatus() {
  logTest('Filter Properties by Status');
  
  try {
    const response = await axios.get(`${BASE_URL}/properties?status=sale`);
    
    if (response.status === 200 && response.data.success) {
      logSuccess('Properties filtered by status successfully');
      logInfo(`Properties for sale: ${response.data.count}`);
      
      // Verify all properties have status 'sale'
      const allSale = response.data.data.every(prop => prop.status === 'sale');
      if (allSale) {
        logSuccess('All returned properties have status "sale"');
      } else {
        logError('Some properties do not have status "sale"');
      }
      
      recordResult('/properties?status=sale', 'GET', 200, true, 'Properties filtered by status');
      return true;
    } else {
      logError('Failed to filter properties');
      recordResult('/properties?status=sale', 'GET', response.status, false, 'Unexpected response');
      return false;
    }
  } catch (error) {
    logError(`Failed to filter properties: ${error.response?.data?.message || error.message}`);
    recordResult('/properties?status=sale', 'GET', error.response?.status || 0, false, error.message);
    return false;
  }
}

/**
 * Test 11: Filter Properties by Price Range
 */
async function testFilterPropertiesByPrice() {
  logTest('Filter Properties by Price Range');
  
  try {
    const response = await axios.get(`${BASE_URL}/properties?minPrice=100000&maxPrice=1000000`);
    
    if (response.status === 200 && response.data.success) {
      logSuccess('Properties filtered by price range successfully');
      logInfo(`Properties in range: ${response.data.count}`);
      
      // Verify all properties are within price range
      const allInRange = response.data.data.every(
        prop => prop.price >= 100000 && prop.price <= 1000000
      );
      if (allInRange) {
        logSuccess('All returned properties are within price range');
      } else {
        logError('Some properties are outside price range');
      }
      
      recordResult('/properties?minPrice=100000&maxPrice=1000000', 'GET', 200, true, 'Properties filtered by price');
      return true;
    } else {
      logError('Failed to filter properties');
      recordResult('/properties?minPrice=100000&maxPrice=1000000', 'GET', response.status, false, 'Unexpected response');
      return false;
    }
  } catch (error) {
    logError(`Failed to filter properties: ${error.response?.data?.message || error.message}`);
    recordResult('/properties?minPrice=100000&maxPrice=1000000', 'GET', error.response?.status || 0, false, error.message);
    return false;
  }
}

/**
 * Test 12: Get My Listings
 */
async function testGetMyListings() {
  logTest('Get My Listings');
  
  if (!authToken) {
    logError('No auth token available - skipping test');
    return false;
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/properties/my-listings`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    
    if (response.status === 200 && response.data.success) {
      logSuccess('My listings retrieved successfully');
      logInfo(`Total listings: ${response.data.count}`);
      recordResult('/properties/my-listings', 'GET', 200, true, 'My listings retrieved', {
        count: response.data.count,
      });
      return true;
    } else {
      logError('Failed to retrieve my listings');
      recordResult('/properties/my-listings', 'GET', response.status, false, 'Unexpected response');
      return false;
    }
  } catch (error) {
    logError(`Failed to retrieve my listings: ${error.response?.data?.message || error.message}`);
    recordResult('/properties/my-listings', 'GET', error.response?.status || 0, false, error.message);
    return false;
  }
}

/**
 * Test 13: Update Property
 */
async function testUpdateProperty() {
  logTest('Update Property');
  
  if (!authToken || !testPropertyId) {
    logError('No auth token or property ID available - skipping test');
    return false;
  }
  
  const updateData = {
    title: 'Updated Test Property - Luxury Apartment',
    price: 550000,
  };
  
  try {
    const response = await axios.put(`${BASE_URL}/properties/${testPropertyId}`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    
    if (response.status === 200 && response.data.success) {
      logSuccess('Property updated successfully');
      logInfo(`New title: ${response.data.data.title}`);
      logInfo(`New price: ${response.data.data.price}`);
      recordResult(`/properties/${testPropertyId}`, 'PUT', 200, true, 'Property updated');
      return true;
    } else {
      logError('Failed to update property');
      recordResult(`/properties/${testPropertyId}`, 'PUT', response.status, false, 'Unexpected response');
      return false;
    }
  } catch (error) {
    logError(`Failed to update property: ${error.response?.data?.message || error.message}`);
    recordResult(`/properties/${testPropertyId}`, 'PUT', error.response?.status || 0, false, error.message);
    return false;
  }
}

/**
 * Test 14: Send Property Inquiry
 */
async function testSendInquiry() {
  logTest('Send Property Inquiry');
  
  if (!authToken || !testPropertyId) {
    logError('No auth token or property ID available - skipping test');
    return false;
  }
  
  const inquiryData = {
    message: 'I am interested in this property. Can we schedule a viewing?',
  };
  
  try {
    const response = await axios.post(
      `${BASE_URL}/properties/${testPropertyId}/inquire`,
      inquiryData,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    
    if (response.status === 201 && response.data.success) {
      logSuccess('Inquiry sent successfully');
      logInfo(`Inquiry ID: ${response.data.data._id}`);
      logInfo(`Message: ${response.data.data.message}`);
      recordResult(`/properties/${testPropertyId}/inquire`, 'POST', 201, true, 'Inquiry sent');
      return true;
    } else {
      logError('Failed to send inquiry');
      recordResult(`/properties/${testPropertyId}/inquire`, 'POST', response.status, false, 'Unexpected response');
      return false;
    }
  } catch (error) {
    logError(`Failed to send inquiry: ${error.response?.data?.message || error.message}`);
    recordResult(`/properties/${testPropertyId}/inquire`, 'POST', error.response?.status || 0, false, error.message);
    return false;
  }
}

/**
 * Test 15: Update User Profile
 */
async function testUpdateProfile() {
  logTest('Update User Profile');
  
  if (!authToken) {
    logError('No auth token available - skipping test');
    return false;
  }
  
  const updateData = {
    name: 'Updated Test User',
    phone: '+201234567899',
  };
  
  try {
    const response = await axios.put(`${BASE_URL}/auth/update-profile`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    
    if (response.status === 200 && response.data.success) {
      logSuccess('Profile updated successfully');
      logInfo(`New name: ${response.data.user.name}`);
      logInfo(`New phone: ${response.data.user.phone}`);
      recordResult('/auth/update-profile', 'PUT', 200, true, 'Profile updated');
      return true;
    } else {
      logError('Failed to update profile');
      recordResult('/auth/update-profile', 'PUT', response.status, false, 'Unexpected response');
      return false;
    }
  } catch (error) {
    logError(`Failed to update profile: ${error.response?.data?.message || error.message}`);
    recordResult('/auth/update-profile', 'PUT', error.response?.status || 0, false, error.message);
    return false;
  }
}

/**
 * Test 16: Admin - Get Platform Stats (requires admin user)
 */
async function testAdminStats() {
  logTest('Admin - Get Platform Stats');
  
  if (!adminToken) {
    logInfo('No admin token available - skipping admin tests');
    logInfo('To test admin endpoints, create an admin user and set adminToken');
    return false;
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    
    if (response.status === 200 && response.data.success) {
      logSuccess('Platform stats retrieved successfully');
      logInfo(`Total users: ${response.data.data.totalUsers}`);
      logInfo(`Total properties: ${response.data.data.totalProperties}`);
      logInfo(`Pending approvals: ${response.data.data.pendingApprovals}`);
      recordResult('/admin/stats', 'GET', 200, true, 'Stats retrieved', response.data.data);
      return true;
    } else {
      logError('Failed to retrieve stats');
      recordResult('/admin/stats', 'GET', response.status, false, 'Unexpected response');
      return false;
    }
  } catch (error) {
    logError(`Failed to retrieve stats: ${error.response?.data?.message || error.message}`);
    recordResult('/admin/stats', 'GET', error.response?.status || 0, false, error.message);
    return false;
  }
}

/**
 * Test 17: Delete Property
 */
async function testDeleteProperty() {
  logTest('Delete Property');
  
  if (!authToken || !testPropertyId) {
    logError('No auth token or property ID available - skipping test');
    return false;
  }
  
  try {
    const response = await axios.delete(`${BASE_URL}/properties/${testPropertyId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    
    if (response.status === 200 && response.data.success) {
      logSuccess('Property deleted successfully');
      logInfo(`Message: ${response.data.message}`);
      recordResult(`/properties/${testPropertyId}`, 'DELETE', 200, true, 'Property deleted');
      return true;
    } else {
      logError('Failed to delete property');
      recordResult(`/properties/${testPropertyId}`, 'DELETE', response.status, false, 'Unexpected response');
      return false;
    }
  } catch (error) {
    logError(`Failed to delete property: ${error.response?.data?.message || error.message}`);
    recordResult(`/properties/${testPropertyId}`, 'DELETE', error.response?.status || 0, false, error.message);
    return false;
  }
}

/**
 * Generate Test Report
 */
function generateReport() {
  log('\n\n' + '='.repeat(60), 'cyan');
  log('TEST REPORT SUMMARY', 'cyan');
  log('='.repeat(60), 'cyan');
  
  const totalTests = TEST_RESULTS.length;
  const passedTests = TEST_RESULTS.filter(r => r.success).length;
  const failedTests = totalTests - passedTests;
  const passRate = ((passedTests / totalTests) * 100).toFixed(2);
  
  log(`\nTotal Tests: ${totalTests}`, 'blue');
  log(`Passed: ${passedTests}`, 'green');
  log(`Failed: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
  log(`Pass Rate: ${passRate}%`, passRate >= 80 ? 'green' : 'yellow');
  
  log('\n\nDetailed Results:', 'cyan');
  log('-'.repeat(60), 'cyan');
  
  TEST_RESULTS.forEach((result, index) => {
    const status = result.success ? '✓' : '✗';
    const color = result.success ? 'green' : 'red';
    log(`\n${index + 1}. ${status} ${result.method} ${result.endpoint}`, color);
    log(`   Status: ${result.status}`, color);
    log(`   Message: ${result.message}`, color);
  });
  
  // Save report to file
  const reportPath = path.join(__dirname, 'test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(TEST_RESULTS, null, 2));
  log(`\n\nDetailed report saved to: ${reportPath}`, 'blue');
}

/**
 * Main Test Runner
 */
async function runAllTests() {
  log('\n' + '='.repeat(60), 'cyan');
  log('AQAR PLATFORM - MANUAL API TESTING', 'cyan');
  log('='.repeat(60), 'cyan');
  log(`Base URL: ${BASE_URL}`, 'blue');
  log(`Start Time: ${new Date().toISOString()}`, 'blue');
  
  try {
    // Test 1: Health Check
    await testHealthCheck();
    
    // Test 2: User Registration
    const registrationSuccess = await testUserRegistration();
    
    // Test 3: User Login (if registration failed, try with existing user)
    if (!registrationSuccess) {
      logInfo('Registration failed, attempting login with test credentials');
      await testUserLogin('testuser@example.com', 'TestPass123');
    }
    
    // Test 4: Invalid Login
    await testInvalidLogin();
    
    // Test 5: Get Current User
    await testGetMe();
    
    // Test 6: Unauthorized Access
    await testUnauthorizedAccess();
    
    // Test 7: Create Property
    await testCreateProperty();
    
    // Test 8: Get All Properties
    await testGetAllProperties();
    
    // Test 9: Get Property by ID
    await testGetPropertyById();
    
    // Test 10: Filter by Status
    await testFilterPropertiesByStatus();
    
    // Test 11: Filter by Price
    await testFilterPropertiesByPrice();
    
    // Test 12: Get My Listings
    await testGetMyListings();
    
    // Test 13: Update Property
    await testUpdateProperty();
    
    // Test 14: Send Inquiry
    await testSendInquiry();
    
    // Test 15: Update Profile
    await testUpdateProfile();
    
    // Test 16: Admin Stats (if admin token available)
    await testAdminStats();
    
    // Test 17: Delete Property (cleanup)
    await testDeleteProperty();
    
    // Generate report
    generateReport();
    
  } catch (error) {
    logError(`\nUnexpected error during test execution: ${error.message}`);
    console.error(error);
  }
  
  log('\n' + '='.repeat(60), 'cyan');
  log(`End Time: ${new Date().toISOString()}`, 'blue');
  log('='.repeat(60), 'cyan');
}

// Run tests
runAllTests().catch(console.error);
