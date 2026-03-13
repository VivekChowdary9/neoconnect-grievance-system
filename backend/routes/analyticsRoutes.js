const express = require('express');
const router = express.Router();
const { getCaseAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/cases', protect, authorize('admin', 'secretariat'), getCaseAnalytics);

module.exports = router;
