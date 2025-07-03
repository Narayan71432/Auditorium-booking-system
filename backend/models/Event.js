const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    coordinatorName: {
        type: String,
        required: true,
        trim: true
    },
    coordinatorNumber: {
        type: String,
        required: true,
        trim: true
    },
    speakerName: {
        type: String,
        required: true,
        trim: true
    },
    speakerNumber: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    topic: {
        type: String,
        required: true,
        trim: true
    },
    hall: {
        type: String,
        required: true,
        trim: true
    },
    requiredAttendance: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', EventSchema);
