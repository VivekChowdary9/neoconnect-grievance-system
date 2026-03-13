const Case = require('../models/Case');

const getCaseAnalytics = async (req, res) => {
  try {
    const byDepartment = await Case.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } }
    ]);

    const byCategory = await Case.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } }
    ]);

    const byStatus = await Case.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } }
    ]);

    // Hotspot: 5+ cases from same dept+category
    const hotspots = await Case.aggregate([
      {
        $group: {
          _id: { department: '$department', category: '$category' },
          count: { $sum: 1 }
        }
      },
      { $match: { count: { $gte: 5 } } },
      {
        $project: {
          department: '$_id.department',
          category: '$_id.category',
          count: 1,
          _id: 0
        }
      }
    ]);

    const total = await Case.countDocuments();
    const resolved = await Case.countDocuments({ status: 'Resolved' });
    const escalated = await Case.countDocuments({ status: 'Escalated' });

    res.json({ byDepartment, byCategory, byStatus, hotspots, total, resolved, escalated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCaseAnalytics };
