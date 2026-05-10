const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const { generateToken } = require('../utils/generateToken');
const connectDB = require('../config/db');
const mongoose = require('mongoose');

describe('Admin Routes', () => {
  let adminToken;
  let buyerToken;
  let adminUser;
  let buyerUser;
  let testProperty;

  beforeAll(async () => {
    // Connect to test database
    await connectDB();
  });

  beforeEach(async () => {
    // Clear collections
    await User.deleteMany({});
    await Property.deleteMany({});
    await Inquiry.deleteMany({});

    // Create admin user
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
    });
    adminToken = generateToken(adminUser._id);

    // Create buyer user
    buyerUser = await User.create({
      name: 'Buyer User',
      email: 'buyer@test.com',
      password: 'password123',
      role: 'buyer',
    });
    buyerToken = generateToken(buyerUser._id);

    // Create test property
    testProperty = await Property.create({
      title: 'Test Property',
      description: 'Test description',
      price: 100000,
      status: 'sale',
      type: 'residential',
      area: 150,
      location: {
        address: '123 Test St',
        city: 'Cairo',
        country: 'Egypt',
        coordinates: {
          lat: 30.0444,
          lng: 31.2357,
        },
      },
      owner: buyerUser._id,
      isApproved: false,
    });
  });

  afterAll(async () => {
    // Clean up and close connection
    await User.deleteMany({});
    await Property.deleteMany({});
    await Inquiry.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/admin/stats', () => {
    it('should return platform statistics for admin', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('users');
      expect(res.body.data).toHaveProperty('properties');
      expect(res.body.data).toHaveProperty('inquiries');
      expect(res.body.data.users.total).toBe(2); // admin + buyer
      expect(res.body.data.properties.total).toBe(1);
    });

    it('should reject non-admin user', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Admin access required');
    });

    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/api/admin/stats');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/admin/users', () => {
    it('should return paginated user list for admin', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.count).toBe(2);
      expect(res.body.pagination).toHaveProperty('page');
      expect(res.body.pagination).toHaveProperty('totalPages');
    });

    it('should filter users by role', async () => {
      const res = await request(app)
        .get('/api/admin/users?role=buyer')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.every((user) => user.role === 'buyer')).toBe(true);
    });

    it('should search users by name or email', async () => {
      const res = await request(app)
        .get('/api/admin/users?search=buyer')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should reject non-admin user', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('PUT /api/admin/users/:id/role', () => {
    it('should update user role for admin', async () => {
      const res = await request(app)
        .put(`/api/admin/users/${buyerUser._id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'owner' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.role).toBe('owner');

      // Verify in database
      const updatedUser = await User.findById(buyerUser._id);
      expect(updatedUser.role).toBe('owner');
    });

    it('should reject invalid role', async () => {
      const res = await request(app)
        .put(`/api/admin/users/${buyerUser._id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'invalid_role' });

      expect(res.status).toBe(400);
    });

    it('should prevent admin from changing their own role', async () => {
      const res = await request(app)
        .put(`/api/admin/users/${adminUser._id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'buyer' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Cannot change your own role');
    });

    it('should reject non-admin user', async () => {
      const res = await request(app)
        .put(`/api/admin/users/${buyerUser._id}/role`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ role: 'owner' });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/admin/users/:id', () => {
    it('should delete user and their properties for admin', async () => {
      const res = await request(app)
        .delete(`/api/admin/users/${buyerUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('deleted successfully');

      // Verify user is deleted
      const deletedUser = await User.findById(buyerUser._id);
      expect(deletedUser).toBeNull();

      // Verify user's properties are deleted
      const userProperties = await Property.find({ owner: buyerUser._id });
      expect(userProperties.length).toBe(0);
    });

    it('should prevent admin from deleting themselves', async () => {
      const res = await request(app)
        .delete(`/api/admin/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Cannot delete your own account');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/admin/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });

    it('should reject non-admin user', async () => {
      const res = await request(app)
        .delete(`/api/admin/users/${buyerUser._id}`)
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/admin/listings', () => {
    it('should return all listings including unapproved for admin', async () => {
      const res = await request(app)
        .get('/api/admin/listings')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.count).toBe(1);
    });

    it('should filter listings by approval status', async () => {
      const res = await request(app)
        .get('/api/admin/listings?isApproved=false')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.every((listing) => listing.isApproved === false)).toBe(true);
    });

    it('should filter listings by status', async () => {
      const res = await request(app)
        .get('/api/admin/listings?status=sale')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.every((listing) => listing.status === 'sale')).toBe(true);
    });

    it('should populate owner information', async () => {
      const res = await request(app)
        .get('/api/admin/listings')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data[0].owner).toHaveProperty('name');
      expect(res.body.data[0].owner).toHaveProperty('email');
    });

    it('should reject non-admin user', async () => {
      const res = await request(app)
        .get('/api/admin/listings')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/admin/listings/pending', () => {
    it('should return only pending listings for admin', async () => {
      // Create approved property
      await Property.create({
        title: 'Approved Property',
        description: 'Test description',
        price: 200000,
        status: 'rent',
        type: 'commercial',
        area: 200,
        location: {
          address: '456 Test Ave',
          city: 'Alexandria',
          country: 'Egypt',
          coordinates: {
            lat: 31.2001,
            lng: 29.9187,
          },
        },
        owner: buyerUser._id,
        isApproved: true,
      });

      const res = await request(app)
        .get('/api/admin/listings/pending')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.every((listing) => listing.isApproved === false)).toBe(true);
      expect(res.body.count).toBe(1); // Only the unapproved one
    });

    it('should reject non-admin user', async () => {
      const res = await request(app)
        .get('/api/admin/listings/pending')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('PUT /api/admin/listings/:id/approve', () => {
    it('should approve listing for admin', async () => {
      const res = await request(app)
        .put(`/api/admin/listings/${testProperty._id}/approve`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isApproved).toBe(true);

      // Verify in database
      const approvedProperty = await Property.findById(testProperty._id);
      expect(approvedProperty.isApproved).toBe(true);
    });

    it('should return 404 for non-existent property', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/admin/listings/${fakeId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });

    it('should reject non-admin user', async () => {
      const res = await request(app)
        .put(`/api/admin/listings/${testProperty._id}/approve`)
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/admin/listings/:id', () => {
    it('should delete listing for admin', async () => {
      const res = await request(app)
        .delete(`/api/admin/listings/${testProperty._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('rejected and deleted');

      // Verify property is deleted
      const deletedProperty = await Property.findById(testProperty._id);
      expect(deletedProperty).toBeNull();
    });

    it('should return 404 for non-existent property', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/admin/listings/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });

    it('should reject non-admin user', async () => {
      const res = await request(app)
        .delete(`/api/admin/listings/${testProperty._id}`)
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('PUT /api/admin/listings/:id/feature', () => {
    it('should toggle featured status for admin', async () => {
      // Feature the property
      const res1 = await request(app)
        .put(`/api/admin/listings/${testProperty._id}/feature`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res1.status).toBe(200);
      expect(res1.body.success).toBe(true);
      expect(res1.body.data.isFeatured).toBe(true);

      // Unfeature the property
      const res2 = await request(app)
        .put(`/api/admin/listings/${testProperty._id}/feature`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res2.status).toBe(200);
      expect(res2.body.data.isFeatured).toBe(false);
    });

    it('should return 404 for non-existent property', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/admin/listings/${fakeId}/feature`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });

    it('should reject non-admin user', async () => {
      const res = await request(app)
        .put(`/api/admin/listings/${testProperty._id}/feature`)
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('Authorization Tests', () => {
    it('should reject all admin routes without authentication', async () => {
      const routes = [
        { method: 'get', path: '/api/admin/stats' },
        { method: 'get', path: '/api/admin/users' },
        { method: 'get', path: '/api/admin/listings' },
        { method: 'get', path: '/api/admin/listings/pending' },
      ];

      for (const route of routes) {
        const res = await request(app)[route.method](route.path);
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      }
    });

    it('should reject all admin routes for non-admin roles', async () => {
      // Create owner and agent users
      const ownerUser = await User.create({
        name: 'Owner User',
        email: 'owner@test.com',
        password: 'password123',
        role: 'owner',
      });
      const ownerToken = generateToken(ownerUser._id);

      const agentUser = await User.create({
        name: 'Agent User',
        email: 'agent@test.com',
        password: 'password123',
        role: 'agent',
      });
      const agentToken = generateToken(agentUser._id);

      const routes = [
        { method: 'get', path: '/api/admin/stats' },
        { method: 'get', path: '/api/admin/users' },
      ];

      for (const route of routes) {
        // Test with buyer
        const buyerRes = await request(app)
          [route.method](route.path)
          .set('Authorization', `Bearer ${buyerToken}`);
        expect(buyerRes.status).toBe(403);

        // Test with owner
        const ownerRes = await request(app)
          [route.method](route.path)
          .set('Authorization', `Bearer ${ownerToken}`);
        expect(ownerRes.status).toBe(403);

        // Test with agent
        const agentRes = await request(app)
          [route.method](route.path)
          .set('Authorization', `Bearer ${agentToken}`);
        expect(agentRes.status).toBe(403);
      }
    });
  });
});
