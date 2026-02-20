import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const LodgeBookingModal = ({ place, onClose, onSuccess }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const pos = place.geometry?.location;
  const lat = pos ? (typeof pos.lat === 'function' ? pos.lat() : pos.lat) : 0;
  const lng = pos ? (typeof pos.lng === 'function' ? pos.lng() : pos.lng) : 0;
  const advanceAmount = Math.max(500, Math.round((place.price_level || 1) * 600));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!checkIn || !checkOut || !paymentMethod) {
      setError('Please fill all fields and select a payment method.');
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('Check-out must be after check-in.');
      return;
    }

    setProcessing(true);
    try {
      // Simulated payment delay
      await new Promise((r) => setTimeout(r, 1500));

      const roomNumber = 'R' + (Math.floor(Math.random() * 900) + 100);
      const bookingId = 'LODG-' + Date.now();

      const payload = {
        placeId: place.place_id,
        lodgeName: place.name,
        address: place.vicinity || place.formatted_address || '',
        lat,
        lng,
        checkIn,
        checkOut,
        roomNumber,
        bookingId,
        advanceAmount,
        paymentMethod,
      };

      const res = await axios.post(`${API_BASE}/lodge-bookings`, payload);

      if (res.data?.success) {
        const result = { ...payload, ...res.data.booking };
        alert(`✅ Booking confirmed!\n\nRoom: ${result.roomNumber}\nBooking ID: ${result.bookingId}`);
        onSuccess(result);
      } else {
        setError(res.data?.message || 'Booking failed.');
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || !err.response) {
        const result = {
          placeId: place.place_id,
          lodgeName: place.name,
          address: place.vicinity || place.formatted_address || '',
          lat,
          lng,
          checkIn,
          checkOut,
          roomNumber: 'R' + (Math.floor(Math.random() * 900) + 100),
          bookingId: 'LODG-' + Date.now(),
          advanceAmount,
          paymentMethod,
        };
        alert(`✅ Booking confirmed! (offline mode)\n\nRoom: ${result.roomNumber}\nBooking ID: ${result.bookingId}`);
        onSuccess(result);
        return;
      }
      const msg = err.response?.data?.message || 'Could not save booking.';
      setError(msg);
    } finally {
      setProcessing(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="lodge-booking-overlay" onClick={onClose}>
      <div className="lodge-booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="lodge-booking-header">
          <h2>🏠 Lodge Advance Booking</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="lodge-booking-body">
          <h3>{place.name}</h3>
          <p className="lodge-address">{place.vicinity || place.formatted_address}</p>
          <p className="advance-amount">Advance: ₹{advanceAmount}</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Check-in Date</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={minDate}
                required
              />
            </div>
            <div className="form-group">
              <label>Check-out Date</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || minDate}
                required
              />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <div className="payment-options">
                {['PhonePe', 'GPay', 'Paytm', 'Card'].map((m) => (
                  <label key={m} className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value={m}
                      checked={paymentMethod === m}
                      onChange={() => setPaymentMethod(m)}
                    />
                    <span>{m}</span>
                  </label>
                ))}
              </div>
            </div>
            {error && <div className="booking-error" role="alert">{error}</div>}
            <div className="lodge-booking-actions">
              <button type="button" onClick={onClose} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" className="btn-pay" disabled={processing}>
                {processing ? 'Processing...' : `Pay ₹${advanceAmount}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LodgeBookingModal;
