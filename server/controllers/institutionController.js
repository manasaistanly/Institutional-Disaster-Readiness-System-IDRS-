const Institution = require('../models/Institution');

// @desc    Get all institutions
// @route   GET /api/institutions
// @access  Public
const getInstitutions = async (req, res) => {
    const institutions = await Institution.find();
    res.json(institutions);
};

// @desc    Create institution
// @route   POST /api/institutions
// @access  Private (Super Admin)
const createInstitution = async (req, res) => {
    const { name, address, contactEmail, contactPhone, latitude, longitude } = req.body;

    const institution = await Institution.create({
        name,
        address,
        contactEmail,
        contactPhone,
        location: {
            type: 'Point',
            coordinates: [longitude, latitude]
        }
    });

    res.status(201).json(institution);
};

module.exports = { getInstitutions, createInstitution };
