const jwt = require('jsonwebtoken');
const { protect, authorize, isAdmin, checkOwnership, requireVerified, attachResource } = require('./authMiddleware');
const User = require('../models/User');

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../models/User');
jest.mock('../utils/generateToken');

// Mock the generateToken utility
const mockGenerateToken = {
  verifyToken: jest.fn(),
  extractTokenFromHeader: jest.fn(),
};

// Set up the mock before requiring the module
jest.doMock('../utils/generateToken', () => mockGenerateToken);

describe('Authentication Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      user: null,
      resource: null,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    
    // Clear all mocks
    jest.clearAllMocks();
    
    // Set up environment variable
    process.env.JWT_SECRET = 'test-secret';
    process.env.NODE_ENV = 'test';
  });

  describe('protect middleware', () => {
    const mockUser = {
      _id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'buyer',
    };

    it('should authenticate user with valid token', async () => {
      const token = 'valid-token';
      req.headers.authorization = `Bearer ${token}`;

      mockGenerateToken.extractTokenFromHeader.mockReturnValue(token);
      mockGenerateToken.verifyToken.mockReturnValue({ userId: 'user123' });
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await protect(req, res, next);

      expect(mockGenerateToken.extractTokenFromHeader).toHaveBeenCalledWith(`Bearer ${token}`);
      expect(mockGenerateToken.verifyToken).toHaveBeenCalledWith(token);
      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject request without authorization header', async () => {
      mockGenerateToken.extractTokenFromHeader.mockReturnValue(null);

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not authorized, no token provided',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', async () => {
      const token = 'invalid-token';
      req.headers.authorization = `Bearer ${token}`;

      mockGenerateToken.extractTokenFromHeader.mockReturnValue(token);
      mockGenerateToken.verifyToken.mockReturnValue(null);

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not authorized, token failed',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request when user not found', async () => {
      const token = 'valid-token';
      req.headers.authorization = `Bearer ${token}`;

      mockGenerateToken.extractTokenFromHeader.mockReturnValue(token);
      mockGenerateToken.verifyToken.mockReturnValue({ userId: 'nonexistent' });
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle database error when finding user', async () => {
      const token = 'valid-token';
      req.headers.authorization = `Bearer ${token}`;

      mockGenerateToken.extractTokenFromHeader.mockReturnValue(token);
      mockGenerateToken.verifyToken.mockReturnValue({ userId: 'user123' });
      User.findById.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not authorized, token failed',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('authorize middleware', () => {
    beforeEach(() => {
      req.user = {
        _id: 'user123',
        role: 'buyer',
      };
    });

    it('should allow access for authorized role', () => {
      const middleware = authorize('buyer', 'owner');
      
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny access for unauthorized role', () => {
      const middleware = authorize('admin', 'owner');
      
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Role 'buyer' is not authorized to access this route",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should deny access when user not authenticated', () => {
      req.user = null;
      const middleware = authorize('buyer');
      
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not authenticated',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('isAdmin middleware', () => {
    it('should allow access for admin user', () => {
      req.user = { role: 'admin' };
      
      isAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny access for non-admin user', () => {
      req.user = { role: 'buyer' };
      
      isAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Admin access required',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should deny access when user not authenticated', () => {
      req.user = null;
      
      isAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not authenticated',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('checkOwnership middleware', () => {
    beforeEach(() => {
      req.user = {
        _id: 'user123',
        role: 'owner',
      };
    });

    it('should allow access for admin user', async () => {
      req.user.role = 'admin';
      const middleware = checkOwnership();
      
      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should allow access for resource owner', async () => {
      req.resource = {
        owner: 'user123',
      };
      const middleware = checkOwnership();
      
      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny access for non-owner', async () => {
      req.resource = {
        owner: 'different-user',
      };
      const middleware = checkOwnership();
      
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'You do not have permission to perform this action',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should deny access when no resource is set', async () => {
      req.resource = null;
      const middleware = checkOwnership();
      
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'You do not have permission to perform this action',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should deny access when user not authenticated', async () => {
      req.user = null;
      const middleware = checkOwnership();
      
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not authenticated',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('requireVerified middleware', () => {
    beforeEach(() => {
      req.user = {
        _id: 'user123',
        isVerified: true,
      };
    });

    it('should allow access for verified user', () => {
      requireVerified(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should allow access when verification not required', () => {
      req.user.isVerified = false;
      process.env.REQUIRE_EMAIL_VERIFICATION = 'false';
      
      requireVerified(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny access for unverified user when verification required', () => {
      req.user.isVerified = false;
      process.env.REQUIRE_EMAIL_VERIFICATION = 'true';
      
      requireVerified(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email verification required',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should deny access when user not authenticated', () => {
      req.user = null;
      
      requireVerified(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not authenticated',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('attachResource middleware', () => {
    it('should attach resource to request', async () => {
      const mockResource = { _id: 'resource123', owner: 'user123' };
      const resourceFinder = jest.fn().mockResolvedValue(mockResource);
      const middleware = attachResource(resourceFinder);
      
      await middleware(req, res, next);

      expect(resourceFinder).toHaveBeenCalledWith(req);
      expect(req.resource).toEqual(mockResource);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 404 when resource not found', async () => {
      const resourceFinder = jest.fn().mockResolvedValue(null);
      const middleware = attachResource(resourceFinder);
      
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Resource not found',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors in resource finder', async () => {
      const resourceFinder = jest.fn().mockRejectedValue(new Error('Database error'));
      const middleware = attachResource(resourceFinder);
      
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Server error while fetching resource',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});