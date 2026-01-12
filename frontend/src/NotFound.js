import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-animation">
          <div className="error-code">404</div>
          <div className="error-icon">🎭</div>
        </div>
        <h1>Oops! Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div className="not-found-actions">
          <button className="home-button" onClick={() => navigate('/Login')}>
            🏠 Go Home
          </button>
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
