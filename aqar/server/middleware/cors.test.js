const request = require('supertest');
const app = require('../server');

describe('CORS Configuration', () => {
  describe('CORS Headers', () => {
    it('should allow requests from CLIENT_ORIGIN', async () => {
      const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
      
      const response = await request(app)
        .get('/api/health')
        .set('Origin', origin);

      expect(response.headers['access-control-allow-origin']).toBe(origin);
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });

    it('should allow specified HTTP methods', async () => {
      const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
      
      const response = await request(app)
        .options('/api/health')
        .set('Origin', origin)
        .set('Access-Control-Request-Method', 'POST');

      const allowedMethods = response.headers['access-control-allow-methods'];
      expect(allowedMethods).toContain('GET');
      expect(allowedMethods).toContain('POST');
      expect(allowedMethods).toContain('PUT');
      expect(allowedMethods).toContain('DELETE');
      expect(allowedMethods).toContain('PATCH');
      expect(allowedMethods).toContain('OPTIONS');
    });

    it('should allow Content-Type and Authorization headers', async () => {
      const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
      
      const response = await request(app)
        .options('/api/health')
        .set('Origin', origin)
        .set('Access-Control-Request-Headers', 'Content-Type, Authorization');

      const allowedHeaders = response.headers['access-control-allow-headers'];
      expect(allowedHeaders).toContain('Content-Type');
      expect(allowedHeaders).toContain('Authorization');
    });

    it('should enable credentials for cookie-based authentication', async () => {
      const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
      
      const response = await request(app)
        .get('/api/health')
        .set('Origin', origin);

      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });

    it('should reject requests from unauthorized origins', async () => {
      const unauthorizedOrigin = 'http://malicious-site.com';
      
      const response = await request(app)
        .get('/api/health')
        .set('Origin', unauthorizedOrigin);

      // CORS middleware should not set the Access-Control-Allow-Origin header
      // for unauthorized origins
      expect(response.headers['access-control-allow-origin']).not.toBe(unauthorizedOrigin);
    });
  });

  describe('Preflight Requests', () => {
    it('should handle OPTIONS preflight requests correctly', async () => {
      const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
      
      const response = await request(app)
        .options('/api/auth/login')
        .set('Origin', origin)
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type, Authorization');

      expect(response.status).toBe(204);
      expect(response.headers['access-control-allow-origin']).toBe(origin);
      expect(response.headers['access-control-allow-methods']).toBeDefined();
      expect(response.headers['access-control-allow-headers']).toBeDefined();
    });
  });
});
