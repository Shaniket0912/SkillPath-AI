const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function callGemini(prompt) {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
    }),
  });
  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function generateRoadmap(domain, skills) {
  const skillSummary = Object.entries(skills)
    .map(([skill, level]) => `${skill}: ${level}`)
    .join(', ');
  const prompt = `You are a senior tech mentor. Create a detailed personalized learning roadmap for a student in "${domain}".

Current skill levels: ${skillSummary}

Return a JSON array of roadmap phases. Each phase:
{
  "phase": 1,
  "title": "Phase title",
  "duration": "X weeks",
  "topics": ["topic1", "topic2", ...],
  "resources": ["resource1", ...],
  "milestone": "What they will build/achieve"
}

Return ONLY the JSON array, no markdown, no extra text.`;
  const text = await callGemini(prompt);
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

export async function generateAssessmentQuestions(domain, topic, count = 10) {
  const prompt = `Generate ${count} multiple choice questions to assess ${topic} knowledge in ${domain}.

Return a JSON array:
[{
  "question": "...",
  "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
  "correct": "A",
  "explanation": "..."
}]

Return ONLY the JSON array.`;
  const text = await callGemini(prompt);
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

export async function generateResume(profile, domain, skills) {
  const prompt = `Generate a professional ATS-optimized resume for:
Name: ${profile.name}
Email: ${profile.email}
Domain: ${domain}
Skills: ${JSON.stringify(skills)}
Education: ${profile.college}, ${profile.branch}, ${profile.yearOfPassing}, CGPA: ${profile.cgpa}
GitHub: ${profile.githubUrl || 'N/A'}

Return a complete resume in clean text format with sections: Summary, Skills, Education, Projects, and a note about GitHub.`;
  return callGemini(prompt);
}
