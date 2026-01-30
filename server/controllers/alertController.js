const Alert = require('../models/Alert');

// @desc    Get all active alerts
// @route   GET /api/alerts
// @access  Private
const getAlerts = async (req, res) => {
    try {
        // Get user with location data
        const User = require('../models/User');
        const user = await User.findById(req.user.id);

        // Fetch all active alerts
        const dbAlerts = await Alert.find({ active: true }).sort({ createdAt: -1 });

        // Filter alerts based on user location
        const filteredAlerts = dbAlerts.filter(alert => {
            // Global alerts always show
            if (alert.targetScope === 'global') return true;

            // No target regions means broadcast to all
            if (!alert.targetRegions ||
                (!alert.targetRegions.states?.length &&
                    !alert.targetRegions.districts?.length &&
                    !alert.targetRegions.cities?.length)) {
                return true;
            }

            // Check if user's location matches any target region
            const userLocation = user.location || {};

            // Match by state
            if (alert.targetRegions.states?.length > 0) {
                if (alert.targetRegions.states.includes(userLocation.state)) {
                    return true;
                }
            }

            // Match by district
            if (alert.targetRegions.districts?.length > 0) {
                if (alert.targetRegions.districts.includes(userLocation.district)) {
                    return true;
                }
            }

            // Match by city
            if (alert.targetRegions.cities?.length > 0) {
                if (userLocation.city && alert.targetRegions.cities.includes(userLocation.city)) {
                    return true;
                }
            }

            return false;
        });

        res.json(filteredAlerts);
    } catch (error) {
        console.error('Get Alerts Error:', error);
        res.status(500).json({ message: 'Failed to fetch alerts' });
    }
};

// @desc    Create a new alert
// @route   POST /api/alerts
// @access  Private (Admin only)
const createAlert = async (req, res) => {
    try {
        const { title, description, severity, source, targetInstitutionId, targetRegions, targetScope, expiresAt } = req.body;

        const alert = await Alert.create({
            title,
            description,
            severity,
            source: source || 'Institution Admin',
            targetInstitutionId: targetInstitutionId || null, // Handle empty strings
            targetRegions: targetRegions || { states: [], districts: [], cities: [] },
            targetScope: targetScope || 'global',
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
