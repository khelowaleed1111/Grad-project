/**
 * API Features class for filtering, sorting, and paginating MongoDB queries
 * Provides advanced filtering capabilities for the Aqar real estate platform
 */
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * Advanced filter results based on query parameters
   * Supports: status, type, city, governorate, price range, rooms, area range, category, features
   */
  filter() {
    const queryObj = { ...this.queryString };
    
    // Fields to exclude from filtering
    const excludeFields = ['page', 'sort', 'limit', 'fields', 'keyword', 'bounds', 'near'];
    excludeFields.forEach((field) => delete queryObj[field]);

    // Handle price range filtering
    if (queryObj.minPrice || queryObj.maxPrice) {
      queryObj.price = {};
      if (queryObj.minPrice) {
        const minPrice = Number(queryObj.minPrice);
        if (!isNaN(minPrice) && minPrice >= 0) {
          queryObj.price.$gte = minPrice;
        }
      }
      if (queryObj.maxPrice) {
        const maxPrice = Number(queryObj.maxPrice);
        if (!isNaN(maxPrice) && maxPrice >= 0) {
          queryObj.price.$lte = maxPrice;
        }
      }
      delete queryObj.minPrice;
      delete queryObj.maxPrice;
    }

    // Handle area range filtering
    if (queryObj.minArea || queryObj.maxArea) {
      queryObj.area = {};
      if (queryObj.minArea) {
        const minArea = Number(queryObj.minArea);
        if (!isNaN(minArea) && minArea >= 0) {
          queryObj.area.$gte = minArea;
        }
      }
      if (queryObj.maxArea) {
        const maxArea = Number(queryObj.maxArea);
        if (!isNaN(maxArea) && maxArea >= 0) {
          queryObj.area.$lte = maxArea;
        }
      }
      delete queryObj.minArea;
      delete queryObj.maxArea;
    }

    // Handle rooms filtering (exact match or range)
    if (queryObj.minRooms || queryObj.maxRooms) {
      queryObj.rooms = {};
      if (queryObj.minRooms) {
        const minRooms = Number(queryObj.minRooms);
        if (!isNaN(minRooms) && minRooms >= 0) {
          queryObj.rooms.$gte = minRooms;
        }
      }
      if (queryObj.maxRooms) {
        const maxRooms = Number(queryObj.maxRooms);
        if (!isNaN(maxRooms) && maxRooms >= 0) {
          queryObj.rooms.$lte = maxRooms;
        }
      }
      delete queryObj.minRooms;
      delete queryObj.maxRooms;
    } else if (queryObj.rooms) {
      const rooms = Number(queryObj.rooms);
      if (!isNaN(rooms) && rooms >= 0) {
        queryObj.rooms = rooms;
      } else {
        delete queryObj.rooms;
      }
    }

    // Handle bathrooms filtering
    if (queryObj.bathrooms) {
      const bathrooms = Number(queryObj.bathrooms);
      if (!isNaN(bathrooms) && bathrooms >= 0) {
        queryObj.bathrooms = bathrooms;
      } else {
        delete queryObj.bathrooms;
      }
    }

    // Handle city filtering (case-insensitive)
    if (queryObj.city) {
      queryObj['location.city'] = { $regex: queryObj.city, $options: 'i' };
      delete queryObj.city;
    }

    // Handle governorate filtering (case-insensitive)
    if (queryObj.governorate) {
      queryObj['location.governorate'] = { $regex: queryObj.governorate, $options: 'i' };
      delete queryObj.governorate;
    }

    // Handle features filtering (array contains)
    if (queryObj.features) {
      const features = Array.isArray(queryObj.features) ? queryObj.features : [queryObj.features];
      queryObj.features = { $in: features };
    }

    // Handle category filtering
    if (queryObj.category) {
      queryObj.category = { $regex: queryObj.category, $options: 'i' };
    }

    // Handle isFeatured filtering
    if (queryObj.isFeatured !== undefined) {
      queryObj.isFeatured = queryObj.isFeatured === 'true';
    }

    this.query = this.query.find(queryObj);
    return this;
  }

  /**
   * Enhanced search by keyword in multiple fields
   * Searches: title, description, city, address, category, features
   */
  search() {
    if (this.queryString.keyword) {
      const keyword = this.queryString.keyword.trim();
      if (keyword) {
        // Use MongoDB text search if available, otherwise use regex
        this.query = this.query.find({
          $or: [
            { title: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
            { 'location.city': { $regex: keyword, $options: 'i' } },
            { 'location.address': { $regex: keyword, $options: 'i' } },
            { 'location.governorate': { $regex: keyword, $options: 'i' } },
            { category: { $regex: keyword, $options: 'i' } },
            { features: { $regex: keyword, $options: 'i' } },
          ],
        });
      }
    }
    return this;
  }

  /**
   * Filter by map bounds using proper geospatial query
   * Uses MongoDB $geoWithin operator with 2dsphere index
   */
  geoFilter() {
    if (this.queryString.bounds) {
      try {
        const bounds = this.queryString.bounds.split(',').map(Number);
        
        if (bounds.length === 4) {
          const [lat1, lng1, lat2, lng2] = bounds;
          
          // Validate coordinates
          const isValidLat = (lat) => lat >= -90 && lat <= 90;
          const isValidLng = (lng) => lng >= -180 && lng <= 180;
          
          if (isValidLat(lat1) && isValidLat(lat2) && isValidLng(lng1) && isValidLng(lng2)) {
            // Create bounding box for $geoWithin query
            // MongoDB expects [longitude, latitude] format
            const minLng = Math.min(lng1, lng2);
            const maxLng = Math.max(lng1, lng2);
            const minLat = Math.min(lat1, lat2);
            const maxLat = Math.max(lat1, lat2);
            
            this.query = this.query.find({
              'location.coordinates': {
                $geoWithin: {
                  $box: [
                    [minLng, minLat], // bottom-left corner
                    [maxLng, maxLat]  // top-right corner
                  ]
                }
              }
            });
          }
        }
      } catch (error) {
        // Invalid bounds format, skip geospatial filtering
        console.warn('Invalid bounds format:', this.queryString.bounds);
      }
    }
    return this;
  }

  /**
   * Find properties near a specific location
   * Uses $near operator for proximity search
   */
  nearLocation() {
    if (this.queryString.near) {
      try {
        const [lat, lng, maxDistance] = this.queryString.near.split(',').map(Number);
        
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          const query = {
            'location.coordinates': {
              $near: {
                $geometry: {
                  type: 'Point',
                  coordinates: [lng, lat] // [longitude, latitude]
                }
              }
            }
          };
          
          // Add max distance if provided (in meters)
          if (maxDistance && maxDistance > 0) {
            query['location.coordinates'].$near.$maxDistance = maxDistance;
          }
          
          this.query = this.query.find(query);
        }
      } catch (error) {
        console.warn('Invalid near location format:', this.queryString.near);
      }
    }
    return this;
  }

  /**
   * Enhanced sorting with multiple options
   * Supports: price_asc, price_desc, newest, oldest, area_asc, area_desc, views_desc, popularity
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort
        .split(',')
        .map((field) => {
          switch (field.toLowerCase()) {
            case 'price_asc':
            case 'price-asc':
              return 'price';
            case 'price_desc':
            case 'price-desc':
              return '-price';
            case 'newest':
            case 'date_desc':
              return '-createdAt';
            case 'oldest':
            case 'date_asc':
              return 'createdAt';
            case 'area_asc':
            case 'area-asc':
              return 'area';
            case 'area_desc':
            case 'area-desc':
              return '-area';
            case 'views_desc':
            case 'views-desc':
            case 'popularity':
              return '-views';
            case 'views_asc':
            case 'views-asc':
              return 'views';
            case 'featured':
              return '-isFeatured -createdAt';
            default:
              return field;
          }
        })
        .join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // Default sort: featured first, then newest
      this.query = this.query.sort('-isFeatured -createdAt');
    }
    return this;
  }

  /**
   * Limit fields returned in the response
   * Optimizes performance by reducing data transfer
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // Exclude version field by default
      this.query = this.query.select('-__v');
    }
    return this;
  }

  /**
   * Paginate results with performance optimization
   * Default: 12 items per page (optimized for property grid display)
   */
  paginate() {
    const page = Math.max(1, parseInt(this.queryString.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(this.queryString.limit, 10) || 12)); // Max 50 items per page
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    
    // Store pagination info for later use
    this.paginationInfo = { page, limit, skip };
    
    return this;
  }

  /**
   * Get the current query object for debugging
   */
  getQuery() {
    return this.query.getQuery();
  }

  /**
   * Get pagination information
   */
  getPaginationInfo() {
    return this.paginationInfo || { page: 1, limit: 12, skip: 0 };
  }

  /**
   * Chain all filtering methods for convenience
   */
  applyAll() {
    return this.filter()
      .search()
      .geoFilter()
      .nearLocation()
      .sort()
      .limitFields()
      .paginate();
  }
}

module.exports = APIFeatures;
