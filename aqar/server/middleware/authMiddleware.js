const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken, extractTokenFromHeader } = require('../utils/generateToken');

/**
 * Protect routes - verify JWT token and attach user to request
 * Validates: Requirements 2.4, 2.5, 2.6
 */
const protect = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
    }

    // Verify token using utility function
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }

    // Find user and attach to request
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // Attach user to request for downstream middleware
    req.user = user;
    next();
  } catch (error) {
    // Log error for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('Auth middleware error:', error.message);
    }
    
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed',
    });
  }
};

/**
 * Check if user has required role(s)
 * Validates: Requirements 3.2, 3.3
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Ensure user is attached to request (should be done by protect middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
    }
    
    next();
  };
};

/**
 * Check if user is admin
 * Validates: Requirements 3.2, 11.7, 12.5
 */
const isAdmin = (req, res, next) => {
  // Ensure user is attached to request
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }
  
  next();
};

/**
 * Check if user owns the resource or is admin
 * Validates: Requirements 3.4, 3.5, 10.2, 10.3
 * @param {string} resourceField - Field name in request params for resource ID (optional)
 */
const checkOwnership = (resourceField = null) => {
  return async (req, res, next) => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      // Admin can access any resource
      if (req.user.role === 'admin') {
        return next();
      }

      // Check if user owns the resource
      const resource = req.resource;
      if (!resource) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to perform this action',
        });
      }

      // Compare owner IDs (handle both string and ObjectId)
      const resourceOwnerId = resource.owner?.toString() || resource.owner;
      const userId = req.user._id?.toString() || req.user._id;

      if (resourceOwnerId === userId) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
    } catch (error) {
      // Log error for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.error('Ownership check error:', error.message);
      }
      
      return res.status(500).json({
        success: false,
        message: 'Server error during authorization check',
      });
    }
  };
};

/**
 * Middleware to check if user account is verified
 * Validates: Requirements 1.7, 14.7
 */
const requireVerified = (req, res, next) => {
  // Ensure user is authenticated
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }

  // Check if user is verified (optional feature for future use)
  if (req.user.isVerified === false && process.env.REQUIRE_EMAIL_VERIFICATION === 'true') {
    return res.status(403).json({
      success: false,
      message: 'Email verification required',
    });
  }

  next();
};

/**
 * Middleware to attach resource to request for ownership checking
 * This should be used before checkOwnership middleware
 * @param {Function} resourceFinder - Function that returns the resource
 */
const attachResource = (resourceFinder) => {
  return async (req, res, next) => {
    try {
      const resource = await resourceFinder(req);
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found',
        });
      }
      
      req.resource = resource;
      next();
    } catch (error) {
      // Log error for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.error('Resource attachment error:', error.message);
      }
      
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching resource',
      });
    }
  };
};

/**
 * Middleware to check rate limiting for sensitive operations
 * This is a placeholder for future rate limiting implementation
 */
const rateLimitSensitive = (req, res, next) => {
  // This would integrate with express-rate-limit for specific operations
  // For now, just pass through
  next();
};

module.exports = {
  protect,
  authorize,
  isAdmin,
  checkOwnership,
  requireVerified,
  attachResource,
  rateLimitSensitive,
};
