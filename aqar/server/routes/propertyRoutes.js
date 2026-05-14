const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyListings,
  sendInquiry,
  getFeaturedProperties,
  getSimilarProperties,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadMultipleImages, handleMulterError } = require('../middleware/uploadMiddleware');

// ⚠️  Named routes MUST come before parameterized routes (/:id)
// to prevent Express treating named paths as ID values.

// Public named routes
router.get('/featured', getFeaturedProperties);

// Owner/Agent only – named route before /:id
router.get('/my-listings', protect, getMyListings);

// Public parameterized routes
router.get('/', getProperties);
router.get('/:id', getProperty);
router.get('/:id/similar', getSimilarProperties);

// Protected routes - require authentication
router.post(
  '/:id/inquire',
  protect,
  [body('message').notEmpty().withMessage('Message is required')],
  sendInquiry
);

// Create listing (All authenticated roles)
router.post(
  '/',
  protect,
  authorize('owner', 'agent', 'buyer'),
  uploadMultipleImages,
  handleMulterError,
  createProperty
);

// Update listing (All roles + Admin)
router.put(
  '/:id',
  protect,
  authorize('owner', 'agent', 'buyer', 'admin'),
  uploadMultipleImages,
  handleMulterError,
  updateProperty
);

// Delete listing (All roles + Admin)
router.delete(
  '/:id',
  protect,
  authorize('owner', 'agent', 'buyer', 'admin'),
  deleteProperty
);

module.exports = router;
