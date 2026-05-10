const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

// Mock Cloudinary to avoid actual uploads during testing
jest.mock('../config/cloudinary', () => ({
  uploadImage: jest.fn().mockResolvedValue({
    url: 'https://res.cloudinary.com/test/image/upload/v1234567890/test.jpg',
    public_id: 'test_avatar'
  })
}));

describe('Auth Routes', () => {
  let testUser;
  let authToken;

  beforeEach(async () => {
    // Clear users collection
    await User.deleteMany({});

    // Create a test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123',
      phone: '+1234567890',
      role: 'buyer'
    });

    // Generate auth token
    authToken = generateToken({ userId: testUser._id, role: testUser.role });
  });

  afterEach(async () => {
    // Clean up after each test
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'NewPass123',
        phone: '+1987654321',
        role: 'owner'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Registration successful');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.user.role).toBe(userData.role);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should reject registration with invalid email', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'TestPass123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: 'Please enter a valid email'
          })
        ])
      );
    });

    it('should reject registration with weak password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'weak'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'password'
          })
        ])
      );
    });

    it('should reject registration with existing email', async () => {
      const userData = {
        name: 'Another User',
        email: testUser.email, // Use existing email
        password: 'TestPass123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should reject registration with invalid role', async () => {
      const userData = {
        name: 'Test User',
        email: 'test2@example.com',
        password: 'TestPass123',
        role: 'invalid_role'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'role',
            message: 'Role must be buyer, owner, or agent'
          })
        ])
      );
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const loginData = {
        email: testUser.email,
        password: 'TestPass123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should reject login with invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'TestPass123'
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
        email: testUser.email,
        password: 'WrongPassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should reject login with malformed email', async () => {
      const loginData = {
        email: 'invalid-email',
        password: 'TestPass123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should reject login with missing password', async () => {
      const loginData = {
        email: testUser.email
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'password',
            message: 'Password is required'
          })
        ])
      );
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
      expect(response.body.message).toContain('no token');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('token failed');
    });
  });

  describe('PUT /api/auth/update-profile', () => {
    it('should update user profile with valid data', async () => {
      const updateData = {
        name: 'Updated Name',
        phone: '+1111111111'
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

    it('should reject update with invalid phone number', async () => {
      const updateData = {
        phone: 'invalid-phone'
      };

      const response = await request(app)
        .put('/api/auth/update-profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'phone',
            message: 'Please enter a valid phone number'
          })
        ])
      );
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
    it('should change password with valid data', async () => {
      const passwordData = {
        currentPassword: 'TestPass123',
        newPassword: 'NewPass123'
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Password changed successfully');
    });

    it('should reject password change with incorrect current password', async () => {
      const passwordData = {
        currentPassword: 'WrongPassword',
        newPassword: 'NewPass123'
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Current password is incorrect');
    });

    it('should reject password change with weak new password', async () => {
      const passwordData = {
        currentPassword: 'TestPass123',
        newPassword: 'weak'
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'newPassword'
          })
        ])
      );
    });

    it('should reject password change without authentication', async () => {
      const passwordData = {
        currentPassword: 'TestPass123',
        newPassword: 'NewPass123'
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .send(passwordData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});