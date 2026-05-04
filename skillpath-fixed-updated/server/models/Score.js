const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resultId: { type: mongoose.Schema.Types.ObjectId, ref: 'Result', required: true },
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  role: { type: String, required: true },
  scorePercent: { type: Number, required: true },
  jobReadinessBadge: {
    type: String,
    enum: ['Beginner', 'Developing', 'Job Ready', 'Expert'],
    required: true,
  },
  strengths: [{ type: String }],    // skills answered correctly
  weaknesses: [{ type: String }],   // skills answered incorrectly
  performanceByDifficulty: {
    easy:   { correct: Number, total: Number },
    medium: { correct: Number, total: Number },
    hard:   { correct: Number, total: Number },
  },
  skillCoverage: [{ skill: String, correct: Number, total: Number }],
  skillsLearnedCount: { type: Number, default: 0 },
  totalSkillsCount: { type: Number, default: 0 },
  isJobReady: { type: Boolean, default: false },
  attemptNumber: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model('Score', ScoreSchema);
