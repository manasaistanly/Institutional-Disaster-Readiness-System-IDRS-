const express = require('express');
const router = express.Router();
const { getQuizzes, createQuiz, submitQuiz, deleteQuiz } = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getQuizzes);
router.post('/', protect, authorize('institution_admin', 'super_admin'), createQuiz);
router.post('/:id/submit', protect, submitQuiz);
router.delete('/:id', protect, authorize('institution_admin', 'super_admin'), deleteQuiz);

module.exports = router;
