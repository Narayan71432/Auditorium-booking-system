import React from 'react';
import { Container, Nav, Navbar as BootstrapNavbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar1 = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/Login');
  };

  return (
    <BootstrapNavbar expand="lg" variant="dark" fixed="top" className="custom-navbar">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/Registration">
          Auditorium Hub
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="navbar-nav" />
        <BootstrapNavbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/registration">
              📝 Registration
            </Nav.Link>
            <Nav.Link as={Link} to="/approval">
              ✅ Approval
            </Nav.Link>
            <Nav.Link as={Link} to="/CalendarComponent">
              📅 Calendar
            </Nav.Link>
            {isLoggedIn && (
              <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
                🚪 Logout
              </Nav.Link>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar1;
