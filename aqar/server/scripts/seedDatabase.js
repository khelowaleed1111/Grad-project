require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');

/**
 * Seed Database Script
 * Creates sample users, properties, and inquiries for testing
 */

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Property.deleteMany({});
    await Inquiry.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create Users
    console.log('👥 Creating users...');
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@aqar.com',
        password: 'Admin@123456',
        phone: '+201234567890',
        role: 'admin',
        isVerified: true,
      },
      {
        name: 'Ahmed Hassan',
        email: 'ahmed.hassan@example.com',
        password: 'Password@123',
        phone: '+201012345678',
        role: 'owner',
        isVerified: true,
      },
      {
        name: 'Fatima Ali',
        email: 'fatima.ali@example.com',
        password: 'Password@123',
        phone: '+201098765432',
        role: 'agent',
        isVerified: true,
      },
      {
        name: 'Mohamed Ibrahim',
        email: 'mohamed.ibrahim@example.com',
        password: 'Password@123',
        phone: '+201123456789',
        role: 'buyer',
        isVerified: true,
      },
      {
        name: 'Sara Mahmoud',
        email: 'sara.mahmoud@example.com',
        password: 'Password@123',
        phone: '+201234567891',
        role: 'owner',
        isVerified: true,
      },
    ]);

    console.log(`✅ Created ${users.length} users\n`);

    // Create Properties
    console.log('🏠 Creating properties...');
    const properties = await Property.create([
      {
        title: 'Luxury Villa in New Cairo',
        description: 'Stunning 5-bedroom villa with private pool and garden in the heart of New Cairo. Modern design with high-end finishes, spacious living areas, and panoramic views.',
        price: 8500000,
        status: 'sale',
        type: 'residential',
        category: 'Villa',
        rooms: 5,
        bathrooms: 4,
        area: 450,
        features: ['Private Pool', 'Garden', 'Garage', 'Security System', 'Central AC'],
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        ],
        location: {
          address: '123 Palm Hills, New Cairo',
          city: 'Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: {
            type: 'Point',
            coordinates: [31.4913, 30.0131], // [longitude, latitude]
          },
        },
        owner: users[1]._id,
        isApproved: true,
        isFeatured: true,
        views: 245,
      },
      {
        title: 'Modern Apartment in Zamalek',
        description: 'Beautiful 3-bedroom apartment with Nile view in prestigious Zamalek district. Fully furnished with contemporary design and premium amenities.',
        price: 35000,
        status: 'rent',
        type: 'residential',
        category: 'Apartment',
        rooms: 3,
        bathrooms: 2,
        area: 180,
        features: ['Nile View', 'Furnished', 'Balcony', 'Elevator', 'Parking'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        ],
        location: {
          address: '45 26th July Street, Zamalek',
          city: 'Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: {
            type: 'Point',
            coordinates: [31.2218, 30.0626],
          },
        },
        owner: users[2]._id,
        isApproved: true,
        isFeatured: true,
        views: 189,
      },
      {
        title: 'Commercial Office Space in Smart Village',
        description: 'Prime office space in Smart Village with modern infrastructure. Perfect for tech companies and startups. Includes meeting rooms and parking.',
        price: 45000,
        status: 'rent',
        type: 'commercial',
        category: 'Office',
        rooms: 8,
        bathrooms: 3,
        area: 300,
        features: ['Meeting Rooms', 'High-Speed Internet', 'Parking', '24/7 Security', 'Cafeteria'],
        images: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
          'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
        ],
        location: {
          address: 'Building 5, Smart Village',
          city: 'Giza',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: {
            type: 'Point',
            coordinates: [31.0118, 30.0727],
          },
        },
        owner: users[4]._id,
        isApproved: true,
        isFeatured: false,
        views: 156,
      },
      {
        title: 'Beachfront Chalet in North Coast',
        description: 'Luxurious chalet with direct beach access in Marina. Perfect for summer vacations with stunning sea views and resort amenities.',
        price: 4500000,
        status: 'sale',
        type: 'residential',
        category: 'Chalet',
        rooms: 3,
        bathrooms: 2,
        area: 150,
        features: ['Beach Access', 'Swimming Pool', 'Sea View', 'Resort Amenities', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800',
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        ],
        location: {
          address: 'Marina 7, North Coast',
          city: 'Matrouh',
          governorate: 'Matrouh',
          country: 'Egypt',
          coordinates: {
            type: 'Point',
            coordinates: [27.2579, 31.3547],
          },
        },
        owner: users[1]._id,
        isApproved: true,
        isFeatured: true,
        views: 312,
      },
      {
        title: 'Investment Land in 6th October',
        description: 'Prime land for investment in rapidly developing area of 6th October City. Excellent location with all utilities available.',
        price: 3200000,
        status: 'sale',
        type: 'land',
        category: 'Residential Land',
        area: 500,
        features: ['Corner Plot', 'Utilities Available', 'Main Road Access', 'Investment Opportunity'],
        images: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
        ],
        location: {
          address: 'Plot 234, 6th October City',
          city: '6th October',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: {
            type: 'Point',
            coordinates: [30.9372, 29.9553],
          },
        },
        owner: users[4]._id,
        isApproved: true,
        isFeatured: false,
        views: 98,
      },
      {
        title: 'Cozy Studio in Maadi',
        description: 'Affordable studio apartment in quiet Maadi neighborhood. Perfect for singles or young couples. Close to metro and amenities.',
        price: 8000,
        status: 'rent',
        type: 'residential',
        category: 'Studio',
        rooms: 1,
        bathrooms: 1,
        area: 60,
        features: ['Furnished', 'Near Metro', 'Quiet Area', 'Balcony'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        ],
        location: {
          address: '78 Road 9, Maadi',
          city: 'Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: {
            type: 'Point',
            coordinates: [31.2636, 29.9602],
          },
        },
        owner: users[2]._id,
        isApproved: true,
        isFeatured: false,
        views: 67,
      },
      {
        title: 'Retail Shop in City Center',
        description: 'High-traffic retail space in downtown Cairo. Perfect for boutique, cafe, or small business. Great visibility and foot traffic.',
        price: 25000,
        status: 'rent',
        type: 'commercial',
        category: 'Retail',
        area: 80,
        features: ['High Traffic', 'Corner Location', 'Display Windows', 'Storage Room'],
        images: [
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
        ],
        location: {
          address: '12 Talaat Harb Street, Downtown',
          city: 'Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: {
            type: 'Point',
            coordinates: [31.2357, 30.0444],
          },
        },
        owner: users[1]._id,
        isApproved: false, // Pending approval
        isFeatured: false,
        views: 23,
      },
      {
        title: 'Family Duplex in Sheikh Zayed',
        description: 'Spacious duplex in family-friendly compound. Modern design with private garden and access to compound facilities.',
        price: 6200000,
        status: 'sale',
        type: 'residential',
        category: 'Duplex',
        rooms: 4,
        bathrooms: 3,
        area: 320,
        features: ['Private Garden', 'Compound Facilities', 'Club House', 'Kids Area', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        ],
        location: {
          address: 'Compound Beverly Hills, Sheikh Zayed',
          city: 'Giza',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: {
            type: 'Point',
            coordinates: [30.9753, 30.0199],
          },
        },
        owner: users[4]._id,
        isApproved: true,
        isFeatured: false,
        views: 134,
      },
    ]);

    console.log(`✅ Created ${properties.length} properties\n`);

    // Create Inquiries
    console.log('💬 Creating inquiries...');
    const inquiries = await Inquiry.create([
      {
        property: properties[0]._id,
        sender: users[3]._id,
        owner: properties[0].owner,
        message: 'I am interested in viewing this villa. Is it still available? Can we schedule a visit this weekend?',
        phone: users[3].phone,
        email: users[3].email,
        isRead: false,
        status: 'pending',
      },
      {
        property: properties[1]._id,
        sender: users[3]._id,
        owner: properties[1].owner,
        message: 'What is included in the rent? Are utilities included? When is the earliest move-in date?',
        phone: users[3].phone,
        email: users[3].email,
        isRead: true,
        status: 'contacted',
      },
      {
        property: properties[3]._id,
        sender: users[3]._id,
        owner: properties[3].owner,
        message: 'Is the price negotiable? I would like to make an offer.',
        phone: users[3].phone,
        email: users[3].email,
        isRead: true,
        status: 'resolved',
      },
      {
        property: properties[2]._id,
        sender: users[1]._id,
        owner: properties[2].owner,
        message: 'Can you provide more details about the parking facilities and internet speed?',
        phone: users[1].phone,
        email: users[1].email,
        isRead: false,
        status: 'pending',
      },
    ]);

    console.log(`✅ Created ${inquiries.length} inquiries\n`);

    // Summary
    console.log('📊 Seeding Summary:');
    console.log('═══════════════════════════════════════');
    console.log(`👥 Users: ${users.length}`);
    console.log(`   - Admin: 1`);
    console.log(`   - Owners: 2`);
    console.log(`   - Agents: 1`);
    console.log(`   - Buyers: 1`);
    console.log(`🏠 Properties: ${properties.length}`);
    console.log(`   - For Sale: ${properties.filter(p => p.status === 'sale').length}`);
    console.log(`   - For Rent: ${properties.filter(p => p.status === 'rent').length}`);
    console.log(`   - Approved: ${properties.filter(p => p.isApproved).length}`);
    console.log(`   - Pending: ${properties.filter(p => !p.isApproved).length}`);
    console.log(`💬 Inquiries: ${inquiries.length}`);
    console.log('═══════════════════════════════════════\n');

    console.log('✅ Database seeding completed successfully!\n');
    console.log('📝 Test Credentials:');
    console.log('   Admin: admin@aqar.com / Admin@123456');
    console.log('   Owner: ahmed.hassan@example.com / Password@123');
    console.log('   Agent: fatima.ali@example.com / Password@123');
    console.log('   Buyer: mohamed.ibrahim@example.com / Password@123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();
