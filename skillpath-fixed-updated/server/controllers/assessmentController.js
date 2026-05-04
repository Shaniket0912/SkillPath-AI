const Assessment = require('../models/Assessment');
const Result = require('../models/Result');
const Score = require('../models/Score');
const Roadmap = require('../models/Roadmap');
const Domain = require('../models/Domain');
const axios = require('axios');

/* ─── Helper: call Groq with retry ─────────────────────────────────────── */
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
      raw = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
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

/* ─── POST /api/assessment/generate ─────────────────────────────────────── */
exports.generateAssessment = async (req, res) => {
  try {
    let { role, category, skillsList } = req.body;
    const userId = req.user.id;

    // ── AUTO-FETCH from DB if not provided ──────────────────────────────
    if (!role || !skillsList || skillsList.length === 0) {
      const domain = await Domain.findOne({ userId });
      if (domain) {
        role = role || domain.subRole;
        category = category || domain.category;
      }
      if (!skillsList || skillsList.length === 0) {
        const roadmap = await Roadmap.findOne({ userId });
        if (roadmap && roadmap.skills.length > 0) {
          skillsList = roadmap.skills.map(s => s.name);
        }
      }
    }

    if (!role) return res.status(400).json({ success: false, message: 'Role not found. Please complete domain selection first.' });
    if (!skillsList || skillsList.length === 0) return res.status(400).json({ success: false, message: 'No skills found. Please complete roadmap first.' });

    // Return existing uncompleted assessment
    const existing = await Assessment.findOne({ userId, status: { $in: ['pending', 'in-progress'] } });
    if (existing) return res.json({ success: true, assessment: existing, alreadyExists: true });

    const isCoding = category?.toLowerCase().includes('coding') || category?.toLowerCase().includes('tech');
    const skillsStr = skillsList.slice(0, 10).join(', ');

    const prompt = `Generate exactly 20 assessment questions for a ${role} fresher.
Cover these skills: ${skillsStr}.
${isCoding ? 'Include exactly 2 code-reading questions.' : ''}
Return ONLY valid JSON:
{"questions":[{"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correctAnswer":"A) ...","skill":"...","difficulty":"easy","type":"mcq"}]}
Rules:
- type must be: mcq, scenario, or code-reading
- difficulty must be: easy, medium, or hard
- correctAnswer must exactly match one of the options
- Include 12 mcq, 6 scenario, 2 code-reading (if coding)
- Make questions relevant to a fresher level`;

    const data = await callGemini(prompt);
    const questions = (data.questions || []).slice(0, 20).map(q => ({
  ...q,
  correctAnswer: q.correctAnswer || q.options?.[0] || 'N/A',
  type: ['mcq', 'scenario', 'code-reading'].includes(q.type) ? q.type : 'mcq',
  difficulty: ['easy', 'medium', 'hard'].includes(q.difficulty) ? q.difficulty : 'medium',
}));

    if (questions.length === 0) throw new Error('No questions generated');

    const assessment = new Assessment({ userId, role, category, skillsList, questions, status: 'pending' });
    await assessment.save();
    res.json({ success: true, assessment });
  } catch (err) {
    console.error('generateAssessment error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to generate assessment. Please try again.', error: err.message });
  }
};

/* ─── PATCH /api/assessment/:id/start ──────────────────────────────────── */
exports.startAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: 'in-progress', startedAt: new Date() },
      { new: true }
    );
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });
    res.json({ success: true, assessment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─── POST /api/assessment/:id/submit ──────────────────────────────────── */
exports.submitAssessment = async (req, res) => {
  try {
    const { answers, timeTakenSeconds } = req.body;
    const userId = req.user.id;

    const assessment = await Assessment.findOne({ _id: req.params.id, userId });
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });

    const answerRecords = assessment.questions.map((q, index) => {
      const userAnswer = answers[index] ?? null;
      // For scenario/code-reading — count as correct if answered (not timed out)
      const isOpenEnded = q.type === 'scenario' || q.type === 'code-reading';
      const isCorrect = isOpenEnded
        ? (userAnswer !== null && userAnswer.toString().trim().length > 10)
        : (userAnswer !== null && userAnswer === q.correctAnswer);
      return {
        questionIndex: index,
        question: q.question,
        selectedAnswer: userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        skill: q.skill,
        difficulty: q.difficulty || 'medium',
        timedOut: userAnswer === null,
      };
    });

    const correctCount = answerRecords.filter(a => a.isCorrect).length;
    const timedOutCount = answerRecords.filter(a => a.timedOut).length;
    const incorrectCount = assessment.questions.length - correctCount;
    const scorePercent = Math.round((correctCount / assessment.questions.length) * 100);

    const result = new Result({
      userId, assessmentId: assessment._id, answers: answerRecords,
      totalQuestions: assessment.questions.length,
      correctCount, incorrectCount, timedOutCount, scorePercent, timeTakenSeconds,
    });
    await result.save();

    assessment.status = 'completed';
    assessment.completedAt = new Date();
    await assessment.save();

    const strengthMap = {}, weakMap = {};
    const diffMap = { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } };
    const skillCoverageMap = {};

    answerRecords.forEach(a => {
      if (!skillCoverageMap[a.skill]) skillCoverageMap[a.skill] = { skill: a.skill, correct: 0, total: 0 };
      skillCoverageMap[a.skill].total += 1;
      const diff = a.difficulty || 'medium';
      if (diffMap[diff]) diffMap[diff].total += 1;
      if (a.isCorrect) {
        skillCoverageMap[a.skill].correct += 1;
        if (diffMap[diff]) diffMap[diff].correct += 1;
        strengthMap[a.skill] = (strengthMap[a.skill] || 0) + 1;
      } else {
        weakMap[a.skill] = (weakMap[a.skill] || 0) + 1;
      }
    });

    const strengths = Object.keys(strengthMap);
    const weaknesses = Object.keys(weakMap).filter(s => !strengths.includes(s));

    let jobReadinessBadge = 'Beginner';
    if (scorePercent >= 85) jobReadinessBadge = 'Expert';
    else if (scorePercent >= 70) jobReadinessBadge = 'Job Ready';
    else if (scorePercent >= 40) jobReadinessBadge = 'Developing';

    const prevAttempts = await Score.countDocuments({ userId, assessmentId: assessment._id });

    const score = new Score({
      userId, resultId: result._id, assessmentId: assessment._id,
      role: assessment.role, scorePercent, jobReadinessBadge,
      strengths, weaknesses,
      performanceByDifficulty: diffMap,
      skillCoverage: Object.values(skillCoverageMap),
      isJobReady: scorePercent >= 70,
      attemptNumber: prevAttempts + 1,
    });
    await score.save();

    res.json({ success: true, result, score, scorePercent, jobReadinessBadge, isJobReady: scorePercent >= 70 });
  } catch (err) {
    console.error('submitAssessment error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─── GET /api/assessment/latest ─────────────────────────────────────── */
exports.getLatestAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, assessment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─── POST /api/assessment/skill-mcq ─────────────────────────────────── */
exports.generateSkillMCQ = async (req, res) => {
  try {
    const { skill, role, count = 5 } = req.body;
    const prompt = `Generate exactly ${count} MCQ questions to test knowledge of "${skill}" for role: ${role}.
Return ONLY valid JSON:
{"questions":[{"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correctAnswer":"A) ..."}]}`;
    const data = await callGemini(prompt);
    res.json({ success: true, questions: data.questions || [] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate MCQ', error: err.message });
  }
};
