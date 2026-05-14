require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Script to create admin user: khelowaleed@gmail.com
 * Usage: node scripts/createMyAdmin.js
 */

const createMyAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MongoDB URI not found in .env file');
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Import User model
    const User = require('../models/User');

    // Your admin credentials
    const adminEmail = 'khelowaleed@gmail.com';
    const adminPassword = 'Enzoloda_22104';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('⚠️  User already exists with email:', adminEmail);
      
      // Update to admin role if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Updated existing user to admin role');
      } else {
        console.log('✅ User is already an admin');
      }
      
      console.log('');
      console.log('═══════════════════════════════════════');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password: Enzoloda_22104');
      console.log('═══════════════════════════════════════');
      console.log('');
      console.log('🌐 Login at your site');
      console.log('🎯 Admin Dashboard: /admin');
      console.log('');
      
      process.exit(0);
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = await User.create({
      name: 'Khelo Waleed',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      phone: '+201234567890',
      isVerified: true,
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password: Enzoloda_22104');
    console.log('👤 Name: Khelo Waleed');
    console.log('🎭 Role: admin');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('✨ You can now:');
    console.log('   1. Login at your site with the credentials above');
    console.log('   2. Access Admin Dashboard at /admin');
    console.log('   3. Approve pending listings at /admin/pending');
    console.log('   4. Manage users at /admin/users');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('  - Make sure MongoDB connection string is in .env file');
    console.error('  - Check your internet connection');
    console.error('  - Verify MongoDB Atlas allows connections from your IP');
    console.error('');
    process.exit(1);
  }
};

createMyAdmin();
