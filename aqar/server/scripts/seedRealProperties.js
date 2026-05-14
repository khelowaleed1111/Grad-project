require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Property = require('../models/Property');

/**
 * Seed Real Egyptian Properties Script
 * Adds real Egyptian real estate properties to MongoDB.
 * Does NOT delete existing data - only adds new properties.
 */

// Helper: coords provided as [lat, lng], schema expects [lng, lat]
const coords = (lat, lng) => [lng, lat];

const seedRealProperties = async () => {
  try {
    console.log('🌱 Starting real properties seeding...\n');

    await connectDB();

    // Find admin user to use as owner
    const admin = await User.findOne({ email: 'admin@aqar.com' });
    if (!admin) {
      console.error('❌ Admin user (admin@aqar.com) not found. Run seedDatabase.js first.');
      process.exit(1);
    }
    console.log(`✅ Found admin user: ${admin.name} (${admin._id})\n`);

    const ownerId = admin._id;

    const propertiesData = [
      // ─── WEST CAIRO ───────────────────────────────────────────────────────────

      // 1. Genova - Sheikh Zayed
      {
        title: 'Genova - Sheikh Zayed (Eastern)',
        description: 'Genova by Eastern Development in Sheikh Zayed offers premium apartments with Core & Shell finishing. Units range from 162 to 250 sqm with 3 bedrooms. Located in the heart of Sheikh Zayed with easy access to major roads. Payment plan: 5% down payment over 8 years. Ready in 3-6 months.',
        price: 12000000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 3,
        bathrooms: 2,
        area: 162,
        features: ['Core & Shell', 'Compound', 'Security', 'Parking', 'Club House', 'Swimming Pool', '5% Down Payment', '8 Years Payment Plan'],
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        ],
        location: {
          address: 'Genova Compound, Sheikh Zayed, Giza',
          city: 'Sheikh Zayed',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(30.9753, 30.0199) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: true,
        views: 320,
      },

      // 2. VYE & KARMELL - New Zayed (Sodic)
      {
        title: 'VYE & KARMELL - New Zayed (Sodic)',
        description: 'VYE & KARMELL by Sodic in New Zayed offers a diverse mix of residential units including 2-3 bedroom apartments, villas, townhouses, and twin houses. Semi and fully finished options available with ready-to-move units. Premium compound with world-class amenities.',
        price: 14100000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 2,
        bathrooms: 2,
        area: 130,
        features: ['Semi Finished', 'Fully Finished', 'Ready to Move', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Landscaped Gardens'],
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        ],
        location: {
          address: 'VYE & KARMELL, New Zayed, Giza',
          city: 'New Zayed',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(30.8697, 30.0456) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: true,
        views: 415,
      },

      // 3. The Estates - New Zayed (Sodic)
      {
        title: 'The Estates - New Zayed (Sodic)',
        description: 'The Estates by Sodic in New Zayed spans 150 acres offering premium standalone villas in SV, MV, LV, and FV types. Core & Shell finishing with ready-to-move units available. An exclusive gated community with resort-style amenities and lush green spaces.',
        price: 58400400,
        status: 'sale',
        type: 'residential',
        category: 'Villa',
        rooms: 4,
        bathrooms: 4,
        area: 400,
        features: ['Core & Shell', 'Ready to Move', 'Standalone Villa', '150 Acres', 'Gated Community', 'Club House', 'Swimming Pool', 'Landscaped Gardens', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        ],
        location: {
          address: 'The Estates, New Zayed, Giza',
          city: 'New Zayed',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(30.8697, 30.0456) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: true,
        views: 289,
      },

      // 4. Rivers - New Zayed (Tatweer Misr)
      {
        title: 'Rivers - New Zayed (Tatweer Misr)',
        description: 'Rivers by Tatweer Misr in New Zayed offers standalone villas on land plots of 250-350 sqm. Core & Shell finishing with 1-year delivery. A riverside-inspired community with water features, lush greenery, and premium amenities.',
        price: 30700000,
        status: 'sale',
        type: 'residential',
        category: 'Villa',
        rooms: 4,
        bathrooms: 3,
        area: 300,
        features: ['Core & Shell', '1 Year Delivery', 'Standalone Villa', 'Water Features', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Landscaped Gardens'],
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        ],
        location: {
          address: 'Rivers Compound, New Zayed, Giza',
          city: 'New Zayed',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(30.8500, 30.0600) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: true,
        views: 198,
      },

      // 5. LAKE WEST 1 - Green Belt (Cairo Capital)
      {
        title: 'LAKE WEST 1 - Green Belt (Cairo Capital)',
        description: 'Lake West 1 by Cairo Capital in the Green Belt area offers townhouse corner units on land plots of 276-403 sqm. Ready-to-move units with premium finishing. A lakeside community with stunning water views and resort-style amenities.',
        price: 17480959,
        status: 'sale',
        type: 'residential',
        category: 'TownHouse',
        rooms: 4,
        bathrooms: 3,
        area: 276,
        features: ['Ready to Move', 'TownHouse Corner', 'Lake View', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Landscaped Gardens'],
        images: [
          'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
        ],
        location: {
          address: 'Lake West 1, Green Belt, 6th October',
          city: '6th October',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(30.9200, 29.9800) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: true,
        views: 267,
      },

      // 6. LAKE WEST 2 - Green Belt (Cairo Capital)
      {
        title: 'LAKE WEST 2 - Green Belt (Cairo Capital)',
        description: 'Lake West 2 by Cairo Capital in the Green Belt offers townhouse middle units and standalone villas. Prices range from 12,500,000 to 23,000,000 EGP with 6-month delivery. Lakeside living with premium amenities and stunning natural surroundings.',
        price: 12500000,
        status: 'sale',
        type: 'residential',
        category: 'TownHouse',
        rooms: 4,
        bathrooms: 3,
        area: 260,
        features: ['6 Months Delivery', 'TownHouse', 'Standalone Villa', 'Lake View', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
          'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800',
        ],
        location: {
          address: 'Lake West 2, Green Belt, 6th October',
          city: '6th October',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(30.9200, 29.9800) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: true,
        views: 231,
      },

      // 7. Lac Ville - Green Belt (El Gabry)
      {
        title: 'Lac Ville - Green Belt (El Gabry)',
        description: 'Lac Ville by El Gabry in the Green Belt offers town corner units and standalone villas starting from 11,836,080 EGP. 9-month delivery with premium finishing. A charming lakeside community with French-inspired architecture.',
        price: 11836080,
        status: 'sale',
        type: 'residential',
        category: 'TownHouse',
        rooms: 4,
        bathrooms: 3,
        area: 250,
        features: ['9 Months Delivery', 'Town Corner', 'Standalone Villa', 'Lake View', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'French Architecture'],
        images: [
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
          'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
        ],
        location: {
          address: 'Lac Ville, Green Belt, 6th October',
          city: '6th October',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(30.9100, 29.9700) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: true,
        views: 178,
      },

      // 8. Montania - Green Belt (Everest View)
      {
        title: 'Montania - Green Belt (Everest View)',
        description: 'Montania by Everest View in the Green Belt offers standalone villas on land plots of 260-305 sqm. Ready-to-move units priced from 22,850,000 to 23,850,000 EGP. Mountain-inspired design with panoramic views and premium amenities.',
        price: 22850000,
        status: 'sale',
        type: 'residential',
        category: 'Villa',
        rooms: 4,
        bathrooms: 3,
        area: 280,
        features: ['Ready to Move', 'Standalone Villa', 'Mountain View', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Landscaped Gardens'],
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        ],
        location: {
          address: 'Montania, Green Belt, 6th October',
          city: '6th October',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(30.9050, 29.9650) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: true,
        views: 145,
      },

      // 9. Montania Park - Green Belt (Everest View)
      {
        title: 'Montania Park - Green Belt (Everest View)',
        description: 'Montania Park by Everest View in the Green Belt offers twin houses and standalone villas priced from 17,500,000 to 24,500,000 EGP. 6-month delivery. An extension of the successful Montania project with expanded amenities and green spaces.',
        price: 17500000,
        status: 'sale',
        type: 'residential',
        category: 'Twin House',
        rooms: 4,
        bathrooms: 3,
        area: 270,
        features: ['6 Months Delivery', 'Twin House', 'Standalone Villa', 'Mountain View', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
        ],
        location: {
          address: 'Montania Park, Green Belt, 6th October',
          city: '6th October',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(30.9050, 29.9650) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: true,
        views: 132,
      },

      // 10. ZG2 - Green Belt (ZG)
      {
        title: 'ZG2 - Green Belt (ZG Developments)',
        description: 'ZG2 by ZG Developments in the Green Belt offers standalone villas on 279 sqm land with 362 sqm BUA. Priced from 21,750,000 to 22,750,000 EGP with 6-month delivery. Modern design with premium finishes and comprehensive compound amenities.',
        price: 21750000,
        status: 'sale',
        type: 'residential',
        category: 'Villa',
        rooms: 4,
        bathrooms: 3,
        area: 362,
        features: ['6 Months Delivery', 'Standalone Villa', '279 sqm Land', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Landscaped Gardens'],
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        ],
        location: {
          address: 'ZG2 Compound, Green Belt, 6th October',
          city: '6th October',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(30.9000, 29.9600) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: true,
        views: 119,
      },

      // 11. Joya - Eastern Expansions (TCC)
      {
        title: 'Joya - Eastern Expansions (TCC)',
        description: 'Joya by TCC in the Eastern Expansions of 6th October spans 44 acres offering garden apartments, typical apartments, penthouses, townhouses, and twin houses. Ready-to-move units priced from 20,969,102 to 50,447,471 EGP. A vibrant community with diverse unit types.',
        price: 20969102,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 3,
        bathrooms: 2,
        area: 180,
        features: ['Ready to Move', '44 Acres', 'Garden Apartment', 'Penthouse', 'TownHouse', 'Twin House', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        ],
        location: {
          address: 'Joya Compound, Eastern Expansions, 6th October',
          city: '6th October',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(30.9800, 29.9400) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 203,
      },

      // 12. Garden Lakes - Eastern Expansions (Hyde Park)
      {
        title: 'Garden Lakes - Eastern Expansions (Hyde Park)',
        description: 'Garden Lakes by Hyde Park in the Eastern Expansions spans 69 acres offering 1-3 bedroom apartments, townhouses, and twin houses. Prices range from 6,800,000 to 33,850,000 EGP with 1-year delivery. A lakeside community with stunning water features.',
        price: 6800000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 1,
        bathrooms: 1,
        area: 90,
        features: ['1 Year Delivery', '69 Acres', 'Lake View', 'TownHouse', 'Twin House', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Landscaped Gardens'],
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        ],
        location: {
          address: 'Garden Lakes, Eastern Expansions, 6th October',
          city: '6th October',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.0100, 29.9300) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 187,
      },

      // 13. Cleopatra Square - Eastern Expansions (Cleopatra)
      {
        title: 'Cleopatra Square - Eastern Expansions (Cleopatra)',
        description: 'Cleopatra Square by Cleopatra Developments in the Eastern Expansions spans 48 acres offering Cleo units, twin houses, and standalone villas. Ready-to-move units priced from 35,398,533 to 55,966,282 EGP. Inspired by ancient Egyptian heritage with modern luxury.',
        price: 35398533,
        status: 'sale',
        type: 'residential',
        category: 'Twin House',
        rooms: 4,
        bathrooms: 3,
        area: 350,
        features: ['Ready to Move', '48 Acres', 'Twin House', 'Standalone Villa', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Egyptian Heritage Design'],
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        ],
        location: {
          address: 'Cleopatra Square, Eastern Expansions, 6th October',
          city: '6th October',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.0200, 29.9200) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 156,
      },

      // 14. Nyoum Pyramids - Eastern Expansions (Arab Developers)
      {
        title: 'Nyoum Pyramids - Eastern Expansions (Arab Developers)',
        description: 'Nyoum Pyramids by Arab Developers in the Eastern Expansions offers 2-bedroom apartments (170 sqm) and 3-bedroom apartments (204 sqm). Prices range from 7,156,000 to 9,000,000 EGP with 6-10 month delivery. Affordable luxury with views of the iconic Pyramids.',
        price: 7156000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 2,
        bathrooms: 2,
        area: 170,
        features: ['6-10 Months Delivery', 'Pyramid View', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Affordable Luxury'],
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        ],
        location: {
          address: 'Nyoum Pyramids, Eastern Expansions, Giza',
          city: 'Giza',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.1300, 29.9700) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 298,
      },

      // 15. I City - Northern Expansions (Mountain View)
      {
        title: 'I City - Northern Expansions (Mountain View)',
        description: 'I City by Mountain View in the Northern Expansions of Sheikh Zayed spans 500 acres. Offers I-Villa 3BR units of 209 sqm with 47 sqm private garden. Priced at 16,197,828 EGP with 1-year delivery. A smart city concept with cutting-edge technology and premium amenities.',
        price: 16197828,
        status: 'sale',
        type: 'residential',
        category: 'Villa',
        rooms: 3,
        bathrooms: 2,
        area: 209,
        features: ['1 Year Delivery', '500 Acres', 'Private Garden', 'Smart City', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Landscaped Gardens'],
        images: [
          'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
        ],
        location: {
          address: 'I City, Northern Expansions, Sheikh Zayed',
          city: 'Sheikh Zayed',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(30.9600, 30.0800) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 341,
      },

      // 16. MV 4 - Northern Expansions (Mountain View)
      {
        title: 'MV 4 - Northern Expansions (Mountain View)',
        description: 'Mountain View 4 in the Northern Expansions spans 47 acres offering townhouse middle units and 3-bedroom villas. Fully finished with 12-month delivery. Prices range from 25,433,173 to 28,570,696 EGP. Premium Mountain View quality with comprehensive amenities.',
        price: 25433173,
        status: 'sale',
        type: 'residential',
        category: 'TownHouse',
        rooms: 3,
        bathrooms: 3,
        area: 280,
        features: ['Fully Finished', '12 Months Delivery', '47 Acres', 'TownHouse', 'Villa', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
          'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800',
        ],
        location: {
          address: 'Mountain View 4, Northern Expansions, Sheikh Zayed',
          city: 'Sheikh Zayed',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(30.9500, 30.0900) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 212,
      },

      // 17. Hadaba - Northern Expansions (Pre)
      {
        title: 'Hadaba - Northern Expansions (Pre Developments)',
        description: 'Hadaba by Pre Developments in the Northern Expansions spans 33 acres offering townhouses and twin houses. Semi-finished with 6-month delivery. Prices range from 26,900,000 to 35,900,000 EGP. Elevated living with panoramic views and premium community amenities.',
        price: 26900000,
        status: 'sale',
        type: 'residential',
        category: 'TownHouse',
        rooms: 4,
        bathrooms: 3,
        area: 300,
        features: ['Semi Finished', '6 Months Delivery', '33 Acres', 'TownHouse', 'Twin House', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Panoramic Views'],
        images: [
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
          'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
        ],
        location: {
          address: 'Hadaba, Northern Expansions, Sheikh Zayed',
          city: 'Sheikh Zayed',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(30.9400, 30.1000) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 167,
      },

      // 18. Kayan - Northern Expansions (Badreldin)
      {
        title: 'Kayan - Northern Expansions (Badreldin)',
        description: 'Kayan by Badreldin Developments in the Northern Expansions offers fully finished garden apartments with 3 bedrooms (125-130 sqm) plus 50-55 sqm private garden. Ready-to-move units priced from 8,796,689 to 9,044,821 EGP. Affordable luxury in a premium compound.',
        price: 8796689,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 3,
        bathrooms: 2,
        area: 130,
        features: ['Fully Finished', 'Ready to Move', 'Garden Apartment', 'Private Garden', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        ],
        location: {
          address: 'Kayan, Northern Expansions, Sheikh Zayed',
          city: 'Sheikh Zayed',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(30.9300, 30.1100) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 189,
      },

      // 19. Villaria - Northern Expansions (Mirad)
      {
        title: 'Villaria - Northern Expansions (Mirad)',
        description: 'Villaria by Mirad Developments in the Northern Expansions offers penthouses (240 sqm) and duplexes (255 sqm). Core & Shell finishing with ready-to-move units. Prices range from 7,920,000 to 8,415,000 EGP. Elegant living with spacious layouts and premium finishes.',
        price: 7920000,
        status: 'sale',
        type: 'residential',
        category: 'Penthouse',
        rooms: 3,
        bathrooms: 2,
        area: 240,
        features: ['Core & Shell', 'Ready to Move', 'Penthouse', 'Duplex', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        ],
        location: {
          address: 'Villaria, Northern Expansions, Sheikh Zayed',
          city: 'Sheikh Zayed',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(30.9200, 30.1200) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 143,
      },

      // 20. M Apartments - Northern Expansions (Mirad)
      {
        title: 'M Apartments - Northern Expansions (Mirad)',
        description: 'M Apartments by Mirad Developments in the Northern Expansions offers typical apartments (177-192 sqm) and penthouses (224 sqm). Core & Shell finishing with ready-to-move units. Prices range from 6,018,000 to 7,616,000 EGP. Modern design with quality finishes.',
        price: 6018000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 3,
        bathrooms: 2,
        area: 177,
        features: ['Core & Shell', 'Ready to Move', 'Penthouse', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Modern Design'],
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        ],
        location: {
          address: 'M Apartments, Northern Expansions, Sheikh Zayed',
          city: 'Sheikh Zayed',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(30.9200, 30.1200) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 128,
      },

      // 21. Ashgar City - October Gardens (IGI)
      {
        title: 'Ashgar City - October Gardens (IGI)',
        description: 'Ashgar City by IGI in October Gardens spans 148 acres offering 2-bedroom apartments (85-100 sqm) and penthouses (125 sqm). Semi-finished with ready-to-move units. Prices range from 4,400,000 to 6,000,000 EGP. Affordable quality living in a large integrated community.',
        price: 4400000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 2,
        bathrooms: 1,
        area: 85,
        features: ['Semi Finished', 'Ready to Move', '148 Acres', 'Penthouse', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Affordable'],
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        ],
        location: {
          address: 'Ashgar City, October Gardens, 6th October',
          city: '6th October',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(30.9372, 29.9553) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 356,
      },

      // 22. Green Town - October Gardens (Tesla)
      {
        title: 'Green Town - October Gardens (Tesla)',
        description: 'Green Town by Tesla Developments in October Gardens offers typical and garden apartments ranging from 122 to 207 sqm. Core & Shell finishing with 9-month delivery. Prices range from 4,659,000 to 6,742,000 EGP. Eco-friendly community with abundant green spaces.',
        price: 4659000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 2,
        bathrooms: 2,
        area: 122,
        features: ['Core & Shell', '9 Months Delivery', 'Garden Apartment', 'Eco-Friendly', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Green Spaces'],
        images: [
          'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
        ],
        location: {
          address: 'Green Town, October Gardens, 6th October',
          city: '6th October',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(30.9300, 29.9500) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 201,
      },

      // 23. Rock Eden - October Gardens (Al Batal)
      {
        title: 'Rock Eden - October Gardens (Al Batal)',
        description: 'Rock Eden by Al Batal Developments in October Gardens offers 3-bedroom apartments of 195 sqm. Semi-finished with ready-to-move units priced at 10,808,000 EGP. Premium quality construction with modern design and comprehensive compound amenities.',
        price: 10808000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 3,
        bathrooms: 2,
        area: 195,
        features: ['Semi Finished', 'Ready to Move', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Modern Design', 'Premium Quality'],
        images: [
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
          'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800',
        ],
        location: {
          address: 'Rock Eden, October Gardens, 6th October',
          city: '6th October',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(30.9250, 29.9450) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 167,
      },

      // 24. Sun Capital - October Gardens (Arabia Holding)
      {
        title: 'Sun Capital - October Gardens (Arabia Holding)',
        description: 'Sun Capital by Arabia Holding in October Gardens offers a comprehensive mix of 2-3 bedroom apartments, duplexes, penthouses, townhouses, twin houses, and standalone villas. 6-month delivery with prices from 8,333,000 to 31,112,484 EGP. A complete integrated community.',
        price: 8333000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 2,
        bathrooms: 2,
        area: 140,
        features: ['6 Months Delivery', 'Duplex', 'Penthouse', 'TownHouse', 'Twin House', 'Standalone Villa', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
          'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
        ],
        location: {
          address: 'Sun Capital, October Gardens, 6th October',
          city: '6th October',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(30.9200, 29.9400) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 278,
      },

      // 25. Badya - October Gardens (Palm Hills)
      {
        title: 'Badya - October Gardens (Palm Hills)',
        description: 'Badya by Palm Hills in October Gardens offers fully finished ready-to-move apartments including 3BR (195 sqm), 4BR (252 sqm), and ground 2BR (170 sqm). Prices range from 17,000,000 to 19,900,000 EGP. Palm Hills quality with premium finishes and world-class amenities.',
        price: 17000000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 3,
        bathrooms: 2,
        area: 195,
        features: ['Fully Finished', 'Ready to Move', 'Ground Apartment', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Palm Hills Quality', 'Premium Finishes'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        ],
        location: {
          address: 'Badya, October Gardens, 6th October',
          city: '6th October',
          governorate: 'Giza',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(30.9150, 29.9350) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 312,
      },

      // ─── NEW CAIRO PROPERTIES ─────────────────────────────────────────────────

      // 26. Fifth Square - New Cairo (Al Marasem)
      {
        title: 'Fifth Square - New Cairo (Al Marasem)',
        description: 'Fifth Square by Al Marasem in New Cairo offers fully finished ready-to-move apartments including 1BR (95-115 sqm), 2BR (134 sqm), and 3BR ground (160 sqm). Prices range from 13,100,000 to 23,000,000 EGP. Premium New Cairo living with Al Marasem quality.',
        price: 13100000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 1,
        bathrooms: 1,
        area: 95,
        features: ['Fully Finished', 'Ready to Move', 'Ground Apartment', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'New Cairo Location'],
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        ],
        location: {
          address: 'Fifth Square, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.4913, 30.0131) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 389,
      },

      // 27. Creek Town - New Cairo (Il Cazar)
      {
        title: 'Creek Town - New Cairo (Il Cazar)',
        description: 'Creek Town by Il Cazar in New Cairo spans 100 acres offering 2-3 bedroom apartments, penthouses, duplexes, and townhouses. Core & Shell finishing with 9-month delivery. Prices range from 9,100,000 to 29,000,000 EGP. A waterfront-inspired community.',
        price: 9100000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 2,
        bathrooms: 2,
        area: 130,
        features: ['Core & Shell', '9 Months Delivery', '100 Acres', 'Penthouse', 'Duplex', 'TownHouse', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
          'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
        ],
        location: {
          address: 'Creek Town, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.5200, 30.0200) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 267,
      },

      // 28. Mountain View iCity New Cairo (Mountain View)
      {
        title: 'Mountain View iCity New Cairo (Mountain View)',
        description: 'Mountain View iCity New Cairo spans 500 acres offering garden apartments, standalone villas (4BR), palaces (5BR), and sky lofts (3BR). Core & Shell finishing with ready-to-move units. Prices range from 14,901,824 to 95,248,802 EGP. The ultimate smart city experience.',
        price: 14901824,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 3,
        bathrooms: 2,
        area: 180,
        features: ['Core & Shell', 'Ready to Move', '500 Acres', 'Garden Apartment', 'Standalone Villa', 'Palace', 'Sky Loft', 'Smart City', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
        ],
        location: {
          address: 'Mountain View iCity, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.4800, 30.0050) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 445,
      },

      // 29. Mountain View Hyde Park (Mountain View)
      {
        title: 'Mountain View Hyde Park - New Cairo (Mountain View)',
        description: 'Mountain View Hyde Park in New Cairo spans 200 acres offering premium standalone villas with 929 sqm land and 731 sqm BUA. Core & Shell finishing with ready-to-move units priced at 121,930,987 EGP. Ultra-luxury living in one of New Cairo\'s most prestigious addresses.',
        price: 121930987,
        status: 'sale',
        type: 'residential',
        category: 'Villa',
        rooms: 5,
        bathrooms: 5,
        area: 731,
        features: ['Core & Shell', 'Ready to Move', '200 Acres', 'Standalone Villa', '929 sqm Land', 'Ultra Luxury', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Prestigious Address'],
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        ],
        location: {
          address: 'Mountain View Hyde Park, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.4700, 29.9950) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 198,
      },

      // 30. Mountain View 1.1 (Mountain View)
      {
        title: 'Mountain View 1.1 - New Cairo (Mountain View)',
        description: 'Mountain View 1.1 in New Cairo offers Crown Villa Middle units with 723 sqm land and 670 sqm BUA. Core & Shell finishing with ready-to-deliver units priced at 134,126,970 EGP. The pinnacle of luxury villa living in New Cairo with Mountain View\'s signature quality.',
        price: 134126970,
        status: 'sale',
        type: 'residential',
        category: 'Villa',
        rooms: 5,
        bathrooms: 5,
        area: 670,
        features: ['Core & Shell', 'Ready to Deliver', 'Crown Villa', '723 sqm Land', 'Ultra Luxury', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Premium Location'],
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        ],
        location: {
          address: 'Mountain View 1.1, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.4600, 29.9900) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 167,
      },

      // 31. 90 Avenue - New Cairo (Tabarak)
      {
        title: '90 Avenue - New Cairo (Tabarak)',
        description: '90 Avenue by Tabarak Developments in New Cairo spans 50 acres offering 2BR (139-168 sqm) and 3BR (173-190 sqm) apartments. Fully finished with ACs, 1-year delivery. Prices range from 15,645,000 to 23,220,000 EGP. Premium location on 90th Street with top-quality finishes.',
        price: 15645000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 2,
        bathrooms: 2,
        area: 139,
        features: ['Fully Finished', 'ACs Included', '1 Year Delivery', '50 Acres', '90th Street Location', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
          'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
        ],
        location: {
          address: '90 Avenue, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.4500, 30.0100) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 312,
      },

      // 32. Stone Residence - New Cairo (Pre)
      {
        title: 'Stone Residence - New Cairo (Pre Developments)',
        description: 'Stone Residence by Pre Developments in New Cairo spans 143 acres offering 2BR (140 sqm), 3BR (175 sqm), and penthouse (220 sqm) apartments. Core & Shell finishing with ready-to-move units. Prices range from 9,702,000 to 15,708,000 EGP. Quality living in a large integrated community.',
        price: 9702000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 2,
        bathrooms: 2,
        area: 140,
        features: ['Core & Shell', 'Ready to Move', '143 Acres', 'Penthouse', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Large Community'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        ],
        location: {
          address: 'Stone Residence, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.4400, 30.0050) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 234,
      },

      // 33. Hyde Park New Cairo (Hyde Park)
      {
        title: 'Hyde Park New Cairo (Hyde Park Developments)',
        description: 'Hyde Park New Cairo spans 1200 acres offering 1-3 bedroom apartments, ground apartments, and standalone villas. Core & Shell finishing with 1-year delivery. Prices range from 9,170,000 to 385,000,000 EGP. One of New Cairo\'s largest and most prestigious integrated communities.',
        price: 9170000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 1,
        bathrooms: 1,
        area: 90,
        features: ['Core & Shell', '1 Year Delivery', '1200 Acres', 'Ground Apartment', 'Standalone Villa', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Largest Community'],
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        ],
        location: {
          address: 'Hyde Park, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.4300, 29.9900) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 523,
      },

      // 34. El Patio Oro - New Cairo (La Vista)
      {
        title: 'El Patio Oro - New Cairo (La Vista)',
        description: 'El Patio Oro by La Vista in New Cairo spans 176 acres offering typical, ground, and penthouse apartments ranging from 164 to 230 sqm. Semi-finished with ready-to-move units. Prices range from 15,580,000 to 27,600,000 EGP. La Vista\'s signature quality in a prime New Cairo location.',
        price: 15580000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 3,
        bathrooms: 2,
        area: 164,
        features: ['Semi Finished', 'Ready to Move', '176 Acres', 'Ground Apartment', 'Penthouse', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'La Vista Quality'],
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        ],
        location: {
          address: 'El Patio Oro, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.4200, 29.9800) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 278,
      },

      // 35. District 5 - New Cairo (Marakez)
      {
        title: 'District 5 - New Cairo (Marakez)',
        description: 'District 5 by Marakez in New Cairo spans 270 acres offering 1-3 bedroom apartments, ground apartments, duplexes, and lofts. Semi-finished with 6-12 month delivery. Prices range from 10,434,000 to 26,120,000 EGP. A vibrant mixed-use community with retail and entertainment.',
        price: 10434000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 1,
        bathrooms: 1,
        area: 80,
        features: ['Semi Finished', '6-12 Months Delivery', '270 Acres', 'Ground Apartment', 'Duplex', 'Loft', 'Mixed Use', 'Retail', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
        ],
        location: {
          address: 'District 5, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.4100, 29.9700) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 345,
      },

      // 36. Midtown - New Cairo (Better Home)
      {
        title: 'Midtown - New Cairo (Better Home)',
        description: 'Midtown by Better Home in New Cairo offers spacious units of 265 sqm. Core & Shell finishing with ready-to-move units priced at 20,449,848 EGP. Premium location in the heart of New Cairo with easy access to major landmarks and amenities.',
        price: 20449848,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 3,
        bathrooms: 2,
        area: 265,
        features: ['Core & Shell', 'Ready to Move', 'Spacious Units', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Central Location'],
        images: [
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
          'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800',
        ],
        location: {
          address: 'Midtown, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.4000, 29.9600) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 189,
      },

      // 37. Trio Gardens - New Cairo (M Squared)
      {
        title: 'Trio Gardens - New Cairo (M Squared)',
        description: 'Trio Gardens by M Squared in New Cairo spans 35.5 acres offering 2-3 bedroom apartments, ground apartments, and penthouses. Fully finished with ready-to-move units. Prices range from 14,200,000 to 16,500,000 EGP. Boutique community with lush gardens and premium finishes.',
        price: 14200000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 2,
        bathrooms: 2,
        area: 130,
        features: ['Fully Finished', 'Ready to Move', '35.5 Acres', 'Ground Apartment', 'Penthouse', 'Lush Gardens', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
          'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
        ],
        location: {
          address: 'Trio Gardens, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.3900, 29.9500) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 223,
      },

      // 38. Jayd - New Cairo (SED)
      {
        title: 'Jayd - New Cairo (SED)',
        description: 'Jayd by SED in New Cairo spans 68 acres offering apartments of 150-155 sqm. Semi-finished with 1-year delivery. Prices range from 12,067,000 to 12,788,000 EGP. Contemporary design with quality finishes in a well-planned New Cairo community.',
        price: 12067000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 3,
        bathrooms: 2,
        area: 150,
        features: ['Semi Finished', '1 Year Delivery', '68 Acres', 'Contemporary Design', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        ],
        location: {
          address: 'Jayd, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.3800, 29.9400) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 156,
      },

      // 39. Katameya Creeks - New Cairo (Starlight)
      {
        title: 'Katameya Creeks - New Cairo (Starlight)',
        description: 'Katameya Creeks by Starlight in New Cairo spans 42.1 acres offering 2-3 bedroom apartments and villas. Flexible finishing options with ready-to-move units. Prices range from 29,340,000 to 130,000,000 EGP. Exclusive waterfront community in prestigious Katameya.',
        price: 29340000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 2,
        bathrooms: 2,
        area: 150,
        features: ['Flexi Finishing', 'Ready to Move', '42.1 Acres', 'Villa', 'Waterfront', 'Katameya Location', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Exclusive'],
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        ],
        location: {
          address: 'Katameya Creeks, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.3700, 29.9300) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 267,
      },

      // 40. Vilette - New Cairo (Sodic)
      {
        title: 'Vilette - New Cairo (Sodic)',
        description: 'Vilette by Sodic in New Cairo spans 280 acres offering Sky Condos (1-3BR), V Residence, and V-editions. Core & Shell and fully finished options with ready-to-move units. Prices range from 22,052,000 to 63,072,000 EGP. Sodic\'s flagship New Cairo development.',
        price: 22052000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 1,
        bathrooms: 1,
        area: 90,
        features: ['Core & Shell', 'Fully Finished', 'Ready to Move', '280 Acres', 'Sky Condo', 'V Residence', 'Sodic Quality', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        ],
        location: {
          address: 'Vilette, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.3600, 29.9200) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 334,
      },

      // 41. Sa'ada - New Cairo (Horizon)
      {
        title: "Sa'ada - New Cairo (Horizon)",
        description: "Sa'ada by Horizon in New Cairo spans 370 acres offering twin houses (330-520 sqm) and standalone villas (417-776 sqm). Core & Shell finishing with 9-month delivery. Prices range from 38,000,000 to 85,000,000 EGP. Expansive luxury community with diverse villa options.",
        price: 38000000,
        status: 'sale',
        type: 'residential',
        category: 'Twin House',
        rooms: 4,
        bathrooms: 4,
        area: 330,
        features: ['Core & Shell', '9 Months Delivery', '370 Acres', 'Twin House', 'Standalone Villa', 'Luxury', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Expansive Community'],
        images: [
          'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
        ],
        location: {
          address: "Sa'ada, New Cairo, Cairo",
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.3500, 29.9100) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 198,
      },

      // 42. W Signature - New Cairo (Waterway)
      {
        title: 'W Signature - New Cairo (Waterway)',
        description: 'W Signature by Waterway in New Cairo spans 28 acres offering 1-3 bedroom apartments, ground apartments, and penthouses. Core & Shell finishing with ready-to-move units. Prices range from 13,041,000 to 27,368,000 EGP. Waterway\'s signature quality in a boutique New Cairo setting.',
        price: 13041000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 1,
        bathrooms: 1,
        area: 80,
        features: ['Core & Shell', 'Ready to Move', '28 Acres', 'Ground Apartment', 'Penthouse', 'Waterway Quality', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
          'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800',
        ],
        location: {
          address: 'W Signature, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.3400, 29.9000) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 212,
      },

      // 43. Waterway 1 - New Cairo (Waterway)
      {
        title: 'Waterway 1 - New Cairo (Waterway)',
        description: 'Waterway 1 by Waterway in New Cairo spans 21 acres offering 2-3 bedroom apartments and ground apartments. Fully furnished with ready-to-move units. Prices range from 22,550,000 to 35,950,000 EGP. Premium fully furnished apartments in a prestigious New Cairo waterfront community.',
        price: 22550000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 2,
        bathrooms: 2,
        area: 130,
        features: ['Fully Furnished', 'Ready to Move', '21 Acres', 'Ground Apartment', 'Waterfront', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Premium Furnished'],
        images: [
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
          'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
        ],
        location: {
          address: 'Waterway 1, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.3300, 28.8900) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 178,
      },

      // 44. WBR1 - New Cairo (Waterway)
      {
        title: 'WBR1 - New Cairo (Waterway)',
        description: 'WBR1 by Waterway in New Cairo spans 2.5 acres offering premium service apartments with 3 bedrooms (225 sqm). Fully finished with appliances, ready-to-move units priced at 68,063,000 EGP. Ultra-luxury serviced apartments with hotel-grade amenities and concierge services.',
        price: 68063000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 3,
        bathrooms: 3,
        area: 225,
        features: ['Fully Finished', 'Appliances Included', 'Ready to Move', '2.5 Acres', 'Service Apartment', 'Hotel Grade', 'Concierge', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        ],
        location: {
          address: 'WBR1, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.3200, 28.8800) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 145,
      },

      // 45. Azad - New Cairo (Tameer)
      {
        title: 'Azad - New Cairo (Tameer)',
        description: 'Azad by Tameer in New Cairo spans 55 acres offering 2-4 bedroom apartments, duplexes, and Azad Walk units. Semi-finished with ready-to-move units. Prices range from 12,371,138 to 42,011,306 EGP. A dynamic community with diverse unit types and vibrant lifestyle amenities.',
        price: 12371138,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 2,
        bathrooms: 2,
        area: 120,
        features: ['Semi Finished', 'Ready to Move', '55 Acres', 'Duplex', 'Azad Walk', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Vibrant Lifestyle'],
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        ],
        location: {
          address: 'Azad, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.3100, 28.8700) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 234,
      },

      // 46. Mayan - New Cairo (STM)
      {
        title: 'Mayan - New Cairo (STM)',
        description: 'Mayan by STM in New Cairo spans 48 acres offering 2BR (99-116 sqm) and 3BR (127-172 sqm) apartments. Fully finished with 1-year delivery. Prices range from 8,525,000 to 15,000,000 EGP. Affordable fully finished apartments in a well-planned New Cairo community.',
        price: 8525000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 2,
        bathrooms: 2,
        area: 99,
        features: ['Fully Finished', '1 Year Delivery', '48 Acres', 'Affordable', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'New Cairo Location'],
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
          'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
        ],
        location: {
          address: 'Mayan, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.3000, 28.8600) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 267,
      },

      // 47. Ashrafeya - New Cairo (Arabia)
      {
        title: 'Ashrafeya - New Cairo (Arabia)',
        description: 'Ashrafeya by Arabia Developments in New Cairo spans 32 acres offering 2-3 bedroom apartments, duplexes, and penthouses. Semi-finished with ready-to-move units. Prices range from 5,400,000 to 11,400,000 EGP. Affordable quality living in a well-located New Cairo compound.',
        price: 5400000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 2,
        bathrooms: 1,
        area: 100,
        features: ['Semi Finished', 'Ready to Move', '32 Acres', 'Duplex', 'Penthouse', 'Affordable', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
        ],
        location: {
          address: 'Ashrafeya, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.2900, 28.8500) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 312,
      },

      // 48. Sephora Heights - New Cairo (Sephora)
      {
        title: 'Sephora Heights - New Cairo (Sephora)',
        description: 'Sephora Heights by Sephora Developments in New Cairo spans 20 acres offering 2-3 bedroom apartments, ground apartments, and duplexes. Semi-finished with ready-to-move units. Prices range from 10,010,000 to 17,160,000 EGP. Elegant living in a boutique New Cairo community.',
        price: 10010000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 2,
        bathrooms: 2,
        area: 120,
        features: ['Semi Finished', 'Ready to Move', '20 Acres', 'Ground Apartment', 'Duplex', 'Boutique Community', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800',
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
        ],
        location: {
          address: 'Sephora Heights, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.2800, 28.8400) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 189,
      },

      // 49. Katameya Gardens - New Cairo (North Africa)
      {
        title: 'Katameya Gardens - New Cairo (North Africa)',
        description: 'Katameya Gardens by North Africa Real Estate in New Cairo spans 96 acres offering twin house villas and standalone villas. Core & Shell finishing with ready-to-move units. Prices range from 57,900,000 to 78,200,000 EGP. Prestigious villa community in the heart of Katameya.',
        price: 57900000,
        status: 'sale',
        type: 'residential',
        category: 'Villa',
        rooms: 5,
        bathrooms: 4,
        area: 500,
        features: ['Core & Shell', 'Ready to Move', '96 Acres', 'Twin House Villa', 'Standalone Villa', 'Katameya Location', 'Compound', 'Club House', 'Swimming Pool', 'Security', 'Prestigious'],
        images: [
          'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
        ],
        location: {
          address: 'Katameya Gardens, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.2700, 28.8300) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 156,
      },

      // 50. Nest Cairo - New Cairo (North Africa)
      {
        title: 'Nest Cairo - New Cairo (North Africa)',
        description: 'Nest Cairo by North Africa Real Estate in New Cairo spans 14 acres offering 2-3 bedroom apartments and ground apartments. Core & Shell finishing with ready-to-move units. Prices range from 7,255,000 to 9,640,000 EGP. Cozy boutique community with quality finishes.',
        price: 7255000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 2,
        bathrooms: 2,
        area: 110,
        features: ['Core & Shell', 'Ready to Move', '14 Acres', 'Ground Apartment', 'Boutique Community', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        ],
        location: {
          address: 'Nest Cairo, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.2600, 28.8200) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 178,
      },

      // 51. Golden Heights 1 - New Cairo (Novus Stanza)
      {
        title: 'Golden Heights 1 - New Cairo (Novus Stanza)',
        description: 'Golden Heights 1 by Novus Stanza in New Cairo spans 34 acres offering standalone villas on land plots of 617-835 sqm. Core & Shell finishing with ready-to-move units. Prices range from 62,034,000 to 104,345,000 EGP. Exclusive villa community with premium land plots.',
        price: 62034000,
        status: 'sale',
        type: 'residential',
        category: 'Villa',
        rooms: 5,
        bathrooms: 4,
        area: 500,
        features: ['Core & Shell', 'Ready to Move', '34 Acres', 'Standalone Villa', '617-835 sqm Land', 'Exclusive', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        ],
        location: {
          address: 'Golden Heights 1, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.2500, 28.8100) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 134,
      },

      // 52. Golden Heights 2 - New Cairo (Novus Stanza)
      {
        title: 'Golden Heights 2 - New Cairo (Novus Stanza)',
        description: 'Golden Heights 2 by Novus Stanza in New Cairo spans 16 acres offering standalone villas on land plots of 557-730 sqm. Core & Shell finishing with ready-to-move units. Prices range from 65,082,000 to 68,999,000 EGP. Boutique exclusive villa community with premium finishes.',
        price: 65082000,
        status: 'sale',
        type: 'residential',
        category: 'Villa',
        rooms: 5,
        bathrooms: 4,
        area: 450,
        features: ['Core & Shell', 'Ready to Move', '16 Acres', 'Standalone Villa', '557-730 sqm Land', 'Boutique', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
        ],
        location: {
          address: 'Golden Heights 2, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.2400, 28.8000) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 112,
      },

      // 53. Riviera - New Cairo (Novus Stanza)
      {
        title: 'Riviera - New Cairo (Novus Stanza)',
        description: 'Riviera by Novus Stanza in New Cairo spans 24 acres offering standalone villas on land plots of 595-684 sqm. Core & Shell finishing with ready-to-move units. Prices range from 54,143,000 to 78,887,000 EGP. Mediterranean-inspired villa community with premium amenities.',
        price: 54143000,
        status: 'sale',
        type: 'residential',
        category: 'Villa',
        rooms: 5,
        bathrooms: 4,
        area: 420,
        features: ['Core & Shell', 'Ready to Move', '24 Acres', 'Standalone Villa', '595-684 sqm Land', 'Mediterranean Design', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
          'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800',
        ],
        location: {
          address: 'Riviera, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.2300, 27.7900) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 123,
      },

      // 54. Amorada - New Cairo (Afaaq)
      {
        title: 'Amorada - New Cairo (Afaaq)',
        description: 'Amorada by Afaaq Developments in New Cairo spans 7 acres offering 3-bedroom apartments ranging from 167 to 262 sqm. Fully finished with ready-to-move units. Prices range from 12,250,000 to 25,177,444 EGP. Boutique fully finished community with premium quality.',
        price: 12250000,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 3,
        bathrooms: 2,
        area: 167,
        features: ['Fully Finished', 'Ready to Move', '7 Acres', 'Boutique Community', 'Premium Quality', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
          'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
        ],
        location: {
          address: 'Amorada, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.2200, 27.7800) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 189,
      },

      // 55. Galleria Moon Valley - New Cairo (Arabia Holding)
      {
        title: 'Galleria Moon Valley - New Cairo (Arabia Holding)',
        description: 'Galleria Moon Valley by Arabia Holding in New Cairo spans 73 acres offering typical apartments, ground apartments, and penthouses ranging from 130 to 200 sqm. Core & Shell finishing with ready-to-move units. Prices range from 13,712,146 to 24,784,208 EGP.',
        price: 13712146,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 2,
        bathrooms: 2,
        area: 130,
        features: ['Core & Shell', 'Ready to Move', '73 Acres', 'Ground Apartment', 'Penthouse', 'Moon Valley Location', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        ],
        location: {
          address: 'Galleria Moon Valley, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.2100, 27.7700) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 234,
      },

      // 56. Rock Vera - New Cairo (Rock Developments)
      {
        title: 'Rock Vera - New Cairo (Rock Developments)',
        description: 'Rock Vera by Rock Developments in New Cairo spans 11 acres offering 3-bedroom apartments ranging from 153 to 238 sqm. Core & Shell finishing with ready-to-move units. Prices range from 10,781,944 to 16,051,583 EGP. Quality construction in a boutique New Cairo community.',
        price: 10781944,
        status: 'sale',
        type: 'residential',
        category: 'Apartment',
        rooms: 3,
        bathrooms: 2,
        area: 153,
        features: ['Core & Shell', 'Ready to Move', '11 Acres', 'Boutique Community', 'Quality Construction', 'Compound', 'Club House', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        ],
        location: {
          address: 'Rock Vera, New Cairo, Cairo',
          city: 'New Cairo',
          governorate: 'Cairo',
          country: 'Egypt',
          coordinates: { type: 'Point', coordinates: coords(31.2000, 27.7600) },
        },
        owner: ownerId,
        isApproved: true,
        isFeatured: false,
        views: 167,
      },
    ];

    // Insert all properties
    console.log(`\n🏠 Inserting ${propertiesData.length} properties...`);
    const inserted = await Property.insertMany(propertiesData);
    console.log(`✅ Successfully inserted ${inserted.length} properties\n`);

    // Summary
    const featured = inserted.filter(p => p.isFeatured);
    const westCairo = inserted.filter(p => p.location.governorate === 'Giza');
    const newCairo = inserted.filter(p => p.location.city === 'New Cairo');

    console.log('📊 Seeding Summary:');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`🏠 Total Properties Added : ${inserted.length}`);
    console.log(`⭐ Featured Properties    : ${featured.length}`);
    console.log(`📍 West Cairo (Giza)      : ${westCairo.length}`);
    console.log(`📍 New Cairo              : ${newCairo.length}`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n✅ Real properties seeding completed successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding real properties:', error);
    process.exit(1);
  }
};

// Run the seed function
seedRealProperties();
