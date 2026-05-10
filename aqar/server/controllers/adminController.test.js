const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const { generateToken } = require('../utils/generateToken');

describe('Admin Controller', () => {
  let adminToken;
  let adminUser;
  let regularUser;
  let testProperty;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
    }
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

    // Create regular user
    regularUser = await User.create({
      name: 'Regular User',
      email: 'user@test.com',
      password: 'password123',
      role: 'buyer',
    });

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
      owner: regularUser._id,
      isApproved: false,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/admin/users', () => {
    it('should get all users with pagination', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(2); // admin + regular user
      expect(res.body.pagination).toBeDefined();
    });

    it('should filter users by role', async () => {
      const res = await request(app)
        .get('/api/admin/users?role=admin')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].role).toBe('admin');
    });

    it('should search users by name or email', async () => {
      const res = await request(app)
        .get('/api/admin/users?search=Regular')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe('Regular User');
    });

    it('should reject non-admin users', async () => {
      const userToken = generateToken(regularUser._id);
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('PUT /api/admin/users/:id/role', () => {
    it('should change user role', async () => {
      const res = await request(app)
        .put(`/api/admin/users/${regularUser._id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'owner' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.role).toBe('owner');

      // Verify in database
      const updatedUser = await User.findById(regularUser._id);
      expect(updatedUser.role).toBe('owner');
    });

    it('should reject invalid role', async () => {
      const res = await request(app)
        .put(`/api/admin/users/${regularUser._id}/role`)
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

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/admin/users/${fakeId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'owner' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/admin/users/:id', () => {
    it('should delete user and their properties', async () => {
      const res = await request(app)
        .delete(`/api/admin/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify user is deleted
      const deletedUser = await User.findById(regularUser._id);
      expect(deletedUser).toBeNull();

      // Verify user's properties are deleted
      const userProperties = await Property.find({ owner: regularUser._id });
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
  });

  describe('GET /api/admin/listings', () => {
    it('should get all listings including unapproved', async () => {
      const res = await request(app)
        .get('/api/admin/listings')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].isApproved).toBe(false);
    });

    it('should filter listings by approval status', async () => {
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
          coordinates: { lat: 31.2001, lng: 29.9187 },
        },
        owner: regularUser._id,
        isApproved: true,
      });

      const res = await request(app)
        .get('/api/admin/listings?isApproved=true')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].isApproved).toBe(true);
    });

    it('should filter listings by status and type', async () => {
      const res = await request(app)
        .get('/api/admin/listings?status=sale&type=residential')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].status).toBe('sale');
      expect(res.body.data[0].type).toBe('residential');
    });

    it('should search listings by title or city', async () => {
      const res = await request(app)
        .get('/api/admin/listings?search=Cairo')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].location.city).toBe('Cairo');
    });
  });

  describe('GET /api/admin/listings/pending', () => {
    it('should get only pending listings', async () => {
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
          coordinates: { lat: 31.2001, lng: 29.9187 },
        },
        owner: regularUser._id,
        isApproved: true,
      });

      const res = await request(app)
        .get('/api/admin/listings/pending')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].isApproved).toBe(false);
    });
  });

  describe('PUT /api/admin/listings/:id/approve', () => {
    it('should approve a property', async () => {
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
  });

  describe('DELETE /api/admin/listings/:id', () => {
    it('should reject/delete a property', async () => {
      const res = await request(app)
        .delete(`/api/admin/listings/${testProperty._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

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
  });

  describe('PUT /api/admin/listings/:id/feature', () => {
    it('should toggle property featured status', async () => {
      // Feature the property
      let res = await request(app)
        .put(`/api/admin/listings/${testProperty._id}/feature`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.isFeatured).toBe(true);

      // Unfeature the property
      res = await request(app)
        .put(`/api/admin/listings/${testProperty._id}/feature`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.isFeatured).toBe(false);
    });
  });

  describe('GET /api/admin/stats', () => {
    beforeEach(async () => {
      // Create additional test data
      await User.create({
        name: 'Owner User',
        email: 'owner@test.com',
        password: 'password123',
        role: 'owner',
      });

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
          coordinates: { lat: 31.2001, lng: 29.9187 },
        },
        owner: regularUser._id,
        isApproved: true,
      });

      await Inquiry.create({
        property: testProperty._id,
        sender: regularUser._id,
        message: 'Test inquiry',
      });
    });

    it('should get platform statistics', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();

      // Check users stats
      expect(res.body.data.users.total).toBe(3); // admin + regular + owner
      expect(res.body.data.users.byRole).toBeDefined();
      expect(res.body.data.users.byRole.admin).toBe(1);
      expect(res.body.data.users.byRole.buyer).toBe(1);
      expect(res.body.data.users.byRole.owner).toBe(1);

      // Check properties stats
      expect(res.body.data.properties.total).toBe(2);
      expect(res.body.data.properties.approved).toBe(1);
      expect(res.body.data.properties.pending).toBe(1);
      expect(res.body.data.properties.byStatus).toBeDefined();
      expect(res.body.data.properties.byType).toBeDefined();

      // Check inquiries stats
      expect(res.body.data.inquiries).toBe(1);
    });

    it('should include recent activity counts', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.users.recent).toBeDefined();
      expect(res.body.data.properties.recent).toBeDefined();
    });
  });
});
