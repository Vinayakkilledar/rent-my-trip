import React, { useState, useEffect } from 'react';
import './BookingSystem.css';

const BookingSystem = ({ isOpen, onClose, userType, tripData, onTripAssistance }) => {
  const [transportMode, setTransportMode] = useState('car');
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    timing: '',
    pickupPoint: '',
    carDetails: {
      advancePayment: 0,
      totalAmount: 0
    },
    busDetails: {
      pickupPoint: '',
      totalAmount: 0
    },
    trainDetails: {
      pickupPoint: '',
      totalAmount: 0
    }
  });
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [driverDetails, setDriverDetails] = useState(null);

  useEffect(() => {
    if (isOpen && tripData) {
      // Calculate amounts based on distance and mode
      const baseAmount = calculateBaseAmount(tripData.distance || '10 km', transportMode);
      
      setBookingDetails(prev => ({
        ...prev,
        carDetails: {
          advancePayment: Math.round(baseAmount * 0.3), // 30% advance
          totalAmount: baseAmount
        },
        busDetails: {
          ...prev.busDetails,
          totalAmount: Math.round(baseAmount * 0.6) // 60% of car price
        },
        trainDetails: {
          ...prev.trainDetails,
          totalAmount: Math.round(baseAmount * 0.7) // 70% of car price
        }
      }));
    }
  }, [isOpen, tripData, transportMode]);

  const calculateBaseAmount = (distance, mode) => {
    const distanceNum = parseInt(distance) || 10;
    const rates = {
      car: 50, // ₹50 per km
      bus: 30, // ₹30 per km
      train: 35  // ₹35 per km
    };
    return distanceNum * rates[mode];
  };

  const handleTransportModeChange = (mode) => {
    setTransportMode(mode);
    setShowPayment(false);
    setBookingConfirmed(false);
  };

  const handleInputChange = (field, value) => {
    setBookingDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirmTrip = () => {
    if (!bookingDetails.name || !bookingDetails.timing) {
      alert('Please fill in all required details');
      return;
    }

    if (transportMode === 'bus' && !bookingDetails.busDetails.pickupPoint) {
      alert('Please select bus pickup point');
      return;
    }

    if (transportMode === 'train' && !bookingDetails.trainDetails.pickupPoint) {
      alert('Please select train pickup point');
      return;
    }

    setShowPayment(true);
  };

  const handlePayment = (method) => {
    setPaymentMethod(method);
    
    setTimeout(() => {
      setBookingConfirmed(true);
      
      // Generate mock driver details for car bookings
      if (transportMode === 'car') {
        const mockDriver = {
          name: 'Rajesh Kumar',
          phone: '+91 98765 43210',
          carNumber: 'KA-01-AB-1234',
          carModel: 'Toyota Innova',
          experience: '5 years',
          rating: 4.8,
          photo: '👨‍✈️'
        };
        setDriverDetails(mockDriver);
        
        // Simulate sending details to driver
        setTimeout(() => {
          alert('📱 Customer details sent to driver successfully!');
        }, 2000);
      }
    }, 1500);
  };

  const getCurrentAmount = () => {
    switch (transportMode) {
      case 'car': return bookingDetails.carDetails.totalAmount;
      case 'bus': return bookingDetails.busDetails.totalAmount;
      case 'train': return bookingDetails.trainDetails.totalAmount;
      default: return 0;
    }
  };

  const getAdvancePayment = () => {
    return transportMode === 'car' ? bookingDetails.carDetails.advancePayment : 0;
  };

  const renderTransportOptions = () => (
    <div className="transport-options">
      <h3>🚗 Select Transport Mode</h3>
      <div className="transport-modes">
        <button
          className={`transport-btn ${transportMode === 'car' ? 'active' : ''}`}
          onClick={() => handleTransportModeChange('car')}
        >
          🚗 Car
        </button>
        <button
          className={`transport-btn ${transportMode === 'bus' ? 'active' : ''}`}
          onClick={() => handleTransportModeChange('bus')}
        >
          🚌 Bus
        </button>
        <button
          className={`transport-btn ${transportMode === 'train' ? 'active' : ''}`}
          onClick={() => handleTransportModeChange('train')}
        >
          🚂 Train
        </button>
      </div>
    </div>
  );

  const renderBookingForm = () => {
    if (transportMode === 'car') {
      return (
        <div className="booking-form car-booking">
          <div className="form-group">
            <label>👤 Your Name</label>
            <input
              type="text"
              value={bookingDetails.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>⏰ Preferred Timing</label>
            <input
              type="time"
              value={bookingDetails.timing}
              onChange={(e) => handleInputChange('timing', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="pricing-info">
            <div className="price-card">
              <h4>💰 Pricing Details</h4>
              <div className="price-item">
                <span>Total Amount:</span>
                <span className="amount">₹{bookingDetails.carDetails.totalAmount}</span>
              </div>
              <div className="price-item advance">
                <span>Advance Payment (30%):</span>
                <span className="amount">₹{bookingDetails.carDetails.advancePayment}</span>
              </div>
              <div className="price-item remaining">
                <span>Remaining on Trip:</span>
                <span className="amount">₹{bookingDetails.carDetails.totalAmount - bookingDetails.carDetails.advancePayment}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (transportMode === 'bus') {
      return (
        <div className="booking-form bus-booking">
          <div className="form-group">
            <label>👤 Your Name</label>
            <input
              type="text"
              value={bookingDetails.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>⏰ Preferred Timing</label>
            <input
              type="time"
              value={bookingDetails.timing}
              onChange={(e) => handleInputChange('timing', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>🚌 Pickup Point</label>
            <select
              value={bookingDetails.busDetails.pickupPoint}
              onChange={(e) => handleInputChange('busDetails', {
                ...bookingDetails.busDetails,
                pickupPoint: e.target.value
              })}
              className="form-input"
            >
              <option value="">Select pickup point</option>
              <option value="majestic">Majestic Bus Stand</option>
              <option value="shanthinagar">Shanthinagar Bus Stand</option>
              <option value="kormangala">Koramangala Bus Stand</option>
              <option value="whitefield">Whitefield Bus Stand</option>
              <option value="electronic-city">Electronic City Bus Stand</option>
            </select>
          </div>

          <div className="pricing-info">
            <div className="price-card">
              <h4>💰 Bus Fare</h4>
              <div className="price-item">
                <span>Total Amount:</span>
                <span className="amount">₹{bookingDetails.busDetails.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (transportMode === 'train') {
      return (
        <div className="booking-form train-booking">
          <div className="form-group">
            <label>👤 Your Name</label>
            <input
              type="text"
              value={bookingDetails.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>⏰ Preferred Timing</label>
            <input
              type="time"
              value={bookingDetails.timing}
              onChange={(e) => handleInputChange('timing', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>🚂 Pickup Point</label>
            <select
              value={bookingDetails.trainDetails.pickupPoint}
              onChange={(e) => handleInputChange('trainDetails', {
                ...bookingDetails.trainDetails,
                pickupPoint: e.target.value
              })}
              className="form-input"
            >
              <option value="">Select pickup point</option>
              <option value="bangalore-city">Bangalore City Station</option>
              <option value="yesvantpur">Yesvantpur Station</option>
              <option value="whitefield">Whitefield Station</option>
              <option value="electronic-city">Electronic City Station</option>
              <option value="majestic">Krantivira Sangolli Rayaru Station</option>
            </select>
          </div>

          <div className="pricing-info">
            <div className="price-card">
              <h4>💰 Train Fare</h4>
              <div className="price-item">
                <span>Total Amount:</span>
                <span className="amount">₹{bookingDetails.trainDetails.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderPaymentOptions = () => (
    <div className="payment-section">
      <h3>💳 Payment Options</h3>
      <div className="payment-methods">
        <button
          className={`payment-btn ${paymentMethod === 'phonepe' ? 'active' : ''}`}
          onClick={() => handlePayment('phonepe')}
        >
          📱 PhonePe
        </button>
        <button
          className={`payment-btn ${paymentMethod === 'gpay' ? 'active' : ''}`}
          onClick={() => handlePayment('gpay')}
        >
          💚 Google Pay
        </button>
        <button
          className={`payment-btn ${paymentMethod === 'paytm' ? 'active' : ''}`}
          onClick={() => handlePayment('paytm')}
        >
          💰 Paytm
        </button>
        <button
          className={`payment-btn ${paymentMethod === 'qr' ? 'active' : ''}`}
          onClick={() => handlePayment('qr')}
        >
          📷 QR Code
        </button>
      </div>

      {paymentMethod && (
        <div className="payment-details">
          <div className="qr-code">
            <div className="qr-placeholder">
              📷
              <p>Scan QR Code</p>
              <small>Amount: ₹{getCurrentAmount()}</small>
            </div>
          </div>
          <div className="payment-info">
            <h4>Payment Details</h4>
            <div className="payment-item">
              <span>Method:</span>
              <span>{paymentMethod.toUpperCase()}</span>
            </div>
            <div className="payment-item">
              <span>Amount:</span>
              <span className="amount">₹{getCurrentAmount()}</span>
            </div>
            {transportMode === 'car' && (
              <div className="payment-item">
                <span>Advance:</span>
                <span className="amount">₹{getAdvancePayment()}</span>
              </div>
            )}
            <div className="payment-instructions">
              <p>1. Open {paymentMethod.toUpperCase()} app</p>
              <p>2. Scan QR code or enter UPI ID</p>
              <p>3. Complete payment of ₹{getCurrentAmount()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderConfirmation = () => (
    <div className="confirmation-section">
      <div className="success-message">
        <h2>✅ Booking Confirmed!</h2>
        <p>Your trip has been successfully booked.</p>
      </div>

      {transportMode === 'car' && driverDetails && (
        <div className="driver-details">
          <h3>👨‍✈️ Driver Details</h3>
          <div className="driver-card">
            <div className="driver-photo">{driverDetails.photo}</div>
            <div className="driver-info">
              <h4>{driverDetails.name}</h4>
              <p><strong>Phone:</strong> {driverDetails.phone}</p>
              <p><strong>Car:</strong> {driverDetails.carModel}</p>
              <p><strong>Number:</strong> {driverDetails.carNumber}</p>
              <p><strong>Experience:</strong> {driverDetails.experience}</p>
              <div className="driver-rating">
                <span>⭐ Rating: {driverDetails.rating}</span>
              </div>
            </div>
          </div>
          <div className="booking-summary">
            <h4>📋 Booking Summary</h4>
            <div className="summary-item">
              <span>From:</span>
              <span>{tripData?.from || 'Not specified'}</span>
            </div>
            <div className="summary-item">
              <span>To:</span>
              <span>{tripData?.to || 'Not specified'}</span>
            </div>
            <div className="summary-item">
              <span>Date:</span>
              <span>{tripData?.travelDate || 'Not specified'}</span>
            </div>
            <div className="summary-item">
              <span>Time:</span>
              <span>{bookingDetails.timing}</span>
            </div>
            <div className="summary-item total">
              <span>Total Paid:</span>
              <span className="amount">₹{getAdvancePayment()}</span>
            </div>
          </div>
        </div>
      )}

      {(transportMode === 'bus' || transportMode === 'train') && (
        <div className="ticket-details">
          <h3>🎫 {transportMode === 'bus' ? 'Bus' : 'Train'} Ticket</h3>
          <div className="ticket-card">
            <div className="ticket-header">
              <h4>{transportMode === 'bus' ? '🚌' : '🚂'} {transportMode.toUpperCase()} TICKET</h4>
            </div>
            <div className="ticket-body">
              <div className="ticket-row">
                <span>Passenger:</span>
                <span>{bookingDetails.name}</span>
              </div>
              <div className="ticket-row">
                <span>From:</span>
                <span>{tripData?.from || 'Not specified'}</span>
              </div>
              <div className="ticket-row">
                <span>To:</span>
                <span>{tripData?.to || 'Not specified'}</span>
              </div>
              <div className="ticket-row">
                <span>Pickup Point:</span>
                <span>
                  {transportMode === 'bus' ? bookingDetails.busDetails.pickupPoint : bookingDetails.trainDetails.pickupPoint}
                </span>
              </div>
              <div className="ticket-row">
                <span>Date:</span>
                <span>{tripData?.travelDate || 'Not specified'}</span>
              </div>
              <div className="ticket-row">
                <span>Time:</span>
                <span>{bookingDetails.timing}</span>
              </div>
              <div className="ticket-row total">
                <span>Fare:</span>
                <span className="amount">₹{getCurrentAmount()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="confirmation-actions">
        {transportMode === 'car' && onTripAssistance && (
          <button onClick={() => { onTripAssistance(); onClose(); }} className="btn btn-trip-assistance">
            🗺️ Trip Assistance
          </button>
        )}
        <button onClick={onClose} className="btn btn-primary">
          ✅ Done
        </button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="booking-overlay">
      <div className="booking-dialog">
        <div className="booking-header">
          <h2>🎫 Book Your Trip</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="booking-content">
          {renderTransportOptions()}
          
          {renderBookingForm()}
          
          {!showPayment && !bookingConfirmed && (
            <div className="confirm-section">
              <button onClick={handleConfirmTrip} className="btn btn-confirm">
                ✅ Confirm My Trip
              </button>
            </div>
          )}
          
          {showPayment && !bookingConfirmed && renderPaymentOptions()}
          
          {bookingConfirmed && renderConfirmation()}
        </div>
      </div>
    </div>
  );
};

export default BookingSystem;
