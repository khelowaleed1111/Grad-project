/**
 * Test script to verify Cloudinary configuration
 * Run with: node test-cloudinary-config.js
 */

require('dotenv').config();
const { cloudinary, uploadImage, deleteImage, uploadMultipleImages } = require('./config/cloudinary');

console.log('🧪 Testing Cloudinary Configuration...\n');

// Test 1: Check if Cloudinary is configured
console.log('Test 1: Cloudinary Configuration');
console.log('================================');
const config = cloudinary.config();
console.log('✓ Cloud Name:', config.cloud_name ? '✅ Set' : '❌ Missing');
console.log('✓ API Key:', config.api_key ? '✅ Set' : '❌ Missing');
console.log('✓ API Secret:', config.api_secret ? '✅ Set (hidden)' : '❌ Missing');

// Test 2: Verify environment variables
console.log('\nTest 2: Environment Variables');
console.log('================================');
console.log('✓ CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
console.log('✓ CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
console.log('✓ CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set (hidden)' : '❌ Missing');

// Test 3: Verify exported functions
console.log('\nTest 3: Exported Functions');
console.log('================================');
console.log('✓ cloudinary:', typeof cloudinary === 'object' ? '✅ Exported' : '❌ Missing');
console.log('✓ uploadImage:', typeof uploadImage === 'function' ? '✅ Exported' : '❌ Missing');
console.log('✓ deleteImage:', typeof deleteImage === 'function' ? '✅ Exported' : '❌ Missing');
console.log('✓ uploadMultipleImages:', typeof uploadMultipleImages === 'function' ? '✅ Exported' : '❌ Missing');

// Test 4: Verify function signatures
console.log('\nTest 4: Function Signatures');
console.log('================================');
console.log('✓ uploadImage accepts (file, folder):', uploadImage.length === 2 ? '✅ Correct' : '⚠️  Check signature');
console.log('✓ deleteImage accepts (publicId):', deleteImage.length === 1 ? '✅ Correct' : '⚠️  Check signature');
console.log('✓ uploadMultipleImages accepts (files, folder):', uploadMultipleImages.length === 2 ? '✅ Correct' : '⚠️  Check signature');

// Summary
console.log('\n📊 Summary');
console.log('================================');
const allConfigured = config.cloud_name && config.api_key && config.api_secret;
if (allConfigured) {
  console.log('✅ Cloudinary is properly configured!');
  console.log('✅ All functions are exported correctly.');
  console.log('\n💡 Note: To test actual uploads, you need valid Cloudinary credentials in .env');
} else {
  console.log('❌ Cloudinary configuration is incomplete.');
  console.log('📝 Please set the following in your .env file:');
  console.log('   - CLOUDINARY_CLOUD_NAME');
  console.log('   - CLOUDINARY_API_KEY');
  console.log('   - CLOUDINARY_API_SECRET');
}

console.log('\n✨ Configuration test complete!\n');
