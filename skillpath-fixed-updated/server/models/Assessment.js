const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  skill: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  type: { type: String, enum: ['mcq', 'scenario', 'code-reading'], default: 'mcq' },
});

const AssessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  category: { type: String, required: true },
  skillsList: [{ type: String }],
  questions: [QuestionSchema],
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  startedAt: { type: Date },
  completedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Assessment', AssessmentSchema);
