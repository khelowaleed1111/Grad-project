const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');

/**
 * Multer configuration for image uploads
 * Stores files in memory for Cloudinary upload
 */
const storage = multer.memoryStorage();

/**
 * File filter - accept only images
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and WebP images are allowed.'), false);
  }
};

/**
 * Multer upload instance
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

/**
 * Upload single image to Cloudinary from memory buffer
 */
const uploadToCloudinary = (buffer, folder = 'aqar') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          resolve(result.secure_url);
        }
      }
    ).end(buffer);
  });
};

/**
 * Upload multiple images to Cloudinary
 */
const uploadMultipleToCloudinary = async (files, folder = 'aqar') => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file.buffer, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error(`Multiple image upload failed: ${error.message}`);
  }
};

/**
 * Middleware to upload single image and attach URL to req.imageUrl
 */
const uploadSingleImage = [
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        // Handle multer errors
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              message: 'File too large. Maximum size is 5MB.',
            });
          }
          return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`,
          });
        }
        // Handle other errors (like file type validation)
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      next();
    });
  },
  async (req, res, next) => {
    try {
      if (!req.file) {
        return next();
      }

      const isMock = !process.env.CLOUDINARY_CLOUD_NAME || 
                     process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name';

      if (isMock) {
        const b64 = req.file.buffer.toString('base64');
        req.imageUrl = `data:${req.file.mimetype};base64,${b64}`;
        return next();
      }

      const imageUrl = await uploadToCloudinary(req.file.buffer);
      req.imageUrl = imageUrl;
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
];

/**
 * Middleware to upload multiple images and attach URLs to req.imageUrls
 */
const uploadMultipleImages = [
  (req, res, next) => {
    upload.array('images', 10)(req, res, (err) => {
      if (err) {
        // Handle multer errors
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              message: 'File too large. Maximum size is 5MB.',
            });
          }
          if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
              success: false,
              message: 'Too many files. Maximum is 10 images.',
            });
          }
          return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`,
          });
        }
        // Handle other errors (like file type validation)
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      next();
    });
  },
  async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        req.imageUrls = [];
        return next();
      }

      const isMock = !process.env.CLOUDINARY_CLOUD_NAME || 
                     process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name';

      if (isMock) {
        req.imageUrls = req.files.map(file => {
          const b64 = file.buffer.toString('base64');
          return `data:${file.mimetype};base64,${b64}`;
        });
        return next();
      }

      const imageUrls = await uploadMultipleToCloudinary(req.files);
      req.imageUrls = imageUrls;
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
];

/**
 * Middleware to upload avatar and attach URL to req.avatarUrl
 */
const uploadAvatar = [
  (req, res, next) => {
    upload.single('avatar')(req, res, (err) => {
      if (err) {
        // Handle multer errors
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              message: 'File too large. Maximum size is 5MB.',
            });
          }
          return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`,
          });
        }
        // Handle other errors (like file type validation)
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      next();
    });
  },
  async (req, res, next) => {
    try {
      if (!req.file) {
        return next();
      }

      // Check if Cloudinary is configured
      const isMock = !process.env.CLOUDINARY_CLOUD_NAME || 
                     process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name';

      if (isMock) {
        // FALLBACK: Mock upload for development
        // Convert buffer to base64 data URI
        const b64 = req.file.buffer.toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        req.avatarUrl = dataURI;
        console.log('🚧 Using Mock Upload (Cloudinary not configured)');
        return next();
      }

      const avatarUrl = await uploadToCloudinary(req.file.buffer, 'aqar/avatars');
      req.avatarUrl = avatarUrl;
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
];

/**
 * Handle multer errors
 */
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 10 images.',
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name for file upload.',
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next();
};

module.exports = {
  upload,
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  uploadSingleImage,
  uploadMultipleImages,
  uploadAvatar,
  handleMulterError,
};
