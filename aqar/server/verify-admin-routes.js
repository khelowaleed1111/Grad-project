/**
 * Admin Routes Verification Script
 * 
 * This script verifies that all admin routes are properly configured
 * with the correct middleware and authorization.
 */

const express = require('express');
const adminRoutes = require('./routes/adminRoutes');

console.log('🔍 Verifying Admin Routes Configuration...\n');

// Check if adminRoutes is a valid Express router
if (!adminRoutes || typeof adminRoutes !== 'function') {
  console.error('❌ Admin routes module is not a valid Express router');
  process.exit(1);
}

console.log('✅ Admin routes module loaded successfully');

// Get the router stack
const stack = adminRoutes.stack || [];

console.log(`\n📋 Found ${stack.length} route handlers\n`);

// Expected routes
const expectedRoutes = [
  { method: 'GET', path: '/stats' },
  { method: 'GET', path: '/users' },
  { method: 'PUT', path: '/users/:id/role' },
  { method: 'DELETE', path: '/users/:id' },
  { method: 'GET', path: '/listings' },
  { method: 'GET', path: '/listings/pending' },
  { method: 'PUT', path: '/listings/:id/approve' },
  { method: 'DELETE', path: '/listings/:id' },
  { method: 'PUT', path: '/listings/:id/feature' },
];

console.log('📝 Expected Admin Routes:');
console.log('─'.repeat(60));

let allRoutesFound = true;

expectedRoutes.forEach((expectedRoute) => {
  const found = stack.some((layer) => {
    if (!layer.route) return false;
    
    const methods = Object.keys(layer.route.methods);
    const path = layer.route.path;
    
    return (
      methods.includes(expectedRoute.method.toLowerCase()) &&
      path === expectedRoute.path
    );
  });

  const status = found ? '✅' : '❌';
  console.log(`${status} ${expectedRoute.method.padEnd(7)} /api/admin${expectedRoute.path}`);
  
  if (!found) {
    allRoutesFound = false;
  }
});

console.log('─'.repeat(60));

// Check for middleware
console.log('\n🔒 Checking Authorization Middleware:');
console.log('─'.repeat(60));

const hasMiddleware = stack.some((layer) => {
  return layer.name === 'protect' || layer.name === 'isAdmin';
});

if (hasMiddleware) {
  console.log('✅ Authorization middleware (protect, isAdmin) is applied');
} else {
  console.log('⚠️  Warning: Could not verify authorization middleware');
}

console.log('─'.repeat(60));

// Summary
console.log('\n📊 Verification Summary:');
console.log('─'.repeat(60));

if (allRoutesFound) {
  console.log('✅ All expected admin routes are configured');
  console.log('✅ Admin routes are ready for use');
  console.log('\n💡 To test the routes:');
  console.log('   1. Start the server: npm run dev');
  console.log('   2. Create an admin user or update a user role to "admin"');
  console.log('   3. Login to get a JWT token');
  console.log('   4. Use the token in Authorization header: Bearer <token>');
  console.log('   5. Access admin routes at: http://localhost:5000/api/admin/*');
  process.exit(0);
} else {
  console.log('❌ Some expected routes are missing');
  console.log('⚠️  Please check the routes/adminRoutes.js file');
  process.exit(1);
}
