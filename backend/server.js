const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Detailed MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  console.error('Connection URI:', process.env.MONGODB_URI);
});

// Logging middleware for routes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Request Body:', req.body);
  next();
});

// Routes debugging middleware
app.use((req, res, next) => {
  console.log('Registered Routes:');
  console.log('Auth Routes:', Object.keys(authRoutes.stack || {}));
  console.log('Event Routes:', Object.keys(eventRoutes.stack || {}));
  next();
});

// Root route for API information
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the MERN App API',
    version: '1.0',
    endpoints: {
      auth: '/api/auth',
      events: '/api/events'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// 404 handler
app.use((req, res, next) => {
  console.log('404 - Route Not Found');
  console.log('Requested URL:', req.originalUrl);
  console.log('Method:', req.method);
  res.status(404).json({
    message: 'Route not found',
    requestedUrl: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  console.error('Error Stack:', err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
const server = app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
  console.log(`Server accessible at: http://localhost:${PORT} or http://${require('os').networkInterfaces()['Wi-Fi'].find(i => i.family === 'IPv4').address}:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

// Error handling
server.on('error', (error) => {
  console.error('Detailed Server Error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please kill the process using this port.`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
  }
});
