# Test Setup Guide

## Overview
This guide explains how to set up and run the test suite for the Aqar Real Estate Platform backend.

## Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation

### 1. Install Testing Dependencies

Run the following command in the `server` directory:

```bash
npm install --save-dev jest @types/jest mongodb-memory-server
```

### Dependencies Installed:
- **jest**: JavaScript testing framework
- **@types/jest**: TypeScript definitions for Jest (provides better IDE support)
- **mongodb-memory-server**: In-memory MongoDB server for testing (no need for real MongoDB)

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
Automatically reruns tests when files change:
```bash
npm run test:watch
```

### Run Tests with Coverage Report
Generates a detailed coverage report:
```bash
npm run test:coverage
```

The coverage report will be generated in the `coverage/` directory. Open `coverage/lcov-report/index.html` in a browser to view the detailed report.

## Test Structure

### Current Test Files
- `models/User.test.js` - User model tests (30+ test cases)

### Test Categories

#### User Model Tests
1. **Schema Validation** (13 tests)
   - Required fields validation
   - Field length validation
   - Email format validation
   - Role enum validation
   - Field trimming

2. **Password Hashing** (4 tests)
   - Password hashing before save
   - Salt rounds verification (12 rounds)
   - Conditional rehashing

3. **matchPassword Method** (3 tests)
   - Correct password verification
   - Incorrect password rejection
   - Case sensitivity

4. **toJSON Method** (2 tests)
   - Password exclusion from JSON
   - Other fields inclusion

5. **Password Field Selection** (2 tests)
   - Default exclusion (select: false)
   - Explicit selection with +password

6. **Timestamps** (2 tests)
   - Automatic timestamp creation
   - Timestamp updates

## Test Configuration

### Jest Configuration (`jest.config.js`)
```javascript
{
  testEnvironment: 'node',           // Node.js environment for backend tests
  testMatch: ['**/*.test.js'],       // Test file pattern
  testTimeout: 30000,                // 30 second timeout for async tests
  coverageThreshold: {               // Minimum coverage requirements
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
}
```

## Writing New Tests

### Test File Naming Convention
- Place test files next to the code they test
- Use `.test.js` extension (e.g., `User.test.js`)

### Example Test Structure
```javascript
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const ModelName = require('./ModelName');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await ModelName.deleteMany({});
});

describe('ModelName', () => {
  test('should do something', async () => {
    // Test implementation
    expect(result).toBe(expected);
  });
});
```

## Troubleshooting

### Issue: Tests Timeout
**Solution**: Increase timeout in jest.config.js or use `jest.setTimeout(60000)` in test file

### Issue: MongoDB Memory Server Fails to Start
**Solution**: 
1. Clear npm cache: `npm cache clean --force`
2. Reinstall: `npm install mongodb-memory-server --save-dev`
3. On Windows, may need to run as administrator

### Issue: Tests Pass Locally but Fail in CI
**Solution**: Ensure all dependencies are installed and Node.js version matches

## Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Cleanup**: Always clean up test data in `afterEach` hooks
3. **Descriptive Names**: Use clear, descriptive test names
4. **Arrange-Act-Assert**: Structure tests with setup, execution, and verification
5. **Mock External Services**: Mock Cloudinary, email services, etc.
6. **Test Edge Cases**: Include tests for boundary conditions and error scenarios

## Coverage Goals

- **Models**: 90%+ coverage
- **Controllers**: 80%+ coverage
- **Middleware**: 85%+ coverage
- **Utilities**: 90%+ coverage

## Next Steps

1. Add tests for other models (Property, Inquiry)
2. Add controller tests with mocked dependencies
3. Add middleware tests (auth, error handling)
4. Add integration tests for API endpoints
5. Set up CI/CD pipeline with automated testing

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
- [Mongoose Testing Guide](https://mongoosejs.com/docs/jest.html)
