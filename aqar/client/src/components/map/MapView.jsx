import { useCallback, useEffect, useState, useRef } from 'react';
import { GoogleMap, useJsApiLoader, MarkerClusterer } from '@react-google-maps/api';
import MapMarker from './MapMarker';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// Default center: Cairo, Egypt
const defaultCenter = {
  lat: 30.0444,
  lng: 31.2357,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

// Cluster options
const clusterOptions = {
  imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
  gridSize: 60,
  maxZoom: 15,
  styles: [
    {
      textColor: 'white',
      url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMxYjVlMjAiLz48L3N2Zz4=',
      height: 40,
      width: 40,
      textSize: 14,
    },
    {
      textColor: 'white',
      url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiMxYjVlMjAiLz48L3N2Zz4=',
      height: 50,
      width: 50,
      textSize: 15,
    },
    {
      textColor: 'white',
      url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiMxYjVlMjAiLz48L3N2Zz4=',
      height: 60,
      width: 60,
      textSize: 16,
    },
  ],
};

/**
 * MapView Component
 * Displays properties on Google Maps with interactive markers
 * Handles map bounds changes to filter properties by visible area
 * 
 * @param {Array} properties - Array of property objects with location.coordinates
 * @param {Function} onBoundsChange - Callback when map bounds change
 * @param {Function} onMarkerClick - Callback when a marker is clicked
 * @param {Object} initialCenter - Initial map center (optional)
 * @param {Number} initialZoom - Initial zoom level (optional, default: 12)
 */
const MapView = ({ 
  properties = [], 
  onBoundsChange, 
  onMarkerClick,
  initialCenter,
  initialZoom = 12 
}) => {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(initialCenter || defaultCenter);
  const [userLocation, setUserLocation] = useState(null);
  const clustererRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // Get user's geolocation on mount
  useEffect(() => {
    if (navigator.geolocation && !initialCenter) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
          setCenter(userPos);
        },
        (error) => {
          console.log('Geolocation error:', error.message);
          // Keep default center (Cairo)
        }
      );
    }
  }, [initialCenter]);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Handle map idle event (after pan/zoom)
  const handleIdle = useCallback(() => {
    if (map && onBoundsChange) {
      const bounds = map.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        
        // Emit bounds in format: lat1,lng1,lat2,lng2
        const boundsString = `${sw.lat()},${sw.lng()},${ne.lat()},${ne.lng()}`;
        onBoundsChange(boundsString);
      }
    }
  }, [map, onBoundsChange]);

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center p-6">
          <span className="material-symbols-outlined text-red-500 text-5xl mb-2">error</span>
          <p className="text-gray-700">Error loading maps</p>
          <p className="text-sm text-gray-500 mt-2">Please check your API key</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={initialZoom}
      options={mapOptions}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onIdle={handleIdle}
    >
      {/* Render property markers with clustering */}
      <MarkerClusterer options={clusterOptions}>
        {(clusterer) => (
          <>
            {properties.map((property) => {
              if (property.location?.coordinates?.lat && property.location?.coordinates?.lng) {
                return (
                  <MapMarker
                    key={property._id}
                    property={property}
                    onClick={() => onMarkerClick && onMarkerClick(property._id)}
                    clusterer={clusterer}
                  />
                );
              }
              return null;
            })}
          </>
        )}
      </MarkerClusterer>
    </GoogleMap>
  );
};

export default MapView;
