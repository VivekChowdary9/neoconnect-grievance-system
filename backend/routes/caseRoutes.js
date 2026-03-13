const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createCase,
  getCases,
  getCaseById,
  updateCase,
  deleteCase,
  assignCase
} = require('../controllers/caseController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|pdf/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only images and PDFs are allowed'));
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.post('/', protect, upload.single('file'), createCase);
router.get('/', protect, getCases);
router.get('/:id', protect, getCaseById);
router.put('/:id', protect, authorize('case_manager', 'secretariat', 'admin'), updateCase);
router.delete('/:id', protect, authorize('admin'), deleteCase);
router.put('/assign/:id', protect, authorize('secretariat', 'admin'), assignCase);

module.exports = router;
