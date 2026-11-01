const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const Report = require('../models/Report');
const User = require('../models/User');

test('Phase 5 - Report model validates allowed reporting reasons', () => {
  const validReasons = [
    'fee_scam_asking_for_money',
    'fraudulent_job_offer',
    'misleading_information',
    'inappropriate_offensive_content',
    'expired_position',
    'other'
  ];

  for (const reason of validReasons) {
    const report = new Report({
      job: new mongoose.Types.ObjectId(),
      reportedBy: new mongoose.Types.ObjectId(),
      reason,
      details: 'Employer asking for 500 ETB registration fee via CBE Birr before interview.'
    });

    const err = report.validateSync();
    assert.equal(err, undefined, `Reason "${reason}" should be valid for Report schema`);
  }
});

test('Phase 5 - Report model rejects invalid reason', () => {
  const report = new Report({
    job: new mongoose.Types.ObjectId(),
    reportedBy: new mongoose.Types.ObjectId(),
    reason: 'invalid_scam_type',
    details: 'Testing invalid reason'
  });

  const err = report.validateSync();
  assert.ok(err, 'Report should fail validation with invalid reason');
  assert.ok(err.errors.reason);
});

test('Phase 5 - Report model requires job and reportedBy references', () => {
  const emptyReport = new Report({
    reason: 'fee_scam_asking_for_money'
  });

  const err = emptyReport.validateSync();
  assert.ok(err);
  assert.ok(err.errors.job, 'Job ID is required');
  assert.ok(err.errors.reportedBy, 'ReportedBy User ID is required');
});

test('Phase 5 - Report model defaults status to pending and supports valid statuses', () => {
  const report = new Report({
    job: new mongoose.Types.ObjectId(),
    reportedBy: new mongoose.Types.ObjectId(),
    reason: 'fraudulent_job_offer'
  });

  assert.equal(report.status, 'pending');

  const validStatuses = ['pending', 'investigating', 'resolved', 'dismissed'];
  for (const st of validStatuses) {
    report.status = st;
    const err = report.validateSync();
    assert.equal(err, undefined, `Status "${st}" should be allowed`);
  }

  report.status = 'invalid_state';
  const invalidErr = report.validateSync();
  assert.ok(invalidErr);
  assert.ok(invalidErr.errors.status);
});

test('Phase 5 - Report schema defines unique compound index on { job: 1, reportedBy: 1 }', () => {
  const indexes = Report.schema.indexes();
  const duplicatePreventionIndex = indexes.find(([fields, opts]) => 
    fields.job === 1 && fields.reportedBy === 1 && opts && opts.unique === true
  );

  assert.ok(duplicatePreventionIndex, 'Schema must have unique compound index on { job: 1, reportedBy: 1 }');
});

test('Phase 5 - User schema supports employer verification documents and verificationStatus', () => {
  const user = new User({
    name: 'Almaz Tefera',
    email: 'almaz@habeshatech.com',
    password: 'Password123!',
    role: 'employer',
    taxIdNumber: 'TIN-009823412',
    businessLicenseUrl: 'https://storage.ethiojobs.et/licenses/habesha_tech.pdf',
    verificationStatus: 'pending',
    isVerified: false
  });

  assert.equal(user.taxIdNumber, 'TIN-009823412');
  assert.equal(user.businessLicenseUrl, 'https://storage.ethiojobs.et/licenses/habesha_tech.pdf');
  assert.equal(user.verificationStatus, 'pending');
  assert.equal(user.isVerified, false);

  const err = user.validateSync();
  assert.equal(err, undefined);
});

test('Phase 5 - Job routes include POST /:id/report for scam and fraud reporting', () => {
  const jobRoutes = require('../routes/jobRoutes');
  const stack = jobRoutes.stack.map(layer => ({
    path: layer.route?.path,
    methods: layer.route ? Object.keys(layer.route.methods) : []
  })).filter(r => r.path);

  const reportRoute = stack.find(s => s.path === '/:id/report' && s.methods.includes('post'));
  assert.ok(reportRoute, 'POST /:id/report endpoint must be registered in jobRoutes');
});

test('Phase 5 - Admin routes include GET and PUT for moderation reports', () => {
  const adminRoutes = require('../routes/adminRoutes');
  const stack = adminRoutes.stack.map(layer => ({
    path: layer.route?.path,
    methods: layer.route ? Object.keys(layer.route.methods) : []
  })).filter(r => r.path);

  const getReportsRoute = stack.find(s => s.path === '/reports' && s.methods.includes('get'));
  assert.ok(getReportsRoute, 'GET /reports endpoint must be registered in adminRoutes');

  const putReportStatusRoute = stack.find(s => s.path === '/reports/:id' && s.methods.includes('put'));
  assert.ok(putReportStatusRoute, 'PUT /reports/:id endpoint must be registered in adminRoutes');
});
