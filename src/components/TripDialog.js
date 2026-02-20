import React, { useState, useEffect } from 'react';
import './TripDialog.css';

const TripDialog = ({ isOpen, onClose, userType, onTripSubmit }) => {
  const [tripData, setTripData] = useState({
    from: '',
    to: '',
    travelDate: '',
    travelTime: '',
    vehicleType: userType === 'driver' ? '' : 'car'
  });
  
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [route, setRoute] = useState(null);
  const [distance, setDistance] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Load Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.onload = () => setMapLoaded(true);
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTripData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateRoute = () => {
    if (!tripData.from || !tripData.to) {
      alert('Please enter both "From" and "To" addresses');
      return;
    }

    // Fallback mode without Google Maps API
    if (!window.google) {
      // Mock route calculation
      const mockRoute = {
        routes: [{
          legs: [{
            distance: { text: `${Math.floor(Math.random() * 50 + 5)} km` },
            duration: { text: `${Math.floor(Math.random() * 60 + 15)} mins` }
          }]
        }]
      };
      
      setRoute(mockRoute);
      setDistance(mockRoute.routes[0].legs[0].distance.text);
      setEstimatedTime(mockRoute.routes[0].legs[0].duration.text);
      setShowMap(true);
      alert('📍 Route calculated! (Demo mode - Google Maps API not connected)');
      return;
    }

    // Real Google Maps calculation
    const directionsService = new window.google.maps.DirectionsService();
    
    const request = {
      origin: tripData.from,
      destination: tripData.to,
      travelMode: window.google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        setRoute(result);
        setDistance(result.routes[0].legs[0].distance.text);
        setEstimatedTime(result.routes[0].legs[0].duration.text);
        setShowMap(true);
      } else {
        alert('Could not calculate route: ' + status);
      }
    });
  };

  const initializeMap = () => {
    const mapElement = document.getElementById('trip-map');
    if (!mapElement) return;

    // Fallback mode without Google Maps
    if (!window.google) {
      mapElement.innerHTML = `
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; background: linear-gradient(135deg, #f0f0f0, #e0e0e0); color: #666;">
          <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🗺️</div>
            <h4>Google Maps Integration</h4>
            <p style="max-width: 300px; line-height: 1.5;">
              To enable interactive maps, please set up Google Maps API key.<br>
              Follow setup guide in <strong>GOOGLE_MAPS_SETUP.md</strong>
            </p>
          </div>
        </div>
      `;
      return;
    }

    // Real Google Maps initialization
    const mapOptions = {
      center: { lat: 20.5937, lng: 78.9629 }, // Default to India center
      zoom: 5,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP
    };

    const map = new window.google.maps.Map(mapElement, mapOptions);

    // Add autocomplete for from and to
    const fromInput = document.getElementById('trip-from');
    const toInput = document.getElementById('trip-to');
    
    const fromAutocomplete = new window.google.maps.places.Autocomplete(fromInput);
    const toAutocomplete = new window.google.maps.places.Autocomplete(toInput);

    fromAutocomplete.setFields(['place_id', 'geometry', 'name']);
    toAutocomplete.setFields(['place_id', 'geometry', 'name']);

    // Display route if available
    if (route) {
      const directionsRenderer = new window.google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);
      directionsRenderer.setDirections(route);
    }
  };

  useEffect(() => {
    if (showMap && mapLoaded) {
      const timer = setTimeout(() => {
        initializeMap();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showMap, mapLoaded, route]);

  const handleSubmit = () => {
    if (!tripData.from || !tripData.to) {
      alert('Please enter both "From" and "To" addresses');
      return;
    }

    const tripDetails = {
      ...tripData,
      distance,
      estimatedTime,
      timestamp: new Date().toISOString()
    };

    onTripSubmit(tripDetails);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="trip-dialog-overlay">
      <div className="trip-dialog">
        <div className="trip-dialog-header">
          <h2>
            {userType === 'customer' ? '🚗 Plan Your Journey' : '📍 Set Your Route'}
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="trip-dialog-content">
          <div className="trip-form">
            <div className="address-inputs">
              <div className="form-group">
                <label htmlFor="trip-from">
                  📍 From (Starting Point)
                </label>
                <input
                  type="text"
                  id="trip-from"
                  name="from"
                  value={tripData.from}
                  onChange={handleInputChange}
                  placeholder="Enter starting address"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="trip-to">
                  🎯 To (Destination)
                </label>
                <input
                  type="text"
                  id="trip-to"
                  name="to"
                  value={tripData.to}
                  onChange={handleInputChange}
                  placeholder="Enter destination address"
                  className="form-input"
                />
              </div>
            </div>

            <div className="trip-details">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="travelDate">
                    📅 Travel Date
                  </label>
                  <input
                    type="date"
                    id="travelDate"
                    name="travelDate"
                    value={tripData.travelDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="travelTime">
                    ⏰ Travel Time
                  </label>
                  <input
                    type="time"
                    id="travelTime"
                    name="travelTime"
                    value={tripData.travelTime}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              {userType === 'customer' && (
                <div className="form-group">
                  <label htmlFor="vehicleType">
                    🚗 Vehicle Type
                  </label>
                  <select
                    id="vehicleType"
                    name="vehicleType"
                    value={tripData.vehicleType}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="car">🚗 Car</option>
                    <option value="bike">🏍️ Bike</option>
                    <option value="scooter">🛵 Scooter</option>
                    <option value="van">🚐 Van</option>
                    <option value="luxury">🏎️ Luxury Car</option>
                  </select>
                </div>
              )}
            </div>

            <div className="trip-actions">
              <button onClick={calculateRoute} className="btn btn-primary">
                🗺️ Calculate Route
              </button>
              
              {route && (
                <button onClick={handleSubmit} className="btn btn-success">
                  ✅ Start Trip
                </button>
              )}
            </div>

            {route && (
              <div className="route-info">
                <div className="route-details">
                  <div className="route-item">
                    <span className="route-label">📏 Distance:</span>
                    <span className="route-value">{distance}</span>
                  </div>
                  <div className="route-item">
                    <span className="route-label">⏱️ Estimated Time:</span>
                    <span className="route-value">{estimatedTime}</span>
                  </div>
                  <div className="route-item">
                    <span className="route-label">🚗 Vehicle:</span>
                    <span className="route-value">
                      {userType === 'customer' ? tripData.vehicleType : 'Your Car'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {showMap && (
            <div className="map-section">
              <div id="trip-map" className="map-container"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDialog;
