const axios = require('axios');
const Roadmap = require('../models/Roadmap');
const Domain = require('../models/Domain');

/* ─── Helper: call Groq/Gemini with retry ──────────────────────────────── */
async function callGemini(prompt, retries = 2) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(url, {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a JSON API. Always respond with valid JSON only. No markdown, no explanation, no code blocks. Just raw JSON.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4,
        max_tokens: 4096,
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      let raw = response.data.choices[0].message.content;
      // Strip any accidental markdown
      raw = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
      // Find first { and last } to extract JSON
      const start = raw.indexOf('{');
      const end = raw.lastIndexOf('}');
      if (start !== -1 && end !== -1) raw = raw.slice(start, end + 1);

      return JSON.parse(raw);
    } catch (err) {
      console.error(`callGemini attempt ${attempt + 1} failed:`, err?.response?.data || err.message);
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
}

/* ─── POST /api/roadmap/generate ──────────────────────────────────────── */
const generateRoadmap = async (req, res) => {
  try {
    const domain = await Domain.findOne({ userId: req.user.id });
    if (!domain) return res.status(400).json({ message: 'Please select a domain first.' });

    const existing = await Roadmap.findOne({ userId: req.user.id });
    if (existing) return res.status(200).json({ roadmap: existing, cached: true });

    const prompt = `Generate a complete learning roadmap for a fresher who wants to become a ${domain.subRole}.
Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{"skills":[{"name":"skill name","level":"beginner","description":"why this skill matters","resources":[{"title":"resource title","url":"https://example.com","type":"youtube"}]}]}
Rules:
- Include 12-15 skills total
- level must be exactly: beginner, intermediate, or advanced
- Mix: 4-5 beginner, 4-5 intermediate, 3-4 advanced
- Order: beginner first, then intermediate, then advanced
- Resources: include at least 1 per skill with real URLs
- Focus on skills tested in ${domain.subRole} interviews`;

    const parsed = await callGemini(prompt);

    if (!parsed.skills || !Array.isArray(parsed.skills)) {
      throw new Error('Invalid roadmap structure from AI');
    }

    const roadmap = await Roadmap.create({
      userId: req.user.id,
      role: domain.subRole,
      category: domain.category,
      skills: parsed.skills.map((s) => ({
        name: s.name || 'Skill',
        level: ['beginner', 'intermediate', 'advanced'].includes(s.level) ? s.level : 'beginner',
        description: s.description || '',
        resources: Array.isArray(s.resources) ? s.resources : [],
        isKnown: false,
        isLearned: false,
      })),
    });

    res.status(201).json({ roadmap, cached: false });
  } catch (err) {
    console.error('generateRoadmap error:', err?.response?.data || err.message);
    res.status(500).json({ message: 'Failed to generate roadmap. Check your API key and try again.' });
  }
};

/* ─── GET /api/roadmap ────────────────────────────────────────────────── */
const getRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ userId: req.user.id });
    if (!roadmap) return res.status(404).json({ message: 'No roadmap found.' });
    res.status(200).json({ roadmap });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

/* ─── PATCH /api/roadmap/mark ─────────────────────────────────────────── */
const markSkill = async (req, res) => {
  try {
    const { skillId, isKnown } = req.body;
    if (skillId === undefined || isKnown === undefined)
      return res.status(400).json({ message: 'skillId and isKnown are required.' });

    const roadmap = await Roadmap.findOne({ userId: req.user.id });
    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found.' });

    const skill = roadmap.skills.id(skillId);
    if (!skill) return res.status(404).json({ message: 'Skill not found.' });

    skill.isKnown = isKnown;
    skill.markedAt = new Date();
    roadmap.allMarked = roadmap.skills.every((s) => s.markedAt);
    await roadmap.save();
    res.status(200).json({ roadmap });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

/* ─── DELETE /api/roadmap ─────────────────────────────────────────────── */
const deleteRoadmap = async (req, res) => {
  try {
    await Roadmap.findOneAndDelete({ userId: req.user.id });
    res.status(200).json({ message: 'Roadmap deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

/* ─── POST /api/roadmap/skill-resources ──────────────────────────────── */
const getSkillResources = async (req, res) => {
  try {
    const { skillId } = req.body;
    if (!skillId) return res.status(400).json({ message: 'skillId is required.' });

    const roadmap = await Roadmap.findOne({ userId: req.user.id });
    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found.' });

    const skill = roadmap.skills.id(skillId);
    if (!skill) return res.status(404).json({ message: 'Skill not found.' });

    const prompt = `Give learning resources for "${skill.name}" for a fresher targeting "${roadmap.role}".
Return ONLY valid JSON:
{"description":"3-4 sentence explanation","youtubeLinks":[{"title":"title","url":"https://youtube.com/watch?v=xxx"}],"docLinks":[{"title":"title","url":"https://..."}],"projectIdeas":["idea 1","idea 2"],"tips":["tip 1","tip 2"]}`;

    const parsed = await callGemini(prompt);
    res.status(200).json({ resources: parsed });
  } catch (err) {
    console.error('getSkillResources error:', err.message);
    res.status(500).json({ message: 'Failed to fetch resources.' });
  }
};

/* ─── PATCH /api/roadmap/learn ────────────────────────────────────────── */
const markLearned = async (req, res) => {
  try {
    const { skillId, isLearned } = req.body;
    if (skillId === undefined || isLearned === undefined)
      return res.status(400).json({ message: 'skillId and isLearned are required.' });

    const roadmap = await Roadmap.findOne({ userId: req.user.id });
    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found.' });

    const skill = roadmap.skills.id(skillId);
    if (!skill) return res.status(404).json({ message: 'Skill not found.' });

    skill.isLearned = isLearned;
    await roadmap.save();
    res.status(200).json({ roadmap });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { generateRoadmap, getRoadmap, markSkill, deleteRoadmap, getSkillResources, markLearned };
