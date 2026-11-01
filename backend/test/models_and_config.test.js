const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/../.env' });

test('Database URI configuration check', () => {
  assert.ok(process.env.MONGODB_URI, 'MONGODB_URI must be defined');
  assert.ok(process.env.MONGODB_URI.startsWith('mongodb'), 'MONGODB_URI must be a valid MongoDB protocol');
});

test('JWT Secret configuration check', () => {
  assert.ok(process.env.JWT_SECRET, 'JWT_SECRET must be defined');
  assert.ok(process.env.JWT_SECRET.length >= 8, 'JWT_SECRET should be sufficiently long');
});

test('Job schema validation', () => {
  const Job = require('../models/Job');
  const job = new Job({
    title: 'Test Developer',
    description: 'A test job description',
    company: 'Test PLC',
    location: 'Addis Ababa',
    type: 'full-time',
    category: 'IT & Software',
    requirements: ['Node.js'],
    postedBy: new mongoose.Types.ObjectId()
  });
  
  const validationError = job.validateSync();
  assert.equal(validationError, undefined, 'Job schema validation should pass with valid fields');
});

test('Job schema invalid type rejection', () => {
  const Job = require('../models/Job');
  const invalidJob = new Job({
    title: 'Test Developer',
    description: 'A test job description',
    company: 'Test PLC',
    location: 'Addis Ababa',
    type: 'invalid-type-xyz',
    category: 'IT & Software',
    requirements: ['Node.js'],
    postedBy: new mongoose.Types.ObjectId()
  });
  
  const validationError = invalidJob.validateSync();
  assert.ok(validationError, 'Job schema should reject invalid type');
  assert.ok(validationError.errors.type, 'Error should be on type field');
});

test('Application schema duplicate prevention definition', () => {
  const Application = require('../models/Application');
  const indexes = Application.schema.indexes();
  const hasUniqueCompoundIndex = indexes.some(idx => {
    return idx[0].job === 1 && idx[0].applicant === 1 && idx[1]?.unique === true;
  });
  assert.ok(hasUniqueCompoundIndex, 'Application must have a unique compound index on { job: 1, applicant: 1 }');
});
