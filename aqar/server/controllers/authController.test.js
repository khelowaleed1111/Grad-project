const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

describe('Auth Controller', () => {
  let mongoServer;
  let testUser;
  let authToken;

  beforeAll(async () => {
    // Start in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Connect to the in-memory database
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Clean up
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear database before each test
    await User.deleteMany({});
    
    // Create a test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword123',
      phone: '+1234567890',
      role: 'buyer'
    });
    
    // Generate auth token
    authToken = generateToken(testUser);
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'newpassword123',
        phone: '+9876543210',
        role: 'owner'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Registration successful');
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.role).toBe(userData.role);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should reject registration with existing email', async () => {
      const userData = {
        name: 'Another User',
        email: 'test@example.com', // Same as existing user
        password: 'anotherpassword123',
        role: 'buyer'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User already exists with this email');
    });

    it('should reject registration with invalid email format', async () => {
      const userData = {
        name: 'Invalid User',
        email: 'invalid-email',
        password: 'validpassword123',
        role: 'buyer'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject registration with short password', async () => {
      const userData = {
        name: 'Short Pass User',
        email: 'shortpass@example.com',
        password: '123', // Too short
        role: 'buyer'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should default role to buyer if not specified', async () => {
      const userData = {
        name: 'Default Role User',
        email: 'defaultrole@example.com',
        password: 'validpassword123'
        // No role specified
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.data.user.role).toBe('buyer');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'testpassword123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should reject login with invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'testpassword123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should reject login with invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should reject login with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Please provide email and password');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testUser._id.toString());
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data.password).toBeUndefined();
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Not authorized, no token provided');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Not authorized, token failed');
    });
  });

  describe('PUT /api/auth/update-profile', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        phone: '+9999999999'
      };

      const response = await request(app)
        .put('/api/auth/update-profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Profile updated successfully');
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.phone).toBe(updateData.phone);
    });

    it('should reject update without authentication', async () => {
      const updateData = {
        name: 'Updated Name'
      };

      const response = await request(app)
        .put('/api/auth/update-profile')
        .send(updateData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/auth/change-password', () => {
    it('should change password successfully', async () => {
      const passwordData = {
        currentPassword: 'testpassword123',
        newPassword: 'newpassword123'
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Password changed successfully');

      // Verify new password works for login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: passwordData.newPassword
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
    });

    it('should reject password change with wrong current password', async () => {
      const passwordData = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123'
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Current password is incorrect');
    });

    it('should reject password change with short new password', async () => {
      const passwordData = {
        currentPassword: 'testpassword123',
        newPassword: '123' // Too short
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('New password must be at least 8 characters');
    });

    it('should reject password change without authentication', async () => {
      const passwordData = {
        currentPassword: 'testpassword123',
        newPassword: 'newpassword123'
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .send(passwordData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Security Features', () => {
    it('should hash passwords before storing', async () => {
      const userData = {
        name: 'Security Test User',
        email: 'security@example.com',
        password: 'plaintextpassword123',
        role: 'buyer'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Check that password is hashed in database
      const user = await User.findOne({ email: userData.email }).select('+password');
      expect(user.password).not.toBe(userData.password);
      expect(user.password).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt hash pattern
    });

    it('should generate valid JWT tokens', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'testpassword123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      const token = response.body.data.token;
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should exclude password from user responses', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.password).toBeUndefined();
      expect(response.body.data._id).toBeDefined();
      expect(response.body.data.email).toBeDefined();
    });
  });

  describe('Input Validation', () => {
    it('should validate required fields for registration', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({}) // Empty data
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should validate email format', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email-format',
        password: 'validpassword123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should validate password length', async () => {
      const userData = {
        name: 'Test User',
        email: 'valid@example.com',
        password: '123' // Too short
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should validate role enum values', async () => {
      const userData = {
        name: 'Test User',
        email: 'valid@example.com',
        password: 'validpassword123',
        role: 'invalid-role'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});