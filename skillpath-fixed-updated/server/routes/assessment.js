const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  generateAssessment,
  startAssessment,
  submitAssessment,
  getLatestAssessment,
  generateSkillMCQ,
} = require('../controllers/assessmentController');

router.post('/generate', protect, generateAssessment);
router.post('/skill-mcq', protect, generateSkillMCQ);
router.patch('/:id/start', protect, startAssessment);
router.post('/:id/submit', protect, submitAssessment);
router.get('/latest', protect, getLatestAssessment);

module.exports = router;

// DELETE all pending/in-progress assessments for user (for retake)
router.delete('/', protect, async (req, res) => {
  try {
    const Assessment = require('../models/Assessment');
    await Assessment.deleteMany({ userId: req.user.id, status: { $in: ['pending', 'in-progress'] } });
    res.json({ success: true, message: 'Assessment cleared for retake.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear assessment.' });
  }
});
