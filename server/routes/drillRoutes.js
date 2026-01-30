const express = require('express');
const router = express.Router();
const { getDrills, createDrill } = require('../controllers/drillController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getDrills);
router.post('/', protect, authorize('institution_admin', 'super_admin'), createDrill);

module.exports = router;
