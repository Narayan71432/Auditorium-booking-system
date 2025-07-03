const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ 
      $or: [
        { username },
        { email }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this username or email already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    // Save user to database
    await user.save();

    res.status(201).json({ 
      message: 'User registered successfully',
      user: { 
        username: user.username, 
        email: user.email, 
        role: user.role 
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    console.log('Login attempt:', { username, role });
    console.log('Received password:', password);

    // Just look for user by username only first
    const user = await User.findOne({ username });
    console.log('User found:', user ? { id: user._id, username: user.username, role: user.role } : null);

    if (!user) {
      console.log('No user found with this username');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Now check if this is an admin trying to log in
    if (role === 'admin') {
      // For admin role, strictly check that the user has admin role
      if (user.role !== 'admin') {
        console.log('User exists but is not an admin');
        return res.status(400).json({ message: 'This account does not have admin privileges' });
      }
    } else if (user.role !== role) {
      // For non-admin roles, also verify role match
      console.log(`User exists but has role ${user.role}, not ${role}`);
      return res.status(400).json({ message: `This account has ${user.role} role, not ${role}` });
    }

    // Check password
    console.log('Stored hashed password:', user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    
    console.log('Password match:', isMatch, ', Invalid credentials , http://localhost:3000/Login');

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      token, 
      role: user.role,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// New function to get all registered users (for admin)
exports.getAllUsers = async (req, res) => {
  try {
    // Only allow admin to fetch all users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
