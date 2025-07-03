const express = require('express');
const router = express.Router();
const { register, login, getAllUsers } = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const Event = require('../models/Event');
const User = require('../models/User');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (admin only)
router.get('/users', protect, restrictTo('admin'), getAllUsers);

// New route for event submission
router.post('/events', protect, async (req, res) => {
  try {
    const { 
      coordinatorName, 
      coordinatorNumber, 
      speakerName, 
      speakerNumber, 
      department, 
      topic, 
      hall, 
      requiredAttendance, 
      startDate, 
      endDate 
    } = req.body;

    // Get the current logged-in user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new event
    const newEvent = new Event({
      coordinatorName, 
      coordinatorNumber, 
      speakerName, 
      speakerNumber, 
      department, 
      topic, 
      hall, 
      requiredAttendance, 
      startDate, 
      endDate,
      createdBy: user._id,
      status: 'Pending'
    });

    // Save the event to the database
    await newEvent.save();

    res.status(201).json({ 
      message: 'Event submitted successfully', 
      event: newEvent 
    });
  } catch (error) {
    console.error('Error submitting event:', error);
    res.status(500).json({ 
      message: 'Failed to submit event', 
      error: error.message 
    });
  }
});

module.exports = router;
