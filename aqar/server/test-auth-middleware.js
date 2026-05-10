/**
 * Simple test runner for authentication middleware
 * This tests the core functionality without Jest
 */

const { protect, authorize, isAdmin, checkOwnership } = require('./middleware/authMiddleware');

// Mock User model
const mockUser = {
  _id: 'user123',
  name: 'Test User',
  email: 'test@example.com',
  role: 'buyer',
};

// Mock generateToken utility
const mockGenerateToken = {
  extractTokenFromHeader: (authHeader) => {
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  },
  verifyToken: (token) => {
    if (token === 'valid-token') {
      return { userId: 'user123', role: 'buyer' };
    }
    return null;
  }
};

// Mock User.findById
const User = {
  findById: (id) => ({
    select: () => Promise.resolve(id === 'user123' ? mockUser : null)
  })
};

// Replace the actual modules with mocks
require.cache[require.resolve('./models/User')] = {
  exports: User
};

require.cache[require.resolve('./utils/generateToken')] = {
  exports: mockGenerateToken
};

// Test helper functions
function createMockRequest(authHeader = null, user = null, resource = null) {
  return {
    headers: authHeader ? { authorization: authHeader } : {},
    user,
    resource
  };
}

function createMockResponse() {
  const res = {
    statusCode: null,
    jsonData: null,
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      this.jsonData = data;
      return this;
    }
  };
  return res;
}

function createMockNext() {
  let called = false;
  return function() {
    called = true;
  };
}

// Test cases
async function runTests() {
  console.log('🧪 Testing Authentication Middleware...\n');
  
  let passed = 0;
  let failed = 0;

  // Test 1: protect middleware with valid token
  try {
    const req = createMockRequest('Bearer valid-token');
    const res = createMockResponse();
    const next = createMockNext();

    await protect(req, res, next);

    if (req.user && req.user._id === 'user123' && !res.statusCode) {
      console.log('✅ Test 1 PASSED: protect middleware with valid token');
      passed++;
    } else {
      console.log('❌ Test 1 FAILED: protect middleware with valid token');
      failed++;
    }
  } catch (error) {
    console.log('❌ Test 1 FAILED: protect middleware with valid token -', error.message);
    failed++;
  }

  // Test 2: protect middleware without token
  try {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();

    await protect(req, res, next);

    if (res.statusCode === 401 && res.jsonData.message === 'Not authorized, no token provided') {
      console.log('✅ Test 2 PASSED: protect middleware without token');
      passed++;
    } else {
      console.log('❌ Test 2 FAILED: protect middleware without token');
      failed++;
    }
  } catch (error) {
    console.log('❌ Test 2 FAILED: protect middleware without token -', error.message);
    failed++;
  }

  // Test 3: authorize middleware with correct role
  try {
    const req = createMockRequest(null, { _id: 'user123', role: 'buyer' });
    const res = createMockResponse();
    const next = createMockNext();

    const middleware = authorize('buyer', 'owner');
    middleware(req, res, next);

    if (!res.statusCode) {
      console.log('✅ Test 3 PASSED: authorize middleware with correct role');
      passed++;
    } else {
      console.log('❌ Test 3 FAILED: authorize middleware with correct role');
      failed++;
    }
  } catch (error) {
    console.log('❌ Test 3 FAILED: authorize middleware with correct role -', error.message);
    failed++;
  }

  // Test 4: authorize middleware with incorrect role
  try {
    const req = createMockRequest(null, { _id: 'user123', role: 'buyer' });
    const res = createMockResponse();
    const next = createMockNext();

    const middleware = authorize('admin');
    middleware(req, res, next);

    if (res.statusCode === 403) {
      console.log('✅ Test 4 PASSED: authorize middleware with incorrect role');
      passed++;
    } else {
      console.log('❌ Test 4 FAILED: authorize middleware with incorrect role');
      failed++;
    }
  } catch (error) {
    console.log('❌ Test 4 FAILED: authorize middleware with incorrect role -', error.message);
    failed++;
  }

  // Test 5: isAdmin middleware with admin user
  try {
    const req = createMockRequest(null, { _id: 'user123', role: 'admin' });
    const res = createMockResponse();
    const next = createMockNext();

    isAdmin(req, res, next);

    if (!res.statusCode) {
      console.log('✅ Test 5 PASSED: isAdmin middleware with admin user');
      passed++;
    } else {
      console.log('❌ Test 5 FAILED: isAdmin middleware with admin user');
      failed++;
    }
  } catch (error) {
    console.log('❌ Test 5 FAILED: isAdmin middleware with admin user -', error.message);
    failed++;
  }

  // Test 6: isAdmin middleware with non-admin user
  try {
    const req = createMockRequest(null, { _id: 'user123', role: 'buyer' });
    const res = createMockResponse();
    const next = createMockNext();

    isAdmin(req, res, next);

    if (res.statusCode === 403) {
      console.log('✅ Test 6 PASSED: isAdmin middleware with non-admin user');
      passed++;
    } else {
      console.log('❌ Test 6 FAILED: isAdmin middleware with non-admin user');
      failed++;
    }
  } catch (error) {
    console.log('❌ Test 6 FAILED: isAdmin middleware with non-admin user -', error.message);
    failed++;
  }

  // Test 7: checkOwnership middleware with owner
  try {
    const req = createMockRequest(null, { _id: 'user123', role: 'owner' }, { owner: 'user123' });
    const res = createMockResponse();
    const next = createMockNext();

    const middleware = checkOwnership();
    await middleware(req, res, next);

    if (!res.statusCode) {
      console.log('✅ Test 7 PASSED: checkOwnership middleware with owner');
      passed++;
    } else {
      console.log('❌ Test 7 FAILED: checkOwnership middleware with owner');
      failed++;
    }
  } catch (error) {
    console.log('❌ Test 7 FAILED: checkOwnership middleware with owner -', error.message);
    failed++;
  }

  // Test 8: checkOwnership middleware with admin
  try {
    const req = createMockRequest(null, { _id: 'user123', role: 'admin' }, { owner: 'different-user' });
    const res = createMockResponse();
    const next = createMockNext();

    const middleware = checkOwnership();
    await middleware(req, res, next);

    if (!res.statusCode) {
      console.log('✅ Test 8 PASSED: checkOwnership middleware with admin');
      passed++;
    } else {
      console.log('❌ Test 8 FAILED: checkOwnership middleware with admin');
      failed++;
    }
  } catch (error) {
    console.log('❌ Test 8 FAILED: checkOwnership middleware with admin -', error.message);
    failed++;
  }

  // Summary
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! Authentication middleware is working correctly.');
    return true;
  } else {
    console.log('⚠️  Some tests failed. Please check the implementation.');
    return false;
  }
}

// Set up environment
process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

// Run tests
runTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});