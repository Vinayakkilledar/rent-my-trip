import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import axios from 'axios';
import LodgeBookingModal from './LodgeBookingModal';
import './TripAssistanceDashboard.css';

const MAP_CONTAINER_STYLE = { width: '100%', height: '400px', borderRadius: '12px' };
const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 };
const RADIUS_METERS = 200;
const PLACE_TYPES = [
  { type: 'lodging', label: 'lodging' },
  { type: 'tourist_attraction', label: 'tourist' },
  { type: 'gas_station', label: 'gas' },
];

const getPlaceCategory = (place) => {
  if (place.types?.includes('gas_station')) return { icon: '⛽', label: 'Petrol Pump', category: 'gas' };
  if (place.types?.includes('tourist_attraction')) return { icon: '🏛️', label: 'Tourist Place', category: 'tourist' };
  const name = (place.name || '').toLowerCase();
  const isLodge = name.includes('lodge') || name.includes('inn') || name.includes('hostel');
  return isLodge
    ? { icon: '🏠', label: 'Lodge', category: 'lodge' }
    : { icon: '🏢', label: 'Hotel', category: 'hotel' };
};

const API_BASE = 'http://localhost:5000/api';

const TripAssistanceDashboard = () => {
  const navigate = useNavigate();
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
  const [userLocation, setUserLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [bookedLodgeIds, setBookedLodgeIds] = useState(new Set());
  const [bookedLodges, setBookedLodges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLodgeBooking, setShowLodgeBooking] = useState(null);
  const [map, setMap] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ['places'],
  });

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setUserLocation(DEFAULT_CENTER);
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError('Could not detect your location. Using default (Bangalore).');
        setUserLocation(DEFAULT_CENTER);
        setLoading(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  const fetchNearbyPlaces = useCallback(() => {
    if (!map || !userLocation || !window.google) return;

    const service = new window.google.maps.places.PlacesService(map);
    const allResults = [];
    let completed = 0;

    PLACE_TYPES.forEach(({ type }) => {
      service.nearbySearch(
        {
          location: userLocation,
          radius: RADIUS_METERS,
          type: type === 'lodging' ? 'lodging' : type,
        },
        (results, status) => {
          completed++;
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            allResults.push(...results);
          }
          if (completed === PLACE_TYPES.length) {
            const seen = new Set();
            const unique = allResults.filter((p) => {
              if (seen.has(p.place_id)) return false;
              seen.add(p.place_id);
              return true;
            });
            setPlaces(unique);
          }
        }
      );
    });
  }, [map, userLocation]);

  useEffect(() => {
    if (isLoaded && map && userLocation) {
      fetchNearbyPlaces();
    }
  }, [isLoaded, map, userLocation, fetchNearbyPlaces]);

  const fetchBookedLodges = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/lodge-bookings`);
      if (res.data?.success && res.data?.bookings) {
        setBookedLodges(res.data.bookings);
        setBookedLodgeIds(new Set(res.data.bookings.map((b) => b.placeId)));
      }
    } catch {
      // Backend may not be running; use empty
    }
  }, []);

  useEffect(() => {
    fetchBookedLodges();
  }, [fetchBookedLodges]);

  const handleLodgeBooked = (booking) => {
    setBookedLodges((prev) => [...prev, booking]);
    setBookedLodgeIds((prev) => new Set([...prev, booking.placeId]));
    setShowLodgeBooking(null);
  };

  const handleBack = () => navigate(-1);

  if (loadError) {
    return (
      <div className="trip-assistance">
        <div className="trip-assistance-error">
          <h2>Map Load Error</h2>
          <p>Could not load Google Maps. Please check your API key in .env (REACT_APP_GOOGLE_MAPS_API_KEY).</p>
          <button onClick={handleBack} className="btn-back">← Back</button>
        </div>
      </div>
    );
  }

  const center = userLocation || DEFAULT_CENTER;

  return (
    <div className="trip-assistance">
      <header className="trip-assistance-header">
        <button onClick={handleBack} className="btn-back" aria-label="Go back">
          ← Back
        </button>
        <h1>🗺️ Trip Assistance Dashboard</h1>
        <p>Nearby places within 200m · Book lodges in advance</p>
      </header>

      {loading && (
        <div className="trip-assistance-loading">
          <div className="spinner" />
          <p>Detecting your location...</p>
        </div>
      )}

      {error && (
        <div className="trip-assistance-warning" role="alert">
          ⚠️ {error}
        </div>
      )}

      <div className="trip-assistance-map-section">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={center}
            zoom={16}
            onLoad={setMap}
            options={{ disableDefaultUI: false, zoomControl: true }}
          >
            {userLocation && (
              <Marker position={userLocation} title="You are here" label="👤" />
            )}
            {selectedPlace && (
              <InfoWindow
                position={{
                  lat: (() => {
                    const p = selectedPlace.geometry?.location;
                    return p ? (typeof p.lat === 'function' ? p.lat() : p.lat) : 0;
                  })(),
                  lng: (() => {
                    const p = selectedPlace.geometry?.location;
                    return p ? (typeof p.lng === 'function' ? p.lng() : p.lng) : 0;
                  })(),
                }}
                onCloseClick={() => setSelectedPlace(null)}
              >
                <div className="info-window-content">
                  <h3>{selectedPlace.name}</h3>
                  <p>{selectedPlace.category?.label} {selectedPlace.category?.icon}</p>
                  <p className="info-address">{selectedPlace.vicinity || selectedPlace.formatted_address}</p>
                  {selectedPlace.rating && <p>★ {selectedPlace.rating}</p>}
                  {(selectedPlace.category?.category === 'lodge' || selectedPlace.category?.category === 'hotel') && !selectedPlace.isBooked && (
                    <button
                      className="btn-book-lodge"
                      onClick={() => {
                        setShowLodgeBooking(selectedPlace);
                        setSelectedPlace(null);
                      }}
                    >
                      Advance Book Room
                    </button>
                  )}
                </div>
              </InfoWindow>
            )}
            {places.map((place) => {
              const pos = place.geometry?.location;
              if (!pos) return null;
              const lat = typeof pos.lat === 'function' ? pos.lat() : pos.lat;
              const lng = typeof pos.lng === 'function' ? pos.lng() : pos.lng;
              const cat = getPlaceCategory(place);
              const isBooked = bookedLodgeIds.has(place.place_id);

              return (
                <Marker
                  key={place.place_id}
                  position={{ lat, lng }}
                  label={isBooked ? '🔑' : cat.icon}
                  onClick={() => setSelectedPlace({ ...place, category: cat, isBooked })}
                  zIndex={isBooked ? 10 : 1}
                />
              );
            })}
            {bookedLodges.map((b) => (
              <Marker
                key={b.bookingId}
                position={{ lat: b.lat, lng: b.lng }}
                label="🔑"
                title={`${b.lodgeName} (Booked)`}
                zIndex={10}
              />
            ))}
          </GoogleMap>
        ) : (
          <div className="trip-assistance-map-placeholder">
            <p>Loading map...</p>
          </div>
        )}

        <div className="map-legend">
          <span><span className="legend-icon">🏢</span> Hotel</span>
          <span><span className="legend-icon">🏠</span> Lodge</span>
          <span><span className="legend-icon">⛽</span> Petrol</span>
          <span><span className="legend-icon">🏛️</span> Tourist</span>
          <span><span className="legend-icon">🔑</span> Booked</span>
        </div>
      </div>

      <section className="places-cards-section">
        <h2>📍 Nearby Places (within 200m)</h2>
        <div className="places-grid">
          {places.length === 0 && !loading && (
            <div className="empty-state">
              <p>No nearby places found within 200m.</p>
              <p>Try moving to a denser area or check location permissions.</p>
            </div>
          )}
          {places.map((place) => {
            const pos = place.geometry?.location;
            const lat = pos ? (typeof pos.lat === 'function' ? pos.lat() : pos.lat) : 0;
            const lng = pos ? (typeof pos.lng === 'function' ? pos.lng() : pos.lng) : 0;
            const cat = getPlaceCategory(place);
            const isBooked = bookedLodgeIds.has(place.place_id);
            const isLodgeOrHotel = cat.category === 'lodge' || cat.category === 'hotel';

            return (
              <div key={place.place_id} className={`place-card ${isBooked ? 'booked' : ''}`}>
                <div className="place-card-icon">{cat.icon}</div>
                <h3>{place.name}</h3>
                <p className="place-type">{cat.label}</p>
                <p className="place-address">{place.vicinity || place.formatted_address || ''}</p>
                {place.rating && <p className="place-rating">★ {place.rating}</p>}
                {isLodgeOrHotel && !isBooked && (
                  <button
                    className="place-card-btn"
                    onClick={() => setShowLodgeBooking({ ...place, category: cat })}
                  >
                    Advance Book
                  </button>
                )}
                {isBooked && (
                  <div className="place-booked-badge">🔑 Booked</div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {showLodgeBooking && (
        <LodgeBookingModal
          place={showLodgeBooking}
          onClose={() => setShowLodgeBooking(null)}
          onSuccess={handleLodgeBooked}
        />
      )}
    </div>
  );
};

export default TripAssistanceDashboard;
