import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser = (data) => API.post('/api/auth/register', data);
export const loginUser = (data) => API.post('/api/auth/login', data);

// Profile
export const getProfile = () => API.get('/api/profile');
export const updateProfile = (data) => API.put('/api/profile', data);

// Domain
export const saveDomain = (data) => API.post('/api/domain', data);
export const getDomain = () => API.get('/api/domain');

// Roadmap
export const getRoadmap = () => API.get('/api/roadmap');
export const saveRoadmap = (data) => API.post('/api/roadmap', data);
export const updateRoadmapStep = (stepId, data) => API.patch(`/api/roadmap/step/${stepId}`, data);

// Assessment
export const submitAssessment = (data) => API.post('/api/assessment', data);
export const getAssessments = () => API.get('/api/assessment');

// Score
export const saveScore = (data) => API.post('/api/score', data);
export const getScores = () => API.get('/api/score');

// Resume
export const saveResume = (data) => API.post('/api/resume', data);
export const getResume = () => API.get('/api/resume');

// Jobs
export const getJobs = (params) => API.get('/api/jobs', { params });

export default API;
