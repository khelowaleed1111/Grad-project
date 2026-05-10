const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for authenticated user
 * @param {string|Object} userId - User ID or user object with _id property
 * @param {string} [role] - User role (optional if userId is user object)
 * @returns {string} JWT token
 * @throws {Error} If JWT_SECRET is not configured or token generation fails
 */
const generateToken = (userId, role = null) => {
  // Validate JWT_SECRET exists
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  // Handle both user object and userId string
  let payload;
  if (typeof userId === 'object' && userId._id) {
    // User object passed
    payload = {
      userId: userId._id.toString(),
      role: userId.role,
    };
  } else if (typeof userId === 'string' && role) {
    // Separate userId and role passed
    payload = {
      userId,
      role,
    };
  } else {
    throw new Error('Invalid parameters: provide either user object or userId with role');
  }

  try {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || '7d',
        issuer: 'aqar-platform',
        audience: 'aqar-users',
        algorithm: 'HS256', // Explicitly specify algorithm for security
      }
    );
  } catch (error) {
    throw new Error(`Token generation failed: ${error.message}`);
  }
};

/**
 * Verify JWT token and return decoded payload
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded token payload or null if invalid
 */
const verifyToken = (token) => {
  // Validate inputs
  if (!token || typeof token !== 'string') {
    return null;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'aqar-platform',
      audience: 'aqar-users',
      algorithms: ['HS256'], // Only allow HS256 algorithm
    });

    // Validate required payload fields
    if (!decoded.userId || !decoded.role) {
      return null;
    }

    return decoded;
  } catch (error) {
    // Log error for debugging (in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Token verification failed:', error.message);
    }
    return null;
  }
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token string or null if invalid format
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || typeof authHeader !== 'string') {
    return null;
  }

  // Check for Bearer token format
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    return token || ''; // Return empty string if no token after 'Bearer '
  }

  return null;
};

/**
 * Generate token for user (convenience method)
 * @param {Object} user - User object from database
 * @returns {string} JWT token
 */
const generateUserToken = (user) => {
  if (!user || !user._id || !user.role) {
    throw new Error('Invalid user object: _id and role are required');
  }

  return generateToken(user);
};

/**
 * Decode token without verification (for debugging/inspection)
 * @param {string} token - JWT token to decode
 * @returns {Object|null} Decoded token payload or null if invalid
 */
const decodeToken = (token) => {
  if (!token || typeof token !== 'string') {
    return null;
  }

  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} True if token is expired
 */
const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

module.exports = {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
  generateUserToken,
  decodeToken,
  isTokenExpired,
};
