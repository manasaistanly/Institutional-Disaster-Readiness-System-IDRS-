const Drill = require('../models/Drill');

// @desc    Get Drills
// @route   GET /api/drills
// @access  Private
const getDrills = async (req, res) => {
    const drills = await Drill.find({ institutionId: req.user.institutionId })
        .sort({ date: 1 });
    res.json(drills);
};

// @desc    Create Drill
// @route   POST /api/drills
// @access  Private (Admin)
const createDrill = async (req, res) => {
    const { title, description, date } = req.body;

    const drill = await Drill.create({
        title,
        description,
        date,
        institutionId: req.user.institutionId,
        createdBy: req.user.id
    });

    res.status(201).json(drill);
};

module.exports = { getDrills, createDrill };
