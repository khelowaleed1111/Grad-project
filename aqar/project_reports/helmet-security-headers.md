# Helmet Security Headers Configuration

## Overview

This document describes the Helmet.js security headers configuration implemented in the Aqar Platform API to protect against common web vulnerabilities.

## What is Helmet?

Helmet is a collection of middleware functions that set HTTP response headers to help protect Express applications from well-known web vulnerabilities. It's not a silver bullet, but it can help!

## Configured Security Headers

### 1. Content-Security-Policy (CSP)

**Purpose**: Mitigates Cross-Site Scripting (XSS) and data injection attacks

**Configuration**:
```javascript
contentSecurityPolicy: {
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    imgSrc: ["'self'", 'data:', 'https:', 'http:'],
    scriptSrc: ["'self'"],
    connectSrc: ["'self'"],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
}
```

**What it does**:
- Restricts resources to same-origin by default
- Allows Google Fonts for styling
- Permits images from any HTTPS source (for Cloudinary CDN)
- Blocks all frames and objects
- Upgrades insecure requests to HTTPS

### 2. HTTP Strict-Transport-Security (HSTS)

**Purpose**: Forces browsers to use HTTPS connections only

**Configuration**:
```javascript
hsts: {
  maxAge: 31536000, // 1 year
  includeSubDomains: true,
  preload: true,
}
```

**What it does**:
- Enforces HTTPS for 1 year (31,536,000 seconds)
- Applies to all subdomains
- Eligible for browser HSTS preload lists

### 3. X-Frame-Options

**Purpose**: Prevents clickjacking attacks

**Configuration**:
```javascript
frameguard: {
  action: 'deny',
}
```

**What it does**:
- Completely prevents the page from being embedded in `<iframe>`, `<frame>`, `<embed>`, or `<object>` tags

### 4. X-Content-Type-Options

**Purpose**: Prevents MIME type sniffing

**Configuration**:
```javascript
noSniff: true
```

**What it does**:
- Forces browsers to respect the declared `Content-Type` header
- Prevents browsers from trying to guess the content type

### 5. X-XSS-Protection

**Purpose**: Enables browser's XSS filtering (legacy support)

**Configuration**:
```javascript
xssFilter: true
```

**What it does**:
- Enables XSS protection in older browsers
- Modern browsers rely on CSP instead

### 6. Referrer-Policy

**Purpose**: Controls referrer information sent with requests

**Configuration**:
```javascript
referrerPolicy: {
  policy: 'strict-origin-when-cross-origin',
}
```

**What it does**:
- Sends full URL for same-origin requests
- Sends only origin for cross-origin HTTPS requests
- Sends nothing when downgrading from HTTPS to HTTP

### 7. X-DNS-Prefetch-Control

**Purpose**: Controls DNS prefetching

**Configuration**:
```javascript
dnsPrefetchControl: {
  allow: false,
}
```

**What it does**:
- Disables DNS prefetching to prevent privacy leaks
- Reduces unnecessary DNS lookups

### 8. X-Download-Options

**Purpose**: Prevents IE from executing downloads in site's context

**Configuration**:
```javascript
ieNoOpen: true
```

**What it does**:
- Forces downloads to be saved rather than opened directly
- Specific to Internet Explorer

### 9. X-Permitted-Cross-Domain-Policies

**Purpose**: Controls cross-domain policy for Adobe products

**Configuration**:
```javascript
permittedCrossDomainPolicies: {
  permittedPolicies: 'none',
}
```

**What it does**:
- Prevents Adobe Flash and PDF from loading cross-domain content
- Blocks `crossdomain.xml` policies

## Security Benefits

### Protection Against Common Attacks

1. **Cross-Site Scripting (XSS)**
   - CSP restricts script sources
   - X-XSS-Protection provides legacy browser support

2. **Clickjacking**
   - X-Frame-Options prevents iframe embedding
   - CSP frameSrc directive provides additional protection

3. **Man-in-the-Middle (MITM)**
   - HSTS enforces HTTPS connections
   - Prevents protocol downgrade attacks

4. **MIME Type Confusion**
   - X-Content-Type-Options prevents MIME sniffing
   - Reduces risk of executing malicious content

5. **Information Leakage**
   - Referrer-Policy controls referrer information
   - X-DNS-Prefetch-Control prevents DNS leaks

## Testing the Configuration

### Method 1: Using cURL

```bash
curl -I http://localhost:5000/api/health
```

Look for these headers in the response:
- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Frame-Options`
- `X-Content-Type-Options`
- And others...

### Method 2: Using the Verification Script

```bash
# Make sure the server is running
npm run dev

# In another terminal, run:
node verify-helmet.js
```

### Method 3: Browser DevTools

1. Start the server: `npm run dev`
2. Open browser and navigate to: `http://localhost:5000/api/health`
3. Open DevTools (F12)
4. Go to Network tab
5. Click on the request
6. View Response Headers

### Method 4: Automated Tests

```bash
npm test helmet.test.js
```

## Production Considerations

### Environment-Specific Configuration

For production, you may want to adjust CSP based on your frontend domain:

```javascript
const isProduction = process.env.NODE_ENV === 'production';

const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", isProduction ? 'https://api.aqar.com' : '*'],
      imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
      // ... other directives
    },
  },
  // ... other options
};
```

### HSTS Preload

To add your domain to the HSTS preload list:

1. Ensure HTTPS is working correctly
2. Verify HSTS header includes `preload` directive
3. Submit at: https://hstspreload.org/

### CSP Reporting

Consider adding CSP reporting to monitor violations:

```javascript
contentSecurityPolicy: {
  directives: {
    // ... other directives
    reportUri: '/api/csp-report',
  },
}
```

## Common Issues and Solutions

### Issue: Frontend styles not loading

**Cause**: CSP blocking inline styles

**Solution**: Already configured with `'unsafe-inline'` in `styleSrc`

### Issue: Cloudinary images not displaying

**Cause**: CSP blocking external images

**Solution**: Already configured with `https:` and `http:` in `imgSrc`

### Issue: Cannot access local HTTP after testing HTTPS

**Cause**: HSTS cached in browser

**Solution**: 
- Clear browser HSTS cache
- Or use environment-specific config to disable HSTS in development

### Issue: CORS preflight requests failing

**Cause**: Helmet applied after CORS

**Solution**: Already configured correctly - Helmet is applied before CORS

## Security Checklist

- [x] Helmet installed and configured
- [x] Content Security Policy (CSP) configured
- [x] HTTP Strict Transport Security (HSTS) enabled
- [x] X-Frame-Options set to DENY
- [x] X-Content-Type-Options set to nosniff
- [x] Referrer-Policy configured
- [x] Additional security headers configured
- [x] Test suite created
- [x] Documentation completed

## Additional Resources

- [Helmet.js Documentation](https://helmetjs.github.io/)
- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [HSTS Preload List](https://hstspreload.org/)

## Maintenance

### Regular Reviews

- Review CSP directives when adding new external services
- Update HSTS max-age periodically
- Monitor CSP violation reports (if implemented)
- Test headers after Helmet version updates

### Version Updates

When updating Helmet:

```bash
npm update helmet
```

Then verify all headers are still configured correctly:

```bash
node verify-helmet.js
npm test helmet.test.js
```

## Conclusion

The Helmet security headers configuration provides comprehensive protection against common web vulnerabilities. Regular testing and monitoring ensure the configuration remains effective as the application evolves.

For questions or issues, refer to the [Helmet.js documentation](https://helmetjs.github.io/) or the OWASP Secure Headers Project.
