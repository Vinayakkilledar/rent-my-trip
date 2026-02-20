import React, { useState, useEffect } from 'react';
import './DriverNotifications.css';

const DriverNotifications = ({ userType, isOpen, onClose }) => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userType === 'driver') {
      // Simulate loading for better UX
      setTimeout(() => {
        const storedTrip = localStorage.getItem('currentTrip');
        
        if (storedTrip) {
          const parsedTrip = JSON.parse(storedTrip);
          // Create exactly one rental request from that trip data
          setRentals([{
            id: Date.now(),
            customerName: 'Customer',
            from: parsedTrip.origin || parsedTrip.from,
            to: parsedTrip.destination || parsedTrip.to,
            vehicleType: parsedTrip.vehicleType || 'Car',
            travelDate: parsedTrip.travelDate,
            travelTime: parsedTrip.travelTime,
            distance: parsedTrip.distance,
            estimatedTime: parsedTrip.estimatedTime,
            status: 'pending',
            customerPhone: 'Not provided',
            price: 'TBD'
          }]);
        } else {
          setRentals([]);
        }
        
        setLoading(false);
      }, 500);
    }
  }, [isOpen, userType]);

  const handleAcceptRental = (rentalId) => {
    setRentals(prev => 
      prev.map(rental => 
        rental.id === rentalId 
          ? { ...rental, status: 'accepted' }
          : rental
      )
    );
    alert('Rental accepted! Customer will be notified. 🚗');
  };

  const handleRejectRental = (rentalId) => {
    setRentals(prev => prev.filter(rental => rental.id !== rentalId));
    localStorage.removeItem('currentTrip'); // remove the trip if rejected
    alert('Rental rejected. Customer will be notified. ❌');
  };

  if (!isOpen) return null;

  return (
    <div className="notification-overlay">
      <div className="notification-dialog">
        <div className="notification-header">
          <h2>🚗 Vehicle Rental Notifications</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="notification-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Checking your rental requests...</p>
            </div>
          ) : rentals.length > 0 ? (
            <div className="rentals-list">
              <div className="rentals-header">
                <h3 style={{color: '#28a745'}}>you have an rent for your vechicle.</h3>
              </div>

              {rentals.map((rental) => (
                <div key={rental.id} className="rental-card">
                  <div className="route-info" style={{marginBottom: '15px'}}>
                    <div className="location from">
                      <span className="location-label">📍 From:</span>
                      <span className="location-address" style={{fontWeight: 'bold'}}>{rental.from}</span>
                    </div>
                    <div className="route-arrow">→</div>
                    <div className="location to">
                      <span className="location-label">🎯 To:</span>
                      <span className="location-address" style={{fontWeight: 'bold'}}>{rental.to}</span>
                    </div>
                  </div>

                  {rental.status === 'pending' && (
                    <div className="rental-actions">
                      <button 
                        onClick={() => handleAcceptRental(rental.id)}
                        className="btn btn-accept"
                      >
                        ✅ Accept
                      </button>
                      <button 
                        onClick={() => handleRejectRental(rental.id)}
                        className="btn btn-reject"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}

                  {rental.status === 'accepted' && (
                    <div className="accepted-message">
                      <p>👍 You have accepted this rental.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-rentals">
              <div className="no-rentals-icon">🚗</div>
              <h3 style={{color: '#6c757d'}}>you have no rents.</h3>
            </div>
          )}
        </div>

        <div className="notification-footer">
          <button onClick={onClose} className="btn btn-close">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverNotifications;
