const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Audit log requires the performing admin']
  },
  action: {
    type: String,
    enum: [
      'user_banned',
      'user_unbanned',
      'user_deleted',
      'user_role_changed',
      'employer_verified',
      'employer_rejected',
      'job_deleted',
      'job_featured_toggled',
      'report_resolved',
      'report_dismissed',
      'report_investigating'
    ],
    required: [true, 'Audit action is required']
  },
  targetType: {
    type: String,
    enum: ['User', 'Job', 'Report', 'System'],
    required: [true, 'Audit target type is required']
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId
  },
  targetName: {
    type: String,
    trim: true
  },
  reason: {
    type: String,
    trim: true,
    default: 'Administrative moderation action'
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String
  }
}, {
  timestamps: true
});

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ admin: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
