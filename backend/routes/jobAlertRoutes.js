const express = require('express');
const router = express.Router();
const {
  getMyAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  getAlertMatches
} = require('../controllers/jobAlertController');
const { auth } = require('../middleware/auth');

// All job alert routes are protected
router.use(auth);

router.get('/', getMyAlerts);
router.post('/', createAlert);
router.put('/:id', updateAlert);
router.delete('/:id', deleteAlert);
router.get('/:id/matches', getAlertMatches);

module.exports = router;
