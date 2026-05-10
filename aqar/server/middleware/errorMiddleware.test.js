const { ApiError, notFound, errorHandler, asyncHandler } = require('./errorMiddleware');

describe('Error Middleware', () => {
  describe('ApiError', () => {
    it('should create an ApiError with statusCode and message', () => {
      const error = new ApiError(404, 'Resource not found');
      
      expect(error).toBeInstanceOf(Error);
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Resource not found');
      expect(error.isOperational).toBe(true);
      expect(error.errors).toBeNull();
    });

    it('should create an ApiError with errors array', () => {
      const errors = [{ field: 'email', message: 'Invalid email' }];
      const error = new ApiError(400, 'Validation failed', errors);
      
      expect(error.statusCode).toBe(400);
      expect(error.errors).toEqual(errors);
    });
  });

  describe('notFound middleware', () => {
    it('should create a 404 error and pass it to next', () => {
      const req = { originalUrl: '/api/nonexistent' };
      const res = {};
      const next = jest.fn();

      notFound(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(404);
      expect(error.message).toContain('/api/nonexistent');
    });
  });

  describe('errorHandler middleware', () => {
    let req, res, next, consoleErrorSpy;

    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('should handle 404 errors', () => {
      const error = new ApiError(404, 'Resource not found');
      
      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Resource not found',
        errors: null,
      });
    });

    it('should handle 500 internal server errors', () => {
      const error = new Error('Something went wrong');
      
      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Something went wrong',
        })
      );
    });

    it('should handle Mongoose validation errors (400)', () => {
      const error = {
        name: 'ValidationError',
        errors: {
          email: {
            path: 'email',
            message: 'Email is required',
          },
          password: {
            path: 'password',
            message: 'Password must be at least 8 characters',
          },
        },
      };

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation Error',
        errors: [
          { field: 'email', message: 'Email is required' },
          { field: 'password', message: 'Password must be at least 8 characters' },
        ],
      });
    });

    it('should handle MongoDB duplicate key errors (11000)', () => {
      const error = {
        code: 11000,
        keyValue: { email: 'test@example.com' },
        message: 'Duplicate key error',
      };

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'email already exists',
      });
    });

    it('should handle Mongoose CastError (invalid ObjectId)', () => {
      const error = {
        name: 'CastError',
        message: 'Cast to ObjectId failed',
      };

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Invalid ID format',
        })
      );
    });

    it('should handle JWT JsonWebTokenError (401)', () => {
      const error = {
        name: 'JsonWebTokenError',
        message: 'jwt malformed',
      };

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Invalid token',
        })
      );
    });

    it('should handle JWT TokenExpiredError (401)', () => {
      const error = {
        name: 'TokenExpiredError',
        message: 'jwt expired',
      };

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Token expired',
        })
      );
    });

    it('should include stack trace in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Test error');
      error.stack = 'Error stack trace';

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          stack: 'Error stack trace',
        })
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('should not include stack trace in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Test error');
      error.stack = 'Error stack trace';

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.not.objectContaining({
          stack: expect.anything(),
        })
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('should log error details to console', () => {
      const error = new Error('Test error');
      
      errorHandler(error, req, res, next);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error:',
        expect.objectContaining({
          message: 'Test error',
          stack: expect.any(String),
        })
      );
    });
  });

  describe('asyncHandler', () => {
    it('should catch async errors and pass to next', async () => {
      const error = new Error('Async error');
      const asyncFn = jest.fn().mockRejectedValue(error);
      const req = {};
      const res = {};
      const next = jest.fn();

      const wrappedFn = asyncHandler(asyncFn);
      await wrappedFn(req, res, next);

      expect(asyncFn).toHaveBeenCalledWith(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle successful async operations', async () => {
      const asyncFn = jest.fn().mockResolvedValue('success');
      const req = {};
      const res = {};
      const next = jest.fn();

      const wrappedFn = asyncHandler(asyncFn);
      await wrappedFn(req, res, next);

      expect(asyncFn).toHaveBeenCalledWith(req, res, next);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
