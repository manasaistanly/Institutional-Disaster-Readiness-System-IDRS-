const { Quiz, QuizResult } = require('../models/Quiz');

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Private
const getQuizzes = async (req, res) => {
    const quizzes = await Quiz.find();
    res.json(quizzes);
};

// @desc    Create Quiz
// @route   POST /api/quizzes
// @access  Private (Admin)
const createQuiz = async (req, res) => {
    const { title, description, questions } = req.body;

    const quiz = await Quiz.create({
        title,
        description,
        questions,
        createdBy: req.user.id
    });

    res.status(201).json(quiz);
};

// @desc    Submit Quiz Result
// @route   POST /api/quizzes/:id/submit
// @access  Private
const submitQuiz = async (req, res) => {
    const { id } = req.params;
    const { answers } = req.body; // Array of option indices

    const quiz = await Quiz.findById(id);
    if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;
    quiz.questions.forEach((q, index) => {
        if (answers[index] === q.correctOptionIndex) {
            score++;
        }
    });

    const result = await QuizResult.create({
        userId: req.user.id,
        quizId: id,
        score,
        totalQuestions: quiz.questions.length
    });

    res.json(result);
};

// @desc    Delete Quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Admin)
const deleteQuiz = async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
    }

    // Optional: Check if user authorized to delete (if needed)

    await quiz.deleteOne();
    res.json({ message: 'Quiz removed' });
};

module.exports = { getQuizzes, createQuiz, submitQuiz, deleteQuiz };
