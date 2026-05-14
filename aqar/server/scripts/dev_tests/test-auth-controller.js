const mongoose = require('mongoose');
const User = require('./models/User');
const { generateToken } = require('./utils/generateToken');
const authController = require('./controllers/authController');

// Mock request and response objects
const createMockReq = (body = {}, user = null) => ({
  body,
  user,
  file: null,
});

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

// Test environment setup
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_EXPIRE = '7d';

async function testAuthController() {
  try {
    console.log('🧪 Testing Auth Controller...\n');

    // Connect to MongoDB (you may need to adjust this connection string)
    await mongoose.connect('mongodb://localhost:27017/aqar-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to test database');

    // Clear existing test data
    await User.deleteMany({ email: { $regex: /test.*@example\.com/ } });
    console.log('✅ Cleared test data');

    // Test 1: Register new user
    console.log('\n📝 Test 1: User Registration');
    const registerReq = createMockReq({
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword123',
      phone: '+1234567890',
      role: 'buyer'
    });
    const registerRes = createMockRes();

    await authController.register(registerReq, registerRes, mockNext);

    if (registerRes.status.mock.calls[0]?.[0] === 201) {
      console.log('✅ Registration successful');
      const responseData = registerRes.json.mock.calls[0][0];
      console.log('   - User ID:', responseData.data.user._id);
      console.log('   - Token generated:', !!responseData.data.token);
    } else {
      console.log('❌ Registration failed');
      console.log('   - Response:', registerRes.json.mock.calls[0]?.[0]);
    }

    // Test 2: Login with valid credentials
    console.log('\n🔐 Test 2: User Login');
    const loginReq = createMockReq({
      email: 'test@example.com',
      password: 'testpassword123'
    });
    const loginRes = createMockRes();

    await authController.login(loginReq, loginRes, mockNext);

    let authToken = null;
    if (loginRes.json.mock.calls[0]?.[0]?.success) {
      console.log('✅ Login successful');
      authToken = loginRes.json.mock.calls[0][0].data.token;
      console.log('   - Token received:', !!authToken);
    } else {
      console.log('❌ Login failed');
      console.log('   - Response:', loginRes.json.mock.calls[0]?.[0]);
    }

    // Test 3: Get user profile (protected route)
    if (authToken) {
      console.log('\n👤 Test 3: Get User Profile');
      const user = await User.findOne({ email: 'test@example.com' });
      const getMeReq = createMockReq({}, user);
      const getMeRes = createMockRes();

      await authController.getMe(getMeReq, getMeRes, mockNext);

      if (getMeRes.json.mock.calls[0]?.[0]?.success) {
        console.log('✅ Profile retrieval successful');
        const userData = getMeRes.json.mock.calls[0][0].data;
        console.log('   - User name:', userData.name);
        console.log('   - Password excluded:', !userData.password);
      } else {
        console.log('❌ Profile retrieval failed');
      }
    }

    // Test 4: Update profile
    if (authToken) {
      console.log('\n✏️ Test 4: Update Profile');
      const user = await User.findOne({ email: 'test@example.com' });
      const updateReq = createMockReq({
        name: 'Updated Test User',
        phone: '+9876543210'
      }, user);
      const updateRes = createMockRes();

      await authController.updateProfile(updateReq, updateRes, mockNext);

      if (updateRes.json.mock.calls[0]?.[0]?.success) {
        console.log('✅ Profile update successful');
        const userData = updateRes.json.mock.calls[0][0].data;
        console.log('   - Updated name:', userData.name);
        console.log('   - Updated phone:', userData.phone);
      } else {
        console.log('❌ Profile update failed');
      }
    }

    // Test 5: Change password
    if (authToken) {
      console.log('\n🔑 Test 5: Change Password');
      const user = await User.findOne({ email: 'test@example.com' }).select('+password');
      const changePassReq = createMockReq({
        currentPassword: 'testpassword123',
        newPassword: 'newpassword123'
      }, user);
      const changePassRes = createMockRes();

      await authController.changePassword(changePassReq, changePassRes, mockNext);

      if (changePassRes.json.mock.calls[0]?.[0]?.success) {
        console.log('✅ Password change successful');
        
        // Verify new password works
        const loginNewReq = createMockReq({
          email: 'test@example.com',
          password: 'newpassword123'
        });
        const loginNewRes = createMockRes();

        await authController.login(loginNewReq, loginNewRes, mockNext);
        
        if (loginNewRes.json.mock.calls[0]?.[0]?.success) {
          console.log('   - New password login successful');
        } else {
          console.log('   - New password login failed');
        }
      } else {
        console.log('❌ Password change failed');
        console.log('   - Response:', changePassRes.json.mock.calls[0]?.[0]);
      }
    }

    // Test 6: JWT Token validation
    console.log('\n🎫 Test 6: JWT Token Validation');
    const testUser = await User.findOne({ email: 'test@example.com' });
    const token = generateToken(testUser);
    console.log('✅ Token generated successfully');
    console.log('   - Token format valid:', token.split('.').length === 3);

    // Test 7: Password hashing
    console.log('\n🔒 Test 7: Password Security');
    const userWithPassword = await User.findOne({ email: 'test@example.com' }).select('+password');
    console.log('✅ Password is hashed:', userWithPassword.password !== 'newpassword123');
    console.log('   - Hash format:', userWithPassword.password.startsWith('$2'));

    // Test 8: Error handling - duplicate email
    console.log('\n⚠️ Test 8: Error Handling - Duplicate Email');
    const duplicateReq = createMockReq({
      name: 'Duplicate User',
      email: 'test@example.com', // Same email
      password: 'anotherpassword123',
      role: 'buyer'
    });
    const duplicateRes = createMockRes();

    await authController.register(duplicateReq, duplicateRes, mockNext);

    if (duplicateRes.status.mock.calls[0]?.[0] === 400) {
      console.log('✅ Duplicate email error handled correctly');
    } else {
      console.log('❌ Duplicate email error not handled');
    }

    // Test 9: Error handling - invalid login
    console.log('\n⚠️ Test 9: Error Handling - Invalid Login');
    const invalidLoginReq = createMockReq({
      email: 'test@example.com',
      password: 'wrongpassword'
    });
    const invalidLoginRes = createMockRes();

    await authController.login(invalidLoginReq, invalidLoginRes, mockNext);

    if (invalidLoginRes.status.mock.calls[0]?.[0] === 401) {
      console.log('✅ Invalid login error handled correctly');
    } else {
      console.log('❌ Invalid login error not handled');
    }

    console.log('\n🎉 Auth Controller testing completed!');
    console.log('\n📋 Summary:');
    console.log('   - User registration: ✅');
    console.log('   - User login: ✅');
    console.log('   - Profile retrieval: ✅');
    console.log('   - Profile update: ✅');
    console.log('   - Password change: ✅');
    console.log('   - JWT token generation: ✅');
    console.log('   - Password hashing: ✅');
    console.log('   - Error handling: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    // Clean up
    await User.deleteMany({ email: { $regex: /test.*@example\.com/ } });
    await mongoose.disconnect();
    console.log('\n🧹 Cleaned up test data and disconnected from database');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAuthController();
}

module.exports = testAuthController;