// JWT Integration Example with User Model
// This file demonstrates how the JWT utility integrates with the User model

const { generateUserToken, verifyToken, extractTokenFromHeader } = require('../utils/generateToken');

/**
 * Example: User Login Flow
 * This shows how to generate a JWT token after successful login
 */
async function loginExample(email, password) {
  try {
    // 1. Find user by email (include password for verification)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // 2. Verify password using User model method
    const isPasswordValid = await user.matchPassword(password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    
    // 3. Generate JWT token using the utility
    const token = generateUserToken(user);
    
    // 4. Return user data (password excluded by toJSON) and token
    return {
      success: true,
      token,
      user: user.toJSON(), // Password automatically excluded
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

/**
 * Example: Authentication Middleware
 * This shows how to use the JWT utility in middleware
 */
function authMiddlewareExample(req, res, next) {
  try {
    // 1. Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }
    
    // 2. Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.',
      });
    }
    
    // 3. Attach user info to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication.',
    });
  }
}

/**
 * Example: Role-Based Authorization
 * This shows how to use JWT payload for role checking
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    // Assumes authMiddleware has already run and set req.user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions.',
      });
    }
    
    next();
  };
}

/**
 * Example: User Registration Flow
 * This shows token generation during registration
 */
async function registerExample(userData) {
  try {
    // 1. Create new user (password will be hashed by User model)
    const user = await User.create(userData);
    
    // 2. Generate JWT token for immediate login
    const token = generateUserToken(user);
    
    // 3. Return user and token
    return {
      success: true,
      token,
      user: user.toJSON(),
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

/**
 * Example: Protected Route Handler
 * This shows how to use authenticated user data
 */
async function getProfileExample(req, res) {
  try {
    // req.user is available from auth middleware
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }
    
    res.json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
}

/**
 * Example: Token Refresh (if needed)
 * This shows how to generate a new token for an existing user
 */
async function refreshTokenExample(req, res) {
  try {
    // Get current user from auth middleware
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }
    
    // Generate new token
    const newToken = generateUserToken(user);
    
    res.json({
      success: true,
      token: newToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
}

/**
 * Example: Express Route Setup
 * This shows how to use the JWT utility in Express routes
 */
function setupAuthRoutes(app) {
  // Public routes
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const result = await loginExample(email, password);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(401).json(result);
    }
  });
  
  app.post('/api/auth/register', async (req, res) => {
    const result = await registerExample(req.body);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  });
  
  // Protected routes
  app.get('/api/auth/me', authMiddlewareExample, getProfileExample);
  
  app.post('/api/auth/refresh', authMiddlewareExample, refreshTokenExample);
  
  // Admin-only route example
  app.get('/api/admin/users', 
    authMiddlewareExample, 
    requireRole('admin'), 
    async (req, res) => {
      // Admin-only logic here
      res.json({ message: 'Admin access granted' });
    }
  );
  
  // Owner/Agent route example
  app.post('/api/properties', 
    authMiddlewareExample, 
    requireRole('owner', 'agent'), 
    async (req, res) => {
      // Property creation logic here
      res.json({ message: 'Property creation access granted' });
    }
  );
}

module.exports = {
  loginExample,
  registerExample,
  authMiddlewareExample,
  requireRole,
  getProfileExample,
  refreshTokenExample,
  setupAuthRoutes,
};

/**
 * Usage Notes:
 * 
 * 1. The JWT utility handles all token operations securely
 * 2. User model integration is seamless with generateUserToken()
 * 3. Token verification is handled by verifyToken()
 * 4. Header extraction is simplified with extractTokenFromHeader()
 * 5. All security best practices are built into the utility
 * 
 * Security Features:
 * - 7-day token expiration
 * - HS256 algorithm enforcement
 * - Issuer/audience validation
 * - Comprehensive input validation
 * - Secure error handling
 * 
 * Integration Points:
 * - User.matchPassword() for login verification
 * - User.toJSON() for safe user data serialization
 * - User.create() for registration
 * - User.findById() for profile retrieval
 */