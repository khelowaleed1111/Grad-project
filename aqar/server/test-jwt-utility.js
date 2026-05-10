// Manual test script for JWT utility
// Run with: node test-jwt-utility.js

require('dotenv').config();

// Set test environment variables
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
process.env.JWT_EXPIRE = '7d';
process.env.NODE_ENV = 'test';

const {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
  generateUserToken,
  decodeToken,
  isTokenExpired,
} = require('./utils/generateToken');

console.log('🧪 Testing JWT Token Utility...\n');

// Test 1: Generate token with user object
console.log('Test 1: Generate token with user object');
try {
  const user = {
    _id: '507f1f77bcf86cd799439011',
    role: 'buyer',
  };
  
  const token = generateToken(user);
  console.log('✅ Token generated successfully');
  console.log('Token length:', token.length);
  console.log('Token parts:', token.split('.').length);
  
  // Verify the token
  const decoded = verifyToken(token);
  if (decoded && decoded.userId === user._id && decoded.role === user.role) {
    console.log('✅ Token verification successful');
    console.log('Decoded payload:', { userId: decoded.userId, role: decoded.role });
  } else {
    console.log('❌ Token verification failed');
  }
} catch (error) {
  console.log('❌ Test failed:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// Test 2: Generate token with userId and role
console.log('Test 2: Generate token with userId and role');
try {
  const userId = '507f1f77bcf86cd799439011';
  const role = 'owner';
  
  const token = generateToken(userId, role);
  console.log('✅ Token generated successfully');
  
  const decoded = verifyToken(token);
  if (decoded && decoded.userId === userId && decoded.role === role) {
    console.log('✅ Token verification successful');
    console.log('Decoded payload:', { userId: decoded.userId, role: decoded.role });
  } else {
    console.log('❌ Token verification failed');
  }
} catch (error) {
  console.log('❌ Test failed:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// Test 3: Extract token from Authorization header
console.log('Test 3: Extract token from Authorization header');
try {
  const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
  const authHeader = `Bearer ${testToken}`;
  
  const extractedToken = extractTokenFromHeader(authHeader);
  if (extractedToken === testToken) {
    console.log('✅ Token extraction successful');
    console.log('Extracted token:', extractedToken);
  } else {
    console.log('❌ Token extraction failed');
  }
  
  // Test invalid header
  const invalidResult = extractTokenFromHeader('Invalid Header');
  if (invalidResult === null) {
    console.log('✅ Invalid header correctly rejected');
  } else {
    console.log('❌ Invalid header should return null');
  }
} catch (error) {
  console.log('❌ Test failed:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// Test 4: Generate user token (convenience method)
console.log('Test 4: Generate user token (convenience method)');
try {
  const user = {
    _id: '507f1f77bcf86cd799439011',
    role: 'admin',
    name: 'Test User',
    email: 'test@example.com',
  };
  
  const token = generateUserToken(user);
  console.log('✅ User token generated successfully');
  
  const decoded = verifyToken(token);
  if (decoded && decoded.userId === user._id && decoded.role === user.role) {
    console.log('✅ User token verification successful');
    console.log('Decoded payload:', { userId: decoded.userId, role: decoded.role });
  } else {
    console.log('❌ User token verification failed');
  }
} catch (error) {
  console.log('❌ Test failed:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// Test 5: Token expiration check
console.log('Test 5: Token expiration check');
try {
  const user = { _id: '507f1f77bcf86cd799439011', role: 'buyer' };
  const token = generateToken(user);
  
  const isExpired = isTokenExpired(token);
  if (!isExpired) {
    console.log('✅ Fresh token correctly identified as not expired');
  } else {
    console.log('❌ Fresh token incorrectly identified as expired');
  }
  
  // Test invalid token
  const invalidExpired = isTokenExpired('invalid.token');
  if (invalidExpired) {
    console.log('✅ Invalid token correctly identified as expired');
  } else {
    console.log('❌ Invalid token should be identified as expired');
  }
} catch (error) {
  console.log('❌ Test failed:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// Test 6: Error handling
console.log('Test 6: Error handling');
try {
  // Test missing JWT_SECRET
  const originalSecret = process.env.JWT_SECRET;
  delete process.env.JWT_SECRET;
  
  try {
    generateToken({ _id: '123', role: 'buyer' });
    console.log('❌ Should have thrown error for missing JWT_SECRET');
  } catch (error) {
    console.log('✅ Correctly threw error for missing JWT_SECRET:', error.message);
  }
  
  // Restore JWT_SECRET
  process.env.JWT_SECRET = originalSecret;
  
  // Test invalid parameters
  try {
    generateToken();
    console.log('❌ Should have thrown error for invalid parameters');
  } catch (error) {
    console.log('✅ Correctly threw error for invalid parameters:', error.message);
  }
  
  // Test invalid user object
  try {
    generateUserToken({});
    console.log('❌ Should have thrown error for invalid user object');
  } catch (error) {
    console.log('✅ Correctly threw error for invalid user object:', error.message);
  }
} catch (error) {
  console.log('❌ Test failed:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// Test 7: Security features
console.log('Test 7: Security features');
try {
  const user = { _id: '507f1f77bcf86cd799439011', role: 'buyer' };
  const token = generateToken(user);
  
  // Decode token to check security features
  const decoded = decodeToken(token);
  if (decoded) {
    console.log('✅ Token decoded successfully');
    
    // Check for issuer and audience
    if (decoded.iss === 'aqar-platform') {
      console.log('✅ Correct issuer set');
    } else {
      console.log('❌ Incorrect or missing issuer');
    }
    
    if (decoded.aud === 'aqar-users') {
      console.log('✅ Correct audience set');
    } else {
      console.log('❌ Incorrect or missing audience');
    }
    
    // Check expiration is set
    if (decoded.exp) {
      console.log('✅ Expiration time set');
      const expirationTime = decoded.exp - decoded.iat;
      const expectedExpiration = 7 * 24 * 60 * 60; // 7 days in seconds
      if (expirationTime === expectedExpiration) {
        console.log('✅ Correct 7-day expiration');
      } else {
        console.log('❌ Incorrect expiration time');
      }
    } else {
      console.log('❌ Expiration time not set');
    }
  } else {
    console.log('❌ Token decoding failed');
  }
} catch (error) {
  console.log('❌ Test failed:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');
console.log('🎉 JWT Token Utility Testing Complete!');
console.log('\nThe JWT utility is ready for integration with:');
console.log('- User authentication system');
console.log('- Authentication middleware');
console.log('- Role-based authorization');
console.log('- Security best practices (7-day expiry, HS256 algorithm, issuer/audience claims)');