const express = require('express');
const router = express.Router();
const { getAlerts, createAlert, updateAlert } = require('../controllers/alertController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getAlerts);
router.post('/', protect, authorize('institution_admin', 'super_admin'), createAlert);
router.put('/:id', protect, authorize('institution_admin', 'super_admin'), updateAlert);

module.exports = router;
