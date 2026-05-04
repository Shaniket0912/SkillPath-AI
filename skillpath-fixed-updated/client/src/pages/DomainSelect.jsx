import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const DOMAINS = [
  {
    id: 'coding', category: 'Coding & Development', icon: '💻',
    color: '#00d4ff', colorBg: 'rgba(0,212,255,0.08)', colorBorder: 'rgba(0,212,255,0.25)',
    desc: 'Programming · DSA · Web / App Dev',
    subRoles: [
      'Software Developer (Frontend)', 'Software Developer (Backend)', 'Full Stack Developer',
      'Web Developer (React/Node.js)', 'Web Developer (Django)', 'Mobile App Developer (Android)',
      'Mobile App Developer (iOS)', 'Flutter Developer', 'Game Developer',
      'Embedded Systems Developer', 'Blockchain Developer', 'AR/VR Developer', 'IoT Engineer',
    ],
  },
  {
    id: 'tools', category: 'Tools & Tech', icon: '🛠️',
    color: '#10b981', colorBg: 'rgba(16,185,129,0.08)', colorBorder: 'rgba(16,185,129,0.25)',
    desc: 'AI/ML · Cloud · Security · Data',
    subRoles: [
      'Data Analyst', 'Data Scientist', 'Machine Learning Engineer', 'AI Engineer',
      'NLP Engineer', 'Business Intelligence Analyst', 'Cybersecurity Analyst', 'Ethical Hacker',
      'Network Engineer', 'SOC Analyst', 'Cloud Engineer (AWS)', 'Cloud Engineer (Azure)',
      'DevOps Engineer', 'Site Reliability Engineer', 'QA Engineer',
      'Automation Tester', 'Database Administrator', 'Data Engineer',
    ],
  },
  {
    id: 'management', category: 'Management & Business', icon: '📊',
    color: '#f59e0b', colorBg: 'rgba(245,158,11,0.08)', colorBorder: 'rgba(245,158,11,0.25)',
    desc: 'Strategy · Marketing · Finance · HR',
    subRoles: [
      'Business Analyst', 'Product Manager', 'Project Manager', 'Operations Manager',
      'Digital Marketing Specialist', 'SEO/SEM Expert', 'Content Marketer',
      'Social Media Manager', 'Sales Executive', 'Financial Analyst',
      'Accountant', 'HR Manager', 'Recruiter', 'Talent Acquisition Specialist',
    ],
  },
  {
    id: 'design', category: 'Design & Creative', icon: '🎨',
    color: '#ec4899', colorBg: 'rgba(236,72,153,0.08)', colorBorder: 'rgba(236,72,153,0.25)',
    desc: 'Figma · Creativity · Communication',
    subRoles: [
      'UI Designer', 'UX Researcher', 'Product Designer', 'Graphic Designer',
      'Content Writer', 'Journalist', 'Video Editor',
    ],
  },
];

export default function DomainSelect() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [saving, setSaving] = useState(false);
  // Custom role state per domain
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState({});

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/domain`, { headers: { Authorization: `Bearer ${token}` } });
        if (data.domain) {
          const dom = DOMAINS.find(d => d.category === data.domain.category);
          if (dom) { setExpandedId(dom.id); setSelectedCategory(data.domain.category); setSelectedRole(data.domain.subRole); }
        }
      } catch {}
    };
    fetch();
  }, []);

  const handleCategoryClick = (dom) => {
    setExpandedId(expandedId === dom.id ? null : dom.id);
    setSelectedCategory(dom.category);
    if (selectedCategory !== dom.category) setSelectedRole(null);
  };

  const handleProceed = async () => {
    if (!selectedCategory || !selectedRole) { toast.error('Please select a job role to continue.'); return; }
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/domain`,
        { category: selectedCategory, subRole: selectedRole },
        { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Role saved! Generating your roadmap...');
      setTimeout(() => navigate('/roadmap'), 800);
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', paddingBottom: 80 }}>
      <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: 900, height: 400, background: 'radial-gradient(ellipse,rgba(124,58,237,0.13) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', paddingTop: 64, paddingBottom: 48 }}>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(0,212,255,0.15))', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 100, padding: '5px 18px', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#00d4ff', marginBottom: 18 }}>Step 02 of 10</div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 38, fontWeight: 800, background: 'linear-gradient(135deg,#fff 30%,#00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.15, marginBottom: 12 }}>Choose Your Career Path</h1>
          <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 520, margin: '0 auto' }}>Select the domain and job role you want to target. We'll build a personalized roadmap just for you.</p>
        </div>

        {/* Domain Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, marginBottom: 24 }}>
          {DOMAINS.map((dom) => {
            const isExpanded = expandedId === dom.id;
            const isOther = expandedId && expandedId !== dom.id;
            return (
              <div key={dom.id} style={{ background: isExpanded ? dom.colorBg : '#111827', border: `1px solid ${isExpanded ? dom.colorBorder : 'rgba(255,255,255,0.07)'}`, borderTop: `2px solid ${isExpanded ? dom.color : 'rgba(255,255,255,0.07)'}`, borderRadius: 20, overflow: 'hidden', transition: 'all 0.35s', opacity: isOther ? 0.5 : 1, cursor: 'pointer' }}>
                {/* Header */}
                <div onClick={() => handleCategoryClick(dom)} style={{ padding: '24px 24px 20px', userSelect: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 14, background: dom.colorBg, border: `1px solid ${dom.colorBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{dom.icon}</div>
                      <div>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: isExpanded ? dom.color : '#e2e8f0', marginBottom: 4 }}>{dom.category}</div>
                        <div style={{ fontSize: 11.5, color: '#64748b' }}>{dom.desc}</div>
                      </div>
                    </div>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#64748b', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s', flexShrink: 0 }}>▾</div>
                  </div>
                  <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 100, padding: '3px 10px', fontSize: 11, color: '#94a3b8' }}>{dom.subRoles.length}+ roles</span>
                    {selectedCategory === dom.category && selectedRole && (
                      <span style={{ background: dom.colorBg, border: `1px solid ${dom.colorBorder}`, borderRadius: 100, padding: '3px 10px', fontSize: 11, color: dom.color }}>✓ {selectedRole}</span>
                    )}
                  </div>
                </div>

                {/* Sub-roles dropdown */}
                {isExpanded && (
                  <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${dom.colorBorder}`, paddingTop: 16 }}>
                    <div style={{ fontSize: 10.5, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Select a Job Role</div>
                    
                    {/* Searchable dropdown */}
                    <select
                      value={selectedRole && selectedCategory === dom.category ? selectedRole : ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '__custom__') {
                          setShowCustomInput(p => ({ ...p, [dom.id]: true }));
                          setSelectedRole(null);
                        } else {
                          setShowCustomInput(p => ({ ...p, [dom.id]: false }));
                          setSelectedCategory(dom.category);
                          setSelectedRole(val);
                        }
                      }}
                      style={{ width: '100%', background: '#1e293b', border: `1px solid ${dom.colorBorder}`, borderRadius: 10, padding: '10px 14px', color: '#e2e8f0', fontSize: 13, outline: 'none', cursor: 'pointer', marginBottom: 10, fontFamily: "'DM Sans',sans-serif" }}
                    >
                      <option value="">— Choose a role —</option>
                      {dom.subRoles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                      <option value="__custom__">✏️ Enter custom role...</option>
                    </select>

                    {/* Custom role input */}
                    {showCustomInput[dom.id] && (
                      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                        <input
                          value={customRoleInput}
                          onChange={e => setCustomRoleInput(e.target.value)}
                          placeholder="e.g. Prompt Engineer, Research Analyst..."
                          style={{ flex: 1, background: '#0f172a', border: `1px solid ${dom.colorBorder}`, borderRadius: 10, padding: '9px 13px', color: '#e2e8f0', fontSize: 13, outline: 'none', fontFamily: "'DM Sans',sans-serif" }}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && customRoleInput.trim()) {
                              setSelectedCategory(dom.category);
                              setSelectedRole(customRoleInput.trim());
                              setShowCustomInput(p => ({ ...p, [dom.id]: false }));
                              setCustomRoleInput('');
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!customRoleInput.trim()) return;
                            setSelectedCategory(dom.category);
                            setSelectedRole(customRoleInput.trim());
                            setShowCustomInput(p => ({ ...p, [dom.id]: false }));
                            setCustomRoleInput('');
                          }}
                          style={{ background: dom.color, border: 'none', borderRadius: 10, padding: '0 16px', color: '#000', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                        >Add</button>
                      </div>
                    )}

                    {/* Popular chips for quick pick */}
                    <div style={{ fontSize: 10.5, color: '#334155', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Quick Pick</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                      {dom.subRoles.slice(0, 7).map(role => {
                        const isSel = selectedRole === role && selectedCategory === dom.category;
                        return (
                          <button key={role} onClick={(e) => { e.stopPropagation(); setSelectedCategory(dom.category); setSelectedRole(role); }} style={{ background: isSel ? dom.color : '#1e293b', border: `1px solid ${isSel ? dom.color : 'rgba(255,255,255,0.07)'}`, borderRadius: 9, padding: '6px 12px', fontSize: 11.5, color: isSel ? '#0a0f1e' : '#94a3b8', cursor: 'pointer', fontWeight: isSel ? 700 : 400, transition: 'all 0.2s' }}>
                            {isSel && '✓ '}{role}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selection summary + proceed */}
        {selectedRole && (
          <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(0,212,255,0.08))', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 16, padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 11, color: '#64748b', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Your Selected Path</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22 }}>{DOMAINS.find(d => d.category === selectedCategory)?.icon}</span>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: '#e2e8f0' }}>{selectedRole}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{selectedCategory}</div>
                </div>
              </div>
            </div>
            <button onClick={handleProceed} disabled={saving} style={{ background: saving ? '#1e293b' : 'linear-gradient(135deg,#7c3aed,#00d4ff)', border: 'none', borderRadius: 12, padding: '13px 32px', fontSize: 14, fontWeight: 700, color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Syne',sans-serif", opacity: saving ? 0.6 : 1 }}>
              {saving ? (<><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }}/> Saving...</>) : 'Next →'}
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
