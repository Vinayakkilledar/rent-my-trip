import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { validateLoginForm } from '../utils/validation';

const LoginPage = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('customer');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateLoginForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    
    try {
      const loginData = {
        email: formData.email,
        password: formData.password,
        userType
      };

      const response = await axios.post('http://localhost:5000/api/login', loginData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', userType);
        localStorage.setItem('userName', response.data.user.name);
        
        setSuccessMessage(`Welcome back, ${response.data.user.name}! Redirecting...`);
        
        setTimeout(() => {
          if (userType === 'customer') {
            navigate('/customer-dashboard');
          } else {
            navigate('/driver-dashboard');
          }
        }, 1500);
      } else {
        setErrors({ submit: response.data.message });
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials and try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back 🎉</h2>
        
        <div className="user-type-selector">
          <button
            className={`user-type-btn ${userType === 'customer' ? 'active' : ''}`}
            onClick={() => setUserType('customer')}
            type="button"
          >
            Customer
          </button>
          <button
            className={`user-type-btn ${userType === 'driver' ? 'active' : ''}`}
            onClick={() => setUserType('driver')}
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? '⏳ Logging in...' : `✓ Login as ${userType === 'customer' ? 'Customer' : 'Driver'}`}
          </button>
        </form>

        <div className="link-text">
          Don't have an account? <a href="/register">Register here</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
