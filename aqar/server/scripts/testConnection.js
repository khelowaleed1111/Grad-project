require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');

/**
 * Test MongoDB Connection Script
 * Verifies database connectivity and displays connection details
 */

const testConnection = async () => {
  try {
    console.log('🔍 Testing MongoDB Connection...\n');
    console.log('Configuration:');
    console.log('═══════════════════════════════════════');
    console.log(`MongoDB URI: ${process.env.MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);
    console.log(`Port: ${process.env.PORT || 5000}`);
    console.log('═══════════════════════════════════════\n');

    // Attempt connection
    await connectDB();

    // Get connection details
    const db = mongoose.connection;
    console.log('\n✅ Connection Successful!\n');
    console.log('Database Information:');
    console.log('═══════════════════════════════════════');
    console.log(`Host: ${db.host}`);
    console.log(`Database Name: ${db.name}`);
    console.log(`Port: ${db.port}`);
    console.log(`Ready State: ${db.readyState === 1 ? 'Connected' : 'Not Connected'}`);
    console.log('═══════════════════════════════════════\n');

    // Test collections
    console.log('📦 Checking Collections...');
    const collections = await db.db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('⚠️  No collections found. Database is empty.');
      console.log('💡 Run "npm run seed" to populate with sample data.\n');
    } else {
      console.log(`Found ${collections.length} collection(s):\n`);
      for (const collection of collections) {
        const count = await db.db.collection(collection.name).countDocuments();
        console.log(`   📁 ${collection.name}: ${count} document(s)`);
      }
      console.log('');
    }

    // Test write operation
    console.log('✍️  Testing Write Operation...');
    const testCollection = db.collection('connection_test');
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: 'Connection test successful',
    };
    
    await testCollection.insertOne(testDoc);
    console.log('✅ Write operation successful\n');

    // Test read operation
    console.log('📖 Testing Read Operation...');
    const readDoc = await testCollection.findOne({ test: true });
    console.log('✅ Read operation successful\n');

    // Clean up test document
    await testCollection.deleteOne({ test: true });
    console.log('🧹 Cleaned up test data\n');

    console.log('🎉 All tests passed! MongoDB connection is working perfectly.\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection Test Failed!\n');
    console.error('Error Details:');
    console.error('═══════════════════════════════════════');
    console.error(`Message: ${error.message}`);
    console.error(`Code: ${error.code || 'N/A'}`);
    console.error('═══════════════════════════════════════\n');

    console.error('💡 Troubleshooting Tips:');
    console.error('   1. Check your MONGO_URI in .env file');
    console.error('   2. Verify your MongoDB Atlas credentials');
    console.error('   3. Ensure your IP is whitelisted in MongoDB Atlas');
    console.error('   4. Check your internet connection');
    console.error('   5. Verify the database user has proper permissions\n');

    process.exit(1);
  }
};

// Run the test
testConnection();
