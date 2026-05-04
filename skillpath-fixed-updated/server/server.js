const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "https://chipper-sprite-7f624d.netlify.app",
  credentials: true
}));
app.use(express.json());

// ── Existing routes ──────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/domain',  require('./routes/domain'));
app.use('/api/roadmap', require('./routes/roadmap'));

// ── New routes (Steps 5-10) ──────────────────────────────────────────────
app.use('/api/assessment', require('./routes/assessment'));
app.use('/api/score',      require('./routes/score'));
app.use('/api/resume',     require('./routes/resume'));
app.use('/api/jobs',       require('./routes/jobs'));

app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 SkillPath AI server running on port ${PORT}`));
