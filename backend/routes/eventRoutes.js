const express = require('express');
const router = express.Router();
const { 
    createEvent, 
    listEvents, 
    approveEvent, 
    rejectEvent,
    checkAvailability  
} = require('../controllers/eventController');
const { 
    protect, 
    restrictTo 
} = require('../middleware/authMiddleware');

// Logging middleware for event routes
router.use((req, res, next) => {
    console.log(`Event Route: ${req.method} ${req.path}`);
    console.log('Request Body:', req.body);
    console.log('Request Query:', req.query);
    next();
});

// Create a new event (only authenticated users)
router.post('/create', 
    protect, 
    createEvent
);

// List events (only authenticated users)
router.get('/list', 
    protect, 
    listEvents
);

// Approve an event (only admin)
router.patch('/:id/approve', 
    protect, 
    restrictTo('admin'), 
    approveEvent
);

// Reject an event (only admin)
router.patch('/:id/reject', 
    protect, 
    restrictTo('admin'), 
    rejectEvent
);

// Check hall availability for a specific date
router.get('/check-availability', 
    protect, 
    checkAvailability
);

module.exports = router;
