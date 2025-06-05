import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Table } from 'react-bootstrap';
import { apiRegister, apiGetUsers } from './utils/api';

const Registration = () => {
  const [role, setRole] = useState('user');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch registered users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiGetUsers();
        setRegisteredUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await apiRegister({
        username,
        email,
        password,
        role
      });

      // Clear form
      setUsername('');
      setEmail('');
      setPassword('');
      setRole('user');

      // Show success message
      setSuccess(response.data.message);

      // Refresh user list
      const usersResponse = await apiGetUsers();
      setRegisteredUsers(usersResponse.data);

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container>
      <h3>Registration Page</h3>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="radio"
            label="User"
            name="role"
            checked={role === 'user'}
            onChange={() => setRole('user')}
          />
          <Form.Check
            type="radio"
            label="Admin"
            name="role"
            checked={role === 'admin'}
            onChange={() => setRole('admin')}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>

      <h4 className="mt-4">Registered Users:</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {registeredUsers.map((user, index) => (
            <tr key={index}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Registration;
