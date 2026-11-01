const mongoose = require('mongoose');

const jobAlertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Job alert must belong to a user']
  },
  title: {
    type: String,
    required: [true, 'Please provide an alert name'],
    trim: true,
    maxlength: [100, 'Alert title cannot exceed 100 characters']
  },
  keywords: {
    type: String,
    required: [true, 'Please provide search keywords'],
    trim: true
  },
  location: {
    type: String,
    trim: true,
    default: 'All Ethiopia'
  },
  category: {
    type: String,
    trim: true,
    default: 'All Categories'
  },
  jobType: {
    type: String,
    enum: ['all', 'full-time', 'part-time', 'contract', 'internship', 'remote'],
    default: 'all'
  },
  minSalary: {
    type: Number,
    min: [0, 'Minimum salary cannot be negative'],
    default: 0
  },
  frequency: {
    type: String,
    enum: ['instant', 'daily', 'weekly'],
    default: 'instant'
  },
  emailNotification: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastNotifiedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for active alerts search per user
jobAlertSchema.index({ user: 1, isActive: 1 });
jobAlertSchema.index({ isActive: 1, category: 1, location: 1 });

module.exports = mongoose.model('JobAlert', jobAlertSchema);
