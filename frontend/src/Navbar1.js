import React, { useState } from 'react';
import { Nav, Navbar as BootstrapNavbar, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar1 = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false); // Control expanded state

  const handleLogout = () => {
    onLogout();
    navigate('/Login');
    setExpanded(false); // Collapse the menu on logout
  };

  const handleNavClick = () => {
    setExpanded(false); // Collapse the menu when any nav link is clicked
  };

  return (
    <BootstrapNavbar
      expand="lg"
      className="custom-navbar"
      expanded={expanded}
      onToggle={() => setExpanded((prev) => !prev)} // Toggle expanded state
    >
      <Container fluid>
        <BootstrapNavbar.Brand as={Link} to="/" className="me-4" onClick={handleNavClick}>
          Home
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          {/* Left side: Registration & Approval */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/registration" className="nav-link" onClick={handleNavClick}>
              Registration
            </Nav.Link>
            <Nav.Link as={Link} to="/approval" className="nav-link" onClick={handleNavClick}>
              Approval
            </Nav.Link>
          </Nav>

          {/* Right side: Logout */}
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

export default Navbar1;
