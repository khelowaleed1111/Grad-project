const APIFeatures = require('./apiFeatures');

// Mock Mongoose query object
class MockQuery {
  constructor() {
    this.queryObj = {};
    this.sortObj = {};
    this.selectObj = '';
    this.skipValue = 0;
    this.limitValue = 0;
  }

  find(query) {
    this.queryObj = { ...this.queryObj, ...query };
    return this;
  }

  sort(sortStr) {
    this.sortObj = sortStr;
    return this;
  }

  select(fields) {
    this.selectObj = fields;
    return this;
  }

  skip(num) {
    this.skipValue = num;
    return this;
  }

  limit(num) {
    this.limitValue = num;
    return this;
  }

  getQuery() {
    return this.queryObj;
  }
}

describe('APIFeatures', () => {
  let mockQuery;
  let apiFeatures;

  beforeEach(() => {
    mockQuery = new MockQuery();
  });

  describe('filter()', () => {
    test('should filter by status and type', () => {
      const queryString = { status: 'rent', type: 'residential' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.filter();
      
      expect(mockQuery.queryObj.status).toBe('rent');
      expect(mockQuery.queryObj.type).toBe('residential');
    });

    test('should handle price range filtering', () => {
      const queryString = { minPrice: '100000', maxPrice: '500000' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.filter();
      
      expect(mockQuery.queryObj.price).toEqual({
        $gte: 100000,
        $lte: 500000
      });
      expect(mockQuery.queryObj.minPrice).toBeUndefined();
      expect(mockQuery.queryObj.maxPrice).toBeUndefined();
    });

    test('should handle area range filtering', () => {
      const queryString = { minArea: '50', maxArea: '200' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.filter();
      
      expect(mockQuery.queryObj.area).toEqual({
        $gte: 50,
        $lte: 200
      });
    });

    test('should handle rooms filtering', () => {
      const queryString = { rooms: '3' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.filter();
      
      expect(mockQuery.queryObj.rooms).toBe(3);
    });

    test('should handle rooms range filtering', () => {
      const queryString = { minRooms: '2', maxRooms: '4' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.filter();
      
      expect(mockQuery.queryObj.rooms).toEqual({
        $gte: 2,
        $lte: 4
      });
    });

    test('should handle city filtering with case insensitive regex', () => {
      const queryString = { city: 'Cairo' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.filter();
      
      expect(mockQuery.queryObj['location.city']).toEqual({
        $regex: 'Cairo',
        $options: 'i'
      });
    });

    test('should handle features filtering', () => {
      const queryString = { features: ['parking', 'garden'] };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.filter();
      
      expect(mockQuery.queryObj.features).toEqual({
        $in: ['parking', 'garden']
      });
    });

    test('should exclude pagination and search fields from filtering', () => {
      const queryString = {
        status: 'rent',
        page: '2',
        limit: '10',
        keyword: 'villa',
        bounds: '30.0,31.0,30.1,31.1'
      };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.filter();
      
      expect(mockQuery.queryObj.status).toBe('rent');
      expect(mockQuery.queryObj.page).toBeUndefined();
      expect(mockQuery.queryObj.limit).toBeUndefined();
      expect(mockQuery.queryObj.keyword).toBeUndefined();
      expect(mockQuery.queryObj.bounds).toBeUndefined();
    });
  });

  describe('search()', () => {
    test('should search by keyword in multiple fields', () => {
      const queryString = { keyword: 'villa' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.search();
      
      expect(mockQuery.queryObj.$or).toBeDefined();
      expect(mockQuery.queryObj.$or).toHaveLength(7);
      expect(mockQuery.queryObj.$or[0]).toEqual({
        title: { $regex: 'villa', $options: 'i' }
      });
    });

    test('should not add search query if keyword is empty', () => {
      const queryString = { keyword: '' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.search();
      
      expect(mockQuery.queryObj.$or).toBeUndefined();
    });

    test('should trim keyword before searching', () => {
      const queryString = { keyword: '  villa  ' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.search();
      
      expect(mockQuery.queryObj.$or[0]).toEqual({
        title: { $regex: 'villa', $options: 'i' }
      });
    });
  });

  describe('geoFilter()', () => {
    test('should create geospatial query with valid bounds', () => {
      const queryString = { bounds: '30.0,31.0,30.1,31.1' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.geoFilter();
      
      expect(mockQuery.queryObj['location.coordinates']).toBeDefined();
      expect(mockQuery.queryObj['location.coordinates'].$geoWithin).toBeDefined();
      expect(mockQuery.queryObj['location.coordinates'].$geoWithin.$box).toEqual([
        [31.0, 30.0], // [minLng, minLat]
        [31.1, 30.1]  // [maxLng, maxLat]
      ]);
    });

    test('should handle invalid bounds gracefully', () => {
      const queryString = { bounds: 'invalid' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.geoFilter();
      
      expect(mockQuery.queryObj['location.coordinates']).toBeUndefined();
    });

    test('should handle bounds with invalid coordinates', () => {
      const queryString = { bounds: '200,300,400,500' }; // Invalid lat/lng values
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.geoFilter();
      
      expect(mockQuery.queryObj['location.coordinates']).toBeUndefined();
    });
  });

  describe('nearLocation()', () => {
    test('should create near location query', () => {
      const queryString = { near: '30.0644,31.2497,5000' }; // Cairo coordinates with 5km radius
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.nearLocation();
      
      expect(mockQuery.queryObj['location.coordinates']).toBeDefined();
      expect(mockQuery.queryObj['location.coordinates'].$near).toEqual({
        $geometry: {
          type: 'Point',
          coordinates: [31.2497, 30.0644] // [lng, lat]
        },
        $maxDistance: 5000
      });
    });

    test('should create near location query without max distance', () => {
      const queryString = { near: '30.0644,31.2497' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.nearLocation();
      
      expect(mockQuery.queryObj['location.coordinates'].$near.$maxDistance).toBeUndefined();
    });
  });

  describe('sort()', () => {
    test('should sort by price ascending', () => {
      const queryString = { sort: 'price_asc' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.sort();
      
      expect(mockQuery.sortObj).toBe('price');
    });

    test('should sort by price descending', () => {
      const queryString = { sort: 'price_desc' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.sort();
      
      expect(mockQuery.sortObj).toBe('-price');
    });

    test('should sort by newest first', () => {
      const queryString = { sort: 'newest' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.sort();
      
      expect(mockQuery.sortObj).toBe('-createdAt');
    });

    test('should sort by area descending', () => {
      const queryString = { sort: 'area_desc' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.sort();
      
      expect(mockQuery.sortObj).toBe('-area');
    });

    test('should sort by popularity (views)', () => {
      const queryString = { sort: 'popularity' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.sort();
      
      expect(mockQuery.sortObj).toBe('-views');
    });

    test('should use default sort when no sort specified', () => {
      const queryString = {};
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.sort();
      
      expect(mockQuery.sortObj).toBe('-isFeatured -createdAt');
    });

    test('should handle multiple sort fields', () => {
      const queryString = { sort: 'price_asc,newest' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.sort();
      
      expect(mockQuery.sortObj).toBe('price -createdAt');
    });
  });

  describe('limitFields()', () => {
    test('should select specific fields', () => {
      const queryString = { fields: 'title,price,location' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.limitFields();
      
      expect(mockQuery.selectObj).toBe('title price location');
    });

    test('should exclude __v by default', () => {
      const queryString = {};
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.limitFields();
      
      expect(mockQuery.selectObj).toBe('-__v');
    });
  });

  describe('paginate()', () => {
    test('should paginate with default values', () => {
      const queryString = {};
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.paginate();
      
      expect(mockQuery.skipValue).toBe(0);
      expect(mockQuery.limitValue).toBe(12);
    });

    test('should paginate with custom page and limit', () => {
      const queryString = { page: '3', limit: '20' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.paginate();
      
      expect(mockQuery.skipValue).toBe(40); // (3-1) * 20
      expect(mockQuery.limitValue).toBe(20);
    });

    test('should enforce maximum limit of 50', () => {
      const queryString = { limit: '100' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.paginate();
      
      expect(mockQuery.limitValue).toBe(50);
    });

    test('should enforce minimum page of 1', () => {
      const queryString = { page: '0' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.paginate();
      
      expect(mockQuery.skipValue).toBe(0);
    });

    test('should store pagination info', () => {
      const queryString = { page: '2', limit: '15' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.paginate();
      
      const paginationInfo = apiFeatures.getPaginationInfo();
      expect(paginationInfo).toEqual({
        page: 2,
        limit: 15,
        skip: 15
      });
    });
  });

  describe('applyAll()', () => {
    test('should chain all methods', () => {
      const queryString = {
        status: 'rent',
        keyword: 'villa',
        bounds: '30.0,31.0,30.1,31.1',
        sort: 'price_asc',
        page: '2',
        limit: '10'
      };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.applyAll();
      
      expect(mockQuery.queryObj.status).toBe('rent');
      expect(mockQuery.queryObj.$or).toBeDefined();
      expect(mockQuery.queryObj['location.coordinates']).toBeDefined();
      expect(mockQuery.sortObj).toBe('price');
      expect(mockQuery.skipValue).toBe(10);
      expect(mockQuery.limitValue).toBe(10);
    });
  });

  describe('getQuery()', () => {
    test('should return the current query object', () => {
      const queryString = { status: 'rent', type: 'residential' };
      apiFeatures = new APIFeatures(mockQuery, queryString);
      
      apiFeatures.filter();
      const query = apiFeatures.getQuery();
      
      expect(query.status).toBe('rent');
      expect(query.type).toBe('residential');
    });
  });
});