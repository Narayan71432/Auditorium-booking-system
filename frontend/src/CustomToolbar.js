import React from 'react';
import './CustomToolbar.css';

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToToday = () => {
    toolbar.onNavigate('TODAY');
  };

  const handleViewChange = (view) => {
    toolbar.onView(view);
  };

  return (
    <div className="custom-toolbar">
      <div className="toolbar-navigation">
        <button onClick={goToBack}>Previous</button>
        <button onClick={goToToday}>Today</button>
        <button onClick={goToNext}>Next</button>
      </div>
      <div className="toolbar-label">{toolbar.label}</div>
      <div className="toolbar-views">
        <button 
          onClick={() => handleViewChange('month')} 
          className={toolbar.view === 'month' ? 'active' : ''}
        >
          Month
        </button>
        <button 
          onClick={() => handleViewChange('week')} 
          className={toolbar.view === 'week' ? 'active' : ''}
        >
          Week
        </button>
        <button 
          onClick={() => handleViewChange('day')} 
          className={toolbar.view === 'day' ? 'active' : ''}
        >
          Day
        </button>
        <button 
          onClick={() => handleViewChange('agenda')} 
          className={toolbar.view === 'agenda' ? 'active' : ''}
        >
          Agenda
        </button>
      </div>
    </div>
  );
};

export default CustomToolbar;
