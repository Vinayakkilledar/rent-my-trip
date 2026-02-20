import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="video-container">
      <video
        className="video-background"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      
      <div className="video-overlay">
        <h1 className="welcome-title">RENT MY TRIP</h1>
        <p className="welcome-subtitle">
          Your perfect adventure awaits. Rent vehicles and explore the world on your terms
        </p>
        
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className="start-journey-btn" 
            onClick={handleStartJourney}
            style={{ 
              background: 'linear-gradient(45deg, #ff6b6b, #ff8e53)',
              minWidth: '250px'
            }}
          >
            ✨ Start My Journey
          </button>
          
          <button 
            className="start-journey-btn" 
            onClick={handleLogin}
            style={{ 
              background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
              minWidth: '250px'
            }}
          >
            🔑 Login
          </button>
        </div>

        <div style={{ 
          marginTop: '4rem', 
          display: 'flex', 
          gap: '2rem', 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          opacity: 0.9
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚗</div>
            <p style={{ fontSize: '0.9rem' }}>Wide Vehicle Selection</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💳</div>
            <p style={{ fontSize: '0.9rem' }}>Secure Payments</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛡️</div>
            <p style={{ fontSize: '0.9rem' }}>Full Coverage</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⭐</div>
            <p style={{ fontSize: '0.9rem' }}>Top Rated</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
