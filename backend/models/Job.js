const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
    trim: true,
    maxlength: [100, 'Job title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a job description']
  },
  company: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Please provide job location'],
    trim: true
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
    required: [true, 'Please specify job type']
  },
  category: {
    type: String,
    required: [true, 'Please specify job category'],
    enum: ['IT & Software', 'Engineering', 'Business', 'Marketing', 'Sales', 
           'Finance', 'Healthcare', 'Education', 'Hospitality', 'Other']
  },
  salary: {
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    currency: {
      type: String,
      default: 'ETB'
    },
    negotiable: {
      type: Boolean,
      default: false
    }
  },
  requirements: [{
    type: String,
    required: [true, 'Please provide job requirements']
  }],
  responsibilities: [{
    type: String
  }],
  benefits: [{
    type: String
  }],
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'executive'],
    default: 'entry'
  },
  educationRequired: {
    type: String
  },
  skillsRequired: [{
    type: String
  }],
  deadline: {
    type: Date
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  workArrangement: {
    type: String,
    enum: ['on-site', 'remote', 'hybrid'],
    default: 'on-site'
  },
  views: {
    type: Number,
    default: 0
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculating if job deadline has passed
jobSchema.virtual('isExpired').get(function() {
  if (!this.deadline) return false;
  return new Date(this.deadline) < new Date();
});

// Index for search and filtering
jobSchema.index({ title: 'text', description: 'text', company: 'text', skillsRequired: 'text' });
jobSchema.index({ location: 1, category: 1, status: 1 });
jobSchema.index({ deadline: 1 });

module.exports = mongoose.model('Job', jobSchema);
