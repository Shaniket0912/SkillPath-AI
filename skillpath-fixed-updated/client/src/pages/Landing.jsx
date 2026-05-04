import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Map, Award, FileText, Briefcase, Zap } from 'lucide-react';

const features = [
  { icon: Brain, color: '#7c3aed', title: 'AI-Powered Skill Mapping', desc: 'Gemini AI analyzes your skills and identifies gaps tailored to your target role.' },
  { icon: Map, color: '#00d4ff', title: 'Personalized Roadmaps', desc: 'Get a custom learning path based on your current level and career goals.' },
  { icon: Award, color: '#f59e0b', title: 'Assessments & Scorecards', desc: 'Test your knowledge and receive detailed insights with visual analytics.' },
  { icon: FileText, color: '#10b981', title: 'ATS Resume Generator', desc: 'Generate a professional, ATS-optimized resume from your profile in one click.' },
  { icon: Briefcase, color: '#f43f5e', title: 'Live Job Feed', desc: 'Browse curated job listings matching your skills from Naukri, Indeed & LinkedIn.' },
  { icon: Zap, color: '#ec4899', title: 'Gap Analysis', desc: 'Know exactly what you know and what to learn next with smart skill testing.' },
];

const steps = [
  { n: '01', title: 'Register & Profile', desc: 'Create your account with college and academic details.' },
  { n: '02', title: 'Pick Your Domain', desc: 'Choose from 30+ roles across Tech, Management, Design & more.' },
  { n: '03', title: 'Skill Gap Analysis', desc: 'Mark what you know — AI identifies your learning gaps.' },
  { n: '04', title: 'Get Your Roadmap', desc: 'Personalized learning path with resources for each skill.' },
  { n: '05', title: 'Take Assessment', desc: '20 questions: MCQ, Scenario & Code — all auto-generated.' },
  { n: '06', title: 'Get Job Ready', desc: 'ATS Resume + Job feed unlocked at 70%+ score.' },
];

export default function Landing() {
  const bg = '#0a0f1e';

  return (
    <div style={{ minHeight: '100vh', background: bg, color: '#e2e8f0' }}>
      {/* Hero */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center', overflow: 'hidden' }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.15),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,212,255,0.1),transparent 70%)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ position: 'relative', zIndex: 1, maxWidth: 760 }}>
          <div style={{ display: 'inline-block', padding: '6px 20px', marginBottom: 24, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#00d4ff', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', borderRadius: 100 }}>
            AI Mentoring System
          </div>

          <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(42px,7vw,80px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
            SkillPath{' '}
            <span style={{ background: 'linear-gradient(135deg,#7c3aed,#00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
          </h1>

          <p style={{ fontSize: 'clamp(16px,2.5vw,22px)', color: '#94a3b8', marginBottom: 8, lineHeight: 1.5 }}>
            Your AI Mentor. Your Career. Your Path.
          </p>
          <p style={{ fontSize: 'clamp(14px,2vw,18px)', color: '#64748b', marginBottom: 40, lineHeight: 1.5 }}>
            Smart Mentoring for Skill Mapping &amp; Employability
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: 'linear-gradient(135deg,#7c3aed,#00d4ff)', border: 'none', borderRadius: 14, color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: 'Syne,sans-serif', boxShadow: '0 0 40px rgba(124,58,237,0.3)' }}>
                Get Started Free <ArrowRight size={18} />
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, color: '#94a3b8', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
                Sign In
              </motion.button>
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 52, flexWrap: 'wrap' }}>
            {[['30+', 'Job Roles'], ['AI-Powered', 'Roadmaps'], ['ATS', 'Resume'], ['Live', 'Job Feed']].map(([val, label], i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 22, fontWeight: 800, color: '#fff' }}>{val}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, color: '#fff', marginBottom: 12 }}>
            How it <span style={{ color: '#00d4ff' }}>works</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: 15 }}>6 simple steps to go from zero to job ready</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
          {steps.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '22px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 28, fontWeight: 800, background: 'linear-gradient(135deg,#7c3aed,#00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', flexShrink: 0, lineHeight: 1 }}>{step.n}</div>
              <div>
                <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{step.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '40px 24px 80px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, color: '#fff', marginBottom: 12 }}>
            Everything to <span style={{ color: '#10b981' }}>level up</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
          {features.map(({ icon: Icon, color, title, desc }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${color}44`}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={22} color={color} />
              </div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 24px 80px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(0,212,255,0.1))', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 24, padding: '56px 32px', maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(26px,4vw,36px)', fontWeight: 800, color: '#fff', marginBottom: 14 }}>Ready to start your journey?</h2>
          <p style={{ color: '#64748b', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>Join students who are using AI to map their skills and land their first job.</p>
          <Link to="/register">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '15px 40px', background: 'linear-gradient(135deg,#7c3aed,#00d4ff)', border: 'none', borderRadius: 14, color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer', fontFamily: 'Syne,sans-serif' }}>
              Get Started Free <ArrowRight size={18} />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px', textAlign: 'center', color: '#334155', fontSize: 13 }}>
        <strong style={{ color: '#475569', fontFamily: 'Syne,sans-serif' }}>SkillPath AI</strong> — Smart Mentoring System for Skill Mapping &amp; Employability
      </footer>
    </div>
  );
}
