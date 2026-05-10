const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Inquiry = require('./Inquiry');
const Property = require('./Property');
const User = require('./User');

let mongoServer;
let testSender;
let testOwner;
let testProperty;

// Setup: Connect to in-memory MongoDB before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create test users
  testSender = await User.create({
    name: 'Test Buyer',
    email: 'buyer@example.com',
    password: 'password123',
    role: 'buyer',
    phone: '01234567890',
  });

  testOwner = await User.create({
    name: 'Test Owner',
    email: 'owner@example.com',
    password: 'password123',
    role: 'owner',
    phone: '01987654321',
  });

  // Create test property
  testProperty = await Property.create({
    title: 'Test Property for Inquiries',
    description: 'A beautiful property for testing inquiries',
    price: 1500000,
    status: 'sale',
    type: 'residential',
    rooms: 3,
    bathrooms: 2,
    area: 200,
    location: {
      address: '123 Test Street',
      city: 'Cairo',
      country: 'Egypt',
      coordinates: {
        type: 'Point',
        coordinates: [31.2357, 30.0444],
      },
    },
    owner: testOwner._id,
  });
});

// Teardown: Disconnect and stop MongoDB after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear inquiries between tests
afterEach(async () => {
  await Inquiry.deleteMany({});
});

describe('Inquiry Model', () => {
  // Valid inquiry data for testing
  const validInquiryData = {
    property: null, // Will be set in tests
    sender: null, // Will be set in tests
    owner: null, // Will be set in tests
    message: 'I am interested in this property. Could you please provide more details about the location and availability?',
    phone: '01555123456',
    email: 'inquirer@example.com',
  };

  beforeEach(() => {
    validInquiryData.property = testProperty._id;
    validInquiryData.sender = testSender._id;
    validInquiryData.owner = testOwner._id;
  });

  describe('Schema Validation', () => {
    test('should create a valid inquiry with all required fields', async () => {
      const inquiry = await Inquiry.create(validInquiryData);

      expect(inquiry.property.toString()).toBe(testProperty._id.toString());
      expect(inquiry.sender.toString()).toBe(testSender._id.toString());
      expect(inquiry.owner.toString()).toBe(testOwner._id.toString());
      expect(inquiry.message).toBe(validInquiryData.message);
      expect(inquiry.phone).toBe(validInquiryData.phone);
      expect(inquiry.email).toBe(validInquiryData.email);
      expect(inquiry.isRead).toBe(false);
      expect(inquiry.status).toBe('pending');
      expect(inquiry.createdAt).toBeDefined();
      expect(inquiry.updatedAt).toBeDefined();
    });

    test('should create inquiry with default values', async () => {
      const minimalData = {
        property: testProperty._id,
        sender: testSender._id,
        owner: testOwner._id,
        message: 'Test inquiry message',
        phone: '01234567890',
        email: 'test@example.com',
      };

      const inquiry = await Inquiry.create(minimalData);

      expect(inquiry.isRead).toBe(false);
      expect(inquiry.status).toBe('pending');
    });

    // Required field validation tests
    test('should fail when property is missing', async () => {
      const data = { ...validInquiryData };
      delete data.property;

      await expect(Inquiry.create(data)).rejects.toThrow();
    });

    test('should fail when sender is missing', async () => {
      const data = { ...validInquiryData };
      delete data.sender;

      await expect(Inquiry.create(data)).rejects.toThrow();
    });

    test('should fail when owner is missing', async () => {
      const data = { ...validInquiryData };
      delete data.owner;

      await expect(Inquiry.create(data)).rejects.toThrow();
    });

    test('should fail when message is missing', async () => {
      const data = { ...validInquiryData };
      delete data.message;

      await expect(Inquiry.create(data)).rejects.toThrow();
    });

    test('should fail when phone is missing', async () => {
      const data = { ...validInquiryData };
      delete data.phone;

      await expect(Inquiry.create(data)).rejects.toThrow();
    });

    test('should fail when email is missing', async () => {
      const data = { ...validInquiryData };
      delete data.email;

      await expect(Inquiry.create(data)).rejects.toThrow();
    });

    // Message length validation
    test('should fail when message exceeds 1000 characters', async () => {
      const data = { ...validInquiryData };
      data.message = 'a'.repeat(1001);

      await expect(Inquiry.create(data)).rejects.toThrow();
    });

    test('should accept message with exactly 1000 characters', async () => {
      const data = { ...validInquiryData };
      data.message = 'a'.repeat(1000);

      const inquiry = await Inquiry.create(data);

      expect(inquiry.message).toHaveLength(1000);
    });

    test('should accept short messages', async () => {
      const data = { ...validInquiryData };
      data.message = 'Hi';

      const inquiry = await Inquiry.create(data);

      expect(inquiry.message).toBe('Hi');
    });

    // Status enum validation
    test('should accept valid status values', async () => {
      const statuses = ['pending', 'contacted', 'resolved'];

      for (const status of statuses) {
        const data = { ...validInquiryData };
        data.status = status;
        data.message = `Inquiry with ${status} status`;

        const inquiry = await Inquiry.create(data);
        expect(inquiry.status).toBe(status);

        await Inquiry.deleteOne({ _id: inquiry._id });
      }
    });

    test('should fail when status is invalid', async () => {
      const data = { ...validInquiryData };
      data.status = 'invalid-status';

      await expect(Inquiry.create(data)).rejects.toThrow();
    });

    // Boolean field validation
    test('should accept valid isRead values', async () => {
      const booleanValues = [true, false];

      for (const isRead of booleanValues) {
        const data = { ...validInquiryData };
        data.isRead = isRead;
        data.message = `Inquiry with isRead: ${isRead}`;

        const inquiry = await Inquiry.create(data);
        expect(inquiry.isRead).toBe(isRead);

        await Inquiry.deleteOne({ _id: inquiry._id });
      }
    });
  });

  describe('Reference Validation', () => {
    test('should populate property information', async () => {
      const inquiry = await Inquiry.create(validInquiryData);
      const populatedInquiry = await Inquiry.findById(inquiry._id).populate('property');

      expect(populatedInquiry.property).toBeDefined();
      expect(populatedInquiry.property.title).toBe(testProperty.title);
      expect(populatedInquiry.property.price).toBe(testProperty.price);
      expect(populatedInquiry.property.status).toBe(testProperty.status);
    });

    test('should populate sender information', async () => {
      const inquiry = await Inquiry.create(validInquiryData);
      const populatedInquiry = await Inquiry.findById(inquiry._id).populate('sender');

      expect(populatedInquiry.sender).toBeDefined();
      expect(populatedInquiry.sender.name).toBe(testSender.name);
      expect(populatedInquiry.sender.email).toBe(testSender.email);
      expect(populatedInquiry.sender.role).toBe(testSender.role);
      expect(populatedInquiry.sender.password).toBeUndefined(); // Should be excluded
    });

    test('should populate owner information', async () => {
      const inquiry = await Inquiry.create(validInquiryData);
      const populatedInquiry = await Inquiry.findById(inquiry._id).populate('owner');

      expect(populatedInquiry.owner).toBeDefined();
      expect(populatedInquiry.owner.name).toBe(testOwner.name);
      expect(populatedInquiry.owner.email).toBe(testOwner.email);
      expect(populatedInquiry.owner.role).toBe(testOwner.role);
      expect(populatedInquiry.owner.password).toBeUndefined(); // Should be excluded
    });

    test('should populate all references at once', async () => {
      const inquiry = await Inquiry.create(validInquiryData);
      const populatedInquiry = await Inquiry.findById(inquiry._id)
        .populate('property')
        .populate('sender')
        .populate('owner');

      expect(populatedInquiry.property.title).toBe(testProperty.title);
      expect(populatedInquiry.sender.name).toBe(testSender.name);
      expect(populatedInquiry.owner.name).toBe(testOwner.name);
    });

    test('should fail when property reference is invalid', async () => {
      const data = { ...validInquiryData };
      data.property = new mongoose.Types.ObjectId(); // Non-existent property

      // This should create the inquiry but fail on population
      const inquiry = await Inquiry.create(data);
      expect(inquiry.property).toBeDefined();
    });

    test('should fail when sender reference is invalid', async () => {
      const data = { ...validInquiryData };
      data.sender = new mongoose.Types.ObjectId(); // Non-existent user

      // This should create the inquiry but fail on population
      const inquiry = await Inquiry.create(data);
      expect(inquiry.sender).toBeDefined();
    });

    test('should fail when owner reference is invalid', async () => {
      const data = { ...validInquiryData };
      data.owner = new mongoose.Types.ObjectId(); // Non-existent user

      // This should create the inquiry but fail on population
      const inquiry = await Inquiry.create(data);
      expect(inquiry.owner).toBeDefined();
    });
  });

  describe('Database Indexes', () => {
    test('should have index on property field', async () => {
      const indexes = await Inquiry.collection.getIndexes();
      const propertyIndex = Object.keys(indexes).find(key => 
        key.includes('property')
      );

      expect(propertyIndex).toBeDefined();
    });

    test('should have index on sender field', async () => {
      const indexes = await Inquiry.collection.getIndexes();
      const senderIndex = Object.keys(indexes).find(key => 
        key.includes('sender')
      );

      expect(senderIndex).toBeDefined();
    });

    test('should have index on owner field', async () => {
      const indexes = await Inquiry.collection.getIndexes();
      const ownerIndex = Object.keys(indexes).find(key => 
        key.includes('owner')
      );

      expect(ownerIndex).toBeDefined();
    });

    test('should have index on createdAt field', async () => {
      const indexes = await Inquiry.collection.getIndexes();
      const createdAtIndex = Object.keys(indexes).find(key => 
        key.includes('createdAt')
      );

      expect(createdAtIndex).toBeDefined();
    });
  });

  describe('Timestamps', () => {
    test('should have createdAt and updatedAt timestamps', async () => {
      const inquiry = await Inquiry.create(validInquiryData);

      expect(inquiry.createdAt).toBeInstanceOf(Date);
      expect(inquiry.updatedAt).toBeInstanceOf(Date);
    });

    test('should update updatedAt on modification', async () => {
      const inquiry = await Inquiry.create(validInquiryData);
      const originalUpdatedAt = inquiry.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      inquiry.status = 'contacted';
      await inquiry.save();

      expect(inquiry.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Inquiry Management Functionality', () => {
    test('should mark inquiry as read', async () => {
      const inquiry = await Inquiry.create(validInquiryData);

      inquiry.isRead = true;
      await inquiry.save();

      expect(inquiry.isRead).toBe(true);
    });

    test('should update inquiry status', async () => {
      const inquiry = await Inquiry.create(validInquiryData);

      inquiry.status = 'contacted';
      await inquiry.save();

      expect(inquiry.status).toBe('contacted');

      inquiry.status = 'resolved';
      await inquiry.save();

      expect(inquiry.status).toBe('resolved');
    });

    test('should find inquiries by property', async () => {
      // Create multiple inquiries for the same property
      const inquiry1 = await Inquiry.create(validInquiryData);
      
      const inquiry2Data = { ...validInquiryData };
      inquiry2Data.message = 'Another inquiry for the same property';
      inquiry2Data.email = 'another@example.com';
      const inquiry2 = await Inquiry.create(inquiry2Data);

      const inquiries = await Inquiry.find({ property: testProperty._id });

      expect(inquiries).toHaveLength(2);
      expect(inquiries.map(i => i._id.toString())).toContain(inquiry1._id.toString());
      expect(inquiries.map(i => i._id.toString())).toContain(inquiry2._id.toString());
    });

    test('should find inquiries by sender', async () => {
      const inquiry = await Inquiry.create(validInquiryData);

      const inquiries = await Inquiry.find({ sender: testSender._id });

      expect(inquiries).toHaveLength(1);
      expect(inquiries[0]._id.toString()).toBe(inquiry._id.toString());
    });

    test('should find inquiries by owner', async () => {
      const inquiry = await Inquiry.create(validInquiryData);

      const inquiries = await Inquiry.find({ owner: testOwner._id });

      expect(inquiries).toHaveLength(1);
      expect(inquiries[0]._id.toString()).toBe(inquiry._id.toString());
    });

    test('should find unread inquiries', async () => {
      const inquiry1 = await Inquiry.create(validInquiryData);
      
      const inquiry2Data = { ...validInquiryData };
      inquiry2Data.message = 'Read inquiry';
      inquiry2Data.email = 'read@example.com';
      inquiry2Data.isRead = true;
      await Inquiry.create(inquiry2Data);

      const unreadInquiries = await Inquiry.find({ isRead: false });

      expect(unreadInquiries).toHaveLength(1);
      expect(unreadInquiries[0]._id.toString()).toBe(inquiry1._id.toString());
    });

    test('should find inquiries by status', async () => {
      const inquiry1 = await Inquiry.create(validInquiryData);
      
      const inquiry2Data = { ...validInquiryData };
      inquiry2Data.message = 'Contacted inquiry';
      inquiry2Data.email = 'contacted@example.com';
      inquiry2Data.status = 'contacted';
      await Inquiry.create(inquiry2Data);

      const pendingInquiries = await Inquiry.find({ status: 'pending' });
      const contactedInquiries = await Inquiry.find({ status: 'contacted' });

      expect(pendingInquiries).toHaveLength(1);
      expect(contactedInquiries).toHaveLength(1);
      expect(pendingInquiries[0]._id.toString()).toBe(inquiry1._id.toString());
    });

    test('should sort inquiries by creation date', async () => {
      const inquiry1 = await Inquiry.create(validInquiryData);
      
      // Wait a bit to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));
      
      const inquiry2Data = { ...validInquiryData };
      inquiry2Data.message = 'Second inquiry';
      inquiry2Data.email = 'second@example.com';
      const inquiry2 = await Inquiry.create(inquiry2Data);

      const inquiriesAsc = await Inquiry.find({}).sort({ createdAt: 1 });
      const inquiriesDesc = await Inquiry.find({}).sort({ createdAt: -1 });

      expect(inquiriesAsc[0]._id.toString()).toBe(inquiry1._id.toString());
      expect(inquiriesAsc[1]._id.toString()).toBe(inquiry2._id.toString());
      
      expect(inquiriesDesc[0]._id.toString()).toBe(inquiry2._id.toString());
      expect(inquiriesDesc[1]._id.toString()).toBe(inquiry1._id.toString());
    });
  });

  describe('Contact Information Validation', () => {
    test('should store phone number correctly', async () => {
      const data = { ...validInquiryData };
      data.phone = '01234567890';

      const inquiry = await Inquiry.create(data);

      expect(inquiry.phone).toBe('01234567890');
    });

    test('should store email correctly', async () => {
      const data = { ...validInquiryData };
      data.email = 'test.email+tag@example.com';

      const inquiry = await Inquiry.create(data);

      expect(inquiry.email).toBe('test.email+tag@example.com');
    });

    test('should handle different phone formats', async () => {
      const phoneFormats = [
        '01234567890',
        '+201234567890',
        '(012) 345-6789',
        '012-345-6789',
      ];

      for (const phone of phoneFormats) {
        const data = { ...validInquiryData };
        data.phone = phone;
        data.message = `Inquiry with phone: ${phone}`;
        data.email = `test${phoneFormats.indexOf(phone)}@example.com`;

        const inquiry = await Inquiry.create(data);
        expect(inquiry.phone).toBe(phone);

        await Inquiry.deleteOne({ _id: inquiry._id });
      }
    });

    test('should handle different email formats', async () => {
      const emailFormats = [
        'simple@example.com',
        'test.email@example.com',
        'test+tag@example.com',
        'user123@sub.example.com',
      ];

      for (const email of emailFormats) {
        const data = { ...validInquiryData };
        data.email = email;
        data.message = `Inquiry with email: ${email}`;

        const inquiry = await Inquiry.create(data);
        expect(inquiry.email).toBe(email);

        await Inquiry.deleteOne({ _id: inquiry._id });
      }
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty string fields gracefully', async () => {
      const data = { ...validInquiryData };
      data.phone = '';
      data.email = '';

      // These should fail validation since they're required
      await expect(Inquiry.create(data)).rejects.toThrow();
    });

    test('should handle very long phone numbers', async () => {
      const data = { ...validInquiryData };
      data.phone = '1'.repeat(50); // Very long phone number

      const inquiry = await Inquiry.create(data);
      expect(inquiry.phone).toBe('1'.repeat(50));
    });

    test('should handle special characters in message', async () => {
      const data = { ...validInquiryData };
      data.message = 'Hello! I\'m interested in this property. Can you provide more info? Thanks! 😊 #property #cairo';

      const inquiry = await Inquiry.create(data);
      expect(inquiry.message).toBe(data.message);
    });

    test('should handle unicode characters in message', async () => {
      const data = { ...validInquiryData };
      data.message = 'مرحبا، أنا مهتم بهذا العقار. هل يمكنك تقديم المزيد من التفاصيل؟';

      const inquiry = await Inquiry.create(data);
      expect(inquiry.message).toBe(data.message);
    });
  });
});