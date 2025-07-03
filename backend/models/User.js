const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { 
  timestamps: true,
  autoIndex: true 
});

// Explicitly drop any existing indexes
UserSchema.index({ username: 1, role: 1 }, { unique: false });

module.exports = mongoose.model('User', UserSchema);
