import React from 'react';
import { Container, Nav, Navbar as BootstrapNavbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Using the same CSS file

const UserNavbar = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/Login');
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" fixed="top" className="custom-navbar">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">Navbar</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/BookingCalendar">Calendar</Nav.Link>
            <Nav.Link as={Link} to="/EventForm">Event Details</Nav.Link>
            <Nav.Link as={Link} to="/CalendarComponent">Calendar Component</Nav.Link>
            {isLoggedIn && <Nav.Link onClick={handleLogout}>Logout</Nav.Link>}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default UserNavbar;
