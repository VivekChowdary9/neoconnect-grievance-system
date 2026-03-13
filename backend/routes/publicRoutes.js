const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Minutes = require('../models/Minutes');
const Update = require('../models/Update');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Minutes
router.post('/minutes', protect, authorize('secretariat', 'admin'), upload.single('file'), async (req, res) => {
  try {
    const { title, date } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const minutes = await Minutes.create({ title, fileUrl, date, uploadedBy: req.user._id });
    res.status(201).json(minutes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/minutes', protect, async (req, res) => {
  try {
    const minutes = await Minutes.find().sort({ date: -1 });
    res.json(minutes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Updates/Announcements
router.post('/updates', protect, authorize('secretariat', 'admin'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const update = await Update.create({ title, description, createdBy: req.user._id });
    res.status(201).json(update);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/updates', protect, async (req, res) => {
  try {
    const updates = await Update.find().sort({ date: -1 });
    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
