const Domain = require('../models/Domain');

// @desc    Save or update user's selected domain & sub-role
// @route   POST /api/domain
// @access  Private
const saveDomain = async (req, res) => {
  try {
    const { category, subRole } = req.body;

    if (!category || !subRole) {
      return res.status(400).json({ message: 'Category and sub-role are required.' });
    }

    const validCategories = [
      'Coding & Development',
      'Tools & Tech',
      'Management & Business',
      'Design & Creative',
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category.' });
    }

    const domain = await Domain.findOneAndUpdate(
      { userId: req.user.id },
      { category, subRole, selectedAt: Date.now() },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ message: 'Domain saved successfully.', domain });
  } catch (err) {
    console.error('saveDomain error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Get user's selected domain
// @route   GET /api/domain
// @access  Private
const getDomain = async (req, res) => {
  try {
    const domain = await Domain.findOne({ userId: req.user.id });
    if (!domain) {
      return res.status(404).json({ message: 'No domain selected yet.' });
    }
    res.status(200).json({ domain });
  } catch (err) {
    console.error('getDomain error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { saveDomain, getDomain };
