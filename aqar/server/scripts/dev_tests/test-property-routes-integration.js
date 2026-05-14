/**
 * Integration test for property routes
 * This file tests all property routes functionality
 * Run with: node test-property-routes-integration.js
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:5000/api';
const TEST_USER = {
  name: 'Property Test User',
  email: 'propertytest@example.com',
  password: 'TestPass123',
  phone: '+1234567890',
  role: 'owner'
};

const TEST_PROPERTY = {
  title: 'Test Property for Routes',
  description: 'A beautiful test property for integration testing',
  price: 500000,
  status: 'sale',
  type: 'residential',
  rooms: 3,
  bathrooms: 2,
  area: 150,
  location: JSON.stringify({
    address: '123 Test Street',
    city: 'Cairo',
    country: 'Egypt',
    coordinates: {
      lat: 30.0444,
      lng: 31.2357
    }
  })
};

let authToken = '';
let propertyId = '';

// Helper function to make requests
const makeRequest = async (method, endpoint, data = null, headers = {}) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
};

// Helper function to make form data requests
const makeFormRequest = async (method, endpoint, formData, headers = {}) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        ...formData.getHeaders(),
        ...headers
      },
      data: formData
    };

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
};

// Setup: Register and login user
const setupUser = async () => {
  console.log('\n🔐 Setting up test user...');
  
  // Register user
  const registerResult = await makeRequest('POST', '/auth/register', TEST_USER);
  
  if (registerResult.success) {
    console.log('✅ User registered successfully');
    authToken = registerResult.data.data.token;
  } else {
    // Try to login if user already exists
    const loginResult = await makeRequest('POST', '/auth/login', {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    
    if (loginResult.success) {
      console.log('✅ User logged in successfully');
      authToken = loginResult.data.data.token;
    } else {
      console.log('❌ Failed to setup user');
      return false;
    }
  }
  
  return true;
};

// Test 1: Get all properties (public route)
const testGetAllProperties = async () => {
  console.log('\n📋 Test 1: Get All Properties (Public)...');
  
  const result = await makeRequest('GET', '/properties');
  
  if (result.success) {
    console.log('✅ Get all properties successful');
    console.log(`   Found ${result.data.count} properties`);
    console.log(`   Total: ${result.data.total}`);
    console.log(`   Pagination: Page ${result.data.pagination.page} of ${result.data.pagination.totalPages}`);
  } else {
    console.log('❌ Get all properties failed');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error, null, 2)}`);
  }
  
  return result.success;
};

// Test 2: Get featured properties
const testGetFeaturedProperties = async () => {
  console.log('\n⭐ Test 2: Get Featured Properties...');
  
  const result = await makeRequest('GET', '/properties/featured');
  
  if (result.success) {
    console.log('✅ Get featured properties successful');
    console.log(`   Found ${result.data.count} featured properties`);
  } else {
    console.log('❌ Get featured properties failed');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error, null, 2)}`);
  }
  
  return result.success;
};

// Test 3: Create property (protected route)
const testCreateProperty = async () => {
  console.log('\n🏠 Test 3: Create Property (Protected)...');
  
  const formData = new FormData();
  
  // Add property data to form
  Object.keys(TEST_PROPERTY).forEach(key => {
    formData.append(key, TEST_PROPERTY[key]);
  });
  
  const result = await makeFormRequest('POST', '/properties', formData, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (result.success) {
    console.log('✅ Property creation successful');
    console.log(`   Property ID: ${result.data.data._id}`);
    console.log(`   Title: ${result.data.data.title}`);
    console.log(`   Status: ${result.data.data.isApproved ? 'Approved' : 'Pending Approval'}`);
    propertyId = result.data.data._id;
  } else {
    console.log('❌ Property creation failed');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error, null, 2)}`);
  }
  
  return result.success;
};

// Test 4: Get single property by ID
const testGetPropertyById = async () => {
  console.log('\n🔍 Test 4: Get Property by ID...');
  
  if (!propertyId) {
    console.log('❌ No property ID available for testing');
    return false;
  }
  
  const result = await makeRequest('GET', `/properties/${propertyId}`);
  
  if (result.success) {
    console.log('✅ Get property by ID successful');
    console.log(`   Title: ${result.data.data.title}`);
    console.log(`   Price: ${result.data.data.price}`);
    console.log(`   Owner: ${result.data.data.owner.name}`);
    console.log(`   Views: ${result.data.data.views}`);
  } else {
    console.log('❌ Get property by ID failed');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error, null, 2)}`);
  }
  
  return result.success;
};

// Test 5: Get user's own listings
const testGetMyListings = async () => {
  console.log('\n📝 Test 5: Get My Listings (Protected)...');
  
  const result = await makeRequest('GET', '/properties/my-listings', null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (result.success) {
    console.log('✅ Get my listings successful');
    console.log(`   Found ${result.data.count} listings`);
    console.log(`   Total: ${result.data.total}`);
  } else {
    console.log('❌ Get my listings failed');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error, null, 2)}`);
  }
  
  return result.success;
};

// Test 6: Update property
const testUpdateProperty = async () => {
  console.log('\n✏️ Test 6: Update Property (Protected)...');
  
  if (!propertyId) {
    console.log('❌ No property ID available for testing');
    return false;
  }
  
  const formData = new FormData();
  formData.append('title', 'Updated Test Property');
  formData.append('price', '600000');
  formData.append('rooms', '4');
  
  const result = await makeFormRequest('PUT', `/properties/${propertyId}`, formData, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (result.success) {
    console.log('✅ Property update successful');
    console.log(`   Updated title: ${result.data.data.title}`);
    console.log(`   Updated price: ${result.data.data.price}`);
    console.log(`   Updated rooms: ${result.data.data.rooms}`);
  } else {
    console.log('❌ Property update failed');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error, null, 2)}`);
  }
  
  return result.success;
};

// Test 7: Send inquiry
const testSendInquiry = async () => {
  console.log('\n💬 Test 7: Send Inquiry (Protected)...');
  
  if (!propertyId) {
    console.log('❌ No property ID available for testing');
    return false;
  }
  
  const inquiryData = {
    message: 'I am interested in this property. Can we schedule a viewing?',
    phone: '+1234567890',
    email: 'buyer@example.com'
  };
  
  const result = await makeRequest('POST', `/properties/${propertyId}/inquire`, inquiryData, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (result.success) {
    console.log('✅ Send inquiry successful');
    console.log(`   Inquiry ID: ${result.data.data._id}`);
    console.log(`   Message: ${result.data.data.message}`);
  } else {
    console.log('❌ Send inquiry failed');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error, null, 2)}`);
  }
  
  return result.success;
};

// Test 8: Get similar properties
const testGetSimilarProperties = async () => {
  console.log('\n🔗 Test 8: Get Similar Properties...');
  
  if (!propertyId) {
    console.log('❌ No property ID available for testing');
    return false;
  }
  
  const result = await makeRequest('GET', `/properties/${propertyId}/similar`);
  
  if (result.success) {
    console.log('✅ Get similar properties successful');
    console.log(`   Found ${result.data.count} similar properties`);
  } else {
    console.log('❌ Get similar properties failed');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error, null, 2)}`);
  }
  
  return result.success;
};

// Test 9: Test filtering and search
const testFiltering = async () => {
  console.log('\n🔍 Test 9: Test Filtering and Search...');
  
  // Test status filter
  const statusResult = await makeRequest('GET', '/properties?status=sale');
  if (statusResult.success) {
    console.log(`✅ Status filter: Found ${statusResult.data.count} properties for sale`);
  }
  
  // Test type filter
  const typeResult = await makeRequest('GET', '/properties?type=residential');
  if (typeResult.success) {
    console.log(`✅ Type filter: Found ${typeResult.data.count} residential properties`);
  }
  
  // Test price range filter
  const priceResult = await makeRequest('GET', '/properties?minPrice=400000&maxPrice=700000');
  if (priceResult.success) {
    console.log(`✅ Price range filter: Found ${priceResult.data.count} properties in range`);
  }
  
  // Test city filter
  const cityResult = await makeRequest('GET', '/properties?city=cairo');
  if (cityResult.success) {
    console.log(`✅ City filter: Found ${cityResult.data.count} properties in Cairo`);
  }
  
  // Test keyword search
  const searchResult = await makeRequest('GET', '/properties?keyword=test');
  if (searchResult.success) {
    console.log(`✅ Keyword search: Found ${searchResult.data.count} properties matching 'test'`);
  }
  
  return true;
};

// Test 10: Test unauthorized access
const testUnauthorizedAccess = async () => {
  console.log('\n🔐 Test 10: Test Unauthorized Access...');
  
  // Test creating property without token
  const formData = new FormData();
  formData.append('title', 'Unauthorized Property');
  
  const noTokenResult = await makeFormRequest('POST', '/properties', formData);
  
  if (!noTokenResult.success && noTokenResult.status === 401) {
    console.log('✅ Unauthorized property creation blocked correctly');
  } else {
    console.log('❌ Unauthorized property creation not blocked');
  }
  
  // Test accessing my listings without token
  const noTokenListingsResult = await makeRequest('GET', '/properties/my-listings');
  
  if (!noTokenListingsResult.success && noTokenListingsResult.status === 401) {
    console.log('✅ Unauthorized listings access blocked correctly');
  } else {
    console.log('❌ Unauthorized listings access not blocked');
  }
  
  return true;
};

// Test 11: Delete property
const testDeleteProperty = async () => {
  console.log('\n🗑️ Test 11: Delete Property (Protected)...');
  
  if (!propertyId) {
    console.log('❌ No property ID available for testing');
    return false;
  }
  
  const result = await makeRequest('DELETE', `/properties/${propertyId}`, null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (result.success) {
    console.log('✅ Property deletion successful');
    console.log(`   Message: ${result.data.message}`);
  } else {
    console.log('❌ Property deletion failed');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error, null, 2)}`);
  }
  
  return result.success;
};

// Main test runner
const runTests = async () => {
  console.log('🚀 Starting Property Routes Integration Tests');
  console.log('=============================================');
  
  try {
    // Test server health first
    console.log('\n🏥 Testing Server Health...');
    const healthResult = await makeRequest('GET', '/health');
    
    if (!healthResult.success) {
      console.log('❌ Server is not running or not accessible');
      console.log('   Please make sure the server is running on http://localhost:5000');
      return;
    }
    
    console.log('✅ Server is running and accessible');
    
    // Setup user
    const userSetup = await setupUser();
    if (!userSetup) {
      console.log('❌ Failed to setup test user');
      return;
    }
    
    // Run all tests
    await testGetAllProperties();
    await testGetFeaturedProperties();
    await testCreateProperty();
    await testGetPropertyById();
    await testGetMyListings();
    await testUpdateProperty();
    await testSendInquiry();
    await testGetSimilarProperties();
    await testFiltering();
    await testUnauthorizedAccess();
    await testDeleteProperty();
    
    console.log('\n🎉 Property Routes Integration Tests Completed!');
    console.log('=============================================');
    
  } catch (error) {
    console.error('\n💥 Test runner error:', error.message);
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  runTests,
  testGetAllProperties,
  testGetFeaturedProperties,
  testCreateProperty,
  testGetPropertyById,
  testGetMyListings,
  testUpdateProperty,
  testSendInquiry,
  testGetSimilarProperties,
  testFiltering,
  testUnauthorizedAccess,
  testDeleteProperty
};