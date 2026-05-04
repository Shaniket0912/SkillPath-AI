import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL;

const LEVEL_CONFIG = {
  beginner:     { label: 'Beginner',     color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)' },
  intermediate: { label: 'Intermediate', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
  advanced:     { label: 'Advanced',     color: '#f43f5e', bg: 'rgba(244,63,94,0.1)',  border: 'rgba(244,63,94,0.25)' },
};

/* ── Single Skill Card ── */
function SkillCard({ skill, role, onMarkLearned, savingId }) {
  const [open, setOpen]           = useState(false);
  const [resources, setResources] = useState(null);
  const [fetching, setFetching]   = useState(false);
  const cfg = LEVEL_CONFIG[skill.level] || LEVEL_CONFIG.beginner;
  const isSaving = savingId === skill._id;

  const fetchResources = useCallback(async () => {
    if (resources) { setOpen((p) => !p); return; }
    setFetching(true);
    setOpen(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${API}/api/roadmap/skill-resources`,
        { skillId: skill._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResources(data.resources);
    } catch {
      toast.error('Could not load resources. Try again.');
      setOpen(false);
    } finally {
      setFetching(false);
    }
  }, [resources, skill._id]);

  return (
    <div
      style={{
        background: skill.isLearned ? 'rgba(16,185,129,0.06)' : '#111827',
        border: `1px solid ${skill.isLearned ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.07)'}`,
        borderLeft: `3px solid ${skill.isLearned ? '#10b981' : cfg.color}`,
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* ── Header row ── */}
      <div style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>

          {/* Left: icon + title */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: skill.isLearned ? 'rgba(16,185,129,0.15)' : cfg.bg,
                border: `1px solid ${skill.isLearned ? 'rgba(16,185,129,0.3)' : cfg.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {skill.isLearned ? '✅' : '📖'}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 5 }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>
                  {skill.name}
                </span>
                <span
                  style={{
                    background: cfg.bg,
                    border: `1px solid ${cfg.border}`,
                    borderRadius: 100,
                    padding: '1px 8px',
                    fontSize: 10,
                    color: cfg.color,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                  }}
                >
                  {cfg.label}
                </span>
                {skill.isLearned && (
                  <span
                    style={{
                      background: 'rgba(16,185,129,0.15)',
                      border: '1px solid rgba(16,185,129,0.35)',
                      borderRadius: 100,
                      padding: '1px 8px',
                      fontSize: 10,
                      color: '#10b981',
                    }}
                  >
                    ✓ Learned
                  </span>
                )}
              </div>
              <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                {skill.description}
              </p>
            </div>
          </div>

          {/* Right: action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flexShrink: 0, alignItems: 'flex-end' }}>
            <button
              onClick={() => onMarkLearned(skill._id, !skill.isLearned)}
              disabled={isSaving}
              style={{
                background: skill.isLearned ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.12)',
                border: `1px solid ${skill.isLearned ? 'rgba(244,63,94,0.3)' : 'rgba(16,185,129,0.35)'}`,
                borderRadius: 9,
                padding: '7px 14px',
                fontSize: 12,
                fontWeight: 600,
                color: skill.isLearned ? '#f43f5e' : '#10b981',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              {isSaving ? (
                <span style={{ width: 12, height: 12, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
              ) : skill.isLearned ? (
                '↩ Mark Unlearned'
              ) : (
                '✅ Mark as Learned'
              )}
            </button>

            <button
              onClick={fetchResources}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 9,
                padding: '6px 14px',
                fontSize: 11.5,
                color: open ? '#00d4ff' : '#64748b',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              {open ? '▲ Hide Resources' : '▾ View Resources'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Expanded Resources Panel ── */}
      {open && (
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: '#0d1526',
          }}
        >
          {fetching ? (
            <div style={{ padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(0,212,255,0.15)', borderTop: '3px solid #00d4ff', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontSize: 12, color: '#64748b' }}>Gemini is loading resources…</span>
              {[1,2,3].map(i => (
                <div key={i} style={{ height: 44, width: '100%', maxWidth: 520, background: '#111827', borderRadius: 8, animation: 'pulse 1.4s ease infinite', opacity: 1 - i*0.2 }} />
              ))}
            </div>
          ) : resources ? (
            <div style={{ padding: '20px 20px 24px' }}>

              {/* Description */}
              <div
                style={{
                  background: 'rgba(0,212,255,0.05)',
                  border: '1px solid rgba(0,212,255,0.12)',
                  borderRadius: 10,
                  padding: '12px 16px',
                  fontSize: 13,
                  color: '#94a3b8',
                  lineHeight: 1.65,
                  marginBottom: 20,
                }}
              >
                {resources.description}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                {/* YouTube */}
                <div>
                  <SectionLabel icon="▶" color="#f43f5e" label="YouTube Tutorials" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {(resources.youtubeLinks || []).map((v, i) => (
                      <ResourceLink key={i} title={v.title} url={v.url} color="#f43f5e" icon="▶" />
                    ))}
                  </div>
                </div>

                {/* Docs */}
                <div>
                  <SectionLabel icon="📄" color="#00d4ff" label="Documentation & Articles" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {(resources.docLinks || []).map((d, i) => (
                      <ResourceLink key={i} title={d.title} url={d.url} color="#00d4ff" icon="📄" />
                    ))}
                  </div>
                </div>

              </div>

              {/* Project Ideas */}
              {resources.projectIdeas?.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <SectionLabel icon="🛠️" color="#7c3aed" label="Project Ideas to Practice" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {resources.projectIdeas.map((idea, i) => {
                      const badges = ['Beginner', 'Intermediate', 'Advanced'];
                      const colors = ['#10b981', '#f59e0b', '#f43f5e'];
                      return (
                        <div
                          key={i}
                          style={{
                            background: '#111827',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 9,
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 10,
                          }}
                        >
                          <span
                            style={{
                              background: `${colors[i]}18`,
                              border: `1px solid ${colors[i]}35`,
                              borderRadius: 6,
                              padding: '2px 8px',
                              fontSize: 10,
                              color: colors[i],
                              flexShrink: 0,
                              marginTop: 1,
                            }}
                          >
                            {badges[i] || `Project ${i+1}`}
                          </span>
                          <span style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.55 }}>{idea}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tips */}
              {resources.tips?.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <SectionLabel icon="💡" color="#f59e0b" label="Pro Learning Tips" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {resources.tips.map((tip, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10,
                          fontSize: 12.5,
                          color: '#94a3b8',
                          lineHeight: 1.55,
                        }}
                      >
                        <span style={{ color: '#f59e0b', flexShrink: 0, marginTop: 1 }}>→</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function SectionLabel({ icon, color, label }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        marginBottom: 10,
        fontSize: 11,
        fontWeight: 700,
        color,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        fontFamily: "'Syne', sans-serif",
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function ResourceLink({ title, url, color, icon }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: '#111827',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 8,
        padding: '8px 12px',
        textDecoration: 'none',
        transition: 'border-color 0.2s',
      }}
    >
      <span style={{ color, fontSize: 12, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 12, color: '#94a3b8', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {title}
      </span>
      <span style={{ color: '#334155', fontSize: 11, flexShrink: 0 }}>↗</span>
    </a>
  );
}

/* ══════════════════════════════════════════════
   Main Page
══════════════════════════════════════════════ */
export default function PersonalizedRoadmap() {
  const navigate  = useNavigate();
  const [roadmap, setRoadmap]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [savingId, setSavingId] = useState(null);
  const token   = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchRoadmap(); }, []);

  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/roadmap`, { headers });
      setRoadmap(data.roadmap);
    } catch {
      toast.error('Could not load roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkLearned = async (skillId, isLearned) => {
    setSavingId(skillId);
    try {
      const { data } = await axios.patch(
        `${API}/api/roadmap/learn`,
        { skillId, isLearned },
        { headers }
      );
      setRoadmap(data.roadmap);
      if (isLearned) toast.success('Skill marked as learned! 🎉');
    } catch {
      toast.error('Could not save. Try again.');
    } finally {
      setSavingId(null);
    }
  };

  // ── derived ──
  const unknownSkills  = roadmap?.skills?.filter((s) => !s.isKnown) || [];
  const learnedCount   = unknownSkills.filter((s) => s.isLearned).length;
  const totalUnknown   = unknownSkills.length;
  const progressPct    = totalUnknown ? Math.round((learnedCount / totalUnknown) * 100) : 0;
  const canAssess      = totalUnknown === 0 || progressPct >= 60;

  const byLevel = {
    beginner:     unknownSkills.filter((s) => s.level === 'beginner'),
    intermediate: unknownSkills.filter((s) => s.level === 'intermediate'),
    advanced:     unknownSkills.filter((s) => s.level === 'advanced'),
  };

  // ── Loading ──
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid rgba(124,58,237,0.2)', borderTop: '3px solid #7c3aed', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ color: '#64748b', fontSize: 14 }}>Loading your learning plan…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Edge case: no unknown skills ──
  if (totalUnknown === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, padding: 24 }}>
        <span style={{ fontSize: 56 }}>🏆</span>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, color: '#e2e8f0', textAlign: 'center' }}>You already know everything!</h2>
        <p style={{ color: '#64748b', fontSize: 14, textAlign: 'center', maxWidth: 380 }}>All skills were marked as known. Head straight to the assessment.</p>
        <button
          onClick={() => navigate('/assessment')}
          style={{ background: 'linear-gradient(135deg,#7c3aed,#00d4ff)', border: 'none', borderRadius: 12, padding: '13px 32px', fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: "'Syne',sans-serif" }}
        >
          Take Assessment →
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', paddingBottom: 100 }}>

      {/* Glow */}
      <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: 800, height: 350, background: 'radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ paddingTop: 56, paddingBottom: 32, textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(0,212,255,0.12))', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 100, padding: '5px 18px', fontSize: 11, letterSpacing: 2, color: '#7c3aed', textTransform: 'uppercase', marginBottom: 16 }}>
            Step 04 of 10
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 34, fontWeight: 800, background: 'linear-gradient(135deg,#fff 30%,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.15, marginBottom: 10 }}>
            Your Personalized Learning Plan
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 14, maxWidth: 500, margin: '0 auto' }}>
            These are the skills you need to learn for{' '}
            <span style={{ color: '#7c3aed', fontWeight: 600 }}>{roadmap?.role}</span>.
            {' '}Click any skill to load AI-curated resources.
          </p>
        </div>

        {/* ── Stats Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Skills to Learn', value: totalUnknown, color: '#7c3aed' },
            { label: 'Learned',         value: learnedCount, color: '#10b981' },
            { label: 'Remaining',       value: totalUnknown - learnedCount, color: '#f59e0b' },
            { label: 'Progress',        value: `${progressPct}%`, color: '#00d4ff' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#475569' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Progress Bar ── */}
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 20px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Learning Progress</span>
            <span style={{ fontSize: 13, color: progressPct >= 60 ? '#10b981' : '#7c3aed', fontWeight: 700 }}>
              {progressPct}% {progressPct >= 60 ? '— Assessment Unlocked! 🎉' : `— need 60% to unlock assessment`}
            </span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 100, overflow: 'hidden', position: 'relative' }}>
            <div
              style={{
                height: '100%',
                width: `${progressPct}%`,
                background: progressPct >= 60
                  ? 'linear-gradient(90deg,#10b981,#00d4ff)'
                  : 'linear-gradient(90deg,#7c3aed,#00d4ff)',
                borderRadius: 100,
                transition: 'width 0.6s ease',
              }}
            />
            {/* 60% threshold marker */}
            <div style={{ position: 'absolute', top: 0, left: '60%', width: 2, height: '100%', background: 'rgba(245,158,11,0.5)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
            <span style={{ fontSize: 10, color: '#475569' }}>Assessment unlocks at 60%</span>
          </div>
        </div>

        {/* ── Tip Banner ── */}
        <div style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 12, padding: '12px 18px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#64748b' }}>
          <span style={{ fontSize: 16 }}>🤖</span>
          <span>
            Click <strong style={{ color: '#00d4ff' }}>"View Resources"</strong> on any skill — Gemini will instantly fetch YouTube videos, documentation, project ideas, and expert tips tailored for you.
          </span>
        </div>

        {/* ── Skills by Level ── */}
        {(['beginner','intermediate','advanced']).map((level) => {
          const skills = byLevel[level];
          if (!skills.length) return null;
          const cfg = LEVEL_CONFIG[level];
          const levelLearned = skills.filter(s => s.isLearned).length;

          return (
            <div key={level} style={{ marginBottom: 36 }}>
              {/* Level header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg,${cfg.color}40,transparent)` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 100, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: cfg.color, letterSpacing: 1, textTransform: 'uppercase', fontFamily: "'Syne',sans-serif" }}>
                    {cfg.label}
                  </div>
                  <span style={{ fontSize: 11, color: '#475569' }}>{levelLearned}/{skills.length} learned</span>
                </div>
                <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg,transparent,${cfg.color}40)` }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {skills.map((skill) => (
                  <SkillCard
                    key={skill._id}
                    skill={skill}
                    role={roadmap?.role}
                    onMarkLearned={handleMarkLearned}
                    savingId={savingId}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* ── Sticky Bottom CTA ── */}
        <div
          style={{
            position: 'sticky',
            bottom: 24,
            background: canAssess
              ? 'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(0,212,255,0.08))'
              : '#111827',
            border: `1px solid ${canAssess ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 16,
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            transition: 'all 0.4s ease',
          }}
        >
          <div>
            {canAssess ? (
              <>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: '#10b981', marginBottom: 3 }}>
                  🎉 Ready for the Assessment!
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  {learnedCount} skills learned · You can attempt the full assessment now
                </div>
              </>
            ) : (
              <>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 600, color: '#94a3b8', marginBottom: 3 }}>
                  Learn at least 60% of skills to unlock assessment
                </div>
                <div style={{ fontSize: 12, color: '#475569' }}>
                  {totalUnknown - learnedCount} more skill{totalUnknown - learnedCount !== 1 ? 's' : ''} to learn · currently at {progressPct}%
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => navigate('/roadmap')}
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 16px', fontSize: 12, color: '#64748b', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}
            >
              ← Back to Roadmap
            </button>
            <button
              onClick={() => navigate('/assessment')}
              disabled={!canAssess}
              style={{
                background: canAssess ? 'linear-gradient(135deg,#10b981,#00d4ff)' : 'rgba(255,255,255,0.05)',
                border: 'none',
                borderRadius: 10,
                padding: '11px 28px',
                fontSize: 13,
                fontWeight: 700,
                color: canAssess ? '#0a0f1e' : '#475569',
                cursor: canAssess ? 'pointer' : 'not-allowed',
                fontFamily: "'Syne',sans-serif",
                letterSpacing: 0.5,
                transition: 'all 0.3s',
              }}
            >
              Take Assessment →
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes pulse   { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
