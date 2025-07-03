import React from 'react';
import { useZoom } from '../context/ZoomContext';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import '../styles/ZoomControls.css';

const ZoomControls = () => {
  const { zoomLevel, zoomIn, zoomOut, resetZoom } = useZoom();

  return (
    <div className="global-zoom-controls">
      <button 
        className="zoom-btn" 
        onClick={zoomOut}
        title="Zoom Out"
      >
        <ZoomOutIcon />
      </button>
      <span className="zoom-level">{zoomLevel}%</span>
      <button 
        className="zoom-btn" 
        onClick={zoomIn}
        title="Zoom In"
      >
        <ZoomInIcon />
      </button>
      <button 
        className="zoom-btn reset-btn" 
        onClick={resetZoom}
        title="Reset Zoom"
      >
        <RestartAltIcon />
      </button>
    </div>
  );
};

export default ZoomControls;
