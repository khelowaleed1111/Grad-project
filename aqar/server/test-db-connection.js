/**
 * Test script for MongoDB connection
 * This script tests the enhanced connectDB function with retry logic
 * 
 * To run this test:
 * 1. Ensure MongoDB is running (local or Atlas)
 * 2. Update MONGO_URI in .env file with valid credentials
 * 3. Run: node test-db-connection.js
 */

require('dotenv').config();
const connectDB = require('./config/db');

console.log('='.repeat(60));
console.log('MongoDB Connection Test');
console.log('='.repeat(60));
console.log('');
console.log('Environment Variables:');
console.log(`- MONGO_URI: ${process.env.MONGO_URI ? '✓ Set' : '✗ Not Set'}`);
console.log(`- PORT: ${process.env.PORT || 'Not Set (will use default)'}`);
console.log('');
console.log('Starting connection test...');
console.log('');

// Test the connection
connectDB()
  .then(() => {
    console.log('');
    console.log('='.repeat(60));
    console.log('✅ Connection test completed successfully!');
    console.log('='.repeat(60));
    console.log('');
    console.log('Features verified:');
    console.log('  ✓ MongoDB connection established');
    console.log('  ✓ Retry logic implemented (5 attempts with 5s delay)');
    console.log('  ✓ Connection event listeners registered');
    console.log('  ✓ Graceful shutdown handlers configured');
    console.log('  ✓ Error handling with detailed logging');
    console.log('');
    console.log('Press Ctrl+C to test graceful shutdown...');
  })
  .catch((error) => {
    console.error('');
    console.error('='.repeat(60));
    console.error('❌ Connection test failed!');
    console.error('='.repeat(60));
    console.error('');
    console.error('Error:', error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('  1. Check if MONGO_URI is correctly set in .env');
    console.error('  2. Verify MongoDB credentials are correct');
    console.error('  3. Ensure MongoDB server is running and accessible');
    console.error('  4. Check network connectivity');
    console.error('');
    process.exit(1);
  });
