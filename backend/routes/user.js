const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/', protect, restrictTo('ADMIN'), async (req, res) => {
  try {
    const users = await User.find({ role: 'MEMBER' }).select('name email');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
