# 🏠 Aqar - Real Estate Platform

A modern, bilingual (Arabic/English) real estate platform built with the MERN stack, featuring property listings, advanced search, Google Maps integration, and role-based access control.

## ✨ Features

### Core Functionality
- 🔍 **Advanced Property Search** - Filter by type, location, price, area, and more
- 🗺️ **Google Maps Integration** - Interactive maps with property markers
- 🌐 **Bilingual Support** - Full RTL/LTR support for Arabic and English
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🖼️ **Image Gallery** - Property photos with Cloudinary integration
- ⭐ **Featured Properties** - Highlight premium listings

### User Roles & Permissions
- 👤 **Buyers** - Browse, search, and inquire about properties
- 🏢 **Property Owners** - List and manage properties
- 🤝 **Agents** - Manage client properties
- 👨‍💼 **Admins** - Full platform management and user control

### Technical Features
- 🔐 **JWT Authentication** - Secure user authentication
- 📊 **MongoDB Database** - Scalable data storage
- ☁️ **Cloudinary Integration** - Cloud-based image management
- 🎨 **Material Design** - Clean, modern UI with Material Symbols
- ⚡ **React Query** - Efficient data fetching and caching
- ✅ **Form Validation** - React Hook Form + Zod validation

## 🚀 Tech Stack

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **React Query** for data management
- **React Hook Form + Zod** for forms
- **Tailwind CSS** for styling
- **Google Maps API** for maps

### Backend
- **Node.js + Express** REST API
- **MongoDB + Mongoose** database
- **JWT** authentication
- **Cloudinary** image storage
- **Bcrypt** password hashing

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Google Maps API key
- Cloudinary account (for image uploads)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/aqar-platform.git
cd aqar-platform
```

### 2. Install dependencies

**Backend:**
```bash
cd aqar/server
npm install
```

**Frontend:**
```bash
cd aqar/client
npm install
```

### 3. Environment Configuration

**Backend** - Create `aqar/server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLIENT_ORIGIN=http://localhost:5173
```

**Frontend** - Create `aqar/client/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

See `.env.example` files in each directory for reference.

### 4. Seed Database (Optional)

Import sample properties:
```bash
cd aqar/server
node scripts/importBrokerData.js
```

## 🏃‍♂️ Running the Application

### Development Mode

**Backend** (Terminal 1):
```bash
cd aqar/server
npm run dev
```
Server runs on http://localhost:5000

**Frontend** (Terminal 2):
```bash
cd aqar/client
npm run dev
```
App runs on http://localhost:5173

### Production Build

**Frontend:**
```bash
cd aqar/client
npm run build
```

**Backend:**
```bash
cd aqar/server
npm start
```

## 👥 Test Credentials

```
Admin:
Email: admin@aqar.com
Password: Admin@123456

Property Owner:
Email: ahmed.hassan@example.com
Password: Password@123

Agent:
Email: fatima.ali@example.com
Password: Password@123

Buyer:
Email: mohamed.ibrahim@example.com
Password: Password@123
```

## 📁 Project Structure

```
aqar-platform/
├── aqar/
│   ├── client/                 # Frontend React app
│   │   ├── src/
│   │   │   ├── api/           # API integration
│   │   │   ├── components/    # React components
│   │   │   ├── context/       # Context providers
│   │   │   ├── pages/         # Page components
│   │   │   └── utils/         # Utility functions
│   │   └── package.json
│   │
│   └── server/                # Backend Node.js API
│       ├── config/            # Configuration files
│       ├── controllers/       # Route controllers
│       ├── middleware/        # Express middleware
│       ├── models/            # Mongoose models
│       ├── routes/            # API routes
│       ├── scripts/           # Utility scripts
│       └── package.json
│
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/featured` - Get featured properties
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (Owner/Agent)
- `PUT /api/properties/:id` - Update property (Owner/Agent)
- `DELETE /api/properties/:id` - Delete property (Owner/Agent)

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `GET /api/admin/properties/pending` - Get pending properties
- `PUT /api/admin/properties/:id/approve` - Approve property

## 🎨 Design System

- **Primary Color:** Green (#1b5e20)
- **Accent Color:** Gold (#fcab28)
- **Typography:** Playfair Display (headings), Inter (body)
- **Icons:** Material Symbols Outlined

## 🌍 Supported Regions

- East Cairo
- New Administrative Capital
- West Cairo (Giza)
- North Coast (Matrouh)

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please contact [your-email@example.com]

---

Built with ❤️ using the MERN Stack
