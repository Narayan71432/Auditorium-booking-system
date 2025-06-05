import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiLogin } from './utils/api';
import './Login.css';

const Login = ({ onLogin }) => {
  const [role, setRole] = useState('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setUsername('');
    setPassword('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Use the corrected apiLogin utility function
      console.log(`Logging in with username: ${username}, role: ${role}`);
      const response = await apiLogin({
        username,
        password,
        role
      });
      
      // Response contains data property from axios
      const data = response.data;
      console.log('Login successful, data received:', { role: data.role, username: data.username });

      // Store token and user details in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('username', data.username);
      localStorage.setItem('email', data.email || '');

      // Call onLogin with the role
      onLogin(data.role);

      // Navigate based on role
      if (data.role === 'admin') {
        navigate('/Registration');
      } else {
        navigate('/CalendarComponent');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div className="role-selection">
        <button
          className={`role-button ${role === 'user' ? 'active' : ''}`}
          onClick={() => handleRoleChange('user')}
        >
          User
        </button>
        <button
          className={`role-button ${role === 'admin' ? 'active' : ''}`}
          onClick={() => handleRoleChange('admin')}
        >
          Admin
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
