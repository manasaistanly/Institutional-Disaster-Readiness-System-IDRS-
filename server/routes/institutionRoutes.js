const express = require('express');
const router = express.Router();
const { getInstitutions, createInstitution } = require('../controllers/institutionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getInstitutions);
router.post('/', protect, authorize('super_admin'), createInstitution);

module.exports = router;
