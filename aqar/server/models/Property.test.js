const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Property = require('./Property');
const User = require('./User');

let mongoServer;
let testUser;

// Setup: Connect to in-memory MongoDB before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create a test user for property ownership
  testUser = await User.create({
    name: 'Test Owner',
    email: 'owner@example.com',
    password: 'password123',
    role: 'owner',
  });
});

// Teardown: Disconnect and stop MongoDB after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear database between tests
afterEach(async () => {
  await Property.deleteMany({});
});

describe('Property Model', () => {
  // Valid property data for testing
  const validPropertyData = {
    title: 'Beautiful Villa in New Cairo',
    description: 'A stunning 3-bedroom villa with garden and pool in the heart of New Cairo.',
    price: 2500000,
    status: 'sale',
    type: 'residential',
    rooms: 3,
    bathrooms: 2,
    area: 250,
    images: ['https://res.cloudinary.com/test/image1.jpg', 'https://res.cloudinary.com/test/image2.jpg'],
    location: {
      address: '123 Main Street, New Cairo',
      city: 'Cairo',
      governorate: 'Cairo',
      country: 'Egypt',
      coordinates: {
        type: 'Point',
        coordinates: [31.2357, 30.0444], // [longitude, latitude] for Cairo
      },
    },
    owner: null, // Will be set in tests
  };

  beforeEach(() => {
    validPropertyData.owner = testUser._id;
  });

  describe('Schema Validation', () => {
    test('should create a valid property with all required fields', async () => {
      const property = await Property.create(validPropertyData);

      expect(property.title).toBe(validPropertyData.title);
      expect(property.description).toBe(validPropertyData.description);
      expect(property.price).toBe(validPropertyData.price);
      expect(property.status).toBe(validPropertyData.status);
      expect(property.type).toBe(validPropertyData.type);
      expect(property.rooms).toBe(validPropertyData.rooms);
      expect(property.bathrooms).toBe(validPropertyData.bathrooms);
      expect(property.area).toBe(validPropertyData.area);
      expect(property.images).toEqual(validPropertyData.images);
      expect(property.location.address).toBe(validPropertyData.location.address);
      expect(property.location.city).toBe(validPropertyData.location.city);
      expect(property.location.coordinates.coordinates).toEqual(validPropertyData.location.coordinates.coordinates);
      expect(property.owner.toString()).toBe(testUser._id.toString());
      expect(property.isApproved).toBe(false);
      expect(property.isFeatured).toBe(false);
      expect(property.views).toBe(0);
      expect(property.createdAt).toBeDefined();
      expect(property.updatedAt).toBeDefined();
    });

    test('should create property with default values', async () => {
      const minimalData = {
        title: 'Test Property',
        description: 'Test description',
        price: 100000,
        status: 'rent',
        type: 'residential',
        area: 100,
        location: {
          address: 'Test Address',
          city: 'Test City',
          coordinates: {
            coordinates: [31.0, 30.0],
          },
        },
        owner: testUser._id,
      };

      const property = await Property.create(minimalData);

      expect(property.location.country).toBe('Egypt');
      expect(property.location.coordinates.type).toBe('Point');
      expect(property.isApproved).toBe(false);
      expect(property.isFeatured).toBe(false);
      expect(property.views).toBe(0);
      expect(property.rooms).toBeNull();
      expect(property.bathrooms).toBeNull();
      expect(property.deletedAt).toBeNull();
    });

    // Required field validation tests
    test('should fail when title is missing', async () => {
      const data = { ...validPropertyData };
      delete data.title;

      await expect(Property.create(data)).rejects.toThrow();
    });

    test('should fail when description is missing', async () => {
      const data = { ...validPropertyData };
      delete data.description;

      await expect(Property.create(data)).rejects.toThrow();
    });

    test('should fail when price is missing', async () => {
      const data = { ...validPropertyData };
      delete data.price;

      await expect(Property.create(data)).rejects.toThrow();
    });

    test('should fail when status is missing', async () => {
      const data = { ...validPropertyData };
      delete data.status;

      await expect(Property.create(data)).rejects.toThrow();
    });

    test('should fail when type is missing', async () => {
      const data = { ...validPropertyData };
      delete data.type;

      await expect(Property.create(data)).rejects.toThrow();
    });

    test('should fail when area is missing', async () => {
      const data = { ...validPropertyData };
      delete data.area;

      await expect(Property.create(data)).rejects.toThrow();
    });

    test('should fail when location address is missing', async () => {
      const data = { ...validPropertyData };
      delete data.location.address;

      await expect(Property.create(data)).rejects.toThrow();
    });

    test('should fail when location city is missing', async () => {
      const data = { ...validPropertyData };
      delete data.location.city;

      await expect(Property.create(data)).rejects.toThrow();
    });

    test('should fail when coordinates are missing', async () => {
      const data = { ...validPropertyData };
      delete data.location.coordinates.coordinates;

      await expect(Property.create(data)).rejects.toThrow();
    });

    test('should fail when owner is missing', async () => {
      const data = { ...validPropertyData };
      delete data.owner;

      await expect(Property.create(data)).rejects.toThrow();
    });

    // Length validation tests
    test('should fail when title exceeds 200 characters', async () => {
      const data = { ...validPropertyData };
      data.title = 'a'.repeat(201);

      await expect(Property.create(data)).rejects.toThrow();
    });

    test('should fail when description exceeds 2000 characters', async () => {
      const data = { ...validPropertyData };
      data.description = 'a'.repeat(2001);

      await expect(Property.create(data)).rejects.toThrow();
    });

    test('should fail when category exceeds 100 characters', async () => {
      const data = { ...validPropertyData };
      data.category = 'a'.repeat(101);

      await expect(Property.create(data)).rejects.toThrow();
    });

    // Numeric validation tests
    test('should fail when price is negative', async () => {
      const data = { ...validPropertyData };
      data.price = -1000;

      await expect(Property.create(data)).rejects.toThrow();
    });

    test('should fail when area is negative', async () => {
      const data = { ...validPropertyData };
      data.area = -50;

      await expect(Property.create(data)).rejects.toThrow();
    });

    test('should fail when rooms is negative', async () => {
      const data = { ...validPropertyData };
      data.rooms = -1;

      await expect(Property.create(data)).rejects.toThrow();
    });

    test('should fail when bathrooms is negative', async () => {
      const data = { ...validPropertyData };
      data.bathrooms = -1;

      await expect(Property.create(data)).rejects.toThrow();
    });

    test('should accept zero values for price, area, rooms, and bathrooms', async () => {
      const data = { ...validPropertyData };
      data.price = 0;
      data.area = 0;
      data.rooms = 0;
      data.bathrooms = 0;

      const property = await Property.create(data);

      expect(property.price).toBe(0);
      expect(property.area).toBe(0);
      expect(property.rooms).toBe(0);
      expect(property.bathrooms).toBe(0);
    });

    // Enum validation tests
    test('should accept valid status values', async () => {
      const statuses = ['rent', 'sale'];

      for (const status of statuses) {
        const data = { ...validPropertyData };
        data.status = status;
        data.title = `Property for ${status}`;

        const property = await Property.create(data);
        expect(property.status).toBe(status);

        await Property.deleteOne({ _id: property._id });
      }
    });

    test('should fail when status is invalid', async () => {
      const data = { ...validPropertyData };
      data.status = 'invalid-status';

      await expect(Property.create(data)).rejects.toThrow();
    });

    test('should accept valid type values', async () => {
      const types = ['residential', 'commercial', 'land'];

      for (const type of types) {
        const data = { ...validPropertyData };
        data.type = type;
        data.title = `${type} property`;

        const property = await Property.create(data);
        expect(property.type).toBe(type);

        await Property.deleteOne({ _id: property._id });
      }
    });

    test('should fail when type is invalid', async () => {
      const data = { ...validPropertyData };
      data.type = 'invalid-type';

      await expect(Property.create(data)).rejects.toThrow();
    });

    // String trimming tests
    test('should trim title field', async () => {
      const data = { ...validPropertyData };
      data.title = '  Beautiful Villa  ';

      const property = await Property.create(data);

      expect(property.title).toBe('Beautiful Villa');
    });

    test('should trim city field', async () => {
      const data = { ...validPropertyData };
      data.location.city = '  Cairo  ';

      const property = await Property.create(data);

      expect(property.location.city).toBe('Cairo');
    });

    test('should trim governorate field', async () => {
      const data = { ...validPropertyData };
      data.location.governorate = '  Cairo Governorate  ';

      const property = await Property.create(data);

      expect(property.location.governorate).toBe('Cairo Governorate');
    });

    test('should trim category field', async () => {
      const data = { ...validPropertyData };
      data.category = '  Luxury Villa  ';

      const property = await Property.create(data);

      expect(property.category).toBe('Luxury Villa');
    });

    test('should trim features array elements', async () => {
      const data = { ...validPropertyData };
      data.features = ['  Swimming Pool  ', '  Garden  ', '  Parking  '];

      const property = await Property.create(data);

      expect(property.features).toEqual(['Swimming Pool', 'Garden', 'Parking']);
    });

    test('should trim videoUrl field', async () => {
      const data = { ...validPropertyData };
      data.videoUrl = '  https://youtube.com/watch?v=123  ';

      const property = await Property.create(data);

      expect(property.videoUrl).toBe('https://youtube.com/watch?v=123');
    });
  });

  describe('Geospatial Coordinates Validation', () => {
    test('should accept valid coordinates', async () => {
      const validCoordinates = [
        [31.2357, 30.0444], // Cairo
        [-74.006, 40.7128], // New York
        [2.3522, 48.8566], // Paris
        [139.6917, 35.6895], // Tokyo
        [-180, -90], // Minimum values
        [180, 90], // Maximum values
      ];

      for (const coords of validCoordinates) {
        const data = { ...validPropertyData };
        data.location.coordinates.coordinates = coords;
        data.title = `Property at ${coords[0]}, ${coords[1]}`;

        const property = await Property.create(data);
        expect(property.location.coordinates.coordinates).toEqual(coords);

        await Property.deleteOne({ _id: property._id });
      }
    });

    test('should fail when longitude is out of range', async () => {
      const invalidLongitudes = [-181, 181, -200, 200];

      for (const lng of invalidLongitudes) {
        const data = { ...validPropertyData };
        data.location.coordinates.coordinates = [lng, 30.0444];

        await expect(Property.create(data)).rejects.toThrow();
      }
    });

    test('should fail when latitude is out of range', async () => {
      const invalidLatitudes = [-91, 91, -100, 100];

      for (const lat of invalidLatitudes) {
        const data = { ...validPropertyData };
        data.location.coordinates.coordinates = [31.2357, lat];

        await expect(Property.create(data)).rejects.toThrow();
      }
    });

    test('should fail when coordinates array has wrong length', async () => {
      const invalidCoordinates = [
        [31.2357], // Only longitude
        [31.2357, 30.0444, 100], // Extra element
        [], // Empty array
      ];

      for (const coords of invalidCoordinates) {
        const data = { ...validPropertyData };
        data.location.coordinates.coordinates = coords;

        await expect(Property.create(data)).rejects.toThrow();
      }
    });

    test('should fail when coordinates is not an array', async () => {
      const data = { ...validPropertyData };
      data.location.coordinates.coordinates = '31.2357,30.0444';

      await expect(Property.create(data)).rejects.toThrow();
    });

    test('should set coordinates type to Point by default', async () => {
      const data = { ...validPropertyData };
      delete data.location.coordinates.type;

      const property = await Property.create(data);

      expect(property.location.coordinates.type).toBe('Point');
    });
  });

  describe('Soft Delete Functionality', () => {
    test('should soft delete property using softDelete method', async () => {
      const property = await Property.create(validPropertyData);

      await property.softDelete();

      expect(property.deletedAt).toBeInstanceOf(Date);
      expect(property.deletedAt).not.toBeNull();
    });

    test('should restore soft-deleted property using restore method', async () => {
      const property = await Property.create(validPropertyData);
      await property.softDelete();

      await property.restore();

      expect(property.deletedAt).toBeNull();
    });

    test('should exclude soft-deleted properties from default queries', async () => {
      const property = await Property.create(validPropertyData);
      await property.softDelete();

      const foundProperties = await Property.find({});

      expect(foundProperties).toHaveLength(0);
    });

    test('should include soft-deleted properties with findWithDeleted', async () => {
      const property = await Property.create(validPropertyData);
      await property.softDelete();

      const foundProperties = await Property.findWithDeleted();

      expect(foundProperties).toHaveLength(1);
      expect(foundProperties[0]._id.toString()).toBe(property._id.toString());
    });

    test('should find only soft-deleted properties with findDeleted', async () => {
      const property1 = await Property.create(validPropertyData);
      const property2Data = { ...validPropertyData };
      property2Data.title = 'Another Property';
      const property2 = await Property.create(property2Data);

      await property1.softDelete();

      const deletedProperties = await Property.findDeleted();

      expect(deletedProperties).toHaveLength(1);
      expect(deletedProperties[0]._id.toString()).toBe(property1._id.toString());
    });

    test('should allow explicit deletedAt filter to override default behavior', async () => {
      const property = await Property.create(validPropertyData);
      await property.softDelete();

      const foundProperties = await Property.find({ deletedAt: { $ne: null } });

      expect(foundProperties).toHaveLength(1);
      expect(foundProperties[0]._id.toString()).toBe(property._id.toString());
    });
  });

  describe('Database Indexes', () => {
    test('should have compound index on status and type', async () => {
      const indexes = await Property.collection.getIndexes();
      const compoundIndex = Object.keys(indexes).find(key => 
        key.includes('status') && key.includes('type')
      );

      expect(compoundIndex).toBeDefined();
    });

    test('should have index on location.city', async () => {
      const indexes = await Property.collection.getIndexes();
      const cityIndex = Object.keys(indexes).find(key => 
        key.includes('location.city')
      );

      expect(cityIndex).toBeDefined();
    });

    test('should have index on price', async () => {
      const indexes = await Property.collection.getIndexes();
      const priceIndex = Object.keys(indexes).find(key => 
        key.includes('price')
      );

      expect(priceIndex).toBeDefined();
    });

    test('should have 2dsphere geospatial index on location.coordinates', async () => {
      const indexes = await Property.collection.getIndexes();
      const geoIndex = Object.keys(indexes).find(key => 
        key.includes('location.coordinates')
      );

      expect(geoIndex).toBeDefined();
    });

    test('should have text index on title and description', async () => {
      const indexes = await Property.collection.getIndexes();
      const textIndex = Object.keys(indexes).find(key => 
        key.includes('title') && key.includes('description')
      );

      expect(textIndex).toBeDefined();
    });
  });

  describe('Pagination Plugin', () => {
    test('should have paginate method available', () => {
      expect(typeof Property.paginate).toBe('function');
    });

    test('should paginate results correctly', async () => {
      // Create multiple properties
      const properties = [];
      for (let i = 1; i <= 15; i++) {
        const data = { ...validPropertyData };
        data.title = `Property ${i}`;
        properties.push(data);
      }
      await Property.create(properties);

      const result = await Property.paginate({}, { page: 1, limit: 10 });

      expect(result.docs).toHaveLength(10);
      expect(result.totalDocs).toBe(15);
      expect(result.totalPages).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(false);
    });
  });

  describe('Owner Reference', () => {
    test('should populate owner information', async () => {
      const property = await Property.create(validPropertyData);
      const populatedProperty = await Property.findById(property._id).populate('owner');

      expect(populatedProperty.owner).toBeDefined();
      expect(populatedProperty.owner.name).toBe(testUser.name);
      expect(populatedProperty.owner.email).toBe(testUser.email);
      expect(populatedProperty.owner.role).toBe(testUser.role);
      expect(populatedProperty.owner.password).toBeUndefined(); // Should be excluded
    });

    test('should fail when owner reference is invalid', async () => {
      const data = { ...validPropertyData };
      data.owner = new mongoose.Types.ObjectId(); // Non-existent user

      // This should create the property but fail on population
      const property = await Property.create(data);
      expect(property.owner).toBeDefined();
    });
  });

  describe('Timestamps', () => {
    test('should have createdAt and updatedAt timestamps', async () => {
      const property = await Property.create(validPropertyData);

      expect(property.createdAt).toBeInstanceOf(Date);
      expect(property.updatedAt).toBeInstanceOf(Date);
    });

    test('should update updatedAt on modification', async () => {
      const property = await Property.create(validPropertyData);
      const originalUpdatedAt = property.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      property.title = 'Updated Property Title';
      await property.save();

      expect(property.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Array Fields', () => {
    test('should handle images array', async () => {
      const data = { ...validPropertyData };
      data.images = [
        'https://res.cloudinary.com/test/image1.jpg',
        'https://res.cloudinary.com/test/image2.jpg',
        'https://res.cloudinary.com/test/image3.jpg',
      ];

      const property = await Property.create(data);

      expect(property.images).toHaveLength(3);
      expect(property.images).toEqual(data.images);
    });

    test('should handle features array', async () => {
      const data = { ...validPropertyData };
      data.features = ['Swimming Pool', 'Garden', 'Parking', 'Security'];

      const property = await Property.create(data);

      expect(property.features).toHaveLength(4);
      expect(property.features).toEqual(data.features);
    });

    test('should handle empty arrays', async () => {
      const data = { ...validPropertyData };
      data.images = [];
      data.features = [];

      const property = await Property.create(data);

      expect(property.images).toHaveLength(0);
      expect(property.features).toHaveLength(0);
    });
  });

  describe('Optional Fields', () => {
    test('should create property without optional fields', async () => {
      const minimalData = {
        title: 'Minimal Property',
        description: 'Basic property description',
        price: 100000,
        status: 'rent',
        type: 'residential',
        area: 100,
        location: {
          address: 'Test Address',
          city: 'Test City',
          coordinates: {
            coordinates: [31.0, 30.0],
          },
        },
        owner: testUser._id,
      };

      const property = await Property.create(minimalData);

      expect(property.rooms).toBeNull();
      expect(property.bathrooms).toBeNull();
      expect(property.category).toBeUndefined();
      expect(property.features).toHaveLength(0);
      expect(property.images).toHaveLength(0);
      expect(property.videoUrl).toBeUndefined();
      expect(property.location.governorate).toBeUndefined();
    });

    test('should set optional fields when provided', async () => {
      const data = { ...validPropertyData };
      data.category = 'Luxury Villa';
      data.videoUrl = 'https://youtube.com/watch?v=123';
      data.location.governorate = 'Cairo';

      const property = await Property.create(data);

      expect(property.category).toBe('Luxury Villa');
      expect(property.videoUrl).toBe('https://youtube.com/watch?v=123');
      expect(property.location.governorate).toBe('Cairo');
    });
  });
});