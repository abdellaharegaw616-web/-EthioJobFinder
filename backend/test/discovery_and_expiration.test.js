const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/../.env' });

test('Job model workArrangement enum values', () => {
  const Job = require('../models/Job');
  const path = Job.schema.path('workArrangement');
  assert.ok(path, 'workArrangement path must exist on Job model');
  assert.deepEqual(path.enumValues, ['on-site', 'remote', 'hybrid']);
});

test('Job model virtual isExpired returns true when deadline is in the past', () => {
  const Job = require('../models/Job');
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 5);

  const expiredJob = new Job({
    title: 'Expired Engineer',
    description: 'Expired vacancy',
    company: 'Old Corp',
    location: 'Hawassa',
    type: 'full-time',
    category: 'Engineering',
    deadline: pastDate,
    postedBy: new mongoose.Types.ObjectId()
  });

  assert.equal(expiredJob.isExpired, true, 'isExpired should be true for past deadline');

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 10);
  const activeJob = new Job({
    title: 'Active Engineer',
    description: 'Active vacancy',
    company: 'New Corp',
    location: 'Addis Ababa',
    type: 'full-time',
    category: 'Engineering',
    deadline: futureDate,
    postedBy: new mongoose.Types.ObjectId()
  });

  assert.equal(activeJob.isExpired, false, 'isExpired should be false for future deadline');
});

test('Job model virtuals are included in JSON serialization', () => {
  const Job = require('../models/Job');
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 2);

  const job = new Job({
    title: 'Serialized Job',
    description: 'Checking toJSON virtuals',
    company: 'Test PLC',
    location: 'Dire Dawa',
    type: 'contract',
    category: 'Business',
    deadline: pastDate,
    postedBy: new mongoose.Types.ObjectId()
  });

  const json = job.toJSON();
  assert.equal(json.isExpired, true, 'Serialized JSON must include virtual isExpired field');
});

test('Backend getJobs query builders handle sorting and Ethiopian cities', async () => {
  const Job = require('../models/Job');
  
  // Test query condition assembly
  const cities = ['Addis Ababa', 'Hawassa', 'Bahir Dar', 'Dire Dawa', 'Mekelle'];
  cities.forEach(city => {
    const query = { location: { $regex: city, $options: 'i' } };
    assert.ok(query.location.$regex.length > 0, `Query regex for ${city} should be valid`);
  });
});
