# Admin Controller API Guide

## Overview

The Admin Controller provides administrative functions for managing users, properties, and viewing platform statistics. All endpoints require authentication and admin role.

## Authentication

All admin endpoints require:
1. Valid JWT token in Authorization header
2. User role must be 'admin'

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### User Management

#### 1. Get All Users

**Endpoint:** `GET /api/admin/users`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role (buyer, owner, agent, admin)
- `search` (optional): Search by name or email

**Example Request:**
```bash
GET /api/admin/users?page=1&limit=10&role=buyer&search=john
```

**Example Response:**
```json
{
  "success": true,
  "count": 5,
  "total": 50,
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 5
  },
  "data": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "buyer",
      "phone": "+20123456789",
      "avatar": "https://...",
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 2. Change User Role

**Endpoint:** `PUT /api/admin/users/:id/role`

**Body:**
```json
{
  "role": "owner"
}
```

**Valid Roles:** buyer, owner, agent, admin

**Example Response:**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "owner"
  }
}
```

**Notes:**
- Cannot change your own role
- Returns 400 if trying to change own role
- Returns 404 if user not found

#### 3. Delete User

**Endpoint:** `DELETE /api/admin/users/:id`

**Example Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Notes:**
- Cannot delete your own account
- Deletes all user's properties
- Deletes all user's inquiries
- Returns 400 if trying to delete own account
- Returns 404 if user not found

### Property Management

#### 4. Get All Listings

**Endpoint:** `GET /api/admin/listings`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (rent, sale)
- `type` (optional): Filter by type (residential, commercial, land)
- `isApproved` (optional): Filter by approval status (true, false)
- `search` (optional): Search by title or city

**Example Request:**
```bash
GET /api/admin/listings?isApproved=false&status=sale
```

**Example Response:**
```json
{
  "success": true,
  "count": 3,
  "total": 15,
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 2
  },
  "data": [
    {
      "_id": "...",
      "title": "Luxury Villa",
      "description": "...",
      "price": 5000000,
      "status": "sale",
      "type": "residential",
      "isApproved": false,
      "isFeatured": false,
      "owner": {
        "_id": "...",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+20123456789"
      },
      "location": {
        "city": "Cairo",
        "address": "..."
      }
    }
  ]
}
```

#### 5. Get Pending Listings

**Endpoint:** `GET /api/admin/listings/pending`

**Example Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "title": "Pending Property",
      "isApproved": false,
      "owner": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

#### 6. Approve Property

**Endpoint:** `PUT /api/admin/listings/:id/approve`

**Example Response:**
```json
{
  "success": true,
  "message": "Property approved successfully",
  "data": {
    "_id": "...",
    "title": "Luxury Villa",
    "isApproved": true
  }
}
```

**Notes:**
- Sets isApproved to true
- Property will now appear in public search results
- Returns 404 if property not found

#### 7. Reject/Delete Property

**Endpoint:** `DELETE /api/admin/listings/:id`

**Example Response:**
```json
{
  "success": true,
  "message": "Property rejected and deleted"
}
```

**Notes:**
- Permanently deletes the property
- Cannot be undone
- Returns 404 if property not found

#### 8. Toggle Featured Status

**Endpoint:** `PUT /api/admin/listings/:id/feature`

**Example Response:**
```json
{
  "success": true,
  "message": "Property featured",
  "data": {
    "_id": "...",
    "title": "Luxury Villa",
    "isFeatured": true
  }
}
```

**Notes:**
- Toggles isFeatured between true and false
- Featured properties can be highlighted in the frontend

### Statistics

#### 9. Get Platform Statistics

**Endpoint:** `GET /api/admin/stats`

**Example Response:**
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

**Statistics Included:**
- **Users:**
  - Total count
  - Count by role (buyer, owner, agent, admin)
  - Recent users (last 7 days)
  
- **Properties:**
  - Total count
  - Approved count
  - Pending count
  - Count by status (rent, sale)
  - Count by type (residential, commercial, land)
  - Recent properties (last 7 days)
  
- **Inquiries:**
  - Total count

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid role"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, token failed"
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
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error"
}
```

## Usage Examples

### Example 1: Approve Pending Properties

```javascript
// Get pending properties
const pendingResponse = await fetch('/api/admin/listings/pending', {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});
const { data: pendingProperties } = await pendingResponse.json();

// Approve each property
for (const property of pendingProperties) {
  await fetch(`/api/admin/listings/${property._id}/approve`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
}
```

### Example 2: Change User Role

```javascript
const response = await fetch(`/api/admin/users/${userId}/role`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify({ role: 'owner' })
});

const result = await response.json();
console.log(result.message); // "User role updated successfully"
```

### Example 3: Get Dashboard Statistics

```javascript
const response = await fetch('/api/admin/stats', {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});

const { data: stats } = await response.json();

console.log(`Total Users: ${stats.users.total}`);
console.log(`Pending Properties: ${stats.properties.pending}`);
console.log(`Total Inquiries: ${stats.inquiries}`);
```

## Security Notes

1. **Authorization Required:** All endpoints require admin role
2. **Self-Modification Prevention:** Admins cannot change their own role or delete their own account
3. **Cascading Deletes:** Deleting a user also deletes their properties and inquiries
4. **Input Validation:** All inputs are validated before processing
5. **Error Handling:** Proper error messages for all failure scenarios

## Best Practices

1. **Pagination:** Always use pagination for large datasets
2. **Filtering:** Use query parameters to filter results
3. **Confirmation:** Implement confirmation dialogs for destructive actions (delete)
4. **Logging:** Log all admin actions for audit trail
5. **Notifications:** Notify users when their properties are approved/rejected
6. **Backup:** Backup data before bulk operations

## Testing

Run the test suite:
```bash
npm test -- adminController.test.js
```

Test coverage includes:
- User management (list, role change, delete)
- Property management (list, approve, reject, feature)
- Statistics retrieval
- Authorization checks
- Error handling
- Edge cases (self-modification prevention)
