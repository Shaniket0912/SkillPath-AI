import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { path: '/domain', label: 'Domain' },
  { path: '/roadmap', label: 'Gap Analysis', matchPaths: ['/roadmap', '/roadmap-journey', '/personalized-roadmap'] },
  { path: '/assessment', label: 'Assessment' },
  { path: '/resume', label: 'Resume' },
  { path: '/jobs', label: 'Jobs' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const publicRoutes = ['/', '/register', '/login'];
  if (publicRoutes.includes(location.pathname)) return null;

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white">
          SkillPath <span className="text-emerald-400">AI</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ path, label, matchPaths }) => {
            const isActive = matchPaths
              ? matchPaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'))
              : location.pathname === path;
            return (
            <Link key={path} to={path}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}>
              {label}
            </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user && <span className="text-sm text-gray-400 flex items-center gap-1"><User size={14} />{user.name}</span>}
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 rounded-xl transition-colors">
            <LogOut size={14} /> Logout
          </motion.button>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-gray-400" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4 space-y-2">
          {NAV_LINKS.map(({ path, label }) => (
            <Link key={path} to={path} onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 rounded-xl text-sm text-gray-300 hover:bg-gray-800">
              {label}
            </Link>
          ))}
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 rounded-xl">
            Logout
          </button>
        </motion.div>
      )}
    </nav>
  );
}
