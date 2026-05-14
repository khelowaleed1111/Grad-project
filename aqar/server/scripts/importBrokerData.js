require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const dns = require('dns');
const Property = require('../models/Property');
const User = require('../models/User');

// Use Google DNS to avoid local DNS issues
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1', '1.0.0.1']);

// Broker data from Q4 2025 offers
const brokerData = {
  eastCairo: [
    { destination: "6th Settlement", developer: "Kulture", project: "Maliv", downPayment: "10% DP + 10% After 1 Year", years: 12, installmentType: "Equal", incentive: "1%" },
    { destination: "6th Settlement", developer: "Horizon Developments", project: "Saada Boutique", downPayment: "5% DP + 5% After 6 Months", years: 7, installmentType: "Equal", incentive: "None" },
    { destination: "6th Settlement", developer: "Hyde Park", project: "Central", downPayment: "5% DP + 5% After 3 Months", years: 10, installmentType: "Equal", incentive: "None" },
    { destination: "6th Settlement", developer: "Margins", project: "Lusial Residence", downPayment: "10% DP", years: 10, installmentType: "Equal", incentive: "None" },
    { destination: "6th Settlement", developer: "N Developments", project: "Nest New Cairo", downPayment: "5% DP", years: 12, installmentType: "Equal", incentive: "50K-100K" },
    { destination: "Golden Square", developer: "Sky Ad", project: "Bluetree", downPayment: "5% DP + 5% after 3 months", years: 10, installmentType: "Equal", incentive: "None" },
    { destination: "South 90th Road", developer: "Dar Al Alamia", project: "A casa Mia", downPayment: "5% DP+5% after 3 months", years: 10, installmentType: "Equal", incentive: "1%" },
    { destination: "South 90th Road", developer: "Mass Development", project: "Yardin", downPayment: "0% DP + 10% Discount", years: 6, installmentType: "Equal", incentive: "None" },
    { destination: "Middle Ring Road", developer: "Cred", project: "Ever East", downPayment: "0% DP (Apartments) / 10% DP (Villas)", years: 10, installmentType: "Equal", incentive: "50K-100K" },
    { destination: "Middle Ring Road", developer: "M Squared", project: "Mist", downPayment: "0% DP", years: 10, installmentType: "Equal", incentive: "50K-150K" },
    { destination: "Down Town", developer: "Centrada Development", project: "Wst El Balad", downPayment: "1% DP", years: 8.5, installmentType: "Equal", incentive: "None" },
    { destination: "Sheraton", developer: "Al Masria Group", project: "Isola Sheraton", downPayment: "0% DP", years: 10, installmentType: "Equal", incentive: "None" },
    { destination: "Al Shorouk", developer: "Imkan Misr", project: "Al Bouruj Misr", downPayment: "10% DP", years: 10, installmentType: "Equal", incentive: "None" },
    { destination: "Maadi", developer: "Egy Gab", project: "The Median", downPayment: "5% DP + 5% After 3 Months", years: 10, installmentType: "Equal", incentive: "None" },
    { destination: "Heliopolis", developer: "A Capital", project: "Marriot Residence", downPayment: "5% DP", years: 8, installmentType: "Back/Front Loaded", incentive: "1%" },
    { destination: "Suez Road", developer: "LMD", project: "More", downPayment: "5% DP", years: 9, installmentType: "Equal", incentive: "None" },
    { destination: "Suez Road", developer: "Madinet Masr", project: "Sarai", downPayment: "5% DP", years: 12, installmentType: "Equal", incentive: "None" },
    { destination: "Suez Road", developer: "Urbnlanes", project: "Yellow Residence", downPayment: "5% DP", years: 10, installmentType: "Equal", incentive: "None" },
    { destination: "Northern 90th Road", developer: "Jadeer Development", project: "Garnet", downPayment: "0% DP", years: 8, installmentType: "Equal", incentive: "None" },
    { destination: "Northern 90th Road", developer: "Urbnlanes", project: "Midlane", downPayment: "5% DP", years: 10, installmentType: "Equal", incentive: "None" },
    { destination: "Northern 90 street", developer: "Main Marks", project: "Moray", downPayment: "0% DP", years: 6, installmentType: "Equal", incentive: "1%" },
    { destination: "Mostakbal City", developer: "Al Attal Holding", project: "101", downPayment: "5% DP", years: 10, installmentType: "Equal", incentive: "1%" },
    { destination: "Mostakbal City", developer: "Hassan Allam", project: "Park Central", downPayment: "5% DP", years: 10, installmentType: "Equal", incentive: "None" },
    { destination: "Mostakbal City", developer: "ADH Developments", project: "Nyoum Mostakbal", downPayment: "5% DP", years: 10, installmentType: "Back Loaded", incentive: "None" },
    { destination: "Mostakbal City", developer: "HDP", project: "Talda", downPayment: "5% + 5% After 3 months", years: 12, installmentType: "Equal", incentive: "None" },
    { destination: "Mostakbal City", developer: "Ahly Sabbour", project: "At East", downPayment: "5%", years: 13, installmentType: "Equal", incentive: "100k" },
    { destination: "Mostakbal City", developer: "Tatweer Misr", project: "Scenes", downPayment: "5% DP", years: 8, installmentType: "Back Loaded", incentive: "Gold Coin" },
    { destination: "Mostakbal City", developer: "Tatweer Misr", project: "Bloomfield", downPayment: "0% DP", years: 11, installmentType: "Equal", incentive: "None" },
    { destination: "Mostakbal City", developer: "Madinet Masr", project: "Butter Fly", downPayment: "5% DP", years: 12, installmentType: "Equal", incentive: "None" },
    { destination: "Mostakbal City", developer: "Margins", project: "Sheraton Residence", downPayment: "5% DP + 5% Discount", years: 8, installmentType: "Equal", incentive: "1.50%" }
  ],
  
  newCapital: [
    { destination: "R7", developer: "TLD", project: "Armonia", downPayment: "9% DP (9% Discount)", years: 9, installmentType: "Equal", incentive: "2%" },
    { destination: "R7", developer: "Sorouh Developments", project: "Rosevil", downPayment: "10% DP + 5% after 3 Months", years: 10, installmentType: "Equal", incentive: "1.50%" },
    { destination: "R7", developer: "Living Yards", project: "The Loft Phase 1", downPayment: "10% DP + 10% after 6 Months", years: 10, installmentType: "Equal", incentive: "3%" },
    { destination: "R7", developer: "Living Yards", project: "The Loft Phase 2", downPayment: "10% DP + 10% after 1 Year", years: 10, installmentType: "Equal", incentive: "3%" },
    { destination: "R7", developer: "New Plan Developments", project: "Atika", downPayment: "10% DP", years: 9, installmentType: "Equal", incentive: "None" },
    { destination: "R3", developer: "UC", project: "East Tower CBD", downPayment: "10% DP + 10% after 1 Year", years: 10, installmentType: "Equal", incentive: "None" },
    { destination: "R8", developer: "Suli", project: "Suli Golf Residence", downPayment: "5% DP +5% after 3 Months", years: 8, installmentType: "Equal", incentive: "None" },
    { destination: "R8", developer: "Egy Gab", project: "The Islands", downPayment: "5% DP + 5% After 3 Months", years: 12, installmentType: "Equal", incentive: "None" },
    { destination: "R8", developer: "Capital Link", project: "Kardia", downPayment: "5% DP", years: 10, installmentType: "Equal", incentive: "2%" },
    { destination: "Heart of New Capital", developer: "New Plan", project: "Tallah", downPayment: "10% DP", years: 9, installmentType: "Equal", incentive: "None" },
    { destination: "Down Town", developer: "Jadeer Development", project: "Code", downPayment: "11% DP", years: 11, installmentType: "Equal", incentive: "2%" },
    { destination: "Down Town", developer: "Home Town", project: "La fayette", downPayment: "5% DP +40% Discount", years: 9, installmentType: "Equal", incentive: "None" }
  ],
  
  westCairo: [
    { destination: "6th October", developer: "IGI", project: "IGI Project", downPayment: "10% DP", years: 12, installmentType: "Equal", incentive: "None" },
    { destination: "6th October", developer: "Rock Developments", project: "Rock Eden", downPayment: "8%", years: 8, installmentType: "Equal", incentive: "None" },
    { destination: "6th October", developer: "Harva Developments", project: "Gul", downPayment: "10% DP (10% Discount)", years: 8, installmentType: "Equal", incentive: "None" },
    { destination: "6th October", developer: "Centrada Development", project: "Kite", downPayment: "1% DP", years: 8.5, installmentType: "Equal", incentive: "None" },
    { destination: "6th October", developer: "Jawad Developments", project: "Val Plaza Mall", downPayment: "10% DP", years: 5, installmentType: "Equal", incentive: "None" },
    { destination: "6th October", developer: "Modon Developments", project: "Villagio", downPayment: "5% DP (Residence) / 0% DP (Villas)", years: 10, installmentType: "Equal", incentive: "0.01" },
    { destination: "6th October", developer: "Melee", project: "NMQ", downPayment: "10% DP", years: 10, installmentType: "Equal", incentive: "50K-100K" },
    { destination: "6th October", developer: "M Squared", project: "31 West", downPayment: "0% DP", years: 10, installmentType: "Equal", incentive: "None" },
    { destination: "6th October", developer: "El Attal Holding", project: "West Leaves", downPayment: "5% DP", years: 10, installmentType: "Equal", incentive: "1%" },
    { destination: "6th October", developer: "Cred", project: "Ever West", downPayment: "5% DP", years: 10, installmentType: "Equal", incentive: "None" },
    { destination: "6th October", developer: "Mountain View", project: "I-City October", downPayment: "5% DP", years: 10, installmentType: "Equal", incentive: "None" },
    { destination: "Sheikh Zayed", developer: "Al Karnak", project: "BELVA", downPayment: "10% DP", years: 10, installmentType: "Equal", incentive: "None" },
    { destination: "Sheikh Zayed", developer: "ORA", project: "Zed West", downPayment: "0% DP", years: 10, installmentType: "Front Loaded", incentive: "None" },
    { destination: "Sheikh Zayed", developer: "Capital Hills", project: "La Colina", downPayment: "10% DP", years: 12, installmentType: "Equal", incentive: "None" },
    { destination: "Sheikh Zayed", developer: "SGD", project: "Valea", downPayment: "10% DP", years: 10, installmentType: "Equal", incentive: "1%" },
    { destination: "Sheikh Zayed", developer: "DAL", project: "The Harv", downPayment: "5% DP + 5% After 3 Months", years: 10, installmentType: "Equal", incentive: "1%" },
    { destination: "Sheikh Zayed", developer: "Mardev", project: "Menorca zayed", downPayment: "10% DP", years: 10, installmentType: "Equal", incentive: "1%" },
    { destination: "Sheikh Zayed", developer: "Line Developments", project: "Elysuim Compound", downPayment: "10% DP +5% After 6 Month", years: 10, installmentType: "Equal", incentive: "1.50%" },
    { destination: "New Zayed", developer: "Tatweer Misr", project: "Rivers", downPayment: "5% DP", years: 5, installmentType: "Equal", incentive: "Gold Coin" },
    { destination: "New Zayed", developer: "Ora", project: "Solana West", downPayment: "0% DP", years: 10, installmentType: "Front Loaded", incentive: "None" },
    { destination: "New Zayed", developer: "Dunes", project: "V-Levels", downPayment: "5% DP + 5% after 3 Months", years: 10, installmentType: "Front Loaded", incentive: "1%" },
    { destination: "New Zayed", developer: "AL Marasem", project: "Marville", downPayment: "5% + 5% After 3 Months", years: 10, installmentType: "Equal", incentive: "None" },
    { destination: "New Zayed", developer: "HDP", project: "West Views", downPayment: "5% DP+5% After 3 Months", years: 10, installmentType: "Equal", incentive: "None" },
    { destination: "New Zayed", developer: "Naia Developments", project: "Naia West", downPayment: "5% DP", years: 12, installmentType: "Equal", incentive: "1%" }
  ],
  
  northCoast: [
    { destination: "Ras el hekma", developer: "Horizon Developments", project: "Saada North", downPayment: "5% DP+ 5% After 6 Months", years: 8, installmentType: "Equal", incentive: "None" },
    { destination: "Sidi Abdelrahman", developer: "Egy Gab", project: "Masaya", downPayment: "10% DP +5% After 3 Months", years: 10, installmentType: "Equal", incentive: "None" },
    { destination: "Ras el Hekma", developer: "Gates Developments", project: "LYV", downPayment: "0% DP", years: 10, installmentType: "Equal", incentive: "None" },
    { destination: "Ras el Hekma", developer: "Inertia", project: "Jefaira", downPayment: "5% DP + 5% After 3 Months", years: 10, installmentType: "Equal", incentive: "1%" },
    { destination: "Ras El Hekma", developer: "Maven Developments", project: "Cali Coast", downPayment: "5% DP + 5% after 3 Months", years: 10, installmentType: "Equal", incentive: "1%" },
    { destination: "Ras el Hekma", developer: "Al Qamzi", project: "Seazen", downPayment: "5% DP", years: 9, installmentType: "Equal", incentive: "1%" },
    { destination: "Ras el Hekma", developer: "Al Marasem", project: "Mar Bay", downPayment: "5% DP +5% After 3 Months", years: 10, installmentType: "Equal", incentive: "None" },
    { destination: "Sidi Abdelrahman", developer: "Mountain View", project: "Plage", downPayment: "2% DP +2.25% After 3 months", years: 10, installmentType: "Equal", incentive: "None" },
    { destination: "Marina 5", developer: "HDP", project: "The Island", downPayment: "5% DP + 5% After 3 Months", years: 10, installmentType: "Equal", incentive: "None" },
    { destination: "El Dabaa", developer: "Al Ahly Sabbour", project: "Youd", downPayment: "5% DP + 5% after 3 Month", years: 10, installmentType: "Equal", incentive: "100k" },
    { destination: "Ras El Hekma", developer: "Tatweer Misr", project: "Fouka Bay", downPayment: "5% DP", years: 15, installmentType: "Back Loaded", incentive: "None" },
    { destination: "Sidi Abdelrahman", developer: "Q Developments", project: "Q North", downPayment: "5% DP + 5% After 3 Months", years: 10, installmentType: "Equal", incentive: "2%" },
    { destination: "Ras El Hekma", developer: "Marseilia", project: "Marseilia Beach 5", downPayment: "5% DP", years: 10, installmentType: "Equal", incentive: "1%" },
    { destination: "Ras el Hekma", developer: "Maadar", project: "Azha North", downPayment: "0% DP", years: 9, installmentType: "Front Loaded", incentive: "None" },
    { destination: "Sidi Henish", developer: "ORA Development", project: "Silver Sands", downPayment: "5% DP + 5% After 3 months", years: 10, installmentType: "Equal", incentive: "None" },
    { destination: "Sidi Henish", developer: "New Jersey", project: "Jamila", downPayment: "3% DP", years: 12, installmentType: "Equal", incentive: "5 Days In Bali" },
    { destination: "Sidi Henish", developer: "Amer Group", project: "Celebration", downPayment: "0% DP", years: 8, installmentType: "Equal", incentive: "1%" },
    { destination: "Sidi Henish", developer: "Al Ahly Sabbour", project: "Summer", downPayment: "5% DP + 5% after 3 Month", years: 10, installmentType: "Equal", incentive: "100k" },
    { destination: "Sidi Henish", developer: "Sky AD", project: "Sky North", downPayment: "5% DP + 5% after 3 Month", years: 10, installmentType: "Equal", incentive: "None" }
  ]
};

// Location coordinates mapping (approximate)
const locationCoordinates = {
  "6th Settlement": [31.4913, 30.0131],
  "Golden Square": [31.4850, 30.0200],
  "South 90th Road": [31.4700, 29.9800],
  "Middle Ring Road": [31.4600, 30.0100],
  "Down Town": [31.2357, 30.0444],
  "Sheraton": [31.3300, 30.1000],
  "Al Shorouk": [31.6100, 30.1200],
  "Maadi": [31.2636, 29.9602],
  "Heliopolis": [31.3200, 30.0900],
  "Suez Road": [31.3500, 30.0200],
  "Northern 90th Road": [31.4800, 30.0300],
  "Northern 90 street": [31.4800, 30.0300],
  "Mostakbal City": [31.7200, 30.0900],
  "R7": [31.7300, 29.9600],
  "R3": [31.7100, 29.9800],
  "R8": [31.7400, 29.9700],
  "Heart of New Capital": [31.7200, 29.9700],
  "6th October": [30.9372, 29.9553],
  "Sheikh Zayed": [30.9753, 30.0199],
  "New Zayed": [30.9500, 30.0000],
  "Ras el hekma": [27.2579, 31.3547],
  "Ras el Hekma": [27.2579, 31.3547],
  "Ras El Hekma": [27.2579, 31.3547],
  "Sidi Abdelrahman": [27.2400, 31.3400],
  "Marina 5": [27.2300, 31.3200],
  "El Dabaa": [27.1800, 31.2500],
  "Sidi Henish": [27.2100, 31.3000]
};

// Generate estimated prices based on location and payment terms
function estimatePrice(destination, years, downPayment) {
  const basePrice = {
    "6th Settlement": 3500000,
    "Golden Square": 3200000,
    "South 90th Road": 3000000,
    "Middle Ring Road": 3800000,
    "Down Town": 4500000,
    "Sheraton": 3500000,
    "Al Shorouk": 2800000,
    "Maadi": 4000000,
    "Heliopolis": 4200000,
    "Suez Road": 2500000,
    "Northern 90th Road": 3300000,
    "Northern 90 street": 3300000,
    "Mostakbal City": 3000000,
    "R7": 4000000,
    "R3": 5000000,
    "R8": 4500000,
    "Heart of New Capital": 4200000,
    "6th October": 2800000,
    "Sheikh Zayed": 5000000,
    "New Zayed": 4500000,
    "Ras el hekma": 6000000,
    "Ras el Hekma": 6000000,
    "Ras El Hekma": 6000000,
    "Sidi Abdelrahman": 5500000,
    "Marina 5": 5800000,
    "El Dabaa": 5000000,
    "Sidi Henish": 5200000
  };
  
  const base = basePrice[destination] || 3000000;
  const yearMultiplier = 1 + (years * 0.05);
  return Math.round(base * yearMultiplier);
}

// Transform broker data to property format
function transformToProperty(item, region, ownerIds) {
  const coords = locationCoordinates[item.destination] || [31.2357, 30.0444];
  const price = estimatePrice(item.destination, item.years, item.downPayment);
  const randomOwner = ownerIds[Math.floor(Math.random() * ownerIds.length)];
  
  // Determine governorate based on region
  const governorateMap = {
    eastCairo: "Cairo",
    newCapital: "New Capital",
    westCairo: "Giza",
    northCoast: "Matrouh"
  };
  
  return {
    title: `${item.project} by ${item.developer}`,
    description: `Premium residential project in ${item.destination}. ${item.project} offers flexible payment plans with ${item.downPayment} down payment over ${item.years} years. ${item.installmentType} installments. ${item.incentive !== 'None' ? 'Special incentive: ' + item.incentive : 'Limited time offer for Q4 2025.'}`,
    price: price,
    status: "sale",
    type: "residential",
    category: "Apartment",
    rooms: Math.floor(Math.random() * 3) + 2, // 2-4 bedrooms
    bathrooms: Math.floor(Math.random() * 2) + 2, // 2-3 bathrooms
    area: Math.floor(Math.random() * 150) + 100, // 100-250 sqm
    location: {
      address: `${item.project}, ${item.destination}`,
      city: item.destination,
      governorate: governorateMap[region],
      country: "Egypt",
      coordinates: {
        type: "Point",
        coordinates: coords
      }
    },
    features: [
      "Flexible Payment Plan",
      `${item.years} Years Installment`,
      item.installmentType + " Installments",
      item.downPayment,
      item.incentive !== 'None' ? item.incentive : "Q4 2025 Offer",
      "Prime Location",
      "Modern Design",
      "Security System"
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
    ],
    owner: randomOwner,
    isApproved: true,
    isFeatured: Math.random() > 0.7, // 30% chance of being featured
    views: Math.floor(Math.random() * 100)
  };
}

// Main import function
async function importBrokerData() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get owner/agent users to assign properties
    const owners = await User.find({ role: { $in: ['owner', 'agent'] } });
    if (owners.length === 0) {
      console.log('❌ No owners or agents found. Please seed users first.');
      process.exit(1);
    }
    
    const ownerIds = owners.map(owner => owner._id);
    console.log(`📊 Found ${owners.length} owners/agents`);
    
    let totalImported = 0;
    
    // Import each region
    for (const [region, projects] of Object.entries(brokerData)) {
      console.log(`\n📍 Importing ${region} (${projects.length} projects)...`);
      
      for (const project of projects) {
        const propertyData = transformToProperty(project, region, ownerIds);
        
        // Check if property already exists
        const existing = await Property.findOne({ 
          title: propertyData.title 
        });
        
        if (!existing) {
          await Property.create(propertyData);
          totalImported++;
          console.log(`  ✓ ${propertyData.title}`);
        } else {
          console.log(`  ⊘ ${propertyData.title} (already exists)`);
        }
      }
    }
    
    console.log(`\n✅ Import complete!`);
    console.log(`📊 Total properties imported: ${totalImported}`);
    
    // Show summary
    const total = await Property.countDocuments();
    const approved = await Property.countDocuments({ isApproved: true });
    const featured = await Property.countDocuments({ isFeatured: true });
    
    console.log(`\n📈 Database Summary:`);
    console.log(`   Total Properties: ${total}`);
    console.log(`   Approved: ${approved}`);
    console.log(`   Featured: ${featured}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

// Run import
importBrokerData();
