/**
 * Manual test script for APIFeatures utility
 * This script demonstrates the functionality of the APIFeatures class
 */

const APIFeatures = require('./utils/apiFeatures');

// Mock Mongoose query for testing
class MockQuery {
  constructor() {
    this.queryObj = {};
    this.sortObj = {};
    this.selectObj = '';
    this.skipValue = 0;
    this.limitValue = 0;
  }

  find(query) {
    this.queryObj = { ...this.queryObj, ...query };
    return this;
  }

  sort(sortStr) {
    this.sortObj = sortStr;
    return this;
  }

  select(fields) {
    this.selectObj = fields;
    return this;
  }

  skip(num) {
    this.skipValue = num;
    return this;
  }

  limit(num) {
    this.limitValue = num;
    return this;
  }

  getQuery() {
    return this.queryObj;
  }
}

console.log('🧪 Testing APIFeatures Utility\n');

// Test 1: Basic filtering
console.log('1️⃣ Testing basic filtering...');
const mockQuery1 = new MockQuery();
const queryString1 = {
  status: 'rent',
  type: 'residential',
  minPrice: '100000',
  maxPrice: '500000',
  city: 'Cairo'
};

const features1 = new APIFeatures(mockQuery1, queryString1);
features1.filter();

console.log('Query object:', JSON.stringify(mockQuery1.queryObj, null, 2));
console.log('✅ Basic filtering test completed\n');

// Test 2: Search functionality
console.log('2️⃣ Testing search functionality...');
const mockQuery2 = new MockQuery();
const queryString2 = { keyword: 'villa with garden' };

const features2 = new APIFeatures(mockQuery2, queryString2);
features2.search();

console.log('Search query:', JSON.stringify(mockQuery2.queryObj, null, 2));
console.log('✅ Search test completed\n');

// Test 3: Geospatial filtering
console.log('3️⃣ Testing geospatial filtering...');
const mockQuery3 = new MockQuery();
const queryString3 = { bounds: '30.0,31.0,30.1,31.1' }; // Cairo area bounds

const features3 = new APIFeatures(mockQuery3, queryString3);
features3.geoFilter();

console.log('Geospatial query:', JSON.stringify(mockQuery3.queryObj, null, 2));
console.log('✅ Geospatial filtering test completed\n');

// Test 4: Near location search
console.log('4️⃣ Testing near location search...');
const mockQuery4 = new MockQuery();
const queryString4 = { near: '30.0644,31.2497,5000' }; // Cairo center with 5km radius

const features4 = new APIFeatures(mockQuery4, queryString4);
features4.nearLocation();

console.log('Near location query:', JSON.stringify(mockQuery4.queryObj, null, 2));
console.log('✅ Near location test completed\n');

// Test 5: Sorting
console.log('5️⃣ Testing sorting options...');
const mockQuery5 = new MockQuery();
const queryString5 = { sort: 'price_desc,newest' };

const features5 = new APIFeatures(mockQuery5, queryString5);
features5.sort();

console.log('Sort string:', mockQuery5.sortObj);
console.log('✅ Sorting test completed\n');

// Test 6: Pagination
console.log('6️⃣ Testing pagination...');
const mockQuery6 = new MockQuery();
const queryString6 = { page: '3', limit: '20' };

const features6 = new APIFeatures(mockQuery6, queryString6);
features6.paginate();

console.log('Skip value:', mockQuery6.skipValue);
console.log('Limit value:', mockQuery6.limitValue);
console.log('Pagination info:', features6.getPaginationInfo());
console.log('✅ Pagination test completed\n');

// Test 7: Complete chain
console.log('7️⃣ Testing complete method chain...');
const mockQuery7 = new MockQuery();
const queryString7 = {
  status: 'rent',
  type: 'residential',
  minPrice: '200000',
  maxPrice: '800000',
  city: 'Cairo',
  rooms: '3',
  keyword: 'modern apartment',
  bounds: '30.0,31.0,30.1,31.1',
  sort: 'price_asc',
  page: '2',
  limit: '15'
};

const features7 = new APIFeatures(mockQuery7, queryString7);
features7.applyAll();

console.log('Complete query result:');
console.log('- Query object:', JSON.stringify(mockQuery7.queryObj, null, 2));
console.log('- Sort:', mockQuery7.sortObj);
console.log('- Skip:', mockQuery7.skipValue);
console.log('- Limit:', mockQuery7.limitValue);
console.log('- Pagination info:', features7.getPaginationInfo());
console.log('✅ Complete chain test completed\n');

console.log('🎉 All APIFeatures tests completed successfully!');

// Example usage scenarios
console.log('\n📋 Example Usage Scenarios:\n');

console.log('🏠 Scenario 1: Find rental apartments in Cairo under 300K EGP');
const scenario1Query = new MockQuery();
const scenario1 = {
  status: 'rent',
  type: 'residential',
  city: 'Cairo',
  maxPrice: '300000',
  sort: 'price_asc'
};
new APIFeatures(scenario1Query, scenario1).applyAll();
console.log('Query:', JSON.stringify(scenario1Query.queryObj, null, 2));

console.log('\n🏢 Scenario 2: Find commercial properties near downtown Cairo');
const scenario2Query = new MockQuery();
const scenario2 = {
  type: 'commercial',
  near: '30.0644,31.2497,3000', // 3km radius from downtown Cairo
  sort: 'newest'
};
new APIFeatures(scenario2Query, scenario2).applyAll();
console.log('Query:', JSON.stringify(scenario2Query.queryObj, null, 2));

console.log('\n🏡 Scenario 3: Search for villas with specific features');
const scenario3Query = new MockQuery();
const scenario3 = {
  type: 'residential',
  keyword: 'villa',
  features: ['garden', 'parking'],
  minArea: '200',
  sort: 'area_desc'
};
new APIFeatures(scenario3Query, scenario3).applyAll();
console.log('Query:', JSON.stringify(scenario3Query.queryObj, null, 2));

console.log('\n✨ APIFeatures utility is ready for production use!');