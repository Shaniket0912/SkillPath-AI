const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  summary: { type: String },
  technicalSkills: [{ type: String }],
  softSkills: [{ type: String }],
  education: {
    college: String,
    branch: String,
    year: String,
    cgpa: String,
  },
  projects: [{
    title: String,
    description: String,
    techStack: [String],
    githubLink: String,
  }],
  certifications: [{ type: String }],
  atsKeywords: [{ type: String }],
  rawGeminiResponse: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Resume', ResumeSchema);
