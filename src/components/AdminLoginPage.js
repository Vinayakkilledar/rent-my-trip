import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLoginPage.css';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    adminId: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    
    // Reset errors
    setErrors({});
    setLoading(true);

    // Simple validation
    const validationErrors = {};
    if (!formData.adminId.trim()) {
      validationErrors.adminId = 'Admin ID is required';
    }
    if (!formData.password.trim()) {
      validationErrors.password = 'Password is required';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    // Simulate authentication delay
    setTimeout(() => {
      // Check credentials
      if (formData.adminId === 'admin' && formData.password === 'ad123') {
        // Store admin session
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminId', formData.adminId);
        
        alert('Admin login successful!');
        navigate('/admin-dashboard');
      } else {
        setErrors({ submit: 'Invalid Admin ID or Password' });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-card">
        <div className="admin-header">
          <div className="admin-icon">🔐</div>
          <h2 className="admin-title">Admin Portal</h2>
          <p className="admin-subtitle">Rent My Trip Administration</p>
        </div>

        {errors.submit && (
          <div className="error-message" style={{ textAlign: 'center', marginBottom: '1rem', color: '#dc3545', fontWeight: 'bold' }}>
            ✗ {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label className="form-label">🆔 Admin ID</label>
            <input
              type="text"
              name="adminId"
              className="form-input"
              placeholder="Enter Admin ID"
              value={formData.adminId}
              onChange={handleInputChange}
              autoComplete="username"
            />
            {errors.adminId && <span className="error-text">{errors.adminId}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">🔒 Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="current-password"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button 
            type="submit" 
            className="admin-submit-btn"
            disabled={loading}
          >
            {loading ? '🔄 Authenticating...' : '🚀 Login to Admin Panel'}
          </button>
        </form>

        <div className="admin-footer">
          <div className="security-notice">
            <span className="security-icon">🛡️</span>
            <span>Secure Admin Access</span>
          </div>
          <div className="back-links">
            <a href="/" className="back-link">← Back to Home</a>
            <a href="/login" className="back-link">User Login</a>
          </div>
        </div>

        <div className="admin-info">
          <details>
            <summary style={{ cursor: 'pointer', color: '#666', fontSize: '0.8rem' }}>
              Demo Credentials
            </summary>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#888' }}>
              <p><strong>ID:</strong> admin</p>
              <p><strong>Password:</strong> ad123</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
