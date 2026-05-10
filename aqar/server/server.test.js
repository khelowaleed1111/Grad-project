const request = require('supertest');
const app = require('./server');

describe('Express Server Configuration', () => {
  describe('Server Setup', () => {
    it('should have the app instance defined', () => {
      expect(app).toBeDefined();
    });

    it('should respond to health check endpoint', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Aqar API is running');
    });
  });

  describe('Middleware Configuration', () => {
    it('should have CORS enabled', async () => {
      const response = await request(app)
        .options('/api/health')
        .set('Origin', 'http://localhost:5173');
      
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should parse JSON bodies', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password' })
        .set('Content-Type', 'application/json');
      
      // Should not fail due to body parsing
      expect(response.status).not.toBe(500);
    });

    it('should have security headers from helmet', async () => {
      const response = await request(app).get('/api/health');
      
      // Check for helmet security headers
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBeDefined();
    });
  });

  describe('Route Mounting', () => {
    it('should have auth routes mounted at /api/auth', async () => {
      const response = await request(app).post('/api/auth/login');
      // Should not be 404, even if validation fails
      expect(response.status).not.toBe(404);
    });

    it('should have property routes mounted at /api/properties', async () => {
      const response = await request(app).get('/api/properties');
      // Should not be 404
      expect(response.status).not.toBe(404);
    });

    it('should have user routes mounted at /api/users', async () => {
      const response = await request(app).get('/api/users/123');
      // Should not be 404 (might be 400 for invalid ID format)
      expect(response.status).not.toBe(404);
    });

    it('should have admin routes mounted at /api/admin', async () => {
      const response = await request(app).get('/api/admin/stats');
      // Should not be 404 (will be 401 for unauthorized)
      expect(response.status).not.toBe(404);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app).get('/api/nonexistent');
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should handle errors with proper JSON response', async () => {
      const response = await request(app).get('/api/nonexistent');
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limiting to auth routes', async () => {
      // Make multiple requests to test rate limiting
      const requests = [];
      for (let i = 0; i < 12; i++) {
        requests.push(
          request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'password' })
        );
      }

      const responses = await Promise.all(requests);
      
      // At least one should be rate limited (429)
      const rateLimited = responses.some(r => r.status === 429);
      expect(rateLimited).toBe(true);
    });
  });

  describe('Environment Configuration', () => {
    it('should load environment variables', () => {
      expect(process.env.PORT).toBeDefined();
      expect(process.env.MONGO_URI).toBeDefined();
      expect(process.env.JWT_SECRET).toBeDefined();
      expect(process.env.JWT_EXPIRE).toBeDefined();
    });
  });
});
