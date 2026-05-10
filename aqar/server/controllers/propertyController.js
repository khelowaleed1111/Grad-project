const Property = require('../models/Property');
const User = require('../models/User');
const Inquiry = require('../models/Inquiry');
const APIFeatures = require('../utils/apiFeatures');
const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * @desc    Get all properties with filters and pagination
 * @route   GET /api/properties
 * @access  Public
 */
const getProperties = asyncHandler(async (req, res) => {
  // Build base query - only show approved properties to public
  let baseQuery = Property.find({ isApproved: true }).populate(
    'owner',
    'name phone avatar role'
  );

  // Apply filters, search, sort, pagination
  const features = new APIFeatures(baseQuery, req.query)
    .filter()
    .search()
    .geoFilter()
    .nearLocation()
    .sort()
    .limitFields()
    .paginate();

  const properties = await features.query;

  // Get total count for pagination (without pagination applied)
  const totalQuery = Property.find({ isApproved: true });
  const totalFeatures = new APIFeatures(totalQuery, req.query)
    .filter()
    .search()
    .geoFilter()
    .nearLocation();
  const total = await Property.countDocuments(totalFeatures.query.getQuery());

  // Calculate pagination info
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const totalPages = Math.ceil(total / limit);

  res.json({
    success: true,
    count: properties.length,
    total,
    pagination: {
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    data: properties,
  });
});

/**
 * @desc    Get single property by ID
 * @route   GET /api/properties/:id
 * @access  Public
 */
const getProperty = asyncHandler(async (req, res) => {
  // Validate MongoDB ObjectID format
  const mongoose = require('mongoose');
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid property ID format');
  }

  const property = await Property.findById(req.params.id).populate(
    'owner',
    'name phone avatar role email'
  );

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Increment views
  await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

  res.json({
    success: true,
    data: property,
  });
});

/**
 * @desc    Create new property listing
 * @route   POST /api/properties
 * @access  Private (Owner/Agent)
 */
const createProperty = asyncHandler(async (req, res) => {
  const { title, description, price, status, type, rooms, bathrooms, area, location } = req.body;

  // Parse location if it's a string (from form data)
  let parsedLocation = location;
  if (typeof location === 'string') {
    try {
      parsedLocation = JSON.parse(location);
    } catch (e) {
      parsedLocation = location;
    }
  }

  // Get uploaded image URLs from middleware
  const images = req.imageUrls || [];

  // Create property
  const property = await Property.create({
    title,
    description,
    price,
    status,
    type,
    rooms: rooms || null,
    bathrooms: bathrooms || null,
    area,
    location: parsedLocation,
    images,
    owner: req.user._id,
    isApproved: false, // Requires admin approval
  });

  res.status(201).json({
    success: true,
    message: 'Property submitted for approval',
    data: property,
  });
});

/**
 * @desc    Update property
 * @route   PUT /api/properties/:id
 * @access  Private (Owner/Agent - own listings)
 */
const updateProperty = asyncHandler(async (req, res) => {
  // Validate MongoDB ObjectID format
  const mongoose = require('mongoose');
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid property ID format');
  }

  let property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Check ownership
  if (
    property.owner.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to update this property');
  }

  // Handle new image uploads from middleware
  if (req.imageUrls && req.imageUrls.length > 0) {
    // Append new images to existing ones
    req.body.images = [...property.images, ...req.imageUrls];
  }

  // Parse location if provided
  if (req.body.location && typeof req.body.location === 'string') {
    try {
      req.body.location = JSON.parse(req.body.location);
    } catch (e) {
      // Keep as is
    }
  }

  // If edited, set isApproved to false for re-review
  if (req.user.role !== 'admin') {
    req.body.isApproved = false;
  }

  property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    message: 'Property updated successfully',
    data: property,
  });
});

/**
 * @desc    Delete property
 * @route   DELETE /api/properties/:id
 * @access  Private (Owner/Agent/Admin)
 */
const deleteProperty = asyncHandler(async (req, res) => {
  // Validate MongoDB ObjectID format
  const mongoose = require('mongoose');
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid property ID format');
  }

  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Check ownership
  if (
    property.owner.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this property');
  }

  await property.deleteOne();

  res.json({
    success: true,
    message: 'Property deleted successfully',
  });
});

/**
 * @desc    Get user's own listings
 * @route   GET /api/properties/my-listings
 * @access  Private (Owner/Agent)
 */
const getMyListings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const properties = await Property.find({ owner: req.user._id })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await Property.countDocuments({ owner: req.user._id });

  res.json({
    success: true,
    count: properties.length,
    total,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: properties,
  });
});

/**
 * @desc    Send inquiry about a property
 * @route   POST /api/properties/:id/inquire
 * @access  Private (Buyer)
 */
const sendInquiry = asyncHandler(async (req, res) => {
  const { message, phone, email } = req.body;

  // Validate MongoDB ObjectID format
  const mongoose = require('mongoose');
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid property ID format');
  }

  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  const inquiry = await Inquiry.create({
    property: property._id,
    sender: req.user._id,
    owner: property.owner,
    message,
    phone,
    email,
  });

  res.status(201).json({
    success: true,
    message: 'Inquiry sent successfully',
    data: inquiry,
  });
});

/**
 * @desc    Get featured properties
 * @route   GET /api/properties/featured
 * @access  Public
 */
const getFeaturedProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({
    isApproved: true,
    isFeatured: true,
  })
    .populate('owner', 'name phone avatar')
    .sort('-createdAt')
    .limit(6);

  res.json({
    success: true,
    count: properties.length,
    data: properties,
  });
});

/**
 * @desc    Get similar properties
 * @route   GET /api/properties/:id/similar
 * @access  Public
 */
const getSimilarProperties = asyncHandler(async (req, res) => {
  // Validate MongoDB ObjectID format
  const mongoose = require('mongoose');
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid property ID format');
  }

  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  const similarProperties = await Property.find({
    _id: { $ne: property._id },
    isApproved: true,
    $or: [
      { 'location.city': property.location.city },
      { type: property.type },
      { status: property.status },
    ],
  })
    .populate('owner', 'name phone avatar')
    .limit(4);

  res.json({
    success: true,
    count: similarProperties.length,
    data: similarProperties,
  });
});

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyListings,
  sendInquiry,
  getFeaturedProperties,
  getSimilarProperties,
};
