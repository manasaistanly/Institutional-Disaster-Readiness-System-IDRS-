const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ['info', 'warning', 'emergency'],
        default: 'info'
    },
    source: {
        type: String, // e.g., 'IMD', 'NDMA', 'InstitutionAdmin'
        required: true
    },
    targetInstitutionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
        default: null // null means broadcast to all
    },
    issuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    active: {
        type: Boolean,
        default: true
    },
    expiresAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Alert', alertSchema);
