import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomeDashboard from './components/WelcomeDashboard';
import RegistrationPage from './components/RegistrationPage';
import LoginPage from './components/LoginPage';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboard from './components/AdminDashboard';
import TripPlanner from './components/TripPlanner';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomeDashboard />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/trip-planner" element={<TripPlanner />} />
          
          {/* Placeholder routes for dashboards */}
          <Route path="/customer-dashboard" element={
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              flexDirection: 'column'
            }}>
              <h1>Customer Dashboard</h1>
              <p>Welcome! Coming soon...</p>
              <button onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }} style={{
                marginTop: '2rem',
                padding: '10px 20px',
                background: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                Logout
              </button>
            </div>
          } />
          
          <Route path="/driver-dashboard" element={
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              flexDirection: 'column'
            }}>
              <h1>Driver Dashboard</h1>
              <p>Welcome! Coming soon...</p>
              <button onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }} style={{
                marginTop: '2rem',
                padding: '10px 20px',
                background: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                Logout
              </button>
            </div>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
