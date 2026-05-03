const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const {
  getStats,
  getUsers,
  getPendingVerifications,
  verifyEmployer,
  toggleUserBan,
  deleteUser,
  getAllJobs,
  deleteJob
} = require('../controllers/adminController');

// All routes are protected and admin-only
router.use(auth, admin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/pending-verifications', getPendingVerifications);
router.put('/verify-employer/:id', verifyEmployer);
router.put('/ban-user/:id', toggleUserBan);
router.delete('/users/:id', deleteUser);
router.get('/jobs', getAllJobs);
router.delete('/jobs/:id', deleteJob);

module.exports = router;
