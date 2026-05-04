const Score = require('../models/Score');
const Result = require('../models/Result');
const axios = require('axios');

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const response = await axios.post(url, {
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 2048,
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }
  });

  let raw = response.data.choices[0].message.content;
  raw = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
  return JSON.parse(raw);
}

// GET /api/score/latest
exports.getLatestScore = async (req, res) => {
  try {
    const score = await Score.findOne({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('resultId');
    if (!score) return res.status(404).json({ success: false, message: 'No score found' });
    res.json({ success: true, score });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/score/all
exports.getAllScores = async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, scores });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/score/weak-resources
exports.getWeakSkillResources = async (req, res) => {
  try {
    const { skill } = req.body;
    if (!skill) return res.status(400).json({ success: false, message: 'Skill required' });

    const prompt = `Give 3 best free resources to learn ${skill} for a fresher.
Return JSON only, no markdown:
{
  "resources": [
    { "title": "...", "url": "...", "type": "video|article|course|docs" }
  ]
}`;
    const data = await callGemini(prompt);
    res.json({ success: true, resources: data.resources || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/score/:id/skills-count
exports.updateSkillsCount = async (req, res) => {
  try {
    const { skillsLearnedCount, totalSkillsCount } = req.body;
    const score = await Score.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { skillsLearnedCount, totalSkillsCount },
      { new: true }
    );
    res.json({ success: true, score });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
