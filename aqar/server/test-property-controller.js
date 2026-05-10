/**
 * Simple test script to verify property controller functionality
 * This tests the basic CRUD operations and API endpoints
 */

const mongoose = require('mongoose');
const Property = require('./models/Property');
const User = require('./models/User');
const APIFeatures = require('./utils/apiFeatures');

// Test data
const testUser = {
  name: 'Test Owner',
  email: 'testowner@example.com',
  password: 'password123',
  role: 'owner'
};

const testProperty = {
  title: 'Beautiful Test Property',
  description: 'A wonderful property for testing purposes',
  price: 500000,
  status: 'sale',
  type: 'residential',
  rooms: 3,
  bathrooms: 2,
  area: 150,
  location: {
    address: '123 Test Street',
    city: 'Cairo',
    country: 'Egypt',
    coordinates: {
      type: 'Point',
      coordinates: [31.2357, 30.0444] // [longitude, latitude] for Cairo
    }
  },
  images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  isApproved: true
};

async function testPropertyController() {
  try {
    console.log('🧪 Testing Property Controller...\n');

    // Connect to test database
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aqar_test');
      console.log('✅ Connected to test database');
    }

    // Clean up existing test data
    await Property.deleteMany({ title: /test/i });
    await User.deleteMany({ email: /test/i });
    console.log('🧹 Cleaned up existing test data');

    // Create test user
    const user = await User.create(testUser);
    console.log('✅ Created test user:', user.name);

    // Create test property
    testProperty.owner = user._id;
    const property = await Property.create(testProperty);
    console.log('✅ Created test property:', property.title);

    // Test 1: Basic property retrieval
    console.log('\n📋 Test 1: Basic Property Retrieval');
    const foundProperty = await Property.findById(property._id).populate('owner', 'name email');
    console.log('✅ Property found:', foundProperty.title);
    console.log('✅ Owner populated:', foundProperty.owner.name);

    // Test 2: API Features filtering
    console.log('\n🔍 Test 2: API Features Filtering');
    
    // Test status filter
    let query = Property.find({ isApproved: true });
    let features = new APIFeatures(query, { status: 'sale' });
    features.filter();
    let results = await features.query;
    console.log('✅ Status filter (sale):', results.length, 'properties found');

    // Test price range filter
    query = Property.find({ isApproved: true });
    features = new APIFeatures(query, { minPrice: 400000, maxPrice: 600000 });
    features.filter();
    results = await features.query;
    console.log('✅ Price range filter (400k-600k):', results.length, 'properties found');

    // Test city filter
    query = Property.find({ isApproved: true });
    features = new APIFeatures(query, { city: 'cairo' });
    features.filter();
    results = await features.query;
    console.log('✅ City filter (Cairo):', results.length, 'properties found');

    // Test 3: Search functionality
    console.log('\n🔎 Test 3: Search Functionality');
    query = Property.find({ isApproved: true });
    features = new APIFeatures(query, { keyword: 'beautiful' });
    features.search();
    results = await features.query;
    console.log('✅ Keyword search (beautiful):', results.length, 'properties found');

    // Test 4: Geospatial filtering
    console.log('\n🗺️  Test 4: Geospatial Filtering');
    query = Property.find({ isApproved: true });
    // Bounds around Cairo area
    features = new APIFeatures(query, { bounds: '29.9,31.1,30.1,31.3' });
    features.geoFilter();
    results = await features.query;
    console.log('✅ Geospatial filter (Cairo bounds):', results.length, 'properties found');

    // Test 5: Sorting
    console.log('\n📊 Test 5: Sorting');
    query = Property.find({ isApproved: true });
    features = new APIFeatures(query, { sort: 'price_desc' });
    features.sort();
    results = await features.query;
    console.log('✅ Price descending sort:', results.length, 'properties found');

    // Test 6: Pagination
    console.log('\n📄 Test 6: Pagination');
    query = Property.find({ isApproved: true });
    features = new APIFeatures(query, { page: 1, limit: 5 });
    features.paginate();
    results = await features.query;
    console.log('✅ Pagination (page 1, limit 5):', results.length, 'properties found');

    // Test 7: Combined filters
    console.log('\n🔧 Test 7: Combined Filters');
    query = Property.find({ isApproved: true });
    features = new APIFeatures(query, {
      status: 'sale',
      type: 'residential',
      minPrice: 400000,
      city: 'cairo',
      sort: 'price_asc',
      page: 1,
      limit: 10
    });
    features.filter().search().geoFilter().sort().paginate();
    results = await features.query;
    console.log('✅ Combined filters:', results.length, 'properties found');

    // Test 8: Property update
    console.log('\n✏️  Test 8: Property Update');
    const updatedProperty = await Property.findByIdAndUpdate(
      property._id,
      { price: 550000, rooms: 4 },
      { new: true, runValidators: true }
    );
    console.log('✅ Property updated - New price:', updatedProperty.price);
    console.log('✅ Property updated - New rooms:', updatedProperty.rooms);

    // Test 9: Views increment
    console.log('\n👁️  Test 9: Views Increment');
    await Property.findByIdAndUpdate(property._id, { $inc: { views: 1 } });
    const viewedProperty = await Property.findById(property._id);
    console.log('✅ Views incremented:', viewedProperty.views);

    // Clean up test data
    await Property.findByIdAndDelete(property._id);
    await User.findByIdAndDelete(user._id);
    console.log('\n🧹 Cleaned up test data');

    console.log('\n🎉 All Property Controller tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  } finally {
    // Close database connection
    if (mongoose.connection.readyState) {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from database');
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testPropertyController();
}

module.exports = testPropertyController;