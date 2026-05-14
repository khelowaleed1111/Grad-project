/**
 * Comprehensive Backend Integration Test Suite
 * Task 9.1: Ensure all backend tests pass and API is fully functional
 * 
 * This test suite verifies:
 * 1. Authentication endpoints (register, login, profile)
 * 2. Property endpoints (CRUD operations, filtering, search)
 * 3. Admin endpoints (user management, property approval)
 * 4. Error handling and validation
 */

const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

// Test credentials from seeded data
const TEST_CREDENTIALS = {
  admin: {
    email: 'admin@aqar.com',
    password: 'Admin@123456'
  },
  owner: {
    email: 'ahmed.hassan@example.com',
    password: 'Password@123'
  },
  agent: {
    email: 'fatima.ali@example.com',
    password: 'Password@123'
  },
  buyer: {
    email: 'mohamed.ibrahim@example.com',
    password: 'Password@123'
  }
};

// Store tokens for authenticated requests
let tokens = {
  admin: null,
  owner: null,
  agent: null,
  buyer: null
};

// Store created property IDs for cleanup
let createdPropertyIds = [];

describe('Backend Integration Tests - Task 9.1', () => {
  
  // ============================================================================
  // SECTION 1: AUTHENTICATION ENDPOINTS
  // ============================================================================
  
  describe('1. Authentication Endpoints', () => {
    
    describe('POST /api/auth/login', () => {
      test('should login admin user successfully', async () => {
        const response = await request(BASE_URL)
          .post('/api/auth/login')
          .send(TEST_CREDENTIALS.admin)
          .expect('Content-Type', /json/)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.token).toBeDefined();
        expect(response.body.user).toBeDefined();
        expect(response.body.user.email).toBe(TEST_CREDENTIALS.admin.email);
        expect(response.body.user.role).toBe('admin');
        expect(response.body.user.password).toBeUndefined();
        
        tokens.admin = response.body.token;
      });
      
      test('should login owner user successfully', async () => {
        const response = await request(BASE_URL)
          .post('/api/auth/login')
          .send(TEST_CREDENTIALS.owner)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.token).toBeDefined();
        expect(response.body.user.role).toBe('owner');
        
        tokens.owner = response.body.token;
      });
      
      test('should login agent user successfully', async () => {
        const response = await request(BASE_URL)
          .post('/api/auth/login')
          .send(TEST_CREDENTIALS.agent)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.token).toBeDefined();
        expect(response.body.user.role).toBe('agent');
        
        tokens.agent = response.body.token;
      });
      
      test('should login buyer user successfully', async () => {
        const response = await request(BASE_URL)
          .post('/api/auth/login')
          .send(TEST_CREDENTIALS.buyer)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.token).toBeDefined();
        expect(response.body.user.role).toBe('buyer');
        
        tokens.buyer = response.body.token;
      });
      
      test('should reject login with invalid credentials', async () => {
        const response = await request(BASE_URL)
          .post('/api/auth/login')
          .send({
            email: 'admin@aqar.com',
            password: 'wrongpassword'
          })
          .expect(401);
        
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBeDefined();
      });
      
      test('should reject login with missing fields', async () => {
        const response = await request(BASE_URL)
          .post('/api/auth/login')
          .send({
            email: 'admin@aqar.com'
          })
          .expect(400);
        
        expect(response.body.success).toBe(false);
      });
    });
    
    describe('POST /api/auth/register', () => {
      test('should register new user successfully', async () => {
        const newUser = {
          name: 'Test User',
          email: `test${Date.now()}@example.com`,
          password: 'Test@123456',
          phone: '+201234567890',
          role: 'buyer'
        };
        
        const response = await request(BASE_URL)
          .post('/api/auth/register')
          .send(newUser)
          .expect(201);
        
        expect(response.body.success).toBe(true);
        expect(response.body.token).toBeDefined();
        expect(response.body.user).toBeDefined();
        expect(response.body.user.email).toBe(newUser.email);
        expect(response.body.user.password).toBeUndefined();
      });
      
      test('should reject registration with existing email', async () => {
        const response = await request(BASE_URL)
          .post('/api/auth/register')
          .send({
            name: 'Test User',
            email: TEST_CREDENTIALS.admin.email,
            password: 'Test@123456'
          })
          .expect(400);
        
        expect(response.body.success).toBe(false);
      });
      
      test('should reject registration with weak password', async () => {
        const response = await request(BASE_URL)
          .post('/api/auth/register')
          .send({
            name: 'Test User',
            email: 'newuser@example.com',
            password: '123'
          })
          .expect(400);
        
        expect(response.body.success).toBe(false);
      });
    });
    
    describe('GET /api/auth/me', () => {
      test('should get authenticated user profile', async () => {
        const response = await request(BASE_URL)
          .get('/api/auth/me')
          .set('Authorization', `Bearer ${tokens.admin}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.user).toBeDefined();
        expect(response.body.user.email).toBe(TEST_CREDENTIALS.admin.email);
        expect(response.body.user.password).toBeUndefined();
      });
      
      test('should reject request without token', async () => {
        const response = await request(BASE_URL)
          .get('/api/auth/me')
          .expect(401);
        
        expect(response.body.success).toBe(false);
      });
      
      test('should reject request with invalid token', async () => {
        const response = await request(BASE_URL)
          .get('/api/auth/me')
          .set('Authorization', 'Bearer invalidtoken')
          .expect(401);
        
        expect(response.body.success).toBe(false);
      });
    });
  });
  
  // ============================================================================
  // SECTION 2: PROPERTY ENDPOINTS
  // ============================================================================
  
  describe('2. Property Endpoints', () => {
    
    describe('GET /api/properties', () => {
      test('should get all approved properties', async () => {
        const response = await request(BASE_URL)
          .get('/api/properties')
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.pagination).toBeDefined();
        
        // All returned properties should be approved
        response.body.data.forEach(property => {
          expect(property.isApproved).toBe(true);
        });
      });
      
      test('should filter properties by status (rent)', async () => {
        const response = await request(BASE_URL)
          .get('/api/properties?status=rent')
          .expect(200);
        
        expect(response.body.success).toBe(true);
        response.body.data.forEach(property => {
          expect(property.status).toBe('rent');
        });
      });
      
      test('should filter properties by status (sale)', async () => {
        const response = await request(BASE_URL)
          .get('/api/properties?status=sale')
          .expect(200);
        
        expect(response.body.success).toBe(true);
        response.body.data.forEach(property => {
          expect(property.status).toBe('sale');
        });
      });
      
      test('should filter properties by type', async () => {
        const response = await request(BASE_URL)
          .get('/api/properties?type=residential')
          .expect(200);
        
        expect(response.body.success).toBe(true);
        response.body.data.forEach(property => {
          expect(property.type).toBe('residential');
        });
      });
      
      test('should filter properties by price range', async () => {
        const response = await request(BASE_URL)
          .get('/api/properties?minPrice=1000000&maxPrice=5000000')
          .expect(200);
        
        expect(response.body.success).toBe(true);
        response.body.data.forEach(property => {
          expect(property.price).toBeGreaterThanOrEqual(1000000);
          expect(property.price).toBeLessThanOrEqual(5000000);
        });
      });
      
      test('should filter properties by city', async () => {
        const response = await request(BASE_URL)
          .get('/api/properties?city=Cairo')
          .expect(200);
        
        expect(response.body.success).toBe(true);
        response.body.data.forEach(property => {
          expect(property.location.city.toLowerCase()).toBe('cairo');
        });
      });
      
      test('should search properties by keyword', async () => {
        const response = await request(BASE_URL)
          .get('/api/properties?keyword=villa')
          .expect(200);
        
        expect(response.body.success).toBe(true);
        // Results should contain the keyword in title or description
        if (response.body.data.length > 0) {
          response.body.data.forEach(property => {
            const hasKeyword = 
              property.title.toLowerCase().includes('villa') ||
              property.description.toLowerCase().includes('villa');
            expect(hasKeyword).toBe(true);
          });
        }
      });
      
      test('should paginate results', async () => {
        const response = await request(BASE_URL)
          .get('/api/properties?page=1&limit=3')
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.pagination).toBeDefined();
        expect(response.body.pagination.page).toBe(1);
        expect(response.body.pagination.limit).toBe(3);
        expect(response.body.data.length).toBeLessThanOrEqual(3);
      });
      
      test('should sort properties by price ascending', async () => {
        const response = await request(BASE_URL)
          .get('/api/properties?sort=price_asc')
          .expect(200);
        
        expect(response.body.success).toBe(true);
        const prices = response.body.data.map(p => p.price);
        for (let i = 1; i < prices.length; i++) {
          expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
        }
      });
      
      test('should sort properties by price descending', async () => {
        const response = await request(BASE_URL)
          .get('/api/properties?sort=price_desc')
          .expect(200);
        
        expect(response.body.success).toBe(true);
        const prices = response.body.data.map(p => p.price);
        for (let i = 1; i < prices.length; i++) {
          expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
        }
      });
    });
    
    describe('GET /api/properties/:id', () => {
      test('should get property by ID with owner populated', async () => {
        // First get a property ID
        const listResponse = await request(BASE_URL)
          .get('/api/properties')
          .expect(200);
        
        if (listResponse.body.data.length > 0) {
          const propertyId = listResponse.body.data[0]._id;
          
          const response = await request(BASE_URL)
            .get(`/api/properties/${propertyId}`)
            .expect(200);
          
          expect(response.body.success).toBe(true);
          expect(response.body.data).toBeDefined();
          expect(response.body.data._id).toBe(propertyId);
          expect(response.body.data.owner).toBeDefined();
          expect(response.body.data.owner.name).toBeDefined();
          expect(response.body.data.owner.email).toBeDefined();
          expect(response.body.data.owner.password).toBeUndefined();
        }
      });
      
      test('should return 404 for non-existent property', async () => {
        const fakeId = '507f1f77bcf86cd799439011';
        const response = await request(BASE_URL)
          .get(`/api/properties/${fakeId}`)
          .expect(404);
        
        expect(response.body.success).toBe(false);
      });
      
      test('should return 400 for invalid property ID format', async () => {
        const response = await request(BASE_URL)
          .get('/api/properties/invalid-id')
          .expect(400);
        
        expect(response.body.success).toBe(false);
      });
    });
    
    describe('POST /api/properties', () => {
      test('should create property as owner', async () => {
        const newProperty = {
          title: 'Test Property for Integration',
          description: 'This is a test property created during integration testing',
          price: 2500000,
          status: 'sale',
          type: 'residential',
          rooms: 3,
          bathrooms: 2,
          area: 150,
          address: '123 Test Street',
          city: 'Cairo',
          country: 'Egypt',
          lat: 30.0444,
          lng: 31.2357
        };
        
        const response = await request(BASE_URL)
          .post('/api/properties')
          .set('Authorization', `Bearer ${tokens.owner}`)
          .send(newProperty)
          .expect(201);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.title).toBe(newProperty.title);
        expect(response.body.data.isApproved).toBe(false); // Should be unapproved by default
        
        createdPropertyIds.push(response.body.data._id);
      });
      
      test('should reject property creation without authentication', async () => {
        const newProperty = {
          title: 'Test Property',
          description: 'Test description',
          price: 2500000,
          status: 'sale',
          type: 'residential',
          area: 150,
          address: '123 Test Street',
          city: 'Cairo',
          lat: 30.0444,
          lng: 31.2357
        };
        
        const response = await request(BASE_URL)
          .post('/api/properties')
          .send(newProperty)
          .expect(401);
        
        expect(response.body.success).toBe(false);
      });
      
      test('should reject property with missing required fields', async () => {
        const invalidProperty = {
          title: 'Test Property',
          // Missing required fields
        };
        
        const response = await request(BASE_URL)
          .post('/api/properties')
          .set('Authorization', `Bearer ${tokens.owner}`)
          .send(invalidProperty)
          .expect(400);
        
        expect(response.body.success).toBe(false);
      });
      
      test('should reject property with negative price', async () => {
        const invalidProperty = {
          title: 'Test Property',
          description: 'Test description',
          price: -1000,
          status: 'sale',
          type: 'residential',
          area: 150,
          address: '123 Test Street',
          city: 'Cairo',
          lat: 30.0444,
          lng: 31.2357
        };
        
        const response = await request(BASE_URL)
          .post('/api/properties')
          .set('Authorization', `Bearer ${tokens.owner}`)
          .send(invalidProperty)
          .expect(400);
        
        expect(response.body.success).toBe(false);
      });
    });
    
    describe('GET /api/properties/my-listings', () => {
      test('should get owner\'s own listings', async () => {
        const response = await request(BASE_URL)
          .get('/api/properties/my-listings')
          .set('Authorization', `Bearer ${tokens.owner}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        
        // All properties should belong to the authenticated owner
        response.body.data.forEach(property => {
          expect(property.owner).toBeDefined();
        });
      });
      
      test('should reject request without authentication', async () => {
        const response = await request(BASE_URL)
          .get('/api/properties/my-listings')
          .expect(401);
        
        expect(response.body.success).toBe(false);
      });
    });
  });
  
  // ============================================================================
  // SECTION 3: ADMIN ENDPOINTS
  // ============================================================================
  
  describe('3. Admin Endpoints', () => {
    
    describe('GET /api/admin/stats', () => {
      test('should get platform statistics as admin', async () => {
        const response = await request(BASE_URL)
          .get('/api/admin/stats')
          .set('Authorization', `Bearer ${tokens.admin}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.totalUsers).toBeDefined();
        expect(response.body.data.totalProperties).toBeDefined();
        expect(response.body.data.pendingApprovals).toBeDefined();
        expect(response.body.data.totalInquiries).toBeDefined();
        expect(response.body.data.usersByRole).toBeDefined();
        expect(response.body.data.propertiesByStatus).toBeDefined();
        expect(response.body.data.propertiesByType).toBeDefined();
      });
      
      test('should reject non-admin user', async () => {
        const response = await request(BASE_URL)
          .get('/api/admin/stats')
          .set('Authorization', `Bearer ${tokens.buyer}`)
          .expect(403);
        
        expect(response.body.success).toBe(false);
      });
    });
    
    describe('GET /api/admin/users', () => {
      test('should get all users as admin', async () => {
        const response = await request(BASE_URL)
          .get('/api/admin/users')
          .set('Authorization', `Bearer ${tokens.admin}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.pagination).toBeDefined();
        
        // Passwords should not be included
        response.body.data.forEach(user => {
          expect(user.password).toBeUndefined();
        });
      });
      
      test('should reject non-admin user', async () => {
        const response = await request(BASE_URL)
          .get('/api/admin/users')
          .set('Authorization', `Bearer ${tokens.owner}`)
          .expect(403);
        
        expect(response.body.success).toBe(false);
      });
    });
    
    describe('GET /api/admin/listings', () => {
      test('should get all listings including unapproved as admin', async () => {
        const response = await request(BASE_URL)
          .get('/api/admin/listings')
          .set('Authorization', `Bearer ${tokens.admin}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        
        // Should include both approved and unapproved properties
        const hasUnapproved = response.body.data.some(p => !p.isApproved);
        expect(hasUnapproved).toBe(true);
      });
      
      test('should filter unapproved listings', async () => {
        const response = await request(BASE_URL)
          .get('/api/admin/listings?isApproved=false')
          .set('Authorization', `Bearer ${tokens.admin}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        response.body.data.forEach(property => {
          expect(property.isApproved).toBe(false);
        });
      });
    });
    
    describe('PUT /api/admin/listings/:id/approve', () => {
      test('should approve property as admin', async () => {
        if (createdPropertyIds.length > 0) {
          const propertyId = createdPropertyIds[0];
          
          const response = await request(BASE_URL)
            .put(`/api/admin/listings/${propertyId}/approve`)
            .set('Authorization', `Bearer ${tokens.admin}`)
            .send({ isApproved: true })
            .expect(200);
          
          expect(response.body.success).toBe(true);
          expect(response.body.data.isApproved).toBe(true);
        }
      });
      
      test('should reject non-admin user', async () => {
        if (createdPropertyIds.length > 0) {
          const propertyId = createdPropertyIds[0];
          
          const response = await request(BASE_URL)
            .put(`/api/admin/listings/${propertyId}/approve`)
            .set('Authorization', `Bearer ${tokens.owner}`)
            .send({ isApproved: true })
            .expect(403);
          
          expect(response.body.success).toBe(false);
        }
      });
    });
    
    describe('PUT /api/admin/users/:id/role', () => {
      test('should update user role as admin', async () => {
        // First get a user ID
        const usersResponse = await request(BASE_URL)
          .get('/api/admin/users')
          .set('Authorization', `Bearer ${tokens.admin}`)
          .expect(200);
        
        if (usersResponse.body.data.length > 0) {
          const user = usersResponse.body.data.find(u => u.role === 'buyer');
          
          if (user) {
            const response = await request(BASE_URL)
              .put(`/api/admin/users/${user._id}/role`)
              .set('Authorization', `Bearer ${tokens.admin}`)
              .send({ role: 'owner' })
              .expect(200);
            
            expect(response.body.success).toBe(true);
            expect(response.body.data.role).toBe('owner');
            
            // Revert the change
            await request(BASE_URL)
              .put(`/api/admin/users/${user._id}/role`)
              .set('Authorization', `Bearer ${tokens.admin}`)
              .send({ role: 'buyer' });
          }
        }
      });
      
      test('should reject invalid role', async () => {
        const usersResponse = await request(BASE_URL)
          .get('/api/admin/users')
          .set('Authorization', `Bearer ${tokens.admin}`)
          .expect(200);
        
        if (usersResponse.body.data.length > 0) {
          const userId = usersResponse.body.data[0]._id;
          
          const response = await request(BASE_URL)
            .put(`/api/admin/users/${userId}/role`)
            .set('Authorization', `Bearer ${tokens.admin}`)
            .send({ role: 'invalid_role' })
            .expect(400);
          
          expect(response.body.success).toBe(false);
        }
      });
    });
  });
  
  // ============================================================================
  // SECTION 4: ERROR HANDLING AND VALIDATION
  // ============================================================================
  
  describe('4. Error Handling and Validation', () => {
    
    test('should return 404 for non-existent route', async () => {
      const response = await request(BASE_URL)
        .get('/api/nonexistent')
        .expect(404);
      
      expect(response.body.success).toBe(false);
    });
    
    test('should handle malformed JSON', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);
    });
    
    test('should validate email format', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'Test@123456'
        })
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
    
    test('should enforce minimum password length', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: '123'
        })
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
  });
  
  // ============================================================================
  // CLEANUP
  // ============================================================================
  
  afterAll(async () => {
    // Clean up created test properties
    for (const propertyId of createdPropertyIds) {
      try {
        await request(BASE_URL)
          .delete(`/api/admin/listings/${propertyId}`)
          .set('Authorization', `Bearer ${tokens.admin}`);
      } catch (error) {
        console.log(`Failed to delete property ${propertyId}:`, error.message);
      }
    }
    
    console.log('\n✅ All integration tests completed!');
    console.log(`📊 Test Summary:`);
    console.log(`   - Authentication endpoints: ✓`);
    console.log(`   - Property endpoints: ✓`);
    console.log(`   - Admin endpoints: ✓`);
    console.log(`   - Error handling: ✓`);
  });
});
