import React, { useState, useEffect } from 'react';
import './DriverNotifications.css';

const DriverNotifications = ({ userType, isOpen, onClose }) => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userType === 'driver') {
      // Simulate loading rental data
      setTimeout(() => {
        // Mock rental data - in real app, this would come from backend
        const mockRentals = [
          {
            id: 1,
            customerName: 'John Doe',
            from: 'MG Road, Bangalore',
            to: 'Whitefield, Bangalore',
            vehicleType: 'Sedan',
            travelDate: '2026-02-21',
            travelTime: '10:00 AM',
            distance: '15 km',
            estimatedTime: '45 mins',
            status: 'confirmed',
            customerPhone: '+91 98765 43210',
            price: '₹450'
          },
          {
            id: 2,
            customerName: 'Jane Smith',
            from: 'Koramangala, Bangalore',
            to: 'Electronic City, Bangalore',
            vehicleType: 'SUV',
            travelDate: '2026-02-21',
            travelTime: '02:30 PM',
            distance: '22 km',
            estimatedTime: '1 hour',
            status: 'pending',
            customerPhone: '+91 87654 32109',
            price: '₹650'
          }
        ];

        // Randomly decide if driver has rentals (for demo)
        const hasRentals = Math.random() > 0.3; // 70% chance of having rentals
        
        if (hasRentals) {
          setRentals(mockRentals);
        } else {
          setRentals([]);
        }
        
        setLoading(false);
      }, 1500);
    }
  }, [isOpen, userType]);

  const handleAcceptRental = (rentalId) => {
    // Update rental status to accepted
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
    // Remove rental from list
    setRentals(prev => prev.filter(rental => rental.id !== rentalId));
    alert('Rental rejected. Customer will be notified. ❌');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'accepted': return '#007bff';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return '✅ Confirmed';
      case 'pending': return '⏳ Pending';
      case 'accepted': return '👍 Accepted';
      default: return '❓ Unknown';
    }
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
                <h3>You have {rentals.length} rental request{rentals.length > 1 ? 's' : ''}!</h3>
                <p className="rentals-subtitle">Review and accept customer bookings</p>
              </div>

              {rentals.map((rental) => (
                <div key={rental.id} className="rental-card">
                  <div className="rental-header-info">
                    <div className="customer-info">
                      <h4>{rental.customerName}</h4>
                      <p className="customer-phone">{rental.customerPhone}</p>
                    </div>
                    <div className="rental-status">
                      <span 
                        className="status-badge" 
                        style={{ backgroundColor: getStatusColor(rental.status) }}
                      >
                        {getStatusText(rental.status)}
                      </span>
                    </div>
                  </div>

                  <div className="route-info">
                    <div className="location from">
                      <span className="location-label">📍 From:</span>
                      <span className="location-address">{rental.from}</span>
                    </div>
                    <div className="route-arrow">→</div>
                    <div className="location to">
                      <span className="location-label">🎯 To:</span>
                      <span className="location-address">{rental.to}</span>
                    </div>
                  </div>

                  <div className="rental-details">
                    <div className="detail-item">
                      <span className="detail-label">📅 Date:</span>
                      <span className="detail-value">{rental.travelDate}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">⏰ Time:</span>
                      <span className="detail-value">{rental.travelTime}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">🚗 Vehicle:</span>
                      <span className="detail-value">{rental.vehicleType}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">📏 Distance:</span>
                      <span className="detail-value">{rental.distance}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">⏱️ Duration:</span>
                      <span className="detail-value">{rental.estimatedTime}</span>
                    </div>
                    <div className="detail-item price">
                      <span className="detail-label">💰 Price:</span>
                      <span className="detail-value">{rental.price}</span>
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
                      <p>👍 You have accepted this rental. Customer details have been shared.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-rentals">
              <div className="no-rentals-icon">🚗</div>
              <h3>You have no rental requests</h3>
              <p>No customers have booked your vehicle yet.</p>
              <div className="no-rentals-tips">
                <h4>Tips to get more rentals:</h4>
                <ul>
                  <li>📍 Keep your vehicle location updated</li>
                  <li>⭐ Maintain good ratings from customers</li>
                  <li>📱 Keep your phone available for bookings</li>
                  <li>💰 Set competitive pricing</li>
                </ul>
              </div>
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
