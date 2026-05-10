const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  getMyInquiries,
  getSentInquiries,
  markInquiryRead,
  updateInquiryStatus,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/:id', getUserProfile);

// Protected routes
router.get('/me/inquiries', protect, getMyInquiries);
router.get('/me/sent-inquiries', protect, getSentInquiries);
router.put('/me/inquiries/:id/read', protect, markInquiryRead);
router.put('/me/inquiries/:id/status', protect, updateInquiryStatus);

module.exports = router;
