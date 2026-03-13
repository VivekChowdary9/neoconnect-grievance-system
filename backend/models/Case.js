const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: String,
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  addedAt: { type: Date, default: Date.now }
});

const caseSchema = new mongoose.Schema(
  {
    trackingId: { type: String, unique: true },
    category: {
      type: String,
      enum: ['Safety', 'Policy', 'Facilities', 'HR', 'Other'],
      required: true
    },
    department: { type: String, required: true },
    location: { type: String },
    severity: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['New', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Escalated'],
      default: 'New'
    },
    anonymous: { type: Boolean, default: false },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    fileUrl: { type: String, default: null },
    notes: [noteSchema],
    actionTaken: { type: String, default: '' },
    result: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Case', caseSchema);
