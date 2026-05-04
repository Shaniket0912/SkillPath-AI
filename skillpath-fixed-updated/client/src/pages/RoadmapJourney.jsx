import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL;

const LEVEL_ORDER = ['Beginner', 'Intermediate', 'Advanced'];
const LEVEL_COLORS = {
  Beginner: { border: '#10b981', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  Intermediate: { border: '#00d4ff', badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  Advanced: { border: '#7c3aed', badge: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
};
const MILESTONES = [
  { pct: 25, label: '🌱 Sprout', desc: 'Foundation built' },
  { pct: 50, label: '🔥 On Fire', desc: 'Halfway legend' },
  { pct: 75, label: '⚡ Lightning', desc: 'Almost there' },
  { pct: 100, label: '🏆 Master', desc: 'Full stack done' },
];

function SkillCard({ skill, onMarkLearned }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMark = async () => {
    if (skill.learned) return;
    setLoading(true);
    await onMarkLearned(skill._id);
    setLoading(false);
  };

  return (
    <div
      className="rounded-xl border transition-all duration-200"
      style={{
        background: '#111827',
        borderColor: skill.learned ? '#10b981' : 'rgba(255,255,255,0.07)',
        boxShadow: skill.learned ? '0 0 12px rgba(16,185,129,0.15)' : 'none',
      }}
    >
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: skill.learned ? '#10b981' : '#1e293b', color: skill.learned ? '#fff' : '#94a3b8' }}
          >
            {skill.learned ? '✓' : '?'}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">{skill.name || skill.title}</p>
            {skill.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{skill.description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {skill.learned && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Learned
            </span>
          )}
          <span className="text-slate-500 text-xs">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-white/5 pt-3">
          {skill.resources?.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-widest">Resources</p>
              <div className="flex flex-col gap-2">
                {skill.resources.map((r, i) => (
                  <a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>🔗</span>
                    <span className="underline underline-offset-2">{r.title || r.url}</span>
                    {r.type && <span className="ml-auto text-slate-600 capitalize">{r.type}</span>}
                  </a>
                ))}
              </div>
            </div>
          )}
          {skill.projects?.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-widest">Project Ideas</p>
              {skill.projects.map((p, i) => (
                <p key={i} className="text-xs text-slate-400 mb-1">• {p}</p>
              ))}
            </div>
          )}
          {!skill.learned && (
            <button
              onClick={handleMark}
              disabled={loading}
              className="mt-2 w-full py-2 rounded-lg text-xs font-semibold transition-all"
              style={{ background: loading ? '#1e293b' : '#10b981', color: '#fff' }}
            >
              {loading ? 'Saving…' : '✓ Mark as Learned'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function RoadmapJourney() {
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);

  const token = () => localStorage.getItem('token');

  const fetchRoadmap = useCallback(async () => {
    try {
      const userId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id;
      const res = await axios.get(`${API}/api/roadmap/${userId}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setRoadmap(res.data.roadmap || res.data);
      // Streak from localStorage (simple day counter)
      const last = localStorage.getItem('sp_last_active');
      const today = new Date().toDateString();
      if (last !== today) {
        const s = parseInt(localStorage.getItem('sp_streak') || '0', 10);
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const newStreak = last === yesterday ? s + 1 : 1;
        localStorage.setItem('sp_streak', String(newStreak));
        localStorage.setItem('sp_last_active', today);
        setStreak(newStreak);
      } else {
        setStreak(parseInt(localStorage.getItem('sp_streak') || '1', 10));
      }
    } catch {
      toast.error('Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRoadmap(); }, [fetchRoadmap]);

  const handleMarkLearned = async (skillId) => {
    try {
      await axios.patch(`${API}/api/roadmap/skill/${skillId}`, { learned: true }, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      toast.success('Skill marked as learned! 🎉');
      fetchRoadmap();
    } catch {
      toast.error('Failed to update skill');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0f1e' }}>
        <div className="space-y-4 w-full max-w-2xl px-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: '#111827' }} />
          ))}
        </div>
      </div>
    );
  }

  const allSkills = roadmap?.skills || [];
  const learnedCount = allSkills.filter(s => s.learned).length;
  const totalCount = allSkills.length;
  const pct = totalCount > 0 ? Math.round((learnedCount / totalCount) * 100) : 0;
  const canTakeAssessment = pct >= 60;

  // Group by level
  const grouped = LEVEL_ORDER.reduce((acc, level) => {
    const skills = allSkills.filter(s => (s.level || 'Beginner') === level);
    if (skills.length > 0) acc[level] = skills;
    return acc;
  }, {});

  return (
    <div className="min-h-screen pb-20" style={{ background: '#0a0f1e', fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-4xl mx-auto px-4 pt-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase text-slate-500 mb-1">Step 5 of 10</p>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            Your Learning Journey 🗺️
          </h1>
          <p className="text-slate-400 text-sm mt-1">Track your progress, expand skills, and unlock your assessment.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Skills Learned', value: `${learnedCount}/${totalCount}`, color: '#10b981' },
            { label: 'Progress', value: `${pct}%`, color: '#00d4ff' },
            { label: 'Day Streak 🔥', value: `${streak}d`, color: '#f59e0b' },
            { label: 'Status', value: canTakeAssessment ? 'Unlocked 🔓' : `Need ${60 - pct}% more`, color: canTakeAssessment ? '#10b981' : '#f43f5e' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-xs text-slate-500 mb-1">{s.label}</p>
              <p className="text-xl font-bold" style={{ color: s.color, fontFamily: "'Syne', sans-serif" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="rounded-xl p-5 mb-6" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-slate-300">Overall Progress</span>
            <span className="text-sm font-bold" style={{ color: '#00d4ff' }}>{pct}%</span>
          </div>
          <div className="relative h-3 rounded-full overflow-hidden" style={{ background: '#1e293b' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #7c3aed, #00d4ff)' }}
            />
          </div>
          {/* Milestone markers */}
          <div className="flex justify-between mt-3">
            {MILESTONES.map(m => (
              <div key={m.pct} className="flex flex-col items-center">
                <div
                  className="text-lg transition-all duration-300"
                  style={{ opacity: pct >= m.pct ? 1 : 0.25, filter: pct >= m.pct ? 'none' : 'grayscale(1)' }}
                >
                  {m.label.split(' ')[0]}
                </div>
                <span className="text-xs text-slate-600 mt-0.5">{m.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {MILESTONES.map(m => {
            const unlocked = pct >= m.pct;
            return (
              <div
                key={m.pct}
                className="rounded-xl p-3 text-center transition-all"
                style={{
                  background: unlocked ? 'rgba(16,185,129,0.08)' : '#111827',
                  border: `1px solid ${unlocked ? '#10b981' : 'rgba(255,255,255,0.07)'}`,
                  opacity: unlocked ? 1 : 0.45,
                }}
              >
                <p className="text-2xl mb-1">{m.label.split(' ')[0]}</p>
                <p className="text-xs font-semibold text-slate-300">{m.label.split(' ').slice(1).join(' ')}</p>
                <p className="text-xs text-slate-500 mt-0.5">{m.desc}</p>
                {unlocked && <p className="text-xs text-emerald-400 mt-1 font-semibold">Unlocked ✓</p>}
              </div>
            );
          })}
        </div>

        {/* Skills by Level */}
        {Object.entries(grouped).map(([level, skills]) => {
          const lc = skills.filter(s => s.learned).length;
          const lConfig = LEVEL_COLORS[level] || LEVEL_COLORS.Beginner;
          return (
            <div key={level} className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400"
                  style={{ fontFamily: "'Syne', sans-serif" }}>
                  {level}
                </h2>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${lConfig.badge}`}>
                  {lc}/{skills.length}
                </span>
                <div className="flex-1 h-px" style={{ background: lConfig.border, opacity: 0.3 }} />
              </div>
              <div className="grid gap-3">
                {skills.map(skill => (
                  <SkillCard key={skill._id} skill={skill} onMarkLearned={handleMarkLearned} />
                ))}
              </div>
            </div>
          );
        })}

        {/* CTA */}
        <div
          className="mt-8 rounded-2xl p-6 text-center"
          style={{
            background: canTakeAssessment ? 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(0,212,255,0.1))' : '#111827',
            border: `1px solid ${canTakeAssessment ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.07)'}`,
          }}
        >
          {canTakeAssessment ? (
            <>
              <p className="text-2xl mb-2">🎯</p>
              <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                You're Ready for Assessment!
              </h3>
              <p className="text-slate-400 text-sm mb-4">You've learned {pct}% of the roadmap. Take the final assessment now.</p>
              <button
                onClick={() => navigate('/assessment')}
                className="px-8 py-3 rounded-xl font-bold text-sm text-white transition-transform hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #00d4ff)' }}
              >
                Take Final Assessment →
              </button>
            </>
          ) : (
            <>
              <p className="text-2xl mb-2">🔒</p>
              <h3 className="text-lg font-bold text-slate-400 mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                Assessment Locked
              </h3>
              <p className="text-slate-500 text-sm">
                Mark at least 60% of skills as learned to unlock the assessment.
                <br />You need {Math.ceil(totalCount * 0.6) - learnedCount} more skill{Math.ceil(totalCount * 0.6) - learnedCount !== 1 ? 's' : ''}.
              </p>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
