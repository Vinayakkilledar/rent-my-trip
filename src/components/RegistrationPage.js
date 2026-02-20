import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { validateRegistrationForm } from '../utils/validation';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    licenseNumber: '',
    driveType: '',
    carName: '',
    carModel: '',
    numberOfSeats: '',
    carType: '',
    location: '',
    carPhoto: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateRegistrationForm(formData, userType);

    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        userType,
        ...(userType === 'driver' && {
          licenseNumber: formData.licenseNumber,
          driveType: formData.driveType,
          carName: formData.carName,
          carModel: formData.carModel,
          numberOfSeats: formData.numberOfSeats,
          carType: formData.carType,
          location: formData.location,
          carPhoto: formData.carPhoto
        })
      };

      const response = await axios.post('http://localhost:5000/api/register', registrationData);

      if (response.data.success) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setErrors({ submit: response.data.message });
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          {userType === 'customer' ? '👤 Join as Customer' : '🚗 Become a Driver'}
        </h2>

        <div className="user-type-selector">
          <button
            className={`user-type-btn ${userType === 'customer' ? 'active' : ''}`}
            onClick={() => handleUserTypeChange('customer')}
            type="button"
          >
            Customer
          </button>
          <button
            className={`user-type-btn ${userType === 'driver' ? 'active' : ''}`}
            onClick={() => handleUserTypeChange('driver')}
            type="button"
          >
            Driver
          </button>
        </div>

        {successMessage && (
          <div className="success-message" style={{ textAlign: 'center', marginBottom: '1rem', color: '#28a745', fontWeight: 'bold' }}>
            ✓ {successMessage}
          </div>
        )}

        {errors.submit && (
          <div className="error-message" style={{ textAlign: 'center', marginBottom: '1rem', color: '#dc3545', fontWeight: 'bold' }}>
            ✗ {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">👤 Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">✉️ Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">🔒 Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">🔒 Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">📞 Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleInputChange}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          {userType === 'driver' && (
            <>
              <div className="form-group">
                <label className="form-label">🪪 License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  className="form-input"
                  placeholder="Enter your driving license number"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                />
                {errors.licenseNumber && <span className="error-message">{errors.licenseNumber}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">🚗 Drive Type</label>
                <select
                  name="driveType"
                  className="form-input"
                  value={formData.driveType}
                  onChange={handleInputChange}
                >
                  <option value="">Select Drive Type</option>
                  <option value="self-drive">🔑 Self Drive</option>
                  <option value="with-driver">👨‍✈️ With Driver</option>
                </select>
                {errors.driveType && <span className="error-message">{errors.driveType}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">🚙 Car Name</label>
                <input
                  type="text"
                  name="carName"
                  className="form-input"
                  placeholder="e.g., Toyota, Honda, BMW"
                  value={formData.carName}
                  onChange={handleInputChange}
                />
                {errors.carName && <span className="error-message">{errors.carName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">📋 Car Model</label>
                <input
                  type="text"
                  name="carModel"
                  className="form-input"
                  placeholder="e.g., Camry, Civic, X5"
                  value={formData.carModel}
                  onChange={handleInputChange}
                />
                {errors.carModel && <span className="error-message">{errors.carModel}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">🪑 Number of Seats</label>
                <select
                  name="numberOfSeats"
                  className="form-input"
                  value={formData.numberOfSeats}
                  onChange={handleInputChange}
                >
                  <option value="">Select Number of Seats</option>
                  <option value="2">2 Seats</option>
                  <option value="4">4 Seats</option>
                  <option value="5">5 Seats</option>
                  <option value="7">7 Seats</option>
                  <option value="8">8 Seats</option>
                </select>
                {errors.numberOfSeats && <span className="error-message">{errors.numberOfSeats}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">� Car Type</label>
                <select
                  name="carType"
                  className="form-input"
                  value={formData.carType}
                  onChange={handleInputChange}
                >
                  <option value="">Select Car Type</option>
                  <option value="sedan">🚗 Sedan</option>
                  <option value="suv">🚙 SUV</option>
                  <option value="hatchback">🚐 Hatchback</option>
                  <option value="luxury">🏎️ Luxury</option>
                  <option value="convertible">🚘 Convertible</option>
                  <option value="minivan">🚐 Minivan</option>
                </select>
                {errors.carType && <span className="error-message">{errors.carType}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">📍 Driver/Car Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-input"
                  placeholder="e.g., MG Road, Bangalore"
                  value={formData.location}
                  onChange={handleInputChange}
                />
                {errors.location && <span className="error-message">{errors.location}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">📸 Car Photo URL</label>
                <input
                  type="url"
                  name="carPhoto"
                  className="form-input"
                  placeholder="Enter link to car image"
                  value={formData.carPhoto}
                  onChange={handleInputChange}
                />
                {errors.carPhoto && <span className="error-message">{errors.carPhoto}</span>}
              </div>
            </>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? '⏳ Registering...' : `✓ Register as ${userType === 'customer' ? 'Customer' : 'Driver'}`}
          </button>
        </form>

        <div className="link-text">
          Already have an account? <a href="/login">Login here</a>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
