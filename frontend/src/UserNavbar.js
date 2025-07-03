import React, { useState } from 'react';
import { Container, Nav, Navbar as BootstrapNavbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const UserNavbar = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false); // Track navbar state

  const handleLogout = () => {
    onLogout();
    navigate('/Login');
    setExpanded(false); // Collapse navbar
  };

  const handleNavClick = () => {
    setExpanded(false); // Collapse navbar when link is clicked
  };

  return (
    <BootstrapNavbar
      bg="dark"
      variant="dark"
      expand="lg"
      fixed="top"
      className="custom-navbar"
      expanded={expanded}
      onToggle={() => setExpanded((prev) => !prev)}
    >
      <Container fluid>
        <BootstrapNavbar.Brand as={Link} to="/" className="me-4" onClick={handleNavClick}>
          Home
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          {/* Left side: Navigation links */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/BookingCalendar" onClick={handleNavClick}>
              Calendar
            </Nav.Link>
            <Nav.Link as={Link} to="/EventForm" onClick={handleNavClick}>
              Event Details
            </Nav.Link>
            <Nav.Link as={Link} to="/CalendarComponent" onClick={handleNavClick}>
              Calendar Component
            </Nav.Link>
          </Nav>

          {/* Right side: Logout button */}
          {isLoggedIn && (
            <Nav className="ms-auto">
              <Nav.Link onClick={handleLogout} className="nav-link logout-button">
                Logout
              </Nav.Link>
            </Nav>
          )}
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default UserNavbar;
