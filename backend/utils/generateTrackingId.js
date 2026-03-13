const Case = require('../models/Case');

const generateTrackingId = async () => {
  const year = new Date().getFullYear();
  const count = await Case.countDocuments();
  const seq = String(count + 1).padStart(3, '0');
  return `NEO-${year}-${seq}`;
};

module.exports = generateTrackingId;
