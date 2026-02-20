import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeDashboard.css';

const WelcomeDashboard = () => {
  const navigate = useNavigate();
  const [currentScene, setCurrentScene] = useState('globe');
  const [showFeatures, setShowFeatures] = useState(false);
  const globeRef = useRef(null);
  const carRef = useRef(null);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentScene('driving');
    }, 2000);

    const timer2 = setTimeout(() => {
      setCurrentScene('transition');
    }, 8000);

    const timer3 = setTimeout(() => {
      setCurrentScene('app');
      setShowFeatures(true);
    }, 10000);

    const timer4 = setTimeout(() => {
      setCurrentScene('final');
    }, 15000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const handleStartAdventure = () => {
    navigate('/register');
  };

  return (
    <div className="welcome-dashboard">
      {/* YouTube Background */}
      <iframe
        className="youtube-background"
        src="https://www.youtube.com/embed/Auuf4lTvtSw?autoplay=1&mute=1&controls=0&loop=1&playlist=Auuf4lTvtSw&showinfo=0&rel=0&modestbranding=1"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      {/* 3D Globe Scene */}
      <div className={`scene globe-scene ${currentScene === 'globe' || currentScene === 'driving' ? 'active' : ''}`}>
        <div className="space-background">
          <div className="stars"></div>
          <div className="stars stars2"></div>
          <div className="stars stars3"></div>
        </div>

        <div className="globe-container" ref={globeRef}>
          <div className="globe">
            <div className="globe-surface">
              <div className="continent continent1"></div>
              <div className="continent continent2"></div>
              <div className="continent continent3"></div>
              <div className="glowing-road"></div>
            </div>
          </div>

          <div className={`car-driving ${currentScene === 'driving' ? 'active' : ''}`} ref={carRef}>
            <div className="car">
              <div className="car-body"></div>
              <div className="car-window"></div>
              <div className="car-wheel wheel1"></div>
              <div className="car-wheel wheel2"></div>
              <div className="car-wheel wheel3"></div>
              <div className="car-wheel wheel4"></div>
              <div className="glowing-trail"></div>
            </div>
          </div>
        </div>

        <div className={`welcome-text ${currentScene !== 'globe' ? 'fade-out' : ''}`}>
          <h1 className="main-title">Welcome to Rent My Trip</h1>
          <p className="subtitle">Your Journey, Your Choice</p>
        </div>
      </div>

      {/* Transition Scene */}
      <div className={`scene transition-scene ${currentScene === 'transition' ? 'active' : ''}`}>
        <div className="phone-container">
          <div className="smartphone">
            <div className="phone-screen">
              <div className="app-interface">
                <div className="app-logo">🚗</div>
                <h3>Rent My Trip</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* App Features Scene */}
      <div className={`scene app-scene ${currentScene === 'app' ? 'active' : ''}`}>
        <div className="app-showcase">
          <div className={`feature ${showFeatures ? 'show' : ''}`} style={{ animationDelay: '0.5s' }}>
            <div className="feature-icon">🚙</div>
            <h4>Easy Vehicle Rentals</h4>
            <p>Choose from our wide range of vehicles</p>
          </div>

          <div className={`feature ${showFeatures ? 'show' : ''}`} style={{ animationDelay: '1s' }}>
            <div className="feature-icon">🗺️</div>
            <h4>Customized Travel Packages</h4>
            <p>Tailored packages for your perfect trip</p>
          </div>

          <div className={`feature ${showFeatures ? 'show' : ''}`} style={{ animationDelay: '1.5s' }}>
            <div className="feature-icon">💰</div>
            <h4>Affordable Pricing</h4>
            <p>Best rates guaranteed for every budget</p>
          </div>

          <div className={`feature ${showFeatures ? 'show' : ''}`} style={{ animationDelay: '2s' }}>
            <div className="feature-icon">📱</div>
            <h4>One-Click Booking</h4>
            <p>Book your ride instantly with our app</p>
          </div>
        </div>

        <div className="travelers-showcase">
          <div className="traveler traveler1">🧑‍🎤</div>
          <div className="traveler traveler2">👩‍💼</div>
          <div className="traveler traveler3">🧑‍🎓</div>
        </div>
      </div>

      {/* Final Scene */}
      <div className={`scene final-scene ${currentScene === 'final' ? 'active' : ''}`}>
        <div className="sunset-background"></div>
        <div className="final-car">
          <div className="car-silhouette"></div>
        </div>

        <div className="final-logo">
          <h1 className="logo-text">Rent My Trip</h1>
          <p className="logo-subtitle">Start Your Adventure Today</p>
          <button className="adventure-btn" onClick={handleStartAdventure}>
            🚀 Start Your Adventure
          </button>
        </div>
      </div>

      {/* Background Music Indicator */}
      <div className="music-indicator">
        <div className="music-note">🎵</div>
        <span>Inspiring Journey</span>
      </div>

      {/* Admin Access */}
      <div className="admin-access">
        <a href="/admin-login" className="admin-link">
          🔐 Admin Access
        </a>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
