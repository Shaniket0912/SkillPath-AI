# 🚀 SkillPath AI — Personalized Learning Path Generator

> An AI-powered platform that analyzes your skill gaps and generates a personalized, goal-oriented learning roadmap to help you land your dream tech job.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Netlify-00C7B7?style=flat&logo=netlify)](https://chipper-sprite-7f624d.netlify.app)
[![Backend](https://img.shields.io/badge/Backend-Railway-0B0D0E?style=flat&logo=railway)](https://railway.app)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb)

---

## 📌 What is SkillPath AI?

Most roadmap platforms give you the same generic path for everyone. **SkillPath AI is different.**

It first asks which skills you already know, performs a **skill gap analysis**, and then generates a roadmap that is **specific to your current skill level and your target role** — not a one-size-fits-all list.

Built as a hackathon project at **INNOVATE-X NIET 1.0** (36-hour on-site hackathon), by a team of 4.

---

## ✨ Features

- 🎯 **Domain & Role Selection** — Choose your target career domain (e.g., Full Stack, DSA, ML)
- 🧠 **Skill Gap Analysis** — Marks which skills you already know vs. what you need to learn
- 🗺️ **AI-Generated Roadmap** — Personalized learning path powered by LLaMA 3.3 (via Groq API)
- 📋 **Skill Assessment** — Quiz-based assessment with AI-generated questions per topic
- 📊 **Scorecard** — Visual performance breakdown after assessments
- 📄 **Resume Builder** — Generate and download a professional resume as PDF
- 💼 **Job Feed** — Browse relevant job listings based on your selected domain
- 🔐 **JWT Authentication** — Secure login/register with protected routes
- ☁️ **Cloud Deployed** — Frontend on Netlify, Backend on Railway

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS, Vite, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| AI / LLM | Groq API (LLaMA 3.3 70B), Gemini API |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Deployment | Netlify (frontend), Railway (backend) |
| Other | Axios, React Router v6, Recharts, jsPDF |

---

## 📁 Project Structure

```
skillpath-ai/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Navbar, ProtectedRoute, Loader, ProgressBar
│   │   ├── context/            # AuthContext (global auth state)
│   │   ├── hooks/              # useAuth hook
│   │   ├── pages/              # Landing, Login, Register, Roadmap, Assessment, etc.
│   │   └── services/           # API calls (api.js), Gemini integration
│   └── package.json
│
├── server/                     # Node.js Backend
│   ├── config/                 # MongoDB connection (db.js)
│   ├── controllers/            # Business logic (auth, roadmap, assessment, etc.)
│   ├── middleware/             # JWT auth middleware (authMiddleware.js)
│   ├── models/                 # Mongoose schemas (User, Roadmap, Assessment, etc.)
│   ├── routes/                 # Express route definitions
│   └── server.js               # App entry point
│
└── package.json
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login and get JWT token |
| GET | `/api/auth/me` | ✅ | Get current logged-in user |
| POST | `/api/domain` | ✅ | Save selected domain/role |
| POST | `/api/roadmap/generate` | ✅ | AI-generate personalized roadmap |
| GET | `/api/roadmap` | ✅ | Fetch saved roadmap |
| PATCH | `/api/roadmap/mark` | ✅ | Mark skill as known/unknown |
| PATCH | `/api/roadmap/learn` | ✅ | Mark skill as learned |
| POST | `/api/roadmap/skill-resources` | ✅ | Get AI resources for a skill |
| GET | `/api/assessment` | ✅ | Fetch assessment questions |
| POST | `/api/score` | ✅ | Submit and save assessment score |
| GET | `/api/resume` | ✅ | Get resume data |
| GET | `/api/jobs` | ✅ | Get job listings |
| GET | `/api/health` | ❌ | Health check |

> ✅ = Requires JWT Bearer Token in `Authorization` header

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the repo
```bash
git clone https://github.com/Shaniket0912/SkillPath-AI.git
cd SkillPath-AI
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in `/server`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_groq_api_key
```

```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file in `/client`:
```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

App will run at `http://localhost:5173`

---

## 🚀 Deployment

| Service | Platform | Notes |
|---|---|---|
| Frontend | [Netlify](https://netlify.com) | Set `VITE_API_URL` in environment variables |
| Backend | [Railway](https://railway.app) | Set all `.env` variables in Railway dashboard |

---

## 🧑‍💻 Made By

**Shaniket Tiwari** — Team Leader, INNOVATE-X NIET 1.0 Hackathon (May 2026)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Shaniket%20Tiwari-0077B5?style=flat&logo=linkedin)](https://www.linkedin.com/in/shaniket-tiwari-14522225a/)
[![GitHub](https://img.shields.io/badge/GitHub-Shaniket0912-181717?style=flat&logo=github)](https://github.com/Shaniket0912)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
