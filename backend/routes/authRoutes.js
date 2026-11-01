const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  updateProfile,
  getSavedJobs,
  saveJob,
  unsaveJob,
  updateNotificationPreferences,
  getCompanyProfile,
  requestVerification
} = require('../controllers/authController');
const { auth, authorize } = require('../middleware/auth');
const {
  sendVerificationEmail,
  verifyEmail,
  forgotPassword,
  resetPassword
} = require('../controllers/verificationController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);
router.get('/company/:id', getCompanyProfile);
router.post('/request-verification', auth, authorize('employer', 'admin'), requestVerification);
router.get('/saved-jobs', auth, getSavedJobs);
router.post('/saved-jobs/:id', auth, saveJob);
router.delete('/saved-jobs/:id', auth, unsaveJob);
router.put('/notification-preferences', auth, updateNotificationPreferences);
router.post('/verify-email/send', auth, sendVerificationEmail);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
