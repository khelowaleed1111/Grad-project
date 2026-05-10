const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./User');
const bcrypt = require('bcryptjs');

let mongoServer;

// Setup: Connect to in-memory MongoDB before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Teardown: Disconnect and stop MongoDB after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear database between tests
afterEach(async () => {
  await User.deleteMany({});
});

describe('User Model', () => {
  describe('Schema Validation', () => {
    test('should create a valid user with all required fields', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '01234567890',
        role: 'buyer',
      };

      const user = await User.create(userData);

      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.phone).toBe(userData.phone);
      expect(user.role).toBe(userData.role);
      expect(user.isVerified).toBe(false);
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    test('should create user with default role as buyer', async () => {
      const userData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);

      expect(user.role).toBe('buyer');
    });

    test('should create user with default isVerified as false', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);

      expect(user.isVerified).toBe(false);
    });

    test('should fail when name is missing', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should fail when email is missing', async () => {
      const userData = {
        name: 'Test User',
        password: 'password123',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should fail when password is missing', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should fail when name exceeds 100 characters', async () => {
      const userData = {
        name: 'a'.repeat(101),
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should fail when password is less than 8 characters', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'pass123',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should fail when email format is invalid', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should convert email to lowercase', async () => {
      const userData = {
        name: 'Test User',
        email: 'TEST@EXAMPLE.COM',
        password: 'password123',
      };

      const user = await User.create(userData);

      expect(user.email).toBe('test@example.com');
    });

    test('should fail when email is duplicate', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      await User.create(userData);

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should accept valid role values', async () => {
      const roles = ['buyer', 'owner', 'agent', 'admin'];

      for (const role of roles) {
        const userData = {
          name: `Test ${role}`,
          email: `${role}@example.com`,
          password: 'password123',
          role,
        };

        const user = await User.create(userData);
        expect(user.role).toBe(role);
      }
    });

    test('should fail when role is invalid', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'invalid-role',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should trim name field', async () => {
      const userData = {
        name: '  John Doe  ',
        email: 'john@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);

      expect(user.name).toBe('John Doe');
    });

    test('should trim phone field', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '  01234567890  ',
      };

      const user = await User.create(userData);

      expect(user.phone).toBe('01234567890');
    });
  });

  describe('Password Hashing', () => {
    test('should hash password before saving', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);

      // Fetch user with password field
      const userWithPassword = await User.findById(user._id).select('+password');

      expect(userWithPassword.password).not.toBe(userData.password);
      expect(userWithPassword.password).toMatch(/^\$2[aby]\$.{56}$/); // bcrypt hash pattern
    });

    test('should use 12 salt rounds for bcrypt', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);
      const userWithPassword = await User.findById(user._id).select('+password');

      // bcrypt hash format: $2a$rounds$salt+hash
      const rounds = userWithPassword.password.split('$')[2];
      expect(rounds).toBe('12');
    });

    test('should not rehash password if not modified', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);
      const userWithPassword = await User.findById(user._id).select('+password');
      const originalHash = userWithPassword.password;

      // Update user without changing password
      userWithPassword.name = 'Updated Name';
      await userWithPassword.save();

      const updatedUser = await User.findById(user._id).select('+password');
      expect(updatedUser.password).toBe(originalHash);
    });

    test('should rehash password when modified', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);
      const userWithPassword = await User.findById(user._id).select('+password');
      const originalHash = userWithPassword.password;

      // Update password
      userWithPassword.password = 'newpassword123';
      await userWithPassword.save();

      const updatedUser = await User.findById(user._id).select('+password');
      expect(updatedUser.password).not.toBe(originalHash);
    });
  });

  describe('matchPassword Method', () => {
    test('should return true for correct password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);
      const userWithPassword = await User.findById(user._id).select('+password');

      const isMatch = await userWithPassword.matchPassword('password123');
      expect(isMatch).toBe(true);
    });

    test('should return false for incorrect password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);
      const userWithPassword = await User.findById(user._id).select('+password');

      const isMatch = await userWithPassword.matchPassword('wrongpassword');
      expect(isMatch).toBe(false);
    });

    test('should be case-sensitive', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      };

      const user = await User.create(userData);
      const userWithPassword = await User.findById(user._id).select('+password');

      const isMatch = await userWithPassword.matchPassword('password123');
      expect(isMatch).toBe(false);
    });
  });

  describe('toJSON Method', () => {
    test('should exclude password from JSON output', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);
      const userWithPassword = await User.findById(user._id).select('+password');

      const userJSON = userWithPassword.toJSON();

      expect(userJSON.password).toBeUndefined();
      expect(userJSON.name).toBe(userData.name);
      expect(userJSON.email).toBe(userData.email);
    });

    test('should include all other fields in JSON output', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '01234567890',
        role: 'owner',
      };

      const user = await User.create(userData);
      const userJSON = user.toJSON();

      expect(userJSON._id).toBeDefined();
      expect(userJSON.name).toBe(userData.name);
      expect(userJSON.email).toBe(userData.email);
      expect(userJSON.phone).toBe(userData.phone);
      expect(userJSON.role).toBe(userData.role);
      expect(userJSON.isVerified).toBe(false);
      expect(userJSON.createdAt).toBeDefined();
      expect(userJSON.updatedAt).toBeDefined();
      expect(userJSON.password).toBeUndefined();
    });
  });

  describe('Password Field Selection', () => {
    test('should not return password by default', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);
      const foundUser = await User.findById(user._id);

      expect(foundUser.password).toBeUndefined();
    });

    test('should return password when explicitly selected', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);
      const foundUser = await User.findById(user._id).select('+password');

      expect(foundUser.password).toBeDefined();
      expect(foundUser.password).not.toBe(userData.password); // Should be hashed
    });
  });

  describe('Timestamps', () => {
    test('should have createdAt and updatedAt timestamps', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);

      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    test('should update updatedAt on modification', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);
      const originalUpdatedAt = user.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      user.name = 'Updated Name';
      await user.save();

      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});
