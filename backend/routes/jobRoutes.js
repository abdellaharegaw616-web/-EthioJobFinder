const express = require('express');
const router = express.Router();
const { 
  getJobs, 
  getJob, 
  createJob, 
  updateJob, 
  deleteJob,
  updateJobStatus,
  reportJob,
  getMyJobs,
  getRecommendedJobs
} = require('../controllers/jobController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', getJobs);
router.get('/my-jobs', auth, authorize('employer', 'admin'), getMyJobs);
router.get('/recommendations', auth, getRecommendedJobs);
router.get('/:id', getJob);
router.post('/', auth, authorize('employer', 'admin'), createJob);
router.put('/:id', auth, authorize('employer', 'admin'), updateJob);
router.patch('/:id/status', auth, authorize('employer', 'admin'), updateJobStatus);
router.delete('/:id', auth, authorize('employer', 'admin'), deleteJob);
router.post('/:id/report', auth, reportJob);

module.exports = router;
