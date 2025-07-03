import React, { useState, useEffect } from 'react';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import './ZoomControls.css';

// Global zoom level to persist across pages
let globalZoomLevel = 100;

// Set up global touch zoom handler
const setupGlobalTouchZoom = (setZoomLevel) => {
  let lastDistance = null;

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      lastDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && lastDistance !== null) {
      const newDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      const deltaDistance = newDistance - lastDistance;
      const zoomChange = deltaDistance * 0.2;
      
      setZoomLevel(prevZoom => {
        const newZoom = Math.max(70, Math.min(150, prevZoom + zoomChange));
        globalZoomLevel = newZoom; // Store in global variable
        return newZoom;
      });
      
      lastDistance = newDistance;
    }
  };

  const handleTouchEnd = () => {
    lastDistance = null;
  };

  document.addEventListener('touchstart', handleTouchStart, { passive: false });
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('touchend', handleTouchEnd);
  
  return () => {
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };
};

// Initialize the global zoom on app start
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.zoom = `${globalZoomLevel}%`;
});

const ZoomControls = ({ showOnLogin = false }) => {
  // Initialize with global zoom level if available, otherwise use 100
  const [zoomLevel, setZoomLevel] = useState(globalZoomLevel); 

  // Apply zoom level to body and update global variable
  useEffect(() => {
    document.body.style.zoom = `${zoomLevel}%`;
    globalZoomLevel = zoomLevel; // Update global zoom level
  }, [zoomLevel]);

  // Setup global touch zoom handlers
  useEffect(() => {
    return setupGlobalTouchZoom(setZoomLevel);
  }, []);

  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 150));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 70));
  const resetZoom = () => setZoomLevel(100);

  return (
    <div className="global-zoom-controls">
      <button className="zoom-btn" onClick={zoomOut} title="Zoom Out">
        <ZoomOutIcon />
      </button>
      <span className="zoom-level">{zoomLevel}%</span>
      <button className="zoom-btn" onClick={zoomIn} title="Zoom In">
        <ZoomInIcon />
      </button>
      <button className="zoom-btn reset-btn" onClick={resetZoom} title="Reset Zoom">
        <RestartAltIcon />
      </button>
    </div>
  );
};

export default ZoomControls;
