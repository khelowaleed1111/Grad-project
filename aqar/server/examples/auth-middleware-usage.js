/**
 * Example usage of authentication middleware
 * This file demonstrates how to use the authentication middleware in Express routes
 */

const express = require('express');
const { 
  protect, 
  authorize, 
  isAdmin, 
  checkOwnership, 
  attachResource,
  requireVerified 
} = require('../middleware/authMiddleware');

const app = express();

// Example models (these would be your actual models)
const Property = require('../models/Property');
const User = require('../models/User');

// Middleware to attach property to request
const attachProperty = attachResource(async (req) => {
  return await Property.findById(req.params.id);
});

// Middleware to attach user to request
const attachUserResource = attachResource(async (req) => {
  return await User.findById(req.params.userId);
});

// =============================================================================
// PUBLIC ROUTES (No authentication required)
// =============================================================================

// Public property search
app.get('/api/properties', (req, res) => {
  res.json({ message: 'Public property search' });
});

// Public property details
app.get('/api/properties/:id', (req, res) => {
  res.json({ message: 'Public property details' });
});

// =============================================================================
// PROTECTED ROUTES (Authentication required)
// =============================================================================

// Get current user profile (requires authentication)
app.get('/api/auth/me', protect, (req, res) => {
  res.json({ 
    success: true, 
    user: req.user 
  });
});

// Update user profile (requires authentication)
app.put('/api/auth/profile', protect, (req, res) => {
  res.json({ 
    success: true, 
    message: 'Profile updated',
    user: req.user 
  });
});

// =============================================================================
// ROLE-BASED ROUTES
// =============================================================================

// Create property (only owners and agents)
app.post('/api/properties', 
  protect, 
  authorize('owner', 'agent'), 
  (req, res) => {
    res.json({ 
      success: true, 
      message: 'Property created',
      createdBy: req.user.name 
    });
  }
);

// Send inquiry (only buyers - example of single role)
app.post('/api/properties/:id/inquire', 
  protect, 
  authorize('buyer'), 
  (req, res) => {
    res.json({ 
      success: true, 
      message: 'Inquiry sent',
      from: req.user.name 
    });
  }
);

// =============================================================================
// ADMIN-ONLY ROUTES
// =============================================================================

// Get all users (admin only)
app.get('/api/admin/users', 
  protect, 
  isAdmin, 
  (req, res) => {
    res.json({ 
      success: true, 
      message: 'All users retrieved',
      admin: req.user.name 
    });
  }
);

// Update user role (admin only)
app.put('/api/admin/users/:userId/role', 
  protect, 
  isAdmin, 
  (req, res) => {
    res.json({ 
      success: true, 
      message: 'User role updated',
      admin: req.user.name 
    });
  }
);

// =============================================================================
// OWNERSHIP-BASED ROUTES
// =============================================================================

// Update property (owner or admin only)
app.put('/api/properties/:id', 
  protect,                    // 1. Authenticate user
  attachProperty,             // 2. Fetch property and attach to req.resource
  checkOwnership(),           // 3. Check if user owns property or is admin
  (req, res) => {
    res.json({ 
      success: true, 
      message: 'Property updated',
      property: req.resource.title,
      updatedBy: req.user.name 
    });
  }
);

// Delete property (owner or admin only)
app.delete('/api/properties/:id', 
  protect, 
  attachProperty, 
  checkOwnership(), 
  (req, res) => {
    res.json({ 
      success: true, 
      message: 'Property deleted',
      deletedBy: req.user.name 
    });
  }
);

// Get user's own listings
app.get('/api/properties/my-listings', 
  protect, 
  (req, res) => {
    // This would filter properties by req.user._id
    res.json({ 
      success: true, 
      message: 'User listings retrieved',
      owner: req.user.name 
    });
  }
);

// =============================================================================
// ADVANCED USAGE WITH VERIFICATION
// =============================================================================

// Create premium listing (requires verification)
app.post('/api/properties/premium', 
  protect,                    // 1. Authenticate user
  requireVerified,            // 2. Ensure user is verified
  authorize('owner', 'agent'), // 3. Check role
  (req, res) => {
    res.json({ 
      success: true, 
      message: 'Premium property created',
      createdBy: req.user.name 
    });
  }
);

// =============================================================================
// COMPLEX AUTHORIZATION SCENARIOS
// =============================================================================

// Update user profile (user can update own profile, admin can update any)
app.put('/api/users/:userId', 
  protect,
  attachUserResource,
  (req, res, next) => {
    // Custom authorization: user can update own profile OR admin can update any
    if (req.user.role === 'admin' || req.user._id.toString() === req.params.userId) {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: 'You can only update your own profile'
    });
  },
  (req, res) => {
    res.json({ 
      success: true, 
      message: 'User profile updated',
      updatedBy: req.user.name 
    });
  }
);

// Approve property (admin only, but with custom logic)
app.put('/api/admin/properties/:id/approve', 
  protect,
  isAdmin,
  attachProperty,
  (req, res) => {
    // Additional business logic can go here
    res.json({ 
      success: true, 
      message: 'Property approved',
      property: req.resource.title,
      approvedBy: req.user.name 
    });
  }
);

// =============================================================================
// ERROR HANDLING EXAMPLES
// =============================================================================

// Route that demonstrates error handling
app.get('/api/test/auth-errors', (req, res) => {
  res.json({
    message: 'Test different authentication scenarios',
    examples: {
      'No token': 'Call without Authorization header → 401',
      'Invalid token': 'Call with invalid token → 401',
      'Wrong role': 'Call protected route with wrong role → 403',
      'Not owner': 'Try to update someone else\'s property → 403'
    }
  });
});

// =============================================================================
// MIDDLEWARE CHAIN EXAMPLES
// =============================================================================

// Example of complex middleware chain
app.post('/api/properties/:id/feature', 
  protect,                    // Authentication required
  attachProperty,             // Fetch the property
  authorize('admin'),         // Only admins can feature properties
  (req, res) => {
    res.json({ 
      success: true, 
      message: 'Property featured',
      property: req.resource.title,
      featuredBy: req.user.name 
    });
  }
);

// Example with multiple authorization options
app.get('/api/properties/:id/analytics', 
  protect,
  attachProperty,
  (req, res, next) => {
    // Property owner OR admin can view analytics
    if (req.user.role === 'admin' || 
        req.resource.owner.toString() === req.user._id.toString()) {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: 'Only property owner or admin can view analytics'
    });
  },
  (req, res) => {
    res.json({ 
      success: true, 
      message: 'Property analytics',
      property: req.resource.title,
      viewedBy: req.user.name 
    });
  }
);

module.exports = app;

// =============================================================================
// USAGE NOTES
// =============================================================================

/*
MIDDLEWARE ORDER IS IMPORTANT:

1. protect - Always first for routes requiring authentication
2. attachResource - Before checkOwnership if you need ownership checking
3. authorize/isAdmin - After protect, for role-based access
4. checkOwnership - After attachResource, for ownership-based access
5. requireVerified - After protect, can be anywhere in the chain

COMMON PATTERNS:

// Simple authentication
app.get('/route', protect, handler);

// Role-based access
app.post('/route', protect, authorize('role1', 'role2'), handler);

// Admin only
app.delete('/route', protect, isAdmin, handler);

// Ownership-based access
app.put('/resource/:id', protect, attachResource(finder), checkOwnership(), handler);

// Complex authorization
app.put('/route', protect, authorize('role'), requireVerified, handler);

ERROR RESPONSES:

401 Unauthorized:
- No token provided
- Invalid/expired token
- User not found
- User not authenticated

403 Forbidden:
- Insufficient role privileges
- Not resource owner
- Admin access required
- Email verification required

404 Not Found:
- Resource not found (from attachResource)

500 Server Error:
- Database errors
- Unexpected server errors
*/