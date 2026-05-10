# Error Handling Middleware Guide

## Overview

The Aqar platform implements comprehensive error handling middleware that provides consistent error responses, proper HTTP status codes, and detailed error information for debugging.

## Architecture

```
Request Flow:
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│   Express Routes & Controllers  │
└──────┬──────────────────┬───────┘
       │                  │
       │ Success          │ Error
       ▼                  ▼
┌─────────────┐    ┌──────────────────┐
│  Response   │    │  Error Middleware│
└─────────────┘    └──────┬───────────┘
                          │
                          ▼
                   ┌──────────────────┐
                   │  Error Response  │
                   └──────────────────┘
```

## Components

### 1. ApiError Class

Custom error class for creating operational errors with status codes.

```javascript
class ApiError extends Error {
  constructor(statusCode, message, errors = null)
}
```

**Usage:**
```javascript
// Simple error
throw new ApiError(404, 'Property not found');

// Error with validation details
throw new ApiError(400, 'Validation failed', [
  { field: 'email', message: 'Invalid email format' }
]);
```

### 2. notFound Middleware

Catches all requests to undefined routes and creates a 404 error.

```javascript
const notFound = (req, res, next) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};
```

**Mounted in server.js:**
```javascript
// Must be placed after all route definitions
app.use(notFound);
```

### 3. errorHandler Middleware

Global error handler that processes all errors and sends appropriate responses.

```javascript
const errorHandler = (err, req, res, next) => {
  // Handles all error types and sends formatted response
};
```

**Mounted in server.js:**
```javascript
// Must be the last middleware
app.use(errorHandler);
```

### 4. asyncHandler Utility

Wrapper function that catches errors in async route handlers.

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

**Usage:**
```javascript
const { asyncHandler } = require('../middleware/errorMiddleware');

exports.getProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  
  if (!property) {
    throw new ApiError(404, 'Property not found');
  }
  
  res.json({ success: true, data: property });
});
```

## Error Types Handled

### 1. 404 Not Found

**Trigger:** Request to undefined route

**Response:**
```json
{
  "success": false,
  "message": "Not Found - /api/undefined-route",
  "errors": null
}
```

**Status Code:** 404

---

### 2. Validation Errors

**Trigger:** Mongoose ValidationError

**Response:**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

**Status Code:** 400

---

### 3. MongoDB Duplicate Key Error

**Trigger:** Attempting to create a document with a duplicate unique field

**Response:**
```json
{
  "success": false,
  "message": "email already exists"
}
```

**Status Code:** 400

---

### 4. Invalid ObjectId (CastError)

**Trigger:** Invalid MongoDB ObjectId format

**Response:**
```json
{
  "success": false,
  "message": "Invalid ID format",
  "errors": null
}
```

**Status Code:** 400

---

### 5. Invalid JWT Token

**Trigger:** Malformed or invalid JWT token

**Response:**
```json
{
  "success": false,
  "message": "Invalid token",
  "errors": null
}
```

**Status Code:** 401

---

### 6. Expired JWT Token

**Trigger:** JWT token has expired

**Response:**
```json
{
  "success": false,
  "message": "Token expired",
  "errors": null
}
```

**Status Code:** 401

---

### 7. Internal Server Error

**Trigger:** Unexpected server errors

**Response (Production):**
```json
{
  "success": false,
  "message": "Internal Server Error",
  "errors": null
}
```

**Response (Development):**
```json
{
  "success": false,
  "message": "Internal Server Error",
  "errors": null,
  "stack": "Error: ...\n    at ..."
}
```

**Status Code:** 500

---

## HTTP Status Codes

| Code | Type | Description |
|------|------|-------------|
| 400 | Bad Request | Validation errors, invalid input, MongoDB errors |
| 401 | Unauthorized | Authentication failures, invalid/expired tokens |
| 403 | Forbidden | Insufficient permissions (handled in authMiddleware) |
| 404 | Not Found | Resource or route not found |
| 500 | Internal Server Error | Unexpected server errors |

## Error Response Format

### Standard Format

All error responses follow this structure:

```typescript
{
  success: false,           // Always false for errors
  message: string,          // Human-readable error message
  errors: Array | null,     // Optional array of field-specific errors
  stack?: string           // Stack trace (development only)
}
```

### Field-Specific Errors

For validation errors, the `errors` array contains:

```typescript
{
  field: string,    // Name of the field with error
  message: string   // Error message for that field
}
```

## Development vs Production

### Development Mode
- Includes full stack traces in error responses
- Detailed error logging to console
- Verbose error messages

### Production Mode
- No stack traces in responses
- Generic error messages for security
- Error logging to external service (future enhancement)

**Environment Detection:**
```javascript
process.env.NODE_ENV === 'development'
```

## Error Logging

All errors are logged to the console with:
- Error message
- Stack trace
- Status code

```javascript
console.error('Error:', {
  message: err.message,
  stack: err.stack,
  statusCode,
});
```

## Best Practices

### 1. Use asyncHandler for Async Routes

**❌ Don't:**
```javascript
exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    res.json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};
```

**✅ Do:**
```javascript
exports.getProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  
  if (!property) {
    throw new ApiError(404, 'Property not found');
  }
  
  res.json({ success: true, data: property });
});
```

### 2. Throw ApiError for Operational Errors

**❌ Don't:**
```javascript
if (!property) {
  return res.status(404).json({ message: 'Not found' });
}
```

**✅ Do:**
```javascript
if (!property) {
  throw new ApiError(404, 'Property not found');
}
```

### 3. Let Middleware Handle Errors

**❌ Don't:**
```javascript
try {
  // ... code
} catch (error) {
  res.status(500).json({ message: error.message });
}
```

**✅ Do:**
```javascript
// Let asyncHandler catch errors
const property = await Property.findById(req.params.id);
```

### 4. Provide Meaningful Error Messages

**❌ Don't:**
```javascript
throw new ApiError(400, 'Error');
```

**✅ Do:**
```javascript
throw new ApiError(400, 'Property price must be a positive number');
```

## Integration Example

### Complete Controller Example

```javascript
const { asyncHandler, ApiError } = require('../middleware/errorMiddleware');
const Property = require('../models/Property');

// Get property by ID
exports.getPropertyById = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id).populate('owner');
  
  if (!property) {
    throw new ApiError(404, 'Property not found');
  }
  
  // Increment views
  property.views += 1;
  await property.save();
  
  res.json({
    success: true,
    data: property,
  });
});

// Create property
exports.createProperty = asyncHandler(async (req, res, next) => {
  // Validate required fields
  if (!req.body.title || !req.body.price) {
    throw new ApiError(400, 'Title and price are required');
  }
  
  // Create property
  const property = await Property.create({
    ...req.body,
    owner: req.user._id,
  });
  
  res.status(201).json({
    success: true,
    data: property,
  });
});

// Update property
exports.updateProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  
  if (!property) {
    throw new ApiError(404, 'Property not found');
  }
  
  // Check ownership
  if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to update this property');
  }
  
  const updatedProperty = await Property.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.json({
    success: true,
    data: updatedProperty,
  });
});
```

### Server.js Integration

```javascript
const express = require('express');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// ... other middleware ...

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error handling (MUST BE LAST)
app.use(notFound);      // Catch 404 errors
app.use(errorHandler);  // Handle all errors

module.exports = app;
```

## Testing

### Test Coverage

The error middleware includes comprehensive tests for:

1. ✅ ApiError class creation
2. ✅ 404 Not Found errors
3. ✅ 500 Internal Server errors
4. ✅ Mongoose validation errors
5. ✅ MongoDB duplicate key errors
6. ✅ Mongoose CastError
7. ✅ JWT errors (invalid and expired)
8. ✅ Stack trace handling (dev vs prod)
9. ✅ Error logging
10. ✅ Async error handling

### Running Tests

```bash
# Run all tests
npm test

# Run error middleware tests only
npm test -- errorMiddleware.test.js

# Run with coverage
npm run test:coverage
```

## Troubleshooting

### Error Not Being Caught

**Problem:** Errors in async functions not being caught

**Solution:** Wrap route handler with `asyncHandler`

```javascript
// Before
exports.handler = async (req, res, next) => { ... };

// After
exports.handler = asyncHandler(async (req, res, next) => { ... });
```

### Stack Trace Not Showing

**Problem:** Stack trace not included in development

**Solution:** Check NODE_ENV environment variable

```bash
# Set in .env file
NODE_ENV=development
```

### Custom Error Not Working

**Problem:** Custom ApiError not returning correct status code

**Solution:** Ensure error is thrown, not returned

```javascript
// Wrong
return new ApiError(404, 'Not found');

// Correct
throw new ApiError(404, 'Not found');
```

## Future Enhancements

- [ ] Integration with external logging service (e.g., Sentry, LogRocket)
- [ ] Error rate monitoring and alerting
- [ ] Custom error pages for frontend
- [ ] Error categorization and analytics
- [ ] Automatic error recovery mechanisms

## Related Documentation

- [Authentication Middleware Guide](./auth-middleware-guide.md)
- [API Documentation](./api-documentation.md)
- [Security Best Practices](./security-guide.md)

---

**Last Updated:** 2024  
**Version:** 1.0.0  
**Maintainer:** Aqar Development Team
