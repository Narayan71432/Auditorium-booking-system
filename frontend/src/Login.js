import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiLogin } from './utils/api';
import './Login.css';

const Login = ({ onLogin }) => {
  const [role, setRole] = useState('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setUsername('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log(`Logging in with username: ${username}, role: ${role}`);
      const response = await apiLogin({
        username,
        password,
        role
      });
      
      const data = response.data;
      console.log('Login successful, data received:', { role: data.role, username: data.username });

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('username', data.username);
      localStorage.setItem('email', data.email || '');

      onLogin(data.role);

      if (data.role === 'admin') {
        navigate('/Registration');
      } else {
        navigate('/CalendarComponent');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to manage your auditorium bookings</p>
        </div>
        
        <div className="role-selection">
          <button
            className={`role-button ${role === 'user' ? 'active' : ''}`}
            onClick={() => handleRoleChange('user')}
          >
            👤 User
          </button>
          <button
            className={`role-button ${role === 'admin' ? 'active' : ''}`}
            onClick={() => handleRoleChange('admin')}
          >
            🛡️ Admin
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
