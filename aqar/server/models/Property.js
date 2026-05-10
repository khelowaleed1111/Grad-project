const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    status: {
      type: String,
      enum: ['rent', 'sale'],
      required: [true, 'Status is required (rent or sale)'],
    },
    type: {
      type: String,
      enum: ['residential', 'commercial', 'land'],
      required: [true, 'Property type is required'],
    },
    category: {
      type: String,
      trim: true,
      maxlength: [100, 'Category cannot exceed 100 characters'],
    },
    rooms: {
      type: Number,
      min: [0, 'Rooms cannot be negative'],
      default: null,
    },
    bathrooms: {
      type: Number,
      min: [0, 'Bathrooms cannot be negative'],
      default: null,
    },
    area: {
      type: Number,
      required: [true, 'Area is required'],
      min: [0, 'Area cannot be negative'],
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        type: String, // Cloudinary URLs
      },
    ],
    videoUrl: {
      type: String,
      trim: true,
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      governorate: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        default: 'Egypt',
      },
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: [true, 'Coordinates are required'],
          validate: {
            validator: function (coords) {
              // Validate [longitude, latitude] format
              if (!Array.isArray(coords) || coords.length !== 2) {
                return false;
              }
              const [lng, lat] = coords;
              // Longitude: -180 to 180, Latitude: -90 to 90
              return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
            },
            message: 'Invalid coordinates. Must be [longitude, latitude] with valid ranges.',
          },
        },
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
propertySchema.index({ status: 1, type: 1 });
propertySchema.index({ 'location.city': 1 });
propertySchema.index({ 'location.governorate': 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ rooms: 1 });
propertySchema.index({ isApproved: 1 });
propertySchema.index({ createdAt: -1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ deletedAt: 1 }); // For soft delete queries

// Geospatial 2dsphere index for map bounds queries (GeoJSON format)
propertySchema.index({ 'location.coordinates': '2dsphere' });

// Text index for keyword search
propertySchema.index({ title: 'text', description: 'text' });

// Query middleware to exclude soft-deleted documents by default
propertySchema.pre(/^find/, function (next) {
  // Only apply if deletedAt filter is not explicitly set
  if (!this.getQuery().deletedAt) {
    this.where({ deletedAt: null });
  }
  next();
});

// Instance method for soft delete
propertySchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  return this.save();
};

// Instance method to restore soft-deleted property
propertySchema.methods.restore = function () {
  this.deletedAt = null;
  return this.save();
};

// Static method to find including soft-deleted
propertySchema.statics.findWithDeleted = function () {
  return this.find({});
};

// Static method to find only soft-deleted
propertySchema.statics.findDeleted = function () {
  return this.find({ deletedAt: { $ne: null } });
};

// Add pagination plugin
propertySchema.plugin(mongoosePaginate);

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
