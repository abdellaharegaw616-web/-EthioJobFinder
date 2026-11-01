const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverLetter: {
    type: String
  },
  resume: {
    type: String,
    required: [true, 'Please provide your resume']
  },
  status: {
    type: String,
    enum: ['pending', 'applied', 'reviewing', 'under_review', 'shortlisted', 'interview_scheduled', 'hired', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  answers: [{
    question: String,
    answer: String
  }],
  notes: {
    type: String
  },
  viewedByEmployer: {
    type: Boolean,
    default: false
  },
  viewedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
