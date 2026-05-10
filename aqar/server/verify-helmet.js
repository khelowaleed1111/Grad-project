/**
 * Helmet Configuration Verification Script
 * 
 * This script verifies that the Helmet security headers are properly configured
 * by making a request to the health endpoint and checking the response headers.
 * 
 * Usage: node verify-helmet.js
 */

const http = require('http');

const PORT = process.env.PORT || 5000;
const HOST = 'localhost';

console.log('🔍 Verifying Helmet Security Headers Configuration...\n');

// Wait a moment for server to start if needed
setTimeout(() => {
  const options = {
    hostname: HOST,
    port: PORT,
    path: '/api/health',
    method: 'GET',
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Server responded with status: ${res.statusCode}\n`);
    
    const securityHeaders = {
      'content-security-policy': 'Content Security Policy (CSP)',
      'strict-transport-security': 'HTTP Strict Transport Security (HSTS)',
      'x-frame-options': 'X-Frame-Options',
      'x-content-type-options': 'X-Content-Type-Options',
      'x-xss-protection': 'X-XSS-Protection',
      'referrer-policy': 'Referrer-Policy',
      'x-dns-prefetch-control': 'X-DNS-Prefetch-Control',
      'x-download-options': 'X-Download-Options',
      'x-permitted-cross-domain-policies': 'X-Permitted-Cross-Domain-Policies',
    };

    console.log('📋 Security Headers Check:\n');
    console.log('─'.repeat(80));

    let allHeadersPresent = true;

    Object.entries(securityHeaders).forEach(([headerKey, headerName]) => {
      const headerValue = res.headers[headerKey];
      if (headerValue) {
        console.log(`✅ ${headerName}`);
        console.log(`   ${headerKey}: ${headerValue}`);
        console.log('');
      } else {
        console.log(`❌ ${headerName} - NOT FOUND`);
        console.log('');
        allHeadersPresent = false;
      }
    });

    console.log('─'.repeat(80));

    if (allHeadersPresent) {
      console.log('\n✅ SUCCESS: All security headers are properly configured!\n');
      console.log('🔒 Your API is protected with:');
      console.log('   • Content Security Policy (prevents XSS)');
      console.log('   • HSTS (enforces HTTPS)');
      console.log('   • Clickjacking protection');
      console.log('   • MIME type sniffing prevention');
      console.log('   • And 5 additional security headers\n');
    } else {
      console.log('\n⚠️  WARNING: Some security headers are missing!\n');
      console.log('Please check your Helmet configuration in server.js\n');
    }

    // Specific checks
    console.log('🔍 Detailed Validation:\n');

    // Check CSP
    const csp = res.headers['content-security-policy'];
    if (csp && csp.includes("default-src 'self'")) {
      console.log('✅ CSP: default-src is properly set to self');
    } else {
      console.log('⚠️  CSP: default-src might not be configured correctly');
    }

    // Check HSTS
    const hsts = res.headers['strict-transport-security'];
    if (hsts && hsts.includes('max-age=31536000') && hsts.includes('includeSubDomains')) {
      console.log('✅ HSTS: Properly configured with 1-year max-age and includeSubDomains');
    } else {
      console.log('⚠️  HSTS: Configuration might need adjustment');
    }

    // Check X-Frame-Options
    const xFrameOptions = res.headers['x-frame-options'];
    if (xFrameOptions && xFrameOptions.toUpperCase() === 'DENY') {
      console.log('✅ X-Frame-Options: Set to DENY (prevents clickjacking)');
    } else {
      console.log('⚠️  X-Frame-Options: Should be set to DENY');
    }

    // Check X-Content-Type-Options
    const xContentType = res.headers['x-content-type-options'];
    if (xContentType && xContentType === 'nosniff') {
      console.log('✅ X-Content-Type-Options: Set to nosniff');
    } else {
      console.log('⚠️  X-Content-Type-Options: Should be set to nosniff');
    }

    console.log('\n✨ Verification complete!\n');
  });

  req.on('error', (error) => {
    console.error('❌ ERROR: Could not connect to server\n');
    console.error(`Make sure the server is running on http://${HOST}:${PORT}\n`);
    console.error('Start the server with: npm run dev\n');
    console.error(`Error details: ${error.message}\n`);
  });

  req.end();
}, 1000);
