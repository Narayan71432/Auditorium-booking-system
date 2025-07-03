import React, { useEffect } from 'react';
import { useZoom } from './context/ZoomContext';
// Direct import of App causes circular dependency, import components directly

/**
 * AppWrapper component to handle app-wide touch gestures for zooming
 */
const AppWrapper = (props) => {
  const { 
    handleTouchStart, 
    handleTouchMove, 
    handleTouchEnd, 
    isTouching 
  } = useZoom();

  // Add touch handlers to the entire document
  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div className={isTouching ? 'app-wrapper touching' : 'app-wrapper'}>
      {/* Render children instead of directly importing App */}
      {/* This avoids circular dependency */}
      {React.Children.only(props.children)}
    </div>
  );
};

export default AppWrapper;
