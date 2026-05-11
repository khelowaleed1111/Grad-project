require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
const Property = require('../models/Property');
const User = require('../models/User');

// Use Google DNS to avoid local DNS issues
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1', '1.0.0.1']);

// Connect to MongoDB with retry logic
const connectDB = async (retries = 5, delay = 3000) => {
  let attempt = 0;

  const attemptConnection = async () => {
    try {
      attempt++;
      console.log(`🔄 Attempting MongoDB connection (Attempt ${attempt}/${retries})...`);

      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4, // Use IPv4
      });

      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      console.log(`📊 Database: ${conn.connection.name}`);
      return conn;
    } catch (error) {
      console.error(`❌ Connection attempt ${attempt} failed:`, error.message);

      if (attempt < retries) {
        console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return attemptConnection();
      } else {
        console.error(`💥 Failed to connect after ${retries} attempts`);
        throw error;
      }
    }
  };

  await attemptConnection();
};

// New Cairo Commercial Properties Data (South 90 & North 90)
const commercialProperties = [
  // South 90 - One 90
  {
    title: 'One 90 - Ground Retail',
    description: 'Prime ground retail space in One 90, South 90, New Cairo. Core & shell finishing with flexible payment plans. Ready to move.',
    price: 61000000,
    type: 'commercial',
    category: 'Retail',
    area: 135,
    location: {
      address: 'One 90, South 90',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.4735, 30.0131] }
    },
    features: ['Core & Shell', 'Ground Floor', 'Prime Location', '40% over 3 Years', 'Ready to Move'],
    status: 'sale'
  },
  {
    title: 'One 90 - Administrative Office',
    description: 'Modern administrative office in One 90, South 90, New Cairo. Flexible payment plan with 5% down payment over 7 years. Delivery May 2028.',
    price: 26496184,
    type: 'commercial',
    category: 'Office',
    area: 120,
    location: {
      address: 'One 90, South 90',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.4738, 30.0128] }
    },
    features: ['Administrative', '5% over 7 Years', 'Maintenance 7%', 'Delivery May 2028'],
    status: 'sale'
  },
  
  // IV Business Park
  {
    title: 'IV Business Park - Ground Retail',
    description: 'Compact retail space in IV Business Park, South 90, New Cairo. Core & shell finishing with flexible payment options. Delivery 2028.',
    price: 12000000,
    type: 'commercial',
    category: 'Retail',
    area: 43,
    location: {
      address: 'IV Business Park, South 90',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.4742, 30.0125] }
    },
    features: ['Core & Shell', 'Ground Floor', '5% over 5-7 years', 'Delivery 2028'],
    status: 'sale'
  },
  {
    title: 'IV Business Park - Administrative Office',
    description: 'Fully finished administrative office in IV Business Park, South 90, New Cairo. Ready for immediate occupancy.',
    price: 5950000,
    type: 'commercial',
    category: 'Office',
    area: 41,
    location: {
      address: 'IV Business Park, South 90',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.4745, 30.0122] }
    },
    features: ['Fully Finished', 'Administrative', 'Flexible Payment', 'Delivery 2028'],
    status: 'sale'
  },
  {
    title: 'IV Business Park - Medical Clinic',
    description: 'Fully finished medical clinic space in IV Business Park, South 90, New Cairo. Ideal for healthcare professionals.',
    price: 5950000,
    type: 'commercial',
    category: 'Clinic',
    area: 41,
    location: {
      address: 'IV Business Park, South 90',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.4748, 30.0119] }
    },
    features: ['Fully Finished', 'Medical Clinic', 'Flexible Payment', 'Delivery 2028'],
    status: 'sale'
  },

  // The Ark
  {
    title: 'The Ark - Ground Retail',
    description: 'Spacious ground retail space in The Ark, South 90, New Cairo. Core & shell finishing with 5% down payment over 7 years. Delivery April 2028.',
    price: 63600000,
    type: 'commercial',
    category: 'Retail',
    area: 158,
    location: {
      address: 'The Ark, South 90',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.4751, 30.0116] }
    },
    features: ['Core & Shell', 'Ground Floor', '5% over 7 Years', 'Maintenance 8%', 'Delivery April 2028'],
    status: 'sale'
  },
  {
    title: 'The Ark - Hotel Apartment Studio',
    description: 'Fully finished hotel apartment studio in The Ark, South 90, New Cairo. Includes ACs and kitchen cabinets. 10% down payment over 8 years.',
    price: 7700000,
    type: 'residential',
    category: 'Apartment',
    area: 48,
    rooms: 1,
    bathrooms: 1,
    location: {
      address: 'The Ark, South 90',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.4754, 30.0113] }
    },
    features: ['Fully Finished', 'Hotel Apartment', 'ACs Included', 'Kitchen Cabinets', '10% over 8 Years'],
    status: 'sale'
  },
  {
    title: 'The Ark - Hotel Apartment 1 Bedroom',
    description: 'Fully finished 1-bedroom hotel apartment in The Ark, South 90, New Cairo. Includes ACs and kitchen cabinets. 10% down payment over 8 years.',
    price: 14800000,
    type: 'residential',
    category: 'Apartment',
    area: 82,
    rooms: 1,
    bathrooms: 1,
    location: {
      address: 'The Ark, South 90',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.4757, 30.0110] }
    },
    features: ['Fully Finished', 'Hotel Apartment', 'ACs Included', 'Kitchen Cabinets', '10% over 8 Years'],
    status: 'sale'
  },

  // Sleek
  {
    title: 'Sleek - Ground Retail',
    description: 'Modern ground retail space in Sleek, South 90, New Cairo. Core & shell finishing with 5% + 5% over 6 years. 36% cash discount available. Delivery Q1 2029.',
    price: 20067500,
    type: 'commercial',
    category: 'Retail',
    area: 57,
    location: {
      address: 'Sleek, South 90',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.4760, 30.0107] }
    },
    features: ['Core & Shell', 'Ground Floor', '5% + 5% over 6 Years', '36% Cash Discount', 'Maintenance 9%', 'Delivery Q1 2029'],
    status: 'sale'
  },

  // North 90 - Main Marks
  {
    title: 'Main Marks - Ground Retail',
    description: 'Premium ground retail space in Main Marks, North 90, New Cairo. Core & shell finishing with flexible payment plans. Delivery April 2028.',
    price: 48320000,
    type: 'commercial',
    category: 'Retail',
    area: 151,
    location: {
      address: 'Main Marks, North 90',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.4763, 30.0104] }
    },
    features: ['Core & Shell', 'Ground Floor', '5% + 5% over 7-8 years', 'Delivery April 2028'],
    status: 'sale'
  },
  {
    title: 'Main Marks - Service Apartments',
    description: 'Fully finished service apartments in Main Marks, North 90, New Cairo. Ideal for short-term rentals and hospitality.',
    price: 7500000,
    type: 'residential',
    category: 'Apartment',
    area: 38,
    rooms: 1,
    bathrooms: 1,
    location: {
      address: 'Main Marks, North 90',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.4766, 30.0101] }
    },
    features: ['Fully Finished', 'Service Apartment', 'Flexible Payment', 'Delivery April 2028'],
    status: 'sale'
  }
];

// 6th Settlement Residential Properties
const residentialProperties = [
  // ORA - Zed East
  {
    title: 'Zed East - Duplex',
    description: 'Fully finished duplex in Zed East by ORA, 6th Settlement. 200 sqm built-up area with 150 sqm garden. 5% + 5% down payment over 10 years. Delivery in 4 years.',
    price: 24000000,
    type: 'residential',
    category: 'Duplex',
    area: 200,
    rooms: 3,
    bathrooms: 3,
    location: {
      address: 'Zed East, 6th Settlement',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.5012, 30.0245] }
    },
    features: ['Fully Finished', '150 sqm Garden', '5% + 5% DP over 10 years', '360 Acre Project', 'Delivery 4 years'],
    status: 'sale'
  },
  {
    title: 'Zed East - Villa',
    description: 'Luxury villa in Zed East by ORA, 6th Settlement. 250 sqm built-up area on 600 sqm land. Premium location in 360-acre project.',
    price: 45000000,
    type: 'residential',
    category: 'Villa',
    area: 250,
    rooms: 4,
    bathrooms: 4,
    location: {
      address: 'Zed East, 6th Settlement',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.5015, 30.0242] }
    },
    features: ['Fully Finished', '600 sqm Land', 'Luxury Villa', '5% + 5% DP over 10 years', 'Delivery 4 years'],
    status: 'sale'
  },
  {
    title: 'Zed East - Grand Villa',
    description: 'Grand villa in Zed East by ORA, 6th Settlement. 292 sqm built-up area on 700 sqm land. Ultimate luxury living.',
    price: 60000000,
    type: 'residential',
    category: 'Villa',
    area: 292,
    rooms: 5,
    bathrooms: 5,
    location: {
      address: 'Zed East, 6th Settlement',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.5018, 30.0239] }
    },
    features: ['Fully Finished', '700 sqm Land', 'Grand Villa', '5% + 5% DP over 10 years', 'Delivery 4 years'],
    status: 'sale'
  },
  {
    title: 'Zed East - Townhouse',
    description: 'Modern townhouse in Zed East by ORA, 6th Settlement. 215 sqm with 80 sqm roof on 300 sqm land.',
    price: 31000000,
    type: 'residential',
    category: 'Townhouse',
    area: 215,
    rooms: 3,
    bathrooms: 3,
    location: {
      address: 'Zed East, 6th Settlement',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.5021, 30.0236] }
    },
    features: ['Fully Finished', '80 sqm Roof', '300 sqm Land', '5% + 5% DP over 10 years', 'Delivery 4 years'],
    status: 'sale'
  },

  // Marakez - Crescent Walk
  {
    title: 'Crescent Walk - 1 Bedroom Apartment',
    description: 'Fully finished 1-bedroom apartment with ACs in Crescent Walk by Marakez, 6th Settlement. 8% + 4% after 3 months over 9 years. Delivery in 4 years.',
    price: 8100000,
    type: 'residential',
    category: 'Apartment',
    area: 85,
    rooms: 1,
    bathrooms: 1,
    location: {
      address: 'Crescent Walk, 6th Settlement',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.5024, 30.0233] }
    },
    features: ['Fully Finished', 'ACs Included', '8% + 4% over 9 years', '118 Acre Project', 'G + 4', 'Maintenance 9%'],
    status: 'sale'
  },
  {
    title: 'Crescent Walk - 2 Bedroom Apartment',
    description: 'Fully finished 2-bedroom apartment with ACs in Crescent Walk by Marakez, 6th Settlement. Flexible payment plan over 9 years.',
    price: 13300000,
    type: 'residential',
    category: 'Apartment',
    area: 120,
    rooms: 2,
    bathrooms: 2,
    location: {
      address: 'Crescent Walk, 6th Settlement',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.5027, 30.0230] }
    },
    features: ['Fully Finished', 'ACs Included', '8% + 4% over 9 years', 'G + 4', 'Maintenance 9%'],
    status: 'sale'
  },
  {
    title: 'Crescent Walk - 3 Bedroom Apartment',
    description: 'Spacious 3-bedroom apartment with ACs in Crescent Walk by Marakez, 6th Settlement. Premium finishing and amenities.',
    price: 17000000,
    type: 'residential',
    category: 'Apartment',
    area: 150,
    rooms: 3,
    bathrooms: 2,
    location: {
      address: 'Crescent Walk, 6th Settlement',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.5030, 30.0227] }
    },
    features: ['Fully Finished', 'ACs Included', '8% + 4% over 9 years', 'G + 4', 'Maintenance 9%'],
    status: 'sale'
  },
  {
    title: 'Crescent Walk - Garden Duplex',
    description: 'Luxury 4-bedroom garden duplex in Crescent Walk by Marakez, 6th Settlement. 246 sqm with private garden.',
    price: 32000000,
    type: 'residential',
    category: 'Duplex',
    area: 246,
    rooms: 4,
    bathrooms: 3,
    location: {
      address: 'Crescent Walk, 6th Settlement',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.5033, 30.0224] }
    },
    features: ['Fully Finished', 'ACs Included', 'Private Garden', '8% + 4% over 9 years', 'Maintenance 9%'],
    status: 'sale'
  },
  {
    title: 'Crescent Walk - Townhouse',
    description: 'Semi-finished townhouse in Crescent Walk by Marakez, 6th Settlement. 206 sqm built-up area, G + 6. Delivery in 3.5 years.',
    price: 28000000,
    type: 'residential',
    category: 'Townhouse',
    area: 206,
    rooms: 4,
    bathrooms: 3,
    location: {
      address: 'Crescent Walk, 6th Settlement',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.5036, 30.0221] }
    },
    features: ['Semi Finished', 'G + 6', '8% + 4% over 9 years', 'Delivery 3.5 years'],
    status: 'sale'
  },

  // CRED - Ever
  {
    title: 'Ever - 2 Bedroom Apartment',
    description: 'Fully finished 2-bedroom apartment in Ever by CRED, 6th Settlement. 130 sqm with 5% down payment over 12 years. Delivery in 4 years.',
    price: 10500000,
    type: 'residential',
    category: 'Apartment',
    area: 130,
    rooms: 2,
    bathrooms: 2,
    location: {
      address: 'Ever, 6th Settlement',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.5039, 30.0218] }
    },
    features: ['Fully Finished', '5% DP over 12 years', '129 Acre Project', 'G + 8', 'Delivery 4 years'],
    status: 'sale'
  },
  {
    title: 'Ever - 3 Bedroom Apartment',
    description: 'Spacious 3-bedroom apartment in Ever by CRED, 6th Settlement. 170 sqm with extended payment plan.',
    price: 13500000,
    type: 'residential',
    category: 'Apartment',
    area: 170,
    rooms: 3,
    bathrooms: 2,
    location: {
      address: 'Ever, 6th Settlement',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.5042, 30.0215] }
    },
    features: ['Fully Finished', '5% DP over 12 years', 'G + 8', 'Delivery 4 years'],
    status: 'sale'
  },

  // Hyde Park - Central Park
  {
    title: 'Central Park - 1 Bedroom Apartment',
    description: 'Core & shell 1-bedroom apartment in Central Park by Hyde Park, 6th Settlement. 70 sqm with 5% + 5% down payment over 10 years. Delivery in 3.5 years.',
    price: 6100000,
    type: 'residential',
    category: 'Apartment',
    area: 70,
    rooms: 1,
    bathrooms: 1,
    location: {
      address: 'Central Park, 6th Settlement',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.5045, 30.0212] }
    },
    features: ['Core & Shell', '5% + 5% DP over 10 years', 'G + 7', 'Delivery 3.5 years'],
    status: 'sale'
  },
  {
    title: 'Central Park - 2 Bedroom Apartment',
    description: 'Core & shell 2-bedroom apartment in Central Park by Hyde Park, 6th Settlement. 101-114 sqm with flexible payment.',
    price: 9100000,
    type: 'residential',
    category: 'Apartment',
    area: 107,
    rooms: 2,
    bathrooms: 2,
    location: {
      address: 'Central Park, 6th Settlement',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.5048, 30.0209] }
    },
    features: ['Core & Shell', '5% + 5% DP over 10 years', 'G + 7', 'Delivery 3.5 years'],
    status: 'sale'
  },
  {
    title: 'Central Park - 3 Bedroom Apartment',
    description: 'Spacious 3-bedroom apartment in Central Park by Hyde Park, 6th Settlement. 150 sqm with premium location.',
    price: 12600000,
    type: 'residential',
    category: 'Apartment',
    area: 150,
    rooms: 3,
    bathrooms: 2,
    location: {
      address: 'Central Park, 6th Settlement',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.5051, 30.0206] }
    },
    features: ['Core & Shell', '5% + 5% DP over 10 years', 'G + 7', 'Delivery 3.5 years'],
    status: 'sale'
  },
  {
    title: 'Central Park - Townhouse',
    description: 'Core & shell townhouse in Central Park by Hyde Park, 6th Settlement. 212 sqm built-up on 192 sqm land. G + 1 + roof.',
    price: 25500000,
    type: 'residential',
    category: 'Townhouse',
    area: 212,
    rooms: 3,
    bathrooms: 3,
    location: {
      address: 'Central Park, 6th Settlement',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.5054, 30.0203] }
    },
    features: ['Core & Shell', 'G + 1 + Roof', '5% + 5% DP over 10 years', 'Delivery 3.5 years'],
    status: 'sale'
  },
  {
    title: 'Central Park - Villa',
    description: 'Luxury villa in Central Park by Hyde Park, 6th Settlement. 245 sqm built-up area, 4-5 bedrooms. G + 1 + roof.',
    price: 46000000,
    type: 'residential',
    category: 'Villa',
    area: 245,
    rooms: 4,
    bathrooms: 4,
    location: {
      address: 'Central Park, 6th Settlement',
      city: 'New Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: { type: 'Point', coordinates: [31.5057, 30.0200] }
    },
    features: ['Core & Shell', 'G + 1 + Roof', 'Luxury Villa', '5% + 5% DP over 10 years', 'Delivery 3.5 years'],
    status: 'sale'
  }
];

// Combine all properties
const allProperties = [...commercialProperties, ...residentialProperties];

// Main import function
const importProperties = async () => {
  try {
    await connectDB();

    // Get existing users to assign as owners
    const users = await User.find({ role: { $in: ['owner', 'agent'] } });
    
    if (users.length === 0) {
      console.log('⚠️  No owners/agents found. Creating default owner...');
      const defaultOwner = await User.create({
        name: 'Riyad Real Estate',
        email: 'riyad@aqar.com',
        password: 'Password@123',
        phone: '+201234567890',
        role: 'owner'
      });
      users.push(defaultOwner);
    }

    console.log(`\n📊 Importing ${allProperties.length} properties...`);
    console.log(`   - Commercial: ${commercialProperties.length}`);
    console.log(`   - Residential: ${residentialProperties.length}`);
    console.log('');

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const propData of allProperties) {
      try {
        // Check if property already exists
        const existing = await Property.findOne({ 
          title: propData.title,
          'location.address': propData.location.address
        });

        if (existing) {
          console.log(`⏭️  Skipped: ${propData.title} (already exists)`);
          skipped++;
          continue;
        }

        // Assign random owner from available users
        const randomOwner = users[Math.floor(Math.random() * users.length)];
        
        // Add default images
        propData.images = [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
        ];
        
        // Set owner and approval status
        propData.owner = randomOwner._id;
        propData.isApproved = true;
        propData.isFeatured = Math.random() > 0.7; // 30% chance of being featured

        // Create property
        await Property.create(propData);
        console.log(`✅ Imported: ${propData.title}`);
        imported++;

      } catch (error) {
        console.error(`❌ Error importing ${propData.title}:`, error.message);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📈 Import Summary:');
    console.log(`   ✅ Successfully imported: ${imported}`);
    console.log(`   ⏭️  Skipped (duplicates): ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📊 Total in database: ${await Property.countDocuments()}`);
    console.log('='.repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('💥 Import failed:', error);
    process.exit(1);
  }
};

// Run import
importProperties();
