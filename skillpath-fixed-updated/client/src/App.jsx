import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import DomainSelect from './pages/DomainSelect';
import Roadmap from './pages/Roadmap';
import SkillCheck from './pages/SkillCheck';
import PersonalizedRoadmap from './pages/PersonalizedRoadmap';
import RoadmapJourney from './pages/RoadmapJourney';
import Assessment from './pages/Assessment';
import Scorecard from './pages/Scorecard';
import Resume from './pages/Resume';
import JobFeed from './pages/JobFeed';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#111827', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)', fontSize: '13px' },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#f43f5e', secondary: '#fff' } },
          }}
        />
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          <Route path="/domain" element={<ProtectedRoute><DomainSelect /></ProtectedRoute>} />
          <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
          <Route path="/skill-check" element={<ProtectedRoute><SkillCheck /></ProtectedRoute>} />
          <Route path="/personalized-roadmap" element={<ProtectedRoute><PersonalizedRoadmap /></ProtectedRoute>} />
          <Route path="/roadmap-journey" element={<ProtectedRoute><RoadmapJourney /></ProtectedRoute>} />
          <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
          <Route path="/scorecard" element={<ProtectedRoute><Scorecard /></ProtectedRoute>} />
          <Route path="/resume" element={<ProtectedRoute><Resume /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><JobFeed /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
