# Map Components Usage Guide

## Overview
This directory contains Google Maps integration components for the Aqar Real Estate Platform.

## Components

### 1. MapView
Main map component for displaying properties with interactive markers.

**Props:**
- `properties` (Array): Array of property objects with `location.coordinates.lat` and `location.coordinates.lng`
- `onBoundsChange` (Function): Callback when map bounds change, receives bounds string `"lat1,lng1,lat2,lng2"`
- `onMarkerClick` (Function): Callback when a marker is clicked, receives `propertyId`
- `initialCenter` (Object, optional): Initial map center `{ lat, lng }`
- `initialZoom` (Number, optional): Initial zoom level (default: 12)

**Example Usage:**
```jsx
import { MapView } from '../components/map';
import { useState } from 'react';

function SearchPage() {
  const [properties, setProperties] = useState([]);
  const [bounds, setBounds] = useState(null);

  const handleBoundsChange = (boundsString) => {
    setBounds(boundsString);
    // Fetch properties within bounds
    fetchProperties({ bounds: boundsString });
  };

  const handleMarkerClick = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };

  return (
    <div style={{ height: '600px' }}>
      <MapView
        properties={properties}
        onBoundsChange={handleBoundsChange}
        onMarkerClick={handleMarkerClick}
      />
    </div>
  );
}
```

---

### 2. MapMarker
Individual property marker with InfoWindow popup (used internally by MapView).

**Props:**
- `property` (Object): Property object with location, title, price, images, etc.
- `onClick` (Function): Callback when marker is clicked
- `clusterer` (Object): MarkerClusterer instance (provided by MapView)

**Note:** This component is typically not used directly. MapView handles marker rendering.

---

### 3. LocationPicker
Interactive map for selecting property location in forms.

**Props:**
- `value` (Object): Current location `{ lat, lng }`
- `onChange` (Function): Callback when location changes, receives `{ lat, lng }`
- `error` (String, optional): Error message to display

**Example Usage with React Hook Form:**
```jsx
import { LocationPicker } from '../components/map';
import { useForm } from 'react-hook-form';

function AddPropertyForm() {
  const { register, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      lat: 30.0444,
      lng: 31.2357,
    }
  });

  const location = {
    lat: watch('lat'),
    lng: watch('lng'),
  };

  const handleLocationChange = (coords) => {
    setValue('lat', coords.lat);
    setValue('lng', coords.lng);
  };

  return (
    <form>
      {/* Other form fields */}
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Property Location
        </label>
        <LocationPicker
          value={location}
          onChange={handleLocationChange}
          error={errors.location?.message}
        />
      </div>

      {/* Hidden inputs for form submission */}
      <input type="hidden" {...register('lat')} />
      <input type="hidden" {...register('lng')} />
    </form>
  );
}
```

**Example Usage with Plain State:**
```jsx
import { LocationPicker } from '../components/map';
import { useState } from 'react';

function SimpleForm() {
  const [location, setLocation] = useState({
    lat: 30.0444,
    lng: 31.2357,
  });

  return (
    <div>
      <LocationPicker
        value={location}
        onChange={setLocation}
      />
      
      <p>Selected: {location.lat}, {location.lng}</p>
    </div>
  );
}
```

---

## Environment Setup

**Required:** Add Google Maps API key to `.env` file:
```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

**Get API Key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Maps JavaScript API"
4. Create credentials (API Key)
5. Restrict key to your domain (optional but recommended)

---

## Property Data Format

Properties must have the following structure for map components:

```javascript
{
  _id: "property123",
  title: "Luxury Villa in New Cairo",
  price: 5000000,
  status: "sale", // or "rent"
  type: "residential", // or "commercial", "land"
  rooms: 4,
  bathrooms: 3,
  area: 350,
  images: [
    "https://res.cloudinary.com/...",
    "https://res.cloudinary.com/..."
  ],
  location: {
    address: "123 Main Street",
    city: "New Cairo",
    country: "Egypt",
    coordinates: {
      lat: 30.0444,
      lng: 31.2357
    }
  }
}
```

---

## Styling

All components use Tailwind CSS and follow the Aqar design system:
- Primary green: `#1b5e20`
- Gold accent: `#fcab28`
- Material Symbols Outlined icons

Components are fully responsive and mobile-friendly.

---

## Troubleshooting

### Map not loading
- Check that `VITE_GOOGLE_MAPS_API_KEY` is set in `.env`
- Verify API key is valid and has Maps JavaScript API enabled
- Check browser console for API errors

### Geolocation not working
- Ensure HTTPS (geolocation requires secure context)
- User must grant location permission
- Falls back to Cairo if permission denied

### Markers not appearing
- Verify properties have `location.coordinates.lat` and `location.coordinates.lng`
- Check that coordinates are valid numbers (lat: -90 to 90, lng: -180 to 180)
- Ensure properties array is not empty

### Clustering not working
- Clustering only activates with multiple nearby markers
- Try zooming out to see clusters form
- Check that `@googlemaps/markerclusterer` is installed

---

## Performance Tips

1. **Limit Properties:** Only pass visible properties to MapView
2. **Debounce Bounds:** Debounce `onBoundsChange` callback to reduce API calls
3. **Lazy Load:** Load map components only when needed (React.lazy)
4. **Optimize Images:** Use Cloudinary transformations for marker InfoWindow images

Example debouncing:
```jsx
import { useMemo } from 'react';
import { debounce } from 'lodash';

const debouncedBoundsChange = useMemo(
  () => debounce((bounds) => {
    fetchProperties({ bounds });
  }, 500),
  []
);

<MapView onBoundsChange={debouncedBoundsChange} />
```

---

## Accessibility

- All interactive elements are keyboard accessible
- ARIA labels provided for screen readers
- Focus indicators visible on all controls
- Error messages announced to screen readers

---

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Touch-optimized

---

## License

Part of the Aqar Real Estate Platform. All rights reserved.
