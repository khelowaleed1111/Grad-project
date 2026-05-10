const request = require('supertest');
const express = require('express');
const path = require('path');
const fs = require('fs');
const { 
  uploadSingleImage, 
  uploadMultipleImages, 
  uploadAvatar, 
  handleMulterError,
  uploadToCloudinary,
  uploadMultipleToCloudinary
} = require('./uploadMiddleware');

// Mock Cloudinary
jest.mock('../config/cloudinary', () => ({
  cloudinary: {
    uploader: {
      upload_stream: jest.fn()
    }
  }
}));

const { cloudinary } = require('../config/cloudinary');

describe('Upload Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    jest.clearAllMocks();
  });

  describe('File Type Validation', () => {
    test('should accept valid image types', async () => {
      app.post('/test-single', uploadSingleImage, (req, res) => {
        res.json({ success: true, imageUrl: req.imageUrl });
      });

      // Mock successful Cloudinary upload
      cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        const mockStream = {
          end: jest.fn(() => {
            callback(null, { secure_url: 'https://cloudinary.com/test.jpg' });
          })
        };
        return mockStream;
      });

      // Create a test image buffer
      const testImageBuffer = Buffer.from('fake-image-data');

      const response = await request(app)
        .post('/test-single')
        .attach('image', testImageBuffer, 'test.jpg');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.imageUrl).toBe('https://cloudinary.com/test.jpg');
    });

    test('should reject invalid file types', async () => {
      app.post('/test-single', uploadSingleImage, (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app)
        .post('/test-single')
        .attach('image', Buffer.from('fake-pdf-data'), 'test.pdf');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid file type');
    });
  });

  describe('File Size Validation', () => {
    test('should reject files larger than 5MB', async () => {
      app.post('/test-single', uploadSingleImage, handleMulterError, (req, res) => {
        res.json({ success: true });
      });

      // Create a buffer larger than 5MB
      const largeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB

      const response = await request(app)
        .post('/test-single')
        .attach('image', largeBuffer, 'large.jpg');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('File too large');
    });
  });

  describe('Multiple File Upload', () => {
    test('should handle multiple image uploads', async () => {
      app.post('/test-multiple', uploadMultipleImages, (req, res) => {
        res.json({ success: true, imageUrls: req.imageUrls });
      });

      // Mock successful Cloudinary uploads
      cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        const mockStream = {
          end: jest.fn(() => {
            callback(null, { secure_url: 'https://cloudinary.com/test.jpg' });
          })
        };
        return mockStream;
      });

      const testImageBuffer1 = Buffer.from('fake-image-data-1');
      const testImageBuffer2 = Buffer.from('fake-image-data-2');

      const response = await request(app)
        .post('/test-multiple')
        .attach('images', testImageBuffer1, 'test1.jpg')
        .attach('images', testImageBuffer2, 'test2.jpg');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.imageUrls).toHaveLength(2);
    });

    test('should reject more than 10 files', async () => {
      app.post('/test-multiple', uploadMultipleImages, handleMulterError, (req, res) => {
        res.json({ success: true });
      });

      const request_builder = request(app).post('/test-multiple');
      
      // Try to attach 11 files
      for (let i = 0; i < 11; i++) {
        request_builder.attach('images', Buffer.from(`fake-image-${i}`), `test${i}.jpg`);
      }

      const response = await request_builder;

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Too many files');
    });
  });

  describe('Avatar Upload', () => {
    test('should handle avatar upload with specific folder', async () => {
      app.post('/test-avatar', uploadAvatar, (req, res) => {
        res.json({ success: true, avatarUrl: req.avatarUrl });
      });

      // Mock successful Cloudinary upload
      cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        expect(options.folder).toBe('aqar/avatars');
        const mockStream = {
          end: jest.fn(() => {
            callback(null, { secure_url: 'https://cloudinary.com/avatar.jpg' });
          })
        };
        return mockStream;
      });

      const testImageBuffer = Buffer.from('fake-avatar-data');

      const response = await request(app)
        .post('/test-avatar')
        .attach('avatar', testImageBuffer, 'avatar.jpg');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.avatarUrl).toBe('https://cloudinary.com/avatar.jpg');
    });
  });

  describe('Cloudinary Integration', () => {
    test('should handle Cloudinary upload errors', async () => {
      app.post('/test-single', uploadSingleImage, (req, res) => {
        res.json({ success: true });
      });

      // Mock Cloudinary upload failure
      cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        const mockStream = {
          end: jest.fn(() => {
            callback(new Error('Cloudinary service unavailable'), null);
          })
        };
        return mockStream;
      });

      const testImageBuffer = Buffer.from('fake-image-data');

      const response = await request(app)
        .post('/test-single')
        .attach('image', testImageBuffer, 'test.jpg');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Cloudinary upload failed');
    });
  });

  describe('No File Handling', () => {
    test('should handle requests with no files gracefully', async () => {
      app.post('/test-single', uploadSingleImage, (req, res) => {
        res.json({ 
          success: true, 
          imageUrl: req.imageUrl || null,
          hasFile: !!req.file 
        });
      });

      const response = await request(app)
        .post('/test-single')
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.imageUrl).toBeNull();
      expect(response.body.hasFile).toBe(false);
    });

    test('should handle multiple upload with no files', async () => {
      app.post('/test-multiple', uploadMultipleImages, (req, res) => {
        res.json({ 
          success: true, 
          imageUrls: req.imageUrls,
          fileCount: req.files ? req.files.length : 0
        });
      });

      const response = await request(app)
        .post('/test-multiple')
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.imageUrls).toEqual([]);
      expect(response.body.fileCount).toBe(0);
    });
  });

  describe('Utility Functions', () => {
    test('uploadToCloudinary should work with buffer', async () => {
      // Mock successful Cloudinary upload
      cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        const mockStream = {
          end: jest.fn(() => {
            callback(null, { secure_url: 'https://cloudinary.com/test.jpg' });
          })
        };
        return mockStream;
      });

      const buffer = Buffer.from('fake-image-data');
      const result = await uploadToCloudinary(buffer, 'test-folder');

      expect(result).toBe('https://cloudinary.com/test.jpg');
      expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
        expect.objectContaining({
          folder: 'test-folder',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }]
        }),
        expect.any(Function)
      );
    });

    test('uploadMultipleToCloudinary should handle multiple buffers', async () => {
      // Mock successful Cloudinary uploads
      cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        const mockStream = {
          end: jest.fn(() => {
            callback(null, { secure_url: 'https://cloudinary.com/test.jpg' });
          })
        };
        return mockStream;
      });

      const files = [
        { buffer: Buffer.from('fake-image-1') },
        { buffer: Buffer.from('fake-image-2') }
      ];

      const results = await uploadMultipleToCloudinary(files, 'test-folder');

      expect(results).toHaveLength(2);
      expect(results[0]).toBe('https://cloudinary.com/test.jpg');
      expect(results[1]).toBe('https://cloudinary.com/test.jpg');
    });
  });
});