import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL;
const QUESTION_TIME = 30;

const s = (obj) => obj; // passthrough for inline styles

function DiffBadge({ d }) {
  const c = { easy: ['#10b981','rgba(16,185,129,0.12)'], medium: ['#f59e0b','rgba(245,158,11,0.12)'], hard: ['#f43f5e','rgba(244,63,94,0.12)'] }[d] || ['#94a3b8','rgba(148,163,184,0.1)'];
  return <span style={{ color: c[0], background: c[1], border: `1px solid ${c[0]}44`, borderRadius: 100, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>{d}</span>;
}

function CodeWorkspace({ onSubmit }) {
  const [answer, setAnswer] = useState('');
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
        <span style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 6, padding: '3px 10px', fontSize: 11, color: '#a78bfa' }}>💻 Code Explanation Workspace</span>
      </div>
      <div style={{ marginBottom: 8, padding: '10px 14px', borderRadius: 10, background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', fontSize: 12, color: '#a78bfa' }}>
        💡 Explain what the code does, its output, or the concept being tested.
      </div>
      <textarea value={answer} onChange={e => setAnswer(e.target.value)}
        placeholder="Describe what this code does, what output it produces..."
        style={{ width: '100%', minHeight: 160, background: '#111827', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 12, padding: '14px', color: '#e2e8f0', fontSize: 14, lineHeight: 1.7, outline: 'none', resize: 'vertical', fontFamily: 'DM Sans,sans-serif' }} />
      <button onClick={() => onSubmit(answer)} disabled={!answer.trim()}
        style={{ marginTop: 10, width: '100%', background: answer.trim() ? 'rgba(124,58,237,0.15)' : '#1e293b', border: `1px solid ${answer.trim() ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 10, padding: '11px', color: answer.trim() ? '#a78bfa' : '#475569', fontWeight: 600, fontSize: 13, cursor: answer.trim() ? 'pointer' : 'not-allowed' }}>
        Submit Explanation →
      </button>
    </div>
  );
}

function ScenarioWorkspace({ onSubmit }) {
  const [answer, setAnswer] = useState('');
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
        <span style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 6, padding: '3px 10px', fontSize: 11, color: '#f59e0b' }}>📋 Scenario Workspace</span>
      </div>
      <textarea value={answer} onChange={e => setAnswer(e.target.value)}
        placeholder="Describe your approach, steps, and considerations..."
        style={{ width: '100%', minHeight: 150, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px', color: '#e2e8f0', fontSize: 14, lineHeight: 1.7, outline: 'none', resize: 'vertical', fontFamily: 'DM Sans,sans-serif' }} />
      <button onClick={() => onSubmit(answer)} disabled={!answer.trim()}
        style={{ marginTop: 10, width: '100%', background: answer.trim() ? 'rgba(245,158,11,0.1)' : '#1e293b', border: `1px solid ${answer.trim() ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 10, padding: '11px', color: answer.trim() ? '#f59e0b' : '#475569', fontWeight: 600, fontSize: 13, cursor: answer.trim() ? 'pointer' : 'not-allowed' }}>
        Submit Answer →
      </button>
    </div>
  );
}

/* ── Auto-Start Screen (no manual input needed) ─────────────────────── */
function AutoStartScreen({ onStart, loading }) {
  const [domainInfo, setDomainInfo] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchInfo = async () => {
      try {
        const [domainRes, roadmapRes] = await Promise.all([
          axios.get(`${API}/api/domain`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/api/roadmap`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const domain = domainRes.data?.domain;
        const roadmap = roadmapRes.data?.roadmap;
        setDomainInfo({
          role: domain?.subRole || 'Your Role',
          category: domain?.category || '',
          skills: roadmap?.skills?.map(s => s.name) || [],
          totalSkills: roadmap?.skills?.length || 0,
        });
      } catch {
        setDomainInfo({ role: 'Your Role', category: '', skills: [], totalSkills: 0 });
      } finally {
        setFetching(false);
      }
    };
    fetchInfo();
  }, []);

  if (fetching) return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
      <div style={{ width: 44, height: 44, border: '3px solid rgba(0,212,255,0.2)', borderTop: '3px solid #00d4ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#00d4ff', fontFamily: 'Syne,sans-serif', fontSize: 15 }}>Loading your profile...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 540 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-block', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 100, padding: '5px 18px', fontSize: 11, color: '#00d4ff', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>Step 06 — Final Assessment</div>
          <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Major Assessment 🎯</h1>
          <p style={{ color: '#64748b', fontSize: 13 }}>20 questions · MCQ + Scenario + Code · 30s per question</p>
        </div>

        {/* Profile card */}
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 28, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '10px 14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10 }}>
            <span style={{ fontSize: 16 }}>✅</span>
            <span style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>Auto-filled from your profile</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#1e293b', borderRadius: 12 }}>
              <span style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>Target Role</span>
              <span style={{ fontSize: 14, color: '#00d4ff', fontWeight: 700, fontFamily: 'Syne,sans-serif' }}>{domainInfo?.role}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#1e293b', borderRadius: 12 }}>
              <span style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>Category</span>
              <span style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 600 }}>{domainInfo?.category}</span>
            </div>
            <div style={{ padding: '12px 16px', background: '#1e293b', borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>Skills to Test</span>
                <span style={{ fontSize: 11, color: '#7c3aed', fontWeight: 600 }}>{domainInfo?.totalSkills} skills</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {domainInfo?.skills.slice(0, 8).map((skill, i) => (
                  <span key={i} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '4px 10px', fontSize: 11, color: '#94a3b8' }}>{skill}</span>
                ))}
                {domainInfo?.skills.length > 8 && (
                  <span style={{ background: '#0f172a', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 8, padding: '4px 10px', fontSize: 11, color: '#7c3aed' }}>+{domainInfo.skills.length - 8} more</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div style={{ marginBottom: 16, padding: '12px 14px', borderRadius: 10, fontSize: 12, color: '#f59e0b', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', lineHeight: 1.6 }}>
          ⚠️ Once started, you cannot pause. Coding & scenario questions have a workspace. Each MCQ auto-advances in 30 seconds.
        </div>

        <button onClick={() => onStart(domainInfo)} disabled={loading}
          style={{ width: '100%', background: loading ? '#1e293b' : 'linear-gradient(135deg,#7c3aed,#00d4ff)', border: 'none', borderRadius: 14, padding: '15px', color: '#fff', fontWeight: 800, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Syne,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: loading ? 0.7 : 1 }}>
          {loading ? (
            <><span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }}/> Generating 20 Questions…</>
          ) : 'Start Assessment →'}
        </button>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}

/* ── Question Screen ─────────────────────────────────────────────────── */
function QuestionScreen({ questions, assessmentId, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef(null);

  const q = questions[currentIdx];
  const isCode = q?.type === 'code-reading' || q?.type === 'coding';
  const isScenario = q?.type === 'scenario';
  const isMCQ = !isCode && !isScenario;

  const advance = useCallback((answersSnapshot) => {
    const next = currentIdx + 1;
    if (next >= questions.length) {
      submitAll(answersSnapshot || answers);
      return;
    }
    setCurrentIdx(next);
    setSelected(null);
    setTimeLeft(QUESTION_TIME);
  }, [currentIdx, questions.length, answers]);

  useEffect(() => {
    if (!isMCQ) return;
    clearInterval(timerRef.current);
    setTimeLeft(QUESTION_TIME);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); advance(answers); return QUESTION_TIME; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentIdx, isMCQ]);

  const handleSelect = (opt) => {
    if (selected) return;
    clearInterval(timerRef.current);
    setSelected(opt);
    const newAnswers = { ...answers, [currentIdx]: opt };
    setAnswers(newAnswers);
    setTimeout(() => advance(newAnswers), 700);
  };

  const handleWorkspace = (answer) => {
    const newAnswers = { ...answers, [currentIdx]: answer };
    setAnswers(newAnswers);
    advance(newAnswers);
  };

  const submitAll = async (finalAnswers) => {
    setSubmitting(true);
    try {
      const answersArray = questions.map((_, i) => finalAnswers[i] ?? null);
      const res = await axios.post(`${API}/api/assessment/${assessmentId}/submit`,
        { answers: answersArray, timeTakenSeconds: questions.length * QUESTION_TIME },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      onComplete(res.data);
    } catch (err) {
      toast.error('Submission failed. Please try again.');
      setSubmitting(false);
    }
  };

  if (submitting) return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
      <div style={{ width: 56, height: 56, border: '3px solid rgba(0,212,255,0.2)', borderTop: '3px solid #00d4ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#fff', fontFamily: 'Syne,sans-serif', fontSize: 20, fontWeight: 700 }}>Calculating your score…</p>
      <p style={{ color: '#64748b', fontSize: 13 }}>Analyzing {questions.length} responses</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  if (!q) return null;
  const timerPct = (timeLeft / QUESTION_TIME) * 100;
  const timerColor = timeLeft <= 10 ? '#f43f5e' : timeLeft <= 20 ? '#f59e0b' : '#10b981';

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', flexDirection: 'column' }}>
      {isMCQ && <div style={{ height: 3, width: `${timerPct}%`, background: timerColor, transition: 'width 1s linear' }} />}

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 16px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 660 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Question {currentIdx + 1} of {questions.length}</span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <DiffBadge d={q.difficulty} />
              <span style={{ fontSize: 11, background: '#1e293b', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 100, padding: '3px 10px', color: '#94a3b8' }}>{q.skill}</span>
              {isCode && <span style={{ fontSize: 11, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 100, padding: '3px 10px', color: '#a78bfa' }}>💻 Code</span>}
              {isScenario && <span style={{ fontSize: 11, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 100, padding: '3px 10px', color: '#f59e0b' }}>📋 Scenario</span>}
            </div>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
            {questions.map((_, i) => (
              <div key={i} style={{ height: 4, flex: '1 0 14px', maxWidth: 30, borderRadius: 2, background: i < currentIdx ? '#10b981' : i === currentIdx ? '#00d4ff' : '#1e293b', transition: 'background 0.3s' }} />
            ))}
          </div>

          {/* Timer — MCQ only */}
          {isMCQ && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{ width: 58, height: 58, borderRadius: '50%', border: `4px solid ${timerColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: timerColor, fontFamily: 'Syne,sans-serif', transition: 'border-color 1s, color 1s' }}>
                {timeLeft}
              </div>
            </div>
          )}

          {/* Question */}
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '22px 24px', marginBottom: 16 }}>
            <p style={{ color: '#e2e8f0', fontSize: 15, fontWeight: 600, lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{q.question}</p>
          </div>

          {/* MCQ */}
          {isMCQ && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(q.options || []).map((opt, i) => {
                const isSel = selected === opt;
                const isCorrect = selected && opt === q.correctAnswer;
                const isWrong = isSel && opt !== q.correctAnswer;
                return (
                  <button key={i} onClick={() => handleSelect(opt)} disabled={!!selected}
                    style={{ textAlign: 'left', padding: '14px 20px', borderRadius: 14, border: `1px solid ${isCorrect ? '#10b981' : isWrong ? '#f43f5e' : 'rgba(255,255,255,0.07)'}`, background: isCorrect ? 'rgba(16,185,129,0.12)' : isWrong ? 'rgba(244,63,94,0.12)' : '#111827', color: isCorrect ? '#10b981' : isWrong ? '#f43f5e' : '#e2e8f0', fontSize: 14, cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', fontFamily: 'DM Sans,sans-serif' }}>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {isCode && <CodeWorkspace onSubmit={handleWorkspace} />}
          {isScenario && <ScenarioWorkspace onSubmit={handleWorkspace} />}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}

/* ── Main Export ─────────────────────────────────────────────────────── */
export default function Assessment() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('setup');
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState(null);

  const handleStart = async (domainInfo) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Send minimal data — server will auto-fetch rest from DB
      const res = await axios.post(`${API}/api/assessment/generate`,
        {
          role: domainInfo?.role || '',
          category: domainInfo?.category || '',
          skillsList: domainInfo?.skills || [],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        const a = res.data.assessment;
        await axios.patch(`${API}/api/assessment/${a._id}/start`, {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAssessment(a);
        setPhase('questions');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = (data) => {
    localStorage.setItem('sp_latest_score', JSON.stringify(data));
    navigate('/scorecard');
  };

  if (phase === 'setup') return <AutoStartScreen onStart={handleStart} loading={loading} />;
  if (phase === 'questions' && assessment) return <QuestionScreen questions={assessment.questions} assessmentId={assessment._id} onComplete={handleComplete} />;
  return null;
}
