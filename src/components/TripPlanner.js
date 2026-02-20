import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './TripPlanner.css';

const TripPlanner = () => {
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType') || 'customer';
  
  const [tripData, setTripData] = useState({
    origin: '',
    destination: '',
    travelDate: '',
    travelTime: '',
    vehicleType: userType === 'driver' ? '' : 'car'
  });
  
  const [mapLoaded, setMapLoaded] = useState(false);
  const [route, setRoute] = useState(null);
  const [distance, setDistance] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [carLocation, setCarLocation] = useState(null);

  useEffect(() => {
    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
    script.async = true;
    script.onload = () => setMapLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (userType === 'driver' && mapLoaded) {
      // Get user's current location for driver
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCarLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      }
    }
  }, [userType, mapLoaded]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTripData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateRoute = () => {
    if (!tripData.origin || !tripData.destination) {
      alert('Please enter both origin and destination');
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
      
      alert('📍 Route calculated! (Demo mode - Google Maps API not connected)');
      return;
    }

    // Real Google Maps calculation
    const directionsService = new window.google.maps.DirectionsService();
    
    const request = {
      origin: tripData.origin,
      destination: tripData.destination,
      travelMode: window.google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        setRoute(result);
        setDistance(result.routes[0].legs[0].distance.text);
        setEstimatedTime(result.routes[0].legs[0].duration.text);
      } else {
        alert('Could not calculate route: ' + status);
      }
    });
  };

  const bookTrip = () => {
    if (!route) {
      alert('Please calculate route first');
      return;
    }

    const tripDetails = {
      ...tripData,
      distance,
      estimatedTime,
      route: route,
      timestamp: new Date().toISOString()
    };

    // Store trip details (in real app, this would go to backend)
    localStorage.setItem('currentTrip', JSON.stringify(tripDetails));
    
    alert('Trip booked successfully! 🎉');
    console.log('Trip details:', tripDetails);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const initializeMap = () => {
    const mapElement = document.getElementById('map');
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
              Follow the setup guide in <strong>GOOGLE_MAPS_SETUP.md</strong><br><br>
              For now, you can still plan your trip using the form!
            </p>
            <div style="margin-top: 1rem; padding: 1rem; background: rgba(102, 126, 234, 0.1); border-radius: 8px;">
              <strong>Current Mode:</strong> Manual Trip Planning
            </div>
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

    // Add autocomplete for origin and destination
    const originInput = document.getElementById('origin');
    const destinationInput = document.getElementById('destination');
    
    const originAutocomplete = new window.google.maps.places.Autocomplete(originInput);
    const destinationAutocomplete = new window.google.maps.places.Autocomplete(destinationInput);

    originAutocomplete.setFields(['place_id', 'geometry', 'name']);
    destinationAutocomplete.setFields(['place_id', 'geometry', 'name']);

    // Show driver's current location if available
    if (userType === 'driver' && carLocation) {
      const marker = new window.google.maps.Marker({
        position: carLocation,
        map: map,
        title: 'Your Car Location',
        icon: {
          url: '🚗',
          scaledSize: new window.google.maps.Size(30, 30)
        }
      });
    }
  };

  useEffect(() => {
    if (mapLoaded) {
      const timer = setTimeout(() => {
        initializeMap();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [mapLoaded, carLocation, userType]);

  return (
    <div className="trip-planner">
      <div className="trip-header">
        <h2>
          {userType === 'customer' ? '🗺️ Plan Your Trip' : '🚗 Set Your Trip Route'}
        </h2>
        <div className="header-actions">
          <Link to="/trip-assistance" className="trip-assistance-link">
            🗺️ Trip Assistance
          </Link>
          <p className="user-type-indicator">
            Logged in as: <strong>{userType === 'customer' ? 'Customer' : 'Driver'}</strong>
          </p>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="trip-content">
        <div className="trip-form">
          <div className="form-group">
            <label htmlFor="origin">
              {userType === 'customer' ? '📍 Pickup Location' : '🚗 Current Location'}
            </label>
            <input
              type="text"
              id="origin"
              name="origin"
              value={tripData.origin}
              onChange={handleInputChange}
              placeholder={userType === 'customer' ? 'Enter pickup address' : 'Your current location'}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="destination">
              🎯 Destination
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={tripData.destination}
              onChange={handleInputChange}
              placeholder="Enter destination address"
              className="form-input"
            />
          </div>

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

          {userType === 'driver' && carLocation && (
            <div className="car-location-info">
              <p>🚗 Your car is currently at:</p>
              <p className="location-coords">
                {carLocation.lat.toFixed(6)}, {carLocation.lng.toFixed(6)}
              </p>
            </div>
          )}

          <div className="trip-actions">
            <button onClick={calculateRoute} className="btn btn-primary">
              🗺️ Calculate Route
            </button>
            
            {route && (
              <button onClick={bookTrip} className="btn btn-success">
                ✅ Book Trip
              </button>
            )}
          </div>
        </div>

        <div className="map-section">
          <div id="map" className="map-container"></div>
          
          {route && (
            <div className="route-info">
              <h3>🗺️ Route Information</h3>
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
      </div>
    </div>
  );
};

export default TripPlanner;
