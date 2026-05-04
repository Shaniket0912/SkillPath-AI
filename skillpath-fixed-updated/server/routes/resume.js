const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateResume, getResume } = require('../controllers/resumeController');

router.post('/generate', protect, generateResume);
router.get('/', protect, getResume);

module.exports = router;
