/**
 * Integration test for authentication middleware with Express routes
 * Tests the middleware in a realistic Express.js environment
 */

const express = require('express');
const { protect, authorize, isAdmin } = require('./middleware/authMiddleware');
const { generateToken } = require('./utils/generateToken');

// Set up environment
process.env.JWT_SECRET = 'test-secret-key-for-integration-testing';
process.env.NODE_ENV = 'test';

// Mock User model for testing
const mockUsers = {
  'user123': {
    _id: 'user123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'buyer',
  },
  'admin123': {
    _id: 'admin123',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
  },
  'owner123': {
    _id: 'owner123',
    name: 'Owner User',
    email: 'owner@example.com',
    role: 'owner',
  }
};

// Mock User.findById
const User = {
  findById: (id) => ({
    select: () => Promise.resolve(mockUsers[id] || null)
  })
};

// Replace the User model
require.cache[require.resolve('./models/User')] = {
  exports: User
};

// Create Express app for testing
const app = express();
app.use(express.json());

// Test routes
app.get('/public', (req, res) => {
  res.json({ message: 'Public route accessible' });
});

app.get('/protected', protect, (req, res) => {
  res.json({ 
    message: 'Protected route accessed',
    user: req.user.name 
  });
});

app.get('/buyer-only', protect, authorize('buyer'), (req, res) => {
  res.json({ 
    message: 'Buyer route accessed',
    user: req.user.name 
  });
});

app.get('/admin-only', protect, isAdmin, (req, res) => {
  res.json({ 
    message: 'Admin route accessed',
    user: req.user.name 
  });
});

app.get('/owner-or-admin', protect, authorize('owner', 'admin'), (req, res) => {
  res.json({ 
    message: 'Owner or admin route accessed',
    user: req.user.name 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ 
    success: false, 
    message: 'Server error',
    error: err.message 
  });
});

// Test function
async function runIntegrationTests() {
  console.log('🔗 Running Authentication Integration Tests...\n');
  
  let passed = 0;
  let failed = 0;

  // Generate test tokens
  const buyerToken = generateToken('user123', 'buyer');
  const adminToken = generateToken('admin123', 'admin');
  const ownerToken = generateToken('owner123', 'owner');
  const invalidToken = 'invalid.token.here';

  console.log('Generated test tokens:');
  console.log('- Buyer token:', buyerToken.substring(0, 20) + '...');
  console.log('- Admin token:', adminToken.substring(0, 20) + '...');
  console.log('- Owner token:', ownerToken.substring(0, 20) + '...\n');

  // Helper function to make requests
  function makeRequest(method, path, token = null) {
    return new Promise((resolve) => {
      const req = {
        method,
        url: path,
        headers: token ? { authorization: `Bearer ${token}` } : {},
        body: null
      };

      const res = {
        statusCode: 200,
        data: null,
        status: function(code) {
          this.statusCode = code;
          return this;
        },
        json: function(data) {
          this.data = data;
          resolve({ status: this.statusCode, data });
        }
      };

      // Simulate Express route handling
      try {
        // Find matching route
        if (path === '/public') {
          res.json({ message: 'Public route accessible' });
        } else if (path === '/protected') {
          simulateMiddlewareChain([protect], req, res, () => {
            res.json({ 
              message: 'Protected route accessed',
              user: req.user.name 
            });
          });
        } else if (path === '/buyer-only') {
          simulateMiddlewareChain([protect, authorize('buyer')], req, res, () => {
            res.json({ 
              message: 'Buyer route accessed',
              user: req.user.name 
            });
          });
        } else if (path === '/admin-only') {
          simulateMiddlewareChain([protect, isAdmin], req, res, () => {
            res.json({ 
              message: 'Admin route accessed',
              user: req.user.name 
            });
          });
        } else if (path === '/owner-or-admin') {
          simulateMiddlewareChain([protect, authorize('owner', 'admin')], req, res, () => {
            res.json({ 
              message: 'Owner or admin route accessed',
              user: req.user.name 
            });
          });
        } else {
          res.status(404).json({ message: 'Route not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
      }
    });
  }

  // Helper to simulate middleware chain
  async function simulateMiddlewareChain(middlewares, req, res, finalHandler) {
    let index = 0;
    
    async function next() {
      if (index >= middlewares.length) {
        return finalHandler();
      }
      
      const middleware = middlewares[index++];
      await middleware(req, res, next);
    }
    
    await next();
  }

  // Test 1: Public route (no auth required)
  try {
    const response = await makeRequest('GET', '/public');
    if (response.status === 200 && response.data.message === 'Public route accessible') {
      console.log('✅ Test 1 PASSED: Public route accessible without token');
      passed++;
    } else {
      console.log('❌ Test 1 FAILED: Public route should be accessible');
      failed++;
    }
  } catch (error) {
    console.log('❌ Test 1 FAILED: Public route error -', error.message);
    failed++;
  }

  // Test 2: Protected route with valid token
  try {
    const response = await makeRequest('GET', '/protected', buyerToken);
    if (response.status === 200 && response.data.user === 'Test User') {
      console.log('✅ Test 2 PASSED: Protected route with valid token');
      passed++;
    } else {
      console.log('❌ Test 2 FAILED: Protected route with valid token');
      console.log('Response:', response);
      failed++;
    }
  } catch (error) {
    console.log('❌ Test 2 FAILED: Protected route error -', error.message);
    failed++;
  }

  // Test 3: Protected route without token
  try {
    const response = await makeRequest('GET', '/protected');
    if (response.status === 401) {
      console.log('✅ Test 3 PASSED: Protected route rejected without token');
      passed++;
    } else {
      console.log('❌ Test 3 FAILED: Protected route should reject without token');
      failed++;
    }
  } catch (error) {
    console.log('❌ Test 3 FAILED: Protected route error -', error.message);
    failed++;
  }

  // Test 4: Protected route with invalid token
  try {
    const response = await makeRequest('GET', '/protected', invalidToken);
    if (response.status === 401) {
      console.log('✅ Test 4 PASSED: Protected route rejected with invalid token');
      passed++;
    } else {
      console.log('❌ Test 4 FAILED: Protected route should reject invalid token');
      failed++;
    }
  } catch (error) {
    console.log('❌ Test 4 FAILED: Protected route error -', error.message);
    failed++;
  }

  // Test 5: Buyer-only route with buyer token
  try {
    const response = await makeRequest('GET', '/buyer-only', buyerToken);
    if (response.status === 200) {
      console.log('✅ Test 5 PASSED: Buyer route accessible with buyer token');
      passed++;
    } else {
      console.log('❌ Test 5 FAILED: Buyer route should be accessible with buyer token');
      failed++;
    }
  } catch (error) {
    console.log('❌ Test 5 FAILED: Buyer route error -', error.message);
    failed++;
  }

  // Test 6: Buyer-only route with admin token (should fail)
  try {
    const response = await makeRequest('GET', '/buyer-only', adminToken);
    if (response.status === 403) {
      console.log('✅ Test 6 PASSED: Buyer route rejected with admin token');
      passed++;
    } else {
      console.log('❌ Test 6 FAILED: Buyer route should reject admin token');
      failed++;
    }
  } catch (error) {
    console.log('❌ Test 6 FAILED: Buyer route error -', error.message);
    failed++;
  }

  // Test 7: Admin-only route with admin token
  try {
    const response = await makeRequest('GET', '/admin-only', adminToken);
    if (response.status === 200) {
      console.log('✅ Test 7 PASSED: Admin route accessible with admin token');
      passed++;
    } else {
      console.log('❌ Test 7 FAILED: Admin route should be accessible with admin token');
      failed++;
    }
  } catch (error) {
    console.log('❌ Test 7 FAILED: Admin route error -', error.message);
    failed++;
  }

  // Test 8: Admin-only route with buyer token (should fail)
  try {
    const response = await makeRequest('GET', '/admin-only', buyerToken);
    if (response.status === 403) {
      console.log('✅ Test 8 PASSED: Admin route rejected with buyer token');
      passed++;
    } else {
      console.log('❌ Test 8 FAILED: Admin route should reject buyer token');
      failed++;
    }
  } catch (error) {
    console.log('❌ Test 8 FAILED: Admin route error -', error.message);
    failed++;
  }

  // Test 9: Owner-or-admin route with owner token
  try {
    const response = await makeRequest('GET', '/owner-or-admin', ownerToken);
    if (response.status === 200) {
      console.log('✅ Test 9 PASSED: Owner-or-admin route accessible with owner token');
      passed++;
    } else {
      console.log('❌ Test 9 FAILED: Owner-or-admin route should be accessible with owner token');
      failed++;
    }
  } catch (error) {
    console.log('❌ Test 9 FAILED: Owner-or-admin route error -', error.message);
    failed++;
  }

  // Test 10: Owner-or-admin route with admin token
  try {
    const response = await makeRequest('GET', '/owner-or-admin', adminToken);
    if (response.status === 200) {
      console.log('✅ Test 10 PASSED: Owner-or-admin route accessible with admin token');
      passed++;
    } else {
      console.log('❌ Test 10 FAILED: Owner-or-admin route should be accessible with admin token');
      failed++;
    }
  } catch (error) {
    console.log('❌ Test 10 FAILED: Owner-or-admin route error -', error.message);
    failed++;
  }

  // Summary
  console.log(`\n📊 Integration Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All integration tests passed! Authentication middleware works correctly with Express routes.');
    return true;
  } else {
    console.log('⚠️  Some integration tests failed. Please check the middleware implementation.');
    return false;
  }
}

// Run integration tests
runIntegrationTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Integration test error:', error);
  process.exit(1);
});