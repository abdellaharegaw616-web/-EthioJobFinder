const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');

test('Phase 4 - Job model supports active, draft, and closed lifecycle statuses', () => {
  const statuses = ['active', 'closed', 'draft'];
  for (const st of statuses) {
    const job = new Job({
      title: 'Senior Database Administrator',
      description: 'Manage Oracle and PostgreSQL clusters in Addis Ababa.',
      company: 'Ethio Financial Services',
      location: 'Addis Ababa',
      type: 'full-time',
      category: 'IT & Software',
      requirements: ['5+ years DB administration experience'],
      postedBy: new mongoose.Types.ObjectId(),
      status: st
    });

    const err = job.validateSync();
    assert.equal(err, undefined, `Status "${st}" should be valid for Job schema`);
  }
});

test('Phase 4 - Job model rejects invalid status', () => {
  const job = new Job({
    title: 'Senior Database Administrator',
    description: 'Manage Oracle clusters.',
    company: 'Ethio Financial Services',
    location: 'Addis Ababa',
    type: 'full-time',
    category: 'IT & Software',
    requirements: ['5+ years DB experience'],
    postedBy: new mongoose.Types.ObjectId(),
    status: 'archived_invalid'
  });

  const err = job.validateSync();
  assert.ok(err);
  assert.ok(err.errors.status);
});

test('Phase 4 - User model supports employer company fields and verification status', () => {
  const employer = new User({
    name: 'Dawit Gebre',
    email: 'dawit.employer@telecom.et',
    password: 'Password123!',
    role: 'employer',
    companyName: 'Ethio Telecom Innovation Lab',
    companyDescription: 'Pioneering next-generation digital services in Ethiopia.',
    companyWebsite: 'https://ethiotelecom.et',
    companyIndustry: 'Telecommunications & ICT',
    companySize: '500+',
    companyCity: 'Addis Ababa',
    verificationStatus: 'pending'
  });

  assert.equal(employer.companyName, 'Ethio Telecom Innovation Lab');
  assert.equal(employer.companySize, '500+');
  assert.equal(employer.companyCity, 'Addis Ababa');
  assert.equal(employer.verificationStatus, 'pending');
  assert.equal(employer.isVerified, false);

  const err = employer.validateSync();
  assert.equal(err, undefined, 'Employer user fields should validate cleanly');
});

test('Phase 4 - User model enforces companySize enum', () => {
  const employer = new User({
    name: 'Dawit Gebre',
    email: 'dawit.size@telecom.et',
    password: 'Password123!',
    role: 'employer',
    companySize: 'huge_enterprise'
  });

  const err = employer.validateSync();
  assert.ok(err);
  assert.ok(err.errors.companySize);
});

test('Phase 4 - Job routes include PATCH /:id/status for quick vacancy toggles', () => {
  const jobRoutes = require('../routes/jobRoutes');
  const stack = jobRoutes.stack.map(layer => ({
    path: layer.route?.path,
    methods: layer.route ? Object.keys(layer.route.methods) : []
  })).filter(r => r.path);

  const statusPatchRoute = stack.find(s => s.path === '/:id/status' && s.methods.includes('patch'));
  assert.ok(statusPatchRoute, 'PATCH /:id/status endpoint must be registered');
});

test('Phase 4 - Application routes include GET /job/:jobId for vacancy candidate pipeline', () => {
  const appRoutes = require('../routes/applicationRoutes');
  const stack = appRoutes.stack.map(layer => ({
    path: layer.route?.path,
    methods: layer.route ? Object.keys(layer.route.methods) : []
  })).filter(r => r.path);

  const jobAppsRoute = stack.find(s => s.path === '/job/:jobId' && s.methods.includes('get'));
  assert.ok(jobAppsRoute, 'GET /job/:jobId endpoint must be registered');
});

test('Phase 4 - Auth routes include company profile and verification request endpoints', () => {
  const authRoutes = require('../routes/authRoutes');
  const stack = authRoutes.stack.map(layer => ({
    path: layer.route?.path,
    methods: layer.route ? Object.keys(layer.route.methods) : []
  })).filter(r => r.path);

  const companyRoute = stack.find(s => s.path === '/company/:id' && s.methods.includes('get'));
  assert.ok(companyRoute, 'GET /company/:id endpoint must be registered');

  const verificationRoute = stack.find(s => s.path === '/request-verification' && s.methods.includes('post'));
  assert.ok(verificationRoute, 'POST /request-verification endpoint must be registered');
});
