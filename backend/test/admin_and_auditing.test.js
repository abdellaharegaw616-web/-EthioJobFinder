const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const AuditLog = require('../models/AuditLog');
const Job = require('../models/Job');

test('Phase 7 - AuditLog model requires admin, action, and targetType', () => {
  const log = new AuditLog({});
  const err = log.validateSync();
  assert.ok(err);
  assert.ok(err.errors.admin);
  assert.ok(err.errors.action);
  assert.ok(err.errors.targetType);
});

test('Phase 7 - AuditLog model validates allowed administrative actions', () => {
  const allowedActions = [
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
  ];

  for (const act of allowedActions) {
    const log = new AuditLog({
      admin: new mongoose.Types.ObjectId(),
      action: act,
      targetType: 'User',
      targetName: 'Test Subject',
      reason: 'Audit policy check'
    });
    assert.equal(log.validateSync(), undefined, `Action "${act}" must be valid in AuditLog`);
  }
});

test('Phase 7 - AuditLog model rejects invalid action', () => {
  const log = new AuditLog({
    admin: new mongoose.Types.ObjectId(),
    action: 'invalid_unauthorized_action',
    targetType: 'User'
  });
  const err = log.validateSync();
  assert.ok(err);
  assert.ok(err.errors.action);
});

test('Phase 7 - AuditLog model rejects invalid targetType', () => {
  const log = new AuditLog({
    admin: new mongoose.Types.ObjectId(),
    action: 'user_banned',
    targetType: 'InvalidTargetType'
  });
  const err = log.validateSync();
  assert.ok(err);
  assert.ok(err.errors.targetType);
});

test('Phase 7 - Job model supports isFeatured flag with false default', () => {
  const job = new Job({
    title: 'Senior Solutions Architect',
    description: 'Design cloud services in Addis Ababa.',
    company: 'Ethiopian Artificial Intelligence Institute',
    location: 'Addis Ababa',
    type: 'full-time',
    category: 'IT & Software',
    requirements: ['Architecture experience'],
    postedBy: new mongoose.Types.ObjectId()
  });

  assert.equal(job.isFeatured, false, 'isFeatured should default to false');
  job.isFeatured = true;
  assert.equal(job.isFeatured, true);
  assert.equal(job.validateSync(), undefined);
});

test('Phase 7 - Admin routes declare feature job and audit logs endpoints', () => {
  const adminRoutes = require('../routes/adminRoutes');
  const stack = adminRoutes.stack.map(layer => ({
    path: layer.route?.path,
    methods: layer.route ? Object.keys(layer.route.methods) : []
  })).filter(r => r.path);

  const featureJobRoute = stack.find(s => s.path === '/jobs/:id/feature' && s.methods.includes('put'));
  const auditLogsRoute = stack.find(s => s.path === '/audit-logs' && s.methods.includes('get'));

  assert.ok(featureJobRoute, 'PUT /jobs/:id/feature must be registered in adminRoutes');
  assert.ok(auditLogsRoute, 'GET /audit-logs must be registered in adminRoutes');
});
