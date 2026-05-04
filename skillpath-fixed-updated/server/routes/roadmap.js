const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  generateRoadmap,
  getRoadmap,
  markSkill,
  deleteRoadmap,
  getSkillResources,
  markLearned,
} = require('../controllers/roadmapController');

router.post('/generate', protect, generateRoadmap);
router.get('/', protect, getRoadmap);
router.patch('/mark', protect, markSkill);
router.patch('/learn', protect, markLearned);
router.post('/skill-resources', protect, getSkillResources);
router.delete('/', protect, deleteRoadmap);

// Gap analysis save
router.patch('/:id/gap-analysis', protect, async (req, res) => {
  try {
    const Roadmap = require('../models/Roadmap');
    const { skillsForRoadmap, overallScore, needsFullRoadmap } = req.body;
    await Roadmap.findByIdAndUpdate(req.params.id, {
      $set: { skillsForRoadmap, gapAnalysisScore: overallScore, needsFullRoadmap, gapAnalyzedAt: new Date() }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save gap analysis' });
  }
});

module.exports = router;
