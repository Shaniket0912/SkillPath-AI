import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

const API = import.meta.env.VITE_API_URL;

function SectionTitle({ children }) {
  return (
    <h3 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1"
      style={{ color: '#00d4ff', borderBottom: '1px solid rgba(0,212,255,0.3)', fontFamily: "'Syne', sans-serif" }}>
      {children}
    </h3>
  );
}

function Tag({ children, color = '#00d4ff' }) {
  return (
    <span className="text-xs px-2.5 py-1 rounded-full mr-1.5 mb-1.5 inline-block"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
      {children}
    </span>
  );
}

function ResumePreview({ resume }) {
  return (
    <div id="resume-preview" className="rounded-2xl p-8 text-sm"
      style={{ background: '#0d1929', border: '1px solid rgba(255,255,255,0.07)', color: '#e2e8f0', maxWidth: '780px', margin: '0 auto' }}>

      {/* Header */}
      <div className="text-center mb-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{resume.name}</h1>
        <p className="text-sm font-semibold" style={{ color: '#00d4ff' }}>{resume.role}</p>
        {(resume.email || resume.phone) && (
          <p className="text-xs text-slate-500 mt-1.5">
            {resume.email}{resume.email && resume.phone ? ' · ' : ''}{resume.phone}
          </p>
        )}
      </div>

      {/* Summary */}
      {resume.summary && (
        <div className="mb-5">
          <SectionTitle>Professional Summary</SectionTitle>
          <p className="text-sm text-slate-300 leading-relaxed">{resume.summary}</p>
        </div>
      )}

      {/* Technical Skills */}
      {resume.technicalSkills?.length > 0 && (
        <div className="mb-5">
          <SectionTitle>Technical Skills</SectionTitle>
          <div className="flex flex-wrap">
            {resume.technicalSkills.map(s => <Tag key={s} color="#00d4ff">{s}</Tag>)}
          </div>
        </div>
      )}

      {/* Soft Skills */}
      {resume.softSkills?.length > 0 && (
        <div className="mb-5">
          <SectionTitle>Soft Skills</SectionTitle>
          <div className="flex flex-wrap">
            {resume.softSkills.map(s => <Tag key={s} color="#7c3aed">{s}</Tag>)}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education && (
        <div className="mb-5">
          <SectionTitle>Education</SectionTitle>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-slate-200">{resume.education.college}</p>
              <p className="text-slate-400 text-xs">{resume.education.branch}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">{resume.education.year}</p>
              <p className="text-xs font-semibold" style={{ color: '#f59e0b' }}>CGPA: {resume.education.cgpa}</p>
            </div>
          </div>
        </div>
      )}

      {/* Projects */}
      {resume.projects?.length > 0 && (
        <div className="mb-5">
          <SectionTitle>Projects</SectionTitle>
          <div className="space-y-4">
            {resume.projects.map((p, i) => (
              <div key={i}>
                <div className="flex justify-between items-start flex-wrap gap-1">
                  <p className="font-semibold text-slate-200">{p.title}</p>
                  {p.githubLink && (
                    <a href={p.githubLink} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:text-cyan-300 underline">GitHub ↗</a>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{p.description}</p>
                {p.techStack?.length > 0 && (
                  <div className="flex flex-wrap mt-1.5">
                    {p.techStack.map(t => <Tag key={t} color="#10b981">{t}</Tag>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {resume.certifications?.length > 0 && (
        <div className="mb-5">
          <SectionTitle>Certifications</SectionTitle>
          {resume.certifications.map((c, i) => (
            <p key={i} className="text-sm text-slate-300 mb-1">🏅 {c}</p>
          ))}
        </div>
      )}

      {/* ATS Keywords */}
      {resume.atsKeywords?.length > 0 && (
        <div>
          <SectionTitle>ATS Keywords</SectionTitle>
          <div className="flex flex-wrap">
            {resume.atsKeywords.map(k => <Tag key={k} color="#f59e0b">{k}</Tag>)}
          </div>
        </div>
      )}
    </div>
  );
}

function downloadPDF(resume) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = 210;
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = 20;

  const addLine = (text, size = 10, color = [30, 30, 50], bold = false) => {
    doc.setFontSize(size);
    doc.setTextColor(...color);
    if (bold) doc.setFont('helvetica', 'bold');
    else doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(String(text || ''), contentW);
    lines.forEach(line => {
      if (y > 275) { doc.addPage(); y = 20; }
      doc.text(line, margin, y);
      y += size * 0.45 + 1;
    });
  };

  const addSection = (title) => {
    y += 4;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 100, 180);
    doc.text(title.toUpperCase(), margin, y);
    y += 1;
    doc.setDrawColor(0, 180, 220);
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageW - margin, y);
    y += 4;
    doc.setTextColor(30, 30, 60);
  };

  // Name & Role
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 15, 40);
  doc.text(resume.name || '', pageW / 2, y, { align: 'center' });
  y += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 100, 180);
  doc.text(resume.role || '', pageW / 2, y, { align: 'center' });
  y += 5;
  if (resume.email || resume.phone) {
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 120);
    doc.text([resume.email, resume.phone].filter(Boolean).join('  ·  '), pageW / 2, y, { align: 'center' });
    y += 3;
  }
  y += 3;
  doc.setDrawColor(200, 210, 230);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  if (resume.summary) {
    addSection('Professional Summary');
    addLine(resume.summary, 10, [50, 50, 70]);
  }

  if (resume.technicalSkills?.length) {
    addSection('Technical Skills');
    addLine(resume.technicalSkills.join(' · '), 10, [50, 50, 70]);
  }

  if (resume.softSkills?.length) {
    addSection('Soft Skills');
    addLine(resume.softSkills.join(' · '), 10, [50, 50, 70]);
  }

  if (resume.education) {
    addSection('Education');
    addLine(`${resume.education.college}`, 10, [30, 30, 50], true);
    addLine(`${resume.education.branch}  |  ${resume.education.year}  |  CGPA: ${resume.education.cgpa}`, 10, [80, 80, 100]);
  }

  if (resume.projects?.length) {
    addSection('Projects');
    resume.projects.forEach(p => {
      addLine(p.title, 10, [30, 30, 50], true);
      addLine(p.description, 9, [70, 70, 90]);
      if (p.techStack?.length) addLine('Tech: ' + p.techStack.join(', '), 9, [0, 120, 180]);
      if (p.githubLink) addLine('GitHub: ' + p.githubLink, 9, [0, 100, 200]);
      y += 2;
    });
  }

  if (resume.certifications?.length) {
    addSection('Certifications');
    resume.certifications.forEach(c => addLine('• ' + c, 10, [50, 50, 70]));
  }

  if (resume.atsKeywords?.length) {
    addSection('Keywords');
    addLine(resume.atsKeywords.join(', '), 9, [80, 80, 100]);
  }

  doc.save(`${resume.name?.replace(/\s+/g, '_') || 'Resume'}_SkillPath.pdf`);
  toast.success('PDF downloaded! 🎉');
}

export default function Resume() {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', phone: '', college: '', branch: '', year: '', cgpa: '' });
  const [skills, setSkills] = useState('');
  const [lockedSkills, setLockedSkills] = useState(false);
  const [passedRole, setPassedRole] = useState('');

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${API}/api/resume`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.resume) setResume(res.data.resume);
      } catch {}

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.name) setForm(f => ({ ...f, name: payload.name }));
        if (payload.email) setForm(f => ({ ...f, email: payload.email }));
      } catch {}

      // Fetch latest score — if passed (≥70%), lock skills to assessment strengths
      try {
        const scoreRes = await axios.get(`${API}/api/score/latest`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sc = scoreRes.data.score;
        if (sc && sc.isJobReady) {
          const skillList = sc.strengths?.length
            ? sc.strengths
            : sc.skillCoverage?.filter(s => s.correct > 0).map(s => s.skill) || [];
          if (skillList.length > 0) {
            setSkills(skillList.join(', '));
            setLockedSkills(true);
          }
          if (sc.role) setPassedRole(sc.role);
        }
      } catch {}

      setFetching(false);
    };
    load();
  }, []);

  const handleGenerate = async () => {
    const skillList = skills.split(',').map(s => s.trim()).filter(Boolean);
    if (!form.name.trim()) return toast.error('Please enter your name');
    if (skillList.length < 3) return toast.error('Enter at least 3 skills');

    let role = passedRole || 'Software Developer';
    try {
      const sc = JSON.parse(localStorage.getItem('sp_latest_score') || '{}');
      role = sc.score?.role || sc.result?.role || role;
    } catch {}

    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/api/resume/generate`,
        { ...form, role, skills: skillList },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (res.data.resume) {
        setResume(res.data.resume);
        toast.success('Resume generated! 🎉');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0f1e' }}>
        <div className="space-y-4 w-full max-w-2xl px-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: '#111827' }} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: '#0a0f1e', fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-4xl mx-auto px-4 pt-10">

        <p className="text-xs tracking-widest uppercase text-slate-500 mb-1">Step 9 of 10</p>
        <h1 className="text-3xl font-bold text-white mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
          ATS Resume Generator 📄
        </h1>

        {/* Form */}
        <div className="rounded-2xl p-6 mb-8" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-sm text-slate-400 mb-5">Fill in your details and AI will craft an ATS-optimized resume.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Full Name', placeholder: 'Aryan Sharma' },
              { key: 'email', label: 'Email', placeholder: 'aryan@example.com' },
              { key: 'phone', label: 'Phone', placeholder: '+91 98765 43210' },
              { key: 'college', label: 'College', placeholder: 'IIT Bombay' },
              { key: 'branch', label: 'Branch', placeholder: 'Computer Science Engineering' },
              { key: 'year', label: 'Graduation Year', placeholder: '2025' },
              { key: 'cgpa', label: 'CGPA', placeholder: '8.5' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-slate-400 uppercase tracking-widest block mb-1">{f.label}</label>
                <input
                  value={form[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full rounded-lg px-4 py-2.5 text-sm text-slate-200 outline-none"
                  style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
            ))}
          </div>

          {/* Skills — locked if assessment was passed */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-400 uppercase tracking-widest">Skills Known (comma-separated)</label>
              {lockedSkills && (
                <span className="text-xs flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                  🔒 Verified from Assessment
                </span>
              )}
            </div>
            <textarea
              value={skills}
              onChange={e => !lockedSkills && setSkills(e.target.value)}
              readOnly={lockedSkills}
              rows={2}
              placeholder="React, Node.js, MongoDB, REST APIs, Git, DSA..."
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none resize-none"
              style={{
                background: lockedSkills ? 'rgba(16,185,129,0.05)' : '#1e293b',
                border: `1px solid ${lockedSkills ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`,
                color: lockedSkills ? '#86efac' : '#e2e8f0',
                cursor: lockedSkills ? 'not-allowed' : 'text',
              }}
            />
            {lockedSkills && (
              <p className="text-xs text-slate-500 mt-1.5">
                ⓘ These are the skills you demonstrated in your passed assessment. They cannot be changed.
              </p>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-5 w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.01]"
            style={{ background: loading ? '#374151' : 'linear-gradient(135deg, #10b981, #00d4ff)' }}
          >
            {loading ? '✨ Generating your resume…' : '✨ Generate ATS Resume'}
          </button>
        </div>

        {/* Preview */}
        {resume && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Resume Preview</h2>
              <button
                onClick={() => downloadPDF(resume)}
                className="px-5 py-2 rounded-xl font-bold text-sm text-white flex items-center gap-2 transition-all hover:scale-[1.03]"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #f43f5e)' }}
              >
                ⬇ Download PDF
              </button>
            </div>
            <ResumePreview resume={resume} />

            {/* Job Feed CTA — shown after resume is generated */}
            <div className="mt-8 rounded-2xl p-6 text-center"
              style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(0,212,255,0.08))', border: '1px solid rgba(0,212,255,0.25)' }}>
              <p className="text-2xl mb-2">💼</p>
              <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                Your resume is ready!
              </h3>
              <p className="text-slate-400 text-sm mb-5">
                Now explore job listings tailored to your skills and role.
              </p>
              <button
                onClick={() => navigate('/jobs')}
                className="px-8 py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.03]"
                style={{ background: 'linear-gradient(135deg, #10b981, #00d4ff)' }}
              >
                🚀 Explore Job Feed →
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
