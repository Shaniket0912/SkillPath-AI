import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL;

const LEVEL_CFG = {
  beginner:     { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)',  label: 'Beginner' },
  intermediate: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)',  label: 'Intermediate' },
  advanced:     { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)',   border: 'rgba(244,63,94,0.25)',   label: 'Advanced' },
};

// ── Phase: Loading skeleton ──────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 56, height: 56, border: '3px solid rgba(0,212,255,0.2)', borderTop: '3px solid #00d4ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#00d4ff', fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700 }}>Analyzing your requirements...</p>
      <p style={{ color: '#64748b', fontSize: 13 }}>Gemini AI is mapping skills for your role</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}

// ── Phase: Skill check (mark known / unknown) ────────────────────────────
function SkillCheckPhase({ skills, onDone }) {
  const [marked, setMarked] = useState({});

  const toggle = (idx, known) => setMarked(p => ({ ...p, [idx]: known }));
  const allMarked = skills.length > 0 && Object.keys(marked).length === skills.length;

  const grouped = skills.reduce((acc, s, i) => {
    const lvl = s.level || 'beginner';
    if (!acc[lvl]) acc[lvl] = [];
    acc[lvl].push({ ...s, idx: i });
    return acc;
  }, {});

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', paddingBottom: 80 }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', paddingTop: 56, paddingBottom: 40 }}>
          <div style={{ display: 'inline-block', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 100, padding: '5px 18px', fontSize: 11, color: '#00d4ff', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Step 03 — Requirement Analysis</div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 10 }}>Skill Requirement & Gap Analysis</h1>
          <p style={{ color: '#94a3b8', fontSize: 14, maxWidth: 540, margin: '0 auto' }}>
            Mark each skill as <span style={{ color: '#10b981', fontWeight: 600 }}>Known</span> or <span style={{ color: '#f43f5e', fontWeight: 600 }}>Not Known</span>. Known skills will be tested — not-known skills will form your personalized roadmap.
          </p>
          {/* Progress */}
          <div style={{ marginTop: 20, background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 20px', display: 'inline-flex', alignItems: 'center', gap: 16, fontSize: 13 }}>
            <span style={{ color: '#10b981' }}>✓ Known: {Object.values(marked).filter(v=>v===true).length}</span>
            <span style={{ color: '#f43f5e' }}>✗ Unknown: {Object.values(marked).filter(v=>v===false).length}</span>
            <span style={{ color: '#64748b' }}>⏳ Remaining: {skills.length - Object.keys(marked).length}</span>
          </div>
        </div>

        {/* Skill Cards by level */}
        {['beginner','intermediate','advanced'].map(level => {
          if (!grouped[level]) return null;
          const cfg = LEVEL_CFG[level];
          return (
            <div key={level} style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color }} />
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: 1 }}>{cfg.label}</span>
                <div style={{ flex: 1, height: 1, background: cfg.border }} />
                <span style={{ fontSize: 11, color: '#475569' }}>{grouped[level].length} skills</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {grouped[level].map(skill => {
                  const state = marked[skill.idx];
                  return (
                    <div key={skill.idx} style={{ background: state === true ? 'rgba(16,185,129,0.06)' : state === false ? 'rgba(244,63,94,0.06)' : '#111827', border: `1px solid ${state === true ? 'rgba(16,185,129,0.3)' : state === false ? 'rgba(244,63,94,0.3)' : 'rgba(255,255,255,0.07)'}`, borderLeft: `3px solid ${state === true ? '#10b981' : state === false ? '#f43f5e' : cfg.color}`, borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, transition: 'all 0.25s' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>{skill.name}</div>
                        <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{skill.description}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <button onClick={() => toggle(skill.idx, true)} style={{ padding: '8px 18px', borderRadius: 10, border: `1px solid ${state === true ? '#10b981' : 'rgba(16,185,129,0.25)'}`, background: state === true ? 'rgba(16,185,129,0.2)' : '#1e293b', color: state === true ? '#10b981' : '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 5 }}>
                          ✓ Know It
                        </button>
                        <button onClick={() => toggle(skill.idx, false)} style={{ padding: '8px 18px', borderRadius: 10, border: `1px solid ${state === false ? '#f43f5e' : 'rgba(244,63,94,0.25)'}`, background: state === false ? 'rgba(244,63,94,0.2)' : '#1e293b', color: state === false ? '#f43f5e' : '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 5 }}>
                          ✗ Don't Know
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Proceed button */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100 }}>
          <span style={{ color: '#94a3b8', fontSize: 13 }}>
            {allMarked ? '✅ All skills marked! Ready to proceed.' : `Mark all ${skills.length} skills to continue`}
          </span>
          <button onClick={() => allMarked && onDone(marked)} disabled={!allMarked} style={{ background: allMarked ? 'linear-gradient(135deg,#7c3aed,#00d4ff)' : '#1e293b', border: 'none', borderRadius: 12, padding: '12px 32px', color: allMarked ? '#fff' : '#475569', fontWeight: 700, fontSize: 14, cursor: allMarked ? 'pointer' : 'not-allowed', fontFamily: "'Syne',sans-serif", transition: 'all 0.3s' }}>
            Start Skill Assessment →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Phase: MCQ test for KNOWN skills ────────────────────────────────────
function SkillMCQPhase({ skills, knownIndices, onDone }) {
  const knownSkills = skills.filter((_, i) => knownIndices.includes(i));
  // 5 MCQ per skill (AI generated) — we use a simple static fallback + Gemini
  const [currentSkillIdx, setCurrentSkillIdx] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [loadingQs, setLoadingQs] = useState(true);
  const [results, setResults] = useState([]);

  const currentSkill = knownSkills[currentSkillIdx];

  useEffect(() => {
    generateQuestions();
  }, [currentSkillIdx]);

  const generateQuestions = async () => {
    setLoadingQs(true);
    setCurrentQ(0);
    setAnswers({});
    setSelected(null);
    try {
      const role = localStorage.getItem('sp_role') || 'Developer';
      const res = await axios.post(`${API}/api/assessment/skill-mcq`,
        { skill: currentSkill.name, role, count: 5 },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setQuestions(res.data.questions);
    } catch {
      // Fallback questions
      setQuestions([
        { question: `What is the primary use of ${currentSkill.name}?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correctAnswer: 'Option A' },
        { question: `Which concept is core to ${currentSkill.name}?`, options: ['Concept X', 'Concept Y', 'Concept Z', 'Concept W'], correctAnswer: 'Concept X' },
        { question: `${currentSkill.name} is best used for?`, options: ['Use case A', 'Use case B', 'Use case C', 'Use case D'], correctAnswer: 'Use case A' },
        { question: `A common mistake with ${currentSkill.name}?`, options: ['Mistake A', 'Mistake B', 'Mistake C', 'Mistake D'], correctAnswer: 'Mistake A' },
        { question: `Advanced feature of ${currentSkill.name}?`, options: ['Feature A', 'Feature B', 'Feature C', 'Feature D'], correctAnswer: 'Feature A' },
      ]);
    }
    setLoadingQs(false);
  };

  const handleSelect = (opt) => {
    if (selected) return;
    setSelected(opt);
    setAnswers(p => ({ ...p, [currentQ]: opt }));
    setTimeout(() => {
      if (currentQ < 4) {
        setCurrentQ(q => q + 1);
        setSelected(null);
      } else {
        // Calculate skill score
        const correct = Object.keys(answers).filter(i => answers[i] === questions[i]?.correctAnswer).length + (opt === questions[currentQ]?.correctAnswer ? 1 : 0);
        const pct = Math.round((correct / 5) * 100);
        const newResults = [...results, { skill: currentSkill.name, score: pct, passed: pct >= 75 }];
        setResults(newResults);
        if (currentSkillIdx < knownSkills.length - 1) {
          setCurrentSkillIdx(i => i + 1);
          setSelected(null);
        } else {
          onDone(newResults);
        }
      }
    }, 700);
  };

  if (loadingQs) return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 44, height: 44, border: '3px solid rgba(0,212,255,0.2)', borderTop: '3px solid #00d4ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#00d4ff', fontFamily: "'Syne',sans-serif", fontSize: 15 }}>Generating MCQ for {currentSkill?.name}...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  if (!questions) return null;
  const q = questions[currentQ];
  if (!q) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 620 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-block', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 100, padding: '5px 18px', fontSize: 11, color: '#7c3aed', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Skill Assessment</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Testing: {currentSkill.name}</h2>
          <p style={{ color: '#64748b', fontSize: 13 }}>Skill {currentSkillIdx + 1} of {knownSkills.length} · Question {currentQ + 1} of 5</p>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, justifyContent: 'center' }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{ width: 32, height: 4, borderRadius: 2, background: i < currentQ ? '#10b981' : i === currentQ ? '#00d4ff' : '#1e293b', transition: 'background 0.3s' }} />
          ))}
        </div>

        {/* Question */}
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '24px', marginBottom: 16 }}>
          <p style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 600, lineHeight: 1.6 }}>{q.question}</p>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.options.map((opt, i) => {
            const isSelected = selected === opt;
            const isCorrect = selected && opt === q.correctAnswer;
            const isWrong = selected === opt && opt !== q.correctAnswer;
            return (
              <button key={i} onClick={() => handleSelect(opt)} disabled={!!selected} style={{ textAlign: 'left', padding: '14px 20px', borderRadius: 12, border: `1px solid ${isCorrect ? '#10b981' : isWrong ? '#f43f5e' : isSelected ? '#00d4ff' : 'rgba(255,255,255,0.07)'}`, background: isCorrect ? 'rgba(16,185,129,0.12)' : isWrong ? 'rgba(244,63,94,0.12)' : '#111827', color: isCorrect ? '#10b981' : isWrong ? '#f43f5e' : '#e2e8f0', fontSize: 14, cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans',sans-serif" }}>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Skill results so far */}
        {results.length > 0 && (
          <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {results.map((r, i) => (
              <div key={i} style={{ background: r.passed ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)', border: `1px solid ${r.passed ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`, borderRadius: 8, padding: '4px 12px', fontSize: 11, color: r.passed ? '#10b981' : '#f43f5e' }}>
                {r.skill}: {r.score}% {r.passed ? '✓' : '✗'}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Phase: Results + route to roadmap ───────────────────────────────────
function ResultsPhase({ allSkills, knownIndices, unknownIndices, mcqResults, roadmapId, navigate }) {
  const knownSkills = allSkills.filter((_, i) => knownIndices.includes(i));
  const unknownSkills = allSkills.filter((_, i) => unknownIndices.includes(i));

  // Skills that failed MCQ (score < 75%)
  const failedSkills = mcqResults.filter(r => !r.passed).map(r => r.skill);
  const failedSkillObjs = knownSkills.filter(s => failedSkills.includes(s.name));

  // Overall score
  const totalScore = mcqResults.length > 0
    ? Math.round(mcqResults.reduce((sum, r) => sum + r.score, 0) / mcqResults.length)
    : 0;

  const needsFullRoadmap = totalScore < 75;

  const handleProceed = async () => {
    try {
      // Save which skills need roadmap
      const skillsForRoadmap = needsFullRoadmap
        ? allSkills.map(s => s.name)           // all skills
        : [...unknownSkills.map(s => s.name), ...failedSkillObjs.map(s => s.name)];  // unknown + failed

      await axios.patch(`${API}/api/roadmap/${roadmapId}/gap-analysis`,
        { skillsForRoadmap, overallScore: totalScore, needsFullRoadmap },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      navigate('/personalized-roadmap');
    } catch {
      navigate('/personalized-roadmap');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 620 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>{totalScore >= 75 ? '🎉' : '💪'}</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Analysis Complete!</h2>
          <div style={{ display: 'inline-block', background: totalScore >= 75 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${totalScore >= 75 ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`, borderRadius: 100, padding: '8px 24px', fontSize: 22, fontWeight: 800, color: totalScore >= 75 ? '#10b981' : '#f59e0b', fontFamily: "'Syne',sans-serif" }}>
            {totalScore}% — {totalScore >= 75 ? 'Strong Foundation' : 'Needs Improvement'}
          </div>
        </div>

        {/* Score breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Known Skills', val: knownIndices.length, color: '#10b981' },
            { label: 'Unknown Skills', val: unknownIndices.length, color: '#f43f5e' },
            { label: 'MCQ Score', val: `${totalScore}%`, color: totalScore >= 75 ? '#10b981' : '#f59e0b' },
          ].map((item, i) => (
            <div key={i} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: item.color }}>{item.val}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Roadmap decision */}
        <div style={{ background: needsFullRoadmap ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.08)', border: `1px solid ${needsFullRoadmap ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.25)'}`, borderRadius: 14, padding: '18px 20px', marginBottom: 24 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: needsFullRoadmap ? '#f59e0b' : '#10b981', marginBottom: 8 }}>
            {needsFullRoadmap ? '⚠️ Full Roadmap Required (Score < 75%)' : '✅ Gap-based Roadmap (Score ≥ 75%)'}
          </div>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
            {needsFullRoadmap
              ? `Your MCQ score is ${totalScore}%. A complete roadmap covering all ${allSkills.length} skills will be generated to strengthen your foundation.`
              : `Great job! Since you scored ${totalScore}%, we'll skip skills you know well and build a focused roadmap for ${unknownSkills.length + failedSkillObjs.length} skills you need to improve.`}
          </p>
        </div>

        {/* MCQ results */}
        {mcqResults.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Per-Skill Results</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mcqResults.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '10px 16px' }}>
                  <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600 }}>{r.skill}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 80, height: 6, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${r.score}%`, height: '100%', background: r.passed ? '#10b981' : '#f43f5e', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 12, color: r.passed ? '#10b981' : '#f43f5e', fontWeight: 700, minWidth: 44 }}>{r.score}% {r.passed ? '✓' : '✗'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={handleProceed} style={{ width: '100%', background: 'linear-gradient(135deg,#7c3aed,#00d4ff)', border: 'none', borderRadius: 14, padding: '15px', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: "'Syne',sans-serif" }}>
          Generate My Personalized Roadmap →
        </button>
      </div>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────
export default function Roadmap() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('loading'); // loading | skillcheck | mcq | results
  const [skills, setSkills] = useState([]);
  const [roadmapId, setRoadmapId] = useState(null);
  const [markedMap, setMarkedMap] = useState({});
  const [mcqResults, setMcqResults] = useState([]);

  useEffect(() => { generateRoadmap(); }, []);

  const generateRoadmap = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API}/api/roadmap/generate`, {},
        { headers: { Authorization: `Bearer ${token}` } });
      const r = res.data.roadmap;
      setSkills(r.skills || []);
      setRoadmapId(r._id);
      // Cache role for MCQ generation
      localStorage.setItem('sp_role', r.role || '');
      setPhase('skillcheck');
    } catch (err) {
      toast.error('Failed to generate roadmap. Check Gemini API key.');
      navigate('/domain');
    }
  };

  const handleSkillCheckDone = (marked) => {
    setMarkedMap(marked);
    const knownIndices = Object.keys(marked).filter(i => marked[i] === true).map(Number);
    if (knownIndices.length === 0) {
      // No known skills — go straight to results
      handleMCQDone([]);
    } else {
      setPhase('mcq');
    }
  };

  const handleMCQDone = (results) => {
    setMcqResults(results);
    setPhase('results');
  };

  const knownIndices = Object.keys(markedMap).filter(i => markedMap[i] === true).map(Number);
  const unknownIndices = Object.keys(markedMap).filter(i => markedMap[i] === false).map(Number);

  if (phase === 'loading') return <LoadingSkeleton />;
  if (phase === 'skillcheck') return <SkillCheckPhase skills={skills} onDone={handleSkillCheckDone} />;
  if (phase === 'mcq') return <SkillMCQPhase skills={skills} knownIndices={knownIndices} onDone={handleMCQDone} />;
  if (phase === 'results') return (
    <ResultsPhase
      allSkills={skills} knownIndices={knownIndices} unknownIndices={unknownIndices}
      mcqResults={mcqResults} roadmapId={roadmapId} navigate={navigate}
    />
  );
  return null;
}
