const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Profile = require('../models/Profile');
const User = require('../models/User');

// GET /api/profile
router.get('/', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate('user', '-password');
    const user = await User.findById(req.user._id).select('-password');
    res.json({ profile, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/profile
router.put('/', protect, async (req, res) => {
  try {
    const { bio, skills, linkedinUrl, portfolioUrl, targetRole, experience } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { bio, skills, linkedinUrl, portfolioUrl, targetRole, experience },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
