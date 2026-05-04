const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionIndex: { type: Number, required: true },
  question: { type: String, required: true },
  selectedAnswer: { type: String, default: null }, // null if timed out
  correctAnswer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  skill: { type: String, required: true },
  difficulty: { type: String, required: true },
  timedOut: { type: Boolean, default: false },
});

const ResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  answers: [AnswerSchema],
  totalQuestions: { type: Number, required: true },
  correctCount: { type: Number, required: true },
  incorrectCount: { type: Number, required: true },
  timedOutCount: { type: Number, default: 0 },
  scorePercent: { type: Number, required: true },
  timeTakenSeconds: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Result', ResultSchema);
