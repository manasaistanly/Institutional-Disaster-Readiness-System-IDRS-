const Alert = require('../models/Alert');

// @desc    Get all active alerts
// @route   GET /api/alerts
// @access  Private
const getAlerts = async (req, res) => {
    // In a real scenario, this might also fetch from an external API and cache it
    const dbAlerts = await Alert.find({ active: true }).sort({ createdAt: -1 });
    res.json(dbAlerts);
};

// @desc    Create a new alert
// @route   POST /api/alerts
// @access  Private (Admin only)
const createAlert = async (req, res) => {
    try {
        const { title, description, severity, source, targetInstitutionId, expiresAt } = req.body;

        const alert = await Alert.create({
            title,
            description,
            severity,
            source: source || 'Institution Admin',
            targetInstitutionId: targetInstitutionId || null, // Handle empty strings
            issuedBy: req.user.id,
            expiresAt
        });

        res.status(201).json(alert);
    } catch (error) {
        console.error("Create Alert Error:", error);
        res.status(400).json({ message: error.message || 'Invalid alert data' });
    }
};

// @desc    Update alert (Deactivate)
// @route   PUT /api/alerts/:id
// @access  Private (Admin only)
const updateAlert = async (req, res) => {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
        return res.status(404).json({ message: 'Alert not found' });
    }

    // Check if user is authorized (issuedBy or Admin)
    // Simplified: Any admin can deactivate

    alert.active = req.body.active;
    const updatedAlert = await alert.save();
    res.json(updatedAlert);
};

module.exports = { getAlerts, createAlert, updateAlert };
