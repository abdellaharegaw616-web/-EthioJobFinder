const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Report must be linked to a job']
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Report must specify the reporting user']
  },
  reason: {
    type: String,
    enum: [
      'fee_scam_asking_for_money',
      'fraudulent_job_offer',
      'misleading_information',
      'inappropriate_offensive_content',
      'expired_position',
      'other'
    ],
    required: [true, 'Please specify the reason for reporting']
  },
  details: {
    type: String,
    maxlength: [1000, 'Details cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'dismissed'],
    default: 'pending'
  },
  adminNotes: {
    type: String
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Prevent duplicate reports for the same vacancy by the same user
reportSchema.index({ job: 1, reportedBy: 1 }, { unique: true });

module.exports = mongoose.model('Report', reportSchema);
