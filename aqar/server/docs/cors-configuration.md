# CORS Configuration Guide

## Overview

This document describes the Cross-Origin Resource Sharing (CORS) configuration for the Aqar Real Estate Platform backend API. CORS is configured to allow the frontend application to make requests to the backend API from a different origin.

## Configuration Location

The CORS configuration is implemented in `server.js` using the `cors` middleware package.

## Configuration Details

### Allowed Origin

The backend accepts requests from the origin specified in the `CLIENT_ORIGIN` environment variable:

```javascript
origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
```

- **Default**: `http://localhost:5173` (Vite development server)
- **Production**: Set `CLIENT_ORIGIN` in `.env` to your frontend domain (e.g., `https://aqar.example.com`)

### Credentials

Credentials are enabled to support cookie-based authentication:

```javascript
credentials: true
```

This allows the frontend to send cookies, authorization headers, and TLS client certificates.

### Allowed HTTP Methods

The following HTTP methods are allowed:

- `GET` - Retrieve resources
- `POST` - Create new resources
- `PUT` - Update existing resources
- `DELETE` - Delete resources
- `PATCH` - Partially update resources
- `OPTIONS` - Preflight requests

```javascript
methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
```

### Allowed Headers

The following request headers are allowed:

- `Content-Type` - Specifies the media type of the request body
- `Authorization` - Contains JWT token for authentication

```javascript
allowedHeaders: ['Content-Type', 'Authorization']
```

## Environment Configuration

### Development

In development, the frontend typically runs on `http://localhost:5173` (Vite default port).

**.env**:
```env
CLIENT_ORIGIN=http://localhost:5173
```

### Production

In production, set `CLIENT_ORIGIN` to your actual frontend domain:

**.env**:
```env
CLIENT_ORIGIN=https://aqar.example.com
```

**Important**: Never use wildcards (`*`) in production as this would allow any origin to access your API.

## Security Considerations

### 1. Specific Origin

The CORS configuration uses a specific origin rather than allowing all origins (`*`). This prevents unauthorized websites from making requests to the API.

### 2. Credentials

Credentials are enabled (`credentials: true`) to support JWT tokens in the `Authorization` header. This is secure when combined with a specific origin.

### 3. Limited Headers

Only `Content-Type` and `Authorization` headers are allowed, reducing the attack surface.

### 4. HTTPS in Production

Always use HTTPS in production to prevent man-in-the-middle attacks:
- Backend: `https://api.aqar.example.com`
- Frontend: `https://aqar.example.com`

## Testing CORS Configuration

### Manual Testing with cURL

Test CORS headers with a preflight request:

```bash
curl -X OPTIONS http://localhost:5000/api/health \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  -v
```

Expected response headers:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,PATCH,OPTIONS
Access-Control-Allow-Headers: Content-Type,Authorization
Access-Control-Allow-Credentials: true
```

### Automated Testing

Run the CORS test suite:

```bash
npm test -- cors.test.js
```

The test suite verifies:
- ✅ Requests from CLIENT_ORIGIN are allowed
- ✅ All specified HTTP methods are allowed
- ✅ Content-Type and Authorization headers are allowed
- ✅ Credentials are enabled
- ✅ Requests from unauthorized origins are rejected
- ✅ Preflight OPTIONS requests are handled correctly

## Troubleshooting

### Issue: CORS Error in Browser Console

**Error Message**:
```
Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:5173' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present.
```

**Solutions**:

1. **Check CLIENT_ORIGIN**: Ensure `CLIENT_ORIGIN` in `.env` matches your frontend URL exactly
2. **Restart Server**: After changing `.env`, restart the backend server
3. **Check Frontend URL**: Verify the frontend is running on the expected port
4. **Check Browser**: Clear browser cache and hard reload (Ctrl+Shift+R)

### Issue: Credentials Not Sent

**Error Message**:
```
Access to fetch at '...' has been blocked by CORS policy: 
The value of the 'Access-Control-Allow-Credentials' header is '' which must be 'true'.
```

**Solutions**:

1. **Frontend**: Ensure `credentials: 'include'` is set in fetch/axios requests
2. **Backend**: Verify `credentials: true` is set in CORS configuration

### Issue: Authorization Header Not Allowed

**Error Message**:
```
Request header field authorization is not allowed by Access-Control-Allow-Headers.
```

**Solutions**:

1. **Check Configuration**: Verify `Authorization` is in `allowedHeaders` array
2. **Case Sensitivity**: Ensure header name case matches (should be case-insensitive but some browsers are strict)

## Requirements Validation

This CORS configuration satisfies the following requirements:

- ✅ **Requirement 16.2**: Configure CORS to allow requests only from the CLIENT_ORIGIN environment variable
- ✅ **Requirement 16.3**: Allow CORS methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
- ✅ **Requirement 16.4**: Allow CORS headers: Content-Type, Authorization
- ✅ **Requirement 16.5**: Enable CORS credentials for cookie-based authentication

## Related Documentation

- [Helmet Security Headers](./helmet-security-headers.md)
- [JWT Authentication](../examples/jwt-integration-example.js)
- [Rate Limiting](../middleware/rateLimitMiddleware.js)

## References

- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS Middleware](https://expressjs.com/en/resources/middleware/cors.html)
- [OWASP: CORS Security](https://owasp.org/www-community/attacks/CORS_OriginHeaderScrutiny)
