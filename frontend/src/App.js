import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login';
import Registration from './Registration';
import CalendarComponent from './CalendarComponent';
import Navbar1 from './Navbar1';
import UserNavbar from './UserNavbar';
import BookingCalendar from './BookingCalendar';
import EventForm from './EventForm';
import Approval from './Approval';
import ZoomControls from './ZoomControls';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role || '');
    }
    setLoading(false);
  }, []);

  const handleLogin = (role) => {
    console.log(`Login successful with role: ${role}`);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    setIsAuthenticated(false);
    setUserRole('');
  };

  // If still loading, show nothing to prevent flicker
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {/* Show Navbar based on user role */}
        {isAuthenticated && userRole === 'admin' && (
          <Navbar1 
            isLoggedIn={isAuthenticated} 
            onLogout={handleLogout} 
          />
        )}
        {isAuthenticated && userRole === 'user' && (
          <UserNavbar 
            isLoggedIn={isAuthenticated} 
            onLogout={handleLogout} 
          />
        )}
        
        {/* Global zoom controls always available */}
        <ZoomControls showOnLogin={!isAuthenticated} />
        
        <Routes>
          <Route 
            path="/Login" 
            element={!isAuthenticated ? 
              <Login onLogin={handleLogin} /> : 
              <Navigate to={userRole === 'admin' ? '/Registration' : '/CalendarComponent'} />
            } 
          />
          <Route 
            path="/Registration" 
            element={isAuthenticated && userRole === 'admin' ? 
              <Registration /> : 
              <Navigate to="/Login" />
            } 
          />
          <Route 
            path="/CalendarComponent" 
            element={isAuthenticated ? 
              <CalendarComponent onLogout={handleLogout} /> : 
              <Navigate to="/Login" />
            } 
          />
          <Route 
            path="/BookingCalendar" 
            element={isAuthenticated && userRole === 'user' ? 
              <BookingCalendar /> : 
              <Navigate to="/Login" />
            } 
          />
          <Route 
            path="/EventForm" 
            element={isAuthenticated && userRole === 'user' ? 
              <EventForm /> : 
              <Navigate to="/Login" />
            } 
          />
          <Route 
            path="/Approval" 
            element={isAuthenticated && userRole === 'admin' ? 
              <Approval /> : 
              <Navigate to="/Login" />
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to="/Login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
