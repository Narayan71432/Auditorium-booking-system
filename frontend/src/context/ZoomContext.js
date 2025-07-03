import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context for zoom functionality
export const ZoomContext = createContext();

// Create provider component
export const ZoomProvider = ({ children }) => {
  const [zoomLevel, setZoomLevel] = useState(100); // Initial zoom level

  // Apply zoom level to entire document body
  useEffect(() => {
    document.body.style.zoom = `${zoomLevel}%`;
  }, [zoomLevel]);

  // Set up touch event handlers for pinch-to-zoom
  useEffect(() => {
    let lastDistance = null;

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        // Calculate distance between two fingers
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        lastDistance = distance;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && lastDistance !== null) {
        // Calculate new distance
        const newDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        
        // Calculate how much the distance has changed
        const deltaDistance = newDistance - lastDistance;
        
        // Adjust zoom level based on pinch
        const zoomChange = deltaDistance * 0.2;
        setZoomLevel(prevZoom => {
          const newZoom = Math.max(70, Math.min(150, prevZoom + zoomChange));
          return newZoom;
        });
        
        lastDistance = newDistance;
      }
    };

    const handleTouchEnd = () => {
      lastDistance = null;
    };

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    // Cleanup
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Simple zoom control functions
  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 150));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 70));
  const resetZoom = () => setZoomLevel(100);

  return (
    <ZoomContext.Provider
      value={{
        zoomLevel,
        setZoomLevel,
        zoomIn,
        zoomOut,
        resetZoom
      }}
    >
      {children}
    </ZoomContext.Provider>
  );
};

// Custom hook to use the zoom context
export const useZoom = () => useContext(ZoomContext);
