const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const Notification = require('../models/Notification');
const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * @desc    Get all users (paginated)
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build filter
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const users = await User.find(filter)
    .select('-password')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(filter);

  res.json({
    success: true,
    count: users.length,
    total,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: users,
  });
});

/**
 * @desc    Change user role
 * @route   PUT /api/admin/users/:id/role
 * @access  Private (Admin)
 */
const changeUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!['buyer', 'owner', 'agent', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Invalid role');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent admin from changing their own role
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('Cannot change your own role');
  }

  user.role = role;
  await user.save();

  res.json({
    success: true,
    message: 'User role updated successfully',
    data: user,
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('Cannot delete your own account');
  }

  // Delete user's properties
  await Property.deleteMany({ owner: user._id });

  // Delete user's inquiries
  await Inquiry.deleteMany({
    $or: [{ sender: user._id }, { owner: user._id }],
  });

  // Delete user
  await user.deleteOne();

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});

/**
 * @desc    Get all listings (including unapproved)
 * @route   GET /api/admin/listings
 * @access  Private (Admin)
 */
const getAllListings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build filter
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.type) filter.type = req.query.type;
  if (req.query.isApproved !== undefined) filter.isApproved = req.query.isApproved === 'true';
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { 'location.city': { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const listings = await Property.find(filter)
    .populate('owner', 'name email phone')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await Property.countDocuments(filter);

  res.json({
    success: true,
    count: listings.length,
    total,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: listings,
  });
});

/**
 * @desc    Get pending listings
 * @route   GET /api/admin/listings/pending
 * @access  Private (Admin)
 */
const getPendingListings = asyncHandler(async (req, res) => {
  const listings = await Property.find({ isApproved: false })
    .populate('owner', 'name email phone')
    .sort('-createdAt');

  res.json({
    success: true,
    count: listings.length,
    data: listings,
  });
});

/**
 * @desc    Approve listing
 * @route   PUT /api/admin/listings/:id/approve
 * @access  Private (Admin)
 */
const approveListing = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate('owner', 'name email');

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  property.isApproved = true;
  await property.save();

  // Create notification for property owner
  await Notification.create({
    user: property.owner._id,
    type: 'property_approved',
    title: 'Property Approved! 🎉',
    message: `Your property "${property.title}" has been approved and is now live on the platform.`,
    property: property._id,
  });

  res.json({
    success: true,
    message: 'Property approved successfully',
    data: property,
  });
});

/**
 * @desc    Reject/Delete listing
 * @route   DELETE /api/admin/listings/:id
 * @access  Private (Admin)
 */
const rejectListing = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate('owner', 'name email');

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Create notification for property owner before deleting
  const wasApproved = property.isApproved;
  await Notification.create({
    user: property.owner._id,
    type: 'property_rejected',
    title: wasApproved ? 'Property Removed' : 'Property Not Approved',
    message: wasApproved 
      ? `Your property "${property.title}" has been removed from the platform by an administrator. Please contact support for details.`
      : `Your property "${property.title}" was not approved. Please contact support for more information.`,
  });

  await property.deleteOne();

  res.json({
    success: true,
    message: 'Property rejected and deleted',
  });
});

/**
 * @desc    Feature/Unfeature listing
 * @route   PUT /api/admin/listings/:id/feature
 * @access  Private (Admin)
 */
const toggleFeatureListing = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  property.isFeatured = !property.isFeatured;
  await property.save();

  res.json({
    success: true,
    message: property.isFeatured ? 'Property featured' : 'Property unfeatured',
    data: property,
  });
});

/**
 * @desc    Get platform statistics
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
const getStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProperties = await Property.countDocuments();
  const approvedProperties = await Property.countDocuments({ isApproved: true });
  const pendingProperties = await Property.countDocuments({ isApproved: false });
  const totalInquiries = await Inquiry.countDocuments();

  // Users by role
  const usersByRole = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } },
  ]);

  // Properties by status
  const propertiesByStatus = await Property.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // Properties by type
  const propertiesByType = await Property.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 } } },
  ]);

  // Recent activity (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
  const recentProperties = await Property.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

  res.json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        byRole: usersByRole.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recent: recentUsers,
      },
      properties: {
        total: totalProperties,
        approved: approvedProperties,
        pending: pendingProperties,
        byStatus: propertiesByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byType: propertiesByType.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recent: recentProperties,
      },
      inquiries: totalInquiries,
    },
  });
});

module.exports = {
  getAllUsers,
  changeUserRole,
  deleteUser,
  getAllListings,
  getPendingListings,
  approveListing,
  rejectListing,
  toggleFeatureListing,
  getStats,
};
