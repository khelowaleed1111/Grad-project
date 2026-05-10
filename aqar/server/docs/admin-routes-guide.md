# Admin Routes API Guide

## Overview

This guide provides detailed information about the admin routes in the Aqar Real Estate Platform. All admin routes require authentication with a valid JWT token and admin role.

## Base URL

```
http://localhost:5000/api/admin
```

## Authentication

All admin routes require:
1. Valid JWT token in the Authorization header
2. User role must be 'admin'

### Authorization Header Format

```
Authorization: Bearer <your-jwt-token>
```

### Error Responses

- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: User is not an admin

---

## Routes

### 1. Get Platform Statistics

Get comprehensive platform statistics including user counts, property counts, and inquiries.

**Endpoint:** `GET /api/admin/stats`

**Authorization:** Admin only

**Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 150,
      "byRole": {
        "buyer": 100,
        "owner": 30,
        "agent": 15,
        "admin": 5
      },
      "recent": 12
    },
    "properties": {
      "total": 500,
      "approved": 450,
      "pending": 50,
      "byStatus": {
        "sale": 300,
        "rent": 200
      },
      "byType": {
        "residential": 350,
        "commercial": 100,
        "land": 50
      },
      "recent": 25
    },
    "inquiries": 1200
  }
}
```

**Validates:** Requirements 13.1-13.7

---

### 2. Get All Users

Retrieve a paginated list of all users with optional filtering.

**Endpoint:** `GET /api/admin/users`

**Authorization:** Admin only

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role (buyer, owner, agent, admin)
- `search` (optional): Search by name or email

**Example Request:**
```
GET /api/admin/users?page=1&limit=20&role=buyer&search=john
```

**Response:**
```json
{
  "success": true,
  "count": 20,
  "total": 100,
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalPages": 5
  },
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "buyer",
      "phone": "+201234567890",
      "avatar": "https://res.cloudinary.com/...",
      "isVerified": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Validates:** Requirement 12.1

---

### 3. Update User Role

Change a user's role. Admins cannot change their own role.

**Endpoint:** `PUT /api/admin/users/:id/role`

**Authorization:** Admin only

**URL Parameters:**
- `id`: User ID

**Request Body:**
```json
{
  "role": "owner"
}
```

**Valid Roles:**
- `buyer`
- `owner`
- `agent`
- `admin`

**Response:**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "owner",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T14:45:00.000Z"
  }
}
```

**Error Cases:**
- **400 Bad Request**: Invalid role or attempting to change own role
- **404 Not Found**: User not found

**Validates:** Requirement 12.2

---

### 4. Delete User

Delete a user account and all associated data (properties, inquiries). Admins cannot delete themselves.

**Endpoint:** `DELETE /api/admin/users/:id`

**Authorization:** Admin only

**URL Parameters:**
- `id`: User ID

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Cascade Deletion:**
- User's properties are deleted
- User's inquiries are deleted

**Error Cases:**
- **400 Bad Request**: Attempting to delete own account
- **404 Not Found**: User not found

**Validates:** Requirements 12.3, 12.4

---

### 5. Get All Listings

Retrieve all property listings including unapproved ones with optional filtering.

**Endpoint:** `GET /api/admin/listings`

**Authorization:** Admin only

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (sale, rent)
- `type` (optional): Filter by type (residential, commercial, land)
- `isApproved` (optional): Filter by approval status (true, false)
- `search` (optional): Search by title or city

**Example Request:**
```
GET /api/admin/listings?page=1&limit=20&isApproved=false&status=sale
```

**Response:**
```json
{
  "success": true,
  "count": 20,
  "total": 50,
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalPages": 3
  },
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Luxury Villa in New Cairo",
      "description": "Beautiful 5-bedroom villa...",
      "price": 5000000,
      "status": "sale",
      "type": "residential",
      "area": 500,
      "rooms": 5,
      "bathrooms": 4,
      "images": ["https://res.cloudinary.com/..."],
      "location": {
        "address": "123 Main St",
        "city": "Cairo",
        "country": "Egypt",
        "coordinates": {
          "lat": 30.0444,
          "lng": 31.2357
        }
      },
      "owner": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+201234567890"
      },
      "isApproved": false,
      "isFeatured": false,
      "views": 0,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Validates:** Requirement 11.1

---

### 6. Get Pending Listings

Retrieve only unapproved property listings.

**Endpoint:** `GET /api/admin/listings/pending`

**Authorization:** Admin only

**Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Luxury Villa in New Cairo",
      "isApproved": false,
      "owner": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Validates:** Requirement 11.1

---

### 7. Approve Listing

Approve a property listing to make it visible in public search results.

**Endpoint:** `PUT /api/admin/listings/:id/approve`

**Authorization:** Admin only

**URL Parameters:**
- `id`: Property ID

**Response:**
```json
{
  "success": true,
  "message": "Property approved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Luxury Villa in New Cairo",
    "isApproved": true,
    "updatedAt": "2024-01-20T14:45:00.000Z"
  }
}
```

**Error Cases:**
- **404 Not Found**: Property not found

**Validates:** Requirements 11.2, 11.6

---

### 8. Reject/Delete Listing

Reject and permanently delete a property listing.

**Endpoint:** `DELETE /api/admin/listings/:id`

**Authorization:** Admin only

**URL Parameters:**
- `id`: Property ID

**Response:**
```json
{
  "success": true,
  "message": "Property rejected and deleted"
}
```

**Error Cases:**
- **404 Not Found**: Property not found

**Validates:** Requirements 11.3, 11.6

---

### 9. Toggle Featured Status

Mark or unmark a property as featured.

**Endpoint:** `PUT /api/admin/listings/:id/feature`

**Authorization:** Admin only

**URL Parameters:**
- `id`: Property ID

**Response:**
```json
{
  "success": true,
  "message": "Property featured",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Luxury Villa in New Cairo",
    "isFeatured": true,
    "updatedAt": "2024-01-20T14:45:00.000Z"
  }
}
```

**Error Cases:**
- **404 Not Found**: Property not found

**Validates:** Requirement 11.4

---

## Security Features

### Role-Based Access Control

All admin routes implement two-layer authorization:

1. **Authentication Check** (`protect` middleware):
   - Verifies JWT token from Authorization header
   - Attaches user object to request
   - Returns 401 if token is invalid/missing

2. **Admin Role Check** (`isAdmin` middleware):
   - Verifies user has 'admin' role
   - Returns 403 if user is not admin

### Self-Protection

Admins are protected from accidentally harming their own accounts:
- Cannot change their own role
- Cannot delete their own account

### Input Validation

- Role changes are validated against allowed values
- Invalid roles return 400 Bad Request

### Cascade Deletion

When deleting a user:
- All user's properties are deleted
- All user's inquiries are deleted
- Ensures data consistency

---

## Testing with cURL

### Get Platform Stats
```bash
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get All Users
```bash
curl -X GET "http://localhost:5000/api/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update User Role
```bash
curl -X PUT http://localhost:5000/api/admin/users/USER_ID/role \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "owner"}'
```

### Delete User
```bash
curl -X DELETE http://localhost:5000/api/admin/users/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get All Listings
```bash
curl -X GET "http://localhost:5000/api/admin/listings?isApproved=false" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Approve Listing
```bash
curl -X PUT http://localhost:5000/api/admin/listings/PROPERTY_ID/approve \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Delete Listing
```bash
curl -X DELETE http://localhost:5000/api/admin/listings/PROPERTY_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Toggle Featured Status
```bash
curl -X PUT http://localhost:5000/api/admin/listings/PROPERTY_ID/feature \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Common Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid role"
}
```

---

## Requirements Validation

This implementation validates:

- **Requirement 3.2**: Admin-only route verification
- **Requirement 3.3**: 403 Forbidden for insufficient privileges
- **Requirements 11.1-11.7**: Admin property approval workflow
- **Requirements 12.1-12.5**: Admin user management
- **Requirements 13.1-13.7**: Platform statistics

---

## Related Documentation

- [Admin Controller Guide](./admin-controller-guide.md)
- [Authentication Middleware](../middleware/authMiddleware.js)
- [API Features Utility](./api-features-utility.md)
