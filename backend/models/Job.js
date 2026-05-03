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
  views: {
    type: Number,
    default: 0
  },
  applicationsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search
jobSchema.index({ title: 'text', description: 'text', company: 'text' });

module.exports = mongoose.model('Job', jobSchema);
