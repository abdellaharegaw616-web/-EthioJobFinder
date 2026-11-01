const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const JobAlert = require('../models/JobAlert');
const Notification = require('../models/Notification');

test('Phase 6 - JobAlert model requires title, keywords, and user', () => {
  const alert = new JobAlert({});
  const err = alert.validateSync();
  assert.ok(err);
  assert.ok(err.errors.title);
  assert.ok(err.errors.keywords);
  assert.ok(err.errors.user);
});

test('Phase 6 - JobAlert model sets expected defaults and validates enum constraints', () => {
  const alert = new JobAlert({
    user: new mongoose.Types.ObjectId(),
    title: 'Senior DevOps in Addis',
    keywords: 'Kubernetes Docker AWS'
  });

  const err = alert.validateSync();
  assert.equal(err, undefined);
  assert.equal(alert.location, 'All Ethiopia');
  assert.equal(alert.category, 'All Categories');
  assert.equal(alert.jobType, 'all');
  assert.equal(alert.frequency, 'instant');
  assert.equal(alert.isActive, true);
  assert.equal(alert.emailNotification, true);
});

test('Phase 6 - JobAlert model validates frequency and jobType enums', () => {
  const validFrequencies = ['instant', 'daily', 'weekly'];
  for (const freq of validFrequencies) {
    const alert = new JobAlert({
      user: new mongoose.Types.ObjectId(),
      title: 'Dev Alert',
      keywords: 'Node',
      frequency: freq
    });
    assert.equal(alert.validateSync(), undefined);
  }

  const invalidAlert = new JobAlert({
    user: new mongoose.Types.ObjectId(),
    title: 'Dev Alert',
    keywords: 'Node',
    frequency: 'yearly_invalid'
  });
  const err = invalidAlert.validateSync();
  assert.ok(err);
  assert.ok(err.errors.frequency);
});

test('Phase 6 - Notification model validates expanded notification types', () => {
  const allowedTypes = [
    'job_alert',
    'application_status',
    'interview_reminder',
    'deadline_reminder',
    'profile_update',
    'new_applicant',
    'verification_status',
    'system'
  ];

  for (const tp of allowedTypes) {
    const notif = new Notification({
      user: new mongoose.Types.ObjectId(),
      type: tp,
      title: `Test Title for ${tp}`,
      message: `Test message content for ${tp}`
    });
    assert.equal(notif.validateSync(), undefined, `Type "${tp}" must be valid in Notification schema`);
    assert.equal(notif.isRead, false);
  }
});

test('Phase 6 - Notification model rejects unsupported type', () => {
  const notif = new Notification({
    user: new mongoose.Types.ObjectId(),
    type: 'unsupported_random_type',
    title: 'Test',
    message: 'Test message'
  });
  const err = notif.validateSync();
  assert.ok(err);
  assert.ok(err.errors.type);
});

test('Phase 6 - Job alert routes are fully declared', () => {
  const jobAlertRoutes = require('../routes/jobAlertRoutes');
  const stack = jobAlertRoutes.stack.map(layer => ({
    path: layer.route?.path,
    methods: layer.route ? Object.keys(layer.route.methods) : []
  })).filter(r => r.path);

  const getAlertsRoute = stack.find(s => s.path === '/' && s.methods.includes('get'));
  const postAlertRoute = stack.find(s => s.path === '/' && s.methods.includes('post'));
  const putAlertRoute = stack.find(s => s.path === '/:id' && s.methods.includes('put'));
  const deleteAlertRoute = stack.find(s => s.path === '/:id' && s.methods.includes('delete'));
  const matchesRoute = stack.find(s => s.path === '/:id/matches' && s.methods.includes('get'));

  assert.ok(getAlertsRoute, 'GET / route must exist on jobAlertRoutes');
  assert.ok(postAlertRoute, 'POST / route must exist on jobAlertRoutes');
  assert.ok(putAlertRoute, 'PUT /:id route must exist on jobAlertRoutes');
  assert.ok(deleteAlertRoute, 'DELETE /:id route must exist on jobAlertRoutes');
  assert.ok(matchesRoute, 'GET /:id/matches route must exist on jobAlertRoutes');
});

test('Phase 6 - Notification routes are fully declared', () => {
  const notificationRoutes = require('../routes/notificationRoutes');
  const stack = notificationRoutes.stack.map(layer => ({
    path: layer.route?.path,
    methods: layer.route ? Object.keys(layer.route.methods) : []
  })).filter(r => r.path);

  const getNotifs = stack.find(s => s.path === '/' && s.methods.includes('get'));
  const markRead = stack.find(s => s.path === '/:id/read' && s.methods.includes('put'));
  const markAllRead = stack.find(s => s.path === '/read-all' && s.methods.includes('put'));
  const deleteNotif = stack.find(s => s.path === '/:id' && s.methods.includes('delete'));

  assert.ok(getNotifs, 'GET / route must exist on notificationRoutes');
  assert.ok(markRead, 'PUT /:id/read route must exist on notificationRoutes');
  assert.ok(markAllRead, 'PUT /read-all route must exist on notificationRoutes');
  assert.ok(deleteNotif, 'DELETE /:id route must exist on notificationRoutes');
});
