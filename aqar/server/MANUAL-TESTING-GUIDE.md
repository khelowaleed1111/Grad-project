# Manual API Testing Guide for Aqar Platform

This guide provides instructions for manually testing all backend API endpoints to ensure they work correctly.

## Prerequisites

Before running the manual tests, ensure the following:

1. **MongoDB Connection**: 
   - Update `.env` file with valid `MONGO_URI`
   - Ensure MongoDB is running and accessible

2. **Cloudinary Configuration** (optional for basic tests):
   - Update `.env` file with valid Cloudinary credentials
   - Required only for image upload tests

3. **Dependencies Installed**:
   ```bash
   npm install
   ```

## Running the Tests

### Option 1: Automated Test Script

1. **Start the server** (in one terminal):
   ```bash
   npm run dev
   ```

2. **Run the test script** (in another terminal):
   ```bash
   node manual-api-tests.js
   ```

3. **View the results**:
   - Console output shows real-time test results
   - Detailed JSON report saved to `test-report.json`

### Option 2: Manual Testing with cURL or Postman

#### 1. Health Check

```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Aqar API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

#### 2. User Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "TestPass123",
    "phone": "+201234567890",
    "role": "owner"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Test User",
    "email": "testuser@example.com",
    "role": "owner"
  }
}
```

**Save the token** for subsequent authenticated requests.

---

#### 3. User Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPass123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Test User",
    "email": "testuser@example.com",
    "role": "owner"
  }
}
```

---

#### 4. Get Current User Profile (Protected)

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "Test User",
    "email": "testuser@example.com",
    "role": "owner",
    "phone": "+201234567890"
  }
}
```

---

#### 5. Create Property Listing (Protected)

```bash
curl -X POST http://localhost:5000/api/properties \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Luxury Apartment in Cairo",
    "description": "Beautiful 3-bedroom apartment with amazing views",
    "price": 500000,
    "status": "sale",
    "type": "residential",
    "rooms": 3,
    "bathrooms": 2,
    "area": 150,
    "address": "123 Test Street",
    "city": "Cairo",
    "country": "Egypt",
    "lat": 30.0444,
    "lng": 31.2357
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Luxury Apartment in Cairo",
    "price": 500000,
    "isApproved": false,
    "owner": "...",
    "createdAt": "..."
  }
}
```

**Save the property ID** for subsequent tests.

---

#### 6. Get All Properties (Public)

```bash
curl http://localhost:5000/api/properties
```

**Expected Response:**
```json
{
  "success": true,
  "count": 10,
  "pagination": {
    "page": 1,
    "limit": 12,
    "totalPages": 1,
    "totalDocs": 10
  },
  "data": [...]
}
```

---

#### 7. Get Property by ID (Public)

```bash
curl http://localhost:5000/api/properties/PROPERTY_ID_HERE
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Luxury Apartment in Cairo",
    "description": "...",
    "price": 500000,
    "owner": {
      "name": "Test User",
      "email": "testuser@example.com"
    },
    "views": 1
  }
}
```

---

#### 8. Filter Properties by Status

```bash
curl "http://localhost:5000/api/properties?status=sale"
```

**Expected Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    // All properties with status "sale"
  ]
}
```

---

#### 9. Filter Properties by Price Range

```bash
curl "http://localhost:5000/api/properties?minPrice=100000&maxPrice=1000000"
```

**Expected Response:**
```json
{
  "success": true,
  "count": 8,
  "data": [
    // All properties with price between 100000 and 1000000
  ]
}
```

---

#### 10. Filter Properties by City

```bash
curl "http://localhost:5000/api/properties?city=Cairo"
```

**Expected Response:**
```json
{
  "success": true,
  "count": 12,
  "data": [
    // All properties in Cairo
  ]
}
```

---

#### 11. Get My Listings (Protected)

```bash
curl http://localhost:5000/api/properties/my-listings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    // All properties owned by the authenticated user
  ]
}
```

---

#### 12. Update Property (Protected)

```bash
curl -X PUT http://localhost:5000/api/properties/PROPERTY_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Luxury Apartment",
    "price": 550000
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Updated Luxury Apartment",
    "price": 550000
  }
}
```

---

#### 13. Send Property Inquiry (Protected)

```bash
curl -X POST http://localhost:5000/api/properties/PROPERTY_ID_HERE/inquire \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I am interested in this property. Can we schedule a viewing?"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "property": "...",
    "sender": "...",
    "message": "I am interested in this property. Can we schedule a viewing?",
    "createdAt": "..."
  }
}
```

---

#### 14. Update User Profile (Protected)

```bash
curl -X PUT http://localhost:5000/api/auth/update-profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Test User",
    "phone": "+201234567899"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "Updated Test User",
    "phone": "+201234567899"
  }
}
```

---

#### 15. Change Password (Protected)

```bash
curl -X PUT http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "TestPass123",
    "newPassword": "NewPass123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

#### 16. Delete Property (Protected)

```bash
curl -X DELETE http://localhost:5000/api/properties/PROPERTY_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

---

### Admin Endpoints (Require Admin Role)

#### 17. Get Platform Statistics (Admin)

```bash
curl http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 50,
    "totalProperties": 120,
    "pendingApprovals": 15,
    "totalInquiries": 200,
    "usersByRole": {
      "buyer": 30,
      "owner": 15,
      "agent": 4,
      "admin": 1
    },
    "propertiesByStatus": {
      "sale": 80,
      "rent": 40
    },
    "propertiesByType": {
      "residential": 90,
      "commercial": 20,
      "land": 10
    }
  }
}
```

---

#### 18. Get All Users (Admin)

```bash
curl http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "count": 50,
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalDocs": 50
  },
  "data": [...]
}
```

---

#### 19. Change User Role (Admin)

```bash
curl -X PUT http://localhost:5000/api/admin/users/USER_ID_HERE/role \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "agent"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Test User",
    "role": "agent"
  }
}
```

---

#### 20. Get Pending Listings (Admin)

```bash
curl http://localhost:5000/api/admin/listings/pending \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [
    // All properties with isApproved: false
  ]
}
```

---

#### 21. Approve Property (Admin)

```bash
curl -X PUT http://localhost:5000/api/admin/listings/PROPERTY_ID_HERE/approve \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "isApproved": true,
    "isFeatured": false
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "...",
    "isApproved": true,
    "isFeatured": false
  }
}
```

---

#### 22. Delete User (Admin)

```bash
curl -X DELETE http://localhost:5000/api/admin/users/USER_ID_HERE \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Testing Checklist

Use this checklist to track your manual testing progress:

### Authentication Endpoints
- [ ] POST /api/auth/register - User registration
- [ ] POST /api/auth/login - User login
- [ ] GET /api/auth/me - Get current user (protected)
- [ ] PUT /api/auth/update-profile - Update profile (protected)
- [ ] PUT /api/auth/change-password - Change password (protected)

### Property Endpoints
- [ ] GET /api/properties - Get all properties (public)
- [ ] GET /api/properties/:id - Get property by ID (public)
- [ ] GET /api/properties/featured - Get featured properties (public)
- [ ] GET /api/properties/:id/similar - Get similar properties (public)
- [ ] POST /api/properties - Create property (protected, owner/agent)
- [ ] PUT /api/properties/:id - Update property (protected, owner/agent/admin)
- [ ] DELETE /api/properties/:id - Delete property (protected, owner/agent/admin)
- [ ] GET /api/properties/my-listings - Get my listings (protected)
- [ ] POST /api/properties/:id/inquire - Send inquiry (protected)

### Filter Tests
- [ ] Filter by status (sale/rent)
- [ ] Filter by type (residential/commercial/land)
- [ ] Filter by city
- [ ] Filter by price range (minPrice, maxPrice)
- [ ] Filter by rooms
- [ ] Filter by area range (minArea, maxArea)
- [ ] Keyword search
- [ ] Pagination
- [ ] Sorting (price_asc, price_desc, newest)

### User Endpoints
- [ ] GET /api/users/:id - Get user profile (public)
- [ ] GET /api/users/me/inquiries - Get received inquiries (protected)
- [ ] GET /api/users/me/sent-inquiries - Get sent inquiries (protected)
- [ ] PUT /api/users/me/inquiries/:id/read - Mark inquiry as read (protected)
- [ ] PUT /api/users/me/inquiries/:id/status - Update inquiry status (protected)

### Admin Endpoints
- [ ] GET /api/admin/stats - Get platform statistics (admin)
- [ ] GET /api/admin/users - Get all users (admin)
- [ ] PUT /api/admin/users/:id/role - Change user role (admin)
- [ ] DELETE /api/admin/users/:id - Delete user (admin)
- [ ] GET /api/admin/listings - Get all listings (admin)
- [ ] GET /api/admin/listings/pending - Get pending listings (admin)
- [ ] PUT /api/admin/listings/:id/approve - Approve property (admin)
- [ ] DELETE /api/admin/listings/:id - Delete property (admin)
- [ ] PUT /api/admin/listings/:id/feature - Toggle featured status (admin)

### Error Handling Tests
- [ ] Invalid login credentials (401)
- [ ] Unauthorized access without token (401)
- [ ] Forbidden access without proper role (403)
- [ ] Invalid property ID (404)
- [ ] Validation errors (400)
- [ ] Rate limiting on auth endpoints (429)

### Security Tests
- [ ] Password is hashed (not stored in plaintext)
- [ ] JWT token expires after 7 days
- [ ] Protected routes reject requests without token
- [ ] Role-based authorization works correctly
- [ ] CORS headers are set correctly
- [ ] Security headers (helmet) are present

## Expected Issues to Document

While testing, document any issues found:

1. **Response Status Codes**: Verify correct HTTP status codes
2. **Response Format**: Ensure consistent JSON structure
3. **Error Messages**: Check for clear, helpful error messages
4. **Validation**: Test edge cases and invalid inputs
5. **Authorization**: Verify role-based access control
6. **Performance**: Note any slow endpoints
7. **Data Integrity**: Verify data is saved and retrieved correctly

## Test Report

After completing the tests, generate a summary report including:

- Total endpoints tested
- Passed tests
- Failed tests
- Issues found
- Recommendations for fixes

The automated test script (`manual-api-tests.js`) generates a JSON report automatically.

## Notes

- Replace `YOUR_TOKEN_HERE` with actual JWT token from login/register
- Replace `PROPERTY_ID_HERE` with actual property ID
- Replace `USER_ID_HERE` with actual user ID
- Replace `ADMIN_TOKEN_HERE` with JWT token from admin user

## Troubleshooting

### Server won't start
- Check MongoDB connection in `.env`
- Ensure port 5000 is not in use
- Run `npm install` to install dependencies

### Authentication fails
- Verify JWT_SECRET is set in `.env`
- Check token format: `Bearer <token>`
- Ensure token hasn't expired (7 days)

### Image upload fails
- Verify Cloudinary credentials in `.env`
- Check file size (max 5MB per file)
- Ensure file type is image (jpg, jpeg, png, webp)

### Database errors
- Verify MongoDB is running
- Check MONGO_URI format
- Ensure database user has proper permissions
