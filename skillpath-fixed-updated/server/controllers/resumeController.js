const Resume = require('../models/Resume');
const axios = require('axios');

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const response = await axios.post(url, {
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 4096,
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

// POST /api/resume/generate
exports.generateResume = async (req, res) => {
  try {
    const { name, email, phone, role, skills, college, branch, year, cgpa } = req.body;
    const userId = req.user.id;

    const prompt = `Generate ATS-friendly resume content for a fresher targeting the role of ${role}.
Name: ${name}
Skills known: ${skills.join(', ')}
College: ${college}
Branch: ${branch}
Year: ${year}
CGPA: ${cgpa}

Return JSON only, no markdown, no extra text:
{
  "summary": "...",
  "technicalSkills": ["...", "..."],
  "softSkills": ["...", "..."],
  "education": { "college": "...", "branch": "...", "year": "...", "cgpa": "..." },
  "projects": [
    { "title": "...", "description": "...", "techStack": ["...", "..."], "githubLink": "https://github.com/username/project" }
  ],
  "certifications": ["...", "..."],
  "atsKeywords": ["...", "..."]
}`;

    const data = await callGemini(prompt);

    // Upsert — one resume per user
    const resume = await Resume.findOneAndUpdate(
      { userId },
      {
        userId, role, name, email, phone,
        summary: data.summary,
        technicalSkills: data.technicalSkills || [],
        softSkills: data.softSkills || [],
        education: data.education || { college, branch, year, cgpa },
        projects: data.projects || [],
        certifications: data.certifications || [],
        atsKeywords: data.atsKeywords || [],
        rawGeminiResponse: JSON.stringify(data),
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, resume });
  } catch (err) {
    console.error('generateResume error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to generate resume', error: err.message });
  }
};

// GET /api/resume
exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id }).sort({ updatedAt: -1 });
    if (!resume) return res.status(404).json({ success: false, message: 'No resume found' });
    res.json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
