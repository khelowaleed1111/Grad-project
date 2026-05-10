const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for authentication endpoints
 * Limits requests to 10 per 15 minutes per IP address in production
 * More permissive in test environment (1000 requests per minute)
 * Prevents brute force attacks on login and registration
 */
const authRateLimiter = rateLimit({
  windowMs: process.env.NODE_ENV === 'test' ? 60 * 1000 : 15 * 60 * 1000, // 1 minute in test, 15 minutes in production
  max: process.env.NODE_ENV === 'test' ? 1000 : 10, // 1000 requests in test, 10 in production
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip successful requests (only count failed attempts)
  skipSuccessfulRequests: false,
  // Skip failed requests (count all requests)
  skipFailedRequests: false,
});

module.exports = { authRateLimiter };
