# Aqar Real Estate Platform - Backend API

## Overview

This is the backend API for the Aqar Real Estate Platform, built with Node.js, Express, and MongoDB. The API provides comprehensive property management, user authentication, role-based authorization, and geospatial search capabilities.

## Project Structure

```
server/
├── config/              # Configuration files
│   ├── cloudinary.js    # Cloudinary setup for image uploads
│   └── db.js            # MongoDB connection
├── controllers/         # Request handlers
│   ├── adminController.js
│   ├── authController.js
│   ├── propertyController.js
│   └── userController.js
├── middleware/          # Custom middleware
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── uploadMiddleware.js
├── models/              # Mongoose schemas
│   ├── Inquiry.js
│   ├── Property.js
│   └── User.js
├── routes/              # API routes
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── propertyRoutes.js
│   └── userRoutes.js
├── utils/               # Helper functions
│   ├── apiFeatures.js
│   └── generateToken.js
├── .env                 # Environment variables (not in git)
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
└── server.js            # Application entry point
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for image uploads)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   - `PORT`: Server port (default: 5000)
   - `MONGO_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `JWT_EXPIRE`: Token expiration time (default: 7d)
   - `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Cloudinary API secret
   - `CLIENT_ORIGIN`: Frontend URL for CORS (default: http://localhost:5173)

## Running the Application

### Development Mode
```bash
npm run dev
```
This starts the server with nodemon for auto-restart on file changes.

### Production Mode
```bash
npm start
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/update-profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Properties (`/api/properties`)
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create new property (auth required)
- `PUT /api/properties/:id` - Update property (auth required)
- `DELETE /api/properties/:id` - Delete property (auth required)
- `GET /api/properties/my-listings` - Get user's listings (auth required)
- `POST /api/properties/:id/inquire` - Send inquiry (auth required)

### Admin (`/api/admin`)
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users/:id/role` - Update user role (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)
- `GET /api/admin/listings` - Get all listings (admin only)
- `PUT /api/admin/listings/:id/approve` - Approve property (admin only)
- `DELETE /api/admin/listings/:id` - Delete property (admin only)
- `GET /api/admin/stats` - Get platform statistics (admin only)

### Health Check
- `GET /api/health` - Check API status

## Features

### Security
- JWT-based authentication
- bcrypt password hashing (12 salt rounds)
- Helmet.js security headers
- CORS configuration
- Rate limiting on auth endpoints (10 requests per 15 minutes)
- Role-based authorization (buyer, owner, agent, admin)

### Property Management
- CRUD operations for properties
- Image upload to Cloudinary (max 5MB per file)
- Advanced filtering (status, type, price, area, rooms, city)
- Keyword search (title, description, location)
- Geospatial queries (map bounds filtering)
- Pagination (12 items per page)
- Property approval workflow
- View counter

### Database Optimization
- Compound indexes on frequently queried fields
- Geospatial 2dsphere index for location queries
- Text index for keyword search
- Mongoose pagination plugin

## Dependencies

### Core
- express: ^4.18.2
- mongoose: ^8.0.3
- dotenv: ^16.3.1

### Authentication & Security
- jsonwebtoken: ^9.0.2
- bcryptjs: ^2.4.3
- helmet: ^7.1.0
- cors: ^2.8.5
- express-rate-limit: ^7.1.5

### Validation & Middleware
- express-validator: ^7.0.1
- morgan: ^1.10.0
- multer: ^1.4.5-lts.1

### External Services
- cloudinary: ^1.41.0
- mongoose-paginate-v2: ^1.7.4

### Development
- nodemon: ^3.0.2

## Development Guidelines

### Code Style
- Use async/await for asynchronous operations
- Implement proper error handling with try-catch blocks
- Use middleware for authentication and authorization
- Follow RESTful API conventions
- Add JSDoc comments for functions

### Error Handling
- 400: Bad Request (validation errors)
- 401: Unauthorized (authentication required)
- 403: Forbidden (insufficient permissions)
- 404: Not Found (resource doesn't exist)
- 429: Too Many Requests (rate limit exceeded)
- 500: Internal Server Error (server errors)

### Testing
- Unit tests for controllers and utilities
- Integration tests for API endpoints
- Test authentication and authorization flows
- Test geospatial queries
- Test file upload functionality

## License

MIT

## Author

Khaled Waleed Ahmed
