const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const axios = require('axios');

// GET /api/jobs?role=Frontend Developer&filter=all|remote|india|internship
router.get('/', protect, async (req, res) => {
  try {
    const { role = 'Software Developer', filter = 'all' } = req.query;

    let query = `${role} fresher`;
    if (filter === 'remote') query += ' remote';
    if (filter === 'india') query += ' India';
    if (filter === 'internship') query = `${role} internship`;

    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/search',
      params: {
        query,
        page: '1',
        num_b: '10',
        date_posted: 'month',
        employment_types: filter === 'internship' ? 'INTERN' : undefined,
        remote_jobs_only: filter === 'remote' ? 'true' : undefined,
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
    };

    // Remove undefined params
    Object.keys(options.params).forEach(k => options.params[k] === undefined && delete options.params[k]);

    const response = await axios.request(options);
    const jobs = (response.data.data || []).map(job => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city ? `${job.job_city}, ${job.job_country}` : job.job_country || 'Not specified',
      isRemote: job.job_is_remote,
      salary: job.job_min_salary
        ? `${job.job_salary_currency || '$'}${job.job_min_salary} – ${job.job_max_salary}`
        : 'Not disclosed',
      postedDate: job.job_posted_at_datetime_utc,
      applyUrl: job.job_apply_link,
      description: job.job_description?.slice(0, 300) + '...',
      employmentType: job.job_employment_type,
    }));

    res.json({ success: true, jobs });
  } catch (err) {
    console.error('Jobs API error:', err.message);
    // Graceful fallback
    res.json({
      success: false,
      jobs: [],
      message: 'Job feed temporarily unavailable. Please try again later.',
    });
  }
});

// GET /api/jobs/news?domain=Coding&role=Frontend Developer
router.get('/news', protect, async (req, res) => {
  try {
    const { domain = 'Technology', role = 'developer' } = req.query;
    const query = encodeURIComponent(`${domain} ${role} jobs hiring freshers`);
const apiKey = process.env.GNEWS_API_KEY;

const response = await axios.get(
  `https://gnews.io/api/v4/search?q=${query}&lang=en&max=10&sortby=publishedAt&token=${apiKey}`
);

const articles = (response.data.articles || [])
  .filter(a => a.title && a.url)
  .map(a => ({
    title: a.title,
    source: a.source?.name,
    publishedAt: a.publishedAt,
    url: a.url,
    description: a.description?.slice(0, 200),
    urlToImage: a.image,
  }));

    res.json({ success: true, articles });
  } catch (err) {
    console.error('News API error:', err.message);
    res.json({
      success: false,
      articles: [],
      message: 'News feed temporarily unavailable.',
    });
  }
});

module.exports = router;
