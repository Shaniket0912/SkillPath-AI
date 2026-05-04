import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { CheckCircle, Circle, ArrowRight, Zap } from 'lucide-react';
import Loader from '../components/Loader';

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const SKILL_SETS = {
  'Web Development': ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Databases', 'REST APIs', 'Git', 'TypeScript'],
  'Data Science': ['Python', 'Statistics', 'Pandas/NumPy', 'Machine Learning', 'Data Visualization', 'SQL', 'Deep Learning', 'Feature Engineering'],
  'Android Development': ['Java/Kotlin', 'Android SDK', 'XML Layouts', 'Jetpack Compose', 'Firebase', 'REST APIs', 'Git', 'Play Store Deployment'],
  'DevOps': ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'AWS/GCP/Azure', 'Terraform', 'Monitoring', 'Networking'],
  'Cybersecurity': ['Networking', 'Linux', 'Python', 'Cryptography', 'Pen Testing', 'OWASP', 'SIEM Tools', 'Incident Response'],
  'UI/UX Design': ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Typography', 'Color Theory', 'Accessibility'],
};

export default function SkillCheck() {
  const [skills, setSkills] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const domain = localStorage.getItem('selectedDomain') || 'Web Development';
  const skillList = SKILL_SETS[domain] || SKILL_SETS['Web Development'];

  const setSkillLevel = (skill, level) => {
    setSkills((p) => ({ ...p, [skill]: level }));
  };

  const handleSubmit = () => {
    const missing = skillList.filter((s) => !skills[s]);
    if (missing.length > 0) return toast.error(`Please rate all skills (${missing.length} remaining)`);
    setLoading(true);
    localStorage.setItem('skillAssessment', JSON.stringify(skills));
    setTimeout(() => {
      setLoading(false);
      toast.success('Skills assessed! Generating your personalized roadmap...');
      navigate('/personalized-roadmap');
    }, 800);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 text-xs font-semibold mb-4">
            <Zap size={14} /> Skill Self-Assessment
          </div>
          <h1 className="text-3xl font-bold mb-2">Rate Your <span className="text-emerald-400">{domain}</span> Skills</h1>
          <p className="text-gray-400">Be honest — this helps us build the most accurate roadmap for you.</p>
        </motion.div>

        <div className="space-y-4">
          {skillList.map((skill, i) => (
            <motion.div key={skill} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-white">{skill}</span>
                {skills[skill] && (
                  <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">{skills[skill]}</span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {SKILL_LEVELS.map((level) => (
                  <button key={level} onClick={() => setSkillLevel(skill, level)}
                    className={`flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                      skills[skill] === level
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}>
                    {skills[skill] === level ? <CheckCircle size={12} /> : <Circle size={12} />}
                    {level}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <span className="text-gray-400 text-sm">{Object.keys(skills).length} / {skillList.length} rated</span>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-colors">
            Next <ArrowRight size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
