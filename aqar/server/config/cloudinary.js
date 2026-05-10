const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload single image from buffer (for memory storage)
const uploadImageFromBuffer = async (buffer, folder = 'aqar') => {
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
          reject(new Error(`Image upload failed: ${error.message}`));
        } else {
          resolve(result.secure_url);
        }
      }
    ).end(buffer);
  });
};

// Upload single image from file path (for disk storage - legacy support)
const uploadImage = async (file, folder = 'aqar') => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });
    return result.secure_url;
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

// Upload multiple images from buffers
const uploadMultipleImagesFromBuffers = async (files, folder = 'aqar') => {
  try {
    const uploadPromises = files.map(file => uploadImageFromBuffer(file.buffer, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error(`Multiple image upload failed: ${error.message}`);
  }
};

// Upload multiple images from file paths (legacy support)
const uploadMultipleImages = async (files, folder = 'aqar') => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error(`Multiple image upload failed: ${error.message}`);
  }
};

// Delete image by public ID
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Image deletion failed: ${error.message}`);
  }
};

// Extract public ID from Cloudinary URL
const extractPublicId = (url) => {
  try {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];
    const folder = parts.slice(-2, -1)[0];
    return folder ? `${folder}/${publicId}` : publicId;
  } catch (error) {
    throw new Error('Invalid Cloudinary URL format');
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  uploadImageFromBuffer,
  uploadMultipleImages,
  uploadMultipleImagesFromBuffers,
  deleteImage,
  extractPublicId,
};
