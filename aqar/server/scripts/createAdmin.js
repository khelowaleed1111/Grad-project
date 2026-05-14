require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

/**
 * Script to create an admin user
 * Usage: node scripts/createAdmin.js
 */

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MongoDB URI not found in environment variables');
    }
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Admin credentials
    const adminData = {
      name: 'Admin User',
      email: 'admin@aqar.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+201234567890',
      isVerified: true,
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with email:', adminData.email);
      console.log('📧 Email:', adminData.email);
      console.log('🔑 Password: Admin@123');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create(adminData);
    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('🌐 Login at: http://localhost:5173/login');
    console.log('🎯 Admin Dashboard: http://localhost:5173/admin');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
