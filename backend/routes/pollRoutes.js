const express = require('express');
const router = express.Router();
const { createPoll, getPolls, votePoll } = require('../controllers/pollController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('secretariat', 'admin'), createPoll);
router.get('/', protect, getPolls);
router.post('/vote', protect, votePoll);

module.exports = router;
