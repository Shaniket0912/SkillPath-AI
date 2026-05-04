import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL;

const TABS = [
  { key: 'all', label: 'All Jobs', icon: '💼' },
  { key: 'remote', label: 'Remote', icon: '🌍' },
  { key: 'india', label: 'India', icon: '🇮🇳' },
  { key: 'internship', label: 'Internships', icon: '🎓' },
];

function JobCard({ job }) {
  const daysAgo = job.postedDate
    ? Math.floor((Date.now() - new Date(job.postedDate)) / 86400000)
    : null;

  return (
    <div
      className="rounded-xl p-5 transition-all hover:scale-[1.01]"
      style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="flex justify-between items-start gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-slate-200 text-sm leading-tight">{job.title}</h3>
          <p className="text-xs text-cyan-400 mt-0.5">{job.company}</p>
        </div>
        {job.isRemote && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/30 flex-shrink-0">
            Remote
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="flex items-center gap-1 text-xs text-slate-500">📍 {job.location}</span>
        {job.salary !== 'Not disclosed' && (
          <span className="flex items-center gap-1 text-xs text-emerald-400">💰 {job.salary}</span>
        )}
        {job.employmentType && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 capitalize">
            {job.employmentType.replace('_', ' ')}
          </span>
        )}
        {daysAgo !== null && (
          <span className="text-xs text-slate-600">{daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}</span>
        )}
      </div>

      {job.description && (
        <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{job.description}</p>
      )}

      <a
        href={job.applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #00d4ff)' }}
      >
        Apply Now ↗
      </a>
    </div>
  );
}

function NewsCard({ article }) {
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl p-4 transition-all hover:scale-[1.01]"
      style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {article.urlToImage && (
        <img
          src={article.urlToImage}
          alt=""
          className="w-full h-32 object-cover rounded-lg mb-3"
          onError={e => { e.target.style.display = 'none'; }}
        />
      )}
      <h3 className="text-sm font-semibold text-slate-200 leading-snug mb-2 line-clamp-2">{article.title}</h3>
      {article.description && (
        <p className="text-xs text-slate-500 leading-relaxed mb-2 line-clamp-2">{article.description}</p>
      )}
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span>{article.source}</span>
        <span>{date}</span>
      </div>
    </a>
  );
}

function EmptyState({ message }) {
  return (
    <div className="col-span-2 text-center py-12">
      <p className="text-4xl mb-3">📭</p>
      <p className="text-slate-400 text-sm">{message}</p>
    </div>
  );
}

export default function JobFeed() {
  const [tab, setTab] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [news, setNews] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);
  const [jobsError, setJobsError] = useState('');
  const [newsError, setNewsError] = useState('');
  const [role, setRole] = useState('Software Developer');
  const [domain, setDomain] = useState('Technology');
  const [section, setSection] = useState('jobs'); // jobs | news

  useEffect(() => {
    // Get role and domain from cache
    try {
      const sc = JSON.parse(localStorage.getItem('sp_latest_score') || '{}');
      if (sc.score?.role) setRole(sc.score.role);
      const p = JSON.parse(localStorage.getItem('sp_profile') || '{}');
      if (p.category) setDomain(p.category);
    } catch {}
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoadingJobs(true);
    setJobsError('');
    try {
      const res = await axios.get(`${API}/api/jobs`, {
        params: { role, filter: tab },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setJobs(res.data.jobs || []);
      if (!res.data.success) setJobsError(res.data.message || 'Jobs unavailable');
    } catch {
      setJobsError('Failed to load jobs. Check your API key or try again.');
      setJobs([]);
    } finally {
      setLoadingJobs(false);
    }
  }, [role, tab]);

  const fetchNews = useCallback(async () => {
    setLoadingNews(true);
    setNewsError('');
    try {
      const res = await axios.get(`${API}/api/jobs/news`, {
        params: { domain, role },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setNews(res.data.articles || []);
      if (!res.data.success) setNewsError(res.data.message || 'News unavailable');
    } catch {
      setNewsError('Failed to load news. Check your NewsAPI key.');
      setNews([]);
    } finally {
      setLoadingNews(false);
    }
  }, [domain, role]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);
  useEffect(() => { fetchNews(); }, [fetchNews]);

  const Skeleton = () => (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 rounded-xl animate-pulse" style={{ background: '#111827' }} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen pb-20" style={{ background: '#0a0f1e', fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-5xl mx-auto px-4 pt-10">

        {/* Header */}
        <p className="text-xs tracking-widest uppercase text-slate-500 mb-1">Step 10 of 10</p>
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
          Job Feed 💼
        </h1>
        <p className="text-slate-400 text-sm mb-6">Live opportunities and industry news for <span style={{ color: '#00d4ff' }}>{role}</span></p>

        {/* Role override */}
        <div className="flex gap-3 mb-6">
          <input
            value={role}
            onChange={e => setRole(e.target.value)}
            placeholder="Your target role"
            className="flex-1 rounded-lg px-4 py-2 text-sm text-slate-200 outline-none"
            style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <button
            onClick={() => { fetchJobs(); fetchNews(); }}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #00d4ff)' }}
          >
            Search
          </button>
        </div>

        {/* Section toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSection('jobs')}
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: section === 'jobs' ? 'linear-gradient(135deg, #7c3aed, #00d4ff)' : '#111827',
              color: section === 'jobs' ? '#fff' : '#94a3b8',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            💼 Jobs
          </button>
          <button
            onClick={() => setSection('news')}
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: section === 'news' ? 'linear-gradient(135deg, #f59e0b, #f43f5e)' : '#111827',
              color: section === 'news' ? '#fff' : '#94a3b8',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            📰 Industry News
          </button>
        </div>

        {/* Jobs section */}
        {section === 'jobs' && (
          <>
            {/* Filter tabs */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className="flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: tab === t.key ? 'rgba(0,212,255,0.12)' : '#111827',
                    color: tab === t.key ? '#00d4ff' : '#64748b',
                    border: `1px solid ${tab === t.key ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.07)'}`,
                  }}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {loadingJobs ? (
              <Skeleton />
            ) : jobsError ? (
              <div className="rounded-xl p-6 text-center" style={{ background: '#111827', border: '1px solid rgba(244,63,94,0.2)' }}>
                <p className="text-rose-400 text-sm mb-2">⚠️ {jobsError}</p>
                <button onClick={fetchJobs} className="text-xs text-cyan-400 underline">Try again</button>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-slate-400 text-sm">No jobs found for this filter. Try a different tab.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {jobs.map(job => <JobCard key={job.id} job={job} />)}
              </div>
            )}
          </>
        )}

        {/* News section */}
        {section === 'news' && (
          <>
            <p className="text-xs text-slate-500 mb-4">
              Showing industry news for <span style={{ color: '#f59e0b' }}>{domain}</span>
            </p>
            {loadingNews ? (
              <Skeleton />
            ) : newsError ? (
              <div className="rounded-xl p-6 text-center" style={{ background: '#111827', border: '1px solid rgba(244,63,94,0.2)' }}>
                <p className="text-rose-400 text-sm mb-2">⚠️ {newsError}</p>
                <button onClick={fetchNews} className="text-xs text-cyan-400 underline">Try again</button>
              </div>
            ) : news.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">📰</p>
                <p className="text-slate-400 text-sm">No news articles found. Try refreshing.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {news.map((article, i) => <NewsCard key={i} article={article} />)}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
