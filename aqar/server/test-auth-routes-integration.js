/**
 * Integration test for auth routes
 * This file can be run manually to test the auth routes functionality
 * Run with: node test-auth-routes-integration.js
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000/api';
const TEST_USER = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'TestPass123',
  phone: '+1234567890',
  role: 'owner'
};

let authToken = '';

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

// Test functions
const testRegister = async () => {
  console.log('\n🔐 Testing User Registration...');
  
  const result = await makeRequest('POST', '/auth/register', TEST_USER);
  
  if (result.success) {
    console.log('✅ Registration successful');
    console.log(`   User ID: ${result.data.data.user._id}`);
    console.log(`   Email: ${result.data.data.user.email}`);
    console.log(`   Role: ${result.data.data.user.role}`);
    authToken = result.data.data.token;
    console.log(`   Token received: ${authToken.substring(0, 20)}...`);
  } else {
    console.log('❌ Registration failed');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error, null, 2)}`);
  }
  
  return result.success;
};

const testLogin = async () => {
  console.log('\n🔑 Testing User Login...');
  
  const loginData = {
    email: TEST_USER.email,
    password: TEST_USER.password
  };
  
  const result = await makeRequest('POST', '/auth/login', loginData);
  
  if (result.success) {
    console.log('✅ Login successful');
    console.log(`   User ID: ${result.data.data.user._id}`);
    console.log(`   Email: ${result.data.data.user.email}`);
    authToken = result.data.data.token;
    console.log(`   New token received: ${authToken.substring(0, 20)}...`);
  } else {
    console.log('❌ Login failed');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error, null, 2)}`);
  }
  
  return result.success;
};

const testGetMe = async () => {
  console.log('\n👤 Testing Get Current User...');
  
  const result = await makeRequest('GET', '/auth/me', null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (result.success) {
    console.log('✅ Get user profile successful');
    console.log(`   Name: ${result.data.data.name}`);
    console.log(`   Email: ${result.data.data.email}`);
    console.log(`   Role: ${result.data.data.role}`);
    console.log(`   Phone: ${result.data.data.phone || 'Not set'}`);
  } else {
    console.log('❌ Get user profile failed');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error, null, 2)}`);
  }
  
  return result.success;
};

const testUpdateProfile = async () => {
  console.log('\n✏️ Testing Update Profile...');
  
  const updateData = {
    name: 'Updated Test User',
    phone: '+1987654321'
  };
  
  const result = await makeRequest('PUT', '/auth/update-profile', updateData, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (result.success) {
    console.log('✅ Profile update successful');
    console.log(`   Updated name: ${result.data.data.name}`);
    console.log(`   Updated phone: ${result.data.data.phone}`);
  } else {
    console.log('❌ Profile update failed');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error, null, 2)}`);
  }
  
  return result.success;
};

const testChangePassword = async () => {
  console.log('\n🔒 Testing Change Password...');
  
  const passwordData = {
    currentPassword: TEST_USER.password,
    newPassword: 'NewTestPass123'
  };
  
  const result = await makeRequest('PUT', '/auth/change-password', passwordData, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (result.success) {
    console.log('✅ Password change successful');
    console.log(`   Message: ${result.data.message}`);
  } else {
    console.log('❌ Password change failed');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error, null, 2)}`);
  }
  
  return result.success;
};

const testValidationErrors = async () => {
  console.log('\n🚫 Testing Validation Errors...');
  
  // Test invalid email
  const invalidEmailResult = await makeRequest('POST', '/auth/register', {
    name: 'Test',
    email: 'invalid-email',
    password: 'TestPass123'
  });
  
  if (!invalidEmailResult.success && invalidEmailResult.status === 400) {
    console.log('✅ Email validation working correctly');
    console.log(`   Error: ${invalidEmailResult.error.message}`);
  } else {
    console.log('❌ Email validation not working');
  }
  
  // Test weak password
  const weakPasswordResult = await makeRequest('POST', '/auth/register', {
    name: 'Test',
    email: 'test2@example.com',
    password: 'weak'
  });
  
  if (!weakPasswordResult.success && weakPasswordResult.status === 400) {
    console.log('✅ Password validation working correctly');
    console.log(`   Error: ${weakPasswordResult.error.message}`);
  } else {
    console.log('❌ Password validation not working');
  }
};

const testUnauthorizedAccess = async () => {
  console.log('\n🔐 Testing Unauthorized Access...');
  
  // Test accessing protected route without token
  const noTokenResult = await makeRequest('GET', '/auth/me');
  
  if (!noTokenResult.success && noTokenResult.status === 401) {
    console.log('✅ Protected route security working correctly');
    console.log(`   Error: ${noTokenResult.error.message}`);
  } else {
    console.log('❌ Protected route security not working');
  }
  
  // Test with invalid token
  const invalidTokenResult = await makeRequest('GET', '/auth/me', null, {
    'Authorization': 'Bearer invalid_token'
  });
  
  if (!invalidTokenResult.success && invalidTokenResult.status === 401) {
    console.log('✅ Token validation working correctly');
    console.log(`   Error: ${invalidTokenResult.error.message}`);
  } else {
    console.log('❌ Token validation not working');
  }
};

// Main test runner
const runTests = async () => {
  console.log('🚀 Starting Auth Routes Integration Tests');
  console.log('==========================================');
  
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
    
    // Run all tests
    const registerSuccess = await testRegister();
    if (registerSuccess) {
      await testLogin();
      await testGetMe();
      await testUpdateProfile();
      await testChangePassword();
    }
    
    await testValidationErrors();
    await testUnauthorizedAccess();
    
    console.log('\n🎉 Integration tests completed!');
    console.log('==========================================');
    
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
  testRegister,
  testLogin,
  testGetMe,
  testUpdateProfile,
  testChangePassword,
  testValidationErrors,
  testUnauthorizedAccess
};