const express = require('express');
const router = express.Router();
const { saveDomain, getDomain } = require('../controllers/domainController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, saveDomain);
router.get('/', protect, getDomain);

module.exports = router;
