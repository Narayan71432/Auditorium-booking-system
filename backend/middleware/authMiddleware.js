const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  console.log('Authentication Middleware - Incoming Request');
  console.log('Headers:', req.headers);

  // Get token from header
  const authHeader = req.header('Authorization');
  console.log('Authorization Header:', authHeader);

  const token = authHeader?.replace('Bearer ', '');

  // Check if no token
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    console.log('Verifying token with secret:', process.env.JWT_SECRET ? 'Secret exists' : 'No secret found');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);

    // Find user and attach to request
    const user = await User.findById(decoded.userId).select('-password');
    console.log('User Search Details:');
    console.log('Decoded UserId:', decoded.userId);
    console.log('Found User:', user ? {
        _id: user._id,
        username: user.username,
        role: user.role
    } : 'No user found');

    if (!user) {
        console.log('User not found for token');
        return res.status(401).json({ 
            message: 'User not found', 
            details: {
                decodedUserId: decoded.userId,
                tokenPayload: decoded
            }
        });
    }

    // Add user to request object
    req.user = user;
    console.log('Authentication successful');
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }

    res.status(401).json({ 
      message: 'Token is not valid',
      error: error.message 
    });
  }
};

// Restrict access to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log('Role Restriction Middleware');
    console.log('Allowed Roles:', roles);
    console.log('User Role:', req.user?.role);

    // Check if user's role is in the allowed roles
    if (!req.user || !roles.includes(req.user.role)) {
      console.log('Access Denied');
      return res.status(403).json({ 
        message: 'You do not have permission to perform this action' 
      });
    }
    
    console.log('Role check passed');
    next();
  };
};
