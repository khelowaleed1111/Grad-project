const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * @desc    Get user profile by ID
 * @route   GET /api/users/:id
 * @access  Public
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Get user's listings count
  const listingsCount = await Property.countDocuments({
    owner: user._id,
    isApproved: true,
  });

  res.json({
    success: true,
    data: {
      ...user.toObject(),
      listingsCount,
    },
  });
});

/**
 * @desc    Get user's inquiries (received)
 * @route   GET /api/users/inquiries
 * @access  Private (Owner/Agent)
 */
const getMyInquiries = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const inquiries = await Inquiry.find({ owner: req.user._id })
    .populate('property', 'title images price status')
    .populate('sender', 'name email phone avatar')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await Inquiry.countDocuments({ owner: req.user._id });

  res.json({
    success: true,
    count: inquiries.length,
    total,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: inquiries,
  });
});

/**
 * @desc    Get user's sent inquiries
 * @route   GET /api/users/sent-inquiries
 * @access  Private
 */
const getSentInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Inquiry.find({ sender: req.user._id })
    .populate('property', 'title images price status location')
    .sort('-createdAt');

  res.json({
    success: true,
    count: inquiries.length,
    data: inquiries,
  });
});

/**
 * @desc    Mark inquiry as read
 * @route   PUT /api/users/inquiries/:id/read
 * @access  Private (Owner of inquiry)
 */
const markInquiryRead = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);

  if (!inquiry) {
    res.status(404);
    throw new Error('Inquiry not found');
  }

  // Check ownership
  if (inquiry.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  inquiry.isRead = true;
  await inquiry.save();

  res.json({
    success: true,
    message: 'Inquiry marked as read',
  });
});

/**
 * @desc    Update inquiry status
 * @route   PUT /api/users/inquiries/:id/status
 * @access  Private (Owner of inquiry)
 */
const updateInquiryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const inquiry = await Inquiry.findById(req.params.id);

  if (!inquiry) {
    res.status(404);
    throw new Error('Inquiry not found');
  }

  // Check ownership
  if (inquiry.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  inquiry.status = status;
  await inquiry.save();

  res.json({
    success: true,
    message: 'Inquiry status updated',
    data: inquiry,
  });
});

module.exports = {
  getUserProfile,
  getMyInquiries,
  getSentInquiries,
  markInquiryRead,
  updateInquiryStatus,
};
