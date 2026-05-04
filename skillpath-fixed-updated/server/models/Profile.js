const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, default: '' },
  skills: [String],
  linkedinUrl: { type: String, default: '' },
  portfolioUrl: { type: String, default: '' },
  targetRole: { type: String, default: '' },
  experience: { type: String, default: 'fresher' },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
