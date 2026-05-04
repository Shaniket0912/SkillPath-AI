# SkillPath AI 🚀

> Your AI Mentor. Your Career. Your Path.  
> **Smart Mentoring System for Skill Mapping & Employability**

---

## Quick Start

### 1. Clone & Setup

```bash
# Server
cd server
npm install
cp .env.example .env       # fill in your keys
npm run dev                # starts on :5000

# Client (new terminal)
cd client
npm install
cp .env.example .env       # fill in your keys
npm run dev                # starts on :5173
```

---

## Environment Variables

### server/.env
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/skillpath-ai
JWT_SECRET=change_this_to_something_random_and_long
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

### client/.env
```
VITE_API_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_RAPIDAPI_KEY=your_rapidapi_key_for_jsearch
VITE_NEWS_API_KEY=your_newsapi_org_key
```

---

## API Keys Needed

| Key | Where to get |
|-----|-------------|
| MongoDB URI | [MongoDB Atlas](https://cloud.mongodb.com) - free tier works |
| Gemini API | [Google AI Studio](https://aistudio.google.com) - free |
| RapidAPI (JSearch) | [RapidAPI JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch) |
| NewsAPI | [NewsAPI.org](https://newsapi.org) - free tier |

---

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **AI:** Google Gemini 2.0 Flash
- **Auth:** JWT + bcryptjs
- **Charts:** Recharts
- **PDF:** jsPDF
- **Jobs:** JSearch (RapidAPI)
- **News:** NewsAPI.org

---

## Project Structure

```
skillpath-ai/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── components/      # Navbar, Loader, ProtectedRoute, ProgressBar
│       ├── pages/           # Landing, Register, Login, DomainSelect, Roadmap,
│       │                    # SkillCheck, PersonalizedRoadmap, RoadmapJourney,
│       │                    # Assessment, Scorecard, Resume, JobFeed
│       ├── context/         # AuthContext
│       ├── hooks/           # useAuth
│       ├── services/        # api.js (axios), gemini.js
│       └── App.jsx
└── server/                  # Express backend
    ├── models/              # User, Profile, Domain, Roadmap, Assessment, Result, Score, Resume
    ├── routes/              # auth, profile, domain, roadmap, assessment, score, resume, jobs
    ├── controllers/         # authController, domainController, roadmapController,
    │                        # assessmentController, scoreController, resumeController
    ├── middleware/          # authMiddleware (JWT protect)
    ├── config/              # db.js (MongoDB connection)
    └── server.js
```

---

## Build Steps Completed

| Step | Feature | Status |
|------|---------|--------|
| 01 | Auth & Registration | ✅ |
| 02 | Domain Selection | ✅ |
| 03 | Roadmap + Skill Check | ✅ |
| 04 | Personalized Roadmap (Gemini AI) | ✅ |
| 05 | Roadmap Journey | ✅ |
| 06 | Major Assessment | ✅ |
| 07 | Scorecard & Insights | ✅ |
| 08 | Score-Based Actions | ✅ |
| 09 | ATS Resume Generation | ✅ |
| 10 | Job Feed & News | ✅ |

---

## Deploy

- **Frontend:** Vercel — connect `/client` folder
- **Backend:** Railway / Render — connect `/server` folder, set env vars
