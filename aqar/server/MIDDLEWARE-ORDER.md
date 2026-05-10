# Express Middleware Order - Aqar Platform

## Middleware Execution Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Incoming Request                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  1. HELMET (Security Headers)                                │
│     - Content Security Policy                                │
│     - HSTS (HTTP Strict Transport Security)                  │
│     - X-Frame-Options: deny                                  │
│     - X-Content-Type-Options: nosniff                        │
│     - X-XSS-Protection                                       │
│     - Referrer-Policy                                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  2. CORS (Cross-Origin Resource Sharing)                     │
│     - Origin: CLIENT_ORIGIN                                  │
│     - Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS        │
│     - Headers: Content-Type, Authorization                   │
│     - Credentials: enabled                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  3. BODY PARSER                                              │
│     - express.json() - Parse JSON bodies (10MB limit)        │
│     - express.urlencoded() - Parse URL-encoded (10MB limit)  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  4. MORGAN (HTTP Request Logger)                             │
│     - Only in development mode                               │
│     - Logs: method, URL, status, response time               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  5. RATE LIMITER (Auth Routes Only)                          │
│     - Path: /api/auth/*                                      │
│     - Limit: 10 requests per 15 minutes per IP              │
│     - Returns 429 when exceeded                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  6. ROUTE HANDLERS                                           │
│     ┌───────────────────────────────────────────────────┐   │
│     │  /api/auth - Authentication Routes                │   │
│     │    - POST /register                                │   │
│     │    - POST /login                                   │   │
│     │    - GET /me (protected)                           │   │
│     │    - PUT /update-profile (protected)               │   │
│     │    - PUT /change-password (protected)              │   │
│     └───────────────────────────────────────────────────┘   │
│                            │                                  │
│     ┌───────────────────────────────────────────────────┐   │
│     │  /api/properties - Property Routes                │   │
│     │    - GET / (public)                                │   │
│     │    - GET /featured (public)                        │   │
│     │    - GET /:id (public)                             │   │
│     │    - POST / (protected, owner/agent)               │   │
│     │    - PUT /:id (protected, owner/agent/admin)       │   │
│     │    - DELETE /:id (protected, owner/agent/admin)    │   │
│     │    - GET /my-listings (protected)                  │   │
│     │    - POST /:id/inquire (protected)                 │   │
│     └───────────────────────────────────────────────────┘   │
│                            │                                  │
│     ┌───────────────────────────────────────────────────┐   │
│     │  /api/users - User Routes                         │   │
│     │    - GET /:id (public)                             │   │
│     │    - GET /me/inquiries (protected)                 │   │
│     │    - GET /me/sent-inquiries (protected)            │   │
│     │    - PUT /me/inquiries/:id/read (protected)        │   │
│     │    - PUT /me/inquiries/:id/status (protected)      │   │
│     └───────────────────────────────────────────────────┘   │
│                            │                                  │
│     ┌───────────────────────────────────────────────────┐   │
│     │  /api/admin - Admin Routes (all protected, admin) │   │
│     │    - GET /stats                                    │   │
│     │    - GET /users                                    │   │
│     │    - PUT /users/:id/role                           │   │
│     │    - DELETE /users/:id                             │   │
│     │    - GET /listings                                 │   │
│     │    - GET /listings/pending                         │   │
│     │    - PUT /listings/:id/approve                     │   │
│     │    - DELETE /listings/:id                          │   │
│     │    - PUT /listings/:id/feature                     │   │
│     └───────────────────────────────────────────────────┘   │
│                            │                                  │
│     ┌───────────────────────────────────────────────────┐   │
│     │  /api/health - Health Check                       │   │
│     │    - GET / (public)                                │   │
│     └───────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  7. ERROR HANDLERS                                           │
│     ┌───────────────────────────────────────────────────┐   │
│     │  notFound - 404 Handler                           │   │
│     │    - Catches undefined routes                      │   │
│     │    - Returns 404 with error message                │   │
│     └───────────────────────────────────────────────────┘   │
│                            │                                  │
│     ┌───────────────────────────────────────────────────┐   │
│     │  errorHandler - Global Error Handler              │   │
│     │    - Validation errors (400)                       │   │
│     │    - Authentication errors (401)                   │   │
│     │    - Authorization errors (403)                    │   │
│     │    - Not found errors (404)                        │   │
│     │    - Server errors (500)                           │   │
│     │    - Mongoose errors                               │   │
│     │    - JWT errors                                    │   │
│     └───────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Response to Client                       │
└─────────────────────────────────────────────────────────────┘
```

## Middleware Order Rationale

### 1. Security Headers First (Helmet)
- **Why First?** Security headers should be applied to ALL responses, including error responses
- **What it does:** Sets HTTP headers to protect against common vulnerabilities
- **Impact:** Prevents XSS, clickjacking, MIME sniffing, etc.

### 2. CORS Second
- **Why Second?** Must be applied before any route handlers to handle preflight requests
- **What it does:** Allows cross-origin requests from the frontend
- **Impact:** Enables frontend (React) to communicate with backend API

### 3. Body Parser Third
- **Why Third?** Must parse request bodies before route handlers can access them
- **What it does:** Parses JSON and URL-encoded request bodies
- **Impact:** Makes req.body available to route handlers

### 4. Logging Fourth (Morgan)
- **Why Fourth?** Should log after body parsing but before route handling
- **What it does:** Logs HTTP requests for debugging
- **Impact:** Helps with debugging and monitoring (dev only)

### 5. Rate Limiting Fifth
- **Why Fifth?** Should be applied before route handlers but after logging
- **What it does:** Limits requests to auth endpoints
- **Impact:** Prevents brute force attacks

### 6. Route Handlers Sixth
- **Why Sixth?** Main application logic
- **What it does:** Handles API requests and returns responses
- **Impact:** Core functionality of the API

### 7. Error Handlers Last
- **Why Last?** Must catch all errors from previous middleware
- **What it does:** Handles 404s and all other errors
- **Impact:** Provides consistent error responses

## Route-Specific Middleware

### Authentication Middleware (protect)
Applied to protected routes to verify JWT token:
```javascript
router.get('/me', protect, getMe);
```

### Authorization Middleware (authorize)
Applied to routes requiring specific roles:
```javascript
router.post('/', protect, authorize('owner', 'agent'), createProperty);
```

### Admin Middleware (isAdmin)
Applied to all admin routes:
```javascript
router.use(protect, isAdmin); // Applied to all routes in adminRoutes
```

### Upload Middleware
Applied to routes handling file uploads:
```javascript
router.put('/update-profile', protect, uploadAvatar, updateProfile);
router.post('/', protect, uploadMultipleImages, createProperty);
```

### Validation Middleware
Applied to routes requiring input validation:
```javascript
router.post('/register', registerValidation, handleValidationErrors, register);
```

## Request Flow Examples

### Example 1: Public Property Search
```
Request: GET /api/properties?city=Cairo
  ↓
Helmet (add security headers)
  ↓
CORS (check origin)
  ↓
Body Parser (no body to parse)
  ↓
Morgan (log request)
  ↓
Route Handler (getProperties)
  ↓
Response: { success: true, data: [...] }
```

### Example 2: User Login
```
Request: POST /api/auth/login
Body: { email: "user@example.com", password: "password123" }
  ↓
Helmet (add security headers)
  ↓
CORS (check origin)
  ↓
Body Parser (parse JSON body)
  ↓
Morgan (log request)
  ↓
Rate Limiter (check if under limit)
  ↓
Validation Middleware (validate email and password)
  ↓
Route Handler (login)
  ↓
Response: { success: true, token: "...", user: {...} }
```

### Example 3: Create Property (Protected)
```
Request: POST /api/properties
Headers: { Authorization: "Bearer <token>" }
Body: FormData with property details and images
  ↓
Helmet (add security headers)
  ↓
CORS (check origin)
  ↓
Body Parser (parse multipart/form-data)
  ↓
Morgan (log request)
  ↓
Auth Middleware (verify JWT token)
  ↓
Authorization Middleware (check role: owner/agent)
  ↓
Upload Middleware (handle image uploads)
  ↓
Route Handler (createProperty)
  ↓
Response: { success: true, data: {...} }
```

### Example 4: Admin Action
```
Request: PUT /api/admin/listings/:id/approve
Headers: { Authorization: "Bearer <token>" }
  ↓
Helmet (add security headers)
  ↓
CORS (check origin)
  ↓
Body Parser (parse JSON body)
  ↓
Morgan (log request)
  ↓
Auth Middleware (verify JWT token)
  ↓
Admin Middleware (check role: admin)
  ↓
Route Handler (approveListing)
  ↓
Response: { success: true, data: {...} }
```

### Example 5: Error Handling
```
Request: GET /api/nonexistent
  ↓
Helmet (add security headers)
  ↓
CORS (check origin)
  ↓
Body Parser (no body to parse)
  ↓
Morgan (log request)
  ↓
Route Handlers (no match)
  ↓
notFound Middleware (create 404 error)
  ↓
errorHandler Middleware (format error response)
  ↓
Response: { success: false, message: "Not Found - /api/nonexistent" }
```

## Best Practices Implemented

✅ **Security First** - Helmet applied before any other middleware
✅ **CORS Early** - Handles preflight requests before route processing
✅ **Body Parsing** - Parses bodies before route handlers need them
✅ **Logging** - Logs requests for debugging (dev only)
✅ **Rate Limiting** - Protects sensitive endpoints from abuse
✅ **Authentication** - Verifies identity before authorization
✅ **Authorization** - Checks permissions after authentication
✅ **Error Handling** - Catches all errors at the end
✅ **Separation of Concerns** - Each middleware has a single responsibility
✅ **Fail Fast** - Authentication/authorization fails early
✅ **Consistent Responses** - Error handler ensures consistent format

## Performance Considerations

- **Helmet**: Minimal overhead, adds headers
- **CORS**: Minimal overhead, checks origin
- **Body Parser**: Parses body once, cached in req.body
- **Morgan**: Only in development, no production overhead
- **Rate Limiter**: Uses in-memory store, very fast
- **Auth Middleware**: Single DB query per request (cached in req.user)
- **Error Handlers**: Only executed on errors

## Security Considerations

- **Helmet**: Protects against common web vulnerabilities
- **CORS**: Prevents unauthorized cross-origin requests
- **Rate Limiter**: Prevents brute force attacks
- **Auth Middleware**: Verifies JWT tokens
- **Authorization**: Enforces role-based access control
- **Error Handler**: Prevents information leakage in production
