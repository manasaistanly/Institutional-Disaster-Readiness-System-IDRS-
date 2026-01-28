const DisasterSOP = require('../models/DisasterSOP');

// @desc    Get all SOPs
// @route   GET /api/sops
// @access  Private
const getSOPs = async (req, res) => {
    // Return all global SOPs + SOPs for user's institution
    const sops = await DisasterSOP.find({
        $or: [
            { institutionId: null },
            { institutionId: req.user.institutionId }
        ]
    }).sort({ createdAt: -1 });
    res.json(sops);
};

// @desc    Create new SOP
// @route   POST /api/sops
// @access  Private (Admin)
const createSOP = async (req, res) => {
    const { title, type, content, fileUrl } = req.body;

    const sop = await DisasterSOP.create({
        title,
        type,
        content,
        fileUrl,
        institutionId: req.user.institutionId
    });

    res.status(201).json(sop);
};

module.exports = { getSOPs, createSOP };
