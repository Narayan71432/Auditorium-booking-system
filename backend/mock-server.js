const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data storage
let users = [
  {
    _id: '1',
    username: 'admin',
    password: 'admin123', // In real app, this would be hashed
    email: 'admin@auditorium.com',
    role: 'admin'
  },
  {
    _id: '2',
    username: 'user',
    password: 'user123',
    email: 'user@auditorium.com',
    role: 'user'
  }
];

let events = [
  {
    _id: '1',
    department: 'Department of ComputerScience',
    topic: 'AI and Machine Learning Workshop',
    coordinatorName: 'John Doe',
    coordinatorNumber: '1234567890',
    speakerName: 'Dr. Smith',
    speakerNumber: '0987654321',
    requiredAttendance: 100,
    hall: 'Main Auditorium',
    startDate: new Date('2026-01-15T10:00:00'),
    endDate: new Date('2026-01-15T12:00:00'),
    status: 'Approved',
    createdBy: { username: 'user', _id: '2' }
  },
  {
    _id: '2',
    department: 'Department of Electronics',
    topic: 'IoT Seminar',
    coordinatorName: 'Jane Smith',
    coordinatorNumber: '1112223333',
    speakerName: 'Prof. Johnson',
    speakerNumber: '4445556666',
    requiredAttendance: 75,
    hall: 'Hall B',
    startDate: new Date('2026-01-20T14:00:00'),
    endDate: new Date('2026-01-20T16:00:00'),
    status: 'Pending',
    createdBy: { username: 'user', _id: '2' }
  },
  {
    _id: '3',
    department: 'Department of Mechanical',
    topic: 'Robotics Exhibition',
    coordinatorName: 'Bob Wilson',
    coordinatorNumber: '7778889999',
    speakerName: 'Dr. Brown',
    speakerNumber: '3332221111',
    requiredAttendance: 150,
    hall: 'Main Auditorium',
    startDate: new Date('2026-01-25T09:00:00'),
    endDate: new Date('2026-01-25T11:00:00'),
    status: 'Approved',
    createdBy: { username: 'user', _id: '2' }
  }
];

let eventIdCounter = 4;

// Auth Routes
app.post('/api/auth/login', (req, res) => {
  const { username, password, role } = req.body;
  
  const user = users.find(u => 
    u.username === username && 
    u.password === password && 
    u.role === role
  );
  
  if (user) {
    res.json({
      token: 'mock-jwt-token-' + user._id,
      role: user.role,
      username: user.username,
      email: user.email
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { username, email, password, role } = req.body;
  
  const exists = users.find(u => u.username === username || u.email === email);
  
  if (exists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  const newUser = {
    _id: String(users.length + 1),
    username,
    email,
    password, // In real app, hash this
    role: role || 'user'
  };
  
  users.push(newUser);
  
  res.status(201).json({
    message: 'User registered successfully',
    token: 'mock-jwt-token-' + newUser._id,
    role: newUser.role,
    username: newUser.username,
    email: newUser.email
  });
});

// Event Routes
app.get('/api/events', (req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const newEvent = {
    _id: String(eventIdCounter++),
    ...req.body,
    startDate: new Date(req.body.startDate),
    endDate: new Date(req.body.endDate),
    status: 'Pending',
    createdBy: { username: req.body.createdBy || 'user', _id: '2' }
  };
  
  events.push(newEvent);
  res.status(201).json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const eventIndex = events.findIndex(e => e._id === id);
  
  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }
  
  events[eventIndex] = {
    ...events[eventIndex],
    ...req.body,
    _id: id
  };
  
  res.json(events[eventIndex]);
});

app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  events = events.filter(e => e._id !== id);
  res.json({ message: 'Event deleted successfully' });
});

// Check availability endpoint
app.post('/api/events/check-availability', (req, res) => {
  const { startDate, endDate, hall } = req.body;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const conflicts = events.filter(event => {
    if (event.hall !== hall || event.status !== 'Approved') return false;
    
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    
    return (start < eventEnd && end > eventStart);
  });
  
  if (conflicts.length > 0) {
    res.json({
      available: false,
      message: 'Time slot not available',
      conflicts: conflicts
    });
  } else {
    res.json({
      available: true,
      message: 'Time slot is available'
    });
  }
});

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Auditorium Booking System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/login, /api/auth/register',
      events: '/api/events',
      health: '/api/health'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock server running!' });
});

// 404 for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: '/api'
  });
});

// Serve React frontend build (SPA)
app.use(express.static(path.join(__dirname, '../frontend/build')));

// SPA fallback - send index.html for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Mock Backend Server running on port ${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api`);
  console.log(`\n👤 Test Credentials:`);
  console.log(`   Admin: username="admin", password="admin123"`);
  console.log(`   User:  username="user", password="user123"`);
  console.log(`\n✅ No MongoDB needed!.\n`);
});
