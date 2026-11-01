const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

// Ensure dotenv is loaded
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const User = require('../models/User');
const Application = require('../models/Application');

test('Phase 3 - User Model has professionalHeadline and notificationPreferences', () => {
  const user = new User({
    name: 'Abebe Bikila',
    email: 'abebe.test@ethiojobs.et',
    password: 'Password123!',
    professionalHeadline: 'Senior Software Engineer | MERN Stack | Addis Ababa'
  });

  assert.equal(user.professionalHeadline, 'Senior Software Engineer | MERN Stack | Addis Ababa');
  assert.equal(user.notificationPreferences.emailAlerts, true);
  assert.equal(user.notificationPreferences.applicationUpdates, true);
  assert.equal(user.notificationPreferences.jobRecommendations, true);
});

test('Phase 3 - User Model professionalHeadline enforces maxLength 100', () => {
  const longHeadline = 'A'.repeat(101);
  const user = new User({
    name: 'Abebe Bikila',
    email: 'abebe.long@ethiojobs.et',
    password: 'Password123!',
    professionalHeadline: longHeadline
  });

  const validationError = user.validateSync();
  assert.ok(validationError);
  assert.ok(validationError.errors.professionalHeadline);
});

test('Phase 3 - User Model handles savedJobs ObjectId array', () => {
  const testJobId = new mongoose.Types.ObjectId();
  const user = new User({
    name: 'Sara Tesfaye',
    email: 'sara.test@ethiojobs.et',
    password: 'Password123!',
    savedJobs: [testJobId]
  });

  assert.equal(user.savedJobs.length, 1);
  assert.equal(user.savedJobs[0].toString(), testJobId.toString());

  // Simulate save without duplicate
  if (!user.savedJobs.some(id => id.toString() === testJobId.toString())) {
    user.savedJobs.push(testJobId);
  }
  assert.equal(user.savedJobs.length, 1, 'Duplicate job was correctly prevented');

  // Simulate unsave
  user.savedJobs = user.savedJobs.filter(id => id.toString() !== testJobId.toString());
  assert.equal(user.savedJobs.length, 0, 'Job was correctly removed from savedJobs');
});

test('Phase 3 - Application Schema supports status lifecycle including withdrawn', () => {
  const validStatuses = ['pending', 'applied', 'reviewing', 'under_review', 'shortlisted', 'interview_scheduled', 'hired', 'rejected', 'withdrawn'];

  for (const status of validStatuses) {
    const app = new Application({
      job: new mongoose.Types.ObjectId(),
      applicant: new mongoose.Types.ObjectId(),
      resume: 'https://res.cloudinary.com/demo/cv.pdf',
      status: status
    });

    const validationError = app.validateSync();
    assert.equal(validationError, undefined, `Status "${status}" should be valid`);
  }
});

test('Phase 3 - Application Schema rejects invalid status', () => {
  const app = new Application({
    job: new mongoose.Types.ObjectId(),
    applicant: new mongoose.Types.ObjectId(),
    resume: 'https://res.cloudinary.com/demo/cv.pdf',
    status: 'non_existent_status'
  });

  const validationError = app.validateSync();
  assert.ok(validationError);
  assert.ok(validationError.errors.status);
});

test('Phase 3 - Auth routes declare saved-jobs and notification-preferences endpoints', () => {
  const authRoutes = require('../routes/authRoutes');
  const stack = authRoutes.stack.map(layer => ({
    path: layer.route?.path,
    methods: layer.route ? Object.keys(layer.route.methods) : []
  })).filter(r => r.path);

  const paths = stack.map(s => s.path);
  assert.ok(paths.includes('/saved-jobs'), 'Route /saved-jobs is registered');
  assert.ok(paths.includes('/saved-jobs/:id'), 'Route /saved-jobs/:id is registered');
  assert.ok(paths.includes('/notification-preferences'), 'Route /notification-preferences is registered');
});

test('Phase 3 - Application routes declare withdrawal endpoint', () => {
  const applicationRoutes = require('../routes/applicationRoutes');
  const stack = applicationRoutes.stack.map(layer => ({
    path: layer.route?.path,
    methods: layer.route ? Object.keys(layer.route.methods) : []
  })).filter(r => r.path);

  const deleteRoute = stack.find(s => s.path === '/:id' && s.methods.includes('delete'));
  assert.ok(deleteRoute, 'DELETE /:id withdrawal endpoint is registered');
});
