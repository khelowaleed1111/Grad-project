const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllUsers,
  changeUserRole,
  deleteUser,
  getAllListings,
  getPendingListings,
  approveListing,
  rejectListing,
  toggleFeatureListing,
  getStats,
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect, isAdmin);

// Stats
router.get('/stats', getStats);

// Users management
router.get('/users', getAllUsers);
router.put(
  '/users/:id/role',
  [body('role').isIn(['buyer', 'owner', 'agent', 'admin']).withMessage('Invalid role')],
  changeUserRole
);
router.delete('/users/:id', deleteUser);

// Listings management
router.get('/listings', getAllListings);
router.get('/listings/pending', getPendingListings);
router.put('/listings/:id/approve', approveListing);
router.delete('/listings/:id', rejectListing);
router.put('/listings/:id/feature', toggleFeatureListing);

module.exports = router;
