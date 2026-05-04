const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: String,
  url: String,
  type: { type: String, enum: ['youtube', 'docs', 'course', 'other'], default: 'other' },
});

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  description: String,
  resources: [ResourceSchema],
  isKnown: { type: Boolean, default: false },    // user marked "I Know This"
  isLearned: { type: Boolean, default: false },  // user marked learned after study
  markedAt: Date,
});

const RoadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  category: { type: String, required: true },
  skills: [SkillSchema],
  allMarked: { type: Boolean, default: false }, // true when user has marked every skill known/unknown
  generatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);
