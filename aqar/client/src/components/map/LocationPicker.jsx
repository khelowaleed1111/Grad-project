import { useCallback, useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
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

/**
 * LocationPicker Component
 * Allows users to select a location by clicking or dragging a marker on the map
 * Returns latitude and longitude coordinates to the parent form
 * 
 * @param {Object} value - Current location value { lat, lng }
 * @param {Function} onChange - Callback when location changes
 * @param {String} error - Error message to display
 */
const LocationPicker = ({ value, onChange, error }) => {
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(value || defaultCenter);
  const [center, setCenter] = useState(value || defaultCenter);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // Update marker position when value prop changes
  useEffect(() => {
    if (value && (value.lat !== markerPosition.lat || value.lng !== markerPosition.lng)) {
      setMarkerPosition(value);
      setCenter(value);
    }
  }, [value]);

  // Get user's geolocation on mount if no initial value
  useEffect(() => {
    if (!value && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMarkerPosition(userPos);
          setCenter(userPos);
          if (onChange) {
            onChange(userPos);
          }
        },
        (error) => {
          console.log('Geolocation error:', error.message);
          // Keep default center (Cairo)
        }
      );
    }
  }, [value, onChange]);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Handle map click to place marker
  const handleMapClick = useCallback(
    (event) => {
      const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setMarkerPosition(newPosition);
      if (onChange) {
        onChange(newPosition);
      }
    },
    [onChange]
  );

  // Handle marker drag
  const handleMarkerDragEnd = useCallback(
    (event) => {
      const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setMarkerPosition(newPosition);
      if (onChange) {
        onChange(newPosition);
      }
    },
    [onChange]
  );

  // Center map on current marker position
  const handleCenterMap = () => {
    if (map && markerPosition) {
      map.panTo(markerPosition);
      map.setZoom(15);
    }
  };

  // Use current location
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMarkerPosition(userPos);
          setCenter(userPos);
          if (map) {
            map.panTo(userPos);
            map.setZoom(15);
          }
          if (onChange) {
            onChange(userPos);
          }
        },
        (error) => {
          console.error('Geolocation error:', error.message);
          alert('Unable to get your location. Please select manually on the map.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  if (loadError) {
    return (
      <div className="border border-red-300 rounded-lg p-6 bg-red-50">
        <div className="flex items-center text-red-700">
          <span className="material-symbols-outlined mr-2">error</span>
          <span>Error loading maps. Please check your API key.</span>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mr-3"></div>
          <span className="text-gray-600">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start">
          <span className="material-symbols-outlined text-blue-600 mr-2 mt-0.5">info</span>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Select Property Location</p>
            <p>Click on the map or drag the marker to set the exact location of your property.</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <span className="material-symbols-outlined text-lg">my_location</span>
          Use Current Location
        </button>
        <button
          type="button"
          onClick={handleCenterMap}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <span className="material-symbols-outlined text-lg">center_focus_strong</span>
          Center on Marker
        </button>
      </div>

      {/* Map */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          options={mapOptions}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
        >
          <Marker
            position={markerPosition}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
            icon={{
              path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
              fillColor: '#1b5e20',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              scale: 2,
              anchor: { x: 12, y: 22 },
            }}
          />
        </GoogleMap>
      </div>

      {/* Coordinates Display */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 font-medium">Latitude:</span>
            <span className="ml-2 text-gray-900">{markerPosition.lat.toFixed(6)}</span>
          </div>
          <div>
            <span className="text-gray-600 font-medium">Longitude:</span>
            <span className="ml-2 text-gray-900">{markerPosition.lng.toFixed(6)}</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-sm flex items-center">
          <span className="material-symbols-outlined text-lg mr-1">error</span>
          {error}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
