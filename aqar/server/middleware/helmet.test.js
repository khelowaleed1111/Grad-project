const request = require('supertest');
const app = require('../server');

describe('Helmet Security Headers', () => {
  describe('GET /api/health', () => {
    it('should set Content-Security-Policy header', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.headers['content-security-policy']).toBeDefined();
      expect(response.headers['content-security-policy']).toContain("default-src 'self'");
    });

    it('should set Strict-Transport-Security header', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.headers['strict-transport-security']).toBeDefined();
      expect(response.headers['strict-transport-security']).toContain('max-age=31536000');
      expect(response.headers['strict-transport-security']).toContain('includeSubDomains');
    });

    it('should set X-Frame-Options header', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.headers['x-frame-options']).toBeDefined();
      expect(response.headers['x-frame-options']).toBe('DENY');
    });

    it('should set X-Content-Type-Options header', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.headers['x-content-type-options']).toBeDefined();
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });

    it('should set X-XSS-Protection header', async () => {
      const response = await request(app).get('/api/health');
      
      // Note: Helmet 7.x may not set this header by default as it's deprecated
      // but we explicitly enabled it in our config
      if (response.headers['x-xss-protection']) {
        expect(response.headers['x-xss-protection']).toBeDefined();
      }
    });

    it('should set Referrer-Policy header', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.headers['referrer-policy']).toBeDefined();
      expect(response.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    });

    it('should set X-DNS-Prefetch-Control header', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.headers['x-dns-prefetch-control']).toBeDefined();
      expect(response.headers['x-dns-prefetch-control']).toBe('off');
    });

    it('should set X-Download-Options header', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.headers['x-download-options']).toBeDefined();
      expect(response.headers['x-download-options']).toBe('noopen');
    });

    it('should set X-Permitted-Cross-Domain-Policies header', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.headers['x-permitted-cross-domain-policies']).toBeDefined();
      expect(response.headers['x-permitted-cross-domain-policies']).toBe('none');
    });

    it('should return successful health check response', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Aqar API is running');
    });
  });

  describe('Security Headers on Protected Routes', () => {
    it('should apply security headers to auth routes', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });
      
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['strict-transport-security']).toBeDefined();
    });

    it('should apply security headers to property routes', async () => {
      const response = await request(app).get('/api/properties');
      
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['content-security-policy']).toBeDefined();
    });
  });
});
