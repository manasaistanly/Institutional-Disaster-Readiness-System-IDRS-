const express = require('express');
const router = express.Router();
const { getSOPs, createSOP } = require('../controllers/sopController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getSOPs);
router.post('/', protect, authorize('institution_admin', 'super_admin'), createSOP);

module.exports = router;
