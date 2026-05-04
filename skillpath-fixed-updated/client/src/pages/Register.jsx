import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeOff, UserPlus, Github, ArrowRight, ArrowLeft, GraduationCap, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/api';

const BRANCH_OPTIONS = [
  'B.Tech Computer Science (CSE)',
  'B.Tech Information Technology (IT)',
  'B.Tech Electronics & Communication (ECE)',
  'B.Tech Electrical Engineering (EEE)',
  'B.Tech Mechanical Engineering',
  'B.Tech Civil Engineering',
  'BCA (Bachelor of Computer Applications)',
  'MCA (Master of Computer Applications)',
  'MBA',
  'B.Sc Computer Science',
  'B.Com',
  'B.A',
  'Other',
];

const YEAR_OPTIONS = ['2024', '2025', '2026', '2027', '2028'];

const INITIAL = {
  name: '', email: '', password: '', confirmPassword: '', phone: '',
  college: '', branch: '', yearOfPassing: '', cgpa: '', githubUrl: '',
};

export default function Register() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [customBranch, setCustomBranch] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^[0-9]{10}$/.test(form.phone)) e.phone = 'Enter valid 10-digit number';
    return e;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.college.trim()) e.college = 'College name is required';
    if (!form.branch.trim()) e.branch = 'Branch is required';
    if (!form.yearOfPassing) e.yearOfPassing = 'Year is required';
    if (!form.cgpa) e.cgpa = 'CGPA is required';
    else if (parseFloat(form.cgpa) < 0 || parseFloat(form.cgpa) > 10) e.cgpa = 'CGPA must be 0–10';
    return e;
  };

  const handleNext = () => {
    const e = validateStep1();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setStep(2); setErrors({});
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validateStep2();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);
    try {
      const { data } = await registerUser({
        name: form.name.trim(), email: form.email.trim().toLowerCase(),
        password: form.password, phone: form.phone.trim(),
        college: form.college.trim(), branch: form.branch.trim(),
        yearOfPassing: parseInt(form.yearOfPassing),
        cgpa: parseFloat(form.cgpa), githubUrl: form.githubUrl.trim(),
      });
      login(data.token, data.user);
      toast.success('Welcome to SkillPath AI! 🎉');
      navigate('/domain');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      if (msg.toLowerCase().includes('email')) setStep(1);
    } finally { setLoading(false); }
  };

  const inputStyle = (field) => ({
    width: '100%',
    background: '#1e293b',
    border: `1px solid ${errors[field] ? '#f43f5e' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 10,
    padding: '11px 14px',
    color: '#e2e8f0',
    fontSize: 14,
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 0.2s',
  });

  const selectStyle = (field) => ({
    ...inputStyle(field),
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    paddingRight: 36,
  });

  const labelStyle = {
    display: 'block', fontSize: 12, color: '#94a3b8',
    marginBottom: 6, letterSpacing: 0.3,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', position: 'relative', overflow: 'hidden' }}>
      {/* orbs */}
      <div style={{ position: 'fixed', width: 500, height: 500, borderRadius: '50%', background: '#7c3aed', filter: 'blur(120px)', opacity: 0.1, top: -100, right: -100, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: 500, height: 500, borderRadius: '50%', background: '#00d4ff', filter: 'blur(120px)', opacity: 0.08, bottom: -150, left: -150, pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16, textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 14, fontFamily: "'Syne',sans-serif", fontWeight: 800 }}>SP</span>
            </div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: '#fff' }}>
              SkillPath <span style={{ color: '#00d4ff' }}>AI</span>
            </span>
          </Link>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
            {step === 1 ? 'Create your account' : 'Academic Details'}
          </h1>
          <p style={{ color: '#64748b', fontSize: 13 }}>
            {step === 1 ? 'Start your AI-powered career journey' : 'Tell us about your education'}
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24, background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '4px', overflow: 'hidden' }}>
          {[{ n: 1, label: 'Personal Info', icon: <User size={13}/> }, { n: 2, label: 'Academic Details', icon: <GraduationCap size={13}/> }].map((s) => (
            <div key={s.n} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '9px 0', borderRadius: 9, fontSize: 12, fontWeight: 600, background: step === s.n ? 'linear-gradient(135deg,#7c3aed,#00d4ff)' : 'transparent', color: step === s.n ? '#fff' : '#64748b', transition: 'all 0.3s', cursor: step > s.n ? 'pointer' : 'default' }}
              onClick={() => step > s.n && setStep(s.n)}>
              {step > s.n ? '✓' : s.icon}
              {s.label}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(17,24,39,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '28px 28px', backdropFilter: 'blur(12px)' }}>
          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} style={inputStyle('name')} placeholder="Rahul Sharma" />
                    {errors.name && <p style={{ color: '#f43f5e', fontSize: 11, marginTop: 4 }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} style={inputStyle('email')} placeholder="rahul@example.com" />
                    {errors.email && <p style={{ color: '#f43f5e', fontSize: 11, marginTop: 4 }}>{errors.email}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} style={inputStyle('phone')} placeholder="9876543210" maxLength={10} />
                    {errors.phone && <p style={{ color: '#f43f5e', fontSize: 11, marginTop: 4 }}>{errors.phone}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Password *</label>
                    <div style={{ position: 'relative' }}>
                      <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} style={{ ...inputStyle('password'), paddingRight: 44 }} placeholder="Min 6 characters" />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                        {showPass ? <EyeOff size={17}/> : <Eye size={17}/>}
                      </button>
                    </div>
                    {errors.password && <p style={{ color: '#f43f5e', fontSize: 11, marginTop: 4 }}>{errors.password}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Confirm Password *</label>
                    <div style={{ position: 'relative' }}>
                      <input name="confirmPassword" type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={handleChange} style={{ ...inputStyle('confirmPassword'), paddingRight: 44 }} placeholder="Re-enter password" />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                        {showConfirm ? <EyeOff size={17}/> : <Eye size={17}/>}
                      </button>
                    </div>
                    {errors.confirmPassword && <p style={{ color: '#f43f5e', fontSize: 11, marginTop: 4 }}>{errors.confirmPassword}</p>}
                  </div>
                  <button type="submit" style={{ width: '100%', background: 'linear-gradient(135deg,#7c3aed,#00d4ff)', border: 'none', borderRadius: 12, padding: '13px 0', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>
                    Continue <ArrowRight size={16}/>
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>College / University *</label>
                    <input name="college" value={form.college} onChange={handleChange} style={inputStyle('college')} placeholder="NIET, IIT Delhi, VIT Vellore..." />
                    {errors.college && <p style={{ color: '#f43f5e', fontSize: 11, marginTop: 4 }}>{errors.college}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Branch / Degree *</label>
                    {!customBranch ? (
                      <select name="branch" value={form.branch} onChange={(e) => { if (e.target.value === 'Other') { setCustomBranch(true); setForm(p => ({...p, branch: ''})); } else handleChange(e); }} style={selectStyle('branch')}>
                        <option value="">Select your branch...</option>
                        {BRANCH_OPTIONS.map(b => <option key={b} value={b === 'Other' ? 'Other' : b}>{b}</option>)}
                      </select>
                    ) : (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input name="branch" value={form.branch} onChange={handleChange} style={{ ...inputStyle('branch'), flex: 1 }} placeholder="Enter your branch/degree" />
                        <button type="button" onClick={() => { setCustomBranch(false); setForm(p=>({...p,branch:''})); }} style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '0 12px', color: '#94a3b8', cursor: 'pointer', fontSize: 12, whiteSpace: 'nowrap' }}>
                          ← List
                        </button>
                      </div>
                    )}
                    {errors.branch && <p style={{ color: '#f43f5e', fontSize: 11, marginTop: 4 }}>{errors.branch}</p>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Year of Passing *</label>
                      <select name="yearOfPassing" value={form.yearOfPassing} onChange={handleChange} style={selectStyle('yearOfPassing')}>
                        <option value="">Select year</option>
                        {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                      {errors.yearOfPassing && <p style={{ color: '#f43f5e', fontSize: 11, marginTop: 4 }}>{errors.yearOfPassing}</p>}
                    </div>
                    <div>
                      <label style={labelStyle}>CGPA *</label>
                      <input name="cgpa" type="number" step="0.01" value={form.cgpa} onChange={handleChange} style={inputStyle('cgpa')} placeholder="8.5" min={0} max={10} />
                      {errors.cgpa && <p style={{ color: '#f43f5e', fontSize: 11, marginTop: 4 }}>{errors.cgpa}</p>}
                    </div>
                  </div>
                  <div>
                    <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Github size={13}/> GitHub URL <span style={{ color: '#334155' }}>(optional)</span>
                    </label>
                    <input name="githubUrl" value={form.githubUrl} onChange={handleChange} style={inputStyle('githubUrl')} placeholder="https://github.com/username" />
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <button type="button" onClick={() => setStep(1)} style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 20px', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600 }}>
                      <ArrowLeft size={15}/> Back
                    </button>
                    <button type="submit" disabled={loading} style={{ flex: 1, background: loading ? '#1e293b' : 'linear-gradient(135deg,#7c3aed,#00d4ff)', border: 'none', borderRadius: 12, padding: '13px 0', color: '#fff', fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      {loading ? (
                        <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }}/> Creating...</>
                      ) : (
                        <><UserPlus size={16}/> Create Account</>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#475569', marginTop: 20 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#00d4ff', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
