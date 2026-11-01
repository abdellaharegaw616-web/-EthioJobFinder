const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const { calculateJobMatch } = require('../controllers/jobController');

test('Phase 8 - calculateJobMatch scores high for candidates with overlapping skills and location', () => {
  const seeker = {
    name: 'Alferid Hassen',
    skills: ['React', 'Node.js', 'Tailwind', 'MongoDB'],
    location: 'Addis Ababa',
    professionalHeadline: 'Full Stack JavaScript Engineer',
    experience: [{ title: 'Frontend Developer', company: 'Habesha Tech' }, { title: 'Junior Dev', company: 'Bole ICT' }]
  };

  const matchingJob = {
    title: 'Senior React / Node.js Developer',
    description: 'Build web applications in Addis Ababa.',
    location: 'Addis Ababa',
    skillsRequired: ['React', 'Node.js', 'Express', 'MongoDB'],
    requirements: ['3+ years web development experience'],
    workArrangement: 'hybrid',
    experienceLevel: 'mid'
  };

  const result = calculateJobMatch(seeker, matchingJob);

  assert.ok(result.matchScore >= 75, `Expected score >= 75, got ${result.matchScore}`);
  assert.ok(result.matchedSkills.includes('react'), 'Should match react skill');
  assert.ok(result.matchedSkills.includes('node.js'), 'Should match node.js skill');
  assert.ok(result.matchedSkills.includes('mongodb'), 'Should match mongodb skill');
  assert.ok(result.matchReasons.some(r => r.includes('skills')), 'Should include skill overlap reason');
  assert.ok(result.matchReasons.some(r => r.includes('Addis Ababa')), 'Should include location alignment reason');
});

test('Phase 8 - calculateJobMatch awards location alignment for remote positions', () => {
  const seekerInHawassa = {
    name: 'Bethlehem Tadesse',
    skills: ['Python', 'Django'],
    location: 'Hawassa',
    professionalHeadline: 'Backend Python Engineer'
  };

  const remoteJob = {
    title: 'Python Backend Engineer (Remote)',
    description: 'Work from anywhere in Ethiopia.',
    location: 'Remote (Ethiopia)',
    workArrangement: 'remote',
    skillsRequired: ['Python', 'PostgreSQL'],
    experienceLevel: 'entry'
  };

  const result = calculateJobMatch(seekerInHawassa, remoteJob);

  assert.ok(result.matchScore >= 60, `Expected remote score >= 60, got ${result.matchScore}`);
  assert.ok(result.matchReasons.some(r => r.includes('Remote')), 'Should mention remote arrangement in match reasons');
});

test('Phase 8 - calculateJobMatch provides a baseline score and handles seeker with no skills gracefully', () => {
  const emptyProfileSeeker = {
    name: 'New Graduate',
    skills: [],
    location: ''
  };

  const standardJob = {
    title: 'Operations Assistant',
    location: 'Addis Ababa',
    skillsRequired: ['Communication', 'Microsoft Office'],
    experienceLevel: 'entry'
  };

  const result = calculateJobMatch(emptyProfileSeeker, standardJob);

  assert.ok(result.matchScore >= 35 && result.matchScore <= 60, 'Should fall back to neutral baseline score');
  assert.equal(result.matchedSkills.length, 0);
});

test('Phase 8 - Job routes declare /recommendations endpoint before /:id', () => {
  const jobRoutes = require('../routes/jobRoutes');
  const stack = jobRoutes.stack.map(layer => ({
    path: layer.route?.path,
    methods: layer.route ? Object.keys(layer.route.methods) : []
  })).filter(r => r.path);

  const recIndex = stack.findIndex(s => s.path === '/recommendations');
  const idIndex = stack.findIndex(s => s.path === '/:id' && s.methods.includes('get'));

  assert.ok(recIndex !== -1, 'GET /recommendations endpoint must be registered in jobRoutes');
  assert.ok(idIndex !== -1, 'GET /:id endpoint must be registered in jobRoutes');
  assert.ok(recIndex < idIndex, '/recommendations must precede /:id to prevent route shadowing');
});
