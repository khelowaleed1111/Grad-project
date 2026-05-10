const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const connectDB = require('../config/db');
const mongoose = require('mongoose');

describe('Rate Limiting Middleware', () => {
  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }
  });

  afterAll(async () => {
    // Clean up and close connection
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up users before each test
    await User.deleteMany({});
  });

  describe('POST /api/auth/register - Rate Limiting', () => {
    it('should allow up to 10 requests within 15 minutes', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      };

      // Make 10 requests - all should succeed (or fail with validation, not rate limit)
      for (let i = 0; i < 10; i++) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            ...userData,
            email: `test${i}@example.com`, // Unique email for each request
          });

        // Should not be rate limited (status should be 201 or 400, not 429)
        expect(response.status).not.toBe(429);
      }
    });

    it('should block the 11th request with 429 status', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      };

      // Make 10 successful requests
      for (let i = 0; i < 10; i++) {
        await request(app)
          .post('/api/auth/register')
          .send({
            ...userData,
            email: `test${i}@example.com`,
          });
      }

      // 11th request should be rate limited
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...userData,
          email: 'test11@example.com',
        });

      expect(response.status).toBe(429);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Too many requests, please try again later');
    });

    it('should return appropriate error message when rate limited', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      };

      // Exhaust the rate limit
      for (let i = 0; i < 10; i++) {
        await request(app)
          .post('/api/auth/register')
          .send({
            ...userData,
            email: `test${i}@example.com`,
          });
      }

      // Next request should be rate limited
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...userData,
          email: 'test11@example.com',
        });

      expect(response.status).toBe(429);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Too many requests');
    });
  });

  describe('POST /api/auth/login - Rate Limiting', () => {
    beforeEach(async () => {
      // Create a test user for login attempts
      await User.create({
        name: 'Test User',
        email: 'testlogin@example.com',
        password: 'Password123',
        role: 'buyer',
      });
    });

    it('should allow up to 10 login requests within 15 minutes', async () => {
      const loginData = {
        email: 'testlogin@example.com',
        password: 'Password123',
      };

      // Make 10 requests - all should succeed or fail with auth error, not rate limit
      for (let i = 0; i < 10; i++) {
        const response = await request(app)
          .post('/api/auth/login')
          .send(loginData);

        // Should not be rate limited (status should be 200 or 401, not 429)
        expect(response.status).not.toBe(429);
      }
    });

    it('should block the 11th login request with 429 status', async () => {
      const loginData = {
        email: 'testlogin@example.com',
        password: 'Password123',
      };

      // Make 10 requests
      for (let i = 0; i < 10; i++) {
        await request(app)
          .post('/api/auth/login')
          .send(loginData);
      }

      // 11th request should be rate limited
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(429);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Too many requests, please try again later');
    });
  });

  describe('Rate Limiting on Other Auth Routes', () => {
    let authToken;

    beforeEach(async () => {
      // Create a test user and get auth token
      const user = await User.create({
        name: 'Test User',
        email: 'testauth@example.com',
        password: 'Password123',
        role: 'buyer',
      });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testauth@example.com',
          password: 'Password123',
        });

      authToken = loginResponse.body.token;
    });

    it('should apply rate limiting to GET /api/auth/me', async () => {
      // Make 10 requests
      for (let i = 0; i < 10; i++) {
        const response = await request(app)
          .get('/api/auth/me')
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).not.toBe(429);
      }

      // 11th request should be rate limited
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(429);
    });

    it('should apply rate limiting to PUT /api/auth/update-profile', async () => {
      // Make 10 requests
      for (let i = 0; i < 10; i++) {
        await request(app)
          .put('/api/auth/update-profile')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ name: `Updated Name ${i}` });
      }

      // 11th request should be rate limited
      const response = await request(app)
        .put('/api/auth/update-profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Name 11' });

      expect(response.status).toBe(429);
    });

    it('should apply rate limiting to PUT /api/auth/change-password', async () => {
      // Make 10 requests
      for (let i = 0; i < 10; i++) {
        await request(app)
          .put('/api/auth/change-password')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            currentPassword: 'Password123',
            newPassword: 'NewPassword123',
          });
      }

      // 11th request should be rate limited
      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'Password123',
          newPassword: 'NewPassword123',
        });

      expect(response.status).toBe(429);
    });
  });

  describe('Rate Limiting Window Reset', () => {
    it('should have standard rate limit headers', async () => {
      const userData = {
        name: 'Test User',
        email: 'testheaders@example.com',
        password: 'Password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Check for rate limit headers
      expect(response.headers).toHaveProperty('ratelimit-limit');
      expect(response.headers).toHaveProperty('ratelimit-remaining');
      expect(response.headers).toHaveProperty('ratelimit-reset');
    });

    it('should decrement remaining requests with each call', async () => {
      const responses = [];

      for (let i = 0; i < 3; i++) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Test User',
            email: `testdecrement${i}@example.com`,
            password: 'Password123',
          });

        responses.push(response);
      }

      // Check that remaining count decreases
      const remaining1 = parseInt(responses[0].headers['ratelimit-remaining']);
      const remaining2 = parseInt(responses[1].headers['ratelimit-remaining']);
      const remaining3 = parseInt(responses[2].headers['ratelimit-remaining']);

      expect(remaining2).toBeLessThan(remaining1);
      expect(remaining3).toBeLessThan(remaining2);
    });
  });
});
