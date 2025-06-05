const Event = require('../models/Event');
const User = require('../models/User');

// Create a new event
exports.createEvent = async (req, res, next) => {
    try {
        console.log('Create Event Request Body:', req.body);
        console.log('Authenticated User:', req.user);

        // Extract event details from request body
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

        // Validate required fields
        const requiredFields = [
            'coordinatorName', 'coordinatorNumber', 
            'speakerName', 'speakerNumber', 
            'department', 'topic', 
            'hall', 'requiredAttendance', 
            'startDate', 'endDate'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Convert dates to Date objects
        const eventStartDate = new Date(startDate);
        const eventEndDate = new Date(endDate);

        // Check for time slot availability
        const conflictingEvents = await Event.find({
            hall: hall,
            status: { $ne: 'Rejected' }, // Exclude rejected events
            $or: [
                // New event starts during an existing event
                { 
                    startDate: { $lt: eventEndDate }, 
                    endDate: { $gt: eventStartDate } 
                },
                // New event completely contains an existing event
                { 
                    startDate: { $gte: eventStartDate }, 
                    endDate: { $lte: eventEndDate } 
                },
                // Existing event completely contains the new event
                { 
                    startDate: { $lte: eventStartDate }, 
                    endDate: { $gte: eventEndDate } 
                }
            ]
        });

        // If conflicting events exist, return an error
        if (conflictingEvents.length > 0) {
            return res.status(400).json({
                message: 'Time slot is not available. Please choose another date.',
                conflictingEvents: conflictingEvents.map(event => ({
                    topic: event.topic,
                    startDate: event.startDate,
                    endDate: event.endDate,
                    status: event.status
                }))
            });
        }

        // Get the user ID from the authenticated request
        const createdBy = req.user._id;

        // Create new event
        const newEvent = new Event({
            coordinatorName,
            coordinatorNumber,
            speakerName,
            speakerNumber,
            department,
            topic,
            hall,
            requiredAttendance: Number(requiredAttendance),
            startDate: eventStartDate,
            endDate: eventEndDate,
            createdBy,
            status: 'Pending'
        });

        // Save the event
        const savedEvent = await newEvent.save();

        // Respond with saved event
        res.status(201).json({
            message: 'Event created successfully',
            event: savedEvent
        });
    } catch (error) {
        console.error('Event creation error:', error);
        next(error);
    }
};

// Get all events (with optional filtering)
exports.listEvents = async (req, res, next) => {
    try {
        // Log the authenticated user details
        console.group('List Events Request');
        console.log('Authenticated User:', {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role
        });

        const { status, department } = req.query;

        // Build query object with extensive logging
        console.log('Query Parameters Received:');
        console.log('Status:', status);
        console.log('Department:', department);

        const query = {};
        if (status) query.status = status;
        if (department) query.department = department;

        console.log('Constructed Query Object:', query);

        // Find events based on query and populate user details
        const events = await Event.find(query)
            .populate('createdBy', 'username email') // Only select username and email
            .sort({ createdAt: -1 }); // Sort by most recent first

        console.log('Total Events Found:', events.length);
        
        // Detailed logging of each event
        console.log('Events Details:');
        events.forEach((event, index) => {
            console.group(`Event ${index + 1}`);
            console.log('Event ID:', event._id);
            console.log('Topic:', event.topic);
            console.log('Status:', event.status);
            console.log('Department:', event.department);
            console.log('Start Date:', event.startDate);
            console.log('End Date:', event.endDate);
            console.log('Created By:', event.createdBy ? 
                `${event.createdBy.username} (${event.createdBy.email})` : 
                'No creator information'
            );
            console.groupEnd();
        });

        console.groupEnd();

        res.status(200).json(events);
    } catch (error) {
        console.group('List Events Error');
        console.error('Error listing events:', error);
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        
        // Log additional error details if available
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
        console.groupEnd();

        next(error);
    }
};

// Approve an event
exports.approveEvent = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find and update the event
        const event = await Event.findByIdAndUpdate(
            id, 
            { status: 'Approved' }, 
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({
            message: 'Event approved successfully',
            event
        });
    } catch (error) {
        console.error('Error approving event:', error);
        next(error);
    }
};

// Reject an event
exports.rejectEvent = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find and update the event
        const event = await Event.findByIdAndUpdate(
            id, 
            { status: 'Rejected' }, 
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({
            message: 'Event rejected successfully',
            event
        });
    } catch (error) {
        console.error('Error rejecting event:', error);
        next(error);
    }
};

// Check hall availability for a specific date
exports.checkAvailability = async (req, res, next) => {
    try {
        const { 
            date, 
            hall, 
            coordinatorName, 
            speakerName, 
            department, 
            topic 
        } = req.query;

        // Validate input
        if (!date || !hall) {
            return res.status(400).json({ 
                message: 'Date and hall are required' 
            });
        }

        // Convert input date to Date object
        const checkDate = new Date(date);
        
        // Set time to start and end of the day
        const startOfDay = new Date(checkDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(checkDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Build query object for detailed checking
        const query = {
            hall: hall,
            status: { $ne: 'Rejected' }, // Exclude rejected events
            $or: [
                // Event starts within the selected day
                { 
                    startDate: { $gte: startOfDay, $lte: endOfDay } 
                },
                // Event ends within the selected day
                { 
                    endDate: { $gte: startOfDay, $lte: endOfDay } 
                },
                // Event spans the entire selected day
                { 
                    startDate: { $lte: startOfDay },
                    endDate: { $gte: endOfDay }
                }
            ]
        };

        // Add optional filters if provided
        if (coordinatorName) {
            query.coordinatorName = { $regex: new RegExp(coordinatorName, 'i') };
        }
        if (speakerName) {
            query.speakerName = { $regex: new RegExp(speakerName, 'i') };
        }
        if (department) {
            query.department = { $regex: new RegExp(department, 'i') };
        }
        if (topic) {
            query.topic = { $regex: new RegExp(topic, 'i') };
        }

        // Check for conflicting events
        const conflictingEvents = await Event.find(query);
        
        // Check if there are any approved events
        const approvedEvents = conflictingEvents.filter(event => event.status === 'Approved');
        
        // Prepare response
        if (conflictingEvents.length > 0) {
            return res.status(200).json({
                // Only mark as unavailable if there are approved events
                available: approvedEvents.length === 0,
                message: approvedEvents.length > 0 
                    ? 'Hall is not available on the selected date due to approved events.' 
                    : 'Hall has pending events but may be available.',
                conflictingEvents: conflictingEvents.map(event => ({
                    _id: event._id,
                    topic: event.topic,
                    coordinatorName: event.coordinatorName,
                    speakerName: event.speakerName,
                    department: event.department,
                    startDate: event.startDate,
                    endDate: event.endDate,
                    status: event.status,
                    hall: event.hall
                })),
                hasApprovedEvents: approvedEvents.length > 0
            });
        }

        // Hall is available
        res.status(200).json({
            available: true,
            message: 'Hall is available on the selected date.'
        });
    } catch (error) {
        console.error('Availability check error:', error);
        res.status(500).json({ 
            message: 'Error checking availability', 
            error: error.message 
        });
    }
};
