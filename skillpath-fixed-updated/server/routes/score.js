const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getLatestScore,
  getAllScores,
  getWeakSkillResources,
  updateSkillsCount,
} = require('../controllers/scoreController');

router.get('/latest', protect, getLatestScore);
router.get('/all', protect, getAllScores);
router.post('/weak-resources', protect, getWeakSkillResources);
router.patch('/:id/skills-count', protect, updateSkillsCount);

module.exports = router;
