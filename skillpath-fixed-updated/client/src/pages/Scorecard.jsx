import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';

const API = import.meta.env.VITE_API_URL;

const BADGE_CONFIG = {
  Beginner:    { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)',   icon: '🌱' },
  Developing:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: '📈' },
  'Job Ready': { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: '💼' },
  Expert:      { color: '#7c3aed', bg: 'rgba(124,58,237,0.12)',  icon: '🏆' },
};

function ScoreRing({ pct }) {
  const color = pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#f43f5e';
  const r = 70;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center">
      <svg width="170" height="170" viewBox="0 0 170 170">
        <circle cx="85" cy="85" r={r} fill="none" stroke="#1e293b" strokeWidth="14" />
        <circle
          cx="85" cy="85" r={r} fill="none"
          stroke={color} strokeWidth="14"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          transform="rotate(-90 85 85)"
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
        <text x="85" y="80" textAnchor="middle" fill={color} fontSize="32" fontWeight="800" fontFamily="Syne, sans-serif">{pct}%</text>
        <text x="85" y="102" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="DM Sans, sans-serif">Overall Score</text>
      </svg>
    </div>
  );
}

function WeakSkillCard({ skill }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchResources = async () => {
    if (resources.length > 0) { setOpen(o => !o); return; }
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/api/score/weak-resources`,
        { skill },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setResources(res.data.resources || []);
      setOpen(true);
    } catch {
      toast.error('Could not fetch resources');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#111827', border: '1px solid rgba(244,63,94,0.2)' }}>
      <button
        onClick={fetchResources}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-rose-400 text-sm">⚠️</span>
          <span className="text-sm text-slate-200">{skill}</span>
        </div>
        <span className="text-xs text-cyan-400 underline">{loading ? 'Loading…' : open ? '▲ Hide' : '📚 Resources'}</span>
      </button>
      {open && resources.length > 0 && (
        <div className="px-4 pb-3 pt-1 border-t border-white/5">
          {resources.map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 py-1">
              <span>🔗</span>
              <span className="underline underline-offset-2">{r.title}</span>
              <span className="ml-auto text-slate-600 capitalize">{r.type}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// Confetti canvas
function ConfettiBlast() {
  const canvasRef = useRef(null);
  useEffect(() => {
    import('canvas-confetti').then(m => {
      const confetti = m.default;
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#00d4ff', '#7c3aed', '#10b981', '#f59e0b', '#f43f5e'] });
      setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 } }), 400);
      setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 } }), 600);
    }).catch(() => {});
  }, []);
  return null;
}

export default function Scorecard() {
  const navigate = useNavigate();
  const [score, setScore] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        // First try from navigation state (freshly submitted)
        const cached = localStorage.getItem('sp_latest_score');
        if (cached) {
          const data = JSON.parse(cached);
          if (data.score) setScore(data.score);
          if (data.result) setResult(data.result);
          setLoading(false);
          return;
        }
        const res = await axios.get(`${API}/api/score/latest`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (res.data.score) {
          setScore(res.data.score);
          setResult(res.data.score.resultId);
        }
      } catch {
        toast.error('Failed to load scorecard');
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0f1e' }}>
        <div className="space-y-4 w-full max-w-2xl px-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: '#111827' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!score) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0f1e' }}>
        <div className="text-center">
          <p className="text-slate-400">No score found. Please complete the assessment first.</p>
          <button onClick={() => navigate('/assessment')} className="mt-4 px-6 py-2 rounded-lg text-white text-sm" style={{ background: '#7c3aed' }}>
            Go to Assessment
          </button>
        </div>
      </div>
    );
  }

  const isJobReady = score.isJobReady;
  const pct = score.scorePercent;
  const badge = BADGE_CONFIG[score.jobReadinessBadge] || BADGE_CONFIG.Beginner;

  // Chart data
  const pieData = [
    { name: 'Correct', value: result?.correctCount || 0 },
    { name: 'Incorrect', value: result?.incorrectCount || 0 },
  ];
  const barData = Object.entries(score.performanceByDifficulty || {}).map(([diff, v]) => ({
    name: diff.charAt(0).toUpperCase() + diff.slice(1),
    Correct: v.correct || 0,
    Total: v.total || 0,
  }));
  const radarData = (score.skillCoverage || []).slice(0, 8).map(s => ({
    skill: s.skill.length > 12 ? s.skill.slice(0, 12) + '…' : s.skill,
    score: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
  }));

  return (
    <div className="min-h-screen pb-20" style={{ background: '#0a0f1e', fontFamily: "'DM Sans', sans-serif" }}>
      {isJobReady && <ConfettiBlast />}
      <div className="max-w-4xl mx-auto px-4 pt-10">

        {/* Header */}
        <p className="text-xs tracking-widest uppercase text-slate-500 mb-1">Step 7 of 10</p>
        <h1 className="text-3xl font-bold text-white mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
          Your Scorecard 📊
        </h1>

        {/* Score hero */}
        <div className="rounded-2xl p-6 mb-6 flex flex-col md:flex-row items-center gap-6"
          style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)' }}>
          <ScoreRing pct={pct} />
          <div className="flex-1 text-center md:text-left">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mb-3"
              style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.color}40` }}
            >
              {badge.icon} {score.jobReadinessBadge}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
              {isJobReady ? '🎉 Congratulations!' : '💪 Keep Going!'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isJobReady
                ? "You've proven your skills! Resume and job feed are now unlocked."
                : `You scored ${pct}%. Review weak areas and retake to unlock your resume.`}
            </p>
            <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-400">{result?.correctCount ?? 0}</p>
                <p className="text-xs text-slate-500">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-rose-400">{result?.incorrectCount ?? 0}</p>
                <p className="text-xs text-slate-500">Incorrect</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-amber-400">{result?.timedOutCount ?? 0}</p>
                <p className="text-xs text-slate-500">Timed Out</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-cyan-400">{result?.totalQuestions ?? 20}</p>
                <p className="text-xs text-slate-500">Total Qs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Pie */}
          <div className="rounded-xl p-4" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Correct vs Incorrect</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                  <Cell fill="#10b981" />
                  <Cell fill="#f43f5e" />
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#e2e8f0', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 justify-center text-xs">
              <span className="text-emerald-400">● Correct</span>
              <span className="text-rose-400">● Incorrect</span>
            </div>
          </div>

          {/* Bar */}
          <div className="rounded-xl p-4" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">By Difficulty</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={barData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#e2e8f0', fontSize: 12 }} />
                <Bar dataKey="Correct" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Total" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar */}
          <div className="rounded-xl p-4" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Skill Coverage</p>
            <ResponsiveContainer width="100%" height={160}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={55}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 9 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="score" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Strengths */}
          <div className="rounded-xl p-5" style={{ background: '#111827', border: '1px solid rgba(16,185,129,0.2)' }}>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">✅ Strengths</p>
            {score.strengths?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {score.strengths.map(s => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{s}</span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No strong areas identified yet.</p>
            )}
          </div>

          {/* Weaknesses */}
          <div className="rounded-xl p-5" style={{ background: '#111827', border: '1px solid rgba(244,63,94,0.2)' }}>
            <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest mb-3">⚠️ Needs Improvement</p>
            {score.weaknesses?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {score.weaknesses.map(s => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">{s}</span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No weak areas! Great job 🎉</p>
            )}
          </div>
        </div>

        {/* ── RESULT-BASED ACTION (Step 8) ── */}
        {!isJobReady ? (
          /* Score < 70% */
          <div className="rounded-2xl p-6" style={{ background: '#111827', border: '1px solid rgba(244,63,94,0.2)' }}>
            <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
              💪 Keep Going!
            </h3>
            <p className="text-slate-400 text-sm mb-5">
              You scored {pct}%. You need 70% to unlock resume and job feed. Review these weak skills and retake.
            </p>

            {score.weaknesses?.length > 0 && (
              <div className="space-y-2 mb-6">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Weak Skills — Tap to load free resources</p>
                {score.weaknesses.map(s => <WeakSkillCard key={s} skill={s} />)}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => { localStorage.removeItem('sp_latest_score'); navigate('/assessment'); }}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #f43f5e, #7c3aed)' }}
              >
                🔄 Retake Assessment
              </button>
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('token');
                    // Delete existing roadmap + assessment so fresh ones are generated
                    await fetch(`${import.meta.env.VITE_API_URL}/api/roadmap`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                    await fetch(`${import.meta.env.VITE_API_URL}/api/assessment`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }).catch(()=>{});
                    localStorage.removeItem('sp_latest_score');
                    navigate('/roadmap');
                  } catch { navigate('/roadmap'); }
                }}
                className="flex-1 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.4)' }}
              >
                🗺️ Regenerate Roadmap
              </button>
              <button
                onClick={() => navigate('/roadmap-journey')}
                className="flex-1 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                📚 Continue Learning
              </button>
            </div>
          </div>
        ) : (
          /* Score ≥ 70% */
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(0,212,255,0.08))', border: '1px solid rgba(16,185,129,0.3)' }}
          >
            <p className="text-5xl mb-3">🎉</p>
            <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
              Congratulations! You are Job Ready!
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Outstanding! You scored {pct}% and earned the <strong style={{ color: badge.color }}>{score.jobReadinessBadge}</strong> badge.
              Your resume and job feed are now unlocked.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/resume')}
                className="px-8 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.03]"
                style={{ background: 'linear-gradient(135deg, #10b981, #00d4ff)' }}
              >
                📄 Generate My Resume
              </button>
              <button
                onClick={() => navigate('/jobs')}
                className="px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.03]"
                style={{ background: '#111827', color: '#10b981', border: '1px solid rgba(16,185,129,0.4)' }}
              >
                💼 View Job Feed
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
