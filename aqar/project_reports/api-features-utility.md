# APIFeatures Utility Documentation

## Overview

The `APIFeatures` utility class provides advanced filtering, searching, sorting, and pagination capabilities for the Aqar real estate platform. It's designed to work with MongoDB queries through Mongoose, offering a fluent interface for building complex property search queries.

## Features

- **Advanced Filtering**: Price ranges, area ranges, rooms, property type, status, location, and more
- **Text Search**: Multi-field keyword search across title, description, location, and features
- **Geospatial Queries**: Map bounds filtering and proximity search using MongoDB's geospatial operators
- **Flexible Sorting**: Multiple sorting options including price, date, area, views, and popularity
- **Performance Optimization**: Efficient pagination with configurable limits and field selection
- **MongoDB Integration**: Proper use of MongoDB operators like `$geoWithin`, `$near`, and `$regex`

## Installation

The utility is already included in the project at `utils/apiFeatures.js`. No additional installation required.

## Basic Usage

```javascript
const APIFeatures = require('../utils/apiFeatures');
const Property = require('../models/Property');

// Basic usage in a controller
const getProperties = async (req, res) => {
  const baseQuery = Property.find({ isApproved: true });
  
  const features = new APIFeatures(baseQuery, req.query)
    .filter()
    .search()
    .geoFilter()
    .sort()
    .paginate();
    
  const properties = await features.query;
  
  res.json({
    success: true,
    data: properties
  });
};
```

## API Reference

### Constructor

```javascript
new APIFeatures(query, queryString)
```

- `query`: Mongoose query object
- `queryString`: Request query parameters (typically `req.query`)

### Methods

#### `filter()`

Applies advanced filtering based on query parameters.

**Supported Filters:**
- `status`: 'rent' or 'sale'
- `type`: 'residential', 'commercial', or 'land'
- `city`: Case-insensitive city name
- `governorate`: Case-insensitive governorate name
- `minPrice`, `maxPrice`: Price range filtering
- `minArea`, `maxArea`: Area range filtering
- `rooms`: Exact room count or range with `minRooms`, `maxRooms`
- `bathrooms`: Exact bathroom count
- `features`: Array of features to match
- `category`: Property category (case-insensitive)
- `isFeatured`: Boolean for featured properties

**Example:**
```javascript
// URL: /api/properties?status=rent&type=residential&minPrice=100000&maxPrice=500000&city=Cairo&rooms=3
features.filter();
```

#### `search()`

Performs keyword search across multiple fields.

**Searched Fields:**
- `title`
- `description`
- `location.city`
- `location.address`
- `location.governorate`
- `category`
- `features`

**Example:**
```javascript
// URL: /api/properties?keyword=modern villa garden
features.search();
```

#### `geoFilter()`

Filters properties within map bounds using MongoDB's geospatial operators.

**Parameters:**
- `bounds`: Comma-separated coordinates as `lat1,lng1,lat2,lng2`

**Example:**
```javascript
// URL: /api/properties?bounds=30.0,31.0,30.1,31.1
features.geoFilter();
```

#### `nearLocation()`

Finds properties near a specific location using proximity search.

**Parameters:**
- `near`: Comma-separated as `lat,lng,maxDistance` (distance in meters)

**Example:**
```javascript
// URL: /api/properties?near=30.0644,31.2497,5000
features.nearLocation();
```

#### `sort()`

Sorts results by various criteria.

**Supported Sort Options:**
- `price_asc`, `price-asc`: Price ascending
- `price_desc`, `price-desc`: Price descending
- `newest`, `date_desc`: Newest first
- `oldest`, `date_asc`: Oldest first
- `area_asc`, `area-asc`: Area ascending
- `area_desc`, `area-desc`: Area descending
- `views_desc`, `views-desc`, `popularity`: Most viewed first
- `featured`: Featured properties first

**Default:** Featured properties first, then newest

**Example:**
```javascript
// URL: /api/properties?sort=price_asc,newest
features.sort();
```

#### `limitFields()`

Selects specific fields to return, optimizing performance.

**Example:**
```javascript
// URL: /api/properties?fields=title,price,location,images
features.limitFields();
```

#### `paginate()`

Implements pagination with configurable page size.

**Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12, max: 50)

**Example:**
```javascript
// URL: /api/properties?page=2&limit=20
features.paginate();
```

#### `applyAll()`

Convenience method that chains all filtering methods.

```javascript
features.applyAll();
// Equivalent to:
// features.filter().search().geoFilter().nearLocation().sort().limitFields().paginate();
```

#### `getQuery()`

Returns the current MongoDB query object for debugging.

```javascript
const queryObj = features.getQuery();
console.log('Current query:', queryObj);
```

#### `getPaginationInfo()`

Returns pagination information.

```javascript
const paginationInfo = features.getPaginationInfo();
// Returns: { page: 2, limit: 12, skip: 12 }
```

## Usage Examples

### Example 1: Property Search with Filters

```javascript
// Find rental apartments in Cairo, 2-3 bedrooms, under 400K EGP
// URL: /api/properties?status=rent&type=residential&city=Cairo&minRooms=2&maxRooms=3&maxPrice=400000&sort=price_asc

const features = new APIFeatures(Property.find({ isApproved: true }), req.query)
  .filter()
  .sort()
  .paginate();

const properties = await features.query;
```

### Example 2: Map-Based Search

```javascript
// Find properties within map bounds
// URL: /api/properties?bounds=30.0,31.0,30.1,31.1&type=residential

const features = new APIFeatures(Property.find({ isApproved: true }), req.query)
  .filter()
  .geoFilter()
  .sort()
  .paginate();

const properties = await features.query;
```

### Example 3: Keyword Search with Proximity

```javascript
// Search for "modern villa" near downtown Cairo (5km radius)
// URL: /api/properties?keyword=modern villa&near=30.0644,31.2497,5000&sort=newest

const features = new APIFeatures(Property.find({ isApproved: true }), req.query)
  .search()
  .nearLocation()
  .sort()
  .paginate();

const properties = await features.query;
```

### Example 4: Advanced Filtering with Features

```javascript
// Find commercial properties with parking and security, sorted by area
// URL: /api/properties?type=commercial&features=parking,security&minArea=100&sort=area_desc

const features = new APIFeatures(Property.find({ isApproved: true }), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();

const properties = await features.query;
```

## Performance Considerations

### Database Indexes

Ensure the following indexes are created for optimal performance:

```javascript
// In Property model
propertySchema.index({ status: 1, type: 1 });
propertySchema.index({ 'location.city': 1 });
propertySchema.index({ 'location.governorate': 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ rooms: 1 });
propertySchema.index({ area: 1 });
propertySchema.index({ isApproved: 1 });
propertySchema.index({ createdAt: -1 });
propertySchema.index({ views: -1 });
propertySchema.index({ isFeatured: -1 });
propertySchema.index({ 'location.coordinates': '2dsphere' });
propertySchema.index({ title: 'text', description: 'text' });
```

### Query Optimization

1. **Pagination Limits**: Maximum 50 items per page to prevent performance issues
2. **Field Selection**: Use `limitFields()` to reduce data transfer
3. **Geospatial Queries**: Properly indexed for fast map-based searches
4. **Text Search**: Uses regex for flexibility, consider MongoDB text search for large datasets

## Error Handling

The utility includes built-in error handling for:

- Invalid coordinate formats
- Invalid numeric values
- Malformed query parameters
- Out-of-range values

Invalid parameters are silently ignored to maintain query functionality.

## Integration with Controllers

### Complete Controller Example

```javascript
const getProperties = asyncHandler(async (req, res) => {
  // Build base query - only approved properties
  const baseQuery = Property.find({ isApproved: true })
    .populate('owner', 'name phone avatar role');

  // Apply all filters and features
  const features = new APIFeatures(baseQuery, req.query).applyAll();
  const properties = await features.query;

  // Get total count for pagination
  const totalQuery = Property.find({ isApproved: true });
  const totalFeatures = new APIFeatures(totalQuery, req.query)
    .filter()
    .search()
    .geoFilter()
    .nearLocation();
  const total = await Property.countDocuments(totalFeatures.query.getQuery());

  // Calculate pagination info
  const paginationInfo = features.getPaginationInfo();
  const totalPages = Math.ceil(total / paginationInfo.limit);

  res.json({
    success: true,
    count: properties.length,
    total,
    pagination: {
      ...paginationInfo,
      totalPages,
      hasNext: paginationInfo.page < totalPages,
      hasPrev: paginationInfo.page > 1,
    },
    data: properties,
  });
});
```

## Testing

Run the test suite to verify functionality:

```bash
npm test utils/apiFeatures.test.js
```

Or use the manual test script:

```bash
node test-api-features.js
```

## Requirements Validation

This utility satisfies the following requirements:

- **REQ-6**: Property Search and Filtering
- **REQ-7**: Geospatial Map Filtering  
- **REQ-17**: Database Performance Optimization

The implementation provides comprehensive filtering, search, and pagination capabilities while maintaining optimal performance through proper MongoDB query construction and indexing strategies.