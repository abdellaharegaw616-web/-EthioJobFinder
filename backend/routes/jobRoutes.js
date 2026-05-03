const express = require('express');
const router = express.Router();
const { 
  getJobs, 
  getJob, 
  createJob, 
  updateJob, 
  deleteJob,
  getMyJobs 
} = require('../controllers/jobController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', getJobs);
router.get('/my-jobs', auth, authorize('employer', 'admin'), getMyJobs);
router.get('/:id', getJob);
router.post('/', auth, authorize('employer', 'admin'), createJob);
router.put('/:id', auth, authorize('employer', 'admin'), updateJob);
router.delete('/:id', auth, authorize('employer', 'admin'), deleteJob);

module.exports = router;
