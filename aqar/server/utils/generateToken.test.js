const jwt = require('jsonwebtoken');
const {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
  generateUserToken,
  decodeToken,
  isTokenExpired,
} = require('./generateToken');

// Mock environment variables
const originalEnv = process.env;

describe('JWT Token Utility', () => {
  beforeEach(() => {
    // Reset environment variables
    process.env = {
      ...originalEnv,
      JWT_SECRET: 'test-secret-key-for-testing-only',
      JWT_EXPIRE: '7d',
      NODE_ENV: 'test',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token with user object', () => {
      const user = {
        _id: '507f1f77bcf86cd799439011',
        role: 'buyer',
      };

      const token = generateToken(user);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts

      // Verify token contains correct payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.userId).toBe(user._id.toString());
      expect(decoded.role).toBe(user.role);
      expect(decoded.iss).toBe('aqar-platform');
      expect(decoded.aud).toBe('aqar-users');
    });

    it('should generate a valid JWT token with userId and role', () => {
      const userId = '507f1f77bcf86cd799439011';
      const role = 'owner';

      const token = generateToken(userId, role);
      expect(typeof token).toBe('string');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.userId).toBe(userId);
      expect(decoded.role).toBe(role);
    });

    it('should set 7-day expiration by default', () => {
      const user = { _id: '507f1f77bcf86cd799439011', role: 'buyer' };
      const token = generateToken(user);
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const expirationTime = decoded.exp - decoded.iat;
      expect(expirationTime).toBe(7 * 24 * 60 * 60); // 7 days in seconds
    });

    it('should use custom expiration from JWT_EXPIRE env var', () => {
      process.env.JWT_EXPIRE = '1d';
      const user = { _id: '507f1f77bcf86cd799439011', role: 'buyer' };
      const token = generateToken(user);
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const expirationTime = decoded.exp - decoded.iat;
      expect(expirationTime).toBe(24 * 60 * 60); // 1 day in seconds
    });

    it('should throw error if JWT_SECRET is not configured', () => {
      delete process.env.JWT_SECRET;
      const user = { _id: '507f1f77bcf86cd799439011', role: 'buyer' };

      expect(() => generateToken(user)).toThrow('JWT_SECRET environment variable is required');
    });

    it('should throw error for invalid parameters', () => {
      expect(() => generateToken()).toThrow('Invalid parameters');
      expect(() => generateToken('userId')).toThrow('Invalid parameters');
      expect(() => generateToken({})).toThrow('Invalid parameters');
      expect(() => generateToken({ _id: null })).toThrow('Invalid parameters');
    });

    it('should handle mongoose ObjectId objects', () => {
      const mockObjectId = {
        _id: { toString: () => '507f1f77bcf86cd799439011' },
        role: 'agent',
      };

      const token = generateToken(mockObjectId);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.userId).toBe('507f1f77bcf86cd799439011');
      expect(decoded.role).toBe('agent');
    });
  });

  describe('verifyToken', () => {
    let validToken;

    beforeEach(() => {
      const user = { _id: '507f1f77bcf86cd799439011', role: 'buyer' };
      validToken = generateToken(user);
    });

    it('should verify and return decoded payload for valid token', () => {
      const decoded = verifyToken(validToken);
      
      expect(decoded).toBeTruthy();
      expect(decoded.userId).toBe('507f1f77bcf86cd799439011');
      expect(decoded.role).toBe('buyer');
      expect(decoded.iss).toBe('aqar-platform');
      expect(decoded.aud).toBe('aqar-users');
    });

    it('should return null for invalid token', () => {
      const result = verifyToken('invalid.token.here');
      expect(result).toBeNull();
    });

    it('should return null for expired token', () => {
      // Create an expired token
      const expiredToken = jwt.sign(
        { userId: '507f1f77bcf86cd799439011', role: 'buyer' },
        process.env.JWT_SECRET,
        { expiresIn: '-1s', issuer: 'aqar-platform', audience: 'aqar-users' }
      );

      const result = verifyToken(expiredToken);
      expect(result).toBeNull();
    });

    it('should return null for token with wrong issuer', () => {
      const wrongIssuerToken = jwt.sign(
        { userId: '507f1f77bcf86cd799439011', role: 'buyer' },
        process.env.JWT_SECRET,
        { issuer: 'wrong-issuer', audience: 'aqar-users' }
      );

      const result = verifyToken(wrongIssuerToken);
      expect(result).toBeNull();
    });

    it('should return null for token with wrong audience', () => {
      const wrongAudienceToken = jwt.sign(
        { userId: '507f1f77bcf86cd799439011', role: 'buyer' },
        process.env.JWT_SECRET,
        { issuer: 'aqar-platform', audience: 'wrong-audience' }
      );

      const result = verifyToken(wrongAudienceToken);
      expect(result).toBeNull();
    });

    it('should return null for empty or invalid input', () => {
      expect(verifyToken('')).toBeNull();
      expect(verifyToken(null)).toBeNull();
      expect(verifyToken(undefined)).toBeNull();
      expect(verifyToken(123)).toBeNull();
    });

    it('should return null for token missing required fields', () => {
      const incompleteToken = jwt.sign(
        { userId: '507f1f77bcf86cd799439011' }, // Missing role
        process.env.JWT_SECRET,
        { issuer: 'aqar-platform', audience: 'aqar-users' }
      );

      const result = verifyToken(incompleteToken);
      expect(result).toBeNull();
    });

    it('should throw error if JWT_SECRET is not configured', () => {
      delete process.env.JWT_SECRET;
      expect(() => verifyToken(validToken)).toThrow('JWT_SECRET environment variable is required');
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract token from valid Bearer header', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
      const authHeader = `Bearer ${token}`;
      
      const result = extractTokenFromHeader(authHeader);
      expect(result).toBe(token);
    });

    it('should return null for invalid header format', () => {
      expect(extractTokenFromHeader('InvalidHeader')).toBeNull();
      expect(extractTokenFromHeader('Basic token')).toBeNull();
      expect(extractTokenFromHeader('Bearer')).toBe(''); // Edge case
    });

    it('should return null for empty or invalid input', () => {
      expect(extractTokenFromHeader('')).toBeNull();
      expect(extractTokenFromHeader(null)).toBeNull();
      expect(extractTokenFromHeader(undefined)).toBeNull();
      expect(extractTokenFromHeader(123)).toBeNull();
    });
  });

  describe('generateUserToken', () => {
    it('should generate token for valid user object', () => {
      const user = {
        _id: '507f1f77bcf86cd799439011',
        role: 'admin',
        name: 'Test User',
        email: 'test@example.com',
      };

      const token = generateUserToken(user);
      expect(typeof token).toBe('string');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.userId).toBe(user._id);
      expect(decoded.role).toBe(user.role);
    });

    it('should throw error for invalid user object', () => {
      expect(() => generateUserToken()).toThrow('Invalid user object');
      expect(() => generateUserToken({})).toThrow('Invalid user object');
      expect(() => generateUserToken({ _id: '123' })).toThrow('Invalid user object');
      expect(() => generateUserToken({ role: 'buyer' })).toThrow('Invalid user object');
    });
  });

  describe('decodeToken', () => {
    it('should decode valid JWT token without verification', () => {
      const user = { _id: '507f1f77bcf86cd799439011', role: 'buyer' };
      const token = generateToken(user);
      
      const decoded = decodeToken(token);
      expect(decoded).toBeTruthy();
      expect(decoded.userId).toBe(user._id);
      expect(decoded.role).toBe(user.role);
    });

    it('should return null for invalid token format', () => {
      expect(decodeToken('invalid.token')).toBeNull();
      expect(decodeToken('')).toBeNull();
      expect(decodeToken(null)).toBeNull();
      expect(decodeToken(undefined)).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for valid non-expired token', () => {
      const user = { _id: '507f1f77bcf86cd799439011', role: 'buyer' };
      const token = generateToken(user);
      
      expect(isTokenExpired(token)).toBe(false);
    });

    it('should return true for expired token', () => {
      const expiredToken = jwt.sign(
        { userId: '507f1f77bcf86cd799439011', role: 'buyer' },
        process.env.JWT_SECRET,
        { expiresIn: '-1s' }
      );

      expect(isTokenExpired(expiredToken)).toBe(true);
    });

    it('should return true for invalid token', () => {
      expect(isTokenExpired('invalid.token')).toBe(true);
      expect(isTokenExpired('')).toBe(true);
      expect(isTokenExpired(null)).toBe(true);
    });

    it('should return true for token without expiration', () => {
      const tokenWithoutExp = jwt.sign(
        { userId: '507f1f77bcf86cd799439011', role: 'buyer' },
        process.env.JWT_SECRET
        // No expiresIn specified
      );

      expect(isTokenExpired(tokenWithoutExp)).toBe(true);
    });
  });

  describe('Security Best Practices', () => {
    it('should use HS256 algorithm explicitly', () => {
      const user = { _id: '507f1f77bcf86cd799439011', role: 'buyer' };
      const token = generateToken(user);
      
      const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString());
      expect(header.alg).toBe('HS256');
    });

    it('should include issuer and audience claims', () => {
      const user = { _id: '507f1f77bcf86cd799439011', role: 'buyer' };
      const token = generateToken(user);
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.iss).toBe('aqar-platform');
      expect(decoded.aud).toBe('aqar-users');
    });

    it('should reject tokens with different algorithms', () => {
      // Create token with different algorithm (this would be a security issue)
      const maliciousToken = jwt.sign(
        { userId: '507f1f77bcf86cd799439011', role: 'admin' },
        'different-secret',
        { algorithm: 'none' }
      );

      const result = verifyToken(maliciousToken);
      expect(result).toBeNull();
    });
  });

  describe('Integration with User Model', () => {
    it('should work with mongoose ObjectId', () => {
      // Simulate mongoose ObjectId
      const mockUser = {
        _id: {
          toString: () => '507f1f77bcf86cd799439011'
        },
        role: 'owner',
        name: 'John Doe',
        email: 'john@example.com'
      };

      const token = generateUserToken(mockUser);
      const decoded = verifyToken(token);
      
      expect(decoded.userId).toBe('507f1f77bcf86cd799439011');
      expect(decoded.role).toBe('owner');
    });

    it('should handle all user roles correctly', () => {
      const roles = ['buyer', 'owner', 'agent', 'admin'];
      
      roles.forEach(role => {
        const user = { _id: '507f1f77bcf86cd799439011', role };
        const token = generateToken(user);
        const decoded = verifyToken(token);
        
        expect(decoded.role).toBe(role);
      });
    });
  });
});