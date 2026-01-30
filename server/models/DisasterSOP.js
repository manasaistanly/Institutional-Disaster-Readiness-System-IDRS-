const mongoose = require('mongoose');

const disasterSOPSchema = new mongoose.Schema({
    title: { type: String, required: true }, // e.g., "Fire Safety", "Earthquake Drill"
    type: { type: String, required: true }, // "Fire", "Flood", "Earthquake", "General"
    content: { type: String, required: true }, // Could be text or Markdown
    institutionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
        default: null // null implies Global Standard SOP
    },
    fileUrl: { type: String }, // Optional PDF link
    createdAt: { type: Date, default: Date.now }
});

// Create index for search functionality
disasterSOPSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('DisasterSOP', disasterSOPSchema);
