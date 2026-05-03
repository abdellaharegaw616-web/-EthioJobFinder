const express = require('express');
const router = express.Router();
const {
  apply,
  getMyApplications,
  getReceivedApplications,
  getApplication,
  updateStatus,
  withdrawApplication
} = require('../controllers/applicationController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, authorize('jobseeker'), apply);
router.get('/my-applications', auth, authorize('jobseeker'), getMyApplications);
router.get('/received', auth, authorize('employer', 'admin'), getReceivedApplications);
router.get('/:id', auth, getApplication);
router.put('/:id/status', auth, authorize('employer', 'admin'), updateStatus);
router.delete('/:id', auth, authorize('jobseeker'), withdrawApplication);

module.exports = router;
