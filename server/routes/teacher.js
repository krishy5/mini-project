const express = require('express');
const TeacherProfile = require('../models/TeacherProfile');
const { authMiddleware } = require('./middleware');

const router = express.Router();

// Get teacher profile
router.get('/:teacher_id', authMiddleware, async (req, res) => {
  try {
    const profile = await TeacherProfile.findOne({ teacher_id: req.params.teacher_id });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Create or update teacher profile
router.put('/:teacher_id', authMiddleware, async (req, res) => {
  try {
    const profile = await TeacherProfile.findOneAndUpdate(
      { teacher_id: req.params.teacher_id },
      { ...req.body, updated_at: new Date() },
      { upsert: true, new: true }
    );
    res.json(profile);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
