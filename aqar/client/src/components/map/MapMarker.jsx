import { useState } from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';

/**
 * MapMarker Component
 * Displays a custom marker for a property on the map
 * Shows InfoWindow popup on click with property summary
 * 
 * @param {Object} property - Property object with location and details
 * @param {Function} onClick - Callback when marker is clicked
 * @param {Object} clusterer - MarkerClusterer instance for clustering
 */
const MapMarker = ({ property, onClick, clusterer }) => {
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();

  const position = {
    lat: property.location.coordinates.lat,
    lng: property.location.coordinates.lng,
  };

  // Custom marker icon based on property status
  const getMarkerIcon = () => {
    const color = property.status === 'sale' ? '#1b5e20' : '#fcab28';
    return {
      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: 1.5,
      anchor: { x: 12, y: 22 },
    };
  };

  const handleMarkerClick = () => {
    setShowInfo(true);
    if (onClick) {
      onClick();
    }
  };

  const handleInfoClose = () => {
    setShowInfo(false);
  };

  const handleViewDetails = () => {
    navigate(`/properties/${property._id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <Marker
        position={position}
        onClick={handleMarkerClick}
        icon={getMarkerIcon()}
        title={property.title}
        clusterer={clusterer}
      />

      {showInfo && (
        <InfoWindow
          position={position}
          onCloseClick={handleInfoClose}
          options={{
            pixelOffset: new window.google.maps.Size(0, -40),
          }}
        >
          <div className="max-w-xs">
            {/* Property Image */}
            {property.images && property.images.length > 0 && (
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-32 object-cover rounded-t-lg mb-2"
              />
            )}

            {/* Property Details */}
            <div className="p-2">
              <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                {property.title}
              </h3>

              {/* Price and Status */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-700 font-bold text-base">
                  {formatPrice(property.price)}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    property.status === 'sale'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {property.status === 'sale' ? 'For Sale' : 'For Rent'}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center text-gray-600 text-xs mb-2">
                <span className="material-symbols-outlined text-sm mr-1">location_on</span>
                <span className="line-clamp-1">{property.location.city}</span>
              </div>

              {/* Property Info */}
              <div className="flex items-center gap-3 text-gray-600 text-xs mb-3">
                {property.rooms && (
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-sm mr-1">bed</span>
                    <span>{property.rooms}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-sm mr-1">bathtub</span>
                    <span>{property.bathrooms}</span>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-sm mr-1">square_foot</span>
                    <span>{property.area} m²</span>
                  </div>
                )}
              </div>

              {/* View Details Button */}
              <button
                onClick={handleViewDetails}
                className="w-full bg-green-700 hover:bg-green-800 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default MapMarker;
